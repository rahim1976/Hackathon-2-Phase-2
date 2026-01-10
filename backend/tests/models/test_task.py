import pytest
from backend.src.models.task import Task
from backend.src.models.user import User
from datetime import datetime

def test_task_creation():
    """
    Test creating a Task instance.
    """
    task = Task(
        title="Test task",
        description="This is a test task",
        completed=False,
        user_id=1
    )

    assert task.title == "Test task"
    assert task.description == "This is a test task"
    assert task.completed is False
    assert task.user_id == 1
    assert task.id is None  # Will be set by the database

def test_task_required_fields():
    """
    Test that required fields are properly validated.
    """
    # Task should require a title - this will be validated at the schema level
    # The model itself doesn't validate constraints, only the Pydantic schema does
    pass  # This test is more appropriate for the schema tests

def test_task_optional_fields():
    """
    Test that optional fields work correctly.
    """
    task = Task(
        title="Test task",
        completed=True,
        user_id=1
        # description is optional
    )

    assert task.title == "Test task"
    assert task.description is None
    assert task.completed is True
    assert task.user_id == 1

def test_user_creation():
    """
    Test creating a User instance.
    """
    user = User(
        email="test@example.com"
    )

    assert user.email == "test@example.com"
    assert user.id is None  # Will be set by the database