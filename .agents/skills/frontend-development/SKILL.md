---
name: frontend-development
description: Use when implementing or modifying frontend features, UI components, pages, forms, or frontend state.
---

# Frontend Development Runbook: Smart Care Navigator

This skill guides engineers and agents through authoring, styling, testing, and maintaining UI components for the **Smart Care Navigator**.

---

## 1. Stack & Design System

- **Framework**: Next.js 15+ (App Router), React 19, TypeScript (Strict).
- **Styling**: Tailwind CSS v4 with CSS Variables for dynamic acuity theming.
- **State Management**:
  - **Zustand**: Multi-screen form state, user location coordinates, active session token.
  - **TanStack Query v5**: Server data fetching, caching, deduplication, and SSE stream listeners.
- **Iconography**: Lucide React.
- **Forms & Validation**: React Hook Form + Zod resolvers.

---

## 2. 9-Screen Workflow Architecture

Components are organized by screen within `frontend/src/features/navigator/screens/`:

```
screens/
├── Screen1PatientInfo.tsx     # Age, sex, GPS auto-detect / manual district picker
├── Screen2SymptomAssess.tsx   # Complaint input, duration picker, severity selector
├── Screen3RedFlagCheck.tsx    # Acute danger signs (chest pain, speech, breathing)
├── Screen4TriageLoading.tsx   # Visual progress state with clinical heartbeat
├── Screen5TriageResult.tsx    # Prominent acuity card (CRITICAL, URGENT, NON-URGENT)
├── Screen6HospitalSearch.tsx  # Live Agent 2 Google Search MCP status feed
├── Screen7RecommendedList.tsx # Top 5 facility cards with verified status badges
├── Screen8FacilityDetail.tsx  # Complete department breakdown & source citations
└── Screen9NavigationPass.tsx  # 1-Tap emergency dialer, Google Maps, QR pass
```

---

## 3. UI Tokens & Clinical Badge Guidelines

### 3.1 Acuity Level Badges
- **🔴 CRITICAL**:
  ```tsx
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
    <AlertCircle className="w-4 h-4 text-red-600" />
    CRITICAL EMERGENCY
  </span>
  ```
- **🟡 URGENT**:
  ```tsx
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
    <Clock className="w-4 h-4 text-amber-600" />
    URGENT (WITHIN 12-24 HRS)
  </span>
  ```
- **🟢 NON-URGENT**:
  ```tsx
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
    <CheckCircle className="w-4 h-4 text-emerald-600" />
    NON-URGENT / ROUTINE
  </span>
  ```

### 3.2 OPD vs. Emergency Verification Badges
- `✓ 24x7 Emergency Specialty`: Green pill indicating confirmed acute emergency capacity.
- `⚠️ OPD Only (No Emergency)`: Amber pill with warning icon indicating facility is strictly outpatient for that specialty.

### 3.3 Verification Confidence Badges
- 🟢 `Verified`: Confirmed by official hospital domain or government health directory.
- 🟡 `Partially Verified`: General emergency confirmed; specialty coverage requires phone check.
- 🔴 `Unverified`: Single unverified web mention.

---

## 4. Mobile-First & Low-Connectivity Patterns

1. **Touch Targets**: Minimum `44x44px` for all buttons, cards, and radio selectors.
2. **1-Tap Emergency Actions**:
   - Phone dialer: `<a href="tel:${facility.contactNumber}">` with a prominent Call button.
   - Navigation: `<a href="https://maps.google.com/?q=${encodeURIComponent(facility.name)}" target="_blank">`.
3. **Offline & Low-Bandwidth**:
   - Initial client bundle `<150KB` gzip.
   - Cache recent triage sessions in `localStorage` or `IndexedDB` for offline access.

---

## 5. Verification Checklist

Before completing any frontend component:
1. `npm run typecheck` passes with zero errors.
2. Component handles `loading`, `error`, `empty`, and `offline` states.
3. Color contrast satisfies WCAG AA (minimum 4.5:1).
4. No hardcoded medical diagnosis text is present in UI copy.

Follow @docs/architecture.md.

Use the project's existing component architecture.

Before creating a new component:
- check whether an existing component can be reused
- avoid duplication
- maintain responsive behavior
- maintain accessibility

After implementation:
- run the frontend tests
- run linting
- verify the page in the browser