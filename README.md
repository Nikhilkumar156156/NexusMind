# Smart Care Navigator

> **AI-Powered Healthcare Navigation System with Clinical Triage & Dynamic Hospital Verification**

Smart Care Navigator is an autonomous, clinical-safety-first healthcare routing platform engineered for patients and frontline health workers in underserved, rural, and tier-2/3 regions. It dynamically assesses symptom urgency, identifies required specialties, investigates nearby hospital emergency vs. OPD availability using **Google Search MCP**, and recommends the Top 5 clinically suitable facilities with explainable rationales.

---

## 3-Agent Autonomous Pipeline

```
PATIENT / FRONTLINE HEALTH WORKER
             │
             ▼
┌─────────────────────────┐
│ AGENT 1                 │
│ Symptom & Triage Agent  │
└───────────┬─────────────┘
            │ Structured JSON (Urgency + Specialty)
            ▼
┌─────────────────────────┐
│ AGENT 2                 │
│ Hospital Research Agent │ <─── Tool: Google Search MCP
└───────────┬─────────────┘
            │ Structured JSON (Researched Facilities + OPD vs. Emergency)
            ▼
┌─────────────────────────┐
│ AGENT 3                 │
│ Facility Recommendation │
│ Agent                   │
└───────────┬─────────────┘
            │ Structured JSON (Ranked Top 5 + Plain-Language Explanations)
            ▼
   TOP 5 RECOMMENDATIONS
   [CALL] [NAVIGATE] [REFERRAL PASS]
```

---

## Core Invariants & Safety Principles

1. **Non-Definitive Diagnosis**: The system never issues a definitive diagnosis (e.g. *"You have a stroke"*). It issues clinical routing guidance (e.g. *"Symptoms indicate a possible neurological emergency requiring immediate medical evaluation"*).
2. **Hard OPD vs. Emergency Rule**: A facility with a specialty available only during Outpatient (OPD) clinics is **never** recommended as a primary destination for acute emergencies.
3. **Clinical Suitability > Proximity**: The closest hospital is not automatically the best if it lacks the required emergency specialty capability.
4. **Structured JSON Communication**: Agents communicate strictly through typed JSON schemas.
5. **Strict PII Isolation**: Patient identifiers are never sent to external search tools.

---

## 9-Screen Frontend Flow

```
Smart Care Navigator
│
├── 1. Patient Information (Age, Sex, Location)
├── 2. Symptom Assessment (Primary complaint, duration, severity)
├── 3. Additional Questions (Targeted red-flag checks)
├── 4. Triage Processing (Live progress indicator)
├── 5. Triage Result (Urgency level, specialty, routing advice)
├── 6. Hospital Search (Live Agent 2 Google Search MCP progress)
├── 7. Recommended Facilities (Top 5 cards, OPD vs Emergency badges)
├── 8. Facility Details (Complete department hours & source citations)
└── 9. Navigation / Call / Referral (1-tap dialer, Google Maps, QR pass)
```

---

## Monorepo Structure

```
NexusMind/
│
├── .agents/                      # Agent Governance Framework
│   ├── rules/
│   │   ├── architecture.md       # 3-Agent pipeline, OPD vs. Emergency rule
│   │   ├── coding-standards.md   # Non-definitive phrasing, Zod schemas
│   │   ├── security.md           # PII isolation, zero secret leakage
│   │   └── testing.md            # Deterministic clinical test cases
│   │
│   ├── skills/
│   │   ├── frontend/SKILL.md     # 9-Screen UI flow, acuity & verification badges
│   │   ├── backend/SKILL.md      # 3-Agent orchestration, Google Search MCP, scoring
│   │   └── code-review/SKILL.md  # 4-Pillar clinical safety and quality audit
│   │
│   └── workflows/
│       ├── feature.md            # Feature delivery protocol
│       ├── bug-fix.md            # Bug remediation workflow
│       └── release.md            # Release qualification runbook
│
├── docs/                         # Specifications & Blueprints
│   ├── PRD.md                    # Vision, personas, 36-hr MVP scope, NFRs
│   ├── architecture.md           # 3-Agent system architecture & JSON contracts
│   ├── database.md               # Triage sessions, hospital research cache, recommendations
│   ├── api.md                    # REST & SSE API contracts
│   └── roadmap.md                # 36-hour sprint milestones & quality gates
│
├── frontend/                     # Client application (Next.js 15, React 19, Tailwind)
├── backend/                      # API service & Agent Orchestrator (Fastify, Drizzle)
├── tests/                        # Test harness & clinical triage test cases
├── .env.example                  # Environment configuration template
├── package.json                  # Monorepo workspaces manifest
└── README.md                     # This document
```

---

## Quickstart

```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start development servers
npm run dev
```
