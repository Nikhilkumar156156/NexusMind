---
name: frontend-engineering
description: Runbook for authoring React 19 / Next.js UI components, styling with Tailwind CSS, state management, and accessible design patterns for Smart Care Navigator.
---

# Frontend Engineering Runbook: Smart Care Navigator

This skill guides engineers and autonomous agents through constructing the 9-screen UI workflow for the Smart Care Navigator.

---

## 1. 9-Screen Workflow Specification

```
Smart Care Navigator UI
│
├── Screen 1: Patient Information (Age, Sex, Location with GPS/Manual District Autocomplete)
├── Screen 2: Symptom Assessment (Primary Complaint, Duration, Severity)
├── Screen 3: Additional Questions (Targeted Acute Life-Threat Red Flags)
├── Screen 4: Triage Processing (Animated Progress Indicator)
├── Screen 5: Triage Result (Acuity Badge: CRITICAL, URGENT, NON-URGENT, Specialty)
├── Screen 6: Hospital Search (Live Agent 2 Google Search MCP Progress)
├── Screen 7: Recommended Facilities (Top 5 Ranked Cards with Verified Badges)
├── Screen 8: Facility Details (Complete Department Hours, Verification Notes, Sources)
└── Screen 9: Navigation / Call / Referral (1-Tap Emergency Call, Google Maps Directions)
```

---

## 2. Visual Design & Acuity Theming

Healthcare navigation requires immediate, unambiguous visual clarity, especially under stress:

### Acuity Badges
- **🔴 CRITICAL**: Emergency care required immediately. Red accent (`bg-red-500/10 text-red-600 border-red-500/20`).
- **🟡 URGENT**: Care required within 12–24 hours. Amber accent (`bg-amber-500/10 text-amber-600 border-amber-500/20`).
- **🟢 NON-URGENT**: Routine / Outpatient care. Green accent (`bg-emerald-500/10 text-emerald-600 border-emerald-500/20`).

### Verification Badges (Agent 2)
- 🟢 `Verified`: Official hospital site or government directory confirmed.
- 🟡 `Partially Verified`: Emergency verified, specialty needs call confirmation.
- 🔴 `Unverified`: Insufficient verifiable evidence online.

### OPD vs. Emergency Badges
- `✓ 24x7 Emergency Available`: High visibility green pill.
- `⚠️ OPD Only (No Emergency)`: High visibility amber pill with warning indicator.

---

## 3. Mobile-First & Low Connectivity Patterns

- **Touch Target Sizes**: All buttons, cards, and radio selectors must have a minimum touch target of 44x44px.
- **Offline / Low-Bandwidth Resilience**:
  - Keep initial bundle size minimal (<150KB gzip).
  - Cache recent triage results and hospital recommendations in `localStorage` or `IndexedDB`.
- **1-Tap Call & Navigation**:
  - Emergency phone numbers must use `tel:<number>` for instant phone dialer launch.
  - Navigation links must format directly to Google Maps coordinates / query strings.
