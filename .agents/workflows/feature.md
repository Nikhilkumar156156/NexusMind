# Feature Development Workflow

This workflow dictates the end-to-end process for specifying, planning, implementing, and verifying new features in NexusMind. All human contributors and autonomous AI agents must execute feature tasks through this standardized lifecycle.

---

## Workflow Lifecycle Overview

```
 ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 │   Stage 1   │────>│   Stage 2   │────>│   Stage 3   │────>│   Stage 4   │────>│   Stage 5   │
 │   Scoping   │     │  Planning   │     │  TDD (Red)  │     │ Implement   │     │ Verification│
 │ & Spec Sync │     │  Artifact   │     │ Unit Tests  │     │   (Green)   │     │  & Review   │
 └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Stage 1: Scoping & Specification Alignment

1. **Review Documentation**:
   - Inspect `docs/PRD.md`, `docs/architecture.md`, `docs/database.md`, and `docs/api.md`.
   - Verify that the requested feature aligns with product requirements and existing domain boundaries.
2. **Identify Impacted Layers**:
   - Determine which layers will require changes: Domain models, Application use cases, Infrastructure adapters, DB schema, API routes, or Frontend components.
3. **Resolve Ambiguity Early**:
   - If any core product or UX requirement is ambiguous, clarify before generating implementation code.

---

## Stage 2: Implementation Plan Artifact

1. **Draft Implementation Plan**:
   - Create or update the `implementation_plan.md` artifact detailing:
     - Feature goal and user value.
     - User review requirements (breaking changes, new dependencies).
     - Component breakdown (Domain -> Application -> Infrastructure -> Presentation).
     - Database schema additions / migration plans.
     - Automated verification strategy.
2. **Obtain Alignment**:
   - Request review and ensure explicit approval on architectural changes prior to writing code.

---

## Stage 3: Test-Driven Development (TDD) Protocol

1. **Write Failing Tests (Red)**:
   - For domain entities and business rules: write pure unit tests in `src/domain/*.spec.ts`.
   - For application services / use cases: write mock-isolated tests in `src/application/*.spec.ts`.
   - For API routes: write integration test cases in `tests/integration/` asserting on expected status codes and schema payloads.
2. **Execute Tests**:
   - Confirm that the newly created tests execute and fail for the intended reason (missing implementation).

---

## Stage 4: Implementation (Green & Refactor)

1. **Implement Domain & Application Logic**:
   - Define entities, value objects, and domain events.
   - Implement the use case orchestrator handling transactions and port invocations.
2. **Implement Infrastructure & Presentation**:
   - Implement database repositories or AI gateway clients.
   - Create HTTP routes / SSE streams with Zod request validation.
   - Implement UI components adhering to accessibility and design tokens.
3. **Achieve Green State**:
   - Run tests until all assertions pass cleanly.
4. **Refactor**:
   - Eliminate code duplication, improve naming, ensure strict typing (zero `any`), and verify function length constraints (<35 LOC).

---

## Stage 5: Verification & Quality Audit

1. **Automated Verification**:
   - Type check: `npm run typecheck`
   - Linting: `npm run lint`
   - Test suite: `npm test`
2. **Code Review Audit**:
   - Perform a self-audit against `.agents/skills/code-review/SKILL.md`.
   - Ensure zero secrets, parameterized queries, and strict input validation.
3. **Documentation Update**:
   - If public APIs or database schemas changed, update `docs/api.md` and `docs/database.md`.
   - Generate a walkthrough artifact (`walkthrough.md`) summarizing the delivered changes.
