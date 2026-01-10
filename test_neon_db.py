import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')  # Root directory
load_dotenv('backend/.env')  # Backend directory

# Get the database URL
DATABASE_URL = os.environ.get("DATABASE_URL") or os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in environment variables")
    sys.exit(1)

print(f"Using database URL: {DATABASE_URL[:50]}...")  # Show beginning of URL

# Import the database engine and create tables
from backend.src.database.engine import get_new_engine
from backend.src.models.task import Task
from backend.src.models.user import User
from sqlmodel import SQLModel

try:
    # Create engine and connect to Neon database
    engine = get_new_engine()

    # Create tables
    print("Creating tables in Neon database...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")

    # Verify tables exist
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables in database: {tables}")

    print("\nNeon database setup completed successfully!")

except Exception as e:
    print(f"Error connecting to Neon database: {e}")
    import traceback
    traceback.print_exc()