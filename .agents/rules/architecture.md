# Architecture Governance Rules — Smart Care Navigator

## 1. Source of Truth

The canonical architecture is defined in:

@docs/architecture.md

The agent MUST read and follow @docs/architecture.md before making architectural, cross-agent, data-flow, or contract changes.

Do not duplicate the canonical architecture in this Rule.

---

## 2. Architectural Authority

The architecture defined in @docs/architecture.md is authoritative.

Do not change without explicit human approval:

- agent responsibilities
- agent boundaries
- inter-agent JSON contracts
- transport protocols
- persistence architecture
- ranking logic
- clinical safety invariants
- PII boundaries
- external-tool data flows
- fallback behavior

---

## 3. Agent Boundaries

The approved pipeline is:

Frontend
→ Fastify API
→ Triage Agent
→ Research Agent
→ Recommendation Agent
→ Top 5 Ranked Results

Do not move responsibilities between agents merely for convenience.

Do not bypass the Fastify API boundary.

Do not allow one agent to silently assume responsibilities belonging to another agent.

---

## 4. Inter-Agent Contracts

All agent-to-agent communication MUST use the typed JSON schemas defined in:

@docs/architecture.md

Never use free-form natural language as an inter-agent API.

Before changing a contract:

1. Identify all producers.
2. Identify all consumers.
3. Update the canonical contract.
4. Update schema validation.
5. Update affected tests.
6. Check backward compatibility.
7. Obtain human approval when the change affects an architectural invariant.

---

## 5. Clinical Safety

The clinical safety requirements in @docs/architecture.md are mandatory.

Never:

- produce definitive medical diagnoses
- infer unverified emergency capability
- treat OPD availability as equivalent to 24x7 emergency capability
- allow proximity to override clinical suitability

Clinical routing indicators must not be presented as definitive diagnoses.

---

## 6. Emergency Verification

Emergency capability must be explicitly verified.

If emergency specialty capability cannot be verified, preserve the required:

"Emergency [specialty] not verified"

state.

Never convert:

OPD only
→
Emergency capable

without explicit evidence.

---

## 7. PII Isolation

External search/research tools must receive only the data explicitly permitted by @docs/architecture.md.

Never send:

- patient names
- phone numbers
- personal IDs
- unnecessary patient demographics
- unnecessary clinical information

to external search tools.

Do not expand external-tool payloads without human approval.

---

## 8. Ranking Integrity

Agent 3 MUST preserve the ranking principle:

Clinical suitability > proximity

Distance must never compensate for missing or unverified critical clinical capability.

---

## 9. Resilience

If Google Search MCP is unavailable:

- use the approved PostgreSQL fallback
- clearly identify cached registry data
- do not fabricate missing information
- do not convert cached information into verified live information
- do not silently change the fallback architecture

---

## 10. Change Discipline

Before making an architectural change:

1. Read @docs/architecture.md.
2. Identify affected components.
3. Identify affected contracts.
4. Identify affected data flows.
5. Identify affected tests.
6. Explain the architectural impact.
7. Obtain human approval when an invariant or boundary changes.

Prefer the smallest change that preserves the approved architecture.

---

## 11. Verification

After architectural changes:

- validate JSON schemas
- run unit tests
- run integration tests
- run type checking
- run linting
- verify agent boundaries
- verify PII isolation
- verify clinical safety invariants
- verify emergency/OPD distinction
- verify fallback behavior
- review the final Git diff

Do not declare an architectural change complete until verification succeeds.