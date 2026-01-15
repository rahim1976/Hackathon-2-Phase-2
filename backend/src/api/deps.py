from sqlmodel import Session
from ..database.engine import get_new_engine
from fastapi import Depends

def get_session():
    """
    Dependency to get a database session.

    This function provides a database session for use in API endpoints.
    """
    engine = get_new_engine()
    with Session(engine) as session:
        yield session