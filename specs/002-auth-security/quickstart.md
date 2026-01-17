# Quickstart Guide: Todo Authentication System

## Prerequisites

- Node.js 18+ with npm/yarn
- Python 3.11+
- PostgreSQL (or Neon Serverless PostgreSQL for cloud deployment)
- Better Auth compatible environment

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   Copy `.env.example` to `.env` in both frontend and backend directories:
   ```bash
   # In root directory
   cp .env.example .env

   # In frontend directory
   cd frontend && cp .env.example .env
   ```

   Configure the following variables:
   - `AUTH_SECRET`: Secret key for JWT signing (32+ random characters)
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_URL`: Base URL for your application
   - `NEXTAUTH_SECRET`: Same as AUTH_SECRET for consistency

5. Run database migrations:
   ```bash
   # Navigate to backend directory and run database migrations
   cd backend
   alembic upgrade head
   ```

6. Start the development servers:
   ```bash
   # Terminal 1 - Start backend
   cd backend
   uvicorn src.main:app --reload

   # Terminal 2 - Start frontend
   cd frontend
   npm run dev
   ```

## Authentication Flow

1. **User Registration**: User visits `/auth/register` and submits email/password
2. **JWT Token Issue**: Server validates credentials and returns JWT token
3. **Token Storage**: Frontend stores token in secure session/local storage
4. **API Requests**: Frontend attaches `Authorization: Bearer <token>` header
5. **Token Validation**: Backend middleware validates JWT signature and expiration
6. **User Identification**: Backend extracts user identity from token payload
7. **Access Control**: Backend verifies user permissions for requested resources

## API Endpoint Examples

### Register New User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### Login and Get Token
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### Access Protected Resource
```bash
curl -X GET http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Configuration

Required environment variables:
- `AUTH_SECRET` - JWT signing secret (use same value in frontend and backend)
- `DATABASE_URL` - PostgreSQL connection string
- `ACCESS_TOKEN_EXPIRES_MINUTES` - Token expiration duration (default: 1440 minutes = 24 hours)

## Testing

Run backend tests:
```bash
pytest tests/auth/
```

Run frontend tests:
```bash
cd frontend
npm test
```