import pytest
from datetime import timedelta
from jose import jwt
from backend.src.auth.jwt_handler import (
    create_access_token,
    verify_token,
    get_current_user_payload,
    verify_password,
    get_password_hash,
    authenticate_user
)
from backend.src.models.user import User
from backend.src.database.engine import get_session
from sqlmodel import Session, create_engine, SQLModel
from unittest.mock import Mock
import os


def test_create_and_verify_token():
    """Test creating and verifying a JWT token."""
    data = {"sub": 1, "email": "test@example.com"}

    # Create token
    token = create_access_token(data=data)

    # Verify token
    payload = verify_token(token)

    assert payload["sub"] == 1
    assert payload["email"] == "test@example.com"


def test_token_expires():
    """Test that tokens expire properly."""
    data = {"sub": 1, "email": "test@example.com"}

    # Create token that expires in 1 second
    expires_delta = timedelta(seconds=1)
    token = create_access_token(data=data, expires_delta=expires_delta)

    # Verify token immediately (should work)
    payload = verify_token(token)
    assert payload["sub"] == 1

    # Wait for expiration
    import time
    time.sleep(2)  # Wait 2 seconds to ensure token has expired

    # Try to verify expired token (this should raise an exception)
    with pytest.raises(Exception):
        verify_token(token)


def test_get_current_user_payload():
    """Test getting current user payload from token."""
    data = {"sub": 1, "email": "test@example.com"}

    token = create_access_token(data=data)
    payload = get_current_user_payload(token)

    assert payload["sub"] == 1
    assert payload["email"] == "test@example.com"


def test_password_hashing():
    """Test password hashing and verification."""
    password = "securepassword123"

    # Hash password
    hashed = get_password_hash(password)

    # Verify password
    assert verify_password(password, hashed)
    assert not verify_password("wrongpassword", hashed)


def test_authenticate_user_success():
    """Test successful user authentication."""
    # Create a mock session and user for testing
    user = User(
        id=1,
        email="test@example.com",
        hashed_password=get_password_hash("securepassword123")
    )

    # Create a mock session that returns our test user
    mock_session = Mock(spec=Session)
    mock_statement = Mock()
    mock_exec_result = Mock()

    # Mock the select query and execution
    def mock_select_side_effect(*args, **kwargs):
        return mock_statement

    def mock_exec_side_effect(stmt):
        mock_exec_result.first.return_value = user
        return mock_exec_result

    # Apply mocks
    import backend.src.auth.jwt_handler as jwt_handler_module
    original_select = jwt_handler_module.select
    original_session_exec = lambda s, stmt: mock_exec_result

    # Temporarily replace select with mock
    jwt_handler_module.select = Mock(return_value=mock_statement)
    mock_session.exec = mock_exec_side_effect

    # Test authentication
    authenticated_user = authenticate_user(mock_session, "test@example.com", "securepassword123")

    assert authenticated_user is not None
    assert authenticated_user.email == "test@example.com"

    # Restore original select
    jwt_handler_module.select = original_select


def test_authenticate_user_failure_wrong_password():
    """Test user authentication failure with wrong password."""
    # Create a mock session and user for testing
    user = User(
        id=1,
        email="test@example.com",
        hashed_password=get_password_hash("securepassword123")
    )

    # Create a mock session that returns our test user
    mock_session = Mock(spec=Session)
    mock_statement = Mock()
    mock_exec_result = Mock()

    # Apply mocks
    import backend.src.auth.jwt_handler as jwt_handler_module
    original_select = jwt_handler_module.select
    original_session_exec = lambda s, stmt: mock_exec_result

    # Temporarily replace select with mock
    jwt_handler_module.select = Mock(return_value=mock_statement)
    mock_session.exec = lambda stmt: mock_exec_result.first.return_value if hasattr(mock_exec_result, 'first') else mock_exec_result

    # Set up the mock to return the user
    mock_exec_result.first.return_value = user

    # Test authentication with wrong password
    authenticated_user = authenticate_user(mock_session, "test@example.com", "wrongpassword")

    assert authenticated_user is None

    # Restore original select
    jwt_handler_module.select = original_select


def test_authenticate_user_failure_nonexistent_user():
    """Test user authentication failure with non-existent user."""
    # Create a mock session that returns None (no user found)
    mock_session = Mock(spec=Session)
    mock_statement = Mock()
    mock_exec_result = Mock()

    # Apply mocks
    import backend.src.auth.jwt_handler as jwt_handler_module
    original_select = jwt_handler_module.select

    # Temporarily replace select with mock
    jwt_handler_module.select = Mock(return_value=mock_statement)
    mock_session.exec = lambda stmt: mock_exec_result.first.return_value if hasattr(mock_exec_result, 'first') else mock_exec_result

    # Set up the mock to return None (user not found)
    mock_exec_result.first.return_value = None

    # Test authentication with non-existent user
    authenticated_user = authenticate_user(mock_session, "nonexistent@example.com", "any_password")

    assert authenticated_user is None

    # Restore original select
    jwt_handler_module.select = original_select