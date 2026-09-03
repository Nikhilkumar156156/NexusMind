---
name: code-review
description: Comprehensive review checklist and methodology for multi-agent code review, architectural compliance verification, security audits, and clinical safety in Smart Care Navigator.
---

# Code Review & Quality Assurance Runbook: Smart Care Navigator

This skill is invoked during automated code review cycles to verify that any code proposal, pull request, or agent modification adheres to the engineering foundation, architecture, security, and clinical safety invariants of the Smart Care Navigator.

---

## 1. Clinical Safety & Architectural Checklist

### Pillar 1: Clinical Safety Invariants
- [ ] **No Definitive Diagnosis**: Does the code/prompt strictly use non-definitive clinical routing phrases? (e.g. *"Symptoms indicate a possible neurological emergency..."* instead of *"You have a stroke"*).
- [ ] **Immediate Emergency Gatekeeping**: Are acute red-flag life threats immediately categorized as `CRITICAL` urgency?
- [ ] **Hard OPD vs. Emergency Rule**: Does the code strictly prohibit recommending an `OPD_ONLY` facility as the primary destination for an acute critical emergency?
- [ ] **Clinical Suitability > Proximity**: Does the ranking engine prioritize specialized emergency capability over geographic distance?

### Pillar 2: Architectural & Inter-Agent Boundaries
- [ ] Do Agent 1, Agent 2, and Agent 3 communicate strictly through typed JSON schemas?
- [ ] Is there zero unstructured natural-language chatter between agents?
- [ ] Is Agent 2 isolated behind the Google Search MCP connector with an 8s timeout and database cache fallback?

### Pillar 3: Privacy & Security (PII Isolation)
- [ ] Does Agent 2 receive **strictly non-identifiable parameters** (`location`, `required_specialty`, `urgency`)?
- [ ] Are patient names, phone numbers, ages, and IDs completely excluded from external search queries?
- [ ] Are API keys and MCP credentials kept strictly in server-side `.env` files?

### Pillar 4: Frontend Usability & Accessibility
- [ ] Does the UI strictly support the 9-screen navigation flow?
- [ ] Are acuity badges (🔴 CRITICAL, 🟡 URGENT, 🟢 NON-URGENT) and verification badges clearly displayed?
- [ ] Are 1-tap call (`tel:`) and Google Maps navigation buttons prominent and functional?

---

## 2. Review Decision Protocol

```markdown
### Code Review Summary: Smart Care Navigator

**Status**: [APPROVED | REQUEST_CHANGES | BLOCKED]

#### 1. Clinical Safety Assessment
- Non-definitive diagnosis compliance: [PASS / FAIL]
- OPD vs Emergency verification compliance: [PASS / FAIL]
- Red-flag detection: [PASS / FAIL]

#### 2. Architectural & Code Quality
- Structured JSON contract compliance: [PASS / FAIL]
- PII isolation to Search MCP: [PASS / FAIL]

#### 3. Required Fixes (if any)
```
