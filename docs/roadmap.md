# Engineering Roadmap: Smart Care Navigator (36-Hour MVP)

**Target Milestone:** 36-Hour Working MVP  
**Current Status:** Sprint Hour 0–6 Completed (Architecture, Agent Governance & Specifications)  

---

## 36-Hour Execution Timeline

```
  Hours 0-6              Hours 6-14            Hours 14-22            Hours 22-28           Hours 28-34          Hours 34-36
┌──────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│ Foundation & │──────>│   Agent 1    │──────>│   Agent 2    │──────>│   Agent 3    │─────>│  Frontend 9  │────>│ Verification │
│  Governance  │       │ Triage Engine│       │Google Search │       │Recommendation│      │  Screen Flow │     │ & Safety Run │
└──────────────┘       └──────────────┘       └──────────────┘       └──────────────┘      └──────────────┘     └──────────────┘
```

---

## Sprint Breakdown & Deliverables

### Sprint 1 (Hours 0–6): Foundation, Specifications & Agent System (COMPLETED)
- [x] Complete PRD (`docs/PRD.md`) with 3-agent architecture, 9-screen flow, and safety invariants.
- [x] Complete Architecture (`docs/architecture.md`) with Google Search MCP tool integration, structured JSON contracts, and OPD vs. Emergency verification.
- [x] Complete Database Schema (`docs/database.md`) with lightweight triage sessions, facility research cache, and recommendations.
- [x] Complete API Contracts (`docs/api.md`) with pipeline and step-by-step endpoints.
- [x] Establish `.agents/rules/` and `.agents/skills/` tailored to clinical safety and healthcare navigation.

---

### Sprint 2 (Hours 6–14): Agent 1 — Symptom & Triage Engine
- [ ] Implement Rule-Based Emergency Detection (acute life-threat red flags: stroke, respiratory arrest, crushing chest pain).
- [ ] Implement AI Clinical Symptom Understanding (specialty mapping, urgency categorization).
- [ ] Enforce non-definitive diagnosis safety rule in system prompt.
- [ ] Author unit test suite covering 10 acute clinical triage scenarios.

---

### Sprint 3 (Hours 14–22): Agent 2 — Hospital Research & Verification
- [ ] Integrate Google Search MCP tool connector.
- [ ] Build dynamic query generator targeting nearby facilities and emergency departments.
- [ ] Implement **Hard OPD vs. Emergency Rule**:
  - Classify each facility: `EMERGENCY_AND_OPD` vs. `OPD_ONLY`.
  - Enforce rejection of OPD-only facilities as primary emergency destinations.
- [ ] Source reliability classification (Official > Gov Directory > Reputable > Other).
- [ ] Verification badge engine (🟢 Verified, 🟡 Partially Verified, 🔴 Unverified).
- [ ] Integration tests with live and mocked search responses.

---

### Sprint 4 (Hours 22–28): Agent 3 — Facility Recommendation Engine
- [ ] Implement ranking algorithm enforcing **Clinical Suitability > Proximity**.
- [ ] Multi-criteria scoring: Emergency capability, required specialty, clinical suitability, distance, and source reliability.
- [ ] Generate explainable plain-language justification for each recommended facility.
- [ ] Author unit tests ensuring distant verified emergency centers outrank closer OPD-only centers for critical emergencies.

---

### Sprint 5 (Hours 28–34): Frontend 9-Screen User Experience Flow
- [ ] Screen 1: Patient Information (Age, sex, GPS/manual location).
- [ ] Screen 2: Symptom Assessment (Complaint, onset, severity).
- [ ] Screen 3: Additional Targeted Questions (Red-flag check).
- [ ] Screen 4: Triage Processing (Live progress state).
- [ ] Screen 5: Triage Result (Urgency level, specialty, routing advice).
- [ ] Screen 6: Hospital Search (Live Agent 2 research progress).
- [ ] Screen 7: Recommended Facilities (Top 5 cards, badges, OPD vs. Emergency indicators).
- [ ] Screen 8: Facility Details (Full department breakdown and source citations).
- [ ] Screen 9: Navigation / Call / Referral (1-tap dialer, Google Maps, referral pass).

---

### Sprint 6 (Hours 34–36): Safety Audit, Polish & Verification
- [ ] Clinical safety invariant audit: zero definitive diagnoses, 100% emergency escalation on red flags.
- [ ] Low-connectivity & offline fallback verification.
- [ ] End-to-end smoke test from symptom input to 1-tap call/navigation.
