from fastapi import FastAPI
from backend.src.api.v1.tasks import router as tasks_router
from backend.src.api.v1.users import router as users_router
from backend.src.api.v1.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from backend.src.database.engine import get_new_engine
from backend.src.models.user import User
from backend.src.models.task import Task
from sqlmodel import SQLModel

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-default-secret-key-change-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES", "30"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler to initialize the database.
    """
    try:
        # Create database engine based on current environment
        engine = get_new_engine()
        # Create database tables on startup
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"Database initialization error: {e}")
        # Continue without raising exception to allow app to start for testing
    yield
    # Perform cleanup on shutdown if needed

app = FastAPI(
    title="Todo API",
    description="API for managing user tasks in the Todo application",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(users_router, prefix="/api/v1", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "Todo API - Welcome!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}