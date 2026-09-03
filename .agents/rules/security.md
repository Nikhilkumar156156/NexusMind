# Security & Threat Mitigation Invariants: Smart Care Navigator

Security and patient privacy are critical operational constraints for the Smart Care Navigator.

---

## 1. Patient PII Protection & Search Isolation

1. **Zero PII to Search Tools (Agent 2 Isolation)**:
   - When Agent 2 queries the internet via **Google Search MCP**, it must **never** receive or transmit:
     - Patient name
     - Patient phone number or address
     - Patient age or sex
     - National ID / Aadhaar / ABHA number
   - Agent 2 inputs are strictly restricted to:
     `{ location, required_specialty, emergency_required, search_queries }`
2. **Anonymous Triage Sessions**:
   - Triage sessions do not require patient accounts or personal identifiers to execute.
   - Sessions are identified by ephemeral UUID tokens stored locally on the client.

---

## 2. Secrets Management

1. **Zero Secret Leakage**:
   - Google Search MCP credentials, Gemini API keys, and database passwords must never be committed to Git.
   - Configuration must be loaded from validated environment variables via `.env`.
2. **Client-Side Safety**:
   - No private API keys or MCP server connection credentials may be exposed to the browser client. All external search tools and LLM gateways must be proxied through the Fastify backend service.

---

## 3. Input Validation & Injection Defense

1. **Prompt Injection Boundary Delimiters**:
   - Free-form patient symptom complaints must be sanitized and enclosed within structural `<patient_symptoms>` tags in the Agent 1 system prompt.
   - Explicit system instructions must forbid user input from overriding the clinical safety rules or forcing a definitive diagnosis.
2. **Web Content Sanitization (Agent 2 Search Results)**:
   - Raw HTML and snippets returned from Google Search MCP must be sanitized to strip scripts and malicious payloads before being processed by Agent 3.
   
 # Security Rules

- Never hardcode secrets.
- Never expose API keys in frontend code.
- Validate all external input.
- Authenticate protected endpoints.
- Enforce authorization server-side.
- Do not trust client-provided roles or permissions.
- Do not log passwords, tokens, or sensitive patient information.
- Use environment variables for secrets.