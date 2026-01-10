from fastapi.testclient import TestClient
from backend.src.main import app
import pytest

client = TestClient(app)

def test_task_crud_workflow():
    """
    Test the complete CRUD workflow for tasks.
    """
    # 1. Create a task
    task_data = {
        "title": "Integration test task",
        "description": "This task is for integration testing",
        "completed": False
    }
    create_response = client.post("/api/v1/tasks/", json=task_data)
    assert create_response.status_code == 201
    created_task = create_response.json()
    assert created_task["title"] == "Integration test task"
    assert created_task["description"] == "This task is for integration testing"
    assert created_task["completed"] is False
    task_id = created_task["id"]

    # 2. Read all tasks
    read_all_response = client.get("/api/v1/tasks/")
    assert read_all_response.status_code == 200
    tasks_list = read_all_response.json()
    assert len(tasks_list) >= 1
    assert any(task["id"] == task_id for task in tasks_list)

    # 3. Read specific task
    read_one_response = client.get(f"/api/v1/tasks/{task_id}")
    assert read_one_response.status_code == 200
    read_task = read_one_response.json()
    assert read_task["id"] == task_id
    assert read_task["title"] == "Integration test task"

    # 4. Update the task
    update_data = {
        "title": "Updated integration test task",
        "completed": True
    }
    update_response = client.put(f"/api/v1/tasks/{task_id}", json=update_data)
    assert update_response.status_code == 200
    updated_task = update_response.json()
    assert updated_task["title"] == "Updated integration test task"
    assert updated_task["completed"] is True

    # 5. Delete the task
    delete_response = client.delete(f"/api/v1/tasks/{task_id}")
    assert delete_response.status_code == 200

    # 6. Verify the task is deleted
    verify_response = client.get(f"/api/v1/tasks/{task_id}")
    assert verify_response.status_code == 404