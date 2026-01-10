<!-- SYNC IMPACT REPORT
Version change: N/A (initial version) → 1.0.0
Modified principles: N/A
Added sections: All principles and sections from user input
Removed sections: N/A
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending
- README.md ⚠ pending
Follow-up TODOs: None
-->

# Todo Full-Stack Web Application (Hackathon Phase-2) Constitution

## Core Principles

### Spec-driven Development
All implementation must strictly follow approved specs. No coding without an approved specification that defines the behavior, interfaces, and acceptance criteria.

### Agentic Workflow Compliance
Spec → Plan → Tasks → Implementation workflow must be followed without deviation. Manual coding outside this process is prohibited to ensure traceability and quality.

### Security-First Design
Authentication, authorization, and user isolation must be enforced by default. Security considerations take precedence over feature delivery speed.

### Deterministic Behavior
APIs and UI must behave consistently across users and sessions. All system behaviors must be predictable and reproducible.

### Full-Stack Coherence
Frontend, backend, and database layers must integrate seamlessly without architectural mismatches or interface inconsistencies.

### Implementation Standards
No implementation without an approved spec and plan. All API behavior must be explicitly defined in specifications before development begins.

## Technology Stack Requirements

### Authentication Standard
Authentication must use Better Auth with JWT tokens. All backend routes must validate JWT and enforce task ownership for multi-user support.

### Database Query Standards
All database queries must be user-scoped to ensure data isolation between users. No cross-user data access is permitted without explicit authorization.

### API Design Standards
REST APIs must follow HTTP semantics and status codes correctly. Error responses must be explicit, predictable, and properly documented.

### Frontend-Backend Integration
Frontend must consume APIs exactly as specified without assumptions or workarounds. No hard-coded secrets are allowed; environment variables only.

## Development Constraints

### Technology Stack Adherence
Technology stack is fixed and non-negotiable:
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Auth: Better Auth (JWT-based)

### Authentication Requirements
All endpoints require valid JWT after authentication. Stateless backend authentication using JWT only is mandatory. Multi-user support is required.

### Persistence Requirements
Data persistence must work across user sessions. All user data must survive browser refreshes and session restarts.

## Success Criteria

### Specification Completion
All three specs (Backend, Auth, Frontend) must be fully implemented and integrated into a cohesive system.

### User Functionality
Users must be able to sign up, sign in, and manage only their own tasks. Unauthorized requests must consistently return 401 status codes.

### Ownership Enforcement
Task ownership must be enforced on every CRUD operation. Users cannot access or modify tasks belonging to other users.

### System Integration
Application must work end-to-end as a full-stack system with proper integration between all components.

### Process Compliance
Specs, plans, and iterations must be reviewable and traceable. Project must pass hackathon evaluation based on process and correctness.

## Governance

All implementation must comply with these constitutional principles. Amendments require explicit documentation, approval, and migration planning. All development activities must verify constitutional compliance before merging. Deviations from these principles require architectural review and approval.

**Version**: 1.0.0 | **Ratified**: 2026-01-10 | **Last Amended**: 2026-01-10