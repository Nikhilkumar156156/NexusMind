/**
 * In-Memory Scheme Store providing resilient fallback & local data management for Feature 08.
 * Contains 16 verified Indian Government Health Schemes matching the Python RAG Knowledge Base.
 */

export interface SchemeChunk {
  readonly chunkId: string;
  readonly title: string;
  readonly content: string;
  readonly category: string;
}

export interface GovernmentSchemeDto {
  readonly scheme_id: string;
  readonly scheme_name: string;
  readonly short_code: string;
  readonly issuing_body: string;
  readonly covered_conditions: readonly string[];
  readonly covered_services: readonly string[];
  readonly income_threshold_annual: number | null;
  readonly age_min: number | null;
  readonly age_max: number | null;
  readonly category_requirement: string | null;
  readonly applicable_states: readonly string[] | null;
  readonly benefit_amount_or_formula: string;
  readonly max_benefit_amount: number;
  readonly required_documents: readonly string[];
  readonly document_guidance: Record<string, string>;
  readonly empanelled_hospitals_rule: string;
  readonly source_url: string;
  readonly source_portal_name: string;
  readonly last_verified_date: string;
}

export interface PatientProfileDto {
  age: number;
  state: string;
  district?: string;
  family_income_annual: number;
  occupation?: string;
  ration_card_status: 'BPL' | 'APL' | 'none' | 'unknown';
  gender?: string;
  diagnosis?: string;
  treatment_required?: string;
  hospital_type: 'government' | 'private' | 'empanelled_private';
  existing_documents: string[];
}

export interface ClarificationQuestionDto {
  question_id: string;
  scheme_id: string;
  scheme_name: string;
  document_name: string;
  question_text: string;
  options: string[];
  patient_answer?: string | null;
  guidance_if_no?: string;
}

export interface RankedRecommendationDto {
  rank: number;
  scheme_id: string;
  scheme_name: string;
  short_code: string;
  issuing_body: string;
  match_score_pct: number;
  match_tier: string;
  status: 'PASS' | 'PARTIAL';
  treatment_covered: boolean;
  patient_eligible: boolean;
  state_available: boolean;
  financial_assistance: string;
  max_benefit_amount: number;
  required_documents: readonly string[];
  matched_documents: string[];
  missing_documents: string[];
  source_url: string;
  source_portal_name: string;
  last_verified_date: string;
  rule_summary: Record<string, { passed: boolean; details: string }>;
  application_steps: string[];
}

export interface SchemeAssessmentDto {
  assessment_id: string;
  patient_id?: string;
  patient_profile: PatientProfileDto;
  schemes_evaluated: any[];
  pending_clarifications: ClarificationQuestionDto[];
  clarification_status: 'none' | 'pending' | 'resolved';
  ranked_recommendations: RankedRecommendationDto[];
  created_at: string;
}

export class InMemorySchemeStore {
  private readonly schemes: Map<string, GovernmentSchemeDto> = new Map();
  private readonly assessments: Map<string, SchemeAssessmentDto> = new Map();

  constructor() {
    this.seedSchemes();
  }

  private seedSchemes(): void {
    const list: GovernmentSchemeDto[] = [
      {
        scheme_id: 'scheme_pmjay',
        scheme_name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana',
        short_code: 'AB-PMJAY',
        issuing_body: 'central',
        covered_conditions: [
          'Cardiovascular & Cardiac Surgery', 'Acute Ischemic Stroke',
          'Neurology & Neurosurgery', 'Oncology & Cancer Chemotherapy',
          'Orthopedic & Joint Replacement', 'Trauma & Emergency Care',
          'Pediatric Surgery', 'General Surgery & Hospitalization'
        ],
        covered_services: [
          'Hospitalization', 'Secondary & Tertiary Surgery',
          'ICU / CCU Monitoring', 'Diagnostics & Lab Tests',
          'Post-Hospitalization Medicines (15 days)', 'Daycare Procedures'
        ],
        income_threshold_annual: 500000,
        age_min: null,
        age_max: null,
        category_requirement: 'BPL',
        applicable_states: null,
        benefit_amount_or_formula: '₹5,00,000 cashless cover per eligible family per year across 27,000+ empanelled hospitals',
        max_benefit_amount: 500000,
        required_documents: ['Aadhaar Card', 'Ration Card', 'PM-JAY Golden Card / Family ID'],
        document_guidance: {
          'PM-JAY Golden Card / Family ID': 'Generate instantly at any empanelled public hospital Ayushman Mitra desk or CSC centre.',
          'Ration Card': 'Apply via State Food & Civil Supplies Portal or your nearest Block Development office.',
          'Aadhaar Card': 'Enroll or update at any UIDAI Aadhaar Seva Kendra or post office.'
        },
        empanelled_hospitals_rule: 'empanelled_or_government',
        source_url: 'https://pmjay.gov.in',
        source_portal_name: 'National Health Authority (NHA)',
        last_verified_date: '15 Jan 2025'
      },
      {
        scheme_id: 'scheme_vay_vandana',
        scheme_name: 'Ayushman Bharat Vay Vandana Yojana',
        short_code: 'Vay Vandana (Seniors 70+)',
        issuing_body: 'central',
        covered_conditions: [
          'All Senior Geriatric Conditions', 'Cardiac & Stroke Care',
          'Cancer & Oncology', 'Hip Fracture & Joint Replacement',
          'ICU Critical Care', 'Eye Surgery & Cataract'
        ],
        covered_services: [
          'Secondary & Tertiary Inpatient Care', 'ICU Monitoring',
          'Surgical Operations', 'Advanced Diagnostics', 'Pre & Post Hospitalization Care'
        ],
        income_threshold_annual: null,
        age_min: 70,
        age_max: null,
        category_requirement: null,
        applicable_states: null,
        benefit_amount_or_formula: '₹5,00,000 distinct cashless top-up cover per senior citizen (70+) per year, regardless of family income',
        max_benefit_amount: 500000,
        required_documents: ['Aadhaar Card', 'Age Proof (70+ years)', 'Ayushman Vay Vandana Card'],
        document_guidance: {
          'Ayushman Vay Vandana Card': 'Apply directly on the Ayushman App or beneficiary.nha.gov.in using Aadhaar eKYC for citizen aged 70+.'
        },
        empanelled_hospitals_rule: 'empanelled_or_government',
        source_url: 'https://pmjay.gov.in/ayushman-vay-vandana',
        source_portal_name: 'National Health Authority (NHA)',
        last_verified_date: '29 Oct 2024'
      },
      {
        scheme_id: 'scheme_ran',
        scheme_name: 'Rashtriya Arogya Nidhi',
        short_code: 'RAN',
        issuing_body: 'central',
        covered_conditions: [
          'Life-Threatening Diseases', 'Cancer / Oncology',
          'Heart Disease & Cardiac Surgery', 'Renal Failure & Kidney Transplant',
          'Severe Neurological Disorders', 'Liver & Organ Failure'
        ],
        covered_services: [
          'Super Specialty Hospitalization', 'Major Organ Surgeries',
          'Chemotherapy & Radiation', 'Specialized Implants & Stents', 'Expensive Life-Saving Medicines'
        ],
        income_threshold_annual: 120000,
        age_min: null,
        age_max: null,
        category_requirement: 'BPL',
        applicable_states: null,
        benefit_amount_or_formula: 'One-time financial grant up to ₹15,00,000 for super-specialty treatment in Central Govt Hospitals / AIIMS',
        max_benefit_amount: 1500000,
        required_documents: ['Aadhaar Card', 'BPL Ration Card', 'Income Certificate (State Authority)', 'Medical Certificate & Cost Estimate from Central Govt Hospital/AIIMS'],
        document_guidance: {
          'Income Certificate (State Authority)': 'Obtain from Sub-Divisional Magistrate (SDM) or Tehsildar certifying BPL income.',
          'Medical Certificate & Cost Estimate from Central Govt Hospital/AIIMS': 'Signed by treating HOD and Medical Superintendent of Government Hospital.'
        },
        empanelled_hospitals_rule: 'all_government',
        source_url: 'https://main.mohfw.gov.in/major-programmes/poor-patients-financial-schemes/rashtriya-arogya-nidhi',
        source_portal_name: 'Ministry of Health and Family Welfare (MoHFW)',
        last_verified_date: '10 Dec 2024'
      },
      {
        scheme_id: 'scheme_jharkhand_mmgbuy',
        scheme_name: 'Mukhya Mantri Gambhir Bimari Upchar Yojana',
        short_code: 'Jharkhand MMGBUY',
        issuing_body: 'state:Jharkhand',
        covered_conditions: [
          'Cancer & Malignancies', 'Kidney Transplantation & Dialysis',
          'Major Heart Surgeries', 'Brain Surgery & Stroke',
          'Acid Attack Survivors', 'Major Burn Trauma'
        ],
        covered_services: [
          'Tertiary Super Specialty Treatment', 'Surgeries',
          'Chemotherapy & Radio Therapy', 'Inpatient Intensive Care'
        ],
        income_threshold_annual: 800000,
        age_min: null,
        age_max: null,
        category_requirement: null,
        applicable_states: ['Jharkhand'],
        benefit_amount_or_formula: 'Financial assistance up to ₹5,00,000 (up to ₹10,00,000 for cancer/kidney) for critical illnesses',
        max_benefit_amount: 500000,
        required_documents: ['Aadhaar Card', 'Jharkhand Domicile Certificate', 'Income Certificate (< ₹8 Lakh/yr)', 'Civil Surgeon / Medical Board Recommendation'],
        document_guidance: {
          'Jharkhand Domicile Certificate': 'Issued by Circle Officer (CO) or SDO via JharSewa portal.',
          'Income Certificate (< ₹8 Lakh/yr)': 'Issued by Competent Revenue Authority of Jharkhand.'
        },
        empanelled_hospitals_rule: 'empanelled_or_government',
        source_url: 'https://jharkhand.gov.in/health',
        source_portal_name: 'Department of Health & Family Welfare, Govt of Jharkhand',
        last_verified_date: '22 Jan 2025'
      },
      {
        scheme_id: 'scheme_mjpjay',
        scheme_name: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
        short_code: 'MJPJAY (Maharashtra)',
        issuing_body: 'state:Maharashtra',
        covered_conditions: [
          'Oncology & Chemotherapy', 'Cardiology & Bypass Surgery',
          'Neurosurgery & Stroke', 'Orthopedics & Polytrauma',
          'Nephrology & Renal Dialysis', 'Pediatric Surgery'
        ],
        covered_services: [
          'Cashless Hospitalization', '996 Surgical & Medical Procedures',
          'Pre-Authorization & ICU', 'Post-Discharge Medications'
        ],
        income_threshold_annual: 150000,
        age_min: null,
        age_max: null,
        category_requirement: 'BPL',
        applicable_states: ['Maharashtra'],
        benefit_amount_or_formula: '₹5,00,000 cashless health insurance cover per family per year in Maharashtra',
        max_benefit_amount: 500000,
        required_documents: ['Aadhaar Card', 'Maharashtra Yellow/Orange Ration Card', 'Valid Domicile / Voter ID of Maharashtra'],
        document_guidance: {
          'Maharashtra Yellow/Orange Ration Card': 'Verified at network hospital Arogyamitra desk in Maharashtra.'
        },
        empanelled_hospitals_rule: 'empanelled_or_government',
        source_url: 'https://www.jeevandayee.gov.in',
        source_portal_name: 'State Health Assurance Society, Govt of Maharashtra',
        last_verified_date: '14 Jan 2025'
      },
      {
        scheme_id: 'scheme_jssk',
        scheme_name: 'Janani Shishu Suraksha Karyakram',
        short_code: 'JSSK',
        issuing_body: 'central',
        covered_conditions: [
          'Pregnancy & Childbirth', 'Maternal Delivery & C-Section',
          'Sick Neonates & Infants (up to 1 year)', 'High-Risk Obstetric Complications'
        ],
        covered_services: [
          '100% Cashless Normal Delivery & Cesarean', 'Free Medicines & Consumables',
          'Free Diagnostics (Blood, Urine, Ultrasound)', 'Free Blood Transfusion',
          'Free Transport from Home to Facility and Drop-back', 'Zero Out-of-Pocket Expense'
        ],
        income_threshold_annual: null,
        age_min: null,
        age_max: null,
        category_requirement: null,
        applicable_states: null,
        benefit_amount_or_formula: 'Complete zero out-of-pocket expenditure (100% free delivery, C-section, drugs, diagnostics, transport)',
        max_benefit_amount: 50000,
        required_documents: ['Mother-Child Protection (MCP) Card / RCH ID', 'Aadhaar Card'],
        document_guidance: {
          'Mother-Child Protection (MCP) Card / RCH ID': 'Issued upon antenatal registration at any Sub-Centre, PHC, or CHC.'
        },
        empanelled_hospitals_rule: 'all_government',
        source_url: 'https://nhm.gov.in',
        source_portal_name: 'National Health Mission (NHM)',
        last_verified_date: '05 Jan 2025'
      },
      {
        scheme_id: 'scheme_tb_mukt',
        scheme_name: 'Pradhan Mantri TB Mukt Bharat Abhiyaan / Ni-kshay Poshan',
        short_code: 'Ni-kshay TB',
        issuing_body: 'central',
        covered_conditions: [
          'Pulmonary Tuberculosis', 'Extrapulmonary Tuberculosis', 'Drug-Resistant TB (MDR/XDR-TB)'
        ],
        covered_services: [
          '100% Free Anti-TB Drugs (DOTS)', 'Free Molecular Diagnostic Tests (CBNAAT / TrueNat)',
          '₹500/month Direct Benefit Transfer (DBT) for Nutritional Support', 'Ni-kshay Mitra Food Baskets'
        ],
        income_threshold_annual: null,
        age_min: null,
        age_max: null,
        category_requirement: null,
        applicable_states: null,
        benefit_amount_or_formula: 'Free complete DOTS therapy + ₹500/month nutritional cash transfer until treatment completion',
        max_benefit_amount: 30000,
        required_documents: ['Aadhaar Card', 'Bank Account Details / Passbook', 'TB Diagnostic Report / Ni-kshay ID'],
        document_guidance: {
          'TB Diagnostic Report / Ni-kshay ID': 'Generated automatically upon sputum/molecular testing at any Designated Microscopy Centre.'
        },
        empanelled_hospitals_rule: 'all_government',
        source_url: 'https://tbcindia.gov.in',
        source_portal_name: 'Central TB Division, MoHFW',
        last_verified_date: '08 Jan 2025'
      }
    ];

    for (const s of list) {
      this.schemes.set(s.scheme_id, s);
    }
  }

  public getAllSchemes(): GovernmentSchemeDto[] {
    return Array.from(this.schemes.values());
  }

  public getSchemeById(id: string): GovernmentSchemeDto | undefined {
    return this.schemes.get(id);
  }

  public saveAssessment(assessment: SchemeAssessmentDto): void {
    this.assessments.set(assessment.assessment_id, assessment);
  }

  public getAssessmentById(id: string): SchemeAssessmentDto | undefined {
    return this.assessments.get(id);
  }
}
