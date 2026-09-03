# Coding Standards & Quality Invariants: Smart Care Navigator

These standards apply across the entire repository. Every engineer and AI agent must adhere strictly to these rules.

---

## 1. Clinical Language & Safety Rules

1. **Non-Definitive Phrasing Invariant**:
   - Prohibited: `"You have appendicitis"`, `"The patient is suffering from a stroke."`
   - Mandatory: `"Symptoms suggest a possible acute appendicitis requiring urgent in-person clinical evaluation."`
2. **Actionable Emergency Guidance**:
   - When `urgency === "CRITICAL"`, the UI and API messages must emphasize non-delay: `"Do not wait. Proceed immediately to the nearest emergency-capable facility listed below."`
3. **Verified Badge Indicators**:
   - The UI must render clear, standardized verification badges:
     - 🟢 `Verified`: Confirmed by official hospital website or government directory.
     - 🟡 `Partially Verified`: General emergency confirmed, specialty capability pending call confirmation.
     - 🔴 `Unverified`: Insufficient verifiable evidence online.

---

## 2. TypeScript & Boundary Validation

1. **Strict Mode & Zero `any`**:
   - TypeScript `strict: true`, `noImplicitAny: true`.
   - `any` is strictly prohibited. Use `unknown` with Zod runtime parsing.
2. **Schema-First Agent Payloads**:
   - Every agent input and output payload must be validated with Zod at runtime:
     - `TriageInputSchema`
     - `Agent1OutputSchema` (Urgency + Specialty)
     - `Agent2OutputSchema` (Researched Facilities + OPD/Emergency flags)
     - `Agent3OutputSchema` (Top 5 Ranked Recommendations + Plain-language explanations)
3. **Discriminated Union for Triage States**:
   ```typescript
   export type TriageUrgency = 'CRITICAL' | 'URGENT' | 'NON_URGENT';
   
   export type SpecialtyMode =
     | 'EMERGENCY_AND_OPD'
     | 'OPD_ONLY'
     | 'EMERGENCY_ONLY'
     | 'UNKNOWN';
   ```

---

## 3. Asynchronous Operations & Timeouts

1. **Fast Response Mandate**:
   - Agent 1 (Triage assessment) must resolve within 1.5 seconds.
   - Agent 2 (Google Search MCP) must enforce an 8-second global timeout per search query batch. If timed out, fall back immediately to cached regional hospital records.
2. **Error Wrapping**:
   - Catch search and AI provider failures gracefully and return structured partial states rather than unhandled 500 errors.
