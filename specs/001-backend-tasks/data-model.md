# Data Model: Todo Backend

## Task Entity

**Fields**:
- `id`: Integer, Primary Key, Auto-generated
- `title`: String, Required (max 255 characters)
- `description`: String, Optional (max 1000 characters)
- `completed`: Boolean, Default False
- `user_id`: Integer, Required, Foreign Key to User
- `created_at`: DateTime, Auto-generated
- `updated_at`: DateTime, Auto-generated

**Validation Rules**:
- Title must not be empty
- Title length must be between 1-255 characters
- Description length must be between 0-1000 characters

**State Transitions**:
- `completed` field can transition from False to True or True to False

## User Entity

**Fields**:
- `id`: Integer, Primary Key, Auto-generated
- `email`: String, Unique, Required
- `created_at`: DateTime, Auto-generated
- `updated_at`: DateTime, Auto-generated

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users

## Relationships

**Task to User**:
- Many-to-One relationship
- Each task belongs to exactly one user
- User can have zero or many tasks
- Cascade delete: when user is deleted, their tasks are also deleted