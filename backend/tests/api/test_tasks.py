from fastapi.testclient import TestClient
from backend.src.main import app
import pytest

client = TestClient(app)

def test_create_task():
    """
    Test creating a new task.
    """
    task_data = {
        "title": "Test task",
        "description": "This is a test task",
        "completed": False
    }
    response = client.post("/api/v1/tasks/", json=task_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test task"
    assert data["description"] == "This is a test task"
    assert data["completed"] is False
    assert "id" in data
    assert "user_id" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_read_tasks():
    """
    Test reading all tasks.
    """
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_read_task():
    """
    Test reading a specific task.
    """
    # First create a task
    task_data = {
        "title": "Test task for reading",
        "description": "This is a test task for reading",
        "completed": False
    }
    create_response = client.post("/api/v1/tasks/", json=task_data)
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Now read the task
    response = client.get(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test task for reading"
    assert data["description"] == "This is a test task for reading"

def test_update_task():
    """
    Test updating a task.
    """
    # First create a task
    task_data = {
        "title": "Test task for updating",
        "description": "This is a test task for updating",
        "completed": False
    }
    create_response = client.post("/api/v1/tasks/", json=task_data)
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Now update the task
    update_data = {
        "title": "Updated task title",
        "completed": True
    }
    response = client.put(f"/api/v1/tasks/{task_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated task title"
    assert data["completed"] is True

def test_delete_task():
    """
    Test deleting a task.
    """
    # First create a task
    task_data = {
        "title": "Test task for deletion",
        "description": "This is a test task for deletion",
        "completed": False
    }
    create_response = client.post("/api/v1/tasks/", json=task_data)
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Now delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200

    # Verify the task is gone
    get_response = client.get(f"/api/v1/tasks/{task_id}")
    assert get_response.status_code == 404