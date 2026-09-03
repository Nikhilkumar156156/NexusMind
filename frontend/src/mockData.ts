export interface PatientInfo {
  age: number | '';
  sex: 'male' | 'female' | 'other' | '';
  location: string;
  hasGps: boolean;
  medicalHistory: string[];
}

export interface SymptomAssessment {
  primarySymptoms: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  additionalNotes: string;
}

export interface RedFlagAnswers {
  chestPain: boolean;
  facialDroopOrSpeech: boolean;
  breathingDistress: boolean;
  severeBleeding: boolean;
  unconsciousOrConfusion: boolean;
}

export type UrgencyLevel = 'CRITICAL' | 'URGENT' | 'NON_URGENT';

export interface TriageResult {
  urgency: UrgencyLevel;
  acuityBadge: string;
  requiredSpecialty: string;
  conditionCategory: string;
  clinicalRoutingAdvice: string;
  emergencyRequired: boolean;
}

export interface HospitalSource {
  type: 'official_website' | 'government_directory' | 'reputable_platform' | 'other';
  url: string;
  reliability: 'primary' | 'high' | 'moderate' | 'low';
}

export interface Facility {
  id: string;
  rank: number;
  name: string;
  address: string;
  distanceKm: number;
  distanceDisplay: string;
  hasEmergencyDepartment: boolean;
  specialtyMode: 'EMERGENCY_AND_OPD' | 'OPD_ONLY' | 'EMERGENCY_ONLY' | 'UNKNOWN';
  emergencySpecialtyVerified: boolean;
  verificationStatus: 'verified' | 'partially_verified' | 'unverified';
  explanation: string;
  contactNumber: string;
  operatingHours: string;
  departments: string[];
  sources: HospitalSource[];
}

export interface ReferralPass {
  passId: string;
  generatedAt: string;
  patientAge: number;
  patientSex: string;
  urgency: UrgencyLevel;
  conditionCategory: string;
  targetFacility: string;
  qrCodeMock: string;
}

export const INITIAL_PATIENT_INFO: PatientInfo = {
  age: 58,
  sex: 'female',
  location: 'Hazaribagh, Jharkhand',
  hasGps: true,
  medicalHistory: ['Hypertension']
};

export const INITIAL_SYMPTOMS: SymptomAssessment = {
  primarySymptoms: 'Sudden left-sided facial drooping, weakness in left arm, slurred speech',
  duration: '45 minutes',
  severity: 'severe',
  additionalNotes: 'Patient was having breakfast when symptoms abruptly started.'
};

export const INITIAL_RED_FLAGS: RedFlagAnswers = {
  chestPain: false,
  facialDroopOrSpeech: true,
  breathingDistress: false,
  severeBleeding: false,
  unconsciousOrConfusion: false
};

export const MOCK_FACILITIES: Facility[] = [
  {
    id: 'fac_1',
    rank: 1,
    name: 'Ranchi Super Specialty Hospital',
    address: 'Bariatu Road, Ranchi, Jharkhand (92 km via NH20)',
    distanceKm: 92.0,
    distanceDisplay: '92 km (Approx. 1 hr 45 min)',
    hasEmergencyDepartment: true,
    specialtyMode: 'EMERGENCY_AND_OPD',
    emergencySpecialtyVerified: true,
    verificationStatus: 'verified',
    explanation:
      'Recommended as the #1 destination because it provides 24x7 verified Emergency Neurology with an active acute stroke unit, on-call neurologist, and neuro-ICU. Closer district facilities provide neurology consultation through OPD clinics only.',
    contactNumber: '+91-651-2541234',
    operatingHours: '24x7 Emergency Services Active',
    departments: ['Emergency Medicine', 'Neurology & Stroke Unit', 'Cardiology', 'ICU / Critical Care'],
    sources: [
      {
        type: 'official_website',
        url: 'https://ranchisuperspecialty.org/stroke-unit',
        reliability: 'primary'
      },
      {
        type: 'government_directory',
        url: 'https://nhm.jharkhand.gov.in/tertiary-centers',
        reliability: 'high'
      }
    ]
  },
  {
    id: 'fac_2',
    rank: 2,
    name: 'Rajendra Institute of Medical Sciences (RIMS)',
    address: 'Bariatu, Ranchi, Jharkhand',
    distanceKm: 95.0,
    distanceDisplay: '95 km (Approx. 2 hrs)',
    hasEmergencyDepartment: true,
    specialtyMode: 'EMERGENCY_AND_OPD',
    emergencySpecialtyVerified: true,
    verificationStatus: 'verified',
    explanation:
      'Premier government tertiary medical college with comprehensive round-the-clock emergency neurology, CT/MRI diagnostics, and subsidized critical care admission.',
    contactNumber: '+91-651-2541533',
    operatingHours: '24x7 Casualty & Trauma Centre',
    departments: ['Casualty / Trauma', 'Neurology', 'Neurosurgery', 'Radiology (CT/MRI)'],
    sources: [
      {
        type: 'government_directory',
        url: 'https://rimsranchi.ac.in/emergency',
        reliability: 'high'
      }
    ]
  },
  {
    id: 'fac_3',
    rank: 3,
    name: 'Sadar Hospital Hazaribagh',
    address: 'Main Hospital Road, Hazaribagh, Jharkhand',
    distanceKm: 3.2,
    distanceDisplay: '3.2 km (Approx. 10 mins)',
    hasEmergencyDepartment: true,
    specialtyMode: 'OPD_ONLY',
    emergencySpecialtyVerified: false,
    verificationStatus: 'partially_verified',
    explanation:
      'Closest medical stabilization point for airway support, IV line placement, and blood pressure stabilization before ambulance transfer. Specialized Neurology is Outpatient (OPD) only on select weekdays; not equipped for acute thrombolysis.',
    contactNumber: '+91-6546-264210',
    operatingHours: '24x7 General Casualty | OPD: 9 AM - 1 PM',
    departments: ['General Casualty', 'General Medicine', 'Neurology (OPD Only)', 'Pediatrics'],
    sources: [
      {
        type: 'government_directory',
        url: 'https://hazaribag.nic.in/health-facilities',
        reliability: 'high'
      }
    ]
  },
  {
    id: 'fac_4',
    rank: 4,
    name: 'Bokaro General Hospital (BGH)',
    address: 'Sector 4, Bokaro Steel City, Jharkhand',
    distanceKm: 88.0,
    distanceDisplay: '88 km (Approx. 1 hr 55 min)',
    hasEmergencyDepartment: true,
    specialtyMode: 'EMERGENCY_AND_OPD',
    emergencySpecialtyVerified: true,
    verificationStatus: 'verified',
    explanation:
      '910-bed multi-specialty hospital with an active emergency trauma wing and neurological intensive care services.',
    contactNumber: '+91-6542-242301',
    operatingHours: '24x7 Emergency Services',
    departments: ['Emergency Services', 'Neurology', 'General Surgery', 'Intensive Care Unit'],
    sources: [
      {
        type: 'official_website',
        url: 'https://sail.co.in/en/plants/bokaro-steel-plant/medical-facilities',
        reliability: 'primary'
      }
    ]
  },
  {
    id: 'fac_5',
    rank: 5,
    name: 'Arogyam Hospital & Research Centre',
    address: 'Indraprastha Colony, Hazaribagh, Jharkhand',
    distanceKm: 4.8,
    distanceDisplay: '4.8 km (Approx. 15 mins)',
    hasEmergencyDepartment: true,
    specialtyMode: 'OPD_ONLY',
    emergencySpecialtyVerified: false,
    verificationStatus: 'partially_verified',
    explanation:
      'Local private hospital equipped with ICU and general emergency care. Specialized neurology intervention is visiting-consultant only; immediate phone verification recommended.',
    contactNumber: '+91-6546-271000',
    operatingHours: '24x7 Emergency | Visiting Specialty Clinics',
    departments: ['General ICU', 'Emergency Medicine', 'Visiting Neurology'],
    sources: [
      {
        type: 'reputable_platform',
        url: 'https://justdial.com/Hazaribag/Arogyam-Hospital',
        reliability: 'moderate'
      }
    ]
  }
];
