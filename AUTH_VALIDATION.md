# Authentication System Validation

This document describes how to validate that the authentication system is working correctly.

## Validation Steps

The authentication system implements the following flow:

1. **User Registration**: Users can create new accounts via the `/auth/register` endpoint
2. **JWT Token Issuance**: Successful registration returns a JWT token with user identity
3. **User Login**: Existing users can authenticate via the `/auth/login` endpoint
4. **Protected Endpoints**: All sensitive endpoints require a valid JWT token in the Authorization header
5. **Task Ownership**: Users can only access tasks they own
6. **Token Validation**: Invalid or expired tokens are rejected with 401 status

## Running the Validation Script

To validate the authentication system, run the validation script:

```bash
python validate_auth_flow.py
```

The script performs the following tests:
- Registers a new user and verifies JWT token issuance
- Accesses protected endpoints with valid tokens
- Attempts unauthorized access and verifies 401 rejection
- Creates and accesses tasks to verify ownership enforcement

## API Endpoints

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate existing user
- `POST /auth/logout` - Logout user (stateless)
- `GET /auth/me` - Get current user's profile

### Protected Task Endpoints
- `GET /api/v1/tasks/` - Get user's tasks
- `POST /api/v1/tasks/` - Create a new task
- `GET /api/v1/tasks/{id}` - Get specific task
- `PUT /api/v1/tasks/{id}` - Update specific task
- `DELETE /api/v1/tasks/{id}` - Delete specific task

All task endpoints require a valid JWT token in the Authorization header:
`Authorization: Bearer <jwt-token>`

## Security Features

- **Stateless Authentication**: JWT tokens contain all necessary user information
- **Token Expiration**: Tokens expire after configured duration (default 24 hours)
- **Payload Validation**: Tokens must contain valid user ID and email
- **User Isolation**: Users can only access their own tasks
- **Secure Password Storage**: Passwords are hashed using bcrypt
- **Input Validation**: Email format and password strength validation