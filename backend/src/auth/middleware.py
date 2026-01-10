from fastapi import Request, HTTPException, status
from fastapi.security.http import HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from backend.src.auth.jwt_handler import verify_token
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Authentication middleware to verify JWT tokens for protected routes.

    This middleware checks for JWT tokens in the Authorization header and validates them.
    It's designed to work alongside FastAPI's dependency system for more granular control.
    """

    async def dispatch(self, request: Request, call_next):
        # Log the request path for debugging
        logger.debug(f"Processing request: {request.method} {request.url.path}")

        # For public routes, skip authentication
        public_paths = ["/", "/health", "/docs", "/redoc", "/openapi.json"]

        # Check if the path starts with any public path
        is_public_route = any(request.url.path.startswith(path) for path in public_paths)

        # Check if the path starts with /auth (these are authentication endpoints)
        is_auth_route = request.url.path.startswith("/auth")

        # If it's a public route or auth route, don't require authentication
        if is_public_route or is_auth_route:
            response = await call_next(request)
            return response

        # For protected routes, check for authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            logger.warning(f"Unauthorized access attempt to {request.url.path}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify the token format (should be "Bearer <token>")
        if not auth_header.lower().startswith("bearer "):
            logger.warning(f"Invalid authorization header format: {auth_header}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = auth_header[7:].strip()  # Remove "Bearer " prefix

        try:
            # Verify the token
            payload = verify_token(token)
            # Add user info to request state for potential use by other components
            request.state.user_id = payload.get("sub")
            request.state.user_email = payload.get("email")

            logger.info(f"Authenticated user {payload.get('sub')} for {request.url.path}")
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            logger.warning(f"Token verification failed for {request.url.path}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        response = await call_next(request)
        return response


def get_user_from_token(authorization: str) -> Optional[dict]:
    """
    Helper function to extract user information from an authorization header.

    Args:
        authorization: The Authorization header value

    Returns:
        User information dictionary if valid, None otherwise
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        return None

    token = authorization[7:].strip()
    try:
        return verify_token(token)
    except Exception:
        return None