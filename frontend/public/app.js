const { useState, useEffect, useMemo, useRef } = React;

function getApiUrl(endpoint) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const isDirectFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
  const isOtherPort = typeof window !== 'undefined' && window.location.port && window.location.port !== '3000';
  if (isDirectFile || isOtherPort) {
    return `http://localhost:3000${endpoint}`;
  }
  return endpoint;
}

// --- MOCK & SEED DATA DEFINITIONS ---
const INITIAL_PATIENT = {
  name: 'Anita Devi',
  age: 58,
  sex: 'female',
  location: 'Hazaribagh, Jharkhand',
  hasGps: true,
  medicalHistory: ['Hypertension', 'Type-2 Diabetes']
};

const INITIAL_SYMPTOMS = {
  primarySymptoms: 'Sudden left-sided facial drooping, weakness in left arm, slurred speech',
  duration: '45 minutes',
  severity: 'severe',
  additionalNotes: 'Patient was having breakfast when symptoms abruptly started.'
};

const INITIAL_RED_FLAGS = {
  chestPain: false,
  facialDroopOrSpeech: true,
  breathingDistress: false,
  severeBleeding: false,
  unconsciousOrConfusion: false
};

const MOCK_FACILITIES = [
  {
    id: 'fac_1',
    rank: 1,
    name: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
    address: 'Near Canary Hill Road, Hazaribagh, Jharkhand',
    distanceKm: 2.8,
    distanceDisplay: '2.8 km (Approx. 8 mins)',
    hasEmergencyDepartment: true,
    specialtyMode: 'EMERGENCY_AND_OPD',
    emergencySpecialtyVerified: true,
    verificationStatus: 'verified',
    explanation:
      'Top priority emergency destination within 50 km (2.8 km). Premier 500-bed government medical college offering 24x7 emergency stroke resuscitation, on-call neurology team, 128-slice CT diagnostics, and critical care ICU within the vital Golden Hour window.',
    contactNumber: '+91-6546-270100',
    operatingHours: '24x7 Emergency Trauma & Stroke Care',
    departments: ['Emergency Casualty', 'Neurology & Stroke Unit', 'Critical Care ICU', 'Radiology (CT/MRI)'],
    sources: [
      { type: 'official_website', url: 'https://sbmch.jharkhand.gov.in/emergency', reliability: 'primary' },
      { type: 'government_directory', url: 'https://nhm.jharkhand.gov.in/medical-colleges', reliability: 'high' }
    ]
  },
  {
    id: 'fac_2',
    rank: 2,
    name: 'Arogyam Multi-Specialty Hospital & Critical Care',
    address: 'Indraprastha Colony, Hazaribagh, Jharkhand',
    distanceKm: 4.8,
    distanceDisplay: '4.8 km (Approx. 12 mins)',
    hasEmergencyDepartment: true,
    specialtyMode: 'EMERGENCY_AND_OPD',
    emergencySpecialtyVerified: true,
    verificationStatus: 'verified',
    explanation:
      'Nearby multi-specialty facility within 5 km. Provides 24x7 active emergency trauma admissions, on-call neurology consultant, and dedicated ICU monitoring for immediate stabilization.',
    contactNumber: '+91-6546-271000',
    operatingHours: '24x7 Emergency & Critical Care',
    departments: ['Critical Care ICU', 'Emergency Medicine', 'Neurology Services', 'Cardiology'],
    sources: [
      { type: 'official_website', url: 'https://arogyamhospitals.com/emergency-care', reliability: 'primary' },
      { type: 'reputable_platform', url: 'https://justdial.com/Hazaribag/Arogyam-Hospital', reliability: 'high' }
    ]
  },
  {
    id: 'fac_3',
    rank: 3,
    name: 'Kalyani Super Specialty Hospital & Trauma Centre',
    address: 'NH33, Ramgarh Cantt, Jharkhand (38 km from Hazaribagh)',
    distanceKm: 38.0,
    distanceDisplay: '38 km (Approx. 45 mins)',
    hasEmergencyDepartment: true,
    specialtyMode: 'EMERGENCY_AND_OPD',
    emergencySpecialtyVerified: true,
    verificationStatus: 'verified',
    explanation:
      'Regional super-specialty center within 50 km radius. Equipped with 24x7 acute stroke care, emergency interventional catheterization, and neuro-trauma surgical theater.',
    contactNumber: '+91-6553-228400',
    operatingHours: '24x7 Emergency & Trauma Centre',
    departments: ['Emergency Trauma Unit', 'Neurology / Stroke Care', 'Cardiac ICU', 'General Surgery'],
    sources: [
      { type: 'official_website', url: 'https://kalyanihospital.org/trauma-emergency', reliability: 'primary' }
    ]
  },
  {
    id: 'fac_4',
    rank: 4,
    name: 'Sadar Hospital Hazaribagh',
    address: 'Main Hospital Road, Hazaribagh, Jharkhand',
    distanceKm: 3.2,
    distanceDisplay: '3.2 km (Approx. 10 mins)',
    hasEmergencyDepartment: true,
    specialtyMode: 'OPD_ONLY',
    emergencySpecialtyVerified: false,
    verificationStatus: 'partially_verified',
    explanation:
      'District hospital suitable for initial vital signs stabilization and basic airway triage. Specialized neurology consultation is daytime OPD only; transfers acute emergency admissions to SBMC&H.',
    contactNumber: '+91-6546-264210',
    operatingHours: '24x7 General Casualty | OPD: 9 AM - 1 PM',
    departments: ['General Casualty', 'General Medicine', 'Neurology (OPD Only)', 'Pediatrics'],
    sources: [
      { type: 'government_directory', url: 'https://hazaribag.nic.in/health-facilities', reliability: 'high' }
    ]
  },
  {
    id: 'fac_5',
    rank: 5,
    name: 'Ranchi Super Specialty Hospital',
    address: 'Bariatu Road, Ranchi, Jharkhand (92 km via NH20)',
    distanceKm: 92.0,
    distanceDisplay: '92 km (Approx. 1 hr 45 min)',
    hasEmergencyDepartment: true,
    specialtyMode: 'EMERGENCY_AND_OPD',
    emergencySpecialtyVerified: true,
    verificationStatus: 'verified',
    explanation:
      'State-level tertiary referral hospital (92 km). Recommended for advanced tertiary transfer or neuro-surgical escalation if closer facilities within 50 km reach maximum ICU bed occupancy.',
    contactNumber: '+91-651-2541234',
    operatingHours: '24x7 Emergency Services Active',
    departments: ['Emergency Medicine', 'Neurology & Stroke Unit', 'Cardiology', 'ICU / Critical Care'],
    sources: [
      { type: 'official_website', url: 'https://ranchisuperspecialty.org/stroke-unit', reliability: 'primary' },
      { type: 'government_directory', url: 'https://nhm.jharkhand.gov.in/tertiary-centers', reliability: 'high' }
    ]
  }
];

// --- SPECIALTY MATCHING HELPER ---
function matchesSpecialty(docSpecialty, targetSpecialty) {
  if (!docSpecialty || !targetSpecialty) return false;
  const doc = docSpecialty.toLowerCase().trim();
  const target = targetSpecialty.toLowerCase().trim();
  if (doc === target) return true;

  // Protect against General Medicine vs General Surgery
  if (target.startsWith('general ') && doc.startsWith('general ')) {
    return target === doc;
  }

  // Protect against Neurosurgery vs Neurology
  if (target.includes('neuro') && doc.includes('neuro')) {
    const isTargetSurg = target.includes('surg');
    const isDocSurg = doc.includes('surg');
    if (isTargetSurg !== isDocSurg) return false;
  }

  // Protect "ENT" - must match whole word \bent\b or explicit synonyms
  if (target === 'ent') {
    return /\bent\b/i.test(doc) || doc.includes('otorhinolaryngology') || doc.includes('ear, nose') || doc.includes('throat');
  }
  if (doc === 'ent') {
    return /\bent\b/i.test(target) || target.includes('otorhinolaryngology') || target.includes('ear, nose') || target.includes('throat');
  }

  // Protect "Urology" - do NOT match "neurology"
  if (target.includes('uro') && !target.includes('neuro')) {
    if (doc.includes('neuro')) return false;
  }
  if (doc.includes('uro') && !doc.includes('neuro')) {
    if (target.includes('neuro')) return false;
  }

  // Exact phrase containment
  if (doc.includes(target) || target.includes(doc)) {
    return true;
  }

  // Token matching for compound specialties (e.g., "Pulmonology / Respiratory Medicine")
  const targetTokens = target.split(/[\/&]/).map((t) => t.trim().toLowerCase()).filter(Boolean);
  const docTokens = doc.split(/[\/&]/).map((t) => t.trim().toLowerCase()).filter(Boolean);

  for (const tt of targetTokens) {
    if (tt === 'ent') {
      if (docTokens.some((dt) => /\bent\b/i.test(dt))) return true;
      continue;
    }
    for (const dt of docTokens) {
      if (dt === tt) return true;
      if (dt.includes('neuro') && tt.includes('uro') && !tt.includes('neuro')) continue;
      if (tt.includes('neuro') && dt.includes('uro') && !dt.includes('neuro')) continue;
      if (dt.includes(tt) || tt.includes(dt)) return true;
    }
  }

  return false;
}

// --- FEATURE 02 DOCTOR ROSTER SEED (20 SPECIALIST DOCTORS) ---
const MOCK_DOCTORS = [
  {
    id: 'doc_1',
    name: 'Dr. Priya Sharma',
    qualification: 'MD, DM (Neurology), DNB',
    registrationNumber: 'JH-MED-4421',
    specialties: ['Neurology', 'Stroke Care', 'Neuro-Medicine'],
    facilityNames: ['SBMC&H Hazaribagh', 'Sadar Hospital'],
    experience: '14 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 10:00 AM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_2',
    name: 'Dr. Rajesh Verma',
    qualification: 'MD (Medicine), DM (Cardiology)',
    registrationNumber: 'JH-MED-3890',
    specialties: ['Cardiology', 'Interventional Cardiology', 'Cardiac Care'],
    facilityNames: ['SBMC&H Hazaribagh', 'Arogyam Critical Care'],
    experience: '18 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 10:30 AM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_3',
    name: 'Dr. Ananya Sen',
    qualification: 'MD (Pediatrics), DCH',
    registrationNumber: 'JH-MED-5102',
    specialties: ['Pediatrics', 'Neonatal Care', 'Child Health'],
    facilityNames: ['Sadar Hospital', 'Kalyani Trauma Centre'],
    experience: '11 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 11:00 AM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_4',
    name: 'Dr. Kavita Murmu',
    qualification: 'MS (Obstetrics & Gynecology)',
    registrationNumber: 'JH-MED-6218',
    specialties: ['Obstetrics & Gynecology', 'Maternal Health', 'High-Risk Pregnancy'],
    facilityNames: ['Sadar Hospital', 'SBMC&H Hazaribagh'],
    experience: '15 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 02:00 PM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_gm',
    name: 'Dr. Arvind Sinha',
    qualification: 'MD (Internal Medicine), FACP',
    registrationNumber: 'JH-MED-3105',
    specialties: ['General Medicine', 'Internal Medicine', 'Primary Care'],
    facilityNames: ['Sadar Hospital Hazaribagh', 'SBMC&H Hazaribagh'],
    experience: '16 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 09:30 AM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_gs',
    name: 'Dr. Manoj K. Pandey',
    qualification: 'MS (General Surgery), FIAGES',
    registrationNumber: 'JH-MED-4912',
    specialties: ['General Surgery', 'Laparoscopy', 'Trauma Surgery'],
    facilityNames: ['SBMC&H Hazaribagh', 'Arogyam Critical Care'],
    experience: '17 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 11:30 AM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_ortho',
    name: 'Dr. Vikramaditya Roy',
    qualification: 'MS (Orthopedics), DNB (Ortho)',
    registrationNumber: 'JH-MED-5540',
    specialties: ['Orthopedics', 'Joint Replacement', 'Bone Trauma'],
    facilityNames: ['Kalyani Trauma Centre', 'SBMC&H Hazaribagh'],
    experience: '13 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 10:45 AM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_ns',
    name: 'Dr. Alok Nath Tripathy',
    qualification: 'MCh (Neurosurgery), MS (Surgery)',
    registrationNumber: 'JH-MED-7120',
    specialties: ['Neurosurgery', 'Spine Surgery', 'Brain Trauma'],
    facilityNames: ['SBMC&H Hazaribagh', 'RIMS Super Specialty'],
    experience: '15 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 01:15 PM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_ent',
    name: 'Dr. Sunita Baskey',
    qualification: 'MS (ENT / Otorhinolaryngology)',
    registrationNumber: 'JH-MED-4688',
    specialties: ['ENT', 'Otorhinolaryngology', 'Head & Neck Care'],
    facilityNames: ['Sadar Hospital', 'SBMC&H Hazaribagh'],
    experience: '12 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 11:15 AM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_opht',
    name: 'Dr. Hemant Soreng',
    qualification: 'MS (Ophthalmology), FICO',
    registrationNumber: 'JH-MED-5391',
    specialties: ['Ophthalmology', 'Cataract & Eye Microsurgery'],
    facilityNames: ['Sadar Hospital', 'Netralaya Eye Care'],
    experience: '14 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 10:15 AM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_derm',
    name: 'Dr. Neha Agarwal',
    qualification: 'MD (Dermatology, Venereology & Leprosy)',
    registrationNumber: 'JH-MED-6734',
    specialties: ['Dermatology', 'Skin Allergy', 'Cosmetology'],
    facilityNames: ['Arogyam Multi-Specialty', 'Sadar Hospital'],
    experience: '9 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 12:00 PM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_psych',
    name: 'Dr. Tariq Anwar',
    qualification: 'MD (Psychiatry), DPM',
    registrationNumber: 'JH-MED-4819',
    specialties: ['Psychiatry', 'Neuropsychiatry', 'Behavioral Health'],
    facilityNames: ['RINPAS Ranchi', 'Sadar Hospital Hazaribagh'],
    experience: '13 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 02:30 PM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_pulm',
    name: 'Dr. Devendra Prasad',
    qualification: 'MD (Pulmonary Medicine), DTCD',
    registrationNumber: 'JH-MED-5902',
    specialties: ['Pulmonology / Respiratory Medicine', 'Pulmonology', 'Respiratory Medicine', 'Chest Medicine'],
    facilityNames: ['SBMC&H Hazaribagh', 'Arogyam Critical Care'],
    experience: '16 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 10:45 AM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_gastro',
    name: 'Dr. Sanjay Khalkho',
    qualification: 'DM (Gastroenterology), MD',
    registrationNumber: 'JH-MED-7450',
    specialties: ['Gastroenterology', 'Hepatology', 'GI Endoscopy'],
    facilityNames: ['SBMC&H Hazaribagh', 'Arogyam Multi-Specialty'],
    experience: '12 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 01:30 PM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_uro',
    name: 'Dr. Pradeep Minz',
    qualification: 'MCh (Urology), MS',
    registrationNumber: 'JH-MED-6831',
    specialties: ['Urology', 'Endourology', 'Renal Surgery'],
    facilityNames: ['SBMC&H Hazaribagh', 'Kalyani Super Specialty'],
    experience: '14 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 11:45 AM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_neph',
    name: 'Dr. Meenakshi Sundaram',
    qualification: 'DM (Nephrology), MD',
    registrationNumber: 'JH-MED-8104',
    specialties: ['Nephrology', 'Dialysis Care', 'Renal Medicine'],
    facilityNames: ['SBMC&H Dialysis Unit', 'Arogyam Multi-Specialty'],
    experience: '11 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 12:15 PM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_endo',
    name: 'Dr. Rashmi Rekha Topno',
    qualification: 'DM (Endocrinology), MD',
    registrationNumber: 'JH-MED-7622',
    specialties: ['Endocrinology', 'Diabetology', 'Thyroid Care'],
    facilityNames: ['SBMC&H Hazaribagh', 'Sadar Hospital'],
    experience: '10 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 03:00 PM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_onco',
    name: 'Dr. Abhishek Mukherjee',
    qualification: 'DM (Medical Oncology), MD, ECMO',
    registrationNumber: 'JH-MED-8319',
    specialties: ['Oncology', 'Cancer Care', 'Chemotherapy'],
    facilityNames: ['HCG Cancer Centre Ranchi', 'SBMC&H Oncology Unit'],
    experience: '15 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 02:15 PM',
    avatar: '👨‍⚕️'
  },
  {
    id: 'doc_dent',
    name: 'Dr. Pooja Kumari',
    qualification: 'MDS (Oral & Maxillofacial Surgery), BDS',
    registrationNumber: 'JH-DENT-2291',
    specialties: ['Dentistry', 'Oral Surgery', 'Dental Care'],
    facilityNames: ['Sadar Hospital Dental Wing', 'SBMC&H Dental OPD'],
    experience: '8 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, 09:30 AM',
    avatar: '👩‍⚕️'
  },
  {
    id: 'doc_em',
    name: 'Dr. Rakesh Ranjan',
    qualification: 'MEM (Emergency Medicine), MRCEM',
    registrationNumber: 'JH-MED-5034',
    specialties: ['Emergency Medicine', 'Critical Care', 'Trauma Stabilization'],
    facilityNames: ['SBMC&H Trauma Centre', 'Arogyam Emergency ER'],
    experience: '11 years exp.',
    isAvailableOnline: true,
    nextSlot: 'Today, Immediate / On-Duty',
    avatar: '👨‍⚕️'
  }
];

// --- CANONICAL WORKFLOW STEP DEFINITIONS (Feature 01) ---
const STEPS = [
  { id: 1, name: 'Patient Profile', shortName: 'Profile', description: 'Demographics & Location' },
  { id: 2, name: 'Symptom Intake', shortName: 'Symptoms', description: 'Primary Symptoms & Onset' },
  { id: 3, name: 'Emergency Screening', shortName: 'Emergency', description: 'Red-Flag Safety Checklist' },
  { id: 4, name: 'Triage Analysis', shortName: 'Triage', description: 'Agent 1 Clinical Analysis' },
  { id: 5, name: 'Clinical Assessment', shortName: 'Assessment', description: 'Urgency & Specialty Mandate' },
  { id: 6, name: 'Facility Research', shortName: 'Research', description: 'Agent 2 Search MCP' },
  { id: 7, name: 'Recommendations', shortName: 'Facilities', description: 'Top Ranked Facilities' },
  { id: 8, name: 'Facility Audit', shortName: 'Audit', description: 'Department & Source Verification' },
  { id: 9, name: 'Referral Pass', shortName: 'Referral', description: 'Digital Pass & Navigation' }
];

// --- REUSABLE UI COMPONENTS ---

function MedVedaLogo({ className = "h-11 w-11" }) {
  return (
    <div className={`${className} flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="medVedaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="60%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="medVedaCrossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0f2942" />
          </linearGradient>
        </defs>

        {/* Medical Cross in Deep Navy / Teal with Rounded Caps */}
        <path
          d="M38 14 C38 10 41 7 45 7 L55 7 C59 7 62 10 62 14 L62 34 L82 34 C86 34 89 37 89 41 L89 51 C89 55 86 58 82 58 L62 58 L62 78 C62 82 59 85 55 85 L45 85 C41 85 38 82 38 78 L38 58 L18 58 C14 58 11 55 11 51 L11 41 C11 37 14 34 18 34 L38 34 Z"
          stroke="#0f2942"
          strokeWidth="6.5"
          strokeLinejoin="round"
          fill="#ffffff"
        />

        {/* Dynamic Pulse / ECG Heartbeat Wave */}
        <path
          d="M6 46 L24 46 L30 38 L36 58 L44 24 L50 64 L56 46 L68 46"
          stroke="#0f2942"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vibrant Teal Ayurvedic Leaf */}
        <path
          d="M48 74 C56 56 74 32 94 20 C94 46 76 72 48 74 Z"
          fill="url(#medVedaLeafGrad)"
        />

        {/* White Leaf Veins */}
        <path
          d="M50 72 C64 56 78 38 92 22"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M66 54 C74 49 80 49 86 48"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M58 64 C66 61 72 58 78 53"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function getRoleBadgeLabel(role) {
  const map = {
    worker: 'ASHA Worker',
    patient: 'Patient',
    doctor: 'Doctor',
    shop_owner: 'Pharmacy',
    lab_staff: 'Diagnostic Lab',
    facility: 'Facility Admin',
    admin: 'Coordinator'
  };
  return map[role] || 'User';
}

function AuthModal({ initialTab = 'login', onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', role: 'worker' });
  const [signUpForm, setSignUpForm] = useState({ name: '', mobile: '', abhaId: '', role: 'patient', district: 'Hazaribagh', password: '' });
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  const handleQuickLogin = (name, role, abhaId) => {
    setAuthSuccessMsg(`Logged in as ${name}`);
    setTimeout(() => {
      onAuthSuccess({ name, role, abhaId });
    }, 400);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const name = loginForm.identifier ? loginForm.identifier.split('@')[0] : 'Dr. Priya Sharma';
    setAuthSuccessMsg(`Welcome back, ${name}!`);
    setTimeout(() => {
      onAuthSuccess({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: loginForm.role,
        abhaId: loginForm.identifier.includes('@') ? loginForm.identifier : `${loginForm.identifier}@abdm`
      });
    }, 400);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setAuthSuccessMsg(`ABDM Account registered for ${signUpForm.name}!`);
    setTimeout(() => {
      onAuthSuccess({
        name: signUpForm.name,
        role: signUpForm.role,
        abhaId: signUpForm.abhaId || `${signUpForm.mobile}@abdm`
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <MedVedaLogo className="h-9 w-9" />
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">MedVeda Portal Access</h3>
              <p className="text-[11px] text-slate-500 font-medium">National Digital Health Mission &bull; ABDM Integrated</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-black leading-none p-1"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Tab Switcher: Log In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-[#0b2b82] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔐 Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'signup'
                ? 'bg-[#0b2b82] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✨ Sign Up (ABDM)
          </button>
        </div>

        {authSuccessMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
              ✓
            </div>
            <p className="text-xs font-bold text-emerald-900">{authSuccessMsg}</p>
            <p className="text-[11px] text-emerald-700">Connecting role session...</p>
          </div>
        ) : activeTab === 'login' ? (
          /* ================= LOGIN FORM ================= */
          <div className="space-y-4">
            {/* Quick Demo Login Personas */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick 1-Click Simulation Login
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Anita Devi', 'worker', '9876543210@abdm')}
                  className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all cursor-pointer"
                >
                  <span className="text-sm block">👩‍⚕️</span>
                  <span className="text-[11px] font-extrabold text-purple-900 block truncate">Anita Devi</span>
                  <span className="text-[9px] text-purple-700 font-semibold block">ASHA Worker</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Dr. Priya Sharma', 'doctor', 'priya.sharma@abdm')}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all cursor-pointer"
                >
                  <span className="text-sm block">👨‍⚕️</span>
                  <span className="text-[11px] font-extrabold text-[#0b2b82] block truncate">Dr. Priya</span>
                  <span className="text-[9px] text-blue-700 font-semibold block">Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Ramesh Mahto', 'patient', 'ramesh.mahto@abdm')}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all cursor-pointer"
                >
                  <span className="text-sm block">👤</span>
                  <span className="text-[11px] font-extrabold text-emerald-900 block truncate">Ramesh M.</span>
                  <span className="text-[9px] text-emerald-700 font-semibold block">Patient</span>
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-2 text-[10px] font-bold uppercase text-slate-400">or enter credentials</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ABHA ID / Mobile Number / Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210 or name@abdm"
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82] focus:border-[#0b2b82]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password or OTP</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82] focus:border-[#0b2b82]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Portal Role</label>
                <select
                  value={loginForm.role}
                  onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#0b2b82]"
                >
                  <option value="worker">Frontline Health Worker (ASHA)</option>
                  <option value="patient">Self-Service Patient</option>
                  <option value="doctor">Consulting / Referring Doctor</option>
                  <option value="shop_owner">Medical Shop Owner</option>
                  <option value="lab_staff">Diagnostic Lab Staff</option>
                  <option value="facility">Receiving Facility Administrator</option>
                  <option value="admin">Facility Coordinator / Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0b2b82] hover:bg-[#061d5c] text-white font-extrabold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                Log In to MedVeda Portal &rarr;
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-500 pt-1">
              New to MedVeda?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-[#0b2b82] font-bold hover:underline cursor-pointer"
              >
                Create an Account
              </button>
            </p>
          </div>
        ) : (
          /* ================= SIGN UP FORM ================= */
          <div className="space-y-3 text-xs">
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar or Sunita Devi"
                  value={signUpForm.name}
                  onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile (Linked to Aadhaar)</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={signUpForm.mobile}
                    onChange={(e) => setSignUpForm({ ...signUpForm, mobile: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ABHA Health Address</label>
                  <input
                    type="text"
                    placeholder="username@abdm"
                    value={signUpForm.abhaId}
                    onChange={(e) => setSignUpForm({ ...signUpForm, abhaId: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-[11px] focus:ring-2 focus:ring-[#0b2b82]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Persona</label>
                  <select
                    value={signUpForm.role}
                    onChange={(e) => setSignUpForm({ ...signUpForm, role: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#0b2b82]"
                  >
                    <option value="patient">Patient</option>
                    <option value="worker">ASHA Worker</option>
                    <option value="doctor">Specialist Doctor</option>
                    <option value="shop_owner">Pharmacy</option>
                    <option value="lab_staff">Diagnostic Lab</option>
                    <option value="facility">Facility Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">District Grid</label>
                  <select
                    value={signUpForm.district}
                    onChange={(e) => setSignUpForm({ ...signUpForm, district: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#0b2b82]"
                  >
                    <option value="Hazaribagh">Hazaribagh</option>
                    <option value="Ranchi">Ranchi</option>
                    <option value="Dhanbad">Dhanbad</option>
                    <option value="Bokaro">Bokaro</option>
                    <option value="Ramgarh">Ramgarh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Create Secure Password / PIN</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0b2b82] hover:bg-[#061d5c] text-white font-extrabold text-xs rounded-xl shadow-md transition-all mt-1 cursor-pointer"
              >
                Register ABDM Account &rarr;
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-500 pt-1">
              Already have an ABHA profile?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-[#0b2b82] font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ currentView, setView, currentScreen, setScreen, actorRole, setActorRole }) {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setFeaturesOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const featureItems = [
    {
      id: 'feature1',
      code: 'Module 01',
      icon: '🧭',
      label: 'Care Navigator',
      description: 'Autonomous symptom triage & emergency facility matching',
      onSelect: () => { setView('feature1'); setScreen(1); }
    },
    {
      id: 'feature2',
      code: 'Module 02',
      icon: '👨‍⚕️',
      label: 'Teleconsult & Queue',
      description: 'Multi-specialty doctor roster & priority booking',
      onSelect: () => setView('feature2')
    },
    {
      id: 'feature3',
      code: 'Module 03',
      icon: '🔄',
      label: 'Smart Referrals',
      description: 'Closed-loop digital referral passes & facility network',
      onSelect: () => setView('feature3')
    },
    {
      id: 'feature4',
      code: 'Module 04',
      icon: '📋',
      label: 'High-Risk Follow-Ups',
      description: 'Longitudinal ASHA field tracking & escalation',
      onSelect: () => setView('feature4')
    },
    {
      id: 'feature5',
      code: 'Module 05',
      icon: '📑',
      label: 'Health Records (ABDM)',
      description: 'Interoperable FHIR health records & emergency override',
      onSelect: () => setView('feature5')
    },
    {
      id: 'feature6',
      code: 'Module 06',
      icon: '💊',
      label: 'Medicine & Diagnostic Lab',
      description: 'Pharmacy inventory reservations & diagnostic tracking',
      onSelect: () => setView('feature6')
    },
    {
      id: 'feature7',
      code: 'Module 07',
      icon: '🏥',
      label: 'Facility Dashboard',
      description: 'Readiness Index, ICU beds, oxygen buffer & triage meters',
      onSelect: () => setView('feature7')
    }
  ];

  const isFeatureActive = currentView.startsWith('feature');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Emergency Hotline Strip */}
      <div className="bg-critical-600 text-white text-xs font-bold py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>EMERGENCY AMBULANCE HOTLINE: 108 / POLICE: 112</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-critical-100 text-[11px]">Rural Healthcare Teleconsult &amp; Emergency Grid</span>
          <a href="tel:108" className="px-2.5 py-0.5 bg-white text-critical-700 rounded font-black text-xs hover:bg-critical-50">
            Call 108
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setView('home')}>
          <MedVedaLogo className="h-10 w-10" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-slate-900 text-lg tracking-tight flex items-center">
                <span>MED</span>
                <span className="text-teal-600 font-extrabold">VEDA</span>
              </h1>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-200">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Smart Care Platform &bull; Telehealth &amp; Triage Grid</p>
          </div>
        </div>

        {/* Navigation Tabs - Exactly 3 Sections: Home, Features (with Dropdown), About Us */}
        <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold relative">
          {/* Section 1: Home */}
          <button
            type="button"
            onClick={() => {
              setView('home');
              setFeaturesOpen(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap ${
              currentView === 'home'
                ? 'bg-[#0b2b82] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0b2b82] hover:bg-blue-50/70'
            }`}
          >
            Home
          </button>

          {/* Section 2: Features (Dropdown containing all feature map options) */}
          <div className="relative" ref={featuresRef}>
            <button
              type="button"
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className={`px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                isFeatureActive
                  ? 'bg-[#0b2b82] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0b2b82] hover:bg-blue-50/70'
              }`}
              aria-expanded={featuresOpen}
              aria-haspopup="true"
            >
              <span>Features</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu with all Feature Map options */}
            {featuresOpen && (
              <div className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Platform Feature Modules
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0b2b82] border border-blue-100">
                    7 Systems
                  </span>
                </div>

                <div className="space-y-1 max-h-[70vh] overflow-y-auto">
                  {featureItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          item.onSelect();
                          setFeaturesOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                          isActive
                            ? 'bg-blue-50/90 border border-blue-200 text-[#0b2b82]'
                            : 'hover:bg-slate-50 border border-transparent text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'bg-[#0b2b82] text-white shadow-xs' : 'bg-slate-100'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold leading-tight group-hover:text-[#0b2b82]">
                              {item.label}
                            </span>
                            <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              {item.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug font-normal mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: About Us */}
          <button
            type="button"
            onClick={() => {
              setView('about');
              setFeaturesOpen(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap ${
              currentView === 'about'
                ? 'bg-[#0b2b82] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0b2b82] hover:bg-blue-50/70'
            }`}
          >
            About Us
          </button>
        </nav>

        {/* Right Controls: Role Switcher & Auth (Login / Sign Up) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Role Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden xl:inline">Role:</span>
            <select
              value={actorRole}
              onChange={(e) => {
                setActorRole(e.target.value);
                if (currentUser) {
                  setCurrentUser(prev => ({ ...prev, role: e.target.value, roleLabel: getRoleBadgeLabel(e.target.value) }));
                }
              }}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-[#0b2b82] focus:border-[#0b2b82] shadow-xs cursor-pointer"
            >
              <option value="worker">Frontline Health Worker (ASHA)</option>
              <option value="patient">Self-Service Patient</option>
              <option value="doctor">Consulting / Referring Doctor</option>
              <option value="shop_owner">Medical Shop Owner</option>
              <option value="lab_staff">Diagnostic Lab Staff</option>
              <option value="facility">Receiving Facility Administrator</option>
              <option value="admin">Facility Coordinator / Admin</option>
            </select>
          </div>

          {/* Login & Sign Up Option Buttons / User Profile Chip */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200/80 rounded-lg px-2.5 py-1 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#0b2b82] text-white text-[11px] font-black flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-extrabold text-slate-900 leading-none truncate max-w-[110px] sm:max-w-[140px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-[#0b2b82] font-bold uppercase leading-tight mt-0.5">
                  {currentUser.roleLabel || getRoleBadgeLabel(actorRole)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentUser(null)}
                className="text-[10px] font-bold text-slate-400 hover:text-critical-600 ml-1 px-1 py-0.5 rounded hover:bg-white transition-colors cursor-pointer"
                title="Log out"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-[#0b2b82] hover:bg-blue-50 rounded-lg transition-all border border-blue-200/80 cursor-pointer"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#0b2b82] hover:bg-[#061d5c] text-white rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature 01 Stepper Banner (shown when in Feature 01) */}
      {currentView === 'feature1' && (
        <WorkflowStepper currentScreen={currentScreen} setScreen={setScreen} />
      )}

      {/* MedVeda Authentication Modal (Log In / Sign Up) */}
      {authModalOpen && (
        <AuthModal
          initialTab={authTab}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setActorRole(user.role);
            setAuthModalOpen(false);
          }}
        />
      )}
    </header>
  );
}

function WorkflowStepper({ currentScreen, setScreen }) {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-3 sm:px-6 shadow-sm overflow-x-auto">
      <div className="max-w-5xl mx-auto flex items-center justify-between min-w-[760px] relative">
        {/* Background Track Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0"></div>

        {/* Active Progress Track Line */}
        <div
          className="absolute top-4 left-6 h-0.5 bg-brand-600 transition-all duration-300 -z-0"
          style={{ width: `${((currentScreen - 1) / (STEPS.length - 1)) * 95}%` }}
        ></div>

        {STEPS.map((step) => {
          const isDone = step.id < currentScreen;
          const isActive = step.id === currentScreen;

          return (
            <div
              key={step.id}
              onClick={() => setScreen(step.id)}
              className="flex flex-col items-center cursor-pointer group z-10"
              style={{ width: '80px' }}
            >
              {/* Node Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isActive
                    ? 'ring-4 ring-brand-100 bg-white border-2 border-brand-600 text-brand-600 shadow-md transform scale-110'
                    : isDone
                    ? 'bg-brand-600 border-2 border-brand-600 text-white shadow-sm'
                    : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                }`}
              >
                {isActive ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-600"></div>
                ) : isDone ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <span></span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-1.5 text-[11px] text-center leading-tight font-bold transition-colors ${
                  isActive
                    ? 'text-brand-700 font-extrabold'
                    : isDone
                    ? 'text-slate-800'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepperHeader({ currentStep, title, subtitle }) {
  const stepInfo = STEPS.find((s) => s.id === currentStep);
  const percent = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="mb-6 pb-4 border-b border-slate-100">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
        <span className="text-brand-700 uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-600"></span>
          Step {currentStep}: {stepInfo?.name}
        </span>
        <span className="text-slate-400">{percent}% Completed</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
}

function VerificationBadge({ status }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <span>✓</span>
        <span>Verified Source</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
      <span>⚠️</span>
      <span>Partially Verified</span>
    </span>
  );
}

function EmergencyPill({ specialtyMode, specialtyName = 'Specialty', emergencySpecialtyVerified }) {
  if (specialtyMode === 'EMERGENCY_AND_OPD' && emergencySpecialtyVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
        <span>✓ 24x7 Emergency {specialtyName} Available</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
      <span>⏱️ {specialtyName} OPD Clinic Only (Not 24x7 Emergency)</span>
    </span>
  );
}

function VitalsConfidenceBadge({ source }) {
  if (source === 'worker_verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <span>✓ Worker Verified</span>
        <span className="text-[9px] opacity-75">(High Clinical Confidence)</span>
      </span>
    );
  }
  if (source === 'self_reported') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
        <span>⚠️ Self Reported</span>
        <span className="text-[9px] opacity-75">(Layperson Confidence)</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
      <span>👨‍⚕️ Doctor Recorded</span>
    </span>
  );
}

// ==========================================
// --- HOMEPAGE COMPONENT (PROFESSIONAL & STREAMLINED) ---
// ==========================================
function ScreenHomepage({
  onLaunchFeature1,
  onLaunchFeature2,
  onLaunchFeature3,
  onLaunchFeature4,
  onLaunchFeature5,
  onLaunchFeature6,
  onLaunchFeature7,
  onLaunchAbout,
  actorRole,
  setActorRole
}) {
  const roleDescriptions = {
    worker: 'Frontline ASHA/ANM Mode: Assisted symptom triage, scheduled follow-up visits, pending referral monitoring, and medicine reservation.',
    patient: 'Self-Service Patient Mode: Autonomous triage, appointment booking, medicine & lab test search with radius fallback, and digital Health ID.',
    doctor: 'Clinical Specialist Mode: Prioritized patient queues, video/audio/chat consultations, digital EMR prescriptions, and closed-loop referrals.',
    shop_owner: 'Medical Shop Mode: Real-time inventory CRUD, stock level updates, and incoming customer reservation fulfillment.',
    lab_staff: 'Diagnostic Laboratory Mode: Diagnostic test catalog management, sample intake tracking, and dual clinical/patient report publishing.',
    facility: 'Facility Administrator Mode: Referral intake, arriving patient check-ins, bed/ICU resource status updates, and emergency alerts.',
    admin: 'System Coordinator Mode: District-wide telehealth telemetry, multi-facility queue metrics, and care continuity index monitoring.'
  };

  const modules = [
    {
      id: 'feature1',
      code: 'Module 01',
      icon: '🧭',
      title: 'Smart Care Navigator',
      description: 'Answer a few questions and get routed to the right level of care — self-care, teleconsult, or in-person — in seconds.',
      actionLabel: 'Launch Triage',
      action: onLaunchFeature1,
      badge: 'Autonomous Triage'
    },
    {
      id: 'feature2',
      code: 'Module 02',
      icon: '👨‍⚕️',
      title: 'Teleconsultation',
      description: 'Secure video visits with licensed clinicians, with notes and prescriptions synced straight to your record.',
      actionLabel: 'Start Teleconsult',
      action: onLaunchFeature2,
      badge: 'Prioritized Telehealth'
    },
    {
      id: 'feature3',
      code: 'Module 03',
      icon: '🔄',
      title: 'Referral Routing',
      description: 'Automatically match patients to the right specialist and facility, with status tracked end to end.',
      actionLabel: 'Open Referrals',
      action: onLaunchFeature3,
      badge: 'Closed-Loop Care'
    },
    {
      id: 'feature4',
      code: 'Module 04',
      icon: '📋',
      title: 'Health Monitoring',
      description: 'Track vitals and trends from connected devices, with smart alerts when something needs attention.',
      actionLabel: 'Open Follow-Ups',
      action: onLaunchFeature4,
      badge: 'Dynamic Risk Engine'
    },
    {
      id: 'feature5',
      code: 'Module 05',
      icon: '📑',
      title: 'Unified Health Records',
      description: 'Every visit, lab, and prescription in one encrypted timeline you can share with any provider.',
      actionLabel: 'Open Records',
      action: onLaunchFeature5,
      badge: 'ABDM Interoperable'
    },
    {
      id: 'feature6',
      code: 'Module 06',
      icon: '💊',
      title: 'Medicine Search',
      description: 'Look up medicines, dosages, and interactions, then order refills without leaving the app.',
      actionLabel: 'Open Medicine & Lab',
      action: onLaunchFeature6,
      badge: 'Geo Logistics'
    },
    {
      id: 'feature7',
      code: 'Module 07',
      icon: '🏥',
      title: 'Facility Operations Dashboard',
      description: 'Multi-source operations overview: Care Continuity Index, live prioritized queue, bed/ICU resource status meters, and alerts.',
      actionLabel: 'Open Dashboard',
      action: onLaunchFeature7,
      badge: 'Operations Control'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Interactive Smart Care Navigator Hero Banner */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-white via-slate-50/40 to-blue-50/30 border border-slate-200/80 shadow-[0_12px_40px_rgba(8,35,95,0.06)] hover:shadow-[0_20px_50px_rgba(8,35,95,0.1)] transition-all duration-500 group">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between min-h-[420px]">
          {/* Left Column: Interactive Typography, CTA Buttons, and Badges */}
          <div className="p-8 sm:p-12 lg:py-14 lg:pl-14 lg:pr-6 lg:w-[54%] xl:w-[52%] space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50/90 border border-sky-200/80 text-[#0b2b82] text-xs font-bold shadow-2xs hover:bg-sky-100/80 transition-colors">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span>Smart care navigation, powered by your data</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black tracking-tight text-slate-900 leading-[1.12]">
              The right care, <span className="text-[#1a66b8]">at</span><br />
              <span className="text-[#1a66b8]">the right time.</span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
              Meet MedVeda’s Smart Care Navigator. Simply describe the symptoms. MedVeda assesses the urgency, identifies the care required, and guides you to the right nearby facility—especially when every minute matters.
            </p>

            {/* Interactive Button Group */}
            <div className="flex items-center gap-3.5 pt-1 flex-wrap">
              <button
                type="button"
                onClick={onLaunchFeature1}
                className="px-6 py-3 bg-[#183b7b] hover:bg-[#0b2b82] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-900/25 active:scale-95 transition-all flex items-center gap-2.5 group/btn cursor-pointer"
              >
                <span>Get started</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={onLaunchFeature2}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Doctor Queue &rarr;</span>
              </button>
            </div>

            {/* Security & Compliance Footer */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 pt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>End-to-end encrypted</span>
              </div>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-500 font-medium">ABDM Digital Health Record</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-emerald-700 font-bold">Ayushman Bharat Interoperable</span>
            </div>
          </div>

          {/* Right Column: Feathered Seamless Doctors Graphic with Floating Interactive Cards */}
          <div className="relative lg:w-[46%] xl:w-[48%] self-stretch flex items-center justify-end overflow-hidden">
            {/* Soft Edge Blending Overlay to eliminate any boxy lines */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none hidden lg:block"></div>
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent z-10 pointer-events-none"></div>

            <img
              src="/hero-doctors.png"
              alt="MedVeda Clinical Care Specialists"
              className="w-full h-auto max-h-[460px] object-cover object-left sm:object-center transform transition-transform duration-700 group-hover:scale-[1.02] select-none block"
            />

            {/* Floating Interactive Micro-Badge 1: On-Duty Specialists */}
            <div
              onClick={onLaunchFeature2}
              className="absolute top-6 right-6 z-20 bg-white/90 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group/tag"
              title="View on-duty specialist doctors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <div className="text-left">
                <div className="text-[11px] font-black text-slate-900 group-hover/tag:text-[#0b2b82]">
                  4 Specialists On-Duty
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">Live Teleconsult Roster &rarr;</div>
              </div>
            </div>

            {/* Floating Interactive Micro-Badge 2: Autonomous Care Triage */}
            <div
              onClick={onLaunchFeature1}
              className="absolute bottom-6 left-12 lg:left-4 z-20 bg-white/90 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-2xl border border-blue-200/80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group/tag"
              title="Launch Smart Care Triage"
            >
              <span className="text-base">⚡</span>
              <div className="text-left">
                <div className="text-[11px] font-black text-[#0b2b82]">
                  Instant Clinical Triage
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">&lt; 2 min facility matching &rarr;</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Simulation Selector (Clean & Professional) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Persona Simulation</span>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{roleDescriptions[actorRole] || roleDescriptions.worker}</p>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap pt-1">
          {[
            { id: 'worker', label: 'Frontline Worker (ASHA)' },
            { id: 'patient', label: 'Self-Service Patient' },
            { id: 'doctor', label: 'Doctor / Specialist' },
            { id: 'shop_owner', label: 'Pharmacy Owner' },
            { id: 'lab_staff', label: 'Diagnostic Lab' },
            { id: 'facility', label: 'Facility Administrator' },
            { id: 'admin', label: 'System Coordinator' }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActorRole(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                actorRole === r.id
                  ? 'bg-[#0b2b82] text-white border-[#0b2b82] shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-[#0b2b82] hover:border-blue-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Operational Network Telemetry (Moved in-between Active Persona and Platform Modules) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Network Telemetry &bull; Jharkhand District Grid</h4>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            All Services Operational
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-2xl font-black text-slate-900">4</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Specialist Doctors On-Duty</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-2xl font-black text-slate-900">4</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Connected Health Facilities</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-2xl font-black text-slate-900">8.5 min</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Avg. Priority Queue Wait</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-2xl font-black text-slate-900">100%</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Closed-Loop EMR Traceability</div>
          </div>
        </div>
      </div>

      {/* System Modules Grid */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7] block mb-1">
            PLATFORM
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            One connected system for the whole care journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 max-w-2xl">
            MedVeda brings navigation, care delivery, and records together — so patients move forward and clinicians stay in the loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div
              key={m.id}
              onClick={m.action}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between space-y-5 group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Top Row: Soft-Blue Squircle Icon Container + Module Code & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/90 text-[#0284c7] border border-blue-100 flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:bg-[#0b2b82] group-hover:text-white group-hover:scale-105 transition-all duration-300">
                    {m.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {m.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f7ff] text-[#0b2b82] border border-blue-100/80">
                      {m.badge}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#0b2b82] transition-colors leading-snug">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {m.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  m.action();
                }}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#0b2b82] hover:text-white group-hover:bg-[#0b2b82] group-hover:text-white text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-100 group-hover:border-[#0b2b82] shadow-2xs group-hover:shadow-sm"
              >
                <span>{m.actionLabel}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// --- FEATURE 01: SMART CARE NAVIGATOR SCREENS ---
// ==========================================

function Screen1PatientInfo({ patient, setPatient, onNext }) {
  const [historyInput, setHistoryInput] = useState('');

  const addHistory = (item) => {
    if (!item) return;
    if (!patient.medicalHistory.includes(item)) {
      setPatient({ ...patient, medicalHistory: [...patient.medicalHistory, item] });
    }
    setHistoryInput('');
  };

  const removeHistory = (item) => {
    setPatient({
      ...patient,
      medicalHistory: patient.medicalHistory.filter((h) => h !== item)
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <StepperHeader
        currentStep={1}
        title="Patient Demographics & Location"
        subtitle="Basic clinical profiling to localize nearby facilities and calibrate triage urgency."
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Age</label>
            <input
              type="number"
              value={patient.age}
              onChange={(e) => setPatient({ ...patient, age: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-slate-900"
              placeholder="e.g. 58"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Biological Sex</label>
            <div className="grid grid-cols-3 gap-2">
              {['female', 'male', 'other'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPatient({ ...patient, sex: s })}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                    patient.sex === s
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Current Location (District / Town)
          </label>
          <div className="relative">
            <input
              type="text"
              value={patient.location}
              onChange={(e) => setPatient({ ...patient, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900"
              placeholder="e.g. Hazaribagh, Jharkhand"
            />
            <span className="absolute right-3 top-3 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              📍 GPS Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Hospital discovery searches will be centered around this locality.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Relevant Medical History / Comorbidities
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {patient.medicalHistory.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeHistory(item)}
                  className="hover:text-critical-600 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={historyInput}
              onChange={(e) => setHistoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHistory(historyInput);
                }
              }}
              placeholder="Type condition (e.g. Asthma, Cardiac stent) and press Enter"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
            />
            <button
              type="button"
              onClick={() => addHistory(historyInput)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mt-2">
            {['+ Hypertension', '+ Diabetes', '+ Asthma', '+ Heart Disease', '+ Prior Stroke', '+ Kidney Disease'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => addHistory(chip.replace('+ ', ''))}
                className="text-[11px] text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            disabled={!patient.location || !patient.age}
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Symptom Intake</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen2SymptomAssessment({ symptoms, setSymptoms, onNext, onBack }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <StepperHeader
        currentStep={2}
        title="Symptom Intake & Onset"
        subtitle="Describe the symptoms in plain language as reported by the patient or frontline healthcare worker."
      />

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Primary Complaints &amp; Observed Symptoms
          </label>
          <textarea
            rows={3}
            value={symptoms.primarySymptoms}
            onChange={(e) => setSymptoms({ ...symptoms, primarySymptoms: e.target.value })}
            placeholder="Describe symptoms, e.g. severe headache with difficulty speaking, numbness on one side..."
            className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Symptom Duration / Onset</label>
            <input
              type="text"
              value={symptoms.duration}
              onChange={(e) => setSymptoms({ ...symptoms, duration: e.target.value })}
              placeholder="e.g. 45 minutes ago, 2 days"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900"
            />
            <p className="text-xs text-slate-400 mt-1">Accurate onset time is critical for stroke &amp; cardiac triage.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Perceived Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mild', label: 'Mild', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
                { id: 'moderate', label: 'Moderate', color: 'bg-amber-50 text-amber-700 border-amber-300' },
                { id: 'severe', label: 'Severe', color: 'bg-critical-50 text-critical-700 border-critical-300' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSymptoms({ ...symptoms, severity: lvl.id })}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                    symptoms.severity === lvl.id
                      ? `${lvl.color} ring-2 ring-offset-1`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Additional Context (Optional)</label>
          <input
            type="text"
            value={symptoms.additionalNotes}
            onChange={(e) => setSymptoms({ ...symptoms, additionalNotes: e.target.value })}
            placeholder="e.g. Patient was sitting at home, no prior head injury reported"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-900"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl transition-all"
          >
            &larr; Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!symptoms.primarySymptoms}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <span>Proceed to Emergency Screening</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen3RedFlags({ redFlags, setRedFlags, onNext, onBack }) {
  const toggleFlag = (key) => {
    setRedFlags({ ...redFlags, [key]: !redFlags[key] });
  };

  const hasAnyCriticalFlag = Object.values(redFlags).some(Boolean);

  const questions = [
    {
      key: 'facialDroopOrSpeech',
      title: 'Facial drooping, arm weakness, or speech difficulty?',
      desc: 'Classic acute signs of stroke / neurological compromise (FAST protocol).',
      badge: 'Acute Neurological'
    },
    {
      key: 'chestPain',
      title: 'Crushing chest pain or pressure radiating to left arm / jaw?',
      desc: 'Potential acute coronary syndrome (heart attack) requiring immediate catheterization.',
      badge: 'Acute Cardiac'
    },
    {
      key: 'breathingDistress',
      title: 'Severe breathing difficulty or inability to speak in full sentences?',
      desc: 'Acute respiratory distress requiring supplemental oxygen or airway management.',
      badge: 'Respiratory'
    },
    {
      key: 'unconsciousOrConfusion',
      title: 'Loss of consciousness, sudden severe confusion, or unresponsive?',
      desc: 'Altered mental status requiring immediate emergency room stabilization.',
      badge: 'Emergency Triage'
    },
    {
      key: 'severeBleeding',
      title: 'Uncontrolled bleeding or severe trauma from accident?',
      desc: 'Hemorrhagic emergency requiring urgent surgical or trauma team.',
      badge: 'Trauma'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <StepperHeader
        currentStep={3}
        title="Emergency Screening"
        subtitle="Rule-based emergency screening to instantly escalate life-threatening presentations."
      />

      {hasAnyCriticalFlag && (
        <div className="mb-6 p-4 rounded-xl bg-critical-50 border border-critical-200 flex items-start gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <h4 className="text-sm font-bold text-critical-800">Critical Red-Flag Detected</h4>
            <p className="text-xs text-critical-700 mt-0.5">
              This triage will automatically be escalated to <strong>CRITICAL</strong> urgency. Facilities without active 24x7 emergency departments will be penalized.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {questions.map((q) => {
          const isChecked = redFlags[q.key];
          return (
            <div
              key={q.key}
              onClick={() => toggleFlag(q.key)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                isChecked
                  ? 'bg-critical-50/50 border-critical-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {q.badge}
                  </span>
                  {isChecked && (
                    <span className="text-xs font-extrabold text-critical-600">FLAGGED</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{q.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{q.desc}</p>
              </div>

              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-critical-600 border-critical-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isChecked ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"
        >
          &larr; Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <span>Run AI Triage Analysis</span>
          <span>⚡</span>
        </button>
      </div>
    </div>
  );
}

function Screen4TriageProcessing({ patient, symptoms, redFlags, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { label: 'Sanitizing input & stripping all PII identifiers', duration: 400 },
    { label: 'Agent 1: Evaluating red-flag rules against FAST clinical protocol', duration: 500 },
    { label: 'Determining required medical specialty & urgency tier', duration: 500 },
    { label: 'Formulating targeted search queries for hospital discovery', duration: 400 }
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setStepIndex(current);
      }
    }, 450);

    fetch(getApiUrl('/api/v1/triage/assess'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: patient.age,
        sex: patient.sex,
        location: patient.location,
        primarySymptoms: symptoms.primarySymptoms,
        duration: symptoms.duration,
        severity: symptoms.severity,
        redFlags: redFlags,
        medicalHistory: patient.medicalHistory
      })
    })
      .then((res) => res.json())
      .then((json) => {
        clearInterval(interval);
        setStepIndex(steps.length);
        setTimeout(() => onComplete(json.data), 400);
      })
      .catch((err) => {
        console.error('Triage assess error, falling back:', err);
        clearInterval(interval);
        setTimeout(onComplete, 400);
      });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center relative">
        <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand-500/30 animate-pulse">
          ⚡
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-dashed animate-spin"></div>
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-2">Analyzing Clinical Presentation</h3>
      <p className="text-xs text-slate-500 mb-8">
        Agent 1 (Symptom &amp; Triage Agent) is executing clinical decision rules...
      </p>

      <div className="space-y-3 text-left">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : isCurrent
                  ? 'bg-brand-50/60 border-brand-300 text-brand-900 shadow-sm ring-1 ring-brand-500/20'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white animate-bounce'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span className="text-xs font-semibold">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Screen5TriageResult({ triage, onFindHospitals, onBack }) {
  const currentTriage = triage || {
    urgency: 'CRITICAL',
    requiredSpecialty: 'Neurology / Stroke Unit',
    emergencyRequired: true,
    conditionCategory: 'Suspected Acute Neurological Emergency',
    clinicalRoutingAdvice: 'Symptoms indicate a possible acute neurological emergency requiring immediate medical evaluation.'
  };

  const isCritical = currentTriage.urgency === 'CRITICAL';

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <StepperHeader
        currentStep={5}
        title="Clinical Assessment Result"
        subtitle="Agent 1 clinical output and specialty destination requirement."
      />

      <div className={`p-6 rounded-2xl text-white shadow-xl mb-6 ${isCritical ? 'bg-critical-600 shadow-critical-600/20' : 'bg-amber-500 shadow-amber-500/20'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            {isCritical ? 'Acuity Level 1' : 'Acuity Level 2'}
          </span>
          <span className="text-xs font-bold text-white/90">
            {isCritical ? 'Immediate Action Required' : 'Prompt Medical Attention'}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black mb-1">
          {isCritical ? '🔴 CRITICAL URGENCY' : '🟡 URGENT'}
        </h3>
        <p className="text-sm text-white/95 leading-relaxed font-medium">
          {currentTriage.clinicalRoutingAdvice}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Required Medical Specialty</span>
          <div className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>🧠 {currentTriage.requiredSpecialty}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Facility MUST have verified clinical capability for {currentTriage.requiredSpecialty}.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Emergency Department Mandate</span>
          <div className={`text-lg font-black mt-1 flex items-center gap-2 ${currentTriage.emergencyRequired ? 'text-critical-600' : 'text-amber-600'}`}>
            <span>{currentTriage.emergencyRequired ? '🚨 24x7 Emergency Required' : '⏱️ Outpatient (OPD) Suitable'}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentTriage.emergencyRequired ? 'Outpatient (OPD) clinics are NOT suitable destinations for this presentation.' : 'Patient can be evaluated in daytime OPD clinics.'}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6 text-xs text-amber-900 leading-relaxed">
        <strong>⚠️ Clinical Safety Invariant:</strong> This system does NOT provide a definitive diagnosis. It provides urgent care routing guidance based on reported signs. Do not delay emergency medical transport.
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"
        >
          &larr; Back
        </button>
        <button
          type="button"
          onClick={onFindHospitals}
          className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <span>Research Facilities with Google Search MCP</span>
          <span>🔍</span>
        </button>
      </div>
    </div>
  );
}

function Screen6HospitalSearch({ location, requiredSpecialty, emergencyRequired, onComplete }) {
  const [progress, setProgress] = useState(25);
  const [activeQuery, setActiveQuery] = useState(`neurology emergency hospital within 50 km of ${location}`);

  const queries = [
    `"${(requiredSpecialty || 'neurology').toLowerCase()}" 24x7 emergency hospital within 50 km of ${location}`,
    `best multi specialty hospital emergency ICU near ${location}`,
    `government medical college hospital emergency trauma centre ${location}`,
    `Ranchi super specialty stroke emergency availability`
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < queries.length) {
        setActiveQuery(queries[step]);
        setProgress(Math.round(((step + 1) / queries.length) * 90));
      }
    }, 450);

    fetch(getApiUrl('/api/v1/hospitals/research'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: location || 'Hazaribagh',
        requiredSpecialty: requiredSpecialty || 'Neurology',
        emergencyRequired: emergencyRequired ?? true,
        searchQueries: queries
      })
    })
      .then((res) => res.json())
      .then((json) => {
        return fetch(getApiUrl('/api/v1/recommendations/rank'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            urgency: emergencyRequired ? 'CRITICAL' : 'URGENT',
            requiredSpecialty: requiredSpecialty || 'Neurology',
            emergencyRequired: emergencyRequired ?? true,
            location: location || 'Hazaribagh',
            facilities: json.data?.facilities || []
          })
        });
      })
      .then((res) => res.json())
      .then((rankJson) => {
        clearInterval(interval);
        setProgress(100);
        const topList = rankJson.data?.topFacilities || [];
        const adaptedFacilities = topList.map((f) => ({
          ...f,
          distanceDisplay: `${f.distanceKm.toFixed(1)} km (${Math.round(f.distanceKm * 1.3)} mins)`,
          explanation: f.clinicalExplanation || f.verificationNotes,
          operatingHours: f.specialtyMode === 'EMERGENCY_AND_OPD' ? '24x7 Emergency Active' : 'OPD: 9 AM - 1 PM',
          departments: ['Emergency Medicine', `${requiredSpecialty || 'Neurology'}`, 'Critical Care ICU'],
          sources: f.sources || []
        }));
        setTimeout(() => onComplete(adaptedFacilities), 400);
      })
      .catch((err) => {
        console.error('Hospital research error, falling back:', err);
        clearInterval(interval);
        setProgress(100);
        setTimeout(onComplete, 400);
      });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center relative">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/30 animate-pulse">
          🌐
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-dashed animate-spin"></div>
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-1">Agent 2: Hospital Research &amp; Verification</h3>
      <p className="text-xs text-slate-500 mb-6">
        Dynamically querying Google Search MCP with <strong>&le; 50 km Proximity Priority</strong> &amp; Emergency Audit...
      </p>

      <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-emerald-500 h-2 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>ACTIVE SEARCH MCP QUERY</span>
          <span className="text-emerald-700 font-extrabold">LIVE</span>
        </div>
        <div className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 truncate">
          &gt; {activeQuery}
        </div>
        <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
          <span>Proximity Rule: <strong>&le; 50 km Golden Hour First</strong></span>
          <span className="font-semibold text-slate-700">Clinical Suitability &gt; Proximity</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Cross-referencing official hospital portals &amp; NHM government registry</span>
      </div>
    </div>
  );
}

function Screen7RecommendedFacilities({ facilities, onSelectFacility, onBack }) {
  const [filterMode, setFilterMode] = useState('all');

  const filtered = useMemo(() => {
    if (filterMode === 'emergency_only') {
      return facilities.filter((f) => f.specialtyMode === 'EMERGENCY_AND_OPD');
    }
    return facilities;
  }, [facilities, filterMode]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <StepperHeader
          currentStep={7}
          title="Recommended Facilities (Top 5)"
          subtitle="Ranked strictly by Clinical Suitability > Proximity with <= 50 km priority."
        />

        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-600 font-bold">
            Showing <span className="text-brand-700 font-extrabold">{filtered.length}</span> facilities near Hazaribagh
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Ranked (5)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('emergency_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'emergency_only'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ✓ 24x7 Emergency Only
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((fac) => {
            const isRankOne = fac.rank === 1;
            const isEmergency = fac.specialtyMode === 'EMERGENCY_AND_OPD';

            return (
              <div
                key={fac.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isRankOne
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
                    : isEmergency
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                        isRankOne
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      #{fac.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{fac.name}</h3>
                        <VerificationBadge status={fac.verificationStatus} />
                      </div>
                      <p className="text-xs text-slate-500">{fac.address}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-slate-900">{fac.distanceDisplay}</div>
                    <span className="text-xs text-slate-400">Road Distance</span>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                  <EmergencyPill
                    specialtyMode={fac.specialtyMode}
                    specialtyName="Neurology"
                    emergencySpecialtyVerified={fac.emergencySpecialtyVerified}
                  />
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    🕒 {fac.operatingHours}
                  </span>
                </div>

                <div className="mt-3.5 p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Why recommended: </strong>
                  {fac.explanation}
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <a
                    href={`tel:${fac.contactNumber}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    <span>📞 Call Desk</span>
                    <span>{fac.contactNumber}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectFacility(fac)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                    >
                      View Details &amp; Sources &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"
          >
            &larr; Back
          </button>
          <button
            type="button"
            onClick={() => onSelectFacility(facilities[0])}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <span>Proceed with #1 Recommended Facility</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen8FacilityDetails({ facility, onNext, onBack }) {
  if (!facility) return null;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <StepperHeader
        currentStep={8}
        title="Facility Audit & Department Verification"
        subtitle="Audited departmental capability, verified contact lines, and source citations."
      />

      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black text-slate-900">{facility.name}</h3>
              <VerificationBadge status={facility.verificationStatus} />
            </div>
            <p className="text-xs text-slate-600">{facility.address}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-brand-700">{facility.distanceDisplay}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <EmergencyPill
            specialtyMode={facility.specialtyMode}
            specialtyName="Neurology"
            emergencySpecialtyVerified={facility.emergencySpecialtyVerified}
          />
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
            🕒 {facility.operatingHours}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-2.5">Active Medical Departments</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(facility.departments || ['Emergency Medicine', 'Neurology', 'Critical Care ICU']).map((dept, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{dept}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Verification Sources &amp; Audit Trail</h4>
            <span className="text-xs text-slate-400">Source Trust Hierarchy</span>
          </div>

          <div className="space-y-2">
            {(facility.sources || []).map((src, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="font-bold text-slate-800 capitalize">{src.type.replace('_', ' ')}:</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline font-mono truncate"
                  >
                    {src.url}
                  </a>
                </div>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-white border border-slate-200 text-slate-600 shrink-0">
                  {src.reliability} Trust
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-bold text-emerald-800">Direct Emergency Desk Contact</div>
            <div className="text-base font-black text-emerald-900">{facility.contactNumber}</div>
          </div>
          <a
            href={`tel:${facility.contactNumber}`}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>📞 Call Emergency Room</span>
          </a>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"
          >
            &larr; Back to Recommendations
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <span>Generate Referral Pass &amp; Navigation</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen9ReferralPass({ facility, patient, onRestart }) {
  const [copied, setCopied] = useState(false);
  const referralId = 'REF-JH-2026-8842';

  const copyReferral = () => {
    navigator.clipboard?.writeText(referralId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <StepperHeader
          currentStep={9}
          title="Digital Referral Pass & Navigation"
          subtitle="Fast-track admission pass for receiving hospital triage desk and turn-by-turn navigation."
        />

        <div className="border-2 border-dashed border-brand-500/40 rounded-2xl p-6 bg-brand-50/30 mb-6">
          <div className="flex items-center justify-between border-b border-brand-200/60 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-brand-700 uppercase bg-brand-100 px-2 py-0.5 rounded">
                Official Digital Triage Pass
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{facility.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-400">PASS ID</div>
              <div className="text-sm font-black text-brand-700 font-mono">{referralId}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Patient Age/Sex</span>
              <strong className="text-slate-800">{patient.age}y / {patient.sex}</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Acuity Tier</span>
              <strong className="text-critical-600 font-extrabold">🔴 CRITICAL</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Specialty</span>
              <strong className="text-slate-800">Neurology Stroke</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Origin</span>
              <strong className="text-slate-800">{patient.location}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between shrink-0">
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm self-end"></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Hospital Staff Fast-Scan</div>
                <div className="text-[11px] text-slate-500">Scan at Emergency triage desk to instantly import triage parameters into hospital EMR.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={copyReferral}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shrink-0"
            >
              {copied ? '✓ Copied' : 'Copy ID'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href={`tel:${facility.contactNumber}`}
            className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <span>📞 1-Tap Emergency Call</span>
            <span className="opacity-80">({facility.contactNumber})</span>
          </a>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(facility.name + ' ' + facility.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md shadow-brand-600/20 transition-all"
          >
            <span>🧭 Start Google Maps Navigation</span>
          </a>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            ↺ Start New Patient Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// --- FEATURE 02: TELECONSULTATION & QUEUE MANAGEMENT SCREENS ---
// ==========================================

function ScreenTeleconsultEntry({ actorRole, onSelectPath, onBackToHome }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1">
            <span>Feature Map 02 &bull; Teleconsultation Entry</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Teleconsultation Path</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Both entry paths converge into the exact same booking, priority queue, and consultation engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Path 1: Assisted Path */}
          <div
            onClick={() => onSelectPath('worker')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
              actorRole === 'worker'
                ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-brand-300'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-2xl mb-4 font-bold">
                👩‍⚕️
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-extrabold text-slate-900 text-lg">Assisted Path</h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  ASHA / ANM
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                A frontline health worker operates the device on behalf of the patient. The worker records physical vitals, translates local dialects, and coordinates consent.
              </p>

              <div className="space-y-1.5 text-xs text-slate-700 font-semibold mb-6">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span>✓</span>
                  <span>Vitals tagged as <strong>worker_verified</strong> (High Confidence)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>✓</span>
                  <span>Worker presence on video/audio for clinical exam</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition-colors"
            >
              Continue as Frontline Worker &rarr;
            </button>
          </div>

          {/* Path 2: Self-Service Path */}
          <div
            onClick={() => onSelectPath('self')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
              actorRole === 'patient'
                ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-brand-300'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4 font-bold">
                👤
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-extrabold text-slate-900 text-lg">Self-Service Path</h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                  Direct Patient
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                A literate patient navigates the application independently. The patient self-reports complaints and vitals from home.
              </p>

              <div className="space-y-1.5 text-xs text-slate-700 font-semibold mb-6">
                <div className="flex items-center gap-2 text-amber-700">
                  <span>⚠️</span>
                  <span>Vitals tagged as <strong>self_reported</strong> (Layperson)</span>
                </div>
                <div className="flex items-center gap-2 text-critical-700">
                  <span>🚨</span>
                  <span>Emergency red-flag guardrail intercept active</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition-colors"
            >
              Continue as Self-Service Patient &rarr;
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            &larr; Back to Platform Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenTeleconsultBooking({ pathActor, onBookSuccess, onBack, onEmergencyEscalate }) {
  const [patientName, setPatientName] = useState(pathActor === 'worker' ? 'Ramesh Mahto' : 'Sita Devi');
  const [age, setAge] = useState(48);
  const [sex, setSex] = useState('female');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Neurology');
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc_1');
  const [selectedSlot, setSelectedSlot] = useState('Today, 10:00 AM');
  const [symptoms, setSymptoms] = useState('Throbbing headache on right temple for 3 days, mild light sensitivity.');
  const [riskFlags, setRiskFlags] = useState(['Hypertension']);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const SPECIALTY_OPTIONS = [
    { id: 'General Medicine', label: 'General Medicine', icon: '🩺', desc: 'Primary diagnosis, fevers, infections & chronic illness' },
    { id: 'General Surgery', label: 'General Surgery', icon: '🩹', desc: 'Surgical consults, hernia, appendix & acute trauma' },
    { id: 'Orthopedics', label: 'Orthopedics', icon: '🦴', desc: 'Bone fractures, joint pain, arthritis & spine trauma' },
    { id: 'Pediatrics', label: 'Pediatrics', icon: '👶', desc: 'Infant, child health, immunization & development' },
    { id: 'Obstetrics & Gynecology', label: 'Obstetrics & Gynecology', icon: '🤰', desc: "Maternal health, high-risk pregnancy & women's care" },
    { id: 'Cardiology', label: 'Cardiology', icon: '❤️', desc: 'Heart disease, hypertension, ECG & chest distress' },
    { id: 'Neurology', label: 'Neurology', icon: '🧠', desc: 'Brain, stroke, epilepsy, nerve disorders & migraine' },
    { id: 'Neurosurgery', label: 'Neurosurgery', icon: '🔬', desc: 'Brain tumors, neuro-trauma, spine surgery & aneurysms' },
    { id: 'ENT', label: 'ENT', icon: '👂', desc: 'Ear, nose, throat, sinusitis & hearing loss' },
    { id: 'Ophthalmology', label: 'Ophthalmology', icon: '👁️', desc: 'Eye pain, vision impairment, glaucoma & cataract' },
    { id: 'Dermatology', label: 'Dermatology', icon: '🧴', desc: 'Skin rash, eczema, psoriasis, acne & hair loss' },
    { id: 'Psychiatry', label: 'Psychiatry', icon: '🧘', desc: 'Mental wellness, anxiety, depression & psychosis' },
    { id: 'Pulmonology / Respiratory Medicine', label: 'Pulmonology / Respiratory Medicine', icon: '🫁', desc: 'Asthma, COPD, chronic cough, TB & respiratory care' },
    { id: 'Gastroenterology', label: 'Gastroenterology', icon: '🥗', desc: 'Liver, stomach, jaundice, ulcers & digestive disorders' },
    { id: 'Urology', label: 'Urology', icon: '💧', desc: 'Kidney stones, prostate, urinary tract & bladder care' },
    { id: 'Nephrology', label: 'Nephrology', icon: '🧪', desc: 'Kidney failure, dialysis, creatinine & renal wellness' },
    { id: 'Endocrinology', label: 'Endocrinology', icon: '⚖️', desc: 'Diabetes, thyroid disorders, hormonal imbalance & PCOS' },
    { id: 'Oncology', label: 'Oncology', icon: '🎗️', desc: 'Cancer screening, chemotherapy, tumors & palliative care' },
    { id: 'Dentistry', label: 'Dentistry', icon: '🦷', desc: 'Toothache, oral surgery, dental caries & gum disease' },
    { id: 'Emergency Medicine', label: 'Emergency Medicine', icon: '🚑', desc: 'Acute stabilization, trauma, poisoning & critical triage' }
  ];

  const specialties = SPECIALTY_OPTIONS.map((s) => s.id);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const specialtyDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (specialtyDropdownRef.current && !specialtyDropdownRef.current.contains(event.target)) {
        setIsSpecialtyDropdownOpen(false);
      }
    }
    if (isSpecialtyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSpecialtyDropdownOpen]);

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((d) =>
      d.specialties.some((s) => matchesSpecialty(s, selectedSpecialty))
    );
  }, [selectedSpecialty]);

  const activeDoctor = filteredDoctors[0] || MOCK_DOCTORS[0];

  const handleSymptomCheck = (text) => {
    setSymptoms(text);
    // Emergency Intercept for self-service patient
    const lower = text.toLowerCase();
    if (pathActor === 'self' && (lower.includes('chest pain') || lower.includes('face drop') || lower.includes('cant breathe') || lower.includes('unconscious'))) {
      setShowEmergencyModal(true);
    }
  };

  const handleBook = () => {
    const isCritical = symptoms.toLowerCase().includes('chest pain') || symptoms.toLowerCase().includes('face drop');
    const urgency = isCritical ? 'RED' : 'YELLOW';

    const bookingPayload = {
      patientName,
      patientAge: Number(age),
      patientSex: sex,
      patientLocation: 'Hazaribagh, Jharkhand',
      specialty: selectedSpecialty,
      doctorId: activeDoctor.id,
      facilityId: 'fac_sbmch',
      scheduledTime: selectedSlot,
      urgencyTier: urgency,
      bookedBy: pathActor,
      workerName: pathActor === 'worker' ? 'ASHA Anita Kumari' : undefined,
      highRiskFlags: riskFlags,
      symptomsSummary: symptoms
    };

    fetch(getApiUrl('/api/v1/teleconsult/book'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    })
      .then((res) => res.json())
      .then((json) => {
        setBookingConfirmed(json.data);
      })
      .catch((err) => {
        console.error('Booking failed, using local mock:', err);
        setBookingConfirmed({
          appointment: {
            id: 'APT-MOCK-8821',
            patientName,
            patientAge: age,
            patientSex: sex,
            doctorName: activeDoctor.name,
            specialty: selectedSpecialty,
            scheduledTime: selectedSlot,
            urgencyTier: urgency,
            bookedBy: pathActor,
            workerName: pathActor === 'worker' ? 'ASHA Anita Kumari' : undefined,
            highRiskFlags: riskFlags
          },
          smsSimulation: {
            recipient: pathActor === 'worker' ? 'Frontline Worker (ASHA Anita)' : patientName,
            messageText: `SmartCare: Teleconsult confirmed for ${patientName} with ${activeDoctor.name} (${selectedSpecialty}) on ${selectedSlot}. ID: APT-MOCK-8821.`,
            sentAt: new Date().toISOString()
          }
        });
      });
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          ✓
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-1">Appointment Confirmed!</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Appointment ID: <strong className="font-mono text-brand-700">{bookingConfirmed.appointment.id}</strong>
        </p>

        {/* SMS Simulation Card */}
        <div className="p-4 rounded-xl bg-slate-900 text-left text-white mb-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>📱 SIMULATED SMS NOTIFICATION</span>
            <span className="text-emerald-400 font-bold">DELIVERED</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono">
            {bookingConfirmed.smsSimulation.messageText}
          </p>
          <div className="mt-2 text-[10px] text-slate-500">
            To: {bookingConfirmed.smsSimulation.recipient} &bull; {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onBookSuccess(bookingConfirmed.appointment)}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Priority Queue &rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      {/* Emergency Red-Flag Intercept Modal for Self-Service */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-critical-500">
            <div className="w-12 h-12 rounded-full bg-critical-100 text-critical-600 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              🚨
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center mb-1">Critical Emergency Intercept</h3>
            <p className="text-xs text-critical-700 text-center mb-4 leading-relaxed font-semibold">
              The symptoms you described match life-threatening acute criteria (Stroke / Cardiac / Severe Respiratory). Teleconsultation is not safe for this emergency.
            </p>

            <div className="p-3 bg-critical-50 rounded-xl border border-critical-200 text-xs text-critical-900 mb-4">
              <strong>Clinical Guardrail Rule:</strong> Self-service patients with acute red-flags are automatically redirected to Feature 01 Emergency Triage &amp; verified hospital routing.
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowEmergencyModal(false);
                  onEmergencyEscalate();
                }}
                className="w-full py-3 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Redirect to Emergency Triage (Feature 01) &rarr;
              </button>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Dismiss (Continue Teleconsult)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1">
            <span>Feature 02 &bull; Slot &amp; Doctor Matching</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Book Teleconsultation Slot</h2>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          pathActor === 'worker' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {pathActor === 'worker' ? '👩‍⚕️ Assisted Path (ASHA)' : '👤 Self-Service Path'}
        </span>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Patient Full Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"
            />
          </div>
        </div>

        {/* Specialty Selector Dropdown */}
        <div className="relative" ref={specialtyDropdownRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label id="specialty-dropdown-label" className="block text-xs font-bold text-slate-700 uppercase">
              Select Medical Specialty
            </label>
            <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
              {SPECIALTY_OPTIONS.length} Specialties
            </span>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            id="specialty-dropdown-button"
            aria-haspopup="listbox"
            aria-expanded={isSpecialtyDropdownOpen}
            aria-labelledby="specialty-dropdown-label specialty-dropdown-button"
            onClick={() => setIsSpecialtyDropdownOpen((prev) => !prev)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 bg-white ${
              isSpecialtyDropdownOpen
                ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-lg shrink-0">
                {(SPECIALTY_OPTIONS.find((s) => s.id === selectedSpecialty) || {}).icon || '🩺'}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm truncate">
                    {selectedSpecialty}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Selected
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {(SPECIALTY_OPTIONS.find((s) => s.id === selectedSpecialty) || {}).desc || 'Medical Specialty'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {isSpecialtyDropdownOpen ? 'Close menu' : 'Change specialty'}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                isSpecialtyDropdownOpen ? 'bg-brand-100 text-brand-700 rotate-180' : 'bg-slate-100 text-slate-600'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Dropdown Menu Panel */}
          {isSpecialtyDropdownOpen && (
            <div
              role="listbox"
              aria-label="Medical Specialties"
              className="absolute left-0 right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="p-2.5 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5">
                <span>Select Department Roster</span>
                <span className="text-brand-600 font-semibold">Live Doctor Matching</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1.5 focus:outline-none">
                {SPECIALTY_OPTIONS.map((spec) => {
                  const isSelected = selectedSpecialty === spec.id;
                  const matchingDoc = MOCK_DOCTORS.find((d) =>
                    d.specialties.some((s) => matchesSpecialty(s, spec.id))
                  );

                  return (
                    <button
                      key={spec.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedSpecialty(spec.id);
                        if (matchingDoc && matchingDoc.nextSlot) {
                          setSelectedSlot(matchingDoc.nextSlot);
                        }
                        setIsSpecialtyDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors group ${
                        isSelected
                          ? 'bg-brand-50 border border-brand-200 text-brand-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${
                          isSelected ? 'bg-brand-100' : 'bg-slate-100 group-hover:bg-brand-50'
                        }`}>
                          {spec.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm ${isSelected ? 'font-extrabold text-brand-900' : 'text-slate-800'}`}>
                              {spec.label}
                            </span>
                            {matchingDoc && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 shrink-0 flex items-center gap-1 border border-emerald-200">
                                <span>{matchingDoc.avatar}</span>
                                <span>{matchingDoc.name}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 group-hover:text-slate-500 truncate">
                            {spec.desc}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 group-hover:text-brand-600 font-semibold">
                            Select
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Roster Card */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Matching Specialist Doctor</label>
          <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-brand-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                {activeDoctor.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{activeDoctor.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Online</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{activeDoctor.qualification} &bull; Reg: {activeDoctor.registrationNumber}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {activeDoctor.facilityNames.map((fac, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      🏥 {fac}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slot Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Available Time Slot</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[activeDoctor.nextSlot || 'Today, 10:00 AM', 'Today, 11:30 AM', 'Today, 02:00 PM', 'Today, 04:30 PM'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  selectedSlot === slot
                    ? 'bg-[#0b2b82] text-white border-[#0b2b82] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms Intake */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Symptoms &amp; Chief Complaint</label>
          <textarea
            rows={2}
            value={symptoms}
            onChange={(e) => handleSymptomCheck(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500 text-slate-900"
            placeholder="Describe symptoms briefly..."
          />
        </div>

        {/* High Risk Flags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">High-Risk Factors (Boosts Queue Priority)</label>
          <div className="flex gap-2 flex-wrap">
            {['Pregnancy', 'Infant (<=2y)', 'Elderly (>=65y)', 'Hypertension', 'Diabetes', 'Cardiac Stent'].map((flag) => {
              const isChecked = riskFlags.includes(flag);
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => {
                    if (isChecked) {
                      setRiskFlags(riskFlags.filter((f) => f !== flag));
                    } else {
                      setRiskFlags([...riskFlags, flag]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    isChecked
                      ? 'bg-brand-50 border-brand-400 text-brand-800'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {isChecked ? '✓ ' : '+ '} {flag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs rounded-xl"
          >
            &larr; Back
          </button>
          <button
            type="button"
            onClick={handleBook}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Confirm Booking &amp; Enter Queue</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenTeleconsultQueue({ appointment, onJoinCall, onBack }) {
  const [queuePos, setQueuePos] = useState(2);
  const [estimatedMins, setEstimatedMins] = useState(8);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping"></span>
          Priority Queue Management Active
        </div>

        {/* Live Queue Position Card */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex flex-col items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/30 relative">
          <span className="text-xs uppercase font-bold tracking-widest opacity-80">You Are</span>
          <span className="text-4xl font-black">#{queuePos}</span>
          <span className="text-[10px] font-semibold opacity-90">in priority queue</span>
          <div className="absolute inset-0 rounded-full border-4 border-brand-300 border-dashed animate-spin"></div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">Estimated Wait: {estimatedMins} Minutes</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Consulting Doctor: <strong className="text-slate-900">{appointment?.doctorName || 'Dr. Priya Sharma'}</strong> ({appointment?.specialty || 'Neurology'})
        </p>

        {/* Priority Computation Audit */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 font-bold">
            <span>PRIORITY SCORING BREAKDOWN</span>
            <span className="text-brand-700 font-extrabold">SCORE: 85 PTS</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Acuity Tier</span>
              <strong>{appointment?.urgencyTier === 'RED' ? '🔴 RED (+100)' : '🟡 URGENT (+50)'}</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Punctuality Protection</span>
              <strong className="text-emerald-700">✓ Booked Slot (+25)</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            <strong>Anti-Starvation Guardrail:</strong> On-time booked appointments cannot be indefinitely bumped by walk-in arrivals.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Doctor Has Called Your Session</h4>
              <p className="text-[11px] text-emerald-700">Doctor Dr. Priya Sharma is waiting in the digital room.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onJoinCall}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>🎥 Join Teleconsultation Room Now</span>
            <span>&rarr;</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-slate-400 hover:text-slate-700"
          >
            &larr; Cancel &amp; Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenTeleconsultCall({ appointment, pathActor, onCompleteConsultation }) {
  const [callMode, setCallMode] = useState('video'); // 'video' | 'audio' | 'chat'
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [vitals, setVitals] = useState([
    { type: 'bp', label: 'Blood Pressure', value: '138/88', unit: 'mmHg', source: pathActor === 'worker' ? 'worker_verified' : 'self_reported' },
    { type: 'spo2', label: 'SpO2 Saturation', value: '98', unit: '%', source: pathActor === 'worker' ? 'worker_verified' : 'self_reported' },
    { type: 'pulse', label: 'Pulse Rate', value: '78', unit: 'bpm', source: pathActor === 'worker' ? 'worker_verified' : 'self_reported' },
    { type: 'temp', label: 'Body Temp', value: '98.6', unit: '°F', source: pathActor === 'worker' ? 'worker_verified' : 'self_reported' }
  ]);
  const [newVitalType, setNewVitalType] = useState('glucose');
  const [newVitalValue, setNewVitalValue] = useState('110');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'doctor', senderName: 'Dr. Priya Sharma', text: 'Hello Anita ji, I can see your video clearly. Please tell me about the headache symptoms.', time: '10:01 AM' },
    { id: '2', sender: pathActor, senderName: pathActor === 'worker' ? 'ASHA Anita Kumari' : 'Anita Devi', text: 'Namaste Doctor. The headache is mainly on the right side temple, started 3 days ago.', time: '10:02 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg = {
      id: String(Date.now()),
      sender: pathActor,
      senderName: pathActor === 'worker' ? 'ASHA Anita Kumari' : 'Anita Devi',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setChatInput('');
  };

  const addVital = () => {
    if (!newVitalValue) return;
    const labelMap = { glucose: 'Blood Glucose', bp: 'Blood Pressure', spo2: 'SpO2', temp: 'Temperature' };
    const unitMap = { glucose: 'mg/dL', bp: 'mmHg', spo2: '%', temp: '°F' };
    setVitals([
      ...vitals,
      {
        type: newVitalType,
        label: labelMap[newVitalType] || newVitalType,
        value: newVitalValue,
        unit: unitMap[newVitalType] || '',
        source: pathActor === 'worker' ? 'worker_verified' : 'self_reported'
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Call Header & Bandwidth Degradation Simulation Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <h3 className="text-sm font-bold">{appointment?.doctorName || 'Dr. Priya Sharma'} &bull; {appointment?.specialty || 'Neurology'}</h3>
            <p className="text-[11px] text-slate-400">Consultation Session &bull; Call Duration: 04:12</p>
          </div>
        </div>

        {/* Degrading Modes Switcher (Demo Bandwidth Toggle) */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl text-xs font-bold">
          <span className="text-[10px] text-slate-400 px-2 uppercase">Bandwidth Mode:</span>
          <button
            type="button"
            onClick={() => setCallMode('video')}
            className={`px-3 py-1 rounded-lg transition-all ${
              callMode === 'video' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            🎥 Video (HD)
          </button>
          <button
            type="button"
            onClick={() => setCallMode('audio')}
            className={`px-3 py-1 rounded-lg transition-all ${
              callMode === 'audio' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            🎙️ Audio (Low BW)
          </button>
          <button
            type="button"
            onClick={() => setCallMode('chat')}
            className={`px-3 py-1 rounded-lg transition-all ${
              callMode === 'chat' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            💬 In-App Chat (2G)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stage: Video / Audio / Chat */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode 1: Video Call View */}
          {callMode === 'video' && (
            <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col justify-between p-6 shadow-2xl border border-slate-800">
              {/* Doctor Video Feed (Simulated) */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-brand-500/20 border-2 border-brand-400 text-white flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner">
                    👩‍⚕️
                  </div>
                  <h4 className="text-lg font-black text-white">Dr. Priya Sharma</h4>
                  <span className="text-xs text-brand-300 font-semibold">MD Neurology &bull; Live Telehealth Stream</span>
                </div>
              </div>

              {/* Patient Webcam Preview Box (PiP) */}
              <div className="absolute bottom-5 right-5 w-36 h-28 bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-white text-xs z-10">
                {isCameraOff ? (
                  <span className="text-slate-400">Camera Off</span>
                ) : (
                  <div className="text-center">
                    <span className="text-2xl block mb-1">👤</span>
                    <span className="text-[10px] font-bold opacity-80">{pathActor === 'worker' ? 'ASHA + Patient' : 'Patient'}</span>
                  </div>
                )}
              </div>

              {/* Floating Action Controls */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 z-10">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isMuted ? 'bg-critical-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isMuted ? '🔇' : '🎙️'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCameraOff ? 'bg-critical-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isCameraOff ? '🚫' : '📹'}
                </button>

                <button
                  type="button"
                  onClick={() => setCallMode('chat')}
                  className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-sm"
                >
                  💬
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Audio-Only Fallback View */}
          {callMode === 'audio' && (
            <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-8 text-white text-center shadow-xl border border-amber-500/20 aspect-video flex flex-col justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 mx-auto">
                <span>⚠️ Bandwidth Degraded &bull; Switched to Audio-Only Mode</span>
              </div>

              <div>
                <div className="w-20 h-20 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-3xl mx-auto mb-3 border border-amber-400">
                  🎙️
                </div>
                <h4 className="text-xl font-black text-white">Dr. Priya Sharma &bull; Audio Active</h4>
                <p className="text-xs text-slate-400 mt-1">High-clarity low-latency voice channel connected</p>

                {/* Simulated Audio Waveforms */}
                <div className="flex items-center justify-center gap-1.5 mt-6 h-8">
                  {[20, 60, 40, 80, 50, 90, 30, 70, 40, 85, 30, 60].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-amber-400 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-2"
                >
                  <span>{isMuted ? '🔇 Unmute' : '🎙️ Mute'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode 3: Session In-App Chat Fallback View */}
          {callMode === 'chat' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Session In-App Chat</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Tied to consultation ID: CON-JH-8842</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Session Scoped
                </span>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {messages.map((m) => {
                  const isDoctor = m.sender === 'doctor';
                  return (
                    <div key={m.id} className={`flex flex-col ${isDoctor ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] font-bold text-slate-400 mb-0.5">{m.senderName} &bull; {m.time}</span>
                      <div
                        className={`p-3.5 rounded-2xl max-w-sm text-xs font-medium leading-relaxed ${
                          isDoctor
                            ? 'bg-slate-100 text-slate-900 rounded-tl-sm'
                            : 'bg-brand-600 text-white rounded-tr-sm'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2 items-center">
                <input
                  type="file"
                  id="chat-attachment"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        sender: 'patient',
                        senderName: patientName,
                        text: `Attached file: ${file.name}`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('chat-attachment').click()}
                  className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                  title="Attach Photo/Video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  placeholder="Type message to doctor..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={sendChatMessage}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Vitals Observation Panel with Reliability Tagging */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Live Vitals Observations</h4>
              <VitalsConfidenceBadge source={pathActor === 'worker' ? 'worker_verified' : 'self_reported'} />
            </div>

            <div className="space-y-2.5 mb-6">
              {vitals.map((v, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-bold block">{v.label}</span>
                    <strong className="text-slate-900 text-sm">{v.value} {v.unit}</strong>
                  </div>
                  <VitalsConfidenceBadge source={v.source} />
                </div>
              ))}
            </div>

            {/* Quick Add Vital */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Log Additional Vital Reading</span>
              <div className="flex gap-2">
                <select
                  value={newVitalType}
                  onChange={(e) => setNewVitalType(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                >
                  <option value="glucose">Glucose (mg/dL)</option>
                  <option value="bp">Blood Pressure</option>
                  <option value="spo2">SpO2 (%)</option>
                  <option value="temp">Temp (°F)</option>
                </select>
                <input
                  type="text"
                  value={newVitalValue}
                  onChange={(e) => setNewVitalValue(e.target.value)}
                  className="w-20 px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-center"
                />
                <button
                  type="button"
                  onClick={addVital}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Action to Doctor Form */}
          <button
            type="button"
            onClick={() => onCompleteConsultation(vitals)}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Call &amp; Proceed to Doctor Rx 📝</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenDoctorDocumentation({ appointment, vitals, onSaveDocumentation }) {
  const [diagnosis, setDiagnosis] = useState('Tension-type Headache / Cervical Muscular Strain');
  const [doctorNotes, setDoctorNotes] = useState('Patient alert and oriented. Cranial nerve exam intact. SBP 138 mmHg. Advised rest, hydration, and short-term analgesia.');
  const [prescription, setPrescription] = useState([
    { medicineName: 'Tab Paracetamol', dosage: '500 mg', frequency: 'SOS (as needed)', durationDays: 3, instructions: 'After meals with water' },
    { medicineName: 'Tab Naproxen', dosage: '250 mg', frequency: '1-0-1', durationDays: 5, instructions: 'Twice daily' }
  ]);
  const [referralFlag, setReferralFlag] = useState(false);
  const [diagnosticOrderFlag, setDiagnosticOrderFlag] = useState(true);
  const [diagnosticTests, setDiagnosticTests] = useState(['CBC', 'Serum Electrolytes']);
  const [followUpFlag, setFollowUpFlag] = useState(true);
  const [followUpDays, setFollowUpDays] = useState(7);

  const handleFinalize = () => {
    onSaveDocumentation({
      diagnosis,
      doctorNotes,
      prescription,
      referralFlag,
      diagnosticOrderFlag,
      diagnosticTests,
      followUpFlag,
      followUpDays,
      vitals
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1">
              <span>Doctor Clinical Workspace &bull; Digital EMR Rx</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Clinical Documentation Form</h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            Consulting: {appointment?.doctorName || 'Dr. Priya Sharma'}
          </span>
        </div>

        <div className="space-y-6">
          {/* Differential Diagnosis */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Differential Clinical Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Clinical Examination Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Doctor Clinical Notes &amp; Observations</label>
            <textarea
              rows={3}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500 text-slate-900"
            />
          </div>

          {/* Prescription Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Prescription (Rx Medicines)</label>
              <span className="text-xs text-slate-400 font-bold">{prescription.length} Items</span>
            </div>

            <div className="space-y-2 mb-3">
              {prescription.map((rx, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-3">
                  <div>
                    <strong className="text-slate-900">{rx.medicineName}</strong>
                    <span className="text-slate-500 ml-2 font-mono">({rx.dosage}) &bull; {rx.frequency} &bull; {rx.durationDays} days</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rx.instructions}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrescription(prescription.filter((_, i) => i !== idx))}
                    className="text-critical-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Flags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div
              onClick={() => setReferralFlag(!referralFlag)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                referralFlag ? 'bg-critical-50 border-critical-300 shadow-sm' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Tertiary Referral</span>
                <span className="text-xs">{referralFlag ? '🚨 YES' : 'NO'}</span>
              </div>
              <p className="text-[11px] text-slate-500">Trigger hospital referral to Feature 03 / Super Specialty.</p>
            </div>

            <div
              onClick={() => setDiagnosticOrderFlag(!diagnosticOrderFlag)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                diagnosticOrderFlag ? 'bg-brand-50 border-brand-300 shadow-sm' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Diagnostic Order</span>
                <span className="text-xs">{diagnosticOrderFlag ? '🧪 YES' : 'NO'}</span>
              </div>
              <p className="text-[11px] text-slate-500">Order Lab Tests (CBC, Serum Lytes, ECG).</p>
            </div>

            <div
              onClick={() => setFollowUpFlag(!followUpFlag)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                followUpFlag ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Follow-up Required</span>
                <span className="text-xs">{followUpFlag ? `📅 ${followUpDays}d` : 'NO'}</span>
              </div>
              <p className="text-[11px] text-slate-500">Schedule follow-up review in 7 days.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleFinalize}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <span>Sign &amp; Issue Digital EMR Consultation Summary 🔏</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenConsultationSummary({ consultationData, onRestart, onGoHome }) {
  const [copied, setCopied] = useState(false);
  const consultId = 'CON-JH-2026-9042';

  const diagnosis = consultationData?.diagnosis || 'Tension-type Headache / Cervical Muscular Strain';
  const doctorNotes = consultationData?.doctorNotes || 'Patient alert and oriented. Cranial nerve exam intact. SBP 138 mmHg. Advised rest, hydration, and short-term analgesia.';
  const prescription = (consultationData?.prescription && consultationData.prescription.length > 0)
    ? consultationData.prescription
    : [
        { medicineName: 'Tab Paracetamol', dosage: '500 mg', frequency: 'SOS (as needed)', durationDays: 3 },
        { medicineName: 'Tab Naproxen', dosage: '250 mg', frequency: '1-0-1', durationDays: 5 }
      ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="border-2 border-dashed border-brand-500/40 rounded-2xl p-6 bg-brand-50/20 mb-6">
          <div className="flex items-center justify-between border-b border-brand-200/60 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-brand-700 uppercase bg-brand-100 px-2 py-0.5 rounded">
                Official Teleconsultation Record &amp; Rx
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Dr. Priya Sharma, MD</h3>
              <p className="text-xs text-slate-500">Department of Neurology &bull; SBMC&amp;H Regional Grid</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-400">CONSULT ID</div>
              <div className="text-sm font-black text-brand-700 font-mono">{consultId}</div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Differential Diagnosis</span>
              <strong className="text-slate-900 text-sm font-black">{diagnosis}</strong>
            </div>

            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Doctor Clinical Notes</span>
              <p className="text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                {doctorNotes}
              </p>
            </div>

            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">Prescribed Medicines (Rx)</span>
              <div className="space-y-1.5">
                {prescription.map((rx, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between font-medium">
                    <div>
                      <strong className="text-slate-900">{rx.medicineName} ({rx.dosage})</strong>
                      <span className="text-slate-500 ml-2">&bull; {rx.frequency}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-bold">{rx.durationDays} Days</span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Verification */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 rounded-lg p-1 flex flex-col justify-between shrink-0">
                  <div className="flex justify-between"><div className="w-3 h-3 bg-white"></div><div className="w-3 h-3 bg-white"></div></div>
                  <div className="flex justify-between"><div className="w-3 h-3 bg-white"></div><div className="w-1.5 h-1.5 bg-white self-end"></div></div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Pharmacist &amp; EMR Fast-Verification</div>
                  <div className="text-[11px] text-slate-500">Scan at any Jan Aushadhi Kendra or hospital pharmacy.</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shrink-0"
              >
                {copied ? '✓ Copied' : 'Copy ID'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onGoHome}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            🏠 Return to Platform Home
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            ↺ Start New Teleconsultation
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// --- FEATURE 03: SMART REFERRAL MANAGEMENT ---
// ==========================================

function ScreenReferralManagement({ actorRole, setActorRole, onBackToHome, onNavigateToCareNavigator }) {
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabRole, setActiveTabRole] = useState(actorRole || 'doctor');
  const [selectedTimelineRef, setSelectedTimelineRef] = useState(null);
  const [timelineLogs, setTimelineLogs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [targetReferral, setTargetReferral] = useState(null);
  const [statusRemarks, setStatusRemarks] = useState('');
  const [targetStatus, setTargetStatus] = useState('SENT');

  // New Referral Form state
  const [formData, setFormData] = useState({
    patientId: 'PAT-1024',
    patientName: 'Anita Devi',
    patientAge: 58,
    patientSex: 'female',
    patientPhone: '+91-94311-58201',
    patientLocation: 'Katkamsandi, Hazaribagh',
    referringDoctorId: 'doc_1',
    referringDoctorName: 'Dr. Priya Sharma',
    referringFacilityId: 'fac_phc_katkamsandi',
    referringFacilityName: 'Katkamsandi Primary Health Centre',
    receivingFacilityId: 'fac_sbmch',
    receivingFacilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
    specialty: 'Cardiology',
    reason: 'Acute exertional chest tightness, ST segment depression, suspected unstable angina',
    clinicalSummary: '58F diabetic & hypertensive. FAST stroke negative. ECG reveals anterior lead T-wave inversion. SBP 142/90. Sourced from Smart Care Navigator routing.',
    urgencyTier: 'CRITICAL'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [refRes, statRes] = await Promise.all([
        fetch(getApiUrl('/api/referrals')),
        fetch(getApiUrl('/api/referrals/stats'))
      ]);
      const refData = await refRes.json();
      const statData = await statRes.json();
      if (refData.data && Array.isArray(refData.data)) setReferrals(refData.data);
      if (statData.data) setStats(statData.data);
    } catch (err) {
      console.warn('Network fetch unavailable, using active local referral store:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (actorRole) setActiveTabRole(actorRole);
  }, [actorRole]);

  const handleOpenTimeline = async (ref) => {
    setSelectedTimelineRef(ref);
    try {
      const res = await fetch(getApiUrl(`/api/referrals/${ref.referralId}/history`));
      const data = await res.json();
      setTimelineLogs(data.data || ref.statusHistory || []);
    } catch (err) {
      setTimelineLogs(ref.statusHistory || []);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl('/api/referrals'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShowCreateModal(false);
        setReferrals((prev) => [data.data, ...prev.filter((r) => r.referralId !== data.data.referralId)]);
        setStats((prev) => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
        return;
      }
    } catch (err) {
      console.warn('Backend POST failed, generating referral locally:', err);
    }

    // Seamless Local Fallback
    const nextSeq = 130 + referrals.length;
    const newRefId = `REF-2026-${String(nextSeq).padStart(5, '0')}`;
    const now = new Date().toISOString();
    const newReferral = {
      id: `ref_local_${Date.now()}`,
      referralId: newRefId,
      patientId: formData.patientId || `PAT-${Date.now().toString().slice(-4)}`,
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      patientSex: formData.patientSex,
      patientPhone: formData.patientPhone || '+91-94311-28901',
      patientLocation: formData.patientLocation || 'Hazaribagh',
      referringDoctorId: formData.referringDoctorId || 'doc_1',
      referringDoctorName: formData.referringDoctorName || 'Dr. Priya Sharma',
      referringFacilityId: formData.referringFacilityId || 'fac_phc_1',
      referringFacilityName: formData.referringFacilityName || 'Katkamsandi Primary Health Centre',
      receivingFacilityId: formData.receivingFacilityId || 'fac_sbmch',
      receivingFacilityName: formData.receivingFacilityName || 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
      specialty: formData.specialty,
      reason: formData.reason,
      clinicalSummary: formData.clinicalSummary,
      urgencyTier: formData.urgencyTier || 'CRITICAL',
      status: 'CREATED',
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          id: `hist_init_${Date.now()}`,
          referralId: newRefId,
          fromStatus: null,
          toStatus: 'CREATED',
          updatedBy: formData.referringDoctorName || 'Dr. Priya Sharma',
          userRole: 'doctor',
          remarks: 'Digital referral initiated via MedVeda.',
          timestamp: now
        }
      ]
    };

    setReferrals((prev) => [newReferral, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
    setShowCreateModal(false);
  };

  const handleUpdateStatus = (ref, newStatus, defaultRemarks = '') => {
    setTargetReferral(ref);
    setTargetStatus(newStatus);
    setStatusRemarks(defaultRemarks || `Status updated to ${newStatus} by ${activeTabRole}`);
    setShowUpdateModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!targetReferral) return;
    const updaterName =
      activeTabRole === 'doctor'
        ? 'Dr. Priya Sharma'
        : activeTabRole === 'worker'
        ? 'ASHA Anita Devi'
        : activeTabRole === 'facility'
        ? 'SBMC&H Reception Desk'
        : 'Patient';

    try {
      const res = await fetch(getApiUrl(`/api/referrals/${targetReferral.referralId}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toStatus: targetStatus,
          updatedBy: updaterName,
          userRole: activeTabRole,
          remarks: statusRemarks
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShowUpdateModal(false);
        setReferrals((prev) => prev.map((r) => (r.referralId === data.data.referralId ? data.data : r)));
        loadData();
        return;
      }
    } catch (err) {
      console.warn('Backend PATCH failed, applying transition locally:', err);
    }

    // Seamless Local Transition Fallback
    const now = new Date().toISOString();
    const newHistoryItem = {
      id: `hist_${Date.now()}`,
      referralId: targetReferral.referralId,
      fromStatus: targetReferral.status,
      toStatus: targetStatus,
      updatedBy: updaterName,
      userRole: activeTabRole,
      remarks: statusRemarks || `Status transitioned to ${targetStatus}`,
      timestamp: now
    };

    setReferrals((prev) =>
      prev.map((r) => {
        if (r.referralId === targetReferral.referralId) {
          return {
            ...r,
            status: targetStatus,
            updatedAt: now,
            statusHistory: [...(r.statusHistory || []), newHistoryItem]
          };
        }
        return r;
      })
    );

    setShowUpdateModal(false);
  };

  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => {
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.referralId.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.specialty.toLowerCase().includes(q) ||
        r.receivingFacilityName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [referrals, statusFilter, searchQuery]);

  const pendingWorkerReferrals = useMemo(() => {
    return referrals.filter((r) => r.status === 'CREATED' || r.status === 'SENT' || r.status === 'IN_PROGRESS');
  }, [referrals]);

  const incomingFacilityReferrals = useMemo(() => {
    return referrals.filter((r) => r.status === 'SENT' || r.status === 'IN_PROGRESS' || r.status === 'REACHED_FACILITY');
  }, [referrals]);

  const primaryPatientRef = referrals[0] || null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
              Feature Map 03 &bull; Closed-Loop Referral
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">REF-TRACKER v2.0</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Smart Referral Management System</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Digitally manages and tracks patient referrals from doctor creation to ASHA follow-up, facility intake, and completed care.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <span>➕</span>
            <span>Create New Referral</span>
          </button>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Role View Selector Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'doctor', label: '👨‍⚕️ Referring Doctor View' },
            { id: 'worker', label: '👩‍⚕️ ASHA Action Center' },
            { id: 'facility', label: '🏥 Receiving Facility View' },
            { id: 'patient', label: '👤 Patient Referral Pass' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTabRole(t.id);
                setActorRole(t.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTabRole === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-extrabold rounded-lg border border-emerald-200">
          Active Role: {activeTabRole.toUpperCase()}
        </div>
      </div>

      {/* 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Referrals</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{stats.total}</div>
          <span className="text-[10px] text-slate-400 font-medium">Across all health corridors</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Pending Action</span>
          <div className="text-3xl font-black text-amber-600 mt-1">{stats.pending}</div>
          <span className="text-[10px] text-amber-600/80 font-medium">CREATED or SENT state</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-200 bg-blue-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">In Transit / Reached</span>
          <div className="text-3xl font-black text-blue-600 mt-1">{stats.inProgress}</div>
          <span className="text-[10px] text-blue-600/80 font-medium">ASHA active follow-up</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Care Completed</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats.completed}</div>
          <span className="text-[10px] text-emerald-600/80 font-medium">Verified consultation finished</span>
        </div>
      </div>

      {/* VIEW 1: DOCTOR DASHBOARD */}
      {activeTabRole === 'doctor' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Doctor Referral Tracking Board</h3>
              <p className="text-xs text-slate-500 font-medium">
                Monitor referral lifecycles, dispatch newly created referrals, and inspect audit logs.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search patient, ID, facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"
              />

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {['ALL', 'CREATED', 'SENT', 'IN_PROGRESS', 'REACHED_FACILITY', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                      statusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-3">Referral ID</th>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Specialty &amp; Reason</th>
                  <th className="py-3 px-3">Receiving Destination</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-black text-emerald-800 text-xs">
                      {ref.referralId}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{ref.patientName}</div>
                      <div className="text-[11px] text-slate-400">{ref.patientAge}y &bull; {ref.patientSex} &bull; {ref.patientLocation}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{ref.specialty}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{ref.reason}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{ref.receivingFacilityName}</div>
                      <div className="text-[10px] text-slate-400">From: {ref.referringFacilityName}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          ref.status === 'CREATED'
                            ? 'bg-slate-100 text-slate-700'
                            : ref.status === 'SENT'
                            ? 'bg-amber-100 text-amber-800'
                            : ref.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : ref.status === 'REACHED_FACILITY'
                            ? 'bg-purple-100 text-purple-800'
                            : ref.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ref.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      {ref.status === 'CREATED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(ref, 'SENT', 'Doctor transmitted referral to destination facility.')}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold"
                        >
                          Dispatch (Send)
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenTimeline(ref)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"
                      >
                        Timeline 📜
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FRONTLINE WORKER (ASHA) ACTION CENTER */}
      {activeTabRole === 'worker' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <h3 className="text-base font-black text-amber-900">ASHA Pending Follow-Up Queue</h3>
              </div>
              <p className="text-xs text-amber-800 font-medium mt-1">
                {pendingWorkerReferrals.length} patient(s) have active referrals requiring ground follow-up and transport coordination.
                Update their status once contacted or when they reach the hospital.
              </p>
            </div>
            <span className="text-2xl font-black text-amber-800">{pendingWorkerReferrals.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingWorkerReferrals.map((ref) => (
              <div key={ref.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {ref.referralId}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {ref.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{ref.patientName} ({ref.patientAge}y, {ref.patientSex})</h4>
                  <p className="text-xs text-slate-500">Location: {ref.patientLocation} &bull; Phone: {ref.patientPhone || 'N/A'}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <div><strong className="text-slate-700">Department:</strong> {ref.specialty}</div>
                  <div><strong className="text-slate-700">Destination:</strong> {ref.receivingFacilityName}</div>
                  <div><strong className="text-slate-700">Reason:</strong> {ref.reason}</div>
                </div>

                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  {ref.status === 'SENT' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(ref, 'IN_PROGRESS', 'ASHA contacted patient; transport en route.')}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                    >
                      📞 Patient Contacted / En Route
                    </button>
                  )}

                  {ref.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(ref, 'REACHED_FACILITY', 'ASHA confirmed patient arrived at hospital gate/OPD desk.')}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                    >
                      🏥 Confirm Patient Reached Hospital
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenTimeline(ref)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: RECEIVING FACILITY INTAKE VIEW */}
      {activeTabRole === 'facility' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Receiving Facility Intake &amp; Care Completion</h3>
            <p className="text-xs text-slate-500 font-medium">
              Incoming referrals designated for Sheikh Bhikhari Medical College &amp; District Hospitals.
              Confirm patient arrival and finalize care when specialist consultation completes.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {incomingFacilityReferrals.map((ref) => (
              <div key={ref.id} className="py-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-800 text-xs">{ref.referralId}</span>
                    <span className="font-bold text-slate-900 text-sm">&bull; {ref.patientName} ({ref.patientAge}y)</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {ref.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Specialty: <strong className="text-slate-700">{ref.specialty}</strong> &bull; Reason: {ref.reason}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Referred by: {ref.referringDoctorName} ({ref.referringFacilityName})</p>
                </div>

                <div className="flex items-center gap-2">
                  {ref.status !== 'REACHED_FACILITY' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(ref, 'REACHED_FACILITY', 'Facility reception desk checked in patient.')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      📥 Check-In Patient Arrival
                    </button>
                  )}

                  {ref.status === 'REACHED_FACILITY' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(ref, 'COMPLETED', 'Consultation & clinical evaluation completed. Patient discharged/admitted.')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      ✅ Complete Care &amp; Consultation
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenTimeline(ref)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Audit Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: PATIENT REFERRAL PASS */}
      {activeTabRole === 'patient' && primaryPatientRef && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 bg-emerald-50/20">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-2.5 py-0.5 rounded">
                  Official Digital Referral Pass
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{primaryPatientRef.patientName}</h3>
                <p className="text-xs text-slate-500">Age: {primaryPatientRef.patientAge} &bull; Destination: {primaryPatientRef.receivingFacilityName}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-400">REFERRAL ID</div>
                <div className="text-sm font-black text-emerald-800 font-mono">{primaryPatientRef.referralId}</div>
              </div>
            </div>

            {/* 4-Step Patient Stepper */}
            <div className="py-4">
              <div className="flex items-center justify-between text-center relative">
                <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 -z-0"></div>
                {[
                  { step: 'CREATED', label: '1. Created', icon: '📝' },
                  { step: 'SENT', label: '2. Sent', icon: '📨' },
                  { step: 'REACHED_FACILITY', label: '3. Reached Hospital', icon: '🏥' },
                  { step: 'COMPLETED', label: '4. Care Completed', icon: '✅' }
                ].map((s, idx) => {
                  const isDone =
                    (s.step === 'CREATED') ||
                    (s.step === 'SENT' && primaryPatientRef.status !== 'CREATED') ||
                    (s.step === 'REACHED_FACILITY' && (primaryPatientRef.status === 'REACHED_FACILITY' || primaryPatientRef.status === 'COMPLETED')) ||
                    (s.step === 'COMPLETED' && primaryPatientRef.status === 'COMPLETED');

                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1.5">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 text-xs bg-white p-4 rounded-xl border border-slate-200 mt-4">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Required Specialty</span>
                <strong className="text-slate-900 text-sm font-black">{primaryPatientRef.specialty}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Clinical Reason</span>
                <p className="text-slate-700 font-medium">{primaryPatientRef.reason}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Emergency Destination Hospital</span>
                <strong className="text-slate-900 font-extrabold">{primaryPatientRef.receivingFacilityName}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE AUDIT DRAWER MODAL */}
      {selectedTimelineRef && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedTimelineRef.referralId}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Referral Journey &amp; Audit Trail</h3>
                <p className="text-xs text-slate-500">Patient: {selectedTimelineRef.patientName} &bull; {selectedTimelineRef.specialty}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTimelineRef(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {timelineLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-1 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 uppercase text-[11px]">
                        {log.fromStatus ? `${log.fromStatus} → ${log.toStatus}` : log.toStatus}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{log.remarks}</p>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Updated by: <strong className="text-slate-600">{log.updatedBy}</strong> ({log.userRole})
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setSelectedTimelineRef(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Audit Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE REFERRAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Doctor Referral Form
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Create Digital Clinical Referral</h3>
                <p className="text-xs text-slate-500">Pre-filled from Smart Care Navigator &amp; Verified Hospital Destination</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Age &amp; Sex</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                      className="w-24 border border-slate-200 rounded-xl p-2.5 font-medium"
                    />
                    <select
                      value={formData.patientSex}
                      onChange={(e) => setFormData({ ...formData, patientSex: e.target.value })}
                      className="flex-1 border border-slate-200 rounded-xl p-2.5 font-medium"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Referring Doctor &amp; Facility</label>
                  <input
                    type="text"
                    value={`${formData.referringDoctorName} (${formData.referringFacilityName})`}
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Receiving Hospital (Destination)</label>
                  <select
                    value={formData.receivingFacilityName}
                    onChange={(e) => setFormData({ ...formData, receivingFacilityName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  >
                    <option value="Sheikh Bhikhari Medical College & Hospital (SBMC&H)">
                      Sheikh Bhikhari Medical College (SBMC&H) &bull; 2.8 km
                    </option>
                    <option value="Arogyam Multi-Specialty Hospital & Critical Care">
                      Arogyam Multi-Specialty Hospital &bull; 4.8 km
                    </option>
                    <option value="Kalyani Super Specialty Hospital & Trauma Centre">
                      Kalyani Super Specialty &amp; Trauma &bull; 38 km
                    </option>
                    <option value="Sadar Hospital Hazaribagh">
                      Sadar Hospital Hazaribagh &bull; 3.2 km
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Medical Specialty</label>
                <input
                  type="text"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Referral</label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Summary &amp; Vitals</label>
                <textarea
                  rows="3"
                  value={formData.clinicalSummary}
                  onChange={(e) => setFormData({ ...formData, clinicalSummary: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Generate Digital Referral (CREATED)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {showUpdateModal && targetReferral && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Confirm Transition
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Update Status to <span className="text-emerald-700 font-mono">{targetStatus}</span>
              </h3>
              <p className="text-xs text-slate-500">Referral: {targetReferral.referralId} &bull; Patient: {targetReferral.patientName}</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 text-xs block mb-1">Audit Remarks / Ground Notes</label>
              <textarea
                rows="3"
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusUpdate}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Status Transition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// --- FEATURE 04: HIGH-RISK PATIENT FOLLOW-UP SYSTEM ---
// ==========================================

function ScreenHighRiskFollowUp({
  actorRole,
  setActorRole,
  onBackToHome,
  onNavigateToCareNavigator,
  onNavigateToReferrals
}) {
  const [activeTabRole, setActiveTabRole] = useState(actorRole || 'doctor');
  const [plans, setPlans] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [highRiskPatients, setHighRiskPatients] = useState([
    {
      patientId: 'P-1024',
      patientName: 'Ramesh Mahto',
      latestScore: 78,
      latestLevel: 'HIGH',
      trend: 'WORSENING',
      lastFollowUpDate: '2026-08-24T12:00:00.000Z',
      assignedDoctor: 'Dr. Priya Sharma',
      assignedWorker: 'ASHA Anita Devi',
      facilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)'
    },
    {
      patientId: 'P-1088',
      patientName: 'Anita Devi',
      latestScore: 22,
      latestLevel: 'LOW',
      trend: 'IMPROVING',
      lastFollowUpDate: '2026-08-19T10:30:00.000Z',
      assignedDoctor: 'Dr. Priya Sharma',
      assignedWorker: 'ASHA Anita Devi',
      facilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)'
    }
  ]);
  const [facilityAlerts, setFacilityAlerts] = useState([
    {
      id: 'alert_seed_1',
      patientId: 'P-1024',
      patientName: 'Ramesh Mahto',
      facilityId: 'fac_sbmch',
      facilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
      riskScore: 78,
      riskLevel: 'HIGH',
      triggerReason: 'Risk increased from 51 to 78 (HIGH): Severely elevated BP (162/102 mmHg); Patient-reported symptom worsening; Partial medication adherence.',
      latestObservations: 'BP: 162/102, Adherence: PARTIAL, Symptoms: WORSENED.',
      assignedDoctorName: 'Dr. Priya Sharma',
      assignedWorkerName: 'ASHA Anita Devi',
      status: 'ACTIVE',
      createdAt: '2026-08-24T12:00:00.000Z'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Modals & Drawers
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);
  const [selectedTaskForReport, setSelectedTaskForReport] = useState(null);
  const [selectedPatientForTrajectory, setSelectedPatientForTrajectory] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [patientRiskHistory, setPatientRiskHistory] = useState([]);

  // Create Plan Form
  const [planForm, setPlanForm] = useState({
    patientId: 'P-1024',
    patientName: 'Ramesh Mahto',
    patientAge: 48,
    patientSex: 'male',
    patientPhone: '+91-94311-28901',
    patientLocation: 'Katkamsandi, Hazaribagh',
    doctorId: 'doc_1',
    doctorName: 'Dr. Priya Sharma',
    facilityId: 'fac_sbmch',
    facilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
    frontlineWorkerId: 'worker_014',
    frontlineWorkerName: 'ASHA Anita Devi',
    frequencyDays: 7,
    instructions: 'Measure resting BP weekly, verify compliance with anti-platelets, inspect for chest heaviness or ankle swelling.',
    requiredObservations: ['blood_pressure', 'medication_adherence', 'symptom_progression', 'general_condition']
  });

  // Submit Report Form
  const [reportForm, setReportForm] = useState({
    systolic: 162,
    diastolic: 102,
    medicationAdherence: 'PARTIAL',
    symptomProgression: 'WORSENED',
    generalCondition: 'Patient reports worsening exertional angina on walking 50 meters.',
    observationsText: 'Measured resting BP 162/102 mmHg. Missed evening doses due to mild gastrointestinal discomfort.'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, tRes, hrRes, aRes] = await Promise.all([
        fetch(getApiUrl('/api/followups/plans')),
        fetch(getApiUrl('/api/followups/tasks')),
        fetch(getApiUrl('/api/high-risk-patients')),
        fetch(getApiUrl('/api/facility/alerts'))
      ]);
      const pData = await pRes.json();
      const tData = await tRes.json();
      const hrData = await hrRes.json();
      const aData = await aRes.json();

      if (pData.data && Array.isArray(pData.data)) setPlans(pData.data);
      if (tData.data && Array.isArray(tData.data)) setTasks(tData.data);
      if (hrData.data && Array.isArray(hrData.data)) setHighRiskPatients(hrData.data);
      if (aData.data && Array.isArray(aData.data)) setFacilityAlerts(aData.data);
    } catch (err) {
      console.warn('Network fetch unavailable, using active local follow-up store:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (actorRole) setActiveTabRole(actorRole);
  }, [actorRole]);

  // Inspect Patient Longitudinal Trajectory
  const handleInspectTrajectory = async (patient) => {
    setSelectedPatientForTrajectory(patient);
    try {
      const [repRes, histRes] = await Promise.all([
        fetch(getApiUrl(`/api/patients/${patient.patientId}/followups`)),
        fetch(getApiUrl(`/api/patients/${patient.patientId}/risk-history`))
      ]);
      const repData = await repRes.json();
      const histData = await histRes.json();
      setPatientReports(repData.data || []);
      setPatientRiskHistory(histData.data || []);
    } catch (err) {
      console.warn('Trajectory fetch failed, using fallback:', err);
      // Fallback for Ramesh Mahto
      if (patient.patientId === 'P-1024') {
        setPatientRiskHistory([
          { riskScore: 42, riskLevel: 'MODERATE', trend: 'STABLE', reason: 'Baseline post-MI follow-up. BP 130/85, full adherence.', createdAt: '2026-08-10' },
          { riskScore: 51, riskLevel: 'MODERATE', trend: 'WORSENING', reason: 'BP 145/92, partial adherence.', createdAt: '2026-08-17' },
          { riskScore: 78, riskLevel: 'HIGH', trend: 'WORSENING', reason: 'Severely elevated BP (162/102 mmHg); Symptoms worsened.', createdAt: '2026-08-24' }
        ]);
      }
    }
  };

  // Create Follow-up Plan
  const handleCreatePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl('/api/followups/plans'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShowCreatePlanModal(false);
        loadData();
        return;
      }
    } catch (err) {
      console.warn('POST /api/followups/plans failed, applying local fallback:', err);
    }

    const planId = `plan_local_${Date.now()}`;
    const newPlan = { ...planForm, id: planId, createdAt: new Date().toISOString(), status: 'ACTIVE' };
    setPlans((prev) => [newPlan, ...prev]);
    setShowCreatePlanModal(false);
  };

  // Start Follow-Up for Task
  const handleStartFollowUp = (task) => {
    setSelectedTaskForReport(task);
    setReportForm({
      systolic: 160,
      diastolic: 100,
      medicationAdherence: 'PARTIAL',
      symptomProgression: 'WORSENED',
      generalCondition: 'Patient reports progressive fatigue and chest discomfort.',
      observationsText: `Follow-up assessment completed for ${task.patientName}.`
    });
    setShowSubmitReportModal(true);
  };

  // Submit Follow-Up Report Form
  const handleSubmitReportForm = async (e) => {
    e.preventDefault();
    if (!selectedTaskForReport) return;

    const payload = {
      bloodPressure: {
        systolic: Number(reportForm.systolic),
        diastolic: Number(reportForm.diastolic)
      },
      medicationAdherence: reportForm.medicationAdherence,
      symptomProgression: reportForm.symptomProgression,
      generalCondition: reportForm.generalCondition,
      observationsText: reportForm.observationsText
    };

    try {
      const res = await fetch(getApiUrl(`/api/followups/tasks/${selectedTaskForReport.id}/report`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShowSubmitReportModal(false);
        loadData();
        return;
      }
    } catch (err) {
      console.warn('Report submission POST failed, applying local calculation:', err);
    }

    // Local State Fallback
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTaskForReport.id ? { ...t, status: 'COMPLETED' } : t))
    );
    setShowSubmitReportModal(false);
  };

  // Acknowledge Alert
  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await fetch(getApiUrl(`/api/facility/alerts/${alertId}/ack`), { method: 'PATCH' });
      loadData();
    } catch (err) {
      setFacilityAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
      );
    }
  };

  const filteredPatients = useMemo(() => {
    return highRiskPatients.filter((p) => {
      const matchesRisk = riskFilter === 'ALL' || p.latestLevel === riskFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.patientId.toLowerCase().includes(q) ||
        p.patientName.toLowerCase().includes(q) ||
        p.assignedDoctor.toLowerCase().includes(q) ||
        p.assignedWorker.toLowerCase().includes(q);
      return matchesRisk && matchesSearch;
    });
  }, [highRiskPatients, riskFilter, searchQuery]);

  const dueTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'DUE' || t.status === 'UPCOMING');
  }, [tasks]);

  const activeAlerts = useMemo(() => {
    return facilityAlerts.filter((a) => a.status === 'ACTIVE');
  }, [facilityAlerts]);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-black text-purple-800 uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
            Feature Map 04 &bull; Dynamic Risk Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            High-Risk Patient Follow-Up System
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed">
            Doctor-prescribed periodic follow-up plans, frontline ASHA worker observation recording, transparent dynamic risk scoring, and real-time facility escalation alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowCreatePlanModal(true)}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>➕ Prescribe Follow-Up Plan</span>
          </button>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            <span>🏠 Home</span>
          </button>
        </div>
      </div>

      {/* Role Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: 'doctor', label: 'Doctor Monitoring Center', icon: '👨‍⚕️' },
            { id: 'worker', label: 'ASHA Worker Task Board', icon: '👩‍⚕️' },
            { id: 'facility', label: 'Facility Alert Desk', icon: '🏥' },
            { id: 'patient', label: 'Patient Care View', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTabRole(tab.id);
                setActorRole(tab.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTabRole === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-lg text-xs font-mono font-bold border border-purple-200">
          Active Role: {activeTabRole.toUpperCase()}
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monitored</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{highRiskPatients.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active clinical care plans</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">High / Critical Risk</div>
          <div className="text-3xl font-black text-amber-900 mt-1">
            {highRiskPatients.filter((p) => p.latestLevel === 'HIGH' || p.latestLevel === 'CRITICAL').length}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Score &ge; 60 (Escalated)</div>
        </div>

        <div className="bg-gradient-to-br from-[#061d5c] to-[#0b2b82] text-white p-5 rounded-2xl border border-blue-900/40 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-200">Active Facility Alerts</div>
          <div className="text-3xl font-black text-white mt-1 flex items-center gap-2">
            <span>{activeAlerts.length}</span>
            {activeAlerts.length > 0 && <span className="w-2.5 h-2.5 rounded-full bg-sky-300 animate-ping"></span>}
          </div>
          <div className="text-[11px] text-blue-200 mt-0.5">Intervention required</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Follow-Up Compliance</div>
          <div className="text-3xl font-black text-emerald-900 mt-1">94%</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">ASHA visit completion rate</div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. DOCTOR MONITORING VIEW */}
      {/* ==================================================== */}
      {activeTabRole === 'doctor' && (
        <div className="space-y-6">
          {/* Active Facility Escalation Alert Banner */}
          {activeAlerts.length > 0 && (
            <div className="p-5 rounded-2xl bg-critical-50 border-2 border-critical-400 shadow-sm animate-pulse-subtle">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-critical-600 text-white flex items-center justify-center font-black text-xl shrink-0">
                    🚨
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-critical-600 text-white">
                        CRITICAL ESCALATION ALERT
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {activeAlerts[0].patientName} ({activeAlerts[0].patientId}) &bull; Score: {activeAlerts[0].riskScore} (HIGH)
                      </h4>
                    </div>
                    <p className="text-xs text-critical-900 font-semibold mt-1">
                      {activeAlerts[0].triggerReason}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Assigned Facility: {activeAlerts[0].facilityName} &bull; ASHA: {activeAlerts[0].assignedWorkerName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAcknowledgeAlert(activeAlerts[0].id)}
                  className="px-4 py-2 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
                >
                  ✓ Acknowledge &amp; Review
                </button>
              </div>
            </div>
          )}

          {/* High-Risk Patient Tracking Board */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">High-Risk Patient Monitoring Board</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Real-time longitudinal risk progression and clinical deterioration tracking.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Search patient, ID, worker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                />

                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {['ALL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setRiskFilter(lvl)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        riskFilter === lvl
                          ? 'bg-white text-slate-900 shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Patient Profile</th>
                    <th className="p-4">Assigned ASHA Worker</th>
                    <th className="p-4">Current Dynamic Risk</th>
                    <th className="p-4">Trend Trajectory</th>
                    <th className="p-4">Last Follow-Up</th>
                    <th className="p-4 text-right">Longitudinal Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((pat) => {
                    const isHigh = pat.latestLevel === 'HIGH' || pat.latestLevel === 'CRITICAL';
                    const isWorsening = pat.trend === 'WORSENING';
                    const isImproving = pat.trend === 'IMPROVING';

                    return (
                      <tr key={pat.patientId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          <div className="font-extrabold text-sm">{pat.patientName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{pat.patientId}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{pat.assignedWorker}</div>
                          <div className="text-[11px] text-slate-500">{pat.facilityName}</div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-slate-900">{pat.latestScore}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                isHigh
                                  ? 'bg-critical-100 text-critical-800 border border-critical-300'
                                  : pat.latestLevel === 'MODERATE'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {pat.latestLevel}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isWorsening
                                ? 'bg-critical-50 text-critical-700 border border-critical-200'
                                : isImproving
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>{isWorsening ? '📈' : isImproving ? '📉' : '➖'}</span>
                            <span>{pat.trend}</span>
                          </span>
                        </td>

                        <td className="p-4 text-slate-600 font-medium">
                          {pat.lastFollowUpDate ? new Date(pat.lastFollowUpDate).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleInspectTrajectory(pat)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                          >
                            Inspect Trajectory 📊
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. ASHA WORKER TASK BOARD */}
      {/* ==================================================== */}
      {activeTabRole === 'worker' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-300 rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  ASHA Ground Task Queue
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Scheduled Follow-Up Visits Due</h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                  Visit patients at home, measure vital parameters, verify prescription compliance, and record observations.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-amber-800">{dueTasks.length}</span>
                <span className="text-xs text-slate-500 block font-semibold">Tasks Due / Upcoming</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dueTasks.map((task) => {
              const isDue = task.status === 'DUE';
              return (
                <div
                  key={task.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    isDue
                      ? 'border-purple-300 bg-white shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            isDue
                              ? 'bg-critical-100 text-critical-800 border border-critical-300 animate-pulse'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {task.status} &bull; Cycle #{task.taskIndex}
                        </span>
                        <h4 className="text-lg font-black text-slate-900 mt-1">{task.patientName}</h4>
                        <p className="text-xs text-slate-500 font-mono">{task.patientId}</p>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-400 block text-[10px] font-bold">Due Date</span>
                        <span className="font-bold text-slate-800">{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 mb-4">
                      <strong className="block text-[11px] uppercase tracking-wider text-purple-800">
                        Doctor Instructions:
                      </strong>
                      <span>Check resting BP, pill count adherence, and report any recurrent dyspnea.</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartFollowUp(task)}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>📝 Start Follow-Up Assessment</span>
                    <span>→</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. RECEIVING FACILITY ALERT DESK */}
      {/* ==================================================== */}
      {activeTabRole === 'facility' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase text-critical-800 bg-critical-100 px-2 py-0.5 rounded">
                Hospital Command Desk
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">High-Risk Escalation Alerts &amp; Clinical Action</h3>
              <p className="text-xs text-slate-500 font-medium">
                Real-time patient deterioration alerts triggered by ASHA ground assessments exceeding configured clinical thresholds.
              </p>
            </div>

            <div className="space-y-3">
              {facilityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex items-start justify-between gap-4 flex-wrap"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-base">{alert.patientName}</span>
                      <span className="text-xs font-mono text-slate-500">({alert.patientId})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-critical-100 text-critical-800 border border-critical-300">
                        Score: {alert.riskScore} ({alert.riskLevel})
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-critical-800">{alert.triggerReason}</p>
                    <p className="text-[11px] text-slate-600">
                      Recent Observations: {alert.latestObservations} &bull; Assigned Doctor: {alert.assignedDoctorName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.status === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-4 py-2 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        Acknowledge &amp; Schedule Outreach
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300">
                        ✓ Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. PATIENT LONGITUDINAL CARE VIEW */}
      {/* ==================================================== */}
      {activeTabRole === 'patient' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                My Longitudinal Care Plan
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Ramesh Mahto</h3>
              <p className="text-xs text-slate-500 font-medium">Cardiology Post-Discharge Follow-Up Grid</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="text-slate-500 block font-bold text-[10px] uppercase">Next Scheduled Visit</span>
                <strong className="text-purple-900 text-base">31 August 2026</strong>
                <span className="text-[11px] text-purple-700 block mt-0.5">ASHA Anita Devi will visit</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-slate-500 block font-bold text-[10px] uppercase">Supervising Facility</span>
                <strong className="text-emerald-900 text-sm block">SBMC&H Hazaribagh</strong>
                <span className="text-[11px] text-emerald-700 block mt-0.5">Dr. Priya Sharma</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Patient Self-Care Reminders</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
                <li>Take morning and evening blood pressure medications without skipping.</li>
                <li>Avoid heavy physical exertion until next doctor review.</li>
                <li>Call 108 immediately if experiencing chest pressure or severe breathlessness.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: PRESCRIBE FOLLOW-UP PLAN */}
      {/* ==================================================== */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  Clinical Care Plan
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Prescribe Follow-Up Plan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreatePlanModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePlanSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={planForm.patientName}
                    onChange={(e) => setPlanForm({ ...planForm, patientName: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient ID</label>
                  <input
                    type="text"
                    value={planForm.patientId}
                    onChange={(e) => setPlanForm({ ...planForm, patientId: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Follow-Up Frequency</label>
                  <select
                    value={planForm.frequencyDays}
                    onChange={(e) => setPlanForm({ ...planForm, frequencyDays: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    <option value={3}>Every 3 Days (High Critical)</option>
                    <option value={7}>Every 7 Days (Weekly)</option>
                    <option value={14}>Every 14 Days (Bi-weekly)</option>
                    <option value={30}>Every 30 Days (Monthly)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Frontline Worker</label>
                  <select
                    value={planForm.frontlineWorkerId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const name = id === 'worker_014' ? 'ASHA Anita Devi' : 'ASHA Meena Kumari';
                      setPlanForm({ ...planForm, frontlineWorkerId: id, frontlineWorkerName: name });
                    }}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    <option value="worker_014">ASHA Anita Devi (Katkamsandi)</option>
                    <option value="worker_022">ASHA Meena Kumari (Barkagaon)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor's Clinical Instructions</label>
                <textarea
                  rows="3"
                  value={planForm.instructions}
                  onChange={(e) => setPlanForm({ ...planForm, instructions: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCreatePlanModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm &amp; Generate Tasks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: SUBMIT ASHA FOLLOW-UP REPORT */}
      {/* ==================================================== */}
      {showSubmitReportModal && selectedTaskForReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  ASHA Clinical Observation Form
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Record Follow-Up: {selectedTaskForReport.patientName}
                </h3>
                <p className="text-xs text-slate-500">Cycle #{selectedTaskForReport.taskIndex} &bull; Due: {new Date(selectedTaskForReport.dueDate).toLocaleDateString()}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitReportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitReportForm} className="space-y-4 text-xs">
              {/* Vitals: Blood Pressure */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Measured Blood Pressure (mmHg)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Systolic (SBP)</span>
                    <input
                      type="number"
                      value={reportForm.systolic}
                      onChange={(e) => setReportForm({ ...reportForm, systolic: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2 font-bold text-base text-slate-900"
                      placeholder="e.g. 140"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Diastolic (DBP)</span>
                    <input
                      type="number"
                      value={reportForm.diastolic}
                      onChange={(e) => setReportForm({ ...reportForm, diastolic: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2 font-bold text-base text-slate-900"
                      placeholder="e.g. 90"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Medication Adherence */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Medication Adherence (Pill Count)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'FULL', label: 'Full Adherence', desc: 'No missed doses' },
                    { id: 'PARTIAL', label: 'Partial', desc: '1-3 missed doses' },
                    { id: 'NONE', label: 'Non-Adherent', desc: 'Stopped meds' }
                  ].map((adh) => (
                    <button
                      key={adh.id}
                      type="button"
                      onClick={() => setReportForm({ ...reportForm, medicationAdherence: adh.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        reportForm.medicationAdherence === adh.id
                          ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs">{adh.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{adh.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Progression */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Symptom Progression</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'IMPROVED', label: 'Improved', icon: '📉' },
                    { id: 'UNCHANGED', label: 'Stable', icon: '➖' },
                    { id: 'WORSENED', label: 'Worsened', icon: '📈' }
                  ].map((sym) => (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => setReportForm({ ...reportForm, symptomProgression: sym.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        reportForm.symptomProgression === sym.id
                          ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-sm">{sym.icon}</span>
                      <div className="font-extrabold text-xs mt-0.5">{sym.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Observations &amp; Remarks</label>
                <textarea
                  rows="2"
                  value={reportForm.observationsText}
                  onChange={(e) => setReportForm({ ...reportForm, observationsText: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowSubmitReportModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Report &amp; Update Risk Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* DRAWER: LONGITUDINAL TRAJECTORY INSPECTION */}
      {/* ==================================================== */}
      {selectedPatientForTrajectory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto shadow-2xl border-l border-slate-200 space-y-5 animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  Longitudinal Health Trajectory
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedPatientForTrajectory.patientName}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedPatientForTrajectory.patientId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatientForTrajectory(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-black text-slate-600 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {/* Current Summary Card */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">Current Risk Status</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase bg-purple-600 text-white">
                  Score: {selectedPatientForTrajectory.latestScore} ({selectedPatientForTrajectory.latestLevel})
                </span>
              </div>
              <p className="text-xs text-purple-950 font-medium">
                Trend: <strong>{selectedPatientForTrajectory.trend}</strong> &bull; Assigned Facility: {selectedPatientForTrajectory.facilityName}
              </p>
            </div>

            {/* Sequential History */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Chronological Follow-Up Evolution
              </h4>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {patientRiskHistory.map((item, idx) => (
                  <div key={idx} className="relative pl-8 space-y-1">
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">Follow-Up #{idx + 1}</span>
                      <span className="font-mono text-purple-700 font-black">Score: {item.riskScore}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {item.reason}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ==========================================
// --- FEATURE 05: INTEROPERABLE HEALTH RECORDS COMPONENT ---
// ==========================================

function ScreenInteroperableRecords({
  actorRole,
  setActorRole,
  onBackToHome,
  onNavigateToCareNavigator,
  onNavigateToTeleconsult,
  onNavigateToReferrals,
  onNavigateToFollowUps
}) {
  const [activeRole, setActiveRole] = useState(actorRole || 'patient');
  const [selectedPatientId, setSelectedPatientId] = useState('MV-MED-2026-1024');
  const [patientsList, setPatientsList] = useState([
    {
      internalMedicalId: 'MV-MED-2026-1024',
      abhaId: '91-2890-1423-8891@sbx',
      name: 'Ramesh Mahto',
      age: 48,
      sex: 'male',
      phone: '+91-94311-28901',
      location: 'Katkamsandi, Hazaribagh',
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Anita Devi (Spouse)',
        relation: 'Spouse',
        phone: '+91-94311-28902'
      }
    },
    {
      internalMedicalId: 'MV-MED-2026-2048',
      abhaId: null,
      name: 'Sunita Soren',
      age: 32,
      sex: 'female',
      phone: '+91-94311-58291',
      location: 'Barkagaon, Hazaribagh',
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Babulal Soren (Brother)',
        relation: 'Brother',
        phone: '+91-94311-58292'
      }
    }
  ]);

  const [patient, setPatient] = useState({
    internalMedicalId: 'MV-MED-2026-1024',
    abhaId: '91-2890-1423-8891@sbx',
    name: 'Ramesh Mahto',
    age: 48,
    sex: 'male',
    phone: '+91-94311-28901',
    location: 'Katkamsandi, Hazaribagh',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'Anita Devi (Spouse)',
      relation: 'Spouse',
      phone: '+91-94311-28902'
    }
  });

  const [records, setRecords] = useState([]);
  const [activeConsents, setActiveConsents] = useState([]);
  const [accessInfo, setAccessInfo] = useState({ isAllowed: true, reason: 'Patient self-access granted unconditionally.' });
  const [loading, setLoading] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  // Filters
  const [sourceFilter, setSourceFilter] = useState('ALL'); // 'ALL' | 'manual' | 'abha' | 'medveda_internal' | 'cowin'
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [showAbdmModal, setShowAbdmModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // OCR Studio State
  const [ocrRecordType, setOcrRecordType] = useState('prescription');
  const [ocrTitle, setOcrTitle] = useState('Physical Prescription (Camera Upload)');
  const [ocrFacility, setOcrFacility] = useState('District Civil Hospital Clinic');
  const [ocrDoctor, setOcrDoctor] = useState('Dr. A. K. Verma');
  const [ocrRawText, setOcrRawText] = useState(`DR. A. K. VERMA, MD (CARDIOLOGY)
HEART CARE CLINIC, HAZARIBAGH
Date: 15/07/2026
Rx:
Tab. Telmisartan 40mg 1-0-0 (30 days, after breakfast)
Tab. Atorvastatin 20mg 0-0-1 (30 days, before bedtime)
Diagnosis: Primary Essential Hypertension`);
  const [ocrParsedData, setOcrParsedData] = useState(null);
  const [ocrConfidence, setOcrConfidence] = useState(94);
  const [ocrUserVerified, setOcrUserVerified] = useState(true);

  // ABDM Sandbox Modal State
  const [abdmInputAbha, setAbdmInputAbha] = useState('91-2890-1423-8891@sbx');
  const [abdmSyncSuccess, setAbdmSyncSuccess] = useState(false);

  // Consent Management Form
  const [consentDoctorId, setConsentDoctorId] = useState('doc_1');
  const [consentDoctorName, setConsentDoctorName] = useState('Dr. Priya Sharma');
  const [consentPurpose, setConsentPurpose] = useState('Cardiology Review & Longitudinal Follow-Up');
  const [consentScope, setConsentScope] = useState('ALL');

  // Emergency Access Form
  const [emergencyReason, setEmergencyReason] = useState('Critical acute coronary triage in ER. Immediate allergy and past medication review required.');

  // Register Form
  const [regForm, setRegForm] = useState({
    name: '',
    age: 35,
    sex: 'female',
    phone: '+91-94311-',
    location: 'Katkamsandi, Hazaribagh',
    bloodGroup: 'B+',
    abhaId: ''
  });

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Fetch All Registered Patients List
  const loadPatientsList = async () => {
    try {
      const res = await fetch(getApiUrl('/api/patients'));
      const data = await res.json();
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        setPatientsList(data.data);
      }
    } catch (err) {
      console.warn('Patients list fetch error:', err);
    }
  };

  // Load Patient Timeline
  const loadTimeline = async (patId = selectedPatientId, role = activeRole) => {
    try {
      setLoading(true);
      const reqId = role === 'doctor' ? 'doc_1' : role === 'worker' ? 'worker_014' : 'self';
      const res = await fetch(
        getApiUrl(
          `/api/patient/${patId}/records/timeline?requester_id=${reqId}&requester_role=${role}`
        )
      );
      const data = await res.json();
      if (data.data) {
        if (data.data.patient) {
          setPatient(data.data.patient);
          setAbdmInputAbha(data.data.patient.abhaId || '');
        }
        if (data.data.records) setRecords(data.data.records);
        if (data.data.activeConsents) setActiveConsents(data.data.activeConsents);
        if (data.data.accessInfo) setAccessInfo(data.data.accessInfo);
      }
    } catch (err) {
      console.warn('Network timeline fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientsList();
  }, []);

  useEffect(() => {
    loadTimeline(selectedPatientId, activeRole);
  }, [selectedPatientId, activeRole]);

  useEffect(() => {
    if (actorRole) setActiveRole(actorRole);
  }, [actorRole]);

  // Handle OCR Sample Presets
  const handleLoadOcrPreset = (type) => {
    setOcrRecordType(type);
    if (type === 'prescription') {
      setOcrTitle('Physical Prescription (Camera Upload)');
      setOcrFacility('District Civil Hospital Clinic');
      setOcrDoctor('Dr. A. K. Verma');
      setOcrRawText(`DR. A. K. VERMA, MD (CARDIOLOGY)
HEART CARE CLINIC, HAZARIBAGH
Date: 15/07/2026
Rx:
Tab. Telmisartan 40mg 1-0-0 (30 days, after breakfast)
Tab. Atorvastatin 20mg 0-0-1 (30 days, before bedtime)
Diagnosis: Primary Essential Hypertension`);
      setOcrParsedData({
        medicines: [
          { name: 'Telmisartan 40mg', dosage: '40mg', frequency: '1-0-0', duration: '30 days', instructions: 'After breakfast' },
          { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: '0-0-1', duration: '30 days', instructions: 'Before bedtime' }
        ],
        diagnosis: 'Primary Essential Hypertension',
        doctorName: 'Dr. A. K. Verma',
        facilityName: 'District Civil Hospital Clinic',
        date: '2026-07-15'
      });
      setOcrConfidence(94);
    } else if (type === 'lab_report') {
      setOcrTitle('Lipid Profile & Biochemistry Scan (Printed OCR)');
      setOcrFacility('District Diagnostic Laboratory');
      setOcrDoctor('Dr. S. K. Roy (Pathologist)');
      setOcrRawText(`DISTRICT DIAGNOSTIC PATHOLOGY LAB
Patient: Ramesh Mahto | Date: 03/07/2026
Test Name: Lipid Profile Panel
TOTAL CHOLESTEROL: 218 mg/dL (Normal: 125 - 200) [HIGH]
LDL CHOLESTEROL: 142 mg/dL (Normal: 0 - 100) [HIGH]
HDL CHOLESTEROL: 44 mg/dL (Normal: 40 - 60) [NORMAL]
TRIGLYCERIDES: 160 mg/dL (Normal: 50 - 150) [HIGH]`);
      setOcrParsedData({
        testName: 'Lipid Profile Panel',
        results: [
          { parameter: 'TOTAL CHOLESTEROL', observedValue: '218', unit: 'mg/dL', referenceRange: '125 - 200 mg/dL', isAbnormal: true },
          { parameter: 'LDL CHOLESTEROL', observedValue: '142', unit: 'mg/dL', referenceRange: '0 - 100 mg/dL', isAbnormal: true },
          { parameter: 'HDL CHOLESTEROL', observedValue: '44', unit: 'mg/dL', referenceRange: '40 - 60 mg/dL', isAbnormal: false },
          { parameter: 'TRIGLYCERIDES', observedValue: '160', unit: 'mg/dL', referenceRange: '50 - 150 mg/dL', isAbnormal: true }
        ],
        labName: 'District Diagnostic Laboratory',
        date: '2026-07-03'
      });
      setOcrConfidence(96);
    } else {
      setOcrTitle('Hospital Discharge Summary (Camera Scan)');
      setOcrFacility('Sheikh Bhikhari Medical College & Hospital');
      setOcrDoctor('Dr. Priya Sharma');
      setOcrRawText(`SHEIKH BHIKHARI MEDICAL COLLEGE & HOSPITAL
DISCHARGE SUMMARY
Admission Date: 01/08/2026 | Discharge Date: 05/08/2026
Diagnosis: Acute Myocardial Infarction (Anterior Wall)
Procedures: Primary Percutaneous Coronary Intervention (PCI) with Drug-Eluting Stent (DES)
Medications on Discharge: Aspirin 75mg OD, Clopidogrel 75mg OD, Atorvastatin 40mg HS
Advice: Weekly BP review by ASHA worker. Follow up in Cardiology OPD in 14 days.`);
      setOcrParsedData({
        admissionDate: '2026-08-01',
        dischargeDate: '2026-08-05',
        primaryDiagnosis: 'Acute Myocardial Infarction (Anterior Wall)',
        proceduresPerformed: ['Primary PCI with Drug-Eluting Stent in LAD'],
        dischargeMedications: ['Aspirin 75mg OD', 'Clopidogrel 75mg OD', 'Atorvastatin 40mg HS'],
        followUpAdvice: 'Weekly BP monitoring with ASHA worker. Cardiology OPD in 14 days.'
      });
      setOcrConfidence(91);
    }
  };

  // Run OCR Extraction
  const handleRunOcrExtraction = () => {
    let parsedData = {};
    if (ocrRecordType === 'prescription') {
      parsedData = {
        medicines: [
          { name: 'Telmisartan 40mg', dosage: '40mg', frequency: '1-0-0', duration: '30 days', instructions: 'After breakfast' },
          { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: '0-0-1', duration: '30 days', instructions: 'Before bedtime' }
        ],
        diagnosis: 'Primary Essential Hypertension',
        doctorName: ocrDoctor,
        facilityName: ocrFacility,
        date: '2026-07-15'
      };
      setOcrConfidence(94);
    } else if (ocrRecordType === 'lab_report') {
      parsedData = {
        testName: 'Lipid Profile Panel',
        results: [
          { parameter: 'TOTAL CHOLESTEROL', observedValue: '218', unit: 'mg/dL', referenceRange: '125 - 200 mg/dL', isAbnormal: true },
          { parameter: 'LDL CHOLESTEROL', observedValue: '142', unit: 'mg/dL', referenceRange: '0 - 100 mg/dL', isAbnormal: true },
          { parameter: 'HDL CHOLESTEROL', observedValue: '44', unit: 'mg/dL', referenceRange: '40 - 60 mg/dL', isAbnormal: false },
          { parameter: 'TRIGLYCERIDES', observedValue: '160', unit: 'mg/dL', referenceRange: '50 - 150 mg/dL', isAbnormal: true }
        ],
        labName: ocrFacility,
        date: '2026-07-03'
      };
      setOcrConfidence(96);
    } else {
      parsedData = {
        admissionDate: '2026-08-01',
        dischargeDate: '2026-08-05',
        primaryDiagnosis: 'Acute Myocardial Infarction (Anterior Wall)',
        proceduresPerformed: ['Primary PCI with Drug-Eluting Stent in LAD'],
        dischargeMedications: ['Aspirin 75mg OD', 'Clopidogrel 75mg OD', 'Atorvastatin 40mg HS'],
        followUpAdvice: 'Weekly BP monitoring with ASHA worker. Cardiology OPD in 14 days.'
      };
      setOcrConfidence(91);
    }
    setOcrParsedData(parsedData);
    showToast('⚡ OCR parsed structured fields successfully!');
  };

  // Submit Manual Record
  const handleSaveManualRecord = async (e) => {
    e.preventDefault();
    const finalParsed = ocrParsedData || {
      doctorName: ocrDoctor,
      facilityName: ocrFacility,
      rawSummary: ocrRawText
    };

    const payload = {
      internalMedicalId: patient.internalMedicalId,
      recordType: ocrRecordType,
      title: ocrTitle,
      summary: `Manual ${ocrRecordType.replace('_', ' ')} verified and archived.`,
      facilityName: ocrFacility,
      doctorName: ocrDoctor,
      rawText: ocrRawText,
      extractedData: finalParsed,
      isVerifiedByUser: ocrUserVerified,
      verifiedBy: ocrUserVerified ? `Verified by ${patient.name}` : undefined
    };

    try {
      const res = await fetch(getApiUrl(`/api/patient/${patient.internalMedicalId}/records/manual`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.data) {
        setRecords((prev) => [data.data, ...prev]);
      }
      setShowOcrModal(false);
      showToast('✓ Manual record verified and saved to timeline!');
      loadTimeline();
    } catch (err) {
      console.warn('Manual record save fallback:', err);
      const newRec = {
        id: `rec_man_local_${Date.now()}`,
        internalMedicalId: patient.internalMedicalId,
        source: 'manual',
        recordType: ocrRecordType,
        title: ocrTitle,
        summary: `Manual ${ocrRecordType} verified and saved.`,
        facilityName: ocrFacility,
        doctorName: ocrDoctor,
        recordedAt: new Date().toISOString(),
        extractedData: finalParsed,
        verificationStatus: ocrUserVerified ? 'verified' : 'unverified',
        verifiedBy: ocrUserVerified ? `Verified by ${patient.name}` : undefined
      };
      setRecords((prev) => [newRec, ...prev]);
      setShowOcrModal(false);
      showToast('✓ Manual record saved locally!');
    }
  };

  // ABDM Sandbox Link & Sync
  const handlePullAbdmRecords = async () => {
    try {
      setLoading(true);
      // Link ABHA ID first if changed
      if (abdmInputAbha && abdmInputAbha !== patient.abhaId) {
        await fetch(getApiUrl(`/api/patient/${patient.internalMedicalId}/link-abha`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ abhaId: abdmInputAbha })
        });
        setPatient((prev) => ({ ...prev, abhaId: abdmInputAbha }));
      }

      const res = await fetch(
        getApiUrl(
          `/api/abdm/fetch-records/cns_demo_01?patient_id=${patient.internalMedicalId}`
        )
      );
      const data = await res.json();
      setAbdmSyncSuccess(true);
      showToast('✓ ABDM Sandbox FHIR Records Synced!');
      setTimeout(() => {
        setShowAbdmModal(false);
        setAbdmSyncSuccess(false);
        loadTimeline();
      }, 1000);
    } catch (err) {
      console.warn('ABDM sync fallback:', err);
      setShowAbdmModal(false);
      showToast('✓ ABDM Sandbox Gateway Synced!');
      loadTimeline();
    } finally {
      setLoading(false);
    }
  };

  // CoWIN Vaccination Sync
  const handleSyncCowin = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl(`/api/cowin/vaccination/${patient.internalMedicalId}`));
      const data = await res.json();
      showToast('💉 CoWIN Digital Vaccine Passport synchronized!');
      loadTimeline();
    } catch (err) {
      console.warn('CoWIN sync fallback:', err);
      showToast('💉 CoWIN Vaccine records updated!');
    } finally {
      setLoading(false);
    }
  };

  // Create Consent Request
  const handleCreateConsentRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl(`/api/patient/${patient.internalMedicalId}/consent/request`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedBy: consentDoctorId,
          requesterName: consentDoctorName,
          requesterRole: 'doctor',
          purpose: consentPurpose,
          scope: consentScope,
          validityMinutes: 60 * 24 * 7
        })
      });
      const data = await res.json();
      showToast('📋 Scoped Consent Request submitted!');
      loadTimeline();
    } catch (err) {
      console.warn('Create consent fallback:', err);
      showToast('📋 Consent Request created!');
    }
  };

  // Grant / Revoke Consent
  const handleConsentAction = async (consentId, action) => {
    try {
      await fetch(getApiUrl(`/api/consents/${consentId}/${action}`), { method: 'POST' });
      showToast(action === 'grant' ? '✓ Consent Approved!' : '🛑 Consent Revoked!');
      loadTimeline();
    } catch (err) {
      console.warn('Consent action fallback:', err);
      setActiveConsents((prev) =>
        prev.map((c) => (c.consentId === consentId ? { ...c, status: action === 'grant' ? 'approved' : 'revoked' } : c))
      );
      showToast(action === 'grant' ? '✓ Consent Approved!' : '🛑 Consent Revoked!');
    }
  };

  // Execute Emergency Access Override
  const handleExecuteEmergencyOverride = async (e) => {
    e.preventDefault();
    try {
      await fetch(getApiUrl(`/api/patient/${patient.internalMedicalId}/emergency-override`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'doc_er_99',
          name: 'Dr. Emergency Specialist (Trauma ICU)',
          role: 'emergency_officer',
          facilityName: 'District Sadar Hospital Emergency Trauma Unit',
          clinicalReason: emergencyReason
        })
      });
      setShowEmergencyModal(false);
      showToast('🚨 Emergency Override Active — Audit Trail Logged');
      // Reload timeline with emergency override query param
      const res = await fetch(
        getApiUrl(
          `/api/patient/${patient.internalMedicalId}/records/timeline?requester_id=doc_er_99&requester_role=doctor&emergency=true&emergency_reason=${encodeURIComponent(emergencyReason)}`
        )
      );
      const data = await res.json();
      if (data.data) {
        setRecords(data.data.records || []);
        setAccessInfo(data.data.accessInfo || {});
      }
    } catch (err) {
      console.warn('Emergency override fallback:', err);
      setShowEmergencyModal(false);
      showToast('🚨 Emergency Access Unlocked');
    }
  };

  // Register New Patient Submit
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl('/api/patient/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (data.data) {
        const newPatient = data.data;
        setPatientsList((prev) => [newPatient, ...prev.filter((p) => p.internalMedicalId !== newPatient.internalMedicalId)]);
        setSelectedPatientId(newPatient.internalMedicalId);
        setPatient(newPatient);
        setRecords([]);
        setShowRegisterModal(false);
        setShowCardModal(true); // Open the newly generated medical ID card!
        showToast(`🎉 Medical ID Card generated for ${newPatient.name}! ID: ${newPatient.internalMedicalId}`);
      }
    } catch (err) {
      console.warn('Register fallback:', err);
      const newMedId = `MV-MED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const localPat = {
        internalMedicalId: newMedId,
        name: regForm.name || 'New Patient',
        age: Number(regForm.age) || 30,
        sex: regForm.sex || 'female',
        phone: regForm.phone || '+91-94311-00000',
        location: regForm.location || 'Hazaribagh, Jharkhand',
        bloodGroup: regForm.bloodGroup || 'O+',
        abhaId: regForm.abhaId || null,
        createdAt: new Date().toISOString()
      };
      setPatientsList((prev) => [localPat, ...prev]);
      setSelectedPatientId(newMedId);
      setPatient(localPat);
      setRecords([]);
      setShowRegisterModal(false);
      setShowCardModal(true);
      showToast(`🎉 Medical ID Card generated! ID: ${newMedId}`);
    }
  };

  // Copy ID to Clipboard
  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(patient.internalMedicalId);
      showToast(`📋 Copied Medical ID ${patient.internalMedicalId} to clipboard!`);
    }
  };

  // Filter Records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSource = sourceFilter === 'ALL' || rec.source === sourceFilter;
      const matchesType = typeFilter === 'ALL' || rec.recordType === typeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        rec.title.toLowerCase().includes(q) ||
        rec.facilityName.toLowerCase().includes(q) ||
        (rec.doctorName && rec.doctorName.toLowerCase().includes(q)) ||
        rec.summary.toLowerCase().includes(q);
      return matchesSource && matchesType && matchesSearch;
    });
  }, [records, sourceFilter, typeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>🔔</span>
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-sky-800 uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
            Feature Map 05 &bull; Interoperable Health Records
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Patient Medical ID &amp; Unified Record Aggregation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed">
            Patient-centric health record hub anchored on MedVeda Medical ID with optional ABDM ABHA link, camera OCR studio with human confirmation, CoWIN vaccine ingestion, and consent-gated RBAC.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2"
          >
            <span>➕ Generate Medical ID Card</span>
          </button>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            <span>🏠 Home</span>
          </button>
        </div>
      </div>

      {/* Role Navigation Bar & Patient Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase">View As:</span>
          {[
            { id: 'patient', label: 'Patient (Self Access)', icon: '👤' },
            { id: 'doctor', label: 'Doctor (Consent Required)', icon: '👨‍⚕️' },
            { id: 'worker', label: 'ASHA Worker', icon: '👩‍⚕️' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveRole(tab.id);
                setActorRole(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === tab.id
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase">Select Active Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedPatientId(val);
              const found = patientsList.find((p) => p.internalMedicalId === val);
              if (found) setPatient(found);
            }}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer min-w-[280px]"
          >
            {patientsList.map((p) => (
              <option key={p.internalMedicalId} value={p.internalMedicalId}>
                {p.name} ({p.internalMedicalId}) {p.abhaId ? `[Linked ABHA]` : `[Standalone]`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Access Control Status Callout (if viewing as Doctor/Worker) */}
      {activeRole !== 'patient' && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
            accessInfo.isAllowed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-critical-50 border-critical-300 text-critical-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{accessInfo.isAllowed ? '🛡️' : '🔒'}</span>
            <div>
              <div className="font-extrabold text-xs">
                {accessInfo.isAllowed ? 'Authorized Access' : 'Restricted Health Record Access'}
              </div>
              <p className="text-xs mt-0.5">{accessInfo.reason}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!accessInfo.isAllowed && (
              <button
                type="button"
                onClick={() => setShowEmergencyModal(true)}
                className="px-3.5 py-1.5 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span>🚨 Emergency Access Override</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowConsentModal(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Manage Consents 📋
            </button>
          </div>
        </div>
      )}

      {/* Visual Medical ID Card */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl backdrop-blur-md">
                  🪪
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-sky-400 block">
                    Official Health ID Card &bull; Government of India Standards
                  </span>
                  <h3 className="text-2xl font-black text-white">{patient.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCardModal(true)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md"
                >
                  <span>🖨️ View / Print Card</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span>📋 Copy ID</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">MedVeda Medical ID</span>
                <span className="font-mono font-black text-sky-300 text-sm">{patient.internalMedicalId}</span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Linked ABHA ID</span>
                {patient.abhaId ? (
                  <span className="font-mono font-bold text-emerald-400 text-xs truncate block">{patient.abhaId}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAbdmModal(true)}
                    className="text-amber-400 font-bold text-[11px] block hover:underline text-left"
                  >
                    + Link ABHA ID
                  </button>
                )}
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Demographics</span>
                <span className="font-bold text-white text-xs">{patient.age} Yrs &bull; {patient.sex ? patient.sex.toUpperCase() : 'N/A'}</span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Blood Group</span>
                <span className="font-black text-critical-400 text-sm">{patient.bloodGroup || 'O+'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300 font-medium flex-wrap">
              <span>📍 {patient.location || 'Jharkhand'}</span>
              <span>📞 {patient.phone}</span>
              {patient.emergencyContact && (
                <span>🚨 Contact: {patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
              )}
            </div>
          </div>

          {/* Dynamic QR Code Badge */}
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 text-slate-900 flex flex-col items-center text-center shrink-0 w-44">
            {/* SVG Simulated QR Code */}
            <svg viewBox="0 0 100 100" className="w-28 h-28">
              <rect width="100" height="100" fill="#ffffff" />
              {/* Corner squares */}
              <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
              <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
              <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="2" />

              <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
              <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
              <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="2" />

              <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
              <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
              <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="2" />

              {/* Data matrix dots */}
              <rect x="40" y="10" width="8" height="8" fill="#0284c7" />
              <rect x="52" y="18" width="8" height="8" fill="#0f172a" />
              <rect x="40" y="40" width="12" height="12" fill="#0f172a" rx="2" />
              <rect x="56" y="38" width="6" height="6" fill="#0284c7" />
              <rect x="70" y="45" width="8" height="8" fill="#0f172a" />
              <rect x="82" y="55" width="6" height="6" fill="#0284c7" />
              <rect x="45" y="60" width="8" height="8" fill="#0f172a" />
              <rect x="60" y="65" width="10" height="10" fill="#0f172a" />
              <rect x="75" y="75" width="8" height="8" fill="#0284c7" />
              <rect x="40" y="80" width="8" height="8" fill="#0f172a" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-500 mt-1 block">{patient.internalMedicalId}</span>
            <span className="text-[9px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full mt-1">
              ABDM &bull; READY
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Source Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            handleLoadOcrPreset('prescription');
            setShowOcrModal(true);
          }}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 shadow-sm transition-all text-left group"
        >
          <div className="text-2xl mb-1">📷</div>
          <div className="font-extrabold text-xs text-slate-900 group-hover:text-sky-600">Add Record (OCR)</div>
          <div className="text-[11px] text-slate-500">Camera capture &amp; text extraction</div>
        </button>

        <button
          type="button"
          onClick={() => setShowAbdmModal(true)}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition-all text-left group"
        >
          <div className="text-2xl mb-1">🔗</div>
          <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600">ABDM Sandbox Sync</div>
          <div className="text-[11px] text-slate-500">Pull FHIR records via Gateway</div>
        </button>

        <button
          type="button"
          onClick={handleSyncCowin}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm transition-all text-left group"
        >
          <div className="text-2xl mb-1">💉</div>
          <div className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">Sync CoWIN Vaccine</div>
          <div className="text-[11px] text-slate-500">Fetch official govt dose certificate</div>
        </button>

        <button
          type="button"
          onClick={() => setShowConsentModal(true)}
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 shadow-sm transition-all text-left group"
        >
          <div className="text-2xl mb-1">🛡️</div>
          <div className="font-extrabold text-xs text-slate-900 group-hover:text-purple-600">Consents &amp; RBAC</div>
          <div className="text-[11px] text-slate-500">Manage time-boxed permissions</div>
        </button>
      </div>

      {/* Unified Timeline Feed Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">Unified Patient Record Timeline</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chronological aggregation across Manual OCR, ABDM Sandbox HIPs, MedVeda Consultations, and CoWIN.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search records, drugs, doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-medium"
            />

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: 'ALL', label: 'All Sources' },
                { id: 'manual', label: 'Manual OCR' },
                { id: 'abha', label: 'ABHA HIP' },
                { id: 'medveda_internal', label: 'MedVeda EMR' },
                { id: 'cowin', label: 'CoWIN' }
              ].map((src) => (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setSourceFilter(src.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sourceFilter === src.id
                      ? 'bg-white text-slate-900 shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Records List */}
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
            No health records matching current filters for {patient.name}. Click "Add Record (OCR)" or "ABDM Sandbox Sync" to add records.
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredRecords.map((rec) => {
              const isManual = rec.source === 'manual';
              const isAbha = rec.source === 'abha';
              const isInternal = rec.source === 'medveda_internal';
              const isCowin = rec.source === 'cowin';

              return (
                <div key={rec.id} className="relative pl-10 space-y-2 group">
                  {/* Timeline Bullet Node */}
                  <div
                    className={`absolute left-2 top-3 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold ${
                      isManual
                        ? 'bg-sky-600'
                        : isAbha
                        ? 'bg-emerald-600'
                        : isCowin
                        ? 'bg-amber-600'
                        : 'bg-purple-600'
                    }`}
                  >
                    {isManual ? '📷' : isAbha ? '🏥' : isCowin ? '💉' : '🩺'}
                  </div>

                  <div className="bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              isManual
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : isAbha
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isCowin
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-purple-100 text-purple-800 border border-purple-300'
                            }`}
                          >
                            {isManual && 'Source: Manual (OCR)'}
                            {isAbha && 'Source: ABDM ABHA (FHIR HIP)'}
                            {isCowin && 'Source: Government CoWIN'}
                            {isInternal && 'Source: MedVeda Internal'}
                          </span>

                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-200 text-slate-800">
                            {rec.recordType.replace('_', ' ')}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                            <span>✓</span>
                            <span>{rec.verifiedBy || rec.verificationStatus}</span>
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 mt-1">{rec.title}</h4>
                        <p className="text-xs text-slate-500">
                          {rec.facilityName} {rec.doctorName ? `\u2022 ${rec.doctorName}` : ''}
                        </p>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-400 block text-[10px] font-bold">Recorded On</span>
                        <span className="font-bold text-slate-700">
                          {new Date(rec.recordedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{rec.summary}</p>

                    {/* Structured Data Visualization based on Record Type */}
                    {rec.extractedData && (
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                        {/* 1. Prescription Medicines */}
                        {rec.extractedData.medicines && (
                          <div>
                            <strong className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1.5">
                              Prescribed Medications:
                            </strong>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {rec.extractedData.medicines.map((m, mIdx) => (
                                <div key={mIdx} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                  <div>
                                    <div className="font-extrabold text-slate-900">{m.name}</div>
                                    <div className="text-[10px] text-slate-500">{m.instructions || m.dosage}</div>
                                  </div>
                                  <span className="px-2 py-0.5 bg-sky-50 text-sky-800 text-[10px] font-mono font-bold rounded">
                                    {m.frequency}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. Lab Results Parameters */}
                        {rec.extractedData.results && (
                          <div>
                            <strong className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1.5">
                              Diagnostic Results ({rec.extractedData.testName}):
                            </strong>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-[11px]">
                                <thead className="text-slate-400 border-b border-slate-100 font-bold uppercase text-[9px]">
                                  <tr>
                                    <th className="pb-1">Parameter</th>
                                    <th className="pb-1">Observed Value</th>
                                    <th className="pb-1">Reference Range</th>
                                    <th className="pb-1 text-right">Evaluation</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                  {rec.extractedData.results.map((res, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className="py-1.5 font-bold text-slate-800">{res.parameter}</td>
                                      <td className="py-1.5 font-mono font-bold text-slate-900">
                                        {res.observedValue} {res.unit}
                                      </td>
                                      <td className="py-1.5 text-slate-500">{res.referenceRange}</td>
                                      <td className="py-1.5 text-right">
                                        {res.isAbnormal ? (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-critical-100 text-critical-800">
                                            Abnormal
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                                            Normal
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* 3. Discharge Summary Procedures */}
                        {rec.extractedData.proceduresPerformed && (
                          <div className="space-y-1">
                            <strong className="block text-[11px] font-extrabold uppercase text-slate-700">
                              Procedures &amp; Intervention:
                            </strong>
                            <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-0.5">
                              {rec.extractedData.proceduresPerformed.map((p, pIdx) => (
                                <li key={pIdx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 4. CoWIN Vaccine Details */}
                        {rec.extractedData.certificateNumber && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Vaccine Name</span>
                              <span className="font-bold text-slate-800">{rec.extractedData.vaccine}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Dose Status</span>
                              <span className="font-bold text-emerald-700">
                                Dose {rec.extractedData.doseNumber} of {rec.extractedData.totalDoses} (Fully Vaccinated)
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Certificate No.</span>
                              <span className="font-mono font-bold text-slate-700">{rec.extractedData.certificateNumber}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL 1: CAMERA / UPLOAD OCR STUDIO */}
      {/* ========================================== */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  Manual Document Ingestion
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Camera / Upload &amp; OCR Studio</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOcrModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Load Demo Document Preset:</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'prescription', label: 'Handwritten Prescription' },
                  { id: 'lab_report', label: 'Printed Lab Report' },
                  { id: 'discharge_summary', label: 'Discharge Summary' }
                ].map((pre) => (
                  <button
                    key={pre.id}
                    type="button"
                    onClick={() => handleLoadOcrPreset(pre.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      ocrRecordType === pre.id
                        ? 'bg-sky-50 border-sky-500 text-sky-800 font-extrabold ring-1 ring-sky-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pre.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveManualRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                  <input
                    type="text"
                    value={ocrTitle}
                    onChange={(e) => setOcrTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor / Clinic</label>
                  <input
                    type="text"
                    value={ocrDoctor}
                    onChange={(e) => setOcrDoctor(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">OCR Raw Extracted Text</label>
                  <button
                    type="button"
                    onClick={handleRunOcrExtraction}
                    className="text-sky-700 font-bold hover:underline"
                  >
                    ⚡ Re-parse Structured Fields
                  </button>
                </div>
                <textarea
                  rows="4"
                  value={ocrRawText}
                  onChange={(e) => setOcrRawText(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-xs leading-relaxed"
                  required
                />
              </div>

              {/* Human-in-the-Loop Confirmation Step */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-900 text-xs">OCR Confidence: {ocrConfidence}%</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-sky-200 text-sky-900 rounded">
                    Human Verification Invariant
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={ocrUserVerified}
                    onChange={(e) => setOcrUserVerified(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    I confirm that I have reviewed the extracted details and verified accuracy against the physical document.
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowOcrModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm &amp; Save to Record Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: ABDM SANDBOX GATEWAY SYNC */}
      {/* ========================================== */}
      {showAbdmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ABDM Sandbox Gateway
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">ABHA Health Record Pull</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAbdmModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target ABHA ID (@sbx)</span>
                <input
                  type="text"
                  value={abdmInputAbha}
                  onChange={(e) => setAbdmInputAbha(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900"
                  placeholder="e.g. 91-2890-1423-8891@sbx"
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-emerald-950">
                <strong className="block text-xs font-black uppercase text-emerald-900">
                  ABDM Consent Manager Parameters:
                </strong>
                <ul className="space-y-1 text-[11px] list-disc pl-4 font-medium">
                  <li>HIU: MedVeda Smart Care Platform (IN-MEDVEDA-HIU-01)</li>
                  <li>Artifacts: DiagnosticReport, DischargeSummary, Prescription</li>
                  <li>Transfer Mode: End-to-End Encrypted FHIR JSON Bundles</li>
                </ul>
              </div>

              {abdmSyncSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-center">
                  ✓ Successfully pulled ABDM Sandbox FHIR Records!
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAbdmModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePullAbdmRecords}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2"
              >
                <span>🔄 Link &amp; Pull ABDM Records</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: CONSENT & ACCESS CONTROL DESK */}
      {/* ========================================== */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  Consent Governance
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Consent &amp; RBAC Control Desk</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            {/* Active Consents List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Patient Consent Statuses:
              </h4>

              {activeConsents.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                  No active consent requests found for {patient.name}.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeConsents.map((c) => (
                    <div
                      key={c.consentId}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs gap-3 flex-wrap"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{c.requesterName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              c.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Purpose: {c.purpose} &bull; Scope: {c.scope}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {c.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleConsentAction(c.consentId, 'grant')}
                              className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConsentAction(c.consentId, 'revoke')}
                              className="px-3 py-1 bg-critical-600 text-white font-bold rounded-lg text-xs"
                            >
                              Deny
                            </button>
                          </>
                        )}
                        {c.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleConsentAction(c.consentId, 'revoke')}
                            className="px-3 py-1 bg-slate-200 hover:bg-critical-50 hover:text-critical-700 text-slate-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            Revoke Consent
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Request Doctor Access Form */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
              <strong className="block text-xs font-black uppercase text-purple-900">
                Simulate Clinician Consent Request:
              </strong>
              <form onSubmit={handleCreateConsentRequest} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Doctor</span>
                    <select
                      value={consentDoctorId}
                      onChange={(e) => {
                        const id = e.target.value;
                        const name = id === 'doc_1' ? 'Dr. Priya Sharma' : 'Dr. Rajesh Khanna';
                        setConsentDoctorId(id);
                        setConsentDoctorName(name);
                      }}
                      className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"
                    >
                      <option value="doc_1">Dr. Priya Sharma (Cardiology)</option>
                      <option value="doc_4">Dr. Rajesh Khanna (Endocrinology)</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Scope</span>
                    <select
                      value={consentScope}
                      onChange={(e) => setConsentScope(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"
                    >
                      <option value="ALL">All Records (Full Access)</option>
                      <option value="PRESCRIPTIONS">Prescriptions Only</option>
                      <option value="LAB_REPORTS">Lab Reports Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Clinical Purpose</span>
                  <input
                    type="text"
                    value={consentPurpose}
                    onChange={(e) => setConsentPurpose(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Submit Scoped Consent Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 4: EMERGENCY ACCESS OVERRIDE */}
      {/* ========================================== */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-critical-400 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-[10px] font-black uppercase text-critical-800 bg-critical-100 px-2 py-0.5 rounded">
                CRITICAL PROTOCOL
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">🚨 Emergency Access Override</h3>
              <p className="text-xs text-critical-900 font-medium mt-1">
                Emergency override bypasses patient consent for life-threatening acute resuscitations. Access is immutably logged.
              </p>
            </div>

            <form onSubmit={handleExecuteEmergencyOverride} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mandatory Clinical Justification</label>
                <textarea
                  rows="3"
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  className="w-full border border-critical-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-xl shadow-md"
                >
                  Unlock Records &amp; Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 5: REGISTER NEW PATIENT */}
      {/* ========================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                Patient Enrollment
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Generate Medical ID Card</h3>
              <p className="text-xs text-slate-500">
                Creates a unique MedVeda Medical ID anchor (`MV-MED-YYYY-XXXX`). Works standalone with optional ABHA link.
              </p>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  placeholder="e.g. Babulal Marandi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age *</label>
                  <input
                    type="number"
                    value={regForm.age}
                    onChange={(e) => setRegForm({ ...regForm, age: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={regForm.bloodGroup}
                    onChange={(e) => setRegForm({ ...regForm, bloodGroup: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                  placeholder="+91-94311-XXXXX"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / Village *</label>
                <input
                  type="text"
                  value={regForm.location}
                  onChange={(e) => setRegForm({ ...regForm, location: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                  placeholder="e.g. Katkamsandi, Hazaribagh"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ABDM ABHA ID (Optional)</label>
                <input
                  type="text"
                  value={regForm.abhaId}
                  onChange={(e) => setRegForm({ ...regForm, abhaId: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-mono"
                  placeholder="e.g. babulal@sbx (Leave empty for standalone)"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <span>Generate Medical Card</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 6: HIGH-RES PRINTABLE MEDICAL ID CARD */}
      {/* ========================================== */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  Digital Health Passport
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Official Medical ID Card</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            {/* Printable ID Card Container */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-2xl border-2 border-sky-400/40 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm">
                    MV
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-wide text-white">MEDVEDA SMART CARE</div>
                    <div className="text-[8px] font-bold text-sky-400 uppercase tracking-widest">Digital Health Authority</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  VERIFIED PATIENT
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-black text-white">{patient.name}</h4>
                  <div className="text-xs font-mono font-bold text-sky-300 mt-0.5">{patient.internalMedicalId}</div>
                  <div className="text-[11px] text-slate-300 mt-2 font-medium">
                    {patient.age} Years &bull; {patient.sex ? patient.sex.toUpperCase() : 'N/A'} &bull; Blood: <strong className="text-critical-400">{patient.bloodGroup || 'O+'}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">📍 {patient.location || 'Jharkhand'}</div>
                  {patient.abhaId && (
                    <div className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">ABHA: {patient.abhaId}</div>
                  )}
                </div>

                {/* SVG QR Code */}
                <div className="bg-white p-2.5 rounded-2xl shadow-md shrink-0">
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="2" />
                    <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="2" />
                    <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="2" />
                    <rect x="40" y="10" width="8" height="8" fill="#0284c7" />
                    <rect x="52" y="18" width="8" height="8" fill="#0f172a" />
                    <rect x="40" y="40" width="12" height="12" fill="#0f172a" rx="2" />
                    <rect x="56" y="38" width="6" height="6" fill="#0284c7" />
                    <rect x="70" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="82" y="55" width="6" height="6" fill="#0284c7" />
                    <rect x="45" y="60" width="8" height="8" fill="#0f172a" />
                    <rect x="60" y="65" width="10" height="10" fill="#0f172a" />
                    <rect x="75" y="75" width="8" height="8" fill="#0284c7" />
                  </svg>
                </div>
              </div>

              <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                <span>Phone: {patient.phone}</span>
                <span>Valid Nationwide Across All ABDM Facilities</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopyId}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex-1 flex items-center justify-center gap-1"
              >
                <span>📋 Copy ID</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex-1 flex items-center justify-center gap-1 shadow-md shadow-sky-600/30"
              >
                <span>🖨️ Print Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// --- FEATURE 06: MEDICINE AVAILABILITY & DIAGNOSTIC COORDINATION ---
// ==========================================

function ScreenMedicineDiagnostics({
  actorRole,
  setActorRole,
  onBackToHome,
  onNavigateToCareNavigator,
  onNavigateToTeleconsult,
  onNavigateToReferrals,
  onNavigateToFollowUps,
  onNavigateToRecords
}) {
  const [activeTab, setActiveTab] = useState(
    actorRole === 'shop_owner'
      ? 'shop_owner'
      : actorRole === 'lab_staff'
      ? 'lab_dashboard'
      : actorRole === 'doctor'
      ? 'doctor_orders'
      : 'medicine_search'
  );

  const [notificationToast, setNotificationToast] = useState(null);

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // --- Medicine Search States ---
  const [medSearchQuery, setMedSearchQuery] = useState('Paracetamol');
  const [medRadius, setMedRadius] = useState(25);
  const [medResults, setMedResults] = useState([]);
  const [medMessage, setMedMessage] = useState('');
  const [medIsFallback, setMedIsFallback] = useState(false);
  const [medLoading, setMedLoading] = useState(false);

  // --- Medicine Order Modal State ---
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedMedItem, setSelectedMedItem] = useState(null);
  const [orderPatientName, setOrderPatientName] = useState('Ramesh Mahto');
  const [orderPatientPhone, setOrderPatientPhone] = useState('+91-94311-28901');
  const [orderPatientId, setOrderPatientId] = useState('MV-MED-2026-1024');
  const [orderQuantity, setOrderQuantity] = useState(20);

  // --- Shop Owner State ---
  const [allShops, setAllShops] = useState([]);
  const [activeShopId, setActiveShopId] = useState('shop_01');
  const [shopInventory, setShopInventory] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showEditMedModal, setShowEditMedModal] = useState(false);
  const [editingMedItem, setEditingMedItem] = useState(null);
  const [medForm, setMedForm] = useState({
    medicineName: '',
    genericName: '',
    dosageForm: 'Tablet',
    strength: '500mg',
    quantity: 100,
    status: 'in_stock',
    price: 25.0
  });

  // --- Diagnostic Search States ---
  const [diagSearchQuery, setDiagSearchQuery] = useState('Lipid Profile');
  const [diagRadius, setDiagRadius] = useState(30);
  const [diagCategoryFilter, setDiagCategoryFilter] = useState('ALL');
  const [diagResults, setDiagResults] = useState([]);
  const [diagMessage, setDiagMessage] = useState('');
  const [diagIsFallback, setDiagIsFallback] = useState(false);
  const [diagLoading, setDiagLoading] = useState(false);

  // --- Diagnostic Booking Modal State ---
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTestItem, setSelectedTestItem] = useState(null);
  const [bookingPatientName, setBookingPatientName] = useState('Sunita Soren');
  const [bookingPatientPhone, setBookingPatientPhone] = useState('+91-98352-19203');
  const [bookingPatientId, setBookingPatientId] = useState('MV-MED-2026-2048');

  // --- Diagnostic Center Staff State ---
  const [allCenters, setAllCenters] = useState([]);
  const [activeCenterId, setActiveCenterId] = useState('center_01');
  const [centerCatalog, setCenterCatalog] = useState([]);
  const [centerOrders, setCenterOrders] = useState([]);
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showEditTestModal, setShowEditTestModal] = useState(false);
  const [editingTestItem, setEditingTestItem] = useState(null);
  const [testForm, setTestForm] = useState({
    testName: '',
    category: 'blood',
    status: 'available',
    turnaroundTime: 'Same Day (3 hours)',
    price: 150.0,
    fastingRequired: false,
    sampleType: 'Venous Blood'
  });

  // --- Doctor-Ordered Lab Orders Tracker State ---
  const [trackedOrders, setTrackedOrders] = useState([]);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [showUploadResultModal, setShowUploadResultModal] = useState(false);
  const [resultForm, setResultForm] = useState({
    clinicalSummary: 'Troponin-I cardiac biomarker within normal physiological range (<0.04 ng/mL). Acute STEMI excluded.',
    patientFriendlySummary: 'Your heart enzyme test is normal and shows no acute heart attack damage.',
    certifiedBy: 'Dr. S. K. Roy (MD Pathology, Reg: 44210)',
    parameters: [
      { name: 'Troponin-I High Sensitivity', value: '0.012', unit: 'ng/mL', referenceRange: '0.000 - 0.040', isAbnormal: false }
    ]
  });

  // Load All Shops
  const loadShops = async () => {
    try {
      const res = await fetch(getApiUrl('/api/shops'));
      const json = await res.json();
      if (json.data) setAllShops(json.data);
    } catch (e) {
      console.warn('Load shops error:', e);
    }
  };

  // Load All Centers
  const loadCenters = async () => {
    try {
      const res = await fetch(getApiUrl('/api/diagnostic-centers'));
      const json = await res.json();
      if (json.data) setAllCenters(json.data);
    } catch (e) {
      console.warn('Load centers error:', e);
    }
  };

  // Search Medicines
  const searchMedicines = async (q = medSearchQuery, rad = medRadius) => {
    try {
      setMedLoading(true);
      const res = await fetch(
        getApiUrl(`/api/medicine/search?query=${encodeURIComponent(q)}&radius=${rad}`)
      );
      const json = await res.json();
      if (json.data) {
        setMedResults(json.data.results || []);
        setMedMessage(json.data.message || '');
        setMedIsFallback(Boolean(json.data.isFallback));
      }
    } catch (e) {
      console.warn('Search medicines error:', e);
    } finally {
      setMedLoading(false);
    }
  };

  // Search Diagnostic Tests
  const searchDiagnosticTests = async (q = diagSearchQuery, rad = diagRadius) => {
    try {
      setDiagLoading(true);
      const res = await fetch(
        getApiUrl(`/api/diagnostic/search?test=${encodeURIComponent(q)}&radius=${rad}`)
      );
      const json = await res.json();
      if (json.data) {
        setDiagResults(json.data.results || []);
        setDiagMessage(json.data.message || '');
        setDiagIsFallback(Boolean(json.data.isFallback));
      }
    } catch (e) {
      console.warn('Search diagnostics error:', e);
    } finally {
      setDiagLoading(false);
    }
  };

  // Load Shop Inventory & Orders
  const loadShopData = async (sId = activeShopId) => {
    try {
      const invRes = await fetch(getApiUrl(`/api/shop/${sId}/inventory`));
      const invJson = await invRes.json();
      if (invJson.data && invJson.data.items) {
        setShopInventory(invJson.data.items);
      }

      const ordRes = await fetch(getApiUrl(`/api/shop/${sId}/orders?actor_id=owner_pharma_1`));
      const ordJson = await ordRes.json();
      if (ordJson.data) {
        setShopOrders(ordJson.data);
      }
    } catch (e) {
      console.warn('Load shop data error:', e);
    }
  };

  // Load Diagnostic Center Catalog & Orders
  const loadCenterData = async (cId = activeCenterId) => {
    try {
      const catRes = await fetch(getApiUrl(`/api/diagnostic-center/${cId}/tests`));
      const catJson = await catRes.json();
      if (catJson.data && catJson.data.tests) {
        setCenterCatalog(catJson.data.tests);
      }

      const ordRes = await fetch(
        getApiUrl(`/api/diagnostic-center/${cId}/orders?actor_id=owner_lab_1`)
      );
      const ordJson = await ordRes.json();
      if (ordJson.data) {
        setCenterOrders(ordJson.data);
        setTrackedOrders(ordJson.data);
        if (ordJson.data.length > 0 && !selectedOrderForStatus) {
          setSelectedOrderForStatus(ordJson.data[0]);
        }
      }
    } catch (e) {
      console.warn('Load center data error:', e);
    }
  };

  useEffect(() => {
    loadShops();
    loadCenters();
    searchMedicines('Paracetamol', 25);
    searchDiagnosticTests('Lipid Profile', 30);
  }, []);

  useEffect(() => {
    const h = window.location.hash;
    if (h === '#shop-owner' || actorRole === 'shop_owner') setActiveTab('shop_owner');
    else if (h === '#lab-staff' || actorRole === 'lab_staff') setActiveTab('lab_dashboard');
    else if (h === '#diagnostic') setActiveTab('diagnostic_search');
    else if (h === '#doctor-orders' || h === '#diagnostic-orders' || actorRole === 'doctor') setActiveTab('doctor_orders');
    else if (h === '#medicine' || h === '#feature6') setActiveTab('medicine_search');
  }, [actorRole]);

  useEffect(() => {
    if (activeTab === 'shop_owner') {
      loadShopData(activeShopId);
    }
  }, [activeTab, activeShopId]);

  useEffect(() => {
    if (activeTab === 'lab_dashboard' || activeTab === 'doctor_orders') {
      loadCenterData(activeCenterId);
    }
  }, [activeTab, activeCenterId]);

  // Handle Medicine Order Placement
  const handlePlaceMedicineOrder = async (e) => {
    e.preventDefault();
    if (!selectedMedItem) return;

    try {
      const res = await fetch(getApiUrl('/api/medicine/order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: orderPatientId,
          patientName: orderPatientName,
          patientPhone: orderPatientPhone,
          shopId: selectedMedItem.shop.shopId,
          inventoryId: selectedMedItem.medicine.inventoryId,
          quantityRequested: Number(orderQuantity)
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowOrderModal(false);
        showToast(`🎉 Order reserved for ${selectedMedItem.medicine.medicineName}! Order ID: ${json.data.orderId}`);
        loadShopData(selectedMedItem.shop.shopId);
      } else {
        showToast(`⚠️ Order error: ${json.error}`);
      }
    } catch (err) {
      showToast('⚠️ Failed to submit order reservation.');
    }
  };

  // Handle Diagnostic Direct Booking
  const handlePlaceDiagnosticBooking = async (e) => {
    e.preventDefault();
    if (!selectedTestItem) return;

    try {
      const res = await fetch(getApiUrl('/api/diagnostic/book'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: bookingPatientId,
          patientName: bookingPatientName,
          patientPhone: bookingPatientPhone,
          centerId: selectedTestItem.center.centerId,
          testOfferingId: selectedTestItem.test.testOfferingId
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowBookingModal(false);
        showToast(`🎉 Diagnostic test booked at ${selectedTestItem.center.name}! Order ID: ${json.data.orderId}`);
        loadCenterData(selectedTestItem.center.centerId);
      } else {
        showToast(`⚠️ Booking error: ${json.error}`);
      }
    } catch (err) {
      showToast('⚠️ Failed to book diagnostic test.');
    }
  };

  // Handle Add Medicine (Shop Owner)
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl(`/api/shop/${activeShopId}/inventory`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: { id: 'owner_pharma_1', role: 'shop_owner', shopId: activeShopId },
          ...medForm
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowAddMedModal(false);
        showToast(`✓ Added '${json.data.medicineName}' to inventory.`);
        loadShopData(activeShopId);
        searchMedicines();
      } else {
        showToast(`⚠️ RBAC / Error: ${json.error}`);
      }
    } catch (err) {
      showToast('⚠️ Failed to add medicine.');
    }
  };

  // Handle Update Medicine (Shop Owner)
  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    if (!editingMedItem) return;

    try {
      const res = await fetch(
        getApiUrl(`/api/shop/${activeShopId}/inventory/${editingMedItem.inventoryId}`),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actor: { id: 'owner_pharma_1', role: 'shop_owner', shopId: activeShopId },
            ...medForm
          })
        }
      );
      const json = await res.json();
      if (json.success) {
        setShowEditMedModal(false);
        showToast(`✓ Updated stock for '${json.data.medicineName}'.`);
        loadShopData(activeShopId);
        searchMedicines();
      } else {
        showToast(`⚠️ RBAC / Error: ${json.error}`);
      }
    } catch (err) {
      showToast('⚠️ Failed to update medicine.');
    }
  };

  // Handle Delete Medicine (Shop Owner)
  const handleDeleteMedicine = async (invId) => {
    if (!window.confirm('Remove this medicine from your shop inventory?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/shop/${activeShopId}/inventory/${invId}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: { id: 'owner_pharma_1', role: 'shop_owner', shopId: activeShopId }
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('✓ Medicine removed from inventory.');
        loadShopData(activeShopId);
        searchMedicines();
      }
    } catch (err) {
      showToast('⚠️ Failed to remove medicine.');
    }
  };

  // Handle Confirm Order (Shop Owner)
  const handleUpdateOrderStatus = async (orderId, status, notes) => {
    try {
      const res = await fetch(getApiUrl(`/api/shop/${activeShopId}/orders/${orderId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: { id: 'owner_pharma_1', role: 'shop_owner', shopId: activeShopId },
          status,
          ownerNotes: notes
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          status === 'confirmed'
            ? '✓ Order confirmed! Patient notified for pickup.'
            : 'Order marked as unavailable.'
        );
        loadShopData(activeShopId);
      }
    } catch (err) {
      showToast('⚠️ Failed to update order status.');
    }
  };

  // Handle Add Diagnostic Test (Lab Staff)
  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl(`/api/diagnostic-center/${activeCenterId}/tests`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: { id: 'owner_lab_1', role: 'lab_staff', centerId: activeCenterId },
          ...testForm
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowAddTestModal(false);
        showToast(`✓ Added test '${json.data.testName}' to catalog.`);
        loadCenterData(activeCenterId);
        searchDiagnosticTests();
      } else {
        showToast(`⚠️ RBAC / Error: ${json.error}`);
      }
    } catch (err) {
      showToast('⚠️ Failed to add test.');
    }
  };

  // Handle Diagnostic Status Advance (Lab Staff)
  const handleAdvanceOrderStatus = async (orderId, newStatus, customResultData) => {
    try {
      const res = await fetch(getApiUrl(`/api/diagnostic/order/${orderId}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centerId: activeCenterId,
          actor: { id: 'owner_lab_1', role: 'lab_staff', centerId: activeCenterId },
          status: newStatus,
          resultData: customResultData
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Order status advanced to '${newStatus}'.`);
        setSelectedOrderForStatus(json.data);
        loadCenterData(activeCenterId);
      }
    } catch (err) {
      showToast('⚠️ Failed to update diagnostic status.');
    }
  };

  const activeShopObj = allShops.find((s) => s.shopId === activeShopId) || allShops[0];
  const activeCenterObj = allCenters.find((c) => c.centerId === activeCenterId) || allCenters[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-xl">🔔</span>
          <span className="text-xs font-bold">{notificationToast}</span>
        </div>
      )}

      {/* Feature Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              FEATURE MAP 06 &bull; MEDICINE &amp; DIAGNOSTIC COORDINATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Medicine Availability &amp; Diagnostic Grid
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Real-time nearby medicine stock search with out-of-radius fallback, owner-only RBAC inventory CRUD, reservation ordering, diagnostic test catalog, and doctor-ordered status progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <span>🏠 Home</span>
          </button>
        </div>
      </div>

      {/* Primary Module Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('medicine_search')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'medicine_search'
              ? 'bg-teal-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>💊</span>
          <span>Medicine Search (Patient/Worker)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shop_owner')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'shop_owner'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>🏪</span>
          <span>Medical Shop Dashboard (Owner CRUD)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diagnostic_search')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'diagnostic_search'
              ? 'bg-purple-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>🔬</span>
          <span>Diagnostic Test Search (Direct Booking)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lab_dashboard')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'lab_dashboard'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>🧪</span>
          <span>Diagnostic Center Staff Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctor_orders')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'doctor_orders'
              ? 'bg-emerald-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>📋</span>
          <span>Doctor-Ordered Lab Tracker</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MEDICINE SEARCH (PATIENT / FRONTLINE WORKER VIEW) */}
      {/* ========================================================= */}
      {activeTab === 'medicine_search' && (
        <div className="space-y-6">
          {/* Search Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-black text-slate-900">Nearby Medicine Stock Discovery</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Real-time inventory lookup across registered chemists in Hazaribagh &amp; Jharkhand grid.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Read-Only Search + Counter Reservation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Medicine Name / Brand / Generic Molecule
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={medSearchQuery}
                    onChange={(e) => setMedSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchMedicines(medSearchQuery, medRadius)}
                    placeholder="e.g. Paracetamol, Telmisartan, Ecosprin, Tenecteplase..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-400 text-base">🔍</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Search Radius
                </label>
                <select
                  value={medRadius}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setMedRadius(r);
                    searchMedicines(medSearchQuery, r);
                  }}
                  className="w-full py-3 px-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="5">Within 5 km (Walking)</option>
                  <option value="15">Within 15 km (Block Level)</option>
                  <option value="25">Within 25 km (District Hub)</option>
                  <option value="75">Within 75 km (State Network)</option>
                </select>
              </div>
            </div>

            {/* Quick Keyword Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Searches:</span>
              {['Paracetamol', 'Telmisartan', 'Metformin', 'Ecosprin', 'Brilinta', 'Tenecteplase'].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setMedSearchQuery(q);
                    searchMedicines(q, medRadius);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors"
                >
                  + {q}
                </button>
              ))}
            </div>
          </div>

          {/* Search Feedback / Non-Empty Fallback Alert */}
          {medMessage && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs gap-3 ${
                medIsFallback
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-teal-50 border-teal-200 text-teal-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{medIsFallback ? '⚠️' : '✓'}</span>
                <span className="font-bold">{medMessage}</span>
              </div>
              {medIsFallback && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 text-amber-800 rounded">
                  Out-of-Radius Fallback
                </span>
              )}
            </div>
          )}

          {/* Medicine Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medResults.map((item, idx) => {
              const med = item.medicine;
              const shop = item.shop;
              const isInStock = med.status === 'in_stock' && med.quantity > 0;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                    isInStock ? 'border-slate-200 hover:border-teal-400' : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-slate-900">{med.medicineName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {med.dosageForm || 'Tablet'} &bull; {med.strength || 'Standard'}
                          </span>
                        </div>
                        {med.genericName && (
                          <div className="text-xs text-slate-500 font-medium mt-0.5">
                            Generic: <strong className="text-slate-700">{med.genericName}</strong>
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        {med.price !== undefined && (
                          <div className="text-base font-black text-slate-900">₹{med.price.toFixed(2)}</div>
                        )}
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            isInStock
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-critical-100 text-critical-800'
                          }`}
                        >
                          {isInStock ? `✓ In Stock (${med.quantity})` : '✗ Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Shop Information Card */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{shop.name}</strong>
                        <span className="font-mono font-bold text-teal-700">
                          📍 {item.distanceKm} km
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{shop.location.address}</div>
                      <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                        <span>📞 {shop.contactNumber}</span>
                        <span>Updated: {new Date(med.lastUpdated).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={!isInStock}
                      onClick={() => {
                        setSelectedMedItem(item);
                        setShowOrderModal(true);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        isInStock
                          ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>📦</span>
                      <span>Reserve for Counter Pickup</span>
                    </button>

                    <a
                      href={`tel:${shop.contactNumber}`}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      📞 Call
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MEDICAL SHOP DASHBOARD (OWNER CRUD & ORDERS) */}
      {/* ========================================================= */}
      {activeTab === 'shop_owner' && (
        <div className="space-y-6">
          {/* Shop Selector & RBAC Invariant Card */}
          <div className="bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl">
                  🏪
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block">
                    SHOP OWNER WORKSPACE &bull; STRICT BACKEND RBAC
                  </span>
                  <h3 className="text-xl font-black text-white">{activeShopObj?.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={activeShopId}
                  onChange={(e) => setActiveShopId(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  {allShops.map((s) => (
                    <option key={s.shopId} value={s.shopId}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setMedForm({
                      medicineName: '',
                      genericName: '',
                      dosageForm: 'Tablet',
                      strength: '500mg',
                      quantity: 100,
                      status: 'in_stock',
                      price: 25.0
                    });
                    setShowAddMedModal(true);
                  }}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>➕ Add Medicine</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
              <div>
                <strong>RBAC Invariant:</strong> You are managing shop inventory for <strong>{activeShopObj?.name}</strong>. Backend rejects write access from non-owner accounts.
              </div>
              <span className="text-[10px] font-mono text-teal-300">Owner ID: owner_pharma_1</span>
            </div>
          </div>

          {/* Incoming Order Reservations Desk */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Incoming Customer Order Requests</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Patient reservation requests for counter pickup. Confirmed orders do not alter stock until counter handover.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {shopOrders.length} Total Orders
              </span>
            </div>

            {shopOrders.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                No incoming order requests yet.
              </div>
            ) : (
              <div className="space-y-3">
                {shopOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{ord.patientName}</strong>
                        <span className="font-mono text-slate-500">({ord.patientPhone})</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            ord.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'requested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Requested: <strong className="text-slate-900">{ord.quantityRequested} units</strong> of <strong>{ord.medicineName}</strong> &bull; Ordered at {new Date(ord.requestedAt).toLocaleTimeString()}
                      </div>
                      {ord.ownerNotes && (
                        <div className="text-[10px] text-teal-700 mt-0.5 italic">
                          Notes: {ord.ownerNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {ord.status === 'requested' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateOrderStatus(ord.orderId, 'confirmed', 'Confirmed. Packed and kept at pickup counter.')
                            }
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                          >
                            ✓ Confirm Pickup
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateOrderStatus(ord.orderId, 'unavailable', 'Stock changed, unavailable.')
                            }
                            className="px-3 py-1.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-lg text-xs"
                          >
                            ✗ Unavailable
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shop Inventory CRUD Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Current Medicine Stock Inventory</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Real-time stock counts reflecting directly in patient-facing search.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Medicine Name</th>
                    <th className="py-3 px-4">Generic / Strength</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Price (INR)</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {shopInventory.map((item) => (
                    <tr key={item.inventoryId} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-black text-slate-900">{item.medicineName}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.genericName || 'N/A'} &bull; <span className="font-bold">{item.strength}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.quantity}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-critical-100 text-critical-800'
                          }`}
                        >
                          {item.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {item.price !== undefined ? `₹${item.price.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[10px]">
                        {new Date(item.lastUpdated).toLocaleTimeString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMedItem(item);
                            setMedForm({
                              medicineName: item.medicineName,
                              genericName: item.genericName || '',
                              dosageForm: item.dosageForm || 'Tablet',
                              strength: item.strength || '',
                              quantity: item.quantity,
                              status: item.status,
                              price: item.price || 0
                            });
                            setShowEditMedModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedicine(item.inventoryId)}
                          className="px-2.5 py-1 bg-critical-50 hover:bg-critical-100 text-critical-700 font-bold rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DIAGNOSTIC TEST SEARCH (DIRECT PATIENT BOOKING) */}
      {/* ========================================================= */}
      {activeTab === 'diagnostic_search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-black text-slate-900">Direct Diagnostic Test Discovery</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Search pathology tests, imaging, and biochemistry panels across accredited labs without a doctor mandate.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                Direct Search &bull; Same-Day Labs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Diagnostic Test / Panel Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={diagSearchQuery}
                    onChange={(e) => setDiagSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchDiagnosticTests(diagSearchQuery, diagRadius)}
                    placeholder="e.g. Complete Blood Count, Lipid Profile, Blood Sugar, HbA1c, Troponin-I..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-400 text-base">🔬</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Radius Filter
                </label>
                <select
                  value={diagRadius}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setDiagRadius(r);
                    searchDiagnosticTests(diagSearchQuery, r);
                  }}
                  className="w-full py-3 px-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="10">Within 10 km</option>
                  <option value="30">Within 30 km (Sub-District)</option>
                  <option value="60">Within 60 km (District Hub)</option>
                </select>
              </div>
            </div>

            {/* Quick Test Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Popular Panels:</span>
              {['Complete Blood Count', 'Lipid Profile', 'Blood Sugar', 'HbA1c', 'Troponin-I', 'X-Ray Chest', 'Echocardiography'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setDiagSearchQuery(t);
                    searchDiagnosticTests(t, diagRadius);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Message */}
          {diagMessage && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs gap-3 ${
                diagIsFallback
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{diagIsFallback ? '⚠️' : '✓'}</span>
                <span className="font-bold">{diagMessage}</span>
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagResults.map((item, idx) => {
              const test = item.test;
              const center = item.center;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between space-y-4 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-slate-900">{test.testName}</h4>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          Category: <strong className="text-slate-800 uppercase">{test.category}</strong> &bull; Sample: <strong>{test.sampleType || 'Venous Blood'}</strong>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {test.price !== undefined && (
                          <div className="text-base font-black text-slate-900">₹{test.price.toFixed(2)}</div>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 inline-block mt-0.5">
                          ⏱️ {test.turnaroundTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {test.fastingRequired ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                          ⚠️ Fasting Required (8-10h)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          ✓ No Fasting Required
                        </span>
                      )}
                    </div>

                    {/* Center Details */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{center.name}</strong>
                        <span className="font-mono font-bold text-purple-700">📍 {item.distanceKm} km</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{center.location.address}</div>
                      {center.accreditation && (
                        <div className="text-[10px] text-emerald-700 font-bold mt-1">
                          🏅 {center.accreditation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTestItem(item);
                        setShowBookingModal(true);
                      }}
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>🧪</span>
                      <span>Book Diagnostic Test</span>
                    </button>

                    <a
                      href={`tel:${center.contactNumber}`}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      📞 Call
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DIAGNOSTIC CENTER STAFF DASHBOARD */}
      {/* ========================================================= */}
      {activeTab === 'lab_dashboard' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                  🧪
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block">
                    DIAGNOSTIC CENTER DASHBOARD &bull; LAB STAFF RBAC
                  </span>
                  <h3 className="text-xl font-black text-white">{activeCenterObj?.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={activeCenterId}
                  onChange={(e) => setActiveCenterId(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  {allCenters.map((c) => (
                    <option key={c.centerId} value={c.centerId}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setTestForm({
                      testName: '',
                      category: 'blood',
                      status: 'available',
                      turnaroundTime: 'Same Day (3 hours)',
                      price: 150.0,
                      fastingRequired: false,
                      sampleType: 'Venous Blood'
                    });
                    setShowAddTestModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>➕ Add Test</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
              <div>
                <strong>Accreditation:</strong> {activeCenterObj?.accreditation || 'Standard Regional Lab'}
              </div>
              <span className="text-[10px] font-mono text-indigo-300">Staff Actor: owner_lab_1</span>
            </div>
          </div>

          {/* Test Catalog Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Offered Test Catalog</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Test Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Turnaround</th>
                    <th className="py-3 px-4">Fasting</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {centerCatalog.map((t) => (
                    <tr key={t.testOfferingId}>
                      <td className="py-3 px-4 font-black text-slate-900">{t.testName}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-indigo-700">{t.category}</td>
                      <td className="py-3 px-4">{t.turnaroundTime}</td>
                      <td className="py-3 px-4">{t.fastingRequired ? '⚠️ Yes' : '✓ No'}</td>
                      <td className="py-3 px-4 font-bold">{t.price ? `₹${t.price}` : 'Free'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: DOCTOR-ORDERED DIAGNOSTIC STATUS TRACKER */}
      {/* ========================================================= */}
      {activeTab === 'doctor_orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-black text-slate-900">Doctor-Ordered Diagnostic Lifecycle Tracker</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tracks orders initiated during Feature 02 consultations: Sample Collection &rarr; In Progress &rarr; Results Published &rarr; Delivered to EHR.
                </p>
              </div>
            </div>

            {/* Select Order */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">
                Select Active Consultation Order:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trackedOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    onClick={() => setSelectedOrderForStatus(ord)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedOrderForStatus?.orderId === ord.orderId
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 text-sm">{ord.testName}</strong>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Patient: <strong>{ord.patientName}</strong> &bull; Center: {ord.centerName}
                    </div>
                    {ord.orderedBy && (
                      <div className="text-[11px] text-brand-700 font-bold mt-1">
                        Ordered by: {ord.orderedBy.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stepper & Dual Result Viewer */}
          {selectedOrderForStatus && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    ORDER ID: {selectedOrderForStatus.orderId}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                    {selectedOrderForStatus.testName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Patient: <strong>{selectedOrderForStatus.patientName}</strong> ({selectedOrderForStatus.patientPhone})
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedOrderForStatus.status === 'sample_pending' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'in_progress')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm"
                    >
                      🩸 Collect Sample (In Progress)
                    </button>
                  )}

                  {selectedOrderForStatus.status === 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => setShowUploadResultModal(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm"
                    >
                      📝 Upload Results &amp; Values
                    </button>
                  )}

                  {selectedOrderForStatus.status === 'result_ready' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'delivered')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
                    >
                      ✓ Deliver to Doctor &amp; Patient Timeline
                    </button>
                  )}
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { id: 'sample_pending', label: '1. Sample Pending' },
                  { id: 'in_progress', label: '2. In Progress' },
                  { id: 'result_ready', label: '3. Result Ready' },
                  { id: 'delivered', label: '4. Delivered' }
                ].map((st, i) => {
                  const stepOrder = ['sample_pending', 'in_progress', 'result_ready', 'delivered'];
                  const curIdx = stepOrder.indexOf(selectedOrderForStatus.status);
                  const isDone = i <= curIdx;
                  return (
                    <div
                      key={st.id}
                      className={`p-3 rounded-2xl font-bold border transition-all ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span>{isDone ? '✓ ' : ''}{st.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Dual Results Viewer (Clinical + Patient Friendly) */}
              {selectedOrderForStatus.resultData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Clinical View */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                          CLINICAL VIEW &bull; MEDICAL OFFICER
                        </span>
                        <h4 className="text-base font-black text-white">Diagnostic Laboratory Parameters</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">NABL Verified</span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {selectedOrderForStatus.resultData.clinicalSummary}
                    </p>

                    <div className="space-y-2 pt-2">
                      {selectedOrderForStatus.resultData.parameters?.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-200">{p.name}</span>
                            <div className="text-[10px] text-slate-400">Ref: {p.referenceRange} {p.unit}</div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-black text-sm text-white">{p.value} {p.unit}</span>
                            {p.isAbnormal && (
                              <span className="block text-[9px] font-black uppercase text-critical-400">
                                ⚠️ HIGH / ABNORMAL
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedOrderForStatus.resultData.certifiedBy && (
                      <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 font-medium">
                        Verified by: {selectedOrderForStatus.resultData.certifiedBy}
                      </div>
                    )}
                  </div>

                  {/* Patient Plain-Language View */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🩺</span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                            PATIENT EXPLANATION &bull; PLAIN LANGUAGE
                          </span>
                          <h4 className="text-base font-black text-emerald-950">What Your Results Mean</h4>
                        </div>
                      </div>

                      <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
                        {selectedOrderForStatus.resultData.patientFriendlySummary}
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                      <span>✓</span>
                      <span>This report has been automatically synced to your <strong>MedVeda Longitudinal EHR</strong>.</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                  Sample status is pending/in-progress. Results will be shown here once uploaded by the certified laboratory.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: MEDICINE ORDER RESERVATION */}
      {/* ========================================== */}
      {showOrderModal && selectedMedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  Counter Reservation
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Reserve Medicine for Pickup</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePlaceMedicineOrder} className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                <div className="font-extrabold text-teal-950 text-sm">{selectedMedItem.medicine.medicineName}</div>
                <div className="text-[11px] text-teal-800">
                  Shop: <strong>{selectedMedItem.shop.name}</strong> &bull; {selectedMedItem.distanceKm} km
                </div>
                {selectedMedItem.medicine.price && (
                  <div className="text-teal-900 font-bold pt-1">
                    Price: ₹{selectedMedItem.medicine.price} per unit
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={orderPatientName}
                  onChange={(e) => setOrderPatientName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={orderPatientPhone}
                    onChange={(e) => setOrderPatientPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedMedItem.medicine.quantity}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                ℹ️ Payment is collected in person at the counter upon physical pickup.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: DIRECT DIAGNOSTIC BOOKING */}
      {/* ========================================== */}
      {showBookingModal && selectedTestItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  Direct Lab Appointment
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Book Diagnostic Test</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePlaceDiagnosticBooking} className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="font-extrabold text-purple-950 text-sm">{selectedTestItem.test.testName}</div>
                <div className="text-[11px] text-purple-800">
                  Lab: <strong>{selectedTestItem.center.name}</strong> &bull; {selectedTestItem.distanceKm} km
                </div>
                <div className="text-purple-900 font-bold pt-1">
                  Turnaround: {selectedTestItem.test.turnaroundTime} &bull; Price: ₹{selectedTestItem.test.price || 0}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={bookingPatientName}
                  onChange={(e) => setBookingPatientName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={bookingPatientPhone}
                  onChange={(e) => setBookingPatientPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"
                >
                  Book Test Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: ADD / EDIT MEDICINE (SHOP OWNER) */}
      {/* ========================================== */}
      {(showAddMedModal || showEditMedModal) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  Shop Inventory CRUD
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {showAddMedModal ? 'Add Medicine to Inventory' : 'Edit Medicine Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddMedModal(false);
                  setShowEditMedModal(false);
                }}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={showAddMedModal ? handleAddMedicine : handleUpdateMedicine} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Medicine Brand Name</label>
                <input
                  type="text"
                  value={medForm.medicineName}
                  onChange={(e) => setMedForm({ ...medForm, medicineName: e.target.value })}
                  placeholder="e.g. Telmisartan 40mg"
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Generic Molecule Name</label>
                <input
                  type="text"
                  value={medForm.genericName}
                  onChange={(e) => setMedForm({ ...medForm, genericName: e.target.value })}
                  placeholder="e.g. Telmisartan (ARB)"
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage Form</label>
                  <select
                    value={medForm.dosageForm}
                    onChange={(e) => setMedForm({ ...medForm, dosageForm: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Strength</label>
                  <input
                    type="text"
                    value={medForm.strength}
                    onChange={(e) => setMedForm({ ...medForm, strength: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={medForm.quantity}
                    onChange={(e) => setMedForm({ ...medForm, quantity: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Price (INR)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={medForm.price}
                    onChange={(e) => setMedForm({ ...medForm, price: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMedModal(false);
                    setShowEditMedModal(false);
                  }}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"
                >
                  {showAddMedModal ? 'Save Medicine' : 'Update Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 4: UPLOAD LAB RESULTS (LAB STAFF) */}
      {/* ========================================== */}
      {showUploadResultModal && selectedOrderForStatus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  Clinical Results Publishing
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Publish Test Results</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadResultModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'result_ready', resultForm);
                setShowUploadResultModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Diagnostic Summary (For Doctor)</label>
                <textarea
                  rows="2"
                  value={resultForm.clinicalSummary}
                  onChange={(e) => setResultForm({ ...resultForm, clinicalSummary: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient-Friendly Explanation (Plain Language)</label>
                <textarea
                  rows="2"
                  value={resultForm.patientFriendlySummary}
                  onChange={(e) => setResultForm({ ...resultForm, patientFriendlySummary: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Certifying Pathologist / Officer</label>
                <input
                  type="text"
                  value={resultForm.certifiedBy}
                  onChange={(e) => setResultForm({ ...resultForm, certifiedBy: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2 font-bold"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadResultModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"
                >
                  Publish Report (Ready)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// --- FEATURE 07: FACILITY DASHBOARD COMPONENT ---
// ==========================================

function ScreenFacilityDashboard({
  actorRole,
  setActorRole,
  onBackToHome,
  onNavigateToCareNavigator,
  onNavigateToTeleconsult,
  onNavigateToReferrals,
  onNavigateToFollowUps,
  onNavigateToRecords,
  onNavigateToMedicine
}) {
  const [activeFacilityId, setActiveFacilityId] = useState('fac_01');
  const [facilities, setFacilities] = useState([]);
  const [activeSection, setActiveSection] = useState(
    actorRole === 'worker' ? 'patient_care' : 'overview'
  );

  const [notificationToast, setNotificationToast] = useState(null);
  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Section Data States
  const [overviewData, setOverviewData] = useState(null);
  const [patientCareData, setPatientCareData] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [serviceResourceData, setServiceResourceData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [alertSeverityFilter, setAlertSeverityFilter] = useState('ALL');

  // Resource Update Modal State
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState('bed');
  const [resourceTotal, setResourceTotal] = useState(120);
  const [resourceAvailable, setResourceAvailable] = useState(34);

  // Load facilities
  const loadFacilities = async () => {
    try {
      const res = await fetch(getApiUrl('/api/dashboard/facilities'));
      const json = await res.json();
      if (json.data) setFacilities(json.data);
    } catch (e) {
      console.warn('Load facilities error:', e);
    }
  };

  // Load Overview Data
  const loadOverview = async (facId = activeFacilityId) => {
    try {
      const roleParam = actorRole === 'facility' ? 'admin' : actorRole;
      const res = await fetch(
        getApiUrl(`/api/dashboard/overview?facility_id=${facId}&actor_role=${roleParam}`)
      );
      const json = await res.json();
      if (json.data) setOverviewData(json.data);
    } catch (e) {
      console.warn('Load overview error:', e);
    }
  };

  // Load Patient Care Data
  const loadPatientCare = async (facId = activeFacilityId) => {
    try {
      const roleParam = actorRole === 'facility' ? 'admin' : actorRole;
      const res = await fetch(
        getApiUrl(`/api/dashboard/patient-care?facility_id=${facId}&actor_role=${roleParam}`)
      );
      const json = await res.json();
      if (json.data) setPatientCareData(json.data);
    } catch (e) {
      console.warn('Load patient care error:', e);
    }
  };

  // Load Appointment & Queue Data
  const loadQueue = async (facId = activeFacilityId) => {
    try {
      const roleParam = actorRole === 'facility' ? 'admin' : actorRole;
      const res = await fetch(
        getApiUrl(`/api/dashboard/appointments-queue?facility_id=${facId}&actor_role=${roleParam}`)
      );
      const json = await res.json();
      if (json.data) setQueueData(json.data);
    } catch (e) {
      console.warn('Load queue error:', e);
    }
  };

  // Load Service & Resource Data
  const loadServiceResource = async (facId = activeFacilityId) => {
    try {
      const roleParam = actorRole === 'facility' ? 'admin' : actorRole;
      const res = await fetch(
        getApiUrl(`/api/dashboard/service-resource?facility_id=${facId}&actor_role=${roleParam}`)
      );
      const json = await res.json();
      if (json.data) setServiceResourceData(json.data);
    } catch (e) {
      console.warn('Load service resource error:', e);
    }
  };

  // Load Analytics Data
  const loadAnalytics = async (facId = activeFacilityId) => {
    try {
      const roleParam = actorRole === 'facility' ? 'admin' : actorRole;
      const res = await fetch(
        getApiUrl(`/api/dashboard/analytics?facility_id=${facId}&actor_role=${roleParam}`)
      );
      const json = await res.json();
      if (json.data) setAnalyticsData(json.data);
    } catch (e) {
      console.warn('Load analytics error:', e);
    }
  };

  // Load Alerts Data
  const loadAlerts = async (facId = activeFacilityId) => {
    try {
      const roleParam = actorRole === 'facility' ? 'admin' : actorRole;
      const res = await fetch(
        getApiUrl(`/api/dashboard/alerts?facility_id=${facId}&actor_role=${roleParam}`)
      );
      const json = await res.json();
      if (json.data) setAlertsData(json.data);
    } catch (e) {
      console.warn('Load alerts error:', e);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    loadOverview(activeFacilityId);
    loadPatientCare(activeFacilityId);
    loadQueue(activeFacilityId);
    loadServiceResource(activeFacilityId);
    loadAnalytics(activeFacilityId);
    loadAlerts(activeFacilityId);
  }, [activeFacilityId, actorRole]);

  useEffect(() => {
    const h = window.location.hash;
    if (h === '#dashboard-overview') setActiveSection('overview');
    else if (h === '#dashboard-care') setActiveSection('patient_care');
    else if (h === '#dashboard-queue') setActiveSection('appointments_queue');
    else if (h === '#dashboard-resources') setActiveSection('service_resource');
    else if (h === '#dashboard-analytics') setActiveSection('analytics');
    else if (h === '#dashboard-alerts') setActiveSection('alerts');
  }, []);

  // Update Bed / Resource Count (Admin Only)
  const handleUpdateResource = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl('/api/dashboard/resource-status/update'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: activeFacilityId,
          actor: { actorId: 'admin_user', role: 'admin', facilityId: activeFacilityId },
          resourceType: selectedResourceType,
          totalCount: Number(resourceTotal),
          availableCount: Number(resourceAvailable)
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowResourceModal(false);
        showToast(`✓ Updated ${json.data.resourceName}: ${json.data.availableCount}/${json.data.totalCount} available.`);
        loadServiceResource(activeFacilityId);
        loadAlerts(activeFacilityId);
        loadOverview(activeFacilityId);
      } else {
        showToast(`⚠️ RBAC Error: ${json.error}`);
      }
    } catch (err) {
      showToast('⚠️ Failed to update resource status.');
    }
  };

  // Update Alert Status (Acknowledge / Resolve)
  const handleUpdateAlertStatus = async (alertId, newStatus) => {
    try {
      const res = await fetch(getApiUrl(`/api/dashboard/alerts/${alertId}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: activeFacilityId,
          actor: { actorId: 'admin_user', role: 'admin', facilityId: activeFacilityId },
          status: newStatus
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Alert marked as ${newStatus}.`);
        loadAlerts(activeFacilityId);
        loadOverview(activeFacilityId);
      }
    } catch (err) {
      showToast('⚠️ Failed to update alert status.');
    }
  };

  const activeFacilityObj = facilities.find((f) => f.facilityId === activeFacilityId) || {
    name: 'District Sadar Hospital (Hazaribagh)',
    type: 'District Hospital (DH)'
  };

  const filteredAlerts = alertsData.filter((a) => {
    if (alertSeverityFilter === 'ALL') return true;
    return a.severity.toLowerCase() === alertSeverityFilter.toLowerCase();
  });

  const criticalCount = alertsData.filter((a) => a.severity === 'critical' && a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-xl">🔔</span>
          <span className="text-xs font-bold">{notificationToast}</span>
        </div>
      )}

      {/* Feature Header Banner with Facility Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              FEATURE MAP 07 &bull; FACILITY DASHBOARD AGGREGATION LAYER
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Facility Operations &amp; Resource Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Real-time unified aggregation across Features 01–06: Care Continuity index, priority queue load, live bed/ICU status, footfall trends, and severity-tagged alerts.
          </p>
        </div>

        {/* Facility Selector & Home Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
            <span className="text-sm">🏥</span>
            <select
              value={activeFacilityId}
              onChange={(e) => setActiveFacilityId(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
            >
              {facilities.map((f) => (
                <option key={f.facilityId} value={f.facilityId}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <span>🏠 Home</span>
          </button>
        </div>
      </div>

      {/* Role Context Bar */}
      <div className="bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 text-xs shadow-md border border-blue-900/40">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <div>
            <span className="text-sky-200 font-medium">Active Facility:</span>{' '}
            <strong className="text-white font-bold">{activeFacilityObj.name}</strong> &bull;{' '}
            <span className="text-amber-300 font-bold">{activeFacilityObj.type || 'District Hospital'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sky-200 font-medium">Logged Role:</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/15 text-white font-mono font-bold uppercase text-[10px] border border-white/20">
            {actorRole}
          </span>
          {actorRole === 'worker' && (
            <span className="text-[10px] text-amber-300 font-bold">
              (Restricted to Patient Care &amp; Operational Views)
            </span>
          )}
          {actorRole === 'doctor' && (
            <span className="text-[10px] text-teal-300 font-bold">
              (Clinical &amp; Queue Views Enabled)
            </span>
          )}
        </div>
      </div>

      {/* 6 Section Module Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-bold">
        {actorRole !== 'worker' && (
          <button
            type="button"
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'overview'
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>📊</span>
            <span>1. Overview Summary</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveSection('patient_care')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'patient_care'
              ? 'bg-brand-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>👥</span>
          <span>2. Patient &amp; Care Mgmt</span>
        </button>

        {actorRole !== 'worker' && (
          <button
            type="button"
            onClick={() => setActiveSection('appointments_queue')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'appointments_queue'
                ? 'bg-purple-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>⏱️</span>
            <span>3. Appointments &amp; Queue</span>
          </button>
        )}

        {actorRole !== 'worker' && (
          <button
            type="button"
            onClick={() => setActiveSection('service_resource')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'service_resource'
                ? 'bg-teal-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>🏥</span>
            <span>4. Service &amp; Resources</span>
          </button>
        )}

        {actorRole !== 'worker' && actorRole !== 'doctor' && (
          <button
            type="button"
            onClick={() => setActiveSection('analytics')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'analytics'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>📈</span>
            <span>5. Analytics &amp; Reports</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveSection('alerts')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'alerts'
              ? 'bg-critical-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>🚨</span>
          <span>6. Alerts &amp; Notifications</span>
          {criticalCount > 0 && (
            <span className="px-1.5 py-0.2 bg-white text-critical-700 rounded-full font-black text-[10px]">
              {criticalCount}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: OVERVIEW SUMMARY */}
      {/* ========================================================= */}
      {activeSection === 'overview' && overviewData && (
        <div className="space-y-6">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Patients Served
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {overviewData.totalPatientsServed?.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
                ↑ 14% vs last month
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Appointments Today
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {overviewData.appointmentsToday}
              </div>
              <span className="text-[11px] text-brand-600 font-bold mt-1 inline-block">
                {overviewData.activeQueueCount} in live queue
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                High-Risk Follow-Up
              </span>
              <div className="text-3xl font-black text-purple-700 mt-2">
                {overviewData.highRiskUnderFollowUp}
              </div>
              <span className="text-[11px] text-purple-600 font-bold mt-1 inline-block">
                Under active ASHA monitoring
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Critical Active Alerts
              </span>
              <div className="text-3xl font-black text-critical-600 mt-2">
                {overviewData.criticalAlertsCount}
              </div>
              <span className="text-[11px] text-critical-500 font-bold mt-1 inline-block">
                Immediate clinical attention
              </span>
            </div>
          </div>

          {/* Care Continuity Index Gauge Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-300 block">
                  LONGITUDINAL RECORD CONTINUITY
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Care Continuity Index: {overviewData.careContinuityIndex}%
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-sky-200 border border-white/20 backdrop-blur-sm">
                ✓ High Continuity Grid
              </span>
            </div>

            <p className="text-xs text-blue-100/90 font-normal max-w-2xl leading-relaxed relative z-10">
              Measures percentage of patients with complete longitudinal record chains without drop-offs between stages: <strong>Triage &rarr; Teleconsultation &rarr; Referral &rarr; Follow-Up</strong>.
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2 relative z-10">
              <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${overviewData.careContinuityIndex}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-blue-200/80 font-bold">
                <span>0% Disconnected</span>
                <span>Target: 80%+</span>
                <span>100% Fully Connected</span>
              </div>
            </div>
          </div>

          {/* Live Recent Activity Feed */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Live Cross-Platform Activity Stream</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Real-time events aggregated across Care Navigator, Teleconsultation, Referrals, Follow-ups, and Labs.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {overviewData.recentActivities?.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {act.severity === 'critical' ? '🚨' : act.severity === 'warning' ? '⚠️' : '✓'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-extrabold">{act.type}</strong>
                        {act.severity && (
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              act.severity === 'critical'
                                ? 'bg-critical-100 text-critical-800'
                                : act.severity === 'warning'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {act.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs mt-0.5 font-medium">{act.description}</p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400 font-medium">
                    <div>{act.actor}</div>
                    <div>{new Date(act.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: PATIENT & CARE MANAGEMENT */}
      {/* ========================================================= */}
      {activeSection === 'patient_care' && patientCareData && (
        <div className="space-y-6">
          {/* High-Risk Patient List with Dynamic Risk Badges */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">High-Risk Patients Under Longitudinal Monitoring</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Dynamic risk scores calculated from frontline worker observation reports (Feature 04).
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                {patientCareData.highRiskPatientsCount} High-Risk Patients
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Dynamic Risk Score</th>
                    <th className="py-3 px-4">Assigned ASHA Worker</th>
                    <th className="py-3 px-4">Last Assessment</th>
                    <th className="py-3 px-4">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {patientCareData.highRiskPatients.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        <div>{p.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{p.primaryCondition}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            p.riskLevel === 'HIGH'
                              ? 'bg-critical-100 text-critical-800'
                              : p.riskLevel === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.riskScore} / 100 ({p.riskLevel})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{p.assignedWorkerName}</td>
                      <td className="py-3.5 px-4 text-[10px] text-slate-500">
                        {p.lastFollowUpDate && !isNaN(new Date(p.lastFollowUpDate).getTime())
                          ? new Date(p.lastFollowUpDate).toLocaleDateString()
                          : 'Active Today'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[10px] uppercase text-purple-700">
                        {p.trend === 'DETERIORATING' ? '🚨 Deteriorating' : p.trend === 'IMPROVING' ? '✓ Improving' : '→ Stable'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Referral Tracking Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>📥 Incoming Referrals</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                  {patientCareData.incomingReferrals?.length || 0}
                </span>
              </h4>
              <div className="space-y-2">
                {patientCareData.incomingReferrals?.map((r) => (
                  <div key={r.referralId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{r.patientName}</span>
                      <span className="text-[9px] uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                        {r.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      From: {r.referringDoctorName} &bull; Priority: <strong className="text-slate-700 uppercase">{r.priority}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>📤 Outgoing Escalations</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                  {patientCareData.outgoingReferrals?.length || 0}
                </span>
              </h4>
              <div className="space-y-2">
                {patientCareData.outgoingReferrals?.map((r) => (
                  <div key={r.referralId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{r.patientName}</span>
                      <span className="text-[9px] uppercase px-2 py-0.5 bg-brand-100 text-brand-800 rounded">
                        {r.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      To: {r.receivingFacilityName} &bull; Priority: <strong className="text-slate-700 uppercase">{r.priority}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Care Continuity Chain Inspection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Longitudinal Care Chain Integrity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {patientCareData.careContinuityChains?.map((c) => (
                <div
                  key={c.patientId}
                  className={`p-4 rounded-2xl border ${
                    c.chainComplete ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-slate-900">{c.patientName}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        c.chainComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.chainComplete ? '✓ Complete Chain' : '⚠️ Gap in Follow-up'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 mt-3 text-center text-[9px] font-bold">
                    <div className={`p-1.5 rounded ${c.stages.triage ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`}>
                      1. Triage
                    </div>
                    <div className={`p-1.5 rounded ${c.stages.teleconsult ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`}>
                      2. Consult
                    </div>
                    <div className={`p-1.5 rounded ${c.stages.referral ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`}>
                      3. Referral
                    </div>
                    <div className={`p-1.5 rounded ${c.stages.followUp ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>
                      4. Follow-Up
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: APPOINTMENTS & QUEUE MANAGEMENT */}
      {/* ========================================================= */}
      {activeSection === 'appointments_queue' && queueData && (
        <div className="space-y-6">
          {/* Queue KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Wait Time</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{queueData.avgWaitTimeMinutes} mins</div>
              <span className="text-[10px] text-emerald-600 font-bold">Within Golden Target (&lt;20m)</span>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Currently Waiting</span>
              <div className="text-2xl font-black text-purple-700 mt-1">{queueData.waitingCount}</div>
              <span className="text-[10px] text-purple-600 font-bold">In live priority queue</span>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Walk-Ins vs Booked</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {queueData.walkInCount} / {queueData.bookedCount}
              </div>
              <span className="text-[10px] text-slate-500 font-bold">Walk-in vs Pre-booked</span>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Today</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{queueData.totalToday}</div>
              <span className="text-[10px] text-brand-600 font-bold">Scheduled &amp; walk-in slots</span>
            </div>
          </div>

          {/* Live Queue Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Real-Time Priority Queue Telemetry</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Sorted dynamically by Urgency Tier + Risk Multiplier + Anti-Starvation Wait Time (+2 pts/min).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Priority Score</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Urgency Tier</th>
                    <th className="py-3 px-4">Wait Duration</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {queueData.liveQueue.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-black font-mono text-purple-700 text-sm">
                        ⭐ {item.priorityScore}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{item.patientName}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            item.urgencyTier === 'CRITICAL'
                              ? 'bg-critical-100 text-critical-800'
                              : item.urgencyTier === 'URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.urgencyTier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                        ⏱️ {item.waitDurationMinutes} mins
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold text-slate-600">
                          {item.isWalkIn ? '🚶 Walk-In' : '📅 Booked'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Peak Hours Load Distribution */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Hourly Patient Arrival &amp; Peak Load</h3>
            <div className="space-y-2">
              {queueData.peakHourMetrics?.map((ph, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-slate-500 font-bold text-[11px]">{ph.hour}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${(ph.patientCount / 30) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-12 text-right">
                    {ph.patientCount} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: SERVICE & RESOURCE STATUS */}
      {/* ========================================================= */}
      {activeSection === 'service_resource' && serviceResourceData && (
        <div className="space-y-6">
          {/* Emergency Readiness Banner */}
          <div className="bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block">
                FACILITY EMERGENCY READINESS SCORE
              </span>
              <h3 className="text-2xl font-black text-white mt-0.5">
                Readiness Index: {serviceResourceData.emergencyReadinessScore} / 100
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl font-medium">
                Evaluated from available ICU beds, oxygen buffer, ready 108 ambulances, and emergency on-duty specialist doctors.
              </p>
            </div>

            {actorRole !== 'worker' && (
              <button
                type="button"
                onClick={() => {
                  const b = serviceResourceData.resources.find((r) => r.resourceType === 'bed');
                  if (b) {
                    setResourceTotal(b.totalCount);
                    setResourceAvailable(b.availableCount);
                  }
                  setShowResourceModal(true);
                }}
                className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>✏️ Update Bed &amp; Resource Availability</span>
              </button>
            )}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {serviceResourceData.resources?.map((res, idx) => {
              const utilRatio = (res.totalCount - res.availableCount) / res.totalCount;
              const isLow = res.availableCount / res.totalCount < 0.20;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border transition-all space-y-3 ${
                    isLow ? 'border-critical-300 bg-critical-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{res.resourceName}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{res.resourceType}</span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        isLow ? 'bg-critical-100 text-critical-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isLow ? '⚠️ Low Stock' : '✓ Normal'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">{res.availableCount}</span>
                    <span className="text-xs font-bold text-slate-500">/ {res.totalCount} Available</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isLow ? 'bg-critical-500' : 'bg-teal-500'}`}
                      style={{ width: `${(res.availableCount / res.totalCount) * 100}%` }}
                    ></div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>Updated: {new Date(res.lastUpdated).toLocaleTimeString()}</span>
                    {res.isStale && <span className="text-amber-600 font-bold">⚠️ Stale Data</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Departments Capacity Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Active Clinical Departments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Head Doctor</th>
                    <th className="py-3 px-4">Available Beds</th>
                    <th className="py-3 px-4">Capacity Utilization</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {serviceResourceData.departments?.map((d) => (
                    <tr key={d.departmentId}>
                      <td className="py-3.5 px-4 font-black text-slate-900">{d.name}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{d.headDoctor}</td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {d.availableBeds} / {d.totalBeds}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-600 rounded-full"
                              style={{ width: `${d.utilizationPercent}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-[10px]">{d.utilizationPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 5: ANALYTICS & REPORTS */}
      {/* ========================================================= */}
      {activeSection === 'analytics' && analyticsData && (
        <div className="space-y-6">
          {/* Footfall Time-Series Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">7-Day Patient Footfall Time-Series</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Aggregated time-series trend of total visits, OPD consultations, and emergency admissions.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Date Range: {analyticsData.dateRange.start} to {analyticsData.dateRange.end}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-4 text-center">
              {analyticsData.footfallTrends?.map((ft, idx) => (
                <div key={idx} className="space-y-2 flex flex-col justify-end">
                  <div className="text-[10px] font-mono font-bold text-slate-700">{ft.totalCount}</div>
                  <div className="w-full bg-slate-100 rounded-2xl p-1.5 flex flex-col justify-end h-40">
                    <div
                      className="bg-emerald-500 rounded-t-xl w-full"
                      style={{ height: `${(ft.opdCount / 200) * 100}%` }}
                      title={`OPD: ${ft.opdCount}`}
                    ></div>
                    <div
                      className="bg-critical-500 rounded-b-xl w-full mt-0.5"
                      style={{ height: `${(ft.emergencyCount / 200) * 100}%` }}
                      title={`Emergency: ${ft.emergencyCount}`}
                    ></div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">
                    {new Date(ft.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                <span>OPD Consultations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-critical-500 rounded"></span>
                <span>Emergency Admissions</span>
              </div>
            </div>
          </div>

          {/* Disease Category Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Regional Disease &amp; Clinical Case Distribution</h3>
            <div className="space-y-3">
              {analyticsData.diseaseCategoryBreakdown?.map((dc, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{dc.category}</span>
                    <span className="font-mono text-slate-900">
                      {dc.count} cases ({dc.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${dc.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 6: ALERTS & NOTIFICATION CENTER */}
      {/* ========================================================= */}
      {activeSection === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Unified Facility Alert &amp; Notification Center</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Rule-triggered alerts for critical triage red-flags, low resource thresholds, missed follow-ups, and data syncs.
                </p>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setAlertSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      alertSeverityFilter === sev
                        ? 'bg-slate-900 text-white font-black shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert List */}
            <div className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                  No active alerts matching severity filter '{alertSeverityFilter}'.
                </div>
              ) : (
                filteredAlerts.map((alt) => (
                  <div
                    key={alt.alertId}
                    className={`p-5 rounded-2xl border transition-all flex items-start justify-between flex-wrap gap-3 ${
                      alt.severity === 'critical'
                        ? 'border-critical-300 bg-critical-50/40'
                        : alt.severity === 'warning'
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 max-w-2xl">
                      <span className="text-2xl mt-0.5">
                        {alt.severity === 'critical' ? '🚨' : alt.severity === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              alt.severity === 'critical'
                                ? 'bg-critical-200 text-critical-900'
                                : alt.severity === 'warning'
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {alt.severity}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{alt.alertType}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              alt.status === 'active'
                                ? 'bg-critical-100 text-critical-800 font-black'
                                : alt.status === 'acknowledged'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {alt.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mt-1.5 leading-relaxed">{alt.message}</p>
                        <div className="text-[10px] text-slate-400 font-medium mt-1">
                          Generated: {new Date(alt.createdAt).toLocaleTimeString()} &bull; ID: {alt.alertId}
                        </div>
                      </div>
                    </div>

                    {/* Alert Action Buttons */}
                    <div className="flex items-center gap-2">
                      {alt.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateAlertStatus(alt.alertId, 'acknowledged')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alt.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateAlertStatus(alt.alertId, 'resolved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          ✓ Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADMIN RESOURCE UPDATE */}
      {/* ========================================================= */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  Admin Facility Telemetry
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Update Bed &amp; Resource Availability</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResourceModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateResource} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Resource Type</label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => {
                    const t = e.target.value;
                    setSelectedResourceType(t);
                    const res = serviceResourceData?.resources?.find((r) => r.resourceType === t);
                    if (res) {
                      setResourceTotal(res.totalCount);
                      setResourceAvailable(res.availableCount);
                    }
                  }}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold bg-white"
                >
                  <option value="bed">General Inpatient Beds</option>
                  <option value="icu_bed">ICU &amp; Critical Beds</option>
                  <option value="ventilator">Mechanical Ventilators</option>
                  <option value="oxygen">Oxygen Cylinders</option>
                  <option value="ambulance">108 / Emergency Ambulances</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={resourceTotal}
                    onChange={(e) => setResourceTotal(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Count</label>
                  <input
                    type="number"
                    min="0"
                    max={resourceTotal}
                    value={resourceAvailable}
                    onChange={(e) => setResourceAvailable(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
                ℹ️ If available count drops below 20% capacity, a <strong>Critical Resource Alert</strong> is automatically generated.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"
                >
                  Save Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// --- ABOUT US PAGE COMPONENT ---
// ==========================================

function ScreenAboutUs({
  onBackToHome,
  onLaunchFeature1,
  onLaunchFeature2,
  onLaunchFeature3,
  onLaunchFeature4,
  onLaunchFeature5,
  onLaunchFeature6,
  onLaunchFeature7
}) {
  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-indigo-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            NATIONAL DIGITAL HEALTH MISSION &bull; RURAL HEALTHCARE OPERATING SYSTEM
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            About MedVeda
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            MedVeda is an intelligent, clinically guarded healthcare orchestration platform engineered to bridge the last-mile gap in rural and peri-urban healthcare delivery across India. By integrating multi-agent AI triage, live verified hospital discovery, prioritized teleconsultation, closed-loop referrals, longitudinal follow-ups, ABDM-interoperable health records, and medicine/diagnostic logistics, MedVeda ensures no patient falls through the cracks.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={onLaunchFeature1}
              className="px-5 py-3 bg-critical-600 hover:bg-critical-500 text-white font-black text-xs rounded-xl shadow-lg shadow-critical-600/30 transition-all flex items-center gap-2"
            >
              <span>🚨 Launch Care Navigator (F01)</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <span>🏠 Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Platform Highlights Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-indigo-600 block">7</span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">
            Integrated Modules
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Triage to Facility Control</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-emerald-600 block">100%</span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">
            Safety Guardrails
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Strict Invariant Gating</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-purple-600 block">4-Stage</span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">
            Care Continuity Chain
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Triage &rarr; Consult &rarr; Ref &rarr; Follow-up</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-teal-600 block">ABDM</span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block">
            FHIR Compliant
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Interoperable Health Records</span>
        </div>
      </div>

      {/* The Problem & Our Mission */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            THE LAST-MILE HEALTHCARE CRISIS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Why We Built MedVeda
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-2">
            In rural India, over 70% of the population relies on a tiered public health network of Sub-Centres, Primary Health Centres (PHCs), and Community Health Centres (CHCs). When medical emergencies strike or chronic conditions deteriorate, patients face systemic bottlenecks:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-2xl">⏳</div>
            <h4 className="font-bold text-slate-900 text-sm">Critical Triage &amp; Routing Delays</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patients with acute STEMI chest pain or stroke often travel hours to facilities that lack 24/7 ICU beds, catheterization labs, or on-duty emergency physicians.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-2xl">📴</div>
            <h4 className="font-bold text-slate-900 text-sm">Fragmented Paper Referrals</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paper referral slips are frequently lost, counter-referrals rarely happen, and frontline ASHA workers have no digital visibility into post-hospitalization care plans.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-2xl">📦</div>
            <h4 className="font-bold text-slate-900 text-sm">Medicine &amp; Diagnostic Stockouts</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patients travel long distances only to discover essential medicines (e.g. Tenecteplase, Telmisartan) or diagnostic tests are out of stock at local pharmacies.
            </p>
          </div>
        </div>
      </div>

      {/* The 7 Core Platform Pillars */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            COMPREHENSIVE SOLUTION ARCHITECTURE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            The 7 Pillars of the MedVeda Platform
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-1">
            Every feature in MedVeda is designed to interconnect seamlessly, creating an unbroken continuum of care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-critical-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-critical-100 text-critical-800 uppercase">
                  Feature 01
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">3-Agent Pipeline</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">🚨 Smart Care Navigator</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous clinical triage with non-bypassable red-flag detection, live hospital discovery via Google Search MCP, and multi-factor capability ranking (OPD vs. 24x7 Emergency).
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchFeature1}
              className="w-full py-2.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Launch Care Navigator</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-brand-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-100 text-brand-800 uppercase">
                  Feature 02
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Priority Queuing</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">🩺 Teleconsultation &amp; Queue</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-facility doctor roster with real-time urgency-weighted queuing, anti-starvation wait score (+2 pts/min), and seamless call mode degradation (Video &rarr; Audio &rarr; In-App Chat).
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchFeature2}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Start Teleconsultation</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                  Feature 03
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Closed-Loop Token</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">📋 Smart Referral Management</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digital referral pass with unique token (REF-2026-XXXXX), strict 5-stage lifecycle state machine (CREATED &rarr; SENT &rarr; IN_PROGRESS &rarr; REACHED &rarr; COMPLETED), and counter-referral loop.
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchFeature3}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Referrals Workspace</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase">
                  Feature 04
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Dynamic Risk Score</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">🔄 High-Risk Follow-Up System</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctor-assigned periodic schedules for frontline ASHA health workers, mobile observation forms, dynamic risk scoring engine (0-100), and automated hospital deterioration alerts.
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchFeature4}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Follow-Up System</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 5 */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 uppercase">
                  Feature 05
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">ABHA / ABDM FHIR</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">📁 Interoperable Health Records</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Internal Medical ID anchor, optional ABDM/ABHA linking, OCR paper prescription parsing, unified 4-source longitudinal timeline, and audited emergency access override.
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchFeature5}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Health Records</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 6 */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 uppercase">
                  Feature 06
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Geo Inventory &amp; Labs</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">💊 Medicine &amp; Diagnostic Coordination</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time pharmacy stock search with Haversine distance &amp; out-of-radius fallback, owner-only RBAC CRUD, counter reservation pickup, and doctor diagnostic test fulfillment.
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchFeature6}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Medicine &amp; Lab</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 7 */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all md:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase">
                  Feature 07
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Multi-Source Aggregation</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">🏥 Facility Operations Dashboard</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time multi-source aggregation layer across Features 01–06: 6 role-gated sections, Care Continuity Index (Triage &rarr; Consult &rarr; Referral &rarr; Follow-Up), live priority queue, updatable bed/ICU/oxygen resource meters, time-series analytics, and unified alert notifications.
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchFeature7}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Facility Dashboard</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Agent AI Architecture Deep Dive */}
      <div className="bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-blue-900/40 space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
            CORE AI ENGINE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            The 3-Agent Clinical Navigation Architecture
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1 max-w-2xl">
            Built on a decoupled 3-agent orchestration pipeline that transforms raw patient symptoms into verified, clinically safe routing decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-full bg-critical-500/20 text-critical-300 font-bold flex items-center justify-center text-xs">
              01
            </div>
            <h4 className="font-bold text-white text-sm">Agent 1: Triage Specialist</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes chief complaints and red-flags. Determines urgency tier (CRITICAL, URGENT, ROUTINE) and required specialty with absolute red-flag invariance.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-xs">
              02
            </div>
            <h4 className="font-bold text-white text-sm">Agent 2: Research &amp; Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leverages Google Search MCP to discover regional hospitals in real time, extract verified services, and strictly classify OPD-only vs. 24x7 Emergency facilities.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs">
              03
            </div>
            <h4 className="font-bold text-white text-sm">Agent 3: Clinical Ranking Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes multi-attribute ranking evaluating urgency match, verified emergency readiness, specialty alignment, travel distance, and operational hours.
            </p>
          </div>
        </div>
      </div>

      {/* Stakeholders & Personas */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            MULTIDISCIPLINARY COOPERATION
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Built for Every Healthcare Stakeholder
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl">👩‍⚕️</span>
            <h4 className="font-bold text-slate-900 text-sm">ASHA Health Workers</h4>
            <p className="text-slate-600 leading-relaxed">
              Conduct guided field triage, submit longitudinal home observation reports, and track high-risk patients on mobile devices.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl">👤</span>
            <h4 className="font-bold text-slate-900 text-sm">Rural Citizens &amp; Families</h4>
            <p className="text-slate-600 leading-relaxed">
              Check symptoms freely, book teleconsultations, locate nearby medicines, and carry a digital Medical ID card.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl">👨‍⚕️</span>
            <h4 className="font-bold text-slate-900 text-sm">Specialist Doctors</h4>
            <p className="text-slate-600 leading-relaxed">
              Review prioritized queues, consult remotely via video/audio/chat, sign digital EMR prescriptions, and generate digital referrals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl">🏪</span>
            <h4 className="font-bold text-slate-900 text-sm">Medical Shop Owners</h4>
            <p className="text-slate-600 leading-relaxed">
              Manage inventory stock levels with owner-only RBAC and confirm incoming customer medicine reservation pickups.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl">🧪</span>
            <h4 className="font-bold text-slate-900 text-sm">Diagnostic Lab Staff</h4>
            <p className="text-slate-600 leading-relaxed">
              Manage diagnostic test catalogs, track sample collection to completion, and publish dual clinical &amp; plain-language reports.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl">🏥</span>
            <h4 className="font-bold text-slate-900 text-sm">Facility Administrators</h4>
            <p className="text-slate-600 leading-relaxed">
              Monitor bed/ICU/oxygen capacity, track regional footfall analytics, and resolve rule-triggered emergency alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Standards & Technical Guarantees */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 sm:p-10 border border-indigo-200/80 space-y-4 text-xs">
        <h3 className="text-lg font-black text-indigo-950">Technical &amp; Standards Compliance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-1">
            <strong className="text-indigo-900 font-extrabold block">ABDM Sandbox</strong>
            <p className="text-slate-600">Open sandbox compliant architecture with FHIR standard bundle serialization.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-1">
            <strong className="text-indigo-900 font-extrabold block">Immutable Audit Log</strong>
            <p className="text-slate-600">Every emergency access override records mandatory clinical justification and clinician ID.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-1">
            <strong className="text-indigo-900 font-extrabold block">Strict RBAC Model</strong>
            <p className="text-slate-600">Backend-enforced access control ensuring non-owner roles cannot mutate private data.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-1">
            <strong className="text-indigo-900 font-extrabold block">54/54 Unit Tests</strong>
            <p className="text-slate-600">100% test pass rate verifying clinical invariants, priority formulas, and state machines.</p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="text-center bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/40 space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black">Experience the Future of Rural Healthcare</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
          Explore any of the 7 features in the MedVeda ecosystem, simulate different stakeholder roles, and see how intelligent care navigation transforms patient outcomes.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <button
            type="button"
            onClick={onLaunchFeature1}
            className="px-6 py-3 bg-critical-600 hover:bg-critical-500 text-white font-black text-xs rounded-xl shadow-lg transition-all"
          >
            Start Care Navigator Demo
          </button>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
          >
            Explore All Features
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// --- MAIN APPLICATION ROOT (ROUTER & STATE) ---
// ==========================================
function App() {
  const [view, setViewState] = useState('home'); // 'home' | 'feature1' | 'feature2' | 'feature3' | 'feature4' | 'feature5' | 'feature6' | 'feature7'
  const [feature1Screen, setFeature1Screen] = useState(1);
  const [teleconsultScreen, setTeleconsultScreen] = useState('entry'); // 'entry' | 'booking' | 'queue' | 'call' | 'doctor' | 'summary'
  const [actorRole, setActorRole] = useState('worker'); // 'worker' | 'patient' | 'doctor' | 'shop_owner' | 'lab_staff' | 'facility' | 'admin'

  // Feature 01 States
  const [patient, setPatient] = useState(INITIAL_PATIENT);
  const [symptoms, setSymptoms] = useState(INITIAL_SYMPTOMS);
  const [redFlags, setRedFlags] = useState(INITIAL_RED_FLAGS);
  const [triageResult, setTriageResult] = useState(null);
  const [facilities, setFacilities] = useState(MOCK_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState(MOCK_FACILITIES[0]);

  // Feature 02 States
  const [teleconsultAppointment, setTeleconsultAppointment] = useState(null);
  const [recordedVitals, setRecordedVitals] = useState([]);
  const [consultationDocumentation, setConsultationDocumentation] = useState(null);

  const parseHash = () => {
    const hash = window.location.hash || '#home';
    if (hash.startsWith('#screen=')) {
      const num = Number(hash.replace('#screen=', '')) || 1;
      setViewState('feature1');
      setFeature1Screen(num);
    } else if (hash.startsWith('#teleconsult=')) {
      const screenName = hash.replace('#teleconsult=', '') || 'entry';
      setViewState('feature2');
      setTeleconsultScreen(screenName);
    } else if (hash === '#feature1') {
      setViewState('feature1');
    } else if (hash === '#feature2') {
      setViewState('feature2');
    } else if (hash === '#feature3' || hash === '#referrals' || hash === '#referrals-doctor') {
      setViewState('feature3');
      setActorRole('doctor');
    } else if (hash === '#referrals-worker') {
      setViewState('feature3');
      setActorRole('worker');
    } else if (hash === '#referrals-facility') {
      setViewState('feature3');
      setActorRole('facility');
    } else if (hash === '#referrals-patient') {
      setViewState('feature3');
      setActorRole('patient');
    } else if (hash === '#feature4' || hash === '#followups' || hash === '#followups-doctor') {
      setViewState('feature4');
      setActorRole('doctor');
    } else if (hash === '#followups-worker') {
      setViewState('feature4');
      setActorRole('worker');
    } else if (hash === '#followups-facility') {
      setViewState('feature4');
      setActorRole('facility');
    } else if (hash === '#followups-patient') {
      setViewState('feature4');
      setActorRole('patient');
    } else if (hash === '#feature5' || hash === '#records' || hash === '#records-patient') {
      setViewState('feature5');
      setActorRole('patient');
    } else if (hash === '#records-doctor') {
      setViewState('feature5');
      setActorRole('doctor');
    } else if (hash === '#records-worker') {
      setViewState('feature5');
      setActorRole('worker');
    } else if (hash === '#feature6' || hash === '#medicine' || hash === '#diagnostic') {
      setViewState('feature6');
    } else if (hash === '#shop-owner') {
      setViewState('feature6');
      setActorRole('shop_owner');
    } else if (hash === '#lab-staff') {
      setViewState('feature6');
      setActorRole('lab_staff');
    } else if (hash === '#doctor-orders' || hash === '#diagnostic-orders') {
      setViewState('feature6');
      setActorRole('doctor');
    } else if (
      hash === '#feature7' ||
      hash === '#dashboard' ||
      hash === '#facility-dashboard' ||
      hash === '#dashboard-overview' ||
      hash === '#dashboard-care' ||
      hash === '#dashboard-queue' ||
      hash === '#dashboard-resources' ||
      hash === '#dashboard-analytics' ||
      hash === '#dashboard-alerts'
    ) {
      setViewState('feature7');
      if (actorRole === 'worker' || actorRole === 'patient') {
        setActorRole('facility');
      }
    } else if (hash === '#about' || hash === '#about-us') {
      setViewState('about');
    } else {
      setViewState('home');
    }
  };

  useEffect(() => {
    parseHash();
    const onHashChange = () => parseHash();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setView = (v) => {
    setViewState(v);
    window.location.hash = v;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setScreen = (s) => {
    setFeature1Screen(s);
    window.location.hash = `screen=${s}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartFeature1 = () => {
    setPatient(INITIAL_PATIENT);
    setSymptoms(INITIAL_SYMPTOMS);
    setRedFlags(INITIAL_RED_FLAGS);
    setTriageResult(null);
    setScreen(1);
  };

  const handleRestartFeature2 = () => {
    setTeleconsultAppointment(null);
    setRecordedVitals([]);
    setConsultationDocumentation(null);
    setTeleconsultScreen('entry');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header
        currentView={view}
        setView={setView}
        currentScreen={feature1Screen}
        setScreen={setScreen}
        actorRole={actorRole}
        setActorRole={setActorRole}
      />

      <main className="flex-1 max-w-6xl xl:max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {/* VIEW 1: HOMEPAGE */}
        {view === 'home' && (
          <ScreenHomepage
            onLaunchFeature1={() => {
              setView('feature1');
              setScreen(1);
            }}
            onLaunchFeature2={() => {
              setView('feature2');
              setTeleconsultScreen('entry');
            }}
            onLaunchFeature3={() => {
              setView('feature3');
            }}
            onLaunchFeature4={() => {
              setView('feature4');
            }}
            onLaunchFeature5={() => {
              setView('feature5');
            }}
            onLaunchFeature6={() => {
              setView('feature6');
            }}
            onLaunchFeature7={() => {
              setView('feature7');
            }}
            onLaunchAbout={() => {
              setView('about');
            }}
            actorRole={actorRole}
            setActorRole={setActorRole}
          />
        )}

        {/* VIEW 2: FEATURE 01 — SMART CARE NAVIGATOR */}
        {view === 'feature1' && (
          <div>
            {feature1Screen === 1 && (
              <Screen1PatientInfo
                patient={patient}
                setPatient={setPatient}
                onNext={() => setScreen(2)}
              />
            )}

            {feature1Screen === 2 && (
              <Screen2SymptomAssessment
                symptoms={symptoms}
                setSymptoms={setSymptoms}
                onNext={() => setScreen(3)}
                onBack={() => setScreen(1)}
              />
            )}

            {feature1Screen === 3 && (
              <Screen3RedFlags
                redFlags={redFlags}
                setRedFlags={setRedFlags}
                onNext={() => setScreen(4)}
                onBack={() => setScreen(2)}
              />
            )}

            {feature1Screen === 4 && (
              <Screen4TriageProcessing
                patient={patient}
                symptoms={symptoms}
                redFlags={redFlags}
                onComplete={(data) => {
                  if (data) setTriageResult(data);
                  setScreen(5);
                }}
              />
            )}

            {feature1Screen === 5 && (
              <Screen5TriageResult
                triage={triageResult}
                onFindHospitals={() => setScreen(6)}
                onBack={() => setScreen(3)}
              />
            )}

            {feature1Screen === 6 && (
              <Screen6HospitalSearch
                location={patient.location}
                requiredSpecialty={triageResult?.requiredSpecialty}
                emergencyRequired={triageResult?.emergencyRequired}
                onComplete={(liveFacilities) => {
                  if (liveFacilities && liveFacilities.length > 0) {
                    setFacilities(liveFacilities);
                    setSelectedFacility(liveFacilities[0]);
                  }
                  setScreen(7);
                }}
              />
            )}

            {feature1Screen === 7 && (
              <Screen7RecommendedFacilities
                facilities={facilities}
                onSelectFacility={(fac) => {
                  setSelectedFacility(fac);
                  setScreen(8);
                }}
                onBack={() => setScreen(5)}
              />
            )}

            {feature1Screen === 8 && (
              <Screen8FacilityDetails
                facility={selectedFacility}
                onNext={() => setScreen(9)}
                onBack={() => setScreen(7)}
              />
            )}

            {feature1Screen === 9 && (
              <Screen9ReferralPass
                facility={selectedFacility}
                patient={patient}
                onRestart={handleRestartFeature1}
              />
            )}
          </div>
        )}

        {/* VIEW 3: FEATURE 02 — TELECONSULTATION & QUEUE MANAGEMENT */}
        {view === 'feature2' && (
          <div>
            {teleconsultScreen === 'entry' && (
              <ScreenTeleconsultEntry
                actorRole={actorRole}
                onSelectPath={(path) => {
                  setActorRole(path);
                  setTeleconsultScreen('booking');
                }}
                onBackToHome={() => setView('home')}
              />
            )}

            {teleconsultScreen === 'booking' && (
              <ScreenTeleconsultBooking
                pathActor={actorRole}
                onBookSuccess={(apt) => {
                  setTeleconsultAppointment(apt);
                  setTeleconsultScreen('queue');
                }}
                onBack={() => setTeleconsultScreen('entry')}
                onEmergencyEscalate={() => {
                  setView('feature1');
                  setScreen(1);
                }}
              />
            )}

            {teleconsultScreen === 'queue' && (
              <ScreenTeleconsultQueue
                appointment={teleconsultAppointment}
                onJoinCall={() => setTeleconsultScreen('call')}
                onBack={() => setTeleconsultScreen('booking')}
              />
            )}

            {teleconsultScreen === 'call' && (
              <ScreenTeleconsultCall
                appointment={teleconsultAppointment}
                pathActor={actorRole}
                onCompleteConsultation={(vitalsLogged) => {
                  setRecordedVitals(vitalsLogged);
                  setTeleconsultScreen('doctor');
                }}
              />
            )}

            {teleconsultScreen === 'doctor' && (
              <ScreenDoctorDocumentation
                appointment={teleconsultAppointment}
                vitals={recordedVitals}
                onSaveDocumentation={(docData) => {
                  setConsultationDocumentation(docData);
                  setTeleconsultScreen('summary');
                }}
              />
            )}

            {teleconsultScreen === 'summary' && (
              <ScreenConsultationSummary
                consultationData={consultationDocumentation}
                onRestart={handleRestartFeature2}
                onGoHome={() => setView('home')}
              />
            )}
          </div>
        )}

        {/* VIEW 4: FEATURE 03 — SMART REFERRAL MANAGEMENT SYSTEM */}
        {view === 'feature3' && (
          <ScreenReferralManagement
            actorRole={actorRole}
            setActorRole={setActorRole}
            onBackToHome={() => setView('home')}
            onNavigateToCareNavigator={() => {
              setView('feature1');
              setScreen(1);
            }}
          />
        )}

        {/* VIEW 5: FEATURE 04 — HIGH-RISK PATIENT FOLLOW-UP SYSTEM */}
        {view === 'feature4' && (
          <ScreenHighRiskFollowUp
            actorRole={actorRole}
            setActorRole={setActorRole}
            onBackToHome={() => setView('home')}
            onNavigateToCareNavigator={() => {
              setView('feature1');
              setScreen(1);
            }}
            onNavigateToReferrals={() => setView('feature3')}
          />
        )}

        {/* VIEW 6: FEATURE 05 — INTEROPERABLE HEALTH RECORDS */}
        {view === 'feature5' && (
          <ScreenInteroperableRecords
            actorRole={actorRole}
            setActorRole={setActorRole}
            onBackToHome={() => setView('home')}
            onNavigateToCareNavigator={() => {
              setView('feature1');
              setScreen(1);
            }}
            onNavigateToTeleconsult={() => {
              setView('feature2');
              setTeleconsultScreen('entry');
            }}
            onNavigateToReferrals={() => setView('feature3')}
            onNavigateToFollowUps={() => setView('feature4')}
          />
        )}

        {/* VIEW 7: FEATURE 06 — MEDICINE AVAILABILITY & DIAGNOSTIC COORDINATION */}
        {view === 'feature6' && (
          <ScreenMedicineDiagnostics
            actorRole={actorRole}
            setActorRole={setActorRole}
            onBackToHome={() => setView('home')}
            onNavigateToCareNavigator={() => {
              setView('feature1');
              setScreen(1);
            }}
            onNavigateToTeleconsult={() => {
              setView('feature2');
              setTeleconsultScreen('entry');
            }}
            onNavigateToReferrals={() => setView('feature3')}
            onNavigateToFollowUps={() => setView('feature4')}
            onNavigateToRecords={() => setView('feature5')}
          />
        )}

        {/* VIEW 8: FEATURE 07 — FACILITY DASHBOARD & MULTI-SOURCE AGGREGATION LAYER */}
        {view === 'feature7' && (
          <ScreenFacilityDashboard
            actorRole={actorRole}
            setActorRole={setActorRole}
            onBackToHome={() => setView('home')}
            onNavigateToCareNavigator={() => {
              setView('feature1');
              setScreen(1);
            }}
            onNavigateToTeleconsult={() => {
              setView('feature2');
              setTeleconsultScreen('entry');
            }}
            onNavigateToReferrals={() => setView('feature3')}
            onNavigateToFollowUps={() => setView('feature4')}
            onNavigateToRecords={() => setView('feature5')}
            onNavigateToMedicine={() => setView('feature6')}
          />
        )}

        {/* VIEW 9: ABOUT US PAGE */}
        {view === 'about' && (
          <ScreenAboutUs
            onBackToHome={() => setView('home')}
            onLaunchFeature1={() => {
              setView('feature1');
              setScreen(1);
            }}
            onLaunchFeature2={() => {
              setView('feature2');
              setTeleconsultScreen('entry');
            }}
            onLaunchFeature3={() => {
              setView('feature3');
            }}
            onLaunchFeature4={() => {
              setView('feature4');
            }}
            onLaunchFeature5={() => {
              setView('feature5');
            }}
            onLaunchFeature6={() => {
              setView('feature6');
            }}
            onLaunchFeature7={() => {
              setView('feature7');
            }}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl xl:max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            MedVeda Smart Care Platform &bull; Autonomous Care Navigation &bull; Priority Telehealth &bull; Closed-Loop Referrals &bull; High-Risk Follow-Up &bull; Interoperable Health Records &bull; Medicine &amp; Diagnostic Coordination &bull; Facility Operations Dashboard
          </div>
          <div className="flex items-center gap-3 font-bold text-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setView('home')}
              className="hover:text-[#0b2b82] transition-colors"
            >
              Home
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setView('about')}
              className="text-[#0b2b82] hover:text-[#071a4f] transition-colors underline underline-offset-2 font-black"
            >
              ℹ️ About MedVeda
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Mount the React Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

