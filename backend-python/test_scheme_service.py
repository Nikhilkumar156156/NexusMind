"""Unit verification test suite for Python Government Scheme Finder service."""

from app.models import PatientProfile, ClarifyRequest, ExplainRequest
from app.rag_engine import SchemeRAGPipeline

def run_tests():
    print("--- 1. Initializing Pipeline ---")
    pipeline = SchemeRAGPipeline()
    assert len(pipeline.kb.schemes) == 16
    print("PASS: 16 schemes indexed.")

    print("\n--- 2. Assessing Profile: Anita Devi (Stroke, BPL, Jharkhand) ---")
    profile = PatientProfile(
        age=58,
        state="Jharkhand",
        district="Hazaribagh",
        family_income_annual=85000.0,
        occupation="Agricultural Laborer",
        ration_card_status="BPL",
        gender="female",
        diagnosis="Acute Ischemic Stroke",
        treatment_required="Emergency Thrombectomy & ICU Hospitalization",
        hospital_type="government",
        existing_documents=["Aadhaar Card", "Ration Card"]
    )
    assessment = pipeline.assess_patient(profile)
    print(f"Assessment ID: {assessment.assessment_id}")
    print(f"Ranked Recommendations: {len(assessment.ranked_recommendations)}")
    for r in assessment.ranked_recommendations:
        print(f"  #{r.rank} [{r.match_tier}] {r.short_code} - {r.match_score_pct}% - Status: {r.status}")
        assert r.source_url.startswith("http")
        assert len(r.last_verified_date) > 0

    assert len(assessment.ranked_recommendations) > 0
    top_scheme = assessment.ranked_recommendations[0]
    assert top_scheme.match_score_pct >= 85
    print("PASS: Top recommendation ranked with high match score.")

    print(f"\n--- 3. Testing Single-Document Gap & Clarification Questions ---")
    print(f"Pending Clarifications: {len(assessment.pending_clarifications)}")
    for q in assessment.pending_clarifications:
        print(f"  Q [{q.scheme_name}]: {q.question_text}")

    if assessment.pending_clarifications:
        target_q = assessment.pending_clarifications[0]
        print(f"\n--- 4. Submitting Clarification Answer 'yes' for {target_q.document_name} ---")
        updated = pipeline.answer_clarification(assessment.assessment_id, target_q.question_id, "yes")
        assert target_q.document_name in updated.patient_profile.existing_documents
        print(f"PASS: Document '{target_q.document_name}' added to profile. Updated clarifications: {updated.clarification_status}")

    print("\n--- 5. Testing Traceable Explanations ---")
    explain_why = pipeline.explain_scheme(assessment.assessment_id, top_scheme.scheme_id, "why_eligible")
    assert "eligible" in explain_why.explanation.lower()
    print(f"Why eligible summary: {explain_why.explanation[:120]}...")
    print(f"Key highlights: {[h.encode('ascii', 'replace').decode() for h in explain_why.key_highlights]}")

    explain_ineligible = pipeline.explain_scheme(assessment.assessment_id, top_scheme.scheme_id, "what_could_make_ineligible")
    print(f"What could make ineligible summary: {explain_ineligible.explanation[:120]}...")
    assert len(explain_ineligible.cautions_or_actions) > 0

    print("\n--- 6. Testing Strict Failure Cases (Income Exceeds & Age Mismatch) ---")
    # Patient aged 30 applying for Senior Citizen Vay Vandana (70+)
    profile_young = PatientProfile(
        age=30,
        state="Maharashtra",
        family_income_annual=1500000.0,  # 15 Lakhs
        ration_card_status="APL",
        diagnosis="Cataract",
        treatment_required="Surgery"
    )
    assess_young = pipeline.assess_patient(profile_young)
    vay_vandana_eval = next((s for s in assess_young.schemes_evaluated if s["short_code"].startswith("Vay Vandana")), None)
    assert vay_vandana_eval["status"] == "FAIL"
    assert vay_vandana_eval["checks"]["age"]["passed"] is False
    print("PASS: Young patient correctly FAILs senior citizen age rule.")

    ran_eval = next((s for s in assess_young.schemes_evaluated if s["short_code"] == "RAN"), None)
    assert ran_eval["status"] == "FAIL"
    assert ran_eval["checks"]["income"]["passed"] is False
    print("PASS: High income patient correctly FAILs RAN poverty threshold rule.")

    print("\nALL 6 PYTHON SERVICE TESTS PASSED!")

if __name__ == "__main__":
    run_tests()
