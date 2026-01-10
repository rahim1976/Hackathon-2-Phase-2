import pytest
from fastapi.testclient import TestClient
from backend.src.main import app
from backend.src.database.engine import get_new_engine
from backend.src.models.user import User
from backend.src.models.task import Task
from sqlmodel import SQLModel
import os

# Set environment for testing
os.environ["DATABASE_URL"] = "sqlite:///./test_todo_app.db"

@pytest.fixture
def client():
    # Create a fresh engine for testing with the environment variable set
    test_engine = get_new_engine()
    # Create all tables for testing
    SQLModel.metadata.create_all(bind=test_engine)
    with TestClient(app) as test_client:
        yield test_client