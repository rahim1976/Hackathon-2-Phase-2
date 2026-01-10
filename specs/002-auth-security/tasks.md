# Tasks: Todo Full-Stack Web App - Auth & Security

**Input**: Design documents from `/specs/002-auth-security/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks as explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan
- [X] T002 Install authentication dependencies: Better Auth, python-jose, passlib, python-multipart
- [X] T003 [P] Configure environment variables for JWT secret in .env files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Configure Better Auth for frontend authentication in frontend/src/pages/api/auth/[...nextauth].ts
- [X] T005 [P] Implement JWT utility functions in frontend/src/utils/jwt.ts
- [X] T006 [P] Create centralized API client with token attachment in frontend/src/services/api-client.ts
- [X] T007 [P] Set up shared JWT secret for FastAPI in backend/.env and backend/src/main.py
- [X] T008 [P] Implement JWT verification utility in backend/src/auth/jwt_handler.py
- [X] T009 Create User model in backend/src/models/user.py
- [X] T010 [P] Implement authentication dependencies in backend/src/auth/dependencies.py
- [X] T011 [P] Configure authentication middleware in backend/src/auth/middleware.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: Users can create new accounts via Better Auth and receive JWT tokens upon successful registration

**Independent Test**: Submit a registration form with valid details and verify that an account is created with a valid JWT token returned

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T012 [P] [US1] Contract test for auth/register endpoint in backend/tests/auth/test_auth_endpoints.py
- [X] T013 [P] [US1] Integration test for user registration flow in backend/tests/auth/test_jwt.py

### Implementation for User Story 1

- [X] T014 [P] [US1] Create registration form component in frontend/src/components/auth/RegisterForm.tsx
- [X] T015 [P] [US1] Create registration page in frontend/src/pages/auth/register.tsx
- [X] T016 [US1] Implement registration endpoint in backend/src/api/v1/auth.py
- [X] T017 [US1] Add user creation service in backend/src/auth/jwt_handler.py
- [X] T018 [US1] Update API client to handle registration in frontend/src/services/auth.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Login (Priority: P1)

**Goal**: Users can sign in to existing accounts and receive JWT tokens for accessing protected resources

**Independent Test**: Submit valid login credentials and verify that a JWT token is returned

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T019 [P] [US2] Contract test for auth/login endpoint in backend/tests/auth/test_auth_endpoints.py
- [X] T020 [P] [US2] Integration test for user login flow in backend/tests/auth/test_jwt.py

### Implementation for User Story 2

- [X] T021 [P] [US2] Create login form component in frontend/src/components/auth/LoginForm.tsx
- [X] T022 [P] [US2] Create login page in frontend/src/pages/auth/login.tsx
- [X] T023 [US2] Implement login endpoint in backend/src/api/v1/auth.py
- [X] T024 [US2] Add user authentication service in backend/src/auth/jwt_handler.py
- [X] T025 [US2] Update API client to handle login in frontend/src/services/auth.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Protected API Access (Priority: P1)

**Goal**: Enforce security for API endpoints by validating JWT tokens in Authorization header

**Independent Test**: Make API requests with valid and invalid JWT tokens and verify appropriate access control

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T026 [P] [US3] Contract test for protected endpoints with valid tokens in backend/tests/api/test_protected_routes.py
- [X] T027 [P] [US3] Contract test for protected endpoints with invalid tokens in backend/tests/api/test_protected_routes.py

### Implementation for User Story 3

- [X] T028 [P] [US3] Create ProtectedRoute component in frontend/src/components/auth/ProtectedRoute.tsx
- [X] T029 [US3] Update all existing API calls to use new API client with token attachment in frontend/src/services/api-client.ts
- [X] T030 [US3] Implement JWT verification middleware for FastAPI in backend/src/auth/middleware.py
- [X] T031 [US3] Create get_current_user dependency in backend/src/auth/dependencies.py
- [X] T032 [US3] Protect all task routes with auth dependency in backend/src/api/v1/tasks.py
- [X] T033 [US3] Update existing task endpoints from Spec 1 to use auth dependency

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Task Access Control (Priority: P2)

**Goal**: Ensure users can only access, modify, or delete their own tasks based on JWT identity

**Independent Test**: Have different users attempt to access various tasks and verify they can only access their own

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [X] T034 [P] [US4] Contract test for task access with wrong user in backend/tests/api/test_protected_routes.py
- [X] T035 [P] [US4] Integration test for task ownership enforcement in backend/tests/api/test_protected_routes.py

### Implementation for User Story 4

- [X] T036 [P] [US4] Update task models to include user_id foreign key in backend/src/models/task.py
- [X] T037 [US4] Modify task creation to associate with authenticated user in backend/src/api/v1/tasks.py
- [X] T038 [US4] Implement task ownership checks in backend/src/api/v1/tasks.py
- [X] T039 [US4] Update task retrieval to filter by authenticated user in backend/src/api/v1/tasks.py
- [X] T040 [US4] Remove client-sent user_id from all requests in frontend/src/services/api-client.ts

**Checkpoint**: At this point, all user stories should be independently functional

---

## Phase 7: User Story 5 - Logout (Priority: P3)

**Goal**: Allow users to securely end their session by clearing authentication state

**Independent Test**: Initiate logout and verify subsequent requests without tokens are rejected

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [X] T041 [P] [US5] Contract test for auth/logout endpoint in backend/tests/auth/test_auth_endpoints.py
- [X] T042 [P] [US5] Integration test for logout functionality in backend/tests/auth/test_jwt.py

### Implementation for User Story 5

- [X] T043 [P] [US5] Create logout function in frontend/src/services/auth.ts
- [X] T044 [P] [US5] Implement logout endpoint in backend/src/api/v1/auth.py
- [X] T045 [US5] Add logout page/component in frontend/src/components/auth/

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T046 [P] Update frontend/_app.tsx to handle authentication state globally
- [X] T047 [P] Add proper error handling for 401 responses in frontend/src/services/api-client.ts
- [X] T048 Add comprehensive logging for authentication events in backend/src/auth/middleware.py
- [X] T049 [P] Update middleware.ts to handle authentication in frontend/
- [X] T050 Security hardening: Validate JWT payload fields (sub, email) in backend/src/auth/jwt_handler.py
- [X] T051 Run quickstart.md validation to ensure auth flow works correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1/US2 for JWT tokens
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on US3 for auth protection
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for auth/register endpoint in backend/tests/auth/test_auth_endpoints.py"
Task: "Integration test for user registration flow in backend/tests/auth/test_jwt.py"

# Launch all components for User Story 1 together:
Task: "Create registration form component in frontend/src/components/auth/RegisterForm.tsx"
Task: "Create registration page in frontend/src/pages/auth/register.tsx"
Task: "Implement registration endpoint in backend/src/api/v1/auth.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence