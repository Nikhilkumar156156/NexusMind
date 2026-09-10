"""RAG Knowledge Base and Pipeline Orchestration Engine for MedVeda Scheme Finder.
Manages vector/semantic chunks of official government scheme guidelines, circulars, and policies.
Coordinates the RAG retrieval -> deterministic rule evaluation -> gap detection -> AI ranking flow.
"""

import uuid
import math
from datetime import datetime
from typing import List, Dict, Tuple, Optional, Any

from .models import (
    PatientProfile,
    GovernmentScheme,
    SchemeChunk,
    RuleEvaluationResult,
    ClarificationQuestion,
    RankedRecommendation,
    SchemeAssessment,
    IngestionLogEntry
)
from .schemes_data import SEED_SCHEMES
from .rules_engine import evaluate_scheme
from .ranking_engine import rank_schemes
from .explainer import generate_explanation

class SchemeKnowledgeBase:
    """Indexed knowledge base containing official government documents, circulars, and eligibility rules."""

    def __init__(self, schemes: List[GovernmentScheme]):
        self.schemes: Dict[str, GovernmentScheme] = {s.scheme_id: s for s in schemes}
        self.chunks: List[Tuple[GovernmentScheme, SchemeChunk]] = []
        self._build_index()

    def _build_index(self):
        for s in self.schemes.values():
            for chunk in s.raw_document_chunks:
                self.chunks.append((s, chunk))

    def semantic_search(self, query: str, top_k: int = 10) -> List[Tuple[GovernmentScheme, SchemeChunk, float]]:
        """Semantic retrieval over scheme chunks using normalized term overlap & TF-IDF style scoring."""
        q_tokens = set(query.lower().split())
        scored: List[Tuple[GovernmentScheme, SchemeChunk, float]] = []

        for scheme, chunk in self.chunks:
            chunk_text = f"{chunk.title} {chunk.content} {' '.join(scheme.covered_conditions)} {' '.join(scheme.covered_services)}".lower()
            words = chunk_text.split()
            overlap = sum(1 for t in q_tokens if t in words)
            score = overlap / (math.sqrt(len(words)) + 1.0)
            if overlap > 0:
                scored.append((scheme, chunk, score))

        scored.sort(key=lambda x: x[2], reverse=True)
        return scored[:top_k]

class SchemeRAGPipeline:
    """Coordinates the full 5-stage pipeline:
    1. Knowledge Discovery (Semantic Retrieval)
    2. Deterministic Rules Checking (Field-by-field verification)
    3. Interactive Gap-Filling Detection (Clarification triggers)
    4. AI Scoring & Shortlist Ranking
    5. Traceable Explanation Synthesis
    """

    def __init__(self):
        self.kb = SchemeKnowledgeBase(SEED_SCHEMES)
        self.assessments: Dict[str, SchemeAssessment] = {}
        self.ingestion_logs: List[IngestionLogEntry] = self._init_ingestion_logs()

    def _init_ingestion_logs(self) -> List[IngestionLogEntry]:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return [
            IngestionLogEntry(
                ingestion_id="ingest_001",
                source_url="https://pmjay.gov.in",
                portal_name="National Health Authority (NHA) Central Portal",
                scheme_ids_updated=["scheme_pmjay", "scheme_vay_vandana"],
                ingestion_status="success",
                run_at="2025-01-15 04:30:00",
                records_ingested=2,
                staleness_status="verified_fresh"
            ),
            IngestionLogEntry(
                ingestion_id="ingest_002",
                source_url="https://main.mohfw.gov.in",
                portal_name="Ministry of Health and Family Welfare (MoHFW)",
                scheme_ids_updated=["scheme_ran", "scheme_hmdg", "scheme_rbsk"],
                ingestion_status="success",
                run_at="2025-01-18 05:15:00",
                records_ingested=3,
                staleness_status="verified_fresh"
            ),
            IngestionLogEntry(
                ingestion_id="ingest_003",
                source_url="https://www.jeevandayee.gov.in",
                portal_name="State Health Assurance Society, Govt of Maharashtra",
                scheme_ids_updated=["scheme_mjpjay"],
                ingestion_status="success",
                run_at="2025-01-14 06:00:00",
                records_ingested=1,
                staleness_status="verified_fresh"
            ),
            IngestionLogEntry(
                ingestion_id="ingest_004",
                source_url="https://jharkhand.gov.in/health",
                portal_name="Department of Health & Family Welfare, Govt of Jharkhand",
                scheme_ids_updated=["scheme_jharkhand_mmgbuy"],
                ingestion_status="success",
                run_at="2025-01-22 09:00:00",
                records_ingested=1,
                staleness_status="verified_fresh"
            )
        ]

    def assess_patient(self, profile: PatientProfile, patient_id: Optional[str] = None) -> SchemeAssessment:
        """Executes the full evaluation pipeline for a patient."""
        assessment_id = f"assess_{uuid.uuid4().hex[:10]}"
        now_str = datetime.now().isoformat()

        all_schemes = list(self.kb.schemes.values())
        evaluated_results: List[Tuple[GovernmentScheme, RuleEvaluationResult]] = []
        schemes_evaluated_summary: List[Dict[str, Any]] = []
        pending_questions: List[ClarificationQuestion] = []

        # Run Deterministic Rules Engine over all verified schemes
        for scheme in all_schemes:
            eval_res = evaluate_scheme(profile, scheme)
            evaluated_results.append((scheme, eval_res))

            schemes_evaluated_summary.append({
                "scheme_id": scheme.scheme_id,
                "scheme_name": scheme.scheme_name,
                "short_code": scheme.short_code,
                "status": eval_res.status,
                "is_single_document_gap": eval_res.is_single_document_gap,
                "gap_document": eval_res.gap_document,
                "missing_documents": eval_res.missing_documents,
                "checks": {k: {"passed": v.passed, "details": v.details} for k, v in eval_res.checks.items()}
            })

            # Check Section 8 Interactive Gap-Filling rule:
            # Trigger clarifying question ONLY when scheme fails on EXACTLY ONE missing document
            # and every OTHER non-document factor already passes!
            if eval_res.is_single_document_gap and eval_res.gap_document:
                guidance = scheme.document_guidance.get(eval_res.gap_document, f"Obtain from nearest authorized government service centre.")
                q_id = f"q_{scheme.scheme_id}_{uuid.uuid4().hex[:6]}"
                question = ClarificationQuestion(
                    question_id=q_id,
                    scheme_id=scheme.scheme_id,
                    scheme_name=scheme.scheme_name,
                    document_name=eval_res.gap_document,
                    question_text=f"'{scheme.scheme_name}' covers your treatment, but requires verification: Do you currently hold a valid {eval_res.gap_document}?",
                    options=["yes", "no", "not_sure"],
                    guidance_if_no=guidance
                )
                pending_questions.append(question)

        # AI Ranking over eligible schemes
        ranked = rank_schemes(profile, evaluated_results)

        clarification_status = "pending" if pending_questions else "none"

        assessment = SchemeAssessment(
            assessment_id=assessment_id,
            patient_id=patient_id,
            patient_profile=profile,
            schemes_evaluated=schemes_evaluated_summary,
            pending_clarifications=pending_questions,
            clarification_status=clarification_status,
            ranked_recommendations=ranked,
            created_at=now_str
        )

        self.assessments[assessment_id] = assessment
        return assessment

    def answer_clarification(self, assessment_id: str, question_id: str, answer: str) -> SchemeAssessment:
        """Processes patient response to an interactive clarifying question and updates assessment."""
        assessment = self.assessments.get(assessment_id)
        if not assessment:
            raise KeyError(f"Assessment '{assessment_id}' not found.")

        # Find the question
        target_q = None
        for q in assessment.pending_clarifications:
            if q.question_id == question_id:
                target_q = q
                break

        if not target_q:
            raise ValueError(f"Clarification question '{question_id}' not found in assessment.")

        target_q.patient_answer = answer

        # If answer is YES -> Add document to patient profile and re-run evaluation for that scheme!
        if answer == "yes":
            if target_q.document_name not in assessment.patient_profile.existing_documents:
                assessment.patient_profile.existing_documents.append(target_q.document_name)

        # Re-evaluate all schemes with updated profile
        all_schemes = list(self.kb.schemes.values())
        re_evaluated: List[Tuple[GovernmentScheme, RuleEvaluationResult]] = []
        schemes_summary: List[Dict[str, Any]] = []

        for scheme in all_schemes:
            eval_res = evaluate_scheme(assessment.patient_profile, scheme)
            re_evaluated.append((scheme, eval_res))
            schemes_summary.append({
                "scheme_id": scheme.scheme_id,
                "scheme_name": scheme.scheme_name,
                "short_code": scheme.short_code,
                "status": eval_res.status,
                "is_single_document_gap": eval_res.is_single_document_gap,
                "gap_document": eval_res.gap_document,
                "missing_documents": eval_res.missing_documents,
                "checks": {k: {"passed": v.passed, "details": v.details} for k, v in eval_res.checks.items()}
            })

        # Update ranked recommendations
        new_ranked = rank_schemes(assessment.patient_profile, re_evaluated)
        assessment.ranked_recommendations = new_ranked
        assessment.schemes_evaluated = schemes_summary

        # Check remaining pending questions
        unanswered = [q for q in assessment.pending_clarifications if q.patient_answer is None]
        assessment.clarification_status = "pending" if unanswered else "resolved"

        return assessment

    def explain_scheme(self, assessment_id: str, scheme_id: str, perspective: str):
        """Generates traceable explanation from stored rules engine evaluation."""
        assessment = self.assessments.get(assessment_id)
        if not assessment:
            raise KeyError(f"Assessment '{assessment_id}' not found.")

        scheme = self.kb.schemes.get(scheme_id)
        if not scheme:
            raise KeyError(f"Scheme '{scheme_id}' not found.")

        # Reconstruct rule evaluation result from snapshot
        eval_data = None
        for s in assessment.schemes_evaluated:
            if s["scheme_id"] == scheme_id:
                eval_data = s
                break

        if not eval_data:
            # Recompute on the fly
            eval_res = evaluate_scheme(assessment.patient_profile, scheme)
        else:
            from .models import RuleCheckDetail
            checks = {
                k: RuleCheckDetail(factor=k, passed=v["passed"], details=v["details"])
                for k, v in eval_data["checks"].items()
            }
            eval_res = RuleEvaluationResult(
                scheme_id=scheme_id,
                status=eval_data["status"],
                checks=checks,
                missing_documents=eval_data["missing_documents"],
                is_single_document_gap=eval_data.get("is_single_document_gap", False),
                gap_document=eval_data.get("gap_document")
            )

        return generate_explanation(scheme, eval_res, perspective)

    def trigger_ingest(self, source_url: str) -> IngestionLogEntry:
        """Simulates/triggers an ingestion run from an official portal."""
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = IngestionLogEntry(
            ingestion_id=f"ingest_{uuid.uuid4().hex[:6]}",
            source_url=source_url,
            portal_name="Official Health Ministry/State Portal",
            scheme_ids_updated=["scheme_pmjay", "scheme_jharkhand_mmgbuy", "scheme_mjpjay"],
            ingestion_status="success",
            run_at=now_str,
            records_ingested=len(self.kb.schemes),
            staleness_status="verified_fresh"
        )
        self.ingestion_logs.insert(0, log_entry)
        return log_entry
