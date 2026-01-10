from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class TaskBase(SQLModel):
    title: str = Field(nullable=False, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: int = Field(nullable=False, foreign_key="user.id")

class Task(TaskBase, table=True):
    """
    Task model representing a user's to-do item.

    Each task is associated with a user_id to ensure proper data scoping.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to user (optional - we may not need it for basic functionality)
    # user: Optional["User"] = Relationship(back_populates="tasks")