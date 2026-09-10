"""Deterministic Eligibility Rules Engine for MedVeda Government Scheme Finder.
Strictly separates rule checking from AI/LLM judgment.
Outputs PASS / FAIL / PARTIAL with a field-by-field audit trail.
"""

from typing import List, Dict, Tuple, Optional
from .models import PatientProfile, GovernmentScheme, RuleCheckDetail, RuleEvaluationResult

def normalize_doc_name(doc: str) -> str:
    """Normalizes document string for fuzzy comparison."""
    return doc.lower().replace('-', ' ').replace('_', ' ').strip()

def has_document(doc_required: str, existing_docs: List[str]) -> bool:
    """Checks if a required document is in the patient's existing documents."""
    req = normalize_doc_name(doc_required)
    for ex in existing_docs:
        ex_norm = normalize_doc_name(ex)
        if ex_norm in req or req in ex_norm:
            return True
        # Specific alias checks
        if "aadhaar" in req and "aadhaar" in ex_norm:
            return True
        if "ration" in req and "ration" in ex_norm:
            return True
        if "income" in req and "income" in ex_norm:
            return True
        if "bpl" in req and ("bpl" in ex_norm or "ration" in ex_norm):
            return True
        if "domicile" in req and ("domicile" in ex_norm or "resident" in ex_norm or "voter" in ex_norm):
            return True
        if "estimate" in req and ("estimate" in ex_norm or "medical certificate" in ex_norm or "prescription" in ex_norm):
            return True
        if "mcp" in req and ("mcp" in ex_norm or "rch" in ex_norm or "anc" in ex_norm):
            return True
        if "age" in req and ("aadhaar" in ex_norm or "birth" in ex_norm or "age" in ex_norm):
            return True
        if "tb" in req and ("tb" in ex_norm or "nikshay" in ex_norm or "diagnostic" in ex_norm):
            return True
    return False

def matches_medical_need(diagnosis: Optional[str], treatment: Optional[str], scheme: GovernmentScheme) -> Tuple[bool, str]:
    """Deterministically checks if diagnosis or treatment aligns with scheme coverage."""
    diag_str = (diagnosis or "").lower()
    treat_str = (treatment or "").lower()
    combined = f"{diag_str} {treat_str}"

    if not diagnosis and not treatment:
        return True, "No specific diagnosis provided; evaluated against general inpatient emergency coverage"

    # Universal / Broad Coverage Schemes
    if scheme.short_code in ["AB-PMJAY", "Vay Vandana (Seniors 70+)", "MJPJAY (Maharashtra)", "YSR Aarogyasri (AP)", "KASP (Kerala)", "CMCHIS (Tamil Nadu)"]:
        # Broad tertiary/secondary hospital coverage
        return True, f"Condition/treatment '{diagnosis or treatment}' is covered under the comprehensive procedure schedule of {scheme.short_code}"

    # Maternal / Infant specific
    if "pregnancy" in combined or "delivery" in combined or "maternal" in combined or "cesarean" in combined or "infant" in combined or "neonate" in combined:
        if scheme.short_code == "JSSK":
            return True, "Maternal delivery and neonatal inpatient care matches JSSK free coverage"
        if scheme.short_code == "RBSK":
            return True, "Pediatric / infant screening & intervention is eligible under RBSK"

    # Child specific
    if scheme.short_code == "RBSK":
        child_keywords = ["cleft", "heart defect", "congenital", "pediatric", "child", "malnutrition", "developmental", "cataract"]
        if any(k in combined for k in child_keywords):
            return True, "Pediatric condition matches RBSK 4Ds intervention schedule"

    # Tuberculosis specific
    if "tuberculosis" in combined or " tb" in combined or "cough" in combined or "pulmonary" in combined or "dots" in combined:
        if scheme.short_code == "Ni-kshay TB":
            return True, "Tuberculosis diagnosis directly matches Ni-kshay Poshan & free DOTS mandate"

    # Organ Transplant
    if "transplant" in combined or "kidney failure" in combined or "liver failure" in combined or "dialysis" in combined:
        if scheme.short_code in ["NOTP", "RAN", "Jharkhand MMGBUY", "HMDG", "PMNRF"]:
            return True, f"Organ failure/transplant matches {scheme.short_code} critical illness schedule"

    # Stroke / Neurology
    if "stroke" in combined or "paralysis" in combined or "neuro" in combined or "brain" in combined:
        stroke_schemes = ["AB-PMJAY", "Vay Vandana (Seniors 70+)", "RAN", "Jharkhand MMGBUY", "MJPJAY (Maharashtra)", "YSR Aarogyasri (AP)", "MA Gujarat", "Delhi DAN"]
        if scheme.short_code in stroke_schemes:
            return True, f"Neurology/Stroke trauma is covered under {scheme.short_code} super-specialty schedule"

    # Cardiac
    if "heart" in combined or "cardiac" in combined or "angioplasty" in combined or "bypass" in combined or "chest" in combined:
        cardiac_schemes = ["AB-PMJAY", "Vay Vandana (Seniors 70+)", "RAN", "HMDG", "PMNRF", "Jharkhand MMGBUY", "MJPJAY (Maharashtra)", "MA Gujarat"]
        if scheme.short_code in cardiac_schemes:
            return True, f"Cardiovascular disease & surgery is covered under {scheme.short_code}"

    # Cancer / Oncology
    if "cancer" in combined or "chemo" in combined or "tumor" in combined or "radiation" in combined or "malignan" in combined:
        cancer_schemes = ["AB-PMJAY", "RAN", "HMDG", "PMNRF", "Jharkhand MMGBUY", "MJPJAY (Maharashtra)", "MA Gujarat", "CMCHIS (Tamil Nadu)"]
        if scheme.short_code in cancer_schemes:
            return True, f"Oncology and surgical intervention is covered under {scheme.short_code}"

    # Keyword check against covered conditions
    for cond in scheme.covered_conditions:
        words = [w.lower() for w in cond.split() if len(w) > 3]
        for w in words:
            if w in combined:
                return True, f"Matches covered condition: {cond}"

    # If general surgery / hospitalization is needed
    if "surgery" in treat_str or "hospital" in treat_str or "icu" in treat_str:
        if any("surgery" in s.lower() or "hospitalization" in s.lower() for s in scheme.covered_services):
            return True, f"Required service ({treatment}) aligns with scheme's inpatient hospitalization coverage"

    # Not directly covered
    return False, f"Condition '{diagnosis}' does not explicitly match the covered critical illness categories for {scheme.short_code}"

def evaluate_scheme(patient: PatientProfile, scheme: GovernmentScheme) -> RuleEvaluationResult:
    """Deterministically evaluates one scheme against the patient profile.
    Returns PASS, FAIL, or PARTIAL, along with granular check details.
    """
    checks: Dict[str, RuleCheckDetail] = {}
    non_doc_failures: List[str] = []

    # 1. Location / State Check
    if scheme.applicable_states is None:
        checks["location"] = RuleCheckDetail(
            factor="location",
            passed=True,
            details=f"All-India Central Scheme applicable in {patient.state}"
        )
    else:
        patient_state_norm = patient.state.lower().strip()
        matched_state = any(patient_state_norm in s.lower() or s.lower() in patient_state_norm for s in scheme.applicable_states)
        if matched_state:
            checks["location"] = RuleCheckDetail(
                factor="location",
                passed=True,
                details=f"Patient state ({patient.state}) matches scheme territory: {', '.join(scheme.applicable_states)}"
            )
        else:
            checks["location"] = RuleCheckDetail(
                factor="location",
                passed=False,
                details=f"Scheme is restricted to {', '.join(scheme.applicable_states)}; patient is from {patient.state}"
            )
            non_doc_failures.append("location")

    # 2. Age Criteria Check
    age_ok = True
    age_reason = f"Patient age ({patient.age} years) is within permissible range"
    if scheme.age_min is not None and patient.age < scheme.age_min:
        age_ok = False
        age_reason = f"Requires minimum age of {scheme.age_min} years; patient is {patient.age}"
    elif scheme.age_max is not None and patient.age > scheme.age_max:
        age_ok = False
        age_reason = f"Requires maximum age of {scheme.age_max} years; patient is {patient.age}"
    checks["age"] = RuleCheckDetail(factor="age", passed=age_ok, details=age_reason)
    if not age_ok:
        non_doc_failures.append("age")

    # 3. Medical Need / Diagnosis Check
    med_ok, med_reason = matches_medical_need(patient.diagnosis, patient.treatment_required, scheme)
    checks["medical_need"] = RuleCheckDetail(factor="medical_need", passed=med_ok, details=med_reason)
    if not med_ok:
        non_doc_failures.append("medical_need")

    # 4. Income Eligibility Check
    if scheme.income_threshold_annual is None:
        checks["income"] = RuleCheckDetail(
            factor="income",
            passed=True,
            details="No annual family income ceiling (Universal coverage)"
        )
    else:
        if patient.family_income_annual <= scheme.income_threshold_annual:
            checks["income"] = RuleCheckDetail(
                factor="income",
                passed=True,
                details=f"Annual family income (₹{patient.family_income_annual:,.0f}) is below the scheme cap of ₹{scheme.income_threshold_annual:,.0f}"
            )
        else:
            checks["income"] = RuleCheckDetail(
                factor="income",
                passed=False,
                details=f"Annual family income (₹{patient.family_income_annual:,.0f}) exceeds the scheme threshold of ₹{scheme.income_threshold_annual:,.0f}"
            )
            non_doc_failures.append("income")

    # 5. Category / Ration Card Check
    if scheme.category_requirement is None:
        checks["category"] = RuleCheckDetail(
            factor="category",
            passed=True,
            details="Open to all socio-economic categories"
        )
    elif scheme.category_requirement.upper() == "BPL":
        # Check BPL ration card or low income
        if patient.ration_card_status == "BPL" or patient.family_income_annual <= 120000.0:
            checks["category"] = RuleCheckDetail(
                factor="category",
                passed=True,
                details="Patient fulfills BPL category criteria (BPL Ration Card or income <= ₹1.2L)"
            )
        elif patient.ration_card_status == "unknown":
            checks["category"] = RuleCheckDetail(
                factor="category",
                passed=True,
                partial=True,
                details="Ration card status unknown; self-attested low income evaluated provisionally"
            )
        else:
            # APL card holder
            if scheme.short_code in ["MJPJAY (Maharashtra)", "Jharkhand MMGBUY"]:
                # State schemes have broader orange card / income limits
                checks["category"] = RuleCheckDetail(
                    factor="category",
                    passed=True,
                    details="State scheme permits yellow and orange ration cards with income verification"
                )
            else:
                checks["category"] = RuleCheckDetail(
                    factor="category",
                    passed=False,
                    details=f"Requires BPL/Antyodaya status; patient holds {patient.ration_card_status} status"
                )
                non_doc_failures.append("category")

    # 6. Hospital Compatibility Check
    if scheme.empanelled_hospitals_rule == "all_government":
        if patient.hospital_type == "government":
            checks["hospital"] = RuleCheckDetail(
                factor="hospital",
                passed=True,
                details="Treatment in Government Hospital satisfies scheme mandate"
            )
        else:
            checks["hospital"] = RuleCheckDetail(
                factor="hospital",
                passed=False,
                details="Scheme benefits are restricted strictly to Government / Public Tertiary Hospitals"
            )
            non_doc_failures.append("hospital")
    else:
        # empanelled_or_government
        if patient.hospital_type in ["government", "empanelled_private"]:
            checks["hospital"] = RuleCheckDetail(
                factor="hospital",
                passed=True,
                details=f"Hospital type ({patient.hospital_type}) is eligible for cashless empanelled claims"
            )
        else:
            # Private non-empanelled
            checks["hospital"] = RuleCheckDetail(
                factor="hospital",
                passed=True,
                partial=True,
                details="Eligible subject to confirmation that the selected private facility holds active empanelment"
            )

    # 7. Document Availability Check
    missing_docs: List[str] = []
    for doc in scheme.required_documents:
        if not has_document(doc, patient.existing_documents):
            missing_docs.append(doc)

    if not missing_docs:
        checks["documents"] = RuleCheckDetail(
            factor="documents",
            passed=True,
            details=f"All required documents available ({', '.join(scheme.required_documents)})"
        )
    else:
        checks["documents"] = RuleCheckDetail(
            factor="documents",
            passed=False,
            partial=True,
            details=f"Missing {len(missing_docs)} required document(s): {', '.join(missing_docs)}"
        )

    # Outcome Determination
    has_non_doc_failure = len(non_doc_failures) > 0
    is_single_doc_gap = (not has_non_doc_failure) and (len(missing_docs) == 1)

    if not has_non_doc_failure and len(missing_docs) == 0:
        status = "PASS"
    elif not has_non_doc_failure and len(missing_docs) > 0:
        status = "PARTIAL"
    else:
        status = "FAIL"

    return RuleEvaluationResult(
        scheme_id=scheme.scheme_id,
        status=status,
        checks=checks,
        missing_documents=missing_docs,
        is_single_document_gap=is_single_doc_gap,
        gap_document=missing_docs[0] if is_single_doc_gap else None
    )
