import os
from sqlmodel import SQLModel, create_engine
from models.user import User
from models.task import Task
from database.engine import get_new_engine

def initialize_database():
    """
    Initialize the database by creating all tables with the correct schema.
    """
    print("Initializing database with correct schema...")

    # Get the engine with proper Neon configuration
    engine = get_new_engine()

    # Create all tables based on the current models
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")

    # Verify tables exist
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables in database: {tables}")

    if 'user' in tables:
        columns = inspector.get_columns('user')
        column_names = [col['name'] for col in columns]
        print(f"User table columns: {column_names}")

    if 'task' in tables:
        columns = inspector.get_columns('task')
        column_names = [col['name'] for col in columns]
        print(f"Task table columns: {column_names}")

if __name__ == "__main__":
    initialize_database()