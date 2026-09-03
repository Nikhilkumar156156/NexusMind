# API Specification: Smart Care Navigator

**API Version:** `v1`  
**Base URL:** `/api/v1`  
**Content-Type:** `application/json`  

---

## 1. Core Endpoints

### 1.1 Complete Care Navigation Pipeline (Recommended for UI)

#### `POST /api/v1/navigate/pipeline`
Executes the full 3-Agent workflow in sequence: Agent 1 (Triage) $\to$ Agent 2 (Research via Google Search MCP) $\to$ Agent 3 (Ranking & Explanation).

- **Request Body**:
  ```json
  {
    "age": 58,
    "sex": "female",
    "location": "Hazaribagh",
    "latitude": 23.99,
    "longitude": 85.36,
    "primarySymptoms": "Sudden onset left-sided facial drooping, left arm weakness, slurred speech",
    "additionalSymptoms": "Mild headache",
    "severity": "severe",
    "duration": "45 minutes",
    "vitals": {
      "bp": "160/100",
      "heartRate": 88
    },
    "medicalHistory": ["Hypertension"]
  }
  ```

- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "sessionId": "b4e87612-4c28-4091-a1b9-183fae506692",
      "triage": {
        "urgency": "CRITICAL",
        "acuityBadge": "🔴 CRITICAL",
        "emergencyRequired": true,
        "requiredSpecialty": "Neurology",
        "conditionCategory": "Suspected Acute Neurological Event",
        "clinicalRoutingAdvice": "Symptoms indicate a possible neurological emergency requiring immediate medical evaluation. Avoid giving food or water and proceed immediately."
      },
      "recommendations": [
        {
          "rank": 1,
          "name": "Ranchi Super Specialty Hospital",
          "distance": "92 km (Approx. 2 hrs via NH20)",
          "badges": {
            "emergencyDept": true,
            "specialtyEmergencyVerified": true,
            "status": "verified"
          },
          "specialtyMode": "EMERGENCY_AND_OPD",
          "explanation": "Recommended as the primary destination because it is the nearest verified facility offering 24x7 emergency neurology and acute stroke care. Closer local facilities have neurology OPD only.",
          "contactNumber": "+91-651-254XXXX",
          "navigationUrl": "https://maps.google.com/?q=Ranchi+Super+Specialty+Hospital",
          "sources": [
            { "type": "official_website", "url": "https://hospital.example.org" }
          ]
        },
        {
          "rank": 2,
          "name": "Sadar Hospital Hazaribagh",
          "distance": "3.2 km (Approx. 10 mins)",
          "badges": {
            "emergencyDept": true,
            "specialtyEmergencyVerified": false,
            "status": "partially_verified"
          },
          "specialtyMode": "OPD_ONLY",
          "explanation": "Nearest emergency stabilization point for immediate vitals support and airway management before tertiary transfer; specialized neurology is OPD only.",
          "contactNumber": "+91-6546-26XXXX",
          "navigationUrl": "https://maps.google.com/?q=Sadar+Hospital+Hazaribagh",
          "sources": [
            { "type": "government_directory", "url": "https://hazaribag.nic.in/health" }
          ]
        }
      ]
    },
    "meta": {
      "executionLatencyMs": 1840,
      "agentsInvoked": ["triage-agent", "hospital-research-agent", "facility-recommendation-agent"]
    }
  }
  ```

---

### 1.2 Individual Agent Endpoints (For Step-by-Step UI Flow)

#### `POST /api/v1/triage/assess` (Agent 1)
Evaluates symptoms and returns triage classification.

- **Request Body**: Same patient symptom parameters as pipeline.
- **Response**: Triage object (Urgency, Specialty, Advice).

#### `POST /api/v1/hospitals/research` (Agent 2)
Takes location, specialty, and emergency requirements; executes Google Search MCP tool and returns verified hospital candidates.

- **Request Body**:
  ```json
  {
    "location": "Hazaribagh",
    "requiredSpecialty": "Neurology",
    "emergencyRequired": true,
    "searchQueries": [
      "neurology emergency hospital near Hazaribagh",
      "hospital neurology emergency department Hazaribagh"
    ]
  }
  ```
- **Response**: Array of candidate facilities with OPD vs. Emergency verification status and source citations.

#### `POST /api/v1/recommendations/rank` (Agent 3)
Receives triage requirements and hospital candidates; returns Top 5 ranked list with plain-language explanations.

---

### 1.3 Streaming Progress Endpoint (SSE)

#### `GET /api/v1/navigate/stream/:sessionId`
Streams real-time progress updates as Agent 1 completes triage, Agent 2 queries Google Search MCP, and Agent 3 finalizes rankings:

- `event: triage_complete` $\implies$ `{ "urgency": "CRITICAL", "specialty": "Neurology" }`
- `event: researching_facilities` $\implies$ `{ "query": "neurology emergency near Hazaribagh", "source": "Google Search MCP" }`
- `event: facility_verified` $\implies$ `{ "name": "Sadar Hospital", "status": "OPD_ONLY" }`
- `event: recommendations_ready` $\implies$ `{ "topCount": 5 }`
