---
name: backend-development
description: Runbook for developing Fastify backend services, the 3-Agent orchestration pipeline (Triage, Google Search MCP Research, Recommendation), and structured JSON contracts for Smart Care Navigator.
---

# Backend Development Runbook: Smart Care Navigator

This skill guides engineers and agents through implementing, maintaining, and testing backend services, multi-agent pipelines, and external tool integrations for the **Smart Care Navigator**.

---

## 1. Stack & Architecture

- **Runtime**: Node.js 20+ LTS, Fastify (TypeScript Strict Mode).
- **Architecture**: Clean / Hexagonal Architecture (Domain $\to$ Application $\to$ Infrastructure $\to$ Presentation).
- **Persistence**: PostgreSQL 16+ via Drizzle ORM.
- **Cache**: Redis 7+ / In-memory fallback.
- **AI Gateway**: Google Gemini 2.0 / 1.5 via `@google/genai`.
- **Search Tool**: Google Search MCP client.

---

## 2. 3-Agent Orchestration Engine

```
               Client Request (Symptoms + Location)
                               │
                               ▼
                   [Fastify Route Handler]
                               │
                               ▼
               [Agent 1: Symptom & Triage Engine]
                - Rule-Based Red-Flag Gatekeeper
                - AI Clinical Symptom Understanding
                               │
                               ▼ (JSON: Urgency + Specialty)
               [Agent 2: Hospital Research Engine]
                - Google Search MCP Tool Queries
                - OPD vs. Emergency Verification
                - Source Classification
                               │
                               ▼ (JSON: Verified Facilities)
               [Agent 3: Recommendation Engine]
                - Clinical Suitability > Proximity Ranking
                - Explainable Rationale Generation
                               │
                               ▼
                  [Top 5 Ranked Response]
```

---

## 3. Implementation Guidelines per Agent

### Agent 1: Symptom & Triage Engine
- **Deterministic Red-Flag Gatekeeper**: Checks for acute stroke (FAST), crushing chest pain, severe respiratory distress, or severe hemorrhage. If positive, immediately assigns `CRITICAL` urgency.
- **AI Symptom Categorization**: Evaluates non-emergency symptoms and maps to a medical specialty (e.g. Cardiology, Neurology, Orthopedics, Pediatrics).
- **Safety Invariant**: Never issues a definitive diagnosis. Must use clinical routing phrases.

### Agent 2: Hospital Research via Google Search MCP
- **Query Construction**:
  - `"{specialty} emergency hospital near {location}"`
  - `"hospital {specialty} emergency department {location}"`
  - `"{hospital_name} {specialty} OPD emergency"`
- **Hard OPD vs. Emergency Rule**:
  - If a facility offers the required specialty only on outpatient clinic days, mark `specialty_mode: "OPD_ONLY"`.
  - If 24x7 emergency coverage or ICU support is confirmed, mark `specialty_mode: "EMERGENCY_AND_OPD"`.
  - If unverified, mark as `"Emergency [specialty] not verified"`.
- **Fallback**: If Google Search MCP fails or exceeds 8s timeout, query local `hospital_research_cache`.

### Agent 3: Facility Recommendation Engine
- **Invariant**: **Clinical Suitability > Proximity**.
- **Scoring**:
  - Verified emergency capability for required specialty: +35 pts
  - Overall emergency department active: +25 pts
  - Proximity (0–10km: +15, 10–50km: +10, 50–100km: +5)
  - Verified source reliability: +10 pts
  - Heavy penalty (-20 pts) for `OPD_ONLY` facility when `emergency_required: true`.
- **Explainability**: Generates plain-language reasoning for why facility #1 was chosen over closer alternatives.

---

## 4. Verification Checklist

1. `npm run typecheck` passes with zero errors.
2. Inter-agent payloads strictly validate against Zod contracts (`Agent1OutputSchema`, `Agent2OutputSchema`, `Agent3OutputSchema`).
3. Google Search MCP query timeout is enforced at 8 seconds.
4. Red-flag clinical scenarios correctly escalate to `CRITICAL` urgency.
