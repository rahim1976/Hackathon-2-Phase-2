from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from backend.src.models.task import Task
from backend.src.schemas.task import TaskCreate, TaskRead, TaskUpdate
from backend.src.api.deps import get_session
from backend.src.auth.dependencies import get_current_user
from backend.src.models.user import User

router = APIRouter()

@router.post("/", response_model=TaskRead, status_code=201)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Create a new task for the authenticated user.
    """
    task_data = task.model_dump()
    task_data['user_id'] = current_user.id
    db_task = Task(**task_data)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskRead])
def read_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Retrieve all tasks for the authenticated user.
    """
    statement = select(Task).where(Task.user_id == current_user.id)
    tasks = session.exec(statement).all()
    return tasks

@router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Retrieve a specific task by ID for the authenticated user.
    """
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user.id)
    task = session.exec(statement).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, task_update: TaskUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Update a specific task by ID for the authenticated user.
    """
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user.id)
    db_task = session.exec(statement).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task with the provided values
    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Delete a specific task by ID for the authenticated user.
    """
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == current_user.id)
    db_task = session.exec(statement).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(db_task)
    session.commit()
    return {"ok": True}