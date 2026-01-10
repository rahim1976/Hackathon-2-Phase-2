from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
from datetime import timedelta
import re

from backend.src.models.user import User, UserBase
from backend.src.database.engine import get_session
from backend.src.auth.jwt_handler import (
    authenticate_user,
    create_access_token,
    get_password_hash
)
from backend.src.main import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.src.auth.dependencies import get_current_user
from backend.src.schemas.user import UserCreate, UserResponse, UserLogin

router = APIRouter()


@router.post("/register", response_model=dict, status_code=201)
async def register_user(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user with email and password.

    Creates a new user account and returns a JWT token for authentication.
    """
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format"
        )

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email {user_data.email} already exists"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        # Include name if provided
        **({'name': user_data.name} if hasattr(user_data, 'name') and user_data.name else {})
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  # Use config value
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "created_at": db_user.created_at,
            "updated_at": db_user.updated_at
        }
    }


@router.post("/login", response_model=dict)
async def login_user(
    user_credentials: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token.

    Validates user credentials and returns a JWT token for subsequent requests.
    """
    user = authenticate_user(session, user_credentials.email, user_credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    }


@router.post("/logout")
async def logout_user():
    """
    Logout user (placeholder for stateless JWT).

    In a stateless JWT system, the client typically just removes the token.
    This endpoint can be used for future stateful token blacklisting.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user's profile information.

    Requires a valid JWT token in the Authorization header.
    """
    return current_user