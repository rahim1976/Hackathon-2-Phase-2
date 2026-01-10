# Data Model: Todo Authentication System

## User Entity

**Fields**:
- `id`: Integer, Primary Key, Auto-generated
- `email`: String, Unique, Required (max 255 characters)
- `hashed_password`: String, Required (from passlib hash)
- `created_at`: DateTime, Auto-generated
- `updated_at`: DateTime, Auto-generated
- `is_active`: Boolean, Default True

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users
- Password must meet minimum security requirements (when implemented)

**State Transitions**:
- `is_active` field can transition from True to False (account deactivation)

## JWT Token Structure

**Payload Fields**:
- `sub`: String, Subject (user_id), Required
- `email`: String, User email, Required
- `exp`: Integer, Expiration timestamp (24 hours from issue), Required
- `iat`: Integer, Issued at timestamp, Required
- `jti`: String, JWT ID for potential revocation (optional)

**Validation Rules**:
- Token must be properly signed with shared secret
- Token must not be expired (exp > current time)
- Token signature must be valid

## Session/Token State (Conceptual - for stateless design)

**Fields**:
- `token_hash`: String, Hash of JWT for potential blacklist (optional)
- `expires_at`: DateTime, When token expires
- `user_id`: Integer, Associated user (for tracking purposes)

**Note**: Actual implementation will be stateless, so no database storage for tokens, but potential revocation mechanisms may need token tracking.

## Relationships

**User to Tasks**:
- One-to-Many relationship
- Each user can have zero or many tasks
- Tasks are filtered by user_id for access control
- No cascade delete (tasks remain as historical data)