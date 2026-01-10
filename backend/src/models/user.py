from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=255)

class User(UserBase, table=True):
    """
    User model representing a user in the system.

    According to the spec, each task is associated with a user_id to ensure proper data scoping.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = Field(default=None, max_length=255)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    is_active: bool = Field(default=True)