from sqlmodel import create_engine
import os
from dotenv import load_dotenv

def get_engine():
    """
    Get the database engine based on current environment variables.
    This allows the engine to be reinitialized when environment variables change.
    """
    # Load environment variables from both root and backend directories
    # Use absolute paths to ensure .env files are found
    import pathlib
    project_root = pathlib.Path(__file__).parent.parent.parent.parent  # Go to project root
    root_env = project_root / ".env"
    backend_env = project_root / "backend" / ".env"

    if root_env.exists():
        load_dotenv(str(root_env))
    if backend_env.exists():
        load_dotenv(str(backend_env))

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
        # For PostgreSQL/Neon, use proper connection parameters
        from sqlalchemy import create_engine as sqlalchemy_create_engine
        return sqlalchemy_create_engine(
            DATABASE_URL,
            echo=False,
            pool_pre_ping=True,  # Verify connections before use
            pool_recycle=300,    # Recycle connections every 5 minutes
            connect_args={
                "sslmode": "require",  # Ensure SSL is used for Neon
            }
        )
    elif DATABASE_URL.startswith("sqlite"):
        return create_engine(DATABASE_URL, echo=False)
    else:
        from sqlalchemy import create_engine as sqlalchemy_create_engine
        return sqlalchemy_create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

# Create the default engine
engine = get_engine()

def get_new_engine():
    """
    Create a fresh engine instance based on current environment variables.
    Used for testing scenarios where environment variables may change.
    """
    # Load environment variables from both root and backend directories
    # Use absolute paths to ensure .env files are found
    import pathlib
    project_root = pathlib.Path(__file__).parent.parent.parent.parent  # Go to project root
    root_env = project_root / ".env"
    backend_env = project_root / "backend" / ".env"

    if root_env.exists():
        load_dotenv(str(root_env))
    if backend_env.exists():
        load_dotenv(str(backend_env))

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
        # For PostgreSQL/Neon, use proper connection parameters
        from sqlalchemy import create_engine as sqlalchemy_create_engine
        return sqlalchemy_create_engine(
            DATABASE_URL,
            echo=False,
            pool_pre_ping=True,  # Verify connections before use
            pool_recycle=300,    # Recycle connections every 5 minutes
            connect_args={
                "sslmode": "require",  # Ensure SSL is used for Neon
            }
        )
    elif DATABASE_URL.startswith("sqlite"):
        return create_engine(DATABASE_URL, echo=False)
    else:
        from sqlalchemy import create_engine as sqlalchemy_create_engine
        return sqlalchemy_create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)