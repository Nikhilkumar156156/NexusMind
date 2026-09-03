---
name: security-review
description: Comprehensive security audit, PII protection, clinical safety invariant verification, and OWASP Top 10 for LLM compliance runbook for Smart Care Navigator.
---

# Security Review & Clinical Safety Runbook: Smart Care Navigator

This skill outlines the auditing protocols, security checklists, and clinical safety invariant checks for **Smart Care Navigator**.

---

## 1. Clinical Safety Invariants (Non-Negotiable)

- [ ] **No Definitive Diagnosis**:
  - The system must never claim a definitive diagnosis (e.g. *"You have appendicitis"*).
  - All diagnosis text must use non-definitive clinical routing phrases: *"Symptoms indicate a possible acute appendicitis requiring immediate medical evaluation."*
- [ ] **Deterministic Emergency Gatekeeping**:
  - Acute danger signs (stroke signs, severe chest pain, severe dyspnea, uncontrolled bleeding) must unconditionally trigger `CRITICAL` urgency.
- [ ] **Hard OPD vs. Emergency Rule**:
  - Facilities with `specialty_mode: "OPD_ONLY"` must **never** be recommended as the primary destination for acute emergencies.
- [ ] **Clinical Suitability > Proximity**:
  - The closest facility is not automatically the best facility if it lacks the required emergency specialty capability.

---

## 2. Privacy & PII Isolation (Search Tool Shield)

- [ ] **Zero Patient PII to Google Search MCP**:
  - Agent 2 must receive strictly non-identifiable parameters: `{ location, required_specialty, emergency_required, search_queries }`.
  - Patient names, phone numbers, ages, addresses, or national IDs must **never** be forwarded to external search tools.
- [ ] **Anonymous Triage Sessions**:
  - Triage sessions must operate with ephemeral session tokens without mandatory user account creation.
- [ ] **Audit Logging Privacy**:
  - Free-form symptom complaints must be scrubbed from long-term application telemetry logs.

---

## 3. Secrets Management & OWASP LLM Top 10 Compliance

- [ ] **Zero Secrets in Code**:
  - No API keys (Gemini, Google Search MCP, PostgreSQL, Redis) committed to Git.
  - All credentials injected via validated `.env` files.
- [ ] **Prompt Injection Defense**:
  - User symptoms must be enclosed in `<patient_symptoms>` XML boundary delimiters.
  - System prompt explicitly instructs Agent 1 to treat user input strictly as symptom text and ignore any embedded instructions.
- [ ] **Web Content Sanitization**:
  - HTML, scripts, and markdown executable snippets returned from Google Search MCP must be sanitized before passing to Agent 3.
- [ ] **Rate Limiting & DoS Protection**:
  - Public triage endpoints must enforce rate limiting (e.g. 20 requests per minute per IP via `@fastify/rate-limit`).

---

## 4. Security Audit Protocol

When reviewing a PR or code modification, produce a structured audit report:

```markdown
### Security & Clinical Safety Audit Report

**Status**: [APPROVED | ACTION_REQUIRED | BLOCKED]

1. Clinical Safety Compliance:
   - Non-definitive diagnosis check: [PASS / FAIL]
   - OPD vs Emergency verification: [PASS / FAIL]
   - Acute danger gatekeeper: [PASS / FAIL]

2. PII Isolation Check:
   - Search tool input parameters verified PII-free: [PASS / FAIL]

3. Secrets & Injection Check:
   - Zero hardcoded secrets: [PASS / FAIL]
   - Boundary delimiters on LLM prompts: [PASS / FAIL]
```
