# NexusMind Automated Test Harness

This directory contains cross-cutting integration tests, contract verification suites, and end-to-end (E2E) golden path tests.

---

## Directory Structure

```
tests/
├── e2e/                      # Playwright end-to-end browser tests
│   ├── chat-streaming.spec.ts
│   ├── document-upload.spec.ts
│   └── knowledge-graph.spec.ts
├── integration/              # Multi-component integration tests
│   ├── hybrid-search.test.ts # Vector + BM25 reciprocal rank fusion verification
│   ├── ai-gateway.test.ts    # Fallback and circuit breaker tests
│   └── db-migrations.test.ts # Schema integrity and migration tests
├── fixtures/                 # Golden sample documents (PDF, MD) and expected outputs
└── factories/                # Test data generators (Workspaces, Documents, Chunks)
```

---

## Execution Guidelines

- **Integration Tests**:
  Ensure local PostgreSQL with `pgvector` is running or testcontainers is enabled.
  ```bash
  npm run test:integration
  ```
- **E2E Tests**:
  ```bash
  npm run test:e2e
  ```
