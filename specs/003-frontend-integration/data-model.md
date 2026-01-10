# Data Model: Todo Full-stack Web Application - Spec 3 (Frontend & Integration)

## Frontend State Entities

### User Session Entity
**Fields**:
- `id`: string, User identifier from JWT token
- `email`: string, User's email address
- `isLoggedIn`: boolean, Authentication status
- `token`: string, JWT token for API authentication
- `tokenExpiry`: Date, Token expiration timestamp
- `isLoading`: boolean, Authentication state loading indicator

**Validation Rules**:
- Email must be a valid email format
- Token must be a valid JWT format
- Token must not be expired

**State Transitions**:
- `isLoading` → `false` when authentication resolves
- `isLoggedIn` → `true` on successful authentication
- `isLoggedIn` → `false` on logout or token expiration

### Task Entity (Frontend Representation)
**Fields**:
- `id`: number, Unique identifier for the task
- `title`: string, Task title (required, max 255 characters)
- `description`: string, Task description (optional, max 1000 characters)
- `completed`: boolean, Completion status (default: false)
- `userId`: number, Associated user ID (from JWT token)
- `createdAt`: Date, Creation timestamp
- `updatedAt`: Date, Last update timestamp

**Validation Rules**:
- Title must be 1-255 characters
- Description must be 0-1000 characters if provided
- userId must match authenticated user's ID
- createdAt and updatedAt must be valid timestamps

**State Transitions**:
- `completed` field can transition from `false` to `true`
- Task can be created, updated, or deleted based on user permissions

### UI State Entity
**Fields**:
- `isLoading`: boolean, General loading state
- `error`: string, Error message for display
- `success`: string, Success message for display
- `currentView`: string, Current UI view/state (e.g., "list", "create", "edit")

**Validation Rules**:
- Only one of error or success messages should be active at a time
- currentView must be a valid application state

**State Transitions**:
- `isLoading` toggles during API requests
- `error` and `success` messages clear after user acknowledgment or timeout

### Form State Entity
**Fields**:
- `formData`: object, Current form input values
- `errors`: object, Field-specific validation errors
- `isSubmitting`: boolean, Form submission state
- `isValid`: boolean, Overall form validation status

**Validation Rules**:
- formData must match expected form structure
- errors must correspond to actual form fields
- isValid reflects the current validation state

**State Transitions**:
- `isSubmitting` → `true` during form submission
- `isValid` updates as user interacts with form fields

## Frontend Component Relationships

### User Session to Tasks
- One-to-Many relationship
- Each authenticated user can have zero or many tasks
- Tasks are filtered by `userId` matching the session's user ID
- No direct manipulation allowed of tasks with mismatched userId

### UI State to Components
- One-to-Many relationship
- UI State drives the rendering and behavior of multiple components
- Components subscribe to relevant portions of the UI state
- State changes trigger component re-renders

### Form State to UI Components
- One-to-One relationship per form
- Each form has its own dedicated state management
- Form state is validated before submission
- Form state resets after successful submission

## Frontend API Integration

### API Response Mapping
- Backend Task entity → Frontend Task entity
- JWT token → User Session entity
- HTTP status codes → UI State (error/success/loading)

### Validation Coordination
- Frontend validation mirrors backend validation rules
- User receives immediate feedback on form inputs
- Backend validation serves as final authority
- Error messages are mapped from backend to frontend format

## Performance Considerations

### Caching Strategy
- Authentication state: Stored in secure browser storage
- Task lists: Cached in component state with TTL
- Form data: Cached temporarily during user interaction
- API responses: Cached based on request type and frequency

### Data Flow
- Unidirectional data flow from API → State → Components
- Events flow from Components → Actions → State updates
- Consistent patterns across all data interactions
- Predictable state management using React hooks or context