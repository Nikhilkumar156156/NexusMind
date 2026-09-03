# Bug Fix & Incident Remediation Workflow

This workflow specifies the systematic engineering process for diagnosing, isolating, fixing, and preventing regressions for bugs reported in NexusMind.

---

## Remediation Lifecycle Overview

```
 ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
 │    Step 1     │────>│    Step 2     │────>│    Step 3     │────>│    Step 4     │
 │  Reproduce &  │     │  Root Cause   │     │ Minimal Diff  │     │  Regression   │
 │ Failing Test  │     │   Isolation   │     │     Fix       │     │ Verification  │
 └───────────────┘     └───────────────┘     └───────────────┘     └───────────────┘
```

---

## Step 1: Reproduce with an Automated Failing Test

1. **Information Gathering**:
   - Collect error stack traces, client request payloads, environmental context, and telemetry logs.
2. **Author Reproduction Test**:
   - **Mandatory First Step**: Write an automated test case that faithfully reproduces the defect under controlled conditions.
   - The test must trigger the exact failure reported by the user or error monitor.
3. **Confirm Test Failure**:
   - Execute the test suite and verify that the test fails consistently with the identical symptoms.

---

## Step 2: Root Cause Isolation & Impact Analysis

1. **Trace Execution Path**:
   - Trace the flow backwards from the point of failure:
     `Presentation Handler -> Application Use Case -> Domain Entity / Infrastructure Adapter`
2. **Identify Invariant Violation**:
   - Determine which architectural, type, or state invariant was breached (e.g., race condition in cache update, unhandled `null` in vector response, missing Zod boundary constraint).
3. **Assess Blast Radius**:
   - Check if similar patterns exist in other services or endpoints that could suffer from the same vulnerability or edge case.

---

## Step 3: Minimal Diff Fix

1. **Apply Surgical Correction**:
   - Modify only the code necessary to address the root cause and restore the invariant.
   - Avoid unrelated refactoring or opportunistic stylistic changes in a bug fix pull request.
2. **Preserve Compatibility**:
   - Ensure the fix does not break existing API contracts or require destructive schema migrations unless explicitly required for security remediation.
3. **Execute Reproduction Test**:
   - Re-run the reproduction test created in Step 1 to verify that it now passes reliably.

---

## Step 4: Regression Verification & Prevention

1. **Full Suite Regression Run**:
   - Execute the entire unit, integration, and E2E test suite to confirm zero unintended side effects:
     ```bash
     npm test
     ```
2. **Boundary & Stress Verification**:
   - Add boundary tests (e.g., empty arrays, null values, malformed unicode, high-concurrency requests) to harden the fixed component.
3. **Post-Mortem & Rule Update**:
   - If the bug resulted from an ambiguous architectural pattern or missing coding standard, update `.agents/rules/` to ensure agents and engineers avoid the mistake in future tasks.
