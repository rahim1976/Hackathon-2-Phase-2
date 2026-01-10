# Implementation Tasks: Todo Full-Stack Web Application – Spec-1 (Backend Core & Data Layer)

**Feature**: specs/001-backend-tasks/spec.md
**Branch**: `001-backend-tasks`
**Date**: 2026-01-10

## Overview
Implementation tasks organized by priority (P1-Highest, P2-Medium, P3-Lowest) and user story. Each task includes specific file paths and follows the checklist format for tracking progress.

---

## Phase 1: Setup (5 tasks)

- [x] T001 [P1] Create project directory structure: `backend/src/models/__init__.py`, `backend/src/api/__init__.py`, `backend/src/database/__init__.py`, `backend/src/schemas/__init__.py`, `backend/tests/__init__.py`

- [x] T002 [P1] Create requirements.txt with dependencies: fastapi, sqlmodel, psycopg2-binary, python-dotenv, pytest, httpx

- [x] T003 [P1] Create .env.example with DATABASE_URL variable and documentation

- [x] T004 [P1] Create backend/src/main.py with basic FastAPI app initialization

- [x] T005 [P1] Configure Alembic for database migrations with proper SQLModel integration

---

## Phase 2: Foundational (13 tasks)

- [x] T006 [P1] Create backend/src/database/engine.py with Neon PostgreSQL connection using SQLModel

- [x] T007 [P1] Create backend/src/database/base.py with SQLModel Base class

- [x] T008 [P1] Create backend/src/models/user.py with User model including id, email, timestamps

- [x] T009 [P1] Create backend/src/models/task.py with Task model including id, title, description, completed, user_id, timestamps

- [x] T010 [P1] Create backend/src/schemas/user.py with Pydantic models for UserCreate, UserRead

- [x] T011 [P1] Create backend/src/schemas/task.py with Pydantic models for TaskCreate, TaskRead, TaskUpdate

- [x] T012 [P1] Create backend/src/api/deps.py with database session dependency

- [x] T013 [P1] Create backend/src/api/v1/__init__.py for API versioning

- [x] T014 [P1] Create backend/src/api/v1/tasks.py with empty router for task endpoints

- [x] T015 [P1] Create backend/src/api/v1/users.py with empty router for user endpoints

- [x] T016 [P2] Add database session lifecycle management to main.py

- [ ] T017 [P2] Create basic error handling middleware in main.py

- [x] T018 [P2] Add CORS middleware to main.py for frontend integration

---

## Phase 3: User Story 1 - Create New Task (P1) (6 tasks)

- [x] T019 [P1] [Story-1] Implement POST /tasks endpoint in backend/src/api/v1/tasks.py to create new tasks

- [x] T020 [P1] [Story-1] Add request validation using TaskCreate schema in POST /tasks endpoint

- [x] T021 [P1] [Story-1] Ensure user_id is properly associated with created tasks (mocked for now, since auth is in spec-2)

- [x] T022 [P1] [Story-1] Return appropriate HTTP 201 status with created task in POST /tasks response

- [x] T023 [P1] [Story-1] Handle validation errors in POST /tasks and return HTTP 400

- [x] T024 [P1] [Story-1] Write unit tests for POST /tasks endpoint in tests/api/test_tasks.py

---

## Phase 4: User Story 2 - Retrieve User Tasks (P1) (6 tasks)

- [x] T025 [P1] [Story-2] Implement GET /tasks endpoint in backend/src/api/v1/tasks.py to retrieve user's tasks

- [x] T026 [P1] [Story-2] Add user_id filtering to ensure users only see their own tasks

- [x] T027 [P1] [Story-2] Return list of TaskRead objects from GET /tasks endpoint

- [x] T028 [P1] [Story-2] Handle empty task list case with appropriate response in GET /tasks

- [ ] T029 [P1] [Story-2] Add pagination support to GET /tasks endpoint (optional for this spec)

- [x] T030 [P1] [Story-2] Write unit tests for GET /tasks endpoint in tests/api/test_tasks.py

---

## Phase 5: User Story 5 - Get Specific Task (P3) (5 tasks)

- [x] T031 [P2] [Story-5] Implement GET /tasks/{id} endpoint in backend/src/api/v1/tasks.py to retrieve specific task

- [x] T032 [P2] [Story-5] Add user_id validation to ensure users only access their own tasks

- [x] T033 [P2] [Story-5] Return TaskRead object from GET /tasks/{id} endpoint

- [x] T034 [P2] [Story-5] Handle task not found case with HTTP 404 in GET /tasks/{id}

- [x] T035 [P2] [Story-5] Write unit tests for GET /tasks/{id} endpoint in tests/api/test_tasks.py

---

## Phase 6: User Story 3 - Update Existing Task (P2) (6 tasks)

- [x] T036 [P2] [Story-3] Implement PUT /tasks/{id} endpoint in backend/src/api/v1/tasks.py to update tasks

- [x] T037 [P2] [Story-3] Add user_id validation to ensure users only update their own tasks

- [x] T038 [P2] [Story-3] Apply request validation using TaskUpdate schema in PUT /tasks/{id}

- [x] T039 [P2] [Story-3] Return updated TaskRead object with HTTP 200 in PUT /tasks/{id}

- [x] T040 [P2] [Story-3] Handle task not found case with HTTP 404 in PUT /tasks/{id}

- [x] T041 [P2] [Story-3] Write unit tests for PUT /tasks/{id} endpoint in tests/api/test_tasks.py

---

## Phase 7: User Story 4 - Delete Task (P2) (6 tasks)

- [x] T042 [P2] [Story-4] Implement DELETE /tasks/{id} endpoint in backend/src/api/v1/tasks.py to delete tasks

- [x] T043 [P2] [Story-4] Add user_id validation to ensure users only delete their own tasks

- [x] T044 [P2] [Story-4] Return HTTP 204 status after successful deletion

- [x] T045 [P2] [Story-4] Handle task not found case with HTTP 404 in DELETE /tasks/{id}

- [x] T046 [P2] [Story-4] Handle unauthorized deletion with HTTP 404 (not exposing task existence)

- [x] T047 [P2] [Story-4] Write unit tests for DELETE /tasks/{id} endpoint in tests/api/test_tasks.py

---

## Phase 8: Polish (7 tasks)

- [x] T048 [P2] Write model-level tests for Task and User models in tests/models/

- [x] T049 [P2] Create integration tests for full CRUD workflow in tests/integration/

- [x] T050 [P2] Add proper error responses with consistent format across all endpoints

- [x] T051 [P2] Add request/response logging for debugging in main.py

- [x] T052 [P2] Add API documentation with Swagger/OpenAPI in main.py

- [x] T053 [P2] Create database cleanup functions for testing in tests/conftest.py

- [x] T054 [P3] Add comprehensive README.md with setup instructions and API documentation

---

## Success Criteria Validation
- [x] All CRUD operations implemented via REST APIs
- [x] Data persisted in Neon Serverless PostgreSQL
- [x] SQLModel used for schema and ORM operations
- [x] All endpoints correctly scoped by user_id
- [x] API responses follow HTTP standards (200, 201, 400, 404, 500)
- [x] Backend runs independently of frontend

## Dependencies
- Task T001 must be completed before T006-T018
- Task T006-T018 must be completed before T019-T047
- Authentication will be handled in Spec-2, so user_id will be mocked for now in tasks T019-T047