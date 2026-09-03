# Testing Standards & Quality Verification

Testing is a first-class engineering discipline at NexusMind. Every feature, bug fix, and architectural refactor must include comprehensive automated tests before merge.

---

## 1. Testing Philosophy & Test Pyramid

NexusMind adheres to a balanced test pyramid designed for velocity, determinism, and high confidence:

```
          / \
         / E2E \       <-- Minimal, high-value user journeys (Playwright)
        /-------\
       / Integr. \     <-- API routes, DB queries, Vector search, Service orchestration
      /-----------\
     /    Unit     \   <-- Domain entities, pure functions, utility parsers, state reducers
    /---------------\
```

1. **Unit Tests (70% coverage baseline)**:
   - Target pure domain logic, value object validations, utility functions, and isolated state reducers.
   - Must execute in milliseconds without network calls or external process spawning.
2. **Integration Tests (20% coverage baseline)**:
   - Target HTTP route handlers, database repositories, vector embedding operations, and service orchestrators.
   - Use ephemeral test containers (Testcontainers) or in-memory fixtures.
3. **End-to-End Tests (10% coverage baseline)**:
   - Validate critical golden paths: user authentication, workspace creation, knowledge ingestion, agent conversation stream, and export flows.
   - Run against staged builds using Playwright.

---

## 2. Test-Driven Development (TDD) Protocol

For any new feature or non-trivial algorithm, engineers and agents should follow the **Red-Green-Refactor** cycle:
1. **Red**: Write a minimal failing test that defines the expected behavior, API interface, and boundary conditions. Run the test and verify it fails for the expected reason.
2. **Green**: Write the minimal production code necessary to satisfy the test assertions.
3. **Refactor**: Clean up the implementation, optimize readability, eliminate duplication, and verify that all tests remain green.

---

## 3. Testing Rules & Invariants

### Determinism and Flakiness Prevention
- **Zero Flakiness Tolerance**: Flaky tests are bugs. Tests must pass reliably 100% of the time across concurrent runs.
- **No Arbitrary Sleeping**: Never use hardcoded timeouts (`sleep(1000)` or `setTimeout`). Use explicit polling utilities (e.g., `waitFor()`, `toPass()`) with deterministic event listeners.
- **Time Freezing**: Whenever testing time-sensitive logic (token expiry, rate limiting, cron schedules), freeze or mock the system clock using test harness utilities (`vi.useFakeTimers()`).

### Mocking Guidelines
- Mock at the **edges of the system**: Mock external third-party HTTP APIs (LLM endpoints, payment gateways, email providers).
- Do NOT mock internal business logic or domain entities. If a domain entity requires extensive mocking, the design is coupled and must be refactored.
- Use explicit contract-driven mocks: Mocked LLM responses must adhere to exact provider JSON schemas and token count structures.

### Assertion Best Practices
- Assert on observable behavior and state contracts, not on internal private implementation details.
- Use descriptive assertion messages that clearly describe why an expectation failed.
- Check both happy paths AND edge/failure conditions (e.g., invalid tokens, empty search queries, malformed LLM responses, database connection drops).

---

## 4. Test Directory Conventions

Test files reside colocated with source code or in dedicated test suites:

- **Unit tests**: Colocated alongside the source file with `.spec.ts` or `.test.ts` extension:
  `user.entity.ts` → `user.entity.spec.ts`
- **Integration tests**: Located in `tests/integration/` or within the module's `tests/` subdirectory:
  `tests/integration/api/knowledge.test.ts`
- **E2E tests**: Located in `tests/e2e/`:
  `tests/e2e/agent-chat-flow.spec.ts`
- **Test fixtures & factories**: Centralized under `tests/fixtures/` and `tests/factories/`.

 # Testing Rules

Every significant feature must include appropriate tests.

Before declaring a task complete:

1. Run unit tests.
2. Run integration tests where applicable.
3. Run linting.
4. Run type checking.
5. Verify the application manually when UI changes are involved.
6. Report failures instead of hiding them.