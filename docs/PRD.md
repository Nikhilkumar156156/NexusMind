# Product Requirements Document (PRD): Smart Care Navigator

**Product Name:** Smart Care Navigator (Healthcare Care Navigation System)  
**Status:** Approved for Foundation & 36-Hour MVP  
**Version:** 1.0.0  

---

## 1. Executive Summary & Vision

**Smart Care Navigator** is an AI-driven, clinical-safety-first healthcare routing and triage platform engineered for patients and frontline health workers in underserved, rural, and tier-2/3 regions.

In many underserved areas, patients and community health workers face a dangerous dilemma when symptoms arise:
1. They do not know how serious their symptoms are.
2. They do not know which healthcare facility they should visit.
3. They do not know whether a nearby hospital actually has the required specialty department active—specifically distinguishing between **Outpatient (OPD)** and **24x7 Emergency** availability.
4. They lack reliable referral guidance, resulting in wasted critical travel time (e.g. traveling to a facility that has a neurology OPD once a week, but no emergency stroke care).

The Smart Care Navigator solves this by orchestrating a dedicated **3-Agent Autonomous Pipeline**:
- **Agent 1 (Symptom & Triage Agent)**: Rule-based emergency detection + AI-assisted clinical symptom understanding.
- **Agent 2 (Hospital Research Agent)**: Dynamically discovers nearby facilities via Google Search MCP and performs rigorous **OPD vs. Emergency** verification.
- **Agent 3 (Facility Recommendation Agent)**: Ranks facilities using the core invariant **Clinical Suitability > Proximity**, producing an explainable Top-5 recommendation list.

---

## 2. Target Users & Personas

1. **Patient (or Family Caregiver)**:
   - Needs immediate clarity on symptom urgency without medical jargon.
   - Needs clear directions to the right facility with 1-tap calling and navigation.
2. **Frontline Healthcare Worker (ASHA, ANM, Community Health Worker)**:
   - Needs structured clinical decision support to triage community patients in the field.
   - Needs to verify if a referral hospital has active emergency capability before putting a critical patient in transit.
3. **Hospital Staff (Emergency / Reception Desk)**:
   - Needs incoming patients to arrive at the correct department with an organized triage summary.
4. **Healthcare Administrator**:
   - Needs visibility into triage trends, referral bottlenecks, and regional healthcare capability gaps.

---

## 3. 36-Hour MVP Scope ("Must Haves")

| Capability | Scope Details |
| :--- | :--- |
| **Symptom Input** | Structured input for age, sex, location (GPS or manual town/district entry), primary complaint, onset/duration, severity, and red-flag checklist. |
| **Rule-Based & AI Triage** | Dual-tier triage: Immediate rule-based emergency detection for acute life threats + AI symptom comprehension. |
| **Safety Invariant: Non-Definitive Diagnosis** | The system **never** outputs a definitive diagnosis (e.g. "You have a stroke"). It outputs clinical routing guidance (e.g. "Symptoms indicate a possible neurological emergency requiring immediate medical evaluation"). |
| **Google Search MCP Research Agent** | Dynamically queries the web to discover local facilities and investigate actual departmental services. |
| **Hard OPD vs. Emergency Rule** | Verifies whether a required specialty is available 24x7 in the Emergency Department or solely as an Outpatient (OPD) clinic. High priority given to `Specialty + Emergency ✓`. Facilities with `Specialty + OPD only` are flagged as **unsuitable as primary destination for critical emergency cases**. |
| **Source Classification & Verification** | Classifies sources by reliability: Official Hospital Website > Government Directory > Official Gov Source > Reputable Health Platform > Other. Badges: 🟢 Verified, 🟡 Partially Verified, 🔴 Unverified. |
| **Explainable Top-5 Recommendation** | Displays Top 5 suitable facilities with plain-language clinical justification (e.g. "Recommended because it provides the required specialty through emergency services and is the nearest verified suitable facility"). |
| **Actionable Next Steps** | 1-tap phone dialer to hospital emergency desk, Google Maps turn-by-turn navigation, and digital referral pass generation. |

---

## 4. Frontend Screen Architecture (9 Core Screens)

The client application guides users through an intuitive 9-screen flow:

1. **Screen 1: Patient Information**: Age, sex, location (auto-detect GPS or manual district/town), relevant past medical history.
2. **Screen 2: Symptom Assessment**: Primary symptoms, duration/onset, severity scale (mild/moderate/severe).
3. **Screen 3: Additional Questions**: Targeted questions to rule in/out acute life threats (chest pain, speech difficulty, facial droop, breathing distress).
4. **Screen 4: Triage Processing**: Live visual progress indicator reflecting Agent 1 analysis.
5. **Screen 5: Triage Result**: Prominent urgency level (🔴 CRITICAL, 🟡 URGENT, 🟢 NON-URGENT), required specialty, and clear clinical routing advice.
6. **Screen 6: Hospital Search**: Live status of Agent 2 researching nearby facilities with Google Search MCP.
7. **Screen 7: Recommended Facilities**: Ranked Top 5 facility cards with distance, verified badges, and OPD vs. Emergency indicators.
8. **Screen 8: Facility Details**: Comprehensive breakdown of departments, operating hours, contact numbers, and source citations.
9. **Screen 9: Navigation / Call / Referral**: One-tap phone dialer, navigation route preview, and referral pass summary.

---

## 5. Non-Functional Requirements (NFRs)

- **Clinical Safety First**: Any red-flag symptom immediately triggers CRITICAL urgency.
- **Privacy & PII Protection**: Only non-identifiable parameters (`location`, `required_specialty`, `urgency`) are passed to the search agent. Patient names, phone numbers, and IDs are never sent to external search tools.
- **Mobile Responsive & Low Connectivity Support**: Optimized for budget Android smartphones; handles slow 2G/3G connections gracefully with cached fallback data.
- **Fast Response Time**: Triage classification within 1.5s; dynamic hospital research and ranking within 5s.
- **Failure Resilience**: If search fails or an emergency specialty cannot be verified, the UI displays explicit warning banners and provides direct facility contact buttons.
