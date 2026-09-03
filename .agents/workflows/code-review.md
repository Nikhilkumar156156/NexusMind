# Code Review & Quality Verification Workflow

This workflow dictates the standardized, multi-agent code review procedure for all proposed features, bug fixes, schema changes, and architectural modifications in Smart Care Navigator.

---

## Code Review Lifecycle Stages

```
 ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
 │    Stage 1    │────>│    Stage 2    │────>│    Stage 3    │────>│    Stage 4    │
 │ Static & Type │     │Clinical Safety│     │ Architecture  │     │ Review Audit  │
 │  Verification │     │   Invariants  │     │  & Security   │     │  Decision     │
 └───────────────┘     └───────────────┘     └───────────────┘     └───────────────┘
```

---

## Stage 1: Static Analysis & Automated Verification

Before reviewing business logic, the reviewer must confirm all automated gates pass:

1. **Clean Type Checking**:
   - Zero TypeScript compiler errors:
     ```bash
     npm run typecheck
     ```
   - Zero `any` types present in changed files.
2. **Linting Compliance**:
   - Zero ESLint warnings or errors:
     ```bash
     npm run lint
     ```
3. **Automated Test Suite**:
   - All unit and integration tests must pass cleanly:
     ```bash
     npm test
     ```

---

## Stage 2: Clinical Safety Invariant Audit (Mandatory)

Reviewers must explicitly evaluate changes against the 4 core clinical safety invariants:

1. **Non-Definitive Phrasing Check**:
   - Verify that all diagnostic statements use clinical routing phrases rather than definitive diagnoses.
   - *Prohibited*: `"The patient is having an acute ischemic stroke."`
   - *Mandatory*: `"Symptoms indicate a possible neurological emergency requiring immediate medical evaluation."`
2. **Acute Danger Red-Flag Screening**:
   - Verify that any life-threatening symptoms (FAST stroke signs, chest pain, severe dyspnea, hemorrhage) immediately escalate to `CRITICAL` urgency.
3. **Hard OPD vs. Emergency Verification Rule**:
   - Ensure facilities with `specialty_mode: "OPD_ONLY"` are **never** recommended as the primary destination for acute emergencies.
4. **Clinical Suitability > Proximity**:
   - Ensure ranking logic prioritizes specialized 24x7 emergency capability over geographic distance.

---

## Stage 3: Architecture & Security Review

1. **Inter-Agent Structured JSON Contracts**:
   - Verify that all communication between Agent 1, Agent 2, and Agent 3 strictly adheres to typed Zod schemas. Natural language chatter between agents is prohibited.
2. **PII Isolation for External Search**:
   - Verify that Agent 2 and the Google Search MCP client receive **only** `{ location, required_specialty, emergency_required, search_queries }`.
   - Confirm zero patient identifiers (name, phone, age, national ID) are passed to search tools.
3. **Prompt Injection & Sanitization**:
   - Verify user symptoms are delimited within `<patient_symptoms>` XML tags.
   - Verify web search snippets are sanitized before consumption.
4. **Zero Hardcoded Secrets**:
   - Confirm no API keys or credentials exist in git diffs.

---

## Stage 4: Review Decision & Audit Template

Every review must conclude with a structured review report:

```markdown
### Code Review Audit Report: Smart Care Navigator

**Review Decision**: [APPROVED | REQUEST_CHANGES | BLOCKED]

#### 1. Automated Verification
- Typecheck: [PASS / FAIL]
- Linting: [PASS / FAIL]
- Tests passing: [PASS / FAIL]

#### 2. Clinical Safety Compliance
- Non-definitive diagnosis rule: [PASS / FAIL]
- Acute danger red-flag screening: [PASS / FAIL]
- OPD vs. Emergency verification rule: [PASS / FAIL]
- Clinical suitability > proximity rule: [PASS / FAIL]

#### 3. Security & Architecture Compliance
- PII isolation to Search MCP: [PASS / FAIL]
- Structured JSON schemas honored: [PASS / FAIL]
- Prompt boundary delimiters applied: [PASS / FAIL]

#### 4. Required Changes (if any)
- [Specific file, line, and remediation instructions]
```
