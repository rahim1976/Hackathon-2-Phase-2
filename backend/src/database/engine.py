from sqlmodel import create_engine
import os
from dotenv import load_dotenv

def get_engine():
    """
    Get the database engine based on current environment variables.
    This allows the engine to be reinitialized when environment variables change.
    """
    # Load environment variables from both root and backend directories
    load_dotenv(".env")  # Root directory
    load_dotenv("backend/.env")  # Backend directory

    # Get database URL from environment variable - check if it was set in os.environ first
    DATABASE_URL = os.environ.get("DATABASE_URL") or os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        # For testing purposes, use SQLite as fallback
        DATABASE_URL = "sqlite:///./todo_app.db"
        print("WARNING: DATABASE_URL not set, using SQLite fallback for testing")
    else:
        # Remove quotes if they exist around the DATABASE_URL (as in the example)
        DATABASE_URL = DATABASE_URL.strip("'\"")

    # Create the database engine
    # Use different engine configurations based on database type
    if DATABASE_URL.startswith("postgresql"):
        # For PostgreSQL, we might need additional parameters
        return create_engine(DATABASE_URL, echo=False)
    elif DATABASE_URL.startswith("sqlite"):
        return create_engine(DATABASE_URL, echo=False)
    else:
        return create_engine(DATABASE_URL, echo=False)

# Create the default engine
engine = get_engine()

def get_new_engine():
    """
    Create a fresh engine instance based on current environment variables.
    Used for testing scenarios where environment variables may change.
    """
    # Load environment variables from both root and backend directories
    load_dotenv(".env")  # Root directory
    load_dotenv("backend/.env")  # Backend directory

    # Get database URL from environment variable - check if it was set in os.environ first
    DATABASE_URL = os.environ.get("DATABASE_URL") or os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        # For testing purposes, use SQLite as fallback
        DATABASE_URL = "sqlite:///./test_todo_app.db"  # Use different DB file for tests
    else:
        # Remove quotes if they exist around the DATABASE_URL (as in the example)
        DATABASE_URL = DATABASE_URL.strip("'\"")

    # Create the database engine
    if DATABASE_URL.startswith("postgresql"):
        return create_engine(DATABASE_URL, echo=False)
    elif DATABASE_URL.startswith("sqlite"):
        return create_engine(DATABASE_URL, echo=False)
    else:
        return create_engine(DATABASE_URL, echo=False)