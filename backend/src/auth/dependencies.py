from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.exc import NoResultFound
from backend.src.auth.jwt_handler import get_current_user_payload
from backend.src.models.user import User
from sqlmodel import Session, select
from backend.src.database.engine import get_session
from typing import Generator

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Dependency to get the current user from the JWT token.

    This function extracts the user information from the JWT token and returns
    the corresponding User object from the database.
    """
    token = credentials.credentials

    try:
        payload = get_current_user_payload(token)
        user_id: int = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials: no user ID in token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user from database
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception:
        # For any other exception during token validation
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency to get the current active user.

    This extends get_current_user to also check if the user is active.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user