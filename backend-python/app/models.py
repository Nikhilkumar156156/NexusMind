from typing import List, Dict, Optional, Literal, Any
from pydantic import BaseModel, Field

class PatientProfile(BaseModel):
    age: int
    state: str
    district: Optional[str] = None
    family_income_annual: float = Field(default=0.0, description="Annual family income in INR")
    occupation: Optional[str] = None
    ration_card_status: Literal["BPL", "APL", "none", "unknown"] = "unknown"
    gender: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment_required: Optional[str] = None
    hospital_type: Literal["government", "private", "empanelled_private"] = "government"
    existing_documents: List[str] = Field(default_factory=list)

class SchemeChunk(BaseModel):
    chunk_id: str
    title: str
    content: str
    category: str  # "eligibility", "coverage", "documents", "application", "exclusions"

class GovernmentScheme(BaseModel):
    scheme_id: str
    scheme_name: str
    short_code: str
    issuing_body: str  # "central" or "state:<state_name>"
    covered_conditions: List[str]  # Tags / conditions covered
    covered_services: List[str]  # Surgery, ICU, hospitalization, medicines, diagnostics
    income_threshold_annual: Optional[float] = None  # None = no income limit
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    category_requirement: Optional[str] = None  # "BPL", "APL", "none", etc.
    applicable_states: Optional[List[str]] = None  # None = All India
    benefit_amount_or_formula: str
    max_benefit_amount: float
    required_documents: List[str]
    document_guidance: Dict[str, str] = Field(default_factory=dict)
    empanelled_hospitals_rule: str = "empanelled_or_government"  # "all_government", "empanelled_only", "any"
    source_url: str
    source_portal_name: str
    last_verified_date: str
    raw_document_chunks: List[SchemeChunk] = Field(default_factory=list)

class RuleCheckDetail(BaseModel):
    factor: str
    passed: bool
    partial: bool = False
    details: str

class RuleEvaluationResult(BaseModel):
    scheme_id: str
    status: Literal["PASS", "FAIL", "PARTIAL"]
    checks: Dict[str, RuleCheckDetail]
    missing_documents: List[str] = Field(default_factory=list)
    is_single_document_gap: bool = False
    gap_document: Optional[str] = None

class ClarificationQuestion(BaseModel):
    question_id: str
    scheme_id: str
    scheme_name: str
    document_name: str
    question_text: str
    options: List[str] = Field(default_factory=lambda: ["yes", "no", "not_sure"])
    patient_answer: Optional[str] = None
    guidance_if_no: Optional[str] = None

class RankedRecommendation(BaseModel):
    rank: int
    scheme_id: str
    scheme_name: str
    short_code: str
    issuing_body: str
    match_score_pct: int
    match_tier: str  # "Best Match", "Possible Match", "Alternative"
    status: Literal["PASS", "PARTIAL"]
    treatment_covered: bool
    patient_eligible: bool
    state_available: bool
    financial_assistance: str
    max_benefit_amount: float
    required_documents: List[str]
    matched_documents: List[str]
    missing_documents: List[str]
    source_url: str
    source_portal_name: str
    last_verified_date: str
    rule_summary: Dict[str, Any]
    application_steps: List[str] = Field(default_factory=list)

class SchemeAssessment(BaseModel):
    assessment_id: str
    patient_id: Optional[str] = None
    patient_profile: PatientProfile
    schemes_evaluated: List[Dict[str, Any]]
    pending_clarifications: List[ClarificationQuestion] = Field(default_factory=list)
    clarification_status: Literal["none", "pending", "resolved"] = "none"
    ranked_recommendations: List[RankedRecommendation] = Field(default_factory=list)
    created_at: str

class ClarifyRequest(BaseModel):
    question_id: str
    answer: Literal["yes", "no", "not_sure"]

class ExplainRequest(BaseModel):
    scheme_id: str
    perspective: Literal["why_eligible", "what_could_make_ineligible"]

class ExplanationResponse(BaseModel):
    scheme_id: str
    scheme_name: str
    perspective: str
    explanation: str
    traceable_rule_checks: Dict[str, Any]
    key_highlights: List[str]
    cautions_or_actions: List[str]

class IngestionLogEntry(BaseModel):
    ingestion_id: str
    source_url: str
    portal_name: str
    scheme_ids_updated: List[str]
    ingestion_status: Literal["success", "partial", "failed"]
    run_at: str
    records_ingested: int
    staleness_status: str
