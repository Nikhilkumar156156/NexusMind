---
name: backend-engineering
description: Runbook for developing robust backend services, 3-agent orchestration, Google Search MCP integration, and clinical ranking engines for Smart Care Navigator.
---

# Backend Engineering Runbook: Smart Care Navigator

This skill outlines the engineering standards and execution workflows for the Smart Care Navigator 3-Agent backend pipeline.

---

## 1. 3-Agent Orchestration Architecture

```
                 Client Request (Symptoms + Location)
                                 │
                                 ▼
                     [Fastify Route Handler]
                                 │
                                 ▼
                 [Agent 1: Symptom & Triage Engine]
                  - Rule-Based Emergency Gatekeeper
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

## 2. Agent 2: Google Search MCP Integration Guidelines

1. **Query Construction**:
   - For location = `"Hazaribagh"`, specialty = `"Neurology"`, emergency = `true`:
     - Query 1: `"{specialty} emergency hospital near {location}"`
     - Query 2: `"hospital {specialty} emergency department {location}"`
     - Query 3: `"{hospital_name} {specialty} OPD emergency"`
2. **Extraction Invariant**:
   - Extract: Hospital Name, Address, Phone Number, Operating Hours, Specialty Presence, Emergency Department Presence, Specialty Emergency Status.
3. **Hard OPD vs. Emergency Rule**:
   - Mark `specialty_mode = "OPD_ONLY"` if text indicates outpatient clinics on specific days without 24x7 acute cover.
   - Mark `specialty_mode = "EMERGENCY_AND_OPD"` only if emergency cover or 24x7 intensive care for that specialty is confirmed.
4. **Fallback Mechanism**:
   - If Google Search MCP fails or times out (8s limit), query the local PostgreSQL `hospital_research_cache` table for pre-seeded facilities in that district.

---

## 3. Agent 3: Ranking & Scoring Formula

Enforce the invariant: **Clinical Suitability > Proximity**.

```typescript
function calculateFacilityScore(facility: ResearchedFacility, triage: TriageResult): number {
  let score = 0;

  // 1. Emergency capability for required specialty (35 pts)
  if (triage.emergencyRequired) {
    if (facility.specialtyMode === 'EMERGENCY_AND_OPD') score += 35;
    else if (facility.specialtyMode === 'OPD_ONLY') score -= 20; // Heavy penalty for emergency case
  } else {
    if (facility.hasRequiredSpecialty) score += 30;
  }

  // 2. Emergency department presence (25 pts)
  if (facility.hasEmergencyDepartment) score += 25;

  // 3. Proximity score (15 pts max, decaying with distance)
  // 0-10km: 15pts, 10-50km: 10pts, 50-100km: 5pts
  if (facility.distanceKm <= 10) score += 15;
  else if (facility.distanceKm <= 50) score += 10;
  else if (facility.distanceKm <= 100) score += 5;

  // 4. Source reliability bonus (10 pts)
  if (facility.verificationStatus === 'verified') score += 10;
  else if (facility.verificationStatus === 'partially_verified') score += 5;

  return score;
}
```

---

## 4. Testing & Verification

1. Test acute stroke scenario: verifies that a 90km emergency-capable center outranks a 3km OPD-only center.
2. Test mild knee pain scenario: verifies that the 3km OPD clinic is prioritized due to proximity.
3. Test search failure: verifies graceful fallback to cached database records.
