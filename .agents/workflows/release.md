# Release Management & Deployment Workflow

This workflow outlines the release qualification, schema migration validation, semantic versioning, and deployment verification processes for NexusMind.

---

## Release Lifecycle Stages

```
 ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
 │    Phase 1    │────>│    Phase 2    │────>│    Phase 3    │────>│    Phase 4    │
 │ Pre-Flight &  │     │   Database    │     │ Version Bump  │     │ Deploy Verify │
 │ Quality Gates │     │  Migrations   │     │  & Changelog  │     │  & Telemetry  │
 └───────────────┘     └───────────────┘     └───────────────┘     └───────────────┘
```

---

## Phase 1: Pre-Flight Audit & Automated Quality Gates

Before any code is tagged or promoted for release:

1. **Clean Working Tree**:
   - Ensure all working changes are committed and no untracked artifacts exist.
2. **Type Safety & Lint Validation**:
   - Execute strict static analysis:
     ```bash
     npm run typecheck
     npm run lint
     ```
3. **Comprehensive Test Suite**:
   - Execute full test pyramid including unit, integration, and E2E suites:
     ```bash
     npm run test:all
     ```
4. **Security & Dependency Audit**:
   - Audit dependencies for critical/high CVEs:
     ```bash
     npm audit --audit-level=high
     ```
   - Verify no secrets or credentials exist in commits.

---

## Phase 2: Database Migration Qualification

If database schema changes are present in the release:

1. **Non-Destructive Migration Principle**:
   - Schema alterations must be backward-compatible (expand-and-contract pattern). Never drop columns or tables in the same release where application code stops reading them.
2. **Migration Dry-Run**:
   - Execute the migration on a staging or test replica to verify:
     - No full-table locks that block live production queries.
     - Index creation (e.g. vector index `CREATE INDEX CONCURRENTLY ...`) succeeds without timeout.
     - Rollback scripts execute cleanly without data loss.
3. **Apply Migrations**:
   - Run migration prior to deploying new container workloads.

---

## Phase 3: Semantic Versioning & Artifact Generation

1. **Determine Version Increment**:
   - NexusMind strictly follows **Semantic Versioning (SemVer 2.0.0)**:
     - `MAJOR` (vX.0.0): Incompatible breaking API or schema changes.
     - `MINOR` (v0.X.0): Backward-compatible new features.
     - `PATCH` (v0.0.X): Backward-compatible bug fixes and security patches.
2. **Generate Changelog**:
   - Group changes under categorized sections:
     - `🚀 Features`
     - `🐛 Bug Fixes`
     - `🔒 Security Updates`
     - `⚡ Performance Improvements`
     - `🛠 Maintenance & Refactoring`
3. **Git Tagging**:
   - Tag the release commit:
     ```bash
     git tag -a v1.0.0 -m "Release v1.0.0: NexusMind MVP"
     ```

---

## Phase 4: Deployment & Post-Release Health Verification

1. **Container Build & Verification**:
   - Build production container images (Next.js client, Fastify API service) with minimized attack surface (multi-stage Docker build).
2. **Smoke Testing**:
   - Verify critical production health endpoints:
     - `GET /health/live` -> 200 OK
     - `GET /health/ready` -> 200 OK (DB & Redis connections confirmed active)
   - Execute automated smoke test validating token generation and LLM connectivity.
3. **Telemetry & Error Budget Monitoring**:
   - Monitor Sentry error rates, server latency percentiles (p95, p99), and LLM token error rates for 30 minutes following release.
   - If error rates exceed 0.5%, initiate immediate automated rollback protocol.
