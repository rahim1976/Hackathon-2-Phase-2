# Quickstart Guide: Todo Backend

## Prerequisites

- Python 3.11+
- pip package manager
- Access to Neon Serverless PostgreSQL database

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your database connection details:
   ```bash
   cp .env.example .env
   # Edit .env with your Neon PostgreSQL connection string
   ```

5. Initialize the database:
   ```bash
   # Navigate to backend directory and run database migrations
   cd backend
   alembic upgrade head
   ```

6. Run the application:
   ```bash
   uvicorn backend.src.main:app --reload
   ```

## API Endpoints

Once running, the API will be available at `http://localhost:8000`:

- `GET /tasks` - Get all tasks for user
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task

## Testing

Run the test suite:
```bash
pytest tests/
```

## Configuration

Environment variables required:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `SECRET_KEY` - Secret key for security (optional for this spec, needed for auth in spec-2)
- `ALGORITHM` - JWT algorithm (optional for this spec)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (optional for this spec)