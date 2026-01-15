from setuptools import setup, find_packages

setup(
    name="todo-backend",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "sqlmodel",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
        "python-dotenv",
        "asyncpg",
        "alembic",
        "pytest",
        "httpx",
    ],
    entry_points={
        "console_scripts": [
            "todo-api=src.main:app",
        ],
    },
)