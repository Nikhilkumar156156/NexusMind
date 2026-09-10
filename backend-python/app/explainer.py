"""Traceable Explanation Engine for MedVeda Government Scheme Finder.
Generates plain-language 'Why am I eligible?' and 'What could make me ineligible?' explanations
strictly grounded in the stored field-by-field Rules Engine comparison.
Prevents hallucination and decision drift.
"""

from typing import Dict, Any, List
from .models import GovernmentScheme, RuleEvaluationResult, ExplanationResponse

def generate_explanation(
    scheme: GovernmentScheme,
    rule_res: RuleEvaluationResult,
    perspective: str
) -> ExplanationResponse:
    """Produces verified, deterministic plain-language explanations traceable to rule results."""
    checks = rule_res.checks
    highlights: List[str] = []
    cautions: List[str] = []

    loc_check = checks.get("location")
    inc_check = checks.get("income")
    med_check = checks.get("medical_need")
    age_check = checks.get("age")
    cat_check = checks.get("category")
    hosp_check = checks.get("hospital")
    doc_check = checks.get("documents")

    if perspective == "why_eligible":
        # Build positive rationale
        reasons = []

        if loc_check and loc_check.passed:
            reasons.append(f"you are located in a covered territory ({loc_check.details})")
            highlights.append("✓ Territorial Eligibility: Fully covered in your home state.")

        if inc_check and inc_check.passed:
            reasons.append(f"your reported annual family income satisfies financial criteria ({inc_check.details})")
            highlights.append("✓ Economic Threshold: Income falls within verified scheme limits.")

        if med_check and med_check.passed:
            reasons.append(f"your diagnosis/treatment requirement aligns with covered clinical packages ({med_check.details})")
            highlights.append("✓ Clinical Coverage: Treatment procedure is an approved benefit package.")

        if age_check and age_check.passed:
            highlights.append(f"✓ Age Criterion: {age_check.details}")

        if cat_check and cat_check.passed:
            highlights.append("✓ Category Verification: Socio-economic category approved.")

        if hosp_check and hosp_check.passed:
            highlights.append(f"✓ Hospital Network: {hosp_check.details}")

        if not rule_res.missing_documents:
            highlights.append("✓ Documentation Ready: You hold all necessary baseline paperwork.")
        else:
            cautions.append(f"Notice: You have a partial documentation gap: {', '.join(rule_res.missing_documents)}.")

        explanation_text = (
            f"You appear eligible for {scheme.scheme_name} ({scheme.short_code}) primarily because "
            + "; furthermore, ".join(reasons)
            + f". This entitles you to financial assistance up to {scheme.benefit_amount_or_formula}."
        )

    else:
        # perspective == "what_could_make_ineligible"
        reasons_fail = []

        if rule_res.missing_documents:
            missing_str = ", ".join(rule_res.missing_documents)
            reasons_fail.append(f"Missing documentation: {missing_str}")
            cautions.append(f"⚠️ Missing paperwork: You must provide {missing_str} before claim pre-authorization.")

        if inc_check and not inc_check.passed:
            reasons_fail.append(inc_check.details)
            cautions.append(f"⚠️ Income limit: {inc_check.details}")

        if loc_check and not loc_check.passed:
            reasons_fail.append(loc_check.details)
            cautions.append(f"⚠️ Residency restriction: {loc_check.details}")

        if age_check and not age_check.passed:
            reasons_fail.append(age_check.details)
            cautions.append(f"⚠️ Age limitation: {age_check.details}")

        if hosp_check and not hosp_check.passed:
            reasons_fail.append(hosp_check.details)
            cautions.append("⚠️ Hospital empanelment: Seeking treatment at a non-empanelled private center will invalidate cashless coverage.")

        if not reasons_fail:
            reasons_fail.append(
                "Potential disqualification could occur if clinical diagnostic documentation is not signed by a designated civil surgeon, "
                "or if family income on renewal exceeds statutory limits."
            )
            cautions.append("💡 Note: Ensure your hospital submits pre-authorization prior to surgical admission.")

        explanation_text = (
            f"Key factors that could challenge or delay eligibility for {scheme.scheme_name} ({scheme.short_code}): "
            + " | ".join(reasons_fail)
            + ". Resolving these specific points will secure full coverage."
        )

    return ExplanationResponse(
        scheme_id=scheme.scheme_id,
        scheme_name=scheme.scheme_name,
        perspective=perspective,
        explanation=explanation_text,
        traceable_rule_checks={
            k: {"passed": v.passed, "details": v.details}
            for k, v in checks.items()
        },
        key_highlights=highlights,
        cautions_or_actions=cautions
    )
