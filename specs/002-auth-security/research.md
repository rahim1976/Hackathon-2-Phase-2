# Research: Todo Authentication Implementation

## Auth Flow Architecture (Next.js Better Auth -> JWT -> FastAPI)

**Decision**: Implement authentication flow with Next.js/Better Auth generating JWT tokens that are validated by FastAPI backend
**Rationale**: This provides stateless authentication that works well across microservices. Better Auth handles the UI and initial authentication, while JWTs provide secure token-based access to backend services.
**Alternatives considered**:
- Session-based authentication - rejected as it requires server-side state management
- OAuth-only approach - rejected as it doesn't meet the requirement for custom user management

## JWT Payload Fields Required by Backend

**Decision**: JWT payload will include `user_id`, `email`, `exp` (expiration), and `iat` (issued at) fields
**Rationale**: The backend needs to identify the user (`user_id`) to enforce proper data access control. Email provides additional identity verification. Standard JWT fields like exp and iat ensure proper token lifecycle management.
**Alternatives considered**:
- Include role/permission fields - not needed for this spec as it only requires user identification
- Custom claims beyond standard ones - kept minimal to reduce token size and complexity

## Token Expiration Duration and Validation Rules

**Decision**: Set JWT expiration to 24 hours with optional refresh mechanism, validate signature using shared secret, check expiration in middleware
**Rationale**: 24-hour expiration balances security (short-lived tokens reduce exposure risk) with user experience (not requiring frequent re-login). Signature validation ensures token authenticity.
**Alternatives considered**:
- Shorter expiration (1 hour) - would require more frequent re-authentication
- Longer expiration (7 days) - increases security risk window
- No expiration - major security vulnerability

## Strategy for Matching JWT User Identity with Route user_id

**Decision**: Extract user_id from JWT token and compare with route/user_id parameters in FastAPI dependencies/middleware
**Rationale**: This ensures users can only access resources they own. The dependency system in FastAPI allows for clean integration with authentication checks.
**Alternatives considered**:
- Database lookup for each request - rejected as it contradicts the stateless requirement
- Client-side validation only - rejected as it's insecure and can be bypassed

## JWT Verification Middleware for FastAPI

**Decision**: Create FastAPI dependency and middleware to verify JWT tokens on protected routes
**Rationale**: FastAPI's dependency injection system works well with JWT verification. Dependencies can be injected into route handlers to ensure authentication before processing.
**Alternatives considered**:
- Decorator-based approach - less flexible than FastAPI dependencies
- Manual verification in each route - leads to code duplication

## Frontend API Client Strategy for Token Attachment

**Decision**: Create API client wrapper that automatically attaches JWT token from auth state to all requests
**Rationale**: Centralized approach ensures all API calls include authentication tokens without manual intervention. Works well with Better Auth's token management.
**Alternatives considered**:
- Manual token attachment in each API call - error-prone and inconsistent
- Browser storage only - doesn't handle token refresh or error cases elegantly