"""AI Ranking Engine for MedVeda Government Scheme Finder.
Applies weighted multi-factor scoring ONLY to schemes that PASSED or were resolved via clarification.
The LLM/ranking layer never determines eligibility itself; it ranks and orders eligible options.
"""

from typing import List, Dict, Any
from .models import PatientProfile, GovernmentScheme, RuleEvaluationResult, RankedRecommendation

def calculate_scheme_score(
    patient: PatientProfile,
    scheme: GovernmentScheme,
    rule_res: RuleEvaluationResult
) -> int:
    """Computes composite match percentage (0 - 100) using the 6 clinical & socio-economic factors."""
    # 1. Medical Need Match (25%)
    # Full 25 points if explicitly matched, 20 points if general tertiary
    med_detail = rule_res.checks.get("medical_need")
    if med_detail and med_detail.passed:
        if "directly" in med_detail.details or "super-specialty" in med_detail.details or "matches" in med_detail.details:
            medical_score = 25.0
        else:
            medical_score = 22.0
    else:
        medical_score = 10.0

    # 2. Financial Benefit Magnitude (20%)
    # Max benefit normalized against ₹15,00,000 top ceiling
    if scheme.max_benefit_amount >= 1000000.0:
        financial_score = 20.0
    elif scheme.max_benefit_amount >= 500000.0:
        financial_score = 18.0
    elif scheme.max_benefit_amount >= 250000.0:
        financial_score = 16.0
    elif scheme.max_benefit_amount >= 100000.0:
        financial_score = 14.0
    else:
        financial_score = 12.0

    # 3. Application Feasibility (20% - fewer missing documents = higher)
    total_docs = len(scheme.required_documents)
    missing_cnt = len(rule_res.missing_documents)
    if total_docs == 0:
        feasibility_score = 20.0
    else:
        doc_ratio = max(0.0, (total_docs - missing_cnt) / total_docs)
        feasibility_score = 10.0 + (doc_ratio * 10.0)

    # 4. Hospital Compatibility Match (15%)
    hosp_detail = rule_res.checks.get("hospital")
    if hosp_detail and hosp_detail.passed and not hosp_detail.partial:
        hospital_score = 15.0
    elif hosp_detail and hosp_detail.partial:
        hospital_score = 10.0
    else:
        hospital_score = 5.0

    # 5. Income Margin (10% - further below threshold = safer match)
    if scheme.income_threshold_annual is None:
        # Universal has no income constraint - full safety
        income_score = 10.0
    else:
        ratio = patient.family_income_annual / scheme.income_threshold_annual
        if ratio <= 0.5:
            income_score = 10.0
        elif ratio <= 0.8:
            income_score = 8.5
        elif ratio <= 1.0:
            income_score = 7.0
        else:
            income_score = 2.0

    # 6. Location Specificity (10%)
    # State-specific matching patient state gets 10; Central gets 9.0
    if scheme.applicable_states and patient.state.lower() in [s.lower() for s in scheme.applicable_states]:
        location_score = 10.0
    else:
        location_score = 9.0

    total_score = medical_score + financial_score + feasibility_score + hospital_score + income_score + location_score
    # Clamp to integer percentage (between 50% and 98%)
    return min(98, max(50, int(round(total_score))))

def rank_schemes(
    patient: PatientProfile,
    evaluated_schemes: List[Tuple[GovernmentScheme, RuleEvaluationResult]]
) -> List[RankedRecommendation]:
    """Ranks schemes that PASSED or have PARTIAL eligibility, ordering by match percentage."""
    # Filter only schemes that did not hard-fail
    eligible_pairs = [pair for pair in evaluated_schemes if pair[1].status in ["PASS", "PARTIAL"]]

    scored_items = []
    for scheme, rule_res in eligible_pairs:
        score = calculate_scheme_score(patient, scheme, rule_res)
        scored_items.append((score, scheme, rule_res))

    # Sort descending by score, then by max benefit amount
    scored_items.sort(key=lambda x: (x[0], x[1].max_benefit_amount), reverse=True)

    recommendations: List[RankedRecommendation] = []
    for idx, (score, scheme, rule_res) in enumerate(scored_items[:5], start=1):
        if idx == 1 and score >= 88:
            tier = "Best Match"
        elif score >= 75:
            tier = "Possible Match"
        else:
            tier = "Alternative"

        # Determine matched and missing documents
        matched_docs = [d for d in scheme.required_documents if d not in rule_res.missing_documents]

        steps = [
            f"Step 1: Verify presence of required credentials ({', '.join(scheme.required_documents[:2])}).",
            f"Step 2: Visit nearest empanelled hospital Helpdesk / Ayushman Mitra or official portal ({scheme.source_portal_name}).",
            "Step 3: Submit clinical cost estimate and biometric Aadhaar eKYC to initiate cashless pre-authorization."
        ]

        rec = RankedRecommendation(
            rank=idx,
            scheme_id=scheme.scheme_id,
            scheme_name=scheme.scheme_name,
            short_code=scheme.short_code,
            issuing_body=scheme.issuing_body,
            match_score_pct=score,
            match_tier=tier,
            status=rule_res.status,
            treatment_covered=rule_res.checks.get("medical_need", None).passed if rule_res.checks.get("medical_need") else True,
            patient_eligible=rule_res.status == "PASS" or len(rule_res.missing_documents) <= 1,
            state_available=rule_res.checks.get("location", None).passed if rule_res.checks.get("location") else True,
            financial_assistance=scheme.benefit_amount_or_formula,
            max_benefit_amount=scheme.max_benefit_amount,
            required_documents=scheme.required_documents,
            matched_documents=matched_docs,
            missing_documents=rule_res.missing_documents,
            source_url=scheme.source_url,
            source_portal_name=scheme.source_portal_name,
            last_verified_date=scheme.last_verified_date,
            rule_summary={
                k: {"passed": v.passed, "details": v.details}
                for k, v in rule_res.checks.items()
            },
            application_steps=steps
        )
        recommendations.append(rec)

    return recommendations
