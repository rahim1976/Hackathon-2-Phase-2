from datetime import datetime, timedelta
from typing import Optional
import os
import re
from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..models.user import User
from sqlmodel import Session, select

# Initialize password hashing context with schemes that avoid bcrypt initialization issues
# Using pbkdf2_sha256 as primary (more secure) and sha256_crypt as secondary
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "sha256_crypt", "bcrypt"], deprecated="auto")

# Get JWT configuration from environment
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-default-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)


def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()

    if not user or not verify_password(password, user.hashed_password):
        return None

    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a new access token with the given data."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify a JWT token and return the payload."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Validate required fields in the payload
        if "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing user identifier (sub)",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if "email" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing user email",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Validate that sub is a valid user ID (string representation of an integer)
        try:
            user_id = int(payload["sub"])
            if user_id <= 0:
                raise ValueError("Invalid user ID")
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user identifier in token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Validate email format
        email = payload["email"]
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email format in token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def create_user_with_token(session: Session, email: str, password: str, name: Optional[str] = None) -> tuple[User, str]:
    """
    Create a new user and return the user object with an access token.

    Args:
        session: Database session
        email: User's email
        password: User's plaintext password
        name: User's optional name

    Returns:
        Tuple of (User object, access token)
    """
    # Check if user already exists
    statement = select(User).where(User.email == email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise ValueError(f"User with email {email} already exists")

    # Hash the password
    hashed_password = get_password_hash(password)

    # Create new user
    db_user = User(
        email=email,
        name=name,
        hashed_password=hashed_password,
        is_active=True
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email},
        expires_delta=access_token_expires
    )

    return db_user, access_token


def get_current_user_payload(token: str) -> dict:
    """Get the current user's payload from the token."""
    payload = verify_token(token)

    # Check if token has expired
    exp = payload.get("exp")
    if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload