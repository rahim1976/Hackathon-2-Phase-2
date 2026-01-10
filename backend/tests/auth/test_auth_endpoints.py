import pytest
from fastapi.testclient import TestClient
from backend.src.main import app
from backend.src.database.engine import get_session, get_new_engine
from backend.src.models.user import User
from sqlmodel import SQLModel, Session, create_engine
from backend.src.auth.jwt_handler import get_password_hash


@pytest.fixture(name="client")
def client_fixture():
    # Use an in-memory SQLite database for testing
    engine = create_engine("sqlite:///./test.db", echo=True)

    # Create tables
    SQLModel.metadata.create_all(engine)

    def get_test_session():
        with Session(engine) as session:
            yield session

    # Override the dependency
    app.dependency_overrides[get_session] = get_test_session

    with TestClient(app) as test_client:
        yield test_client

    # Clean up
    app.dependency_overrides.clear()


def test_register_new_user(client):
    """Test registering a new user successfully."""
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=user_data)

    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == user_data["email"]


def test_register_existing_user(client):
    """Test registering a user that already exists."""
    # First, register a user
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    # Register the user first
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 201

    # Try to register the same user again
    response = client.post("/auth/register", json=user_data)

    assert response.status_code == 409  # Conflict
    assert "already exists" in response.json()["detail"].lower()


def test_register_invalid_data(client):
    """Test registering with invalid data."""
    # Test with invalid email
    user_data = {
        "email": "invalid-email",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=user_data)

    assert response.status_code == 422  # Unprocessable Entity


def test_login_valid_credentials(client):
    """Test logging in with valid credentials."""
    # First, register a user
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 201

    # Now try to log in
    login_data = {
        "email": "test@example.com",
        "password": "securepassword123"
    }

    response = client.post("/auth/login", json=login_data)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == user_data["email"]


def test_login_invalid_credentials(client):
    """Test logging in with invalid credentials."""
    # First, register a user
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 201

    # Now try to log in with wrong password
    login_data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }

    response = client.post("/auth/login", json=login_data)

    assert response.status_code == 401  # Unauthorized


def test_logout(client):
    """Test logging out."""
    # First, register a user
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 201

    # Log in to get a token
    login_data = {
        "email": "test@example.com",
        "password": "securepassword123"
    }

    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Try to access a protected endpoint with the token
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    # Log out (currently just a placeholder - logout functionality in JWT is typically stateless)
    response = client.post("/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200


def test_get_current_user(client):
    """Test getting current user with valid token."""
    # First, register a user
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 201

    # Log in to get a token
    login_data = {
        "email": "test@example.com",
        "password": "securepassword123"
    }

    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Get current user with the token
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    user_data = response.json()
    assert user_data["email"] == "test@example.com"