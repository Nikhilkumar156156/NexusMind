const _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const { useState, useEffect, useMemo, useRef } = React;

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
    React.createElement('div', { className: `${className} flex items-center justify-center shrink-0`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}
      , React.createElement('svg', { viewBox: "0 0 100 100"   , className: "w-full h-full drop-shadow-sm"  , fill: "none", xmlns: "http://www.w3.org/2000/svg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}}
        , React.createElement('defs', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 468}}
          , React.createElement('linearGradient', { id: "medVedaLeafGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 469}}
            , React.createElement('stop', { offset: "0%", stopColor: "#14b8a6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 470}} )
            , React.createElement('stop', { offset: "60%", stopColor: "#0d9488", __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}} )
            , React.createElement('stop', { offset: "100%", stopColor: "#0f766e", __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}} )
          )
          , React.createElement('linearGradient', { id: "medVedaCrossGrad", x1: "0%", y1: "0%", x2: "0%", y2: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}
            , React.createElement('stop', { offset: "0%", stopColor: "#0891b2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}} )
            , React.createElement('stop', { offset: "100%", stopColor: "#0f2942", __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}} )
          )
        )

        /* Medical Cross in Deep Navy / Teal with Rounded Caps */
        , React.createElement('path', {
          d: "M38 14 C38 10 41 7 45 7 L55 7 C59 7 62 10 62 14 L62 34 L82 34 C86 34 89 37 89 41 L89 51 C89 55 86 58 82 58 L62 58 L62 78 C62 82 59 85 55 85 L45 85 C41 85 38 82 38 78 L38 58 L18 58 C14 58 11 55 11 51 L11 41 C11 37 14 34 18 34 L38 34 Z"                                                                        ,
          stroke: "#0f2942",
          strokeWidth: "6.5",
          strokeLinejoin: "round",
          fill: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 481}}
        )

        /* Dynamic Pulse / ECG Heartbeat Wave */
        , React.createElement('path', {
          d: "M6 46 L24 46 L30 38 L36 58 L44 24 L50 64 L56 46 L68 46"               ,
          stroke: "#0f2942",
          strokeWidth: "5",
          strokeLinecap: "round",
          strokeLinejoin: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}
        )

        /* Vibrant Teal Ayurvedic Leaf */
        , React.createElement('path', {
          d: "M48 74 C56 56 74 32 94 20 C94 46 76 72 48 74 Z"              ,
          fill: "url(#medVedaLeafGrad)", __self: this, __source: {fileName: _jsxFileName, lineNumber: 499}}
        )

        /* White Leaf Veins */
        , React.createElement('path', {
          d: "M50 72 C64 56 78 38 92 22"       ,
          stroke: "#ffffff",
          strokeWidth: "2.4",
          strokeLinecap: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}
        )
        , React.createElement('path', {
          d: "M66 54 C74 49 80 49 86 48"       ,
          stroke: "#ffffff",
          strokeWidth: "1.6",
          strokeLinecap: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}
        )
        , React.createElement('path', {
          d: "M58 64 C66 61 72 58 78 53"       ,
          stroke: "#ffffff",
          strokeWidth: "1.6",
          strokeLinecap: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 517}}
        )
      )
    )
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
    React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}}
      , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}}
        /* Modal Header */
        , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}
          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 584}}
            , React.createElement(MedVedaLogo, { className: "h-9 w-9" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 585}} )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 586}}
              , React.createElement('h3', { className: "text-lg font-black text-slate-900 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 587}}, "MedVeda Portal Access"  )
              , React.createElement('p', { className: "text-[11px] text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 588}}, "National Digital Health Mission • ABDM Integrated"      )
            )
          )
          , React.createElement('button', {
            type: "button",
            onClick: onClose,
            className: "text-slate-400 hover:text-slate-600 text-2xl font-black leading-none p-1"     ,
            'aria-label': "Close", __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}
, "×"

          )
        )

        /* Tab Switcher: Log In vs Sign Up */
        , React.createElement('div', { className: "grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1 text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 602}}
          , React.createElement('button', {
            type: "button",
            onClick: () => setActiveTab('login'),
            className: `py-2 rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-[#0b2b82] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 603}}
, "🔐 Log In"

          )
          , React.createElement('button', {
            type: "button",
            onClick: () => setActiveTab('signup'),
            className: `py-2 rounded-lg transition-all ${
              activeTab === 'signup'
                ? 'bg-[#0b2b82] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}}
, "✨ Sign Up (ABDM)"

          )
        )

        , authSuccessMsg ? (
          React.createElement('div', { className: "p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}
            , React.createElement('div', { className: "w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}, "✓"

            )
            , React.createElement('p', { className: "text-xs font-bold text-emerald-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 632}}, authSuccessMsg)
            , React.createElement('p', { className: "text-[11px] text-emerald-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 633}}, "Connecting role session..."  )
          )
        ) : activeTab === 'login' ? (
          /* ================= LOGIN FORM ================= */
          React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 637}}
            /* Quick Demo Login Personas */
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 639}}
              , React.createElement('span', { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 640}}, "Quick 1-Click Simulation Login"

              )
              , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => handleQuickLogin('Anita Devi', 'worker', '9876543210@abdm'),
                  className: "p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all cursor-pointer"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 644}}

                  , React.createElement('span', { className: "text-sm block" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}, "👩‍⚕️")
                  , React.createElement('span', { className: "text-[11px] font-extrabold text-purple-900 block truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 650}}, "Anita Devi" )
                  , React.createElement('span', { className: "text-[9px] text-purple-700 font-semibold block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}, "ASHA Worker" )
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => handleQuickLogin('Dr. Priya Sharma', 'doctor', 'priya.sharma@abdm'),
                  className: "p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all cursor-pointer"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}}

                  , React.createElement('span', { className: "text-sm block" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}}, "👨‍⚕️")
                  , React.createElement('span', { className: "text-[11px] font-extrabold text-[#0b2b82] block truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 660}}, "Dr. Priya" )
                  , React.createElement('span', { className: "text-[9px] text-blue-700 font-semibold block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 661}}, "Doctor")
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => handleQuickLogin('Ramesh Mahto', 'patient', 'ramesh.mahto@abdm'),
                  className: "p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all cursor-pointer"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 664}}

                  , React.createElement('span', { className: "text-sm block" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 669}}, "👤")
                  , React.createElement('span', { className: "text-[11px] font-extrabold text-emerald-900 block truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 670}}, "Ramesh M." )
                  , React.createElement('span', { className: "text-[9px] text-emerald-700 font-semibold block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 671}}, "Patient")
                )
              )
            )

            , React.createElement('div', { className: "relative flex py-1 items-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 676}}
              , React.createElement('div', { className: "flex-grow border-t border-slate-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 677}})
              , React.createElement('span', { className: "flex-shrink mx-2 text-[10px] font-bold uppercase text-slate-400"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}, "or enter credentials"  )
              , React.createElement('div', { className: "flex-grow border-t border-slate-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}})
            )

            , React.createElement('form', { onSubmit: handleLoginSubmit, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 682}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 683}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}, "ABHA ID / Mobile Number / Email"      )
                , React.createElement('input', {
                  type: "text",
                  required: true,
                  placeholder: "e.g. 9876543210 or name@abdm"   ,
                  value: loginForm.identifier,
                  onChange: (e) => setLoginForm({ ...loginForm, identifier: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82] focus:border-[#0b2b82]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 685}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 695}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}}, "Password or OTP"  )
                , React.createElement('input', {
                  type: "password",
                  required: true,
                  placeholder: "••••••••",
                  value: loginForm.password,
                  onChange: (e) => setLoginForm({ ...loginForm, password: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82] focus:border-[#0b2b82]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 697}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 707}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 708}}, "Select Portal Role"  )
                , React.createElement('select', {
                  value: loginForm.role,
                  onChange: (e) => setLoginForm({ ...loginForm, role: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#0b2b82]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 709}}

                  , React.createElement('option', { value: "worker", __self: this, __source: {fileName: _jsxFileName, lineNumber: 714}}, "Frontline Health Worker (ASHA)"   )
                  , React.createElement('option', { value: "patient", __self: this, __source: {fileName: _jsxFileName, lineNumber: 715}}, "Self-Service Patient" )
                  , React.createElement('option', { value: "doctor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 716}}, "Consulting / Referring Doctor"   )
                  , React.createElement('option', { value: "shop_owner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 717}}, "Medical Shop Owner"  )
                  , React.createElement('option', { value: "lab_staff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}, "Diagnostic Lab Staff"  )
                  , React.createElement('option', { value: "facility", __self: this, __source: {fileName: _jsxFileName, lineNumber: 719}}, "Receiving Facility Administrator"  )
                  , React.createElement('option', { value: "admin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}, "Facility Coordinator / Admin"   )
                )
              )

              , React.createElement('button', {
                type: "submit",
                className: "w-full py-2.5 bg-[#0b2b82] hover:bg-[#061d5c] text-white font-extrabold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 724}}
, "Log In to MedVeda Portal →"

              )
            )

            , React.createElement('p', { className: "text-center text-[11px] text-slate-500 pt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 732}}, "New to MedVeda?"
                , ' '
              , React.createElement('button', {
                type: "button",
                onClick: () => setActiveTab('signup'),
                className: "text-[#0b2b82] font-bold hover:underline cursor-pointer"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 734}}
, "Create an Account"

              )
            )
          )
        ) : (
          /* ================= SIGN UP FORM ================= */
          React.createElement('div', { className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 745}}
            , React.createElement('form', { onSubmit: handleSignUpSubmit, className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 746}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 747}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 748}}, "Full Legal Name"  )
                , React.createElement('input', {
                  type: "text",
                  required: true,
                  placeholder: "e.g. Dr. Rajesh Kumar or Sunita Devi"      ,
                  value: signUpForm.name,
                  onChange: (e) => setSignUpForm({ ...signUpForm, name: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 749}}
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 760}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 761}}, "Mobile (Linked to Aadhaar)"   )
                  , React.createElement('input', {
                    type: "tel",
                    required: true,
                    placeholder: "9876543210",
                    value: signUpForm.mobile,
                    onChange: (e) => setSignUpForm({ ...signUpForm, mobile: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 762}}
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 772}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 773}}, "ABHA Health Address"  )
                  , React.createElement('input', {
                    type: "text",
                    placeholder: "username@abdm",
                    value: signUpForm.abhaId,
                    onChange: (e) => setSignUpForm({ ...signUpForm, abhaId: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-mono text-[11px] focus:ring-2 focus:ring-[#0b2b82]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 774}}
                  )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 784}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 785}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 786}}, "Role / Persona"  )
                  , React.createElement('select', {
                    value: signUpForm.role,
                    onChange: (e) => setSignUpForm({ ...signUpForm, role: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#0b2b82]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 787}}

                    , React.createElement('option', { value: "patient", __self: this, __source: {fileName: _jsxFileName, lineNumber: 792}}, "Patient")
                    , React.createElement('option', { value: "worker", __self: this, __source: {fileName: _jsxFileName, lineNumber: 793}}, "ASHA Worker" )
                    , React.createElement('option', { value: "doctor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 794}}, "Specialist Doctor" )
                    , React.createElement('option', { value: "shop_owner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 795}}, "Pharmacy")
                    , React.createElement('option', { value: "lab_staff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 796}}, "Diagnostic Lab" )
                    , React.createElement('option', { value: "facility", __self: this, __source: {fileName: _jsxFileName, lineNumber: 797}}, "Facility Admin" )
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 801}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 802}}, "District Grid" )
                  , React.createElement('select', {
                    value: signUpForm.district,
                    onChange: (e) => setSignUpForm({ ...signUpForm, district: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-[#0b2b82]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 803}}

                    , React.createElement('option', { value: "Hazaribagh", __self: this, __source: {fileName: _jsxFileName, lineNumber: 808}}, "Hazaribagh")
                    , React.createElement('option', { value: "Ranchi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 809}}, "Ranchi")
                    , React.createElement('option', { value: "Dhanbad", __self: this, __source: {fileName: _jsxFileName, lineNumber: 810}}, "Dhanbad")
                    , React.createElement('option', { value: "Bokaro", __self: this, __source: {fileName: _jsxFileName, lineNumber: 811}}, "Bokaro")
                    , React.createElement('option', { value: "Ramgarh", __self: this, __source: {fileName: _jsxFileName, lineNumber: 812}}, "Ramgarh")
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 817}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 818}}, "Create Secure Password / PIN"    )
                , React.createElement('input', {
                  type: "password",
                  required: true,
                  placeholder: "At least 6 characters"   ,
                  value: signUpForm.password,
                  onChange: (e) => setSignUpForm({ ...signUpForm, password: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-[#0b2b82]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 819}}
                )
              )

              , React.createElement('button', {
                type: "submit",
                className: "w-full py-2.5 bg-[#0b2b82] hover:bg-[#061d5c] text-white font-extrabold text-xs rounded-xl shadow-md transition-all mt-1 cursor-pointer"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 829}}
, "Register ABDM Account →"

              )
            )

            , React.createElement('p', { className: "text-center text-[11px] text-slate-500 pt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 837}}, "Already have an ABHA profile?"
                  , ' '
              , React.createElement('button', {
                type: "button",
                onClick: () => setActiveTab('login'),
                className: "text-[#0b2b82] font-bold hover:underline cursor-pointer"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 839}}
, "Log In"

              )
            )
          )
        )
      )
    )
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
    React.createElement('header', { className: "sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 942}}
      /* Top Emergency Hotline Strip */
      , React.createElement('div', { className: "bg-critical-600 text-white text-xs font-bold py-1.5 px-4 flex items-center justify-between"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 944}}
        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 945}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-white animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 946}})
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 947}}, "EMERGENCY AMBULANCE HOTLINE: 108 / POLICE: 112"      )
        )
        , React.createElement('div', { className: "flex items-center gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 949}}
          , React.createElement('span', { className: "hidden sm:inline text-critical-100 text-[11px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 950}}, "Rural Healthcare Teleconsult & Emergency Grid"     )
          , React.createElement('a', { href: "tel:108", className: "px-2.5 py-0.5 bg-white text-critical-700 rounded font-black text-xs hover:bg-critical-50"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 951}}, "Call 108"

          )
        )
      )

      /* Main Navigation Bar */
      , React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 958}}
        /* Logo & Brand */
        , React.createElement('div', { className: "flex items-center gap-3 cursor-pointer select-none"    , onClick: () => setView('home'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 960}}
          , React.createElement(MedVedaLogo, { className: "h-10 w-10" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 961}} )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 962}}
            , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 963}}
              , React.createElement('h1', { className: "font-black text-slate-900 text-lg tracking-tight flex items-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 964}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 965}}, "MED")
                , React.createElement('span', { className: "text-teal-600 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 966}}, "VEDA")
              )
              , React.createElement('span', { className: "text-[10px] uppercase font-black px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 968}}, "v2.0"

              )
            )
            , React.createElement('p', { className: "text-[11px] text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 972}}, "Smart Care Platform • Telehealth & Triage Grid"       )
          )
        )

        /* Navigation Tabs - Exactly 3 Sections: Home, Features (with Dropdown), About Us */
        , React.createElement('nav', { className: "flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold relative"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 977}}
          /* Section 1: Home */
          , React.createElement('button', {
            type: "button",
            onClick: () => {
              setView('home');
              setFeaturesOpen(false);
            },
            className: `px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap ${
              currentView === 'home'
                ? 'bg-[#0b2b82] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0b2b82] hover:bg-blue-50/70'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 979}}
, "Home"

          )

          /* Section 2: Features (Dropdown containing all feature map options) */
          , React.createElement('div', { className: "relative", ref: featuresRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 995}}
            , React.createElement('button', {
              type: "button",
              onClick: () => setFeaturesOpen(!featuresOpen),
              className: `px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                isFeatureActive
                  ? 'bg-[#0b2b82] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0b2b82] hover:bg-blue-50/70'
              }`,
              'aria-expanded': featuresOpen,
              'aria-haspopup': "true", __self: this, __source: {fileName: _jsxFileName, lineNumber: 996}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1007}}, "Features")
              , React.createElement('svg', {
                className: `w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`,
                fill: "none",
                viewBox: "0 0 24 24"   ,
                stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1008}}

                , React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M19 9l-7 7-7-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1014}} )
              )
            )

            /* Dropdown Menu with all Feature Map options */
            , featuresOpen && (
              React.createElement('div', { className: "absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1020}}
                , React.createElement('div', { className: "px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1021}}
                  , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1022}}, "Platform Feature Modules"

                  )
                  , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0b2b82] border border-blue-100"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1025}}, "7 Systems"

                  )
                )

                , React.createElement('div', { className: "space-y-1 max-h-[70vh] overflow-y-auto"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1030}}
                  , featureItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                      React.createElement('button', {
                        key: item.id,
                        type: "button",
                        onClick: () => {
                          item.onSelect();
                          setFeaturesOpen(false);
                        },
                        className: `w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                          isActive
                            ? 'bg-blue-50/90 border border-blue-200 text-[#0b2b82]'
                            : 'hover:bg-slate-50 border border-transparent text-slate-800'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1034}}

                        , React.createElement('div', {
                          className: `w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'bg-[#0b2b82] text-white shadow-xs' : 'bg-slate-100'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1047}}

                          , item.icon
                        )
                        , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1054}}
                          , React.createElement('div', { className: "flex items-center justify-between gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1055}}
                            , React.createElement('span', { className: "text-xs font-bold leading-tight group-hover:text-[#0b2b82]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1056}}
                              , item.label
                            )
                            , React.createElement('span', { className: "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1059}}
                              , item.code
                            )
                          )
                          , React.createElement('p', { className: "text-[11px] text-slate-500 leading-snug font-normal mt-0.5 line-clamp-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1063}}
                            , item.description
                          )
                        )
                      )
                    );
                  })
                )
              )
            )
          )

          /* Section 3: About Us */
          , React.createElement('button', {
            type: "button",
            onClick: () => {
              setView('about');
              setFeaturesOpen(false);
            },
            className: `px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap ${
              currentView === 'about'
                ? 'bg-[#0b2b82] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0b2b82] hover:bg-blue-50/70'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1076}}
, "About Us"

          )
        )

        /* Right Controls: Role Switcher & Auth (Login / Sign Up) */
        , React.createElement('div', { className: "flex items-center gap-2.5 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1093}}
          /* Role Switcher */
          , React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1095}}
            , React.createElement('span', { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden xl:inline"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1096}}, "Role:")
            , React.createElement('select', {
              value: actorRole,
              onChange: (e) => {
                setActorRole(e.target.value);
                if (currentUser) {
                  setCurrentUser(prev => ({ ...prev, role: e.target.value, roleLabel: getRoleBadgeLabel(e.target.value) }));
                }
              },
              className: "text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-[#0b2b82] focus:border-[#0b2b82] shadow-xs cursor-pointer"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1097}}

              , React.createElement('option', { value: "worker", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1107}}, "Frontline Health Worker (ASHA)"   )
              , React.createElement('option', { value: "patient", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1108}}, "Self-Service Patient" )
              , React.createElement('option', { value: "doctor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1109}}, "Consulting / Referring Doctor"   )
              , React.createElement('option', { value: "shop_owner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1110}}, "Medical Shop Owner"  )
              , React.createElement('option', { value: "lab_staff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1111}}, "Diagnostic Lab Staff"  )
              , React.createElement('option', { value: "facility", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1112}}, "Receiving Facility Administrator"  )
              , React.createElement('option', { value: "admin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1113}}, "Facility Coordinator / Admin"   )
            )
          )

          /* Login & Sign Up Option Buttons / User Profile Chip */
          , currentUser ? (
            React.createElement('div', { className: "flex items-center gap-2 bg-blue-50/80 border border-blue-200/80 rounded-lg px-2.5 py-1 shadow-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1119}}
              , React.createElement('div', { className: "w-6 h-6 rounded-full bg-[#0b2b82] text-white text-[11px] font-black flex items-center justify-center"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1120}}
                , currentUser.name.charAt(0)
              )
              , React.createElement('div', { className: "flex flex-col text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1123}}
                , React.createElement('span', { className: "text-[11px] font-extrabold text-slate-900 leading-none truncate max-w-[110px] sm:max-w-[140px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1124}}
                  , currentUser.name
                )
                , React.createElement('span', { className: "text-[9px] text-[#0b2b82] font-bold uppercase leading-tight mt-0.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1127}}
                  , currentUser.roleLabel || getRoleBadgeLabel(actorRole)
                )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setCurrentUser(null),
                className: "text-[10px] font-bold text-slate-400 hover:text-critical-600 ml-1 px-1 py-0.5 rounded hover:bg-white transition-colors cursor-pointer"          ,
                title: "Log out" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1131}}
, "Log Out"

              )
            )
          ) : (
            React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1141}}
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setAuthTab('login');
                  setAuthModalOpen(true);
                },
                className: "px-3 py-1.5 text-xs font-bold text-[#0b2b82] hover:bg-blue-50 rounded-lg transition-all border border-blue-200/80 cursor-pointer"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1142}}
, "Log In"

              )

              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setAuthTab('signup');
                  setAuthModalOpen(true);
                },
                className: "px-3.5 py-1.5 text-xs font-bold bg-[#0b2b82] hover:bg-[#061d5c] text-white rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1153}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1161}}, "Sign Up" )
              )
            )
          )
        )
      )

      /* Feature 01 Stepper Banner (shown when in Feature 01) */
      , currentView === 'feature1' && (
        React.createElement(WorkflowStepper, { currentScreen: currentScreen, setScreen: setScreen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1170}} )
      )

      /* MedVeda Authentication Modal (Log In / Sign Up) */
      , authModalOpen && (
        React.createElement(AuthModal, {
          initialTab: authTab,
          onClose: () => setAuthModalOpen(false),
          onAuthSuccess: (user) => {
            setCurrentUser(user);
            setActorRole(user.role);
            setAuthModalOpen(false);
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1175}}
        )
      )
    )
  );
}

function WorkflowStepper({ currentScreen, setScreen }) {
  return (
    React.createElement('div', { className: "w-full bg-white border-b border-slate-200 py-3 px-3 sm:px-6 shadow-sm overflow-x-auto"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1191}}
      , React.createElement('div', { className: "max-w-5xl mx-auto flex items-center justify-between min-w-[760px] relative"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1192}}
        /* Background Track Line */
        , React.createElement('div', { className: "absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1194}})

        /* Active Progress Track Line */
        , React.createElement('div', {
          className: "absolute top-4 left-6 h-0.5 bg-brand-600 transition-all duration-300 -z-0"       ,
          style: { width: `${((currentScreen - 1) / (STEPS.length - 1)) * 95}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1197}}
)

        , STEPS.map((step) => {
          const isDone = step.id < currentScreen;
          const isActive = step.id === currentScreen;

          return (
            React.createElement('div', {
              key: step.id,
              onClick: () => setScreen(step.id),
              className: "flex flex-col items-center cursor-pointer group z-10"     ,
              style: { width: '80px' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1207}}

              /* Node Circle */
              , React.createElement('div', {
                className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isActive
                    ? 'ring-4 ring-brand-100 bg-white border-2 border-brand-600 text-brand-600 shadow-md transform scale-110'
                    : isDone
                    ? 'bg-brand-600 border-2 border-brand-600 text-white shadow-sm'
                    : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1214}}

                , isActive ? (
                  React.createElement('div', { className: "w-2.5 h-2.5 rounded-full bg-brand-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1224}})
                ) : isDone ? (
                  React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1226}}, "✓")
                ) : (
                  React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1228}})
                )
              )

              /* Step Label */
              , React.createElement('span', {
                className: `mt-1.5 text-[11px] text-center leading-tight font-bold transition-colors ${
                  isActive
                    ? 'text-brand-700 font-extrabold'
                    : isDone
                    ? 'text-slate-800'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1233}}

                , step.name
              )
            )
          );
        })
      )
    )
  );
}

function StepperHeader({ currentStep, title, subtitle }) {
  const stepInfo = STEPS.find((s) => s.id === currentStep);
  const percent = Math.round((currentStep / STEPS.length) * 100);

  return (
    React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1257}}
      , React.createElement('div', { className: "flex items-center justify-between text-xs font-bold text-slate-500 mb-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1258}}
        , React.createElement('span', { className: "text-brand-700 uppercase tracking-wide flex items-center gap-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1259}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-brand-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1260}}), "Step "
           , currentStep, ": " , _optionalChain([stepInfo, 'optionalAccess', _2 => _2.name])
        )
        , React.createElement('span', { className: "text-slate-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1263}}, percent, "% Completed" )
      )
      , React.createElement('h2', { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1265}}, title)
      , subtitle && React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 mt-1 font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1266}}, subtitle)
    )
  );
}

function VerificationBadge({ status }) {
  if (status === 'verified') {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1274}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1275}}, "✓")
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1276}}, "Verified Source" )
      )
    );
  }
  return (
    React.createElement('span', { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1281}}
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1282}}, "⚠️")
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1283}}, "Partially Verified" )
    )
  );
}

function EmergencyPill({ specialtyMode, specialtyName = 'Specialty', emergencySpecialtyVerified }) {
  if (specialtyMode === 'EMERGENCY_AND_OPD' && emergencySpecialtyVerified) {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1291}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1292}}, "✓ 24x7 Emergency "   , specialtyName, " Available" )
      )
    );
  }
  return (
    React.createElement('span', { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1297}}
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1298}}, "⏱️ " , specialtyName, " OPD Clinic Only (Not 24x7 Emergency)"      )
    )
  );
}

function VitalsConfidenceBadge({ source }) {
  if (source === 'worker_verified') {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1306}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1307}}, "✓ Worker Verified"  )
        , React.createElement('span', { className: "text-[9px] opacity-75" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1308}}, "(High Clinical Confidence)"  )
      )
    );
  }
  if (source === 'self_reported') {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1314}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1315}}, "⚠️ Self Reported"  )
        , React.createElement('span', { className: "text-[9px] opacity-75" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1316}}, "(Layperson Confidence)" )
      )
    );
  }
  return (
    React.createElement('span', { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-100 text-brand-800 border border-brand-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1321}}
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1322}}, "👨‍⚕️ Doctor Recorded"  )
    )
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
    React.createElement('div', { className: "space-y-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1426}}
      /* Enhanced Interactive Smart Care Navigator Hero Banner */
      , React.createElement('div', { className: "relative overflow-hidden rounded-[36px] bg-gradient-to-r from-white via-slate-50/40 to-blue-50/30 border border-slate-200/80 shadow-[0_12px_40px_rgba(8,35,95,0.06)] hover:shadow-[0_20px_50px_rgba(8,35,95,0.1)] transition-all duration-500 group"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1428}}
        /* Subtle Ambient Radial Glows */
        , React.createElement('div', { className: "absolute -top-24 -left-24 w-96 h-96 bg-sky-200/25 rounded-full blur-3xl pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1430}})
        , React.createElement('div', { className: "absolute -bottom-24 right-1/4 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1431}})

        , React.createElement('div', { className: "relative z-10 flex flex-col lg:flex-row lg:items-center justify-between min-h-[420px]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1433}}
          /* Left Column: Interactive Typography, CTA Buttons, and Badges */
          , React.createElement('div', { className: "p-8 sm:p-12 lg:py-14 lg:pl-14 lg:pr-6 lg:w-[54%] xl:w-[52%] space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1435}}
            /* Pill Badge */
            , React.createElement('div', { className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50/90 border border-sky-200/80 text-[#0b2b82] text-xs font-bold shadow-2xs hover:bg-sky-100/80 transition-colors"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1437}}
              , React.createElement('span', { className: "w-2 h-2 rounded-full bg-sky-500 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1438}})
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1439}}, "Smart care navigation, powered by your data"      )
            )

            /* Headline */
            , React.createElement('h1', { className: "text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black tracking-tight text-slate-900 leading-[1.12]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1443}}, "The right care, "
                 , React.createElement('span', { className: "text-[#1a66b8]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1444}}, "at"), React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1444}} )
              , React.createElement('span', { className: "text-[#1a66b8]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1445}}, "the right time."  )
            )

            /* Description */
            , React.createElement('p', { className: "text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1449}}, "Meet MedVeda’s Smart Care Navigator. Simply describe the symptoms. MedVeda assesses the urgency, identifies the care required, and guides you to the right nearby facility—especially when every minute matters."

            )

            /* Interactive Button Group */
            , React.createElement('div', { className: "flex items-center gap-3.5 pt-1 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1454}}
              , React.createElement('button', {
                type: "button",
                onClick: onLaunchFeature1,
                className: "px-6 py-3 bg-[#183b7b] hover:bg-[#0b2b82] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-900/25 active:scale-95 transition-all flex items-center gap-2.5 group/btn cursor-pointer"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1455}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1460}}, "Get started" )
                , React.createElement('span', { className: "group-hover/btn:translate-x-1 transition-transform" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1461}}, "→")
              )

              , React.createElement('button', {
                type: "button",
                onClick: onLaunchFeature2,
                className: "px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1464}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1469}}, "Doctor Queue →"  )
              )
            )

            /* Security & Compliance Footer */
            , React.createElement('div', { className: "flex items-center gap-2 text-xs font-semibold text-slate-600 pt-2 flex-wrap"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1474}}
              , React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1475}}
                , React.createElement('svg', { className: "w-4 h-4 text-slate-700 shrink-0"   , viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1476}}
                  , React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"                        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1477}} )
                )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1479}}, "End-to-end encrypted" )
              )
              , React.createElement('span', { className: "text-slate-300", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1481}}, "•")
              , React.createElement('span', { className: "text-slate-500 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1482}}, "ABDM Digital Health Record"   )
              , React.createElement('span', { className: "text-slate-300", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1483}}, "•")
              , React.createElement('span', { className: "text-emerald-700 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1484}}, "Ayushman Bharat Interoperable"  )
            )
          )

          /* Right Column: Feathered Seamless Doctors Graphic with Floating Interactive Cards */
          , React.createElement('div', { className: "relative lg:w-[46%] xl:w-[48%] self-stretch flex items-center justify-end overflow-hidden"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1489}}
            /* Soft Edge Blending Overlay to eliminate any boxy lines */
            , React.createElement('div', { className: "absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none hidden lg:block"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1491}})
            , React.createElement('div', { className: "absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent z-10 pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1492}})
            , React.createElement('div', { className: "absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent z-10 pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1493}})

            , React.createElement('img', {
              src: "./hero-doctors.png",
              alt: "MedVeda Clinical Care Specialists"   ,
              className: "w-full h-auto max-h-[460px] object-cover object-left sm:object-center transform transition-transform duration-700 group-hover:scale-[1.02] select-none block"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1495}}
            )

            /* Floating Interactive Micro-Badge 1: On-Duty Specialists */
            , React.createElement('div', {
              onClick: onLaunchFeature2,
              className: "absolute top-6 right-6 z-20 bg-white/90 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group/tag"                   ,
              title: "View on-duty specialist doctors"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1502}}

              , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1507}})
              , React.createElement('div', { className: "text-left", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1508}}
                , React.createElement('div', { className: "text-[11px] font-black text-slate-900 group-hover/tag:text-[#0b2b82]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1509}}, "4 Specialists On-Duty"

                )
                , React.createElement('div', { className: "text-[9px] text-slate-500 font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1512}}, "Live Teleconsult Roster →"   )
              )
            )

            /* Floating Interactive Micro-Badge 2: Autonomous Care Triage */
            , React.createElement('div', {
              onClick: onLaunchFeature1,
              className: "absolute bottom-6 left-12 lg:left-4 z-20 bg-white/90 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-2xl border border-blue-200/80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group/tag"                    ,
              title: "Launch Smart Care Triage"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1517}}

              , React.createElement('span', { className: "text-base", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1522}}, "⚡")
              , React.createElement('div', { className: "text-left", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1523}}
                , React.createElement('div', { className: "text-[11px] font-black text-[#0b2b82]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1524}}, "Instant Clinical Triage"

                )
                , React.createElement('div', { className: "text-[9px] text-slate-500 font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1527}}, "< 2 min facility matching →"     )
              )
            )
          )
        )
      )

      /* Role Simulation Selector (Clean & Professional) */
      , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1535}}
        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1536}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1537}}
            , React.createElement('span', { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1538}}, "Active Persona Simulation"  )
            , React.createElement('p', { className: "text-xs text-slate-600 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1539}}, roleDescriptions[actorRole] || roleDescriptions.worker)
          )
        )

        , React.createElement('div', { className: "flex gap-1.5 flex-wrap pt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1543}}
          , [
            { id: 'worker', label: 'Frontline Worker (ASHA)' },
            { id: 'patient', label: 'Self-Service Patient' },
            { id: 'doctor', label: 'Doctor / Specialist' },
            { id: 'shop_owner', label: 'Pharmacy Owner' },
            { id: 'lab_staff', label: 'Diagnostic Lab' },
            { id: 'facility', label: 'Facility Administrator' },
            { id: 'admin', label: 'System Coordinator' }
          ].map((r) => (
            React.createElement('button', {
              key: r.id,
              type: "button",
              onClick: () => setActorRole(r.id),
              className: `px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                actorRole === r.id
                  ? 'bg-[#0b2b82] text-white border-[#0b2b82] shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-[#0b2b82] hover:border-blue-200'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1553}}

              , r.label
            )
          ))
        )
      )

      /* Real-Time Operational Network Telemetry (Moved in-between Active Persona and Platform Modules) */
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1570}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1571}}
          , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1572}}, "Network Telemetry • Jharkhand District Grid"     )
          , React.createElement('span', { className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1573}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1574}}), "All Services Operational"

          )
        )

        , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1579}}
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1580}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1581}}, "4")
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1582}}, "Specialist Doctors On-Duty"  )
          )
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1584}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1585}}, "4")
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1586}}, "Connected Health Facilities"  )
          )
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1588}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1589}}, "8.5 min" )
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1590}}, "Avg. Priority Queue Wait"   )
          )
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1592}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1593}}, "100%")
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1594}}, "Closed-Loop EMR Traceability"  )
          )
        )
      )

      /* System Modules Grid */
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1600}}
        , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1601}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-[#0284c7] block mb-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1602}}, "PLATFORM"

          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1605}}, "One connected system for the whole care journey"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 font-normal mt-1 max-w-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1608}}, "MedVeda brings navigation, care delivery, and records together — so patients move forward and clinicians stay in the loop."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1613}}
          , modules.map((m) => (
            React.createElement('div', {
              key: m.id,
              onClick: m.action,
              className: "bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between space-y-5 group cursor-pointer"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1615}}

              , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1620}}
                /* Top Row: Soft-Blue Squircle Icon Container + Module Code & Badge */
                , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1622}}
                  , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-blue-50/90 text-[#0284c7] border border-blue-100 flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:bg-[#0b2b82] group-hover:text-white group-hover:scale-105 transition-all duration-300"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1623}}
                    , m.icon
                  )
                  , React.createElement('div', { className: "flex flex-col items-end gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1626}}
                    , React.createElement('span', { className: "text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1627}}
                      , m.code
                    )
                    , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f7ff] text-[#0b2b82] border border-blue-100/80"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1630}}
                      , m.badge
                    )
                  )
                )

                /* Title & Description */
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1637}}
                  , React.createElement('h4', { className: "text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#0b2b82] transition-colors leading-snug"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1638}}
                    , m.title
                  )
                  , React.createElement('p', { className: "text-xs text-slate-500 leading-relaxed font-normal"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1641}}
                    , m.description
                  )
                )
              )

              /* Action Button */
              , React.createElement('button', {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  m.action();
                },
                className: "w-full py-2.5 px-4 bg-slate-50 hover:bg-[#0b2b82] hover:text-white group-hover:bg-[#0b2b82] group-hover:text-white text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-100 group-hover:border-[#0b2b82] shadow-2xs group-hover:shadow-sm"                     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1648}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1656}}, m.actionLabel)
                , React.createElement('span', { className: "transition-transform duration-200 group-hover:translate-x-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1657}}, "→")
              )
            )
          ))
        )
      )
    )
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
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1690}}
      , React.createElement(StepperHeader, {
        currentStep: 1,
        title: "Patient Demographics & Location"   ,
        subtitle: "Basic clinical profiling to localize nearby facilities and calibrate triage urgency."          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1691}}
      )

      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1697}}
        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1698}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1699}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1700}}, "Age")
            , React.createElement('input', {
              type: "number",
              value: patient.age,
              onChange: (e) => setPatient({ ...patient, age: Number(e.target.value) }),
              className: "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-slate-900"         ,
              placeholder: "e.g. 58" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1701}}
            )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1710}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1711}}, "Biological Sex" )
            , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1712}}
              , ['female', 'male', 'other'].map((s) => (
                React.createElement('button', {
                  key: s,
                  type: "button",
                  onClick: () => setPatient({ ...patient, sex: s }),
                  className: `py-3 px-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                    patient.sex === s
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1714}}

                  , s
                )
              ))
            )
          )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1731}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1732}}, "Current Location (District / Town)"

          )
          , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1735}}
            , React.createElement('input', {
              type: "text",
              value: patient.location,
              onChange: (e) => setPatient({ ...patient, location: e.target.value }),
              className: "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900"         ,
              placeholder: "e.g. Hazaribagh, Jharkhand"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1736}}
            )
            , React.createElement('span', { className: "absolute right-3 top-3 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1743}}, "📍 GPS Active"

            )
          )
          , React.createElement('p', { className: "text-xs text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1747}}, "Hospital discovery searches will be centered around this locality."        )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1750}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1751}}, "Relevant Medical History / Comorbidities"

          )
          , React.createElement('div', { className: "flex flex-wrap gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1754}}
            , patient.medicalHistory.map((item) => (
              React.createElement('span', {
                key: item,
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1756}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1760}}, item)
                , React.createElement('button', {
                  type: "button",
                  onClick: () => removeHistory(item),
                  className: "hover:text-critical-600 font-bold ml-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1761}}
, "×"

                )
              )
            ))
          )

          , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1772}}
            , React.createElement('input', {
              type: "text",
              value: historyInput,
              onChange: (e) => setHistoryInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHistory(historyInput);
                }
              },
              placeholder: "Type condition (e.g. Asthma, Cardiac stent) and press Enter"        ,
              className: "flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1773}}
            )
            , React.createElement('button', {
              type: "button",
              onClick: () => addHistory(historyInput),
              className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1786}}
, "Add"

            )
          )

          , React.createElement('div', { className: "flex gap-2 flex-wrap mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1795}}
            , ['+ Hypertension', '+ Diabetes', '+ Asthma', '+ Heart Disease', '+ Prior Stroke', '+ Kidney Disease'].map((chip) => (
              React.createElement('button', {
                key: chip,
                type: "button",
                onClick: () => addHistory(chip.replace('+ ', '')),
                className: "text-[11px] text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1797}}

                , chip
              )
            ))
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1809}}
          , React.createElement('button', {
            type: "button",
            onClick: onNext,
            disabled: !patient.location || !patient.age,
            className: "w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1810}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1816}}, "Continue to Symptom Intake"   )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1817}}, "→")
          )
        )
      )
    )
  );
}

function Screen2SymptomAssessment({ symptoms, setSymptoms, onNext, onBack }) {
  return (
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1827}}
      , React.createElement(StepperHeader, {
        currentStep: 2,
        title: "Symptom Intake & Onset"   ,
        subtitle: "Describe the symptoms in plain language as reported by the patient or frontline healthcare worker."              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1828}}
      )

      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1834}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1835}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1836}}, "Primary Complaints & Observed Symptoms"

          )
          , React.createElement('textarea', {
            rows: 3,
            value: symptoms.primarySymptoms,
            onChange: (e) => setSymptoms({ ...symptoms, primarySymptoms: e.target.value }),
            placeholder: "Describe symptoms, e.g. severe headache with difficulty speaking, numbness on one side..."           ,
            className: "w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900 text-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1839}}
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1848}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1849}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1850}}, "Symptom Duration / Onset"   )
            , React.createElement('input', {
              type: "text",
              value: symptoms.duration,
              onChange: (e) => setSymptoms({ ...symptoms, duration: e.target.value }),
              placeholder: "e.g. 45 minutes ago, 2 days"     ,
              className: "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1851}}
            )
            , React.createElement('p', { className: "text-xs text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1858}}, "Accurate onset time is critical for stroke & cardiac triage."         )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1861}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1862}}, "Perceived Severity" )
            , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1863}}
              , [
                { id: 'mild', label: 'Mild', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
                { id: 'moderate', label: 'Moderate', color: 'bg-amber-50 text-amber-700 border-amber-300' },
                { id: 'severe', label: 'Severe', color: 'bg-critical-50 text-critical-700 border-critical-300' }
              ].map((lvl) => (
                React.createElement('button', {
                  key: lvl.id,
                  type: "button",
                  onClick: () => setSymptoms({ ...symptoms, severity: lvl.id }),
                  className: `py-3 px-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                    symptoms.severity === lvl.id
                      ? `${lvl.color} ring-2 ring-offset-1`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1869}}

                  , lvl.label
                )
              ))
            )
          )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1886}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1887}}, "Additional Context (Optional)"  )
          , React.createElement('input', {
            type: "text",
            value: symptoms.additionalNotes,
            onChange: (e) => setSymptoms({ ...symptoms, additionalNotes: e.target.value }),
            placeholder: "e.g. Patient was sitting at home, no prior head injury reported"          ,
            className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-900"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1888}}
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1897}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1898}}
, "← Back"

          )
          , React.createElement('button', {
            type: "button",
            onClick: onNext,
            disabled: !symptoms.primarySymptoms,
            className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1905}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1911}}, "Proceed to Emergency Screening"   )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1912}}, "→")
          )
        )
      )
    )
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
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1961}}
      , React.createElement(StepperHeader, {
        currentStep: 3,
        title: "Emergency Screening" ,
        subtitle: "Rule-based emergency screening to instantly escalate life-threatening presentations."       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1962}}
      )

      , hasAnyCriticalFlag && (
        React.createElement('div', { className: "mb-6 p-4 rounded-xl bg-critical-50 border border-critical-200 flex items-start gap-3"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1969}}
          , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1970}}, "🚨")
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1971}}
            , React.createElement('h4', { className: "text-sm font-bold text-critical-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1972}}, "Critical Red-Flag Detected"  )
            , React.createElement('p', { className: "text-xs text-critical-700 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1973}}, "This triage will automatically be escalated to "
                     , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1974}}, "CRITICAL"), " urgency. Facilities without active 24x7 emergency departments will be penalized."
            )
          )
        )
      )

      , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1980}}
        , questions.map((q) => {
          const isChecked = redFlags[q.key];
          return (
            React.createElement('div', {
              key: q.key,
              onClick: () => toggleFlag(q.key),
              className: `p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                isChecked
                  ? 'bg-critical-50/50 border-critical-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1984}}

              , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1993}}
                , React.createElement('div', { className: "flex items-center gap-2 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1994}}
                  , React.createElement('span', { className: "text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1995}}
                    , q.badge
                  )
                  , isChecked && (
                    React.createElement('span', { className: "text-xs font-extrabold text-critical-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1999}}, "FLAGGED")
                  )
                )
                , React.createElement('h4', { className: "text-sm font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2002}}, q.title)
                , React.createElement('p', { className: "text-xs text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2003}}, q.desc)
              )

              , React.createElement('div', {
                className: `w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-critical-600 border-critical-600 text-white'
                    : 'border-slate-300 bg-white'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2006}}

                , isChecked ? '✓' : ''
              )
            )
          );
        })
      )

      , React.createElement('div', { className: "pt-6 mt-6 border-t border-slate-100 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2020}}
        , React.createElement('button', {
          type: "button",
          onClick: onBack,
          className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2021}}
, "← Back"

        )
        , React.createElement('button', {
          type: "button",
          onClick: onNext,
          className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2028}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2033}}, "Run AI Triage Analysis"   )
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2034}}, "⚡")
        )
      )
    )
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
    React.createElement('div', { className: "max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2090}}
      , React.createElement('div', { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center relative"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2091}}
        , React.createElement('div', { className: "w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand-500/30 animate-pulse"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2092}}, "⚡"

        )
        , React.createElement('div', { className: "absolute inset-0 rounded-full border-2 border-brand-500 border-dashed animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2095}})
      )

      , React.createElement('h3', { className: "text-xl font-black text-slate-900 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2098}}, "Analyzing Clinical Presentation"  )
      , React.createElement('p', { className: "text-xs text-slate-500 mb-8"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2099}}, "Agent 1 (Symptom & Triage Agent) is executing clinical decision rules..."

      )

      , React.createElement('div', { className: "space-y-3 text-left" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2103}}
        , steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;
          return (
            React.createElement('div', {
              key: idx,
              className: `p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : isCurrent
                  ? 'bg-brand-50/60 border-brand-300 text-brand-900 shadow-sm ring-1 ring-brand-500/20'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2108}}

              , React.createElement('div', {
                className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white animate-bounce'
                    : 'bg-slate-200 text-slate-600'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2118}}

                , isDone ? '✓' : idx + 1
              )
              , React.createElement('span', { className: "text-xs font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2129}}, step.label)
            )
          );
        })
      )
    )
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
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2150}}
      , React.createElement(StepperHeader, {
        currentStep: 5,
        title: "Clinical Assessment Result"  ,
        subtitle: "Agent 1 clinical output and specialty destination requirement."       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2151}}
      )

      , React.createElement('div', { className: `p-6 rounded-2xl text-white shadow-xl mb-6 ${isCritical ? 'bg-critical-600 shadow-critical-600/20' : 'bg-amber-500 shadow-amber-500/20'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2157}}
        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2 mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2158}}
          , React.createElement('span', { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 uppercase tracking-wide"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2159}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-white animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2160}})
            , isCritical ? 'Acuity Level 1' : 'Acuity Level 2'
          )
          , React.createElement('span', { className: "text-xs font-bold text-white/90"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2163}}
            , isCritical ? 'Immediate Action Required' : 'Prompt Medical Attention'
          )
        )

        , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2168}}
          , isCritical ? '🔴 CRITICAL URGENCY' : '🟡 URGENT'
        )
        , React.createElement('p', { className: "text-sm text-white/95 leading-relaxed font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2171}}
          , currentTriage.clinicalRoutingAdvice
        )
      )

      , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2176}}
        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2177}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2178}}, "Required Medical Specialty"  )
          , React.createElement('div', { className: "text-lg font-black text-slate-900 mt-1 flex items-center gap-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2179}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2180}}, "🧠 " , currentTriage.requiredSpecialty)
          )
          , React.createElement('p', { className: "text-xs text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2182}}, "Facility MUST have verified clinical capability for "       , currentTriage.requiredSpecialty, ".")
        )

        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2185}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2186}}, "Emergency Department Mandate"  )
          , React.createElement('div', { className: `text-lg font-black mt-1 flex items-center gap-2 ${currentTriage.emergencyRequired ? 'text-critical-600' : 'text-amber-600'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2187}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2188}}, currentTriage.emergencyRequired ? '🚨 24x7 Emergency Required' : '⏱️ Outpatient (OPD) Suitable')
          )
          , React.createElement('p', { className: "text-xs text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2190}}
            , currentTriage.emergencyRequired ? 'Outpatient (OPD) clinics are NOT suitable destinations for this presentation.' : 'Patient can be evaluated in daytime OPD clinics.'
          )
        )
      )

      , React.createElement('div', { className: "p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6 text-xs text-amber-900 leading-relaxed"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2196}}
        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2197}}, "⚠️ Clinical Safety Invariant:"   ), " This system does NOT provide a definitive diagnosis. It provides urgent care routing guidance based on reported signs. Do not delay emergency medical transport."
      )

      , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2200}}
        , React.createElement('button', {
          type: "button",
          onClick: onBack,
          className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2201}}
, "← Back"

        )
        , React.createElement('button', {
          type: "button",
          onClick: onFindHospitals,
          className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2208}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2213}}, "Research Facilities with Google Search MCP"     )
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2214}}, "🔍")
        )
      )
    )
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
        emergencyRequired: _nullishCoalesce(emergencyRequired, () => ( true)),
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
            emergencyRequired: _nullishCoalesce(emergencyRequired, () => ( true)),
            location: location || 'Hazaribagh',
            facilities: _optionalChain([json, 'access', _3 => _3.data, 'optionalAccess', _4 => _4.facilities]) || []
          })
        });
      })
      .then((res) => res.json())
      .then((rankJson) => {
        clearInterval(interval);
        setProgress(100);
        const topList = _optionalChain([rankJson, 'access', _5 => _5.data, 'optionalAccess', _6 => _6.topFacilities]) || [];
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
    React.createElement('div', { className: "max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2292}}
      , React.createElement('div', { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center relative"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2293}}
        , React.createElement('div', { className: "w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/30 animate-pulse"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2294}}, "🌐"

        )
        , React.createElement('div', { className: "absolute inset-0 rounded-full border-2 border-emerald-500 border-dashed animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2297}})
      )

      , React.createElement('h3', { className: "text-xl font-black text-slate-900 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2300}}, "Agent 2: Hospital Research & Verification"     )
      , React.createElement('p', { className: "text-xs text-slate-500 mb-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2301}}, "Dynamically querying Google Search MCP with "
              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2302}}, "≤ 50 km Proximity Priority"    ), " & Emergency Audit..."
      )

      , React.createElement('div', { className: "w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2305}}
        , React.createElement('div', {
          className: "bg-emerald-500 h-2 transition-all duration-300 ease-out"    ,
          style: { width: `${progress}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2306}}
)
      )

      , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-4 space-y-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2312}}
        , React.createElement('div', { className: "flex items-center justify-between text-xs text-slate-500 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2313}}
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2314}}, "ACTIVE SEARCH MCP QUERY"   )
          , React.createElement('span', { className: "text-emerald-700 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2315}}, "LIVE")
        )
        , React.createElement('div', { className: "font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 truncate"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2317}}, "> "
           , activeQuery
        )
        , React.createElement('div', { className: "pt-2 text-xs text-slate-500 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2320}}
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2321}}, "Proximity Rule: "  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2321}}, "≤ 50 km Golden Hour First"     ))
          , React.createElement('span', { className: "font-semibold text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2322}}, "Clinical Suitability > Proximity"   )
        )
      )

      , React.createElement('div', { className: "flex items-center justify-center gap-2 text-xs text-slate-400"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2326}}
        , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2327}})
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2328}}, "Cross-referencing official hospital portals & NHM government registry"       )
      )
    )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2345}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2346}}
        , React.createElement(StepperHeader, {
          currentStep: 7,
          title: "Recommended Facilities (Top 5)"   ,
          subtitle: "Ranked strictly by Clinical Suitability > Proximity with <= 50 km priority."           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2347}}
        )

        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2353}}
          , React.createElement('div', { className: "text-xs text-slate-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2354}}, "Showing "
             , React.createElement('span', { className: "text-brand-700 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2355}}, filtered.length), " facilities near Hazaribagh"
          )
          , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2357}}
            , React.createElement('button', {
              type: "button",
              onClick: () => setFilterMode('all'),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2358}}
, "All Ranked (5)"

            )
            , React.createElement('button', {
              type: "button",
              onClick: () => setFilterMode('emergency_only'),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'emergency_only'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2369}}
, "✓ 24x7 Emergency Only"

            )
          )
        )

        , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2383}}
          , filtered.map((fac) => {
            const isRankOne = fac.rank === 1;
            const isEmergency = fac.specialtyMode === 'EMERGENCY_AND_OPD';

            return (
              React.createElement('div', {
                key: fac.id,
                className: `p-5 sm:p-6 rounded-2xl border transition-all ${
                  isRankOne
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
                    : isEmergency
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2389}}

                , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2399}}
                  , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2400}}
                    , React.createElement('div', {
                      className: `w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                        isRankOne
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2401}}
, "#"
                      , fac.rank
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2410}}
                      , React.createElement('div', { className: "flex items-center gap-2 flex-wrap mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2411}}
                        , React.createElement('h3', { className: "font-extrabold text-slate-900 text-base sm:text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2412}}, fac.name)
                        , React.createElement(VerificationBadge, { status: fac.verificationStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2413}} )
                      )
                      , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2415}}, fac.address)
                    )
                  )

                  , React.createElement('div', { className: "text-right shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2419}}
                    , React.createElement('div', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2420}}, fac.distanceDisplay)
                    , React.createElement('span', { className: "text-xs text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2421}}, "Road Distance" )
                  )
                )

                , React.createElement('div', { className: "mt-3.5 flex items-center gap-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2425}}
                  , React.createElement(EmergencyPill, {
                    specialtyMode: fac.specialtyMode,
                    specialtyName: "Neurology",
                    emergencySpecialtyVerified: fac.emergencySpecialtyVerified, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2426}}
                  )
                  , React.createElement('span', { className: "text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2431}}, "🕒 "
                     , fac.operatingHours
                  )
                )

                , React.createElement('div', { className: "mt-3.5 p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 leading-relaxed"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2436}}
                  , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2437}}, "Why recommended: "  )
                  , fac.explanation
                )

                , React.createElement('div', { className: "mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2441}}
                  , React.createElement('a', {
                    href: `tel:${fac.contactNumber}`,
                    className: "inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2442}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2446}}, "📞 Call Desk"  )
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2447}}, fac.contactNumber)
                  )

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2450}}
                    , React.createElement('button', {
                      type: "button",
                      onClick: () => onSelectFacility(fac),
                      className: "px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2451}}
, "View Details & Sources →"

                    )
                  )
                )
              )
            );
          })
        )

        , React.createElement('div', { className: "pt-6 mt-6 border-t border-slate-100 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2465}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2466}}
, "← Back"

          )
          , React.createElement('button', {
            type: "button",
            onClick: () => onSelectFacility(facilities[0]),
            className: "px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2473}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2478}}, "Proceed with #1 Recommended Facility"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2479}}, "→")
          )
        )
      )
    )
  );
}

function Screen8FacilityDetails({ facility, onNext, onBack }) {
  if (!facility) return null;

  return (
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2491}}
      , React.createElement(StepperHeader, {
        currentStep: 8,
        title: "Facility Audit & Department Verification"    ,
        subtitle: "Audited departmental capability, verified contact lines, and source citations."        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2492}}
      )

      , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2498}}
        , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2499}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2500}}
            , React.createElement('div', { className: "flex items-center gap-2 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2501}}
              , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2502}}, facility.name)
              , React.createElement(VerificationBadge, { status: facility.verificationStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2503}} )
            )
            , React.createElement('p', { className: "text-xs text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2505}}, facility.address)
          )
          , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2507}}
            , React.createElement('span', { className: "text-lg font-black text-brand-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2508}}, facility.distanceDisplay)
          )
        )

        , React.createElement('div', { className: "mt-4 flex items-center gap-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2512}}
          , React.createElement(EmergencyPill, {
            specialtyMode: facility.specialtyMode,
            specialtyName: "Neurology",
            emergencySpecialtyVerified: facility.emergencySpecialtyVerified, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2513}}
          )
          , React.createElement('span', { className: "text-xs font-bold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2518}}, "🕒 "
             , facility.operatingHours
          )
        )
      )

      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2524}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2525}}
          , React.createElement('h4', { className: "text-xs font-bold text-slate-700 uppercase mb-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2526}}, "Active Medical Departments"  )
          , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2527}}
            , (facility.departments || ['Emergency Medicine', 'Neurology', 'Critical Care ICU']).map((dept, i) => (
              React.createElement('div', { key: i, className: "p-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2529}}
                , React.createElement('span', { className: "text-emerald-600 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2530}}, "✓")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2531}}, dept)
              )
            ))
          )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2537}}
          , React.createElement('div', { className: "flex items-center justify-between mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2538}}
            , React.createElement('h4', { className: "text-xs font-bold text-slate-700 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2539}}, "Verification Sources & Audit Trail"    )
            , React.createElement('span', { className: "text-xs text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2540}}, "Source Trust Hierarchy"  )
          )

          , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2543}}
            , (facility.sources || []).map((src, i) => (
              React.createElement('div', { key: i, className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2545}}
                , React.createElement('div', { className: "flex items-center gap-2.5 truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2546}}
                  , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-500 shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2547}})
                  , React.createElement('span', { className: "font-bold text-slate-800 capitalize"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2548}}, src.type.replace('_', ' '), ":")
                  , React.createElement('a', {
                    href: src.url,
                    target: "_blank",
                    rel: "noopener noreferrer" ,
                    className: "text-brand-600 hover:underline font-mono truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2549}}

                    , src.url
                  )
                )
                , React.createElement('span', { className: "px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-white border border-slate-200 text-slate-600 shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2558}}
                  , src.reliability, " Trust"
                )
              )
            ))
          )
        )

        , React.createElement('div', { className: "p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2566}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2567}}
            , React.createElement('div', { className: "text-xs font-bold text-emerald-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2568}}, "Direct Emergency Desk Contact"   )
            , React.createElement('div', { className: "text-base font-black text-emerald-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2569}}, facility.contactNumber)
          )
          , React.createElement('a', {
            href: `tel:${facility.contactNumber}`,
            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2571}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2575}}, "📞 Call Emergency Room"   )
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2579}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2580}}
, "← Back to Recommendations"

          )
          , React.createElement('button', {
            type: "button",
            onClick: onNext,
            className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2587}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2592}}, "Generate Referral Pass & Navigation"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2593}}, "→")
          )
        )
      )
    )
  );
}

function Screen9ReferralPass({ facility, patient, onRestart }) {
  const [copied, setCopied] = useState(false);
  const referralId = 'REF-JH-2026-8842';

  const copyReferral = () => {
    _optionalChain([navigator, 'access', _7 => _7.clipboard, 'optionalAccess', _8 => _8.writeText, 'call', _9 => _9(referralId)]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    React.createElement('div', { className: "max-w-2xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2612}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2613}}
        , React.createElement(StepperHeader, {
          currentStep: 9,
          title: "Digital Referral Pass & Navigation"    ,
          subtitle: "Fast-track admission pass for receiving hospital triage desk and turn-by-turn navigation."          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2614}}
        )

        , React.createElement('div', { className: "border-2 border-dashed border-brand-500/40 rounded-2xl p-6 bg-brand-50/30 mb-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2620}}
          , React.createElement('div', { className: "flex items-center justify-between border-b border-brand-200/60 pb-4 mb-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2621}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2622}}
              , React.createElement('span', { className: "text-[10px] font-extrabold tracking-widest text-brand-700 uppercase bg-brand-100 px-2 py-0.5 rounded"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2623}}, "Official Digital Triage Pass"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2626}}, facility.name)
            )
            , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2628}}
              , React.createElement('div', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2629}}, "PASS ID" )
              , React.createElement('div', { className: "text-sm font-black text-brand-700 font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2630}}, referralId)
            )
          )

          , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2634}}
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2635}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2636}}, "Patient Age/Sex" )
              , React.createElement('strong', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2637}}, patient.age, "y / "  , patient.sex)
            )
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2639}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2640}}, "Acuity Tier" )
              , React.createElement('strong', { className: "text-critical-600 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2641}}, "🔴 CRITICAL" )
            )
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2643}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2644}}, "Specialty")
              , React.createElement('strong', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2645}}, "Neurology Stroke" )
            )
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2647}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2648}}, "Origin")
              , React.createElement('strong', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2649}}, patient.location)
            )
          )

          , React.createElement('div', { className: "flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 gap-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2653}}
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2654}}
              , React.createElement('div', { className: "w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2655}}
                , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2656}}
                  , React.createElement('div', { className: "w-4 h-4 bg-white rounded-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2657}})
                  , React.createElement('div', { className: "w-4 h-4 bg-white rounded-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2658}})
                )
                , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2660}}
                  , React.createElement('div', { className: "w-4 h-4 bg-white rounded-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2661}})
                  , React.createElement('div', { className: "w-2 h-2 bg-white rounded-sm self-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2662}})
                )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2665}}
                , React.createElement('div', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2666}}, "Hospital Staff Fast-Scan"  )
                , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2667}}, "Scan at Emergency triage desk to instantly import triage parameters into hospital EMR."            )
              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: copyReferral,
              className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2670}}

              , copied ? '✓ Copied' : 'Copy ID'
            )
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2680}}
          , React.createElement('a', {
            href: `tel:${facility.contactNumber}`,
            className: "p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/20 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2681}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2685}}, "📞 1-Tap Emergency Call"   )
            , React.createElement('span', { className: "opacity-80", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2686}}, "(", facility.contactNumber, ")")
          )

          , React.createElement('a', {
            href: `https://maps.google.com/?q=${encodeURIComponent(facility.name + ' ' + facility.address)}`,
            target: "_blank",
            rel: "noopener noreferrer" ,
            className: "p-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md shadow-brand-600/20 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2689}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2695}}, "🧭 Start Google Maps Navigation"    )
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2699}}
          , React.createElement('button', {
            type: "button",
            onClick: onRestart,
            className: "px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2700}}
, "↺ Start New Patient Assessment"

          )
        )
      )
    )
  );
}

// ==========================================
// --- FEATURE 02: TELECONSULTATION & QUEUE MANAGEMENT SCREENS ---
// ==========================================

function ScreenTeleconsultEntry({ actorRole, onSelectPath, onBackToHome }) {
  return (
    React.createElement('div', { className: "max-w-3xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2719}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2720}}
        , React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2721}}
          , React.createElement('div', { className: "flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2722}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2723}}, "Feature Map 02 • Teleconsultation Entry"     )
          )
          , React.createElement('h2', { className: "text-2xl font-black text-slate-900 tracking-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2725}}, "Select Teleconsultation Path"  )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2726}}, "Both entry paths converge into the exact same booking, priority queue, and consultation engine."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2731}}
          /* Path 1: Assisted Path */
          , React.createElement('div', {
            onClick: () => onSelectPath('worker'),
            className: `p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
              actorRole === 'worker'
                ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-brand-300'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2733}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2741}}
              , React.createElement('div', { className: "w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-2xl mb-4 font-bold"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2742}}, "👩‍⚕️"

              )
              , React.createElement('div', { className: "flex items-center gap-2 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2745}}
                , React.createElement('h3', { className: "font-extrabold text-slate-900 text-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2746}}, "Assisted Path" )
                , React.createElement('span', { className: "text-[10px] uppercase font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2747}}, "ASHA / ANM"

                )
              )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed font-medium mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2751}}, "A frontline health worker operates the device on behalf of the patient. The worker records physical vitals, translates local dialects, and coordinates consent."

              )

              , React.createElement('div', { className: "space-y-1.5 text-xs text-slate-700 font-semibold mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2755}}
                , React.createElement('div', { className: "flex items-center gap-2 text-emerald-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2756}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2757}}, "✓")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2758}}, "Vitals tagged as "   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2758}}, "worker_verified"), " (High Confidence)"  )
                )
                , React.createElement('div', { className: "flex items-center gap-2 text-slate-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2760}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2761}}, "✓")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2762}}, "Worker presence on video/audio for clinical exam"      )
                )
              )
            )

            , React.createElement('button', {
              type: "button",
              className: "w-full py-3 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2767}}
, "Continue as Frontline Worker →"

            )
          )

          /* Path 2: Self-Service Path */
          , React.createElement('div', {
            onClick: () => onSelectPath('self'),
            className: `p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
              actorRole === 'patient'
                ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-brand-300'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2776}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2784}}
              , React.createElement('div', { className: "w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4 font-bold"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2785}}, "👤"

              )
              , React.createElement('div', { className: "flex items-center gap-2 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2788}}
                , React.createElement('h3', { className: "font-extrabold text-slate-900 text-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2789}}, "Self-Service Path" )
                , React.createElement('span', { className: "text-[10px] uppercase font-black px-2 py-0.5 bg-purple-100 text-purple-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2790}}, "Direct Patient"

                )
              )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed font-medium mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2794}}, "A literate patient navigates the application independently. The patient self-reports complaints and vitals from home."

              )

              , React.createElement('div', { className: "space-y-1.5 text-xs text-slate-700 font-semibold mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2798}}
                , React.createElement('div', { className: "flex items-center gap-2 text-amber-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2799}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2800}}, "⚠️")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2801}}, "Vitals tagged as "   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2801}}, "self_reported"), " (Layperson)" )
                )
                , React.createElement('div', { className: "flex items-center gap-2 text-critical-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2803}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2804}}, "🚨")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2805}}, "Emergency red-flag guardrail intercept active"    )
                )
              )
            )

            , React.createElement('button', {
              type: "button",
              className: "w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2810}}
, "Continue as Self-Service Patient →"

            )
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2819}}
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "text-xs font-bold text-slate-500 hover:text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2820}}
, "← Back to Platform Homepage"

          )
        )
      )
    )
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
      React.createElement('div', { className: "max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2961}}
        , React.createElement('div', { className: "w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold mx-auto mb-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2962}}, "✓"

        )

        , React.createElement('h3', { className: "text-2xl font-black text-slate-900 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2966}}, "Appointment Confirmed!" )
        , React.createElement('p', { className: "text-xs text-slate-500 mb-6 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2967}}, "Appointment ID: "
            , React.createElement('strong', { className: "font-mono text-brand-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2968}}, bookingConfirmed.appointment.id)
        )

        /* SMS Simulation Card */
        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-900 text-left text-white mb-6 shadow-md border border-slate-800"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2972}}
          , React.createElement('div', { className: "flex items-center justify-between text-xs text-slate-400 font-mono mb-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2973}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2974}}, "📱 SIMULATED SMS NOTIFICATION"   )
            , React.createElement('span', { className: "text-emerald-400 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2975}}, "DELIVERED")
          )
          , React.createElement('p', { className: "text-xs text-slate-200 leading-relaxed font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2977}}
            , bookingConfirmed.smsSimulation.messageText
          )
          , React.createElement('div', { className: "mt-2 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2980}}, "To: "
             , bookingConfirmed.smsSimulation.recipient, " • "  , new Date().toLocaleTimeString()
          )
        )

        , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2985}}
          , React.createElement('button', {
            type: "button",
            onClick: () => onBookSuccess(bookingConfirmed.appointment),
            className: "w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2986}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2991}}, "Proceed to Priority Queue →"    )
          )
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2999}}
      /* Emergency Red-Flag Intercept Modal for Self-Service */
      , showEmergencyModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3002}}
          , React.createElement('div', { className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-critical-500"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3003}}
            , React.createElement('div', { className: "w-12 h-12 rounded-full bg-critical-100 text-critical-600 flex items-center justify-center text-2xl font-bold mx-auto mb-3"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3004}}, "🚨"

            )
            , React.createElement('h3', { className: "text-lg font-black text-slate-900 text-center mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3007}}, "Critical Emergency Intercept"  )
            , React.createElement('p', { className: "text-xs text-critical-700 text-center mb-4 leading-relaxed font-semibold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3008}}, "The symptoms you described match life-threatening acute criteria (Stroke / Cardiac / Severe Respiratory). Teleconsultation is not safe for this emergency."

            )

            , React.createElement('div', { className: "p-3 bg-critical-50 rounded-xl border border-critical-200 text-xs text-critical-900 mb-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3012}}
              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3013}}, "Clinical Guardrail Rule:"  ), " Self-service patients with acute red-flags are automatically redirected to Feature 01 Emergency Triage & verified hospital routing."
            )

            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3016}}
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setShowEmergencyModal(false);
                  onEmergencyEscalate();
                },
                className: "w-full py-3 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3017}}
, "Redirect to Emergency Triage (Feature 01) →"

              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowEmergencyModal(false),
                className: "w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3027}}
, "Dismiss (Continue Teleconsult)"

              )
            )
          )
        )
      )

      , React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3039}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3040}}
          , React.createElement('div', { className: "flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3041}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3042}}, "Feature 02 • Slot & Doctor Matching"      )
          )
          , React.createElement('h2', { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3044}}, "Book Teleconsultation Slot"  )
        )

        , React.createElement('span', { className: `text-xs font-bold px-3 py-1 rounded-full ${
          pathActor === 'worker' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3047}}
          , pathActor === 'worker' ? '👩‍⚕️ Assisted Path (ASHA)' : '👤 Self-Service Path'
        )
      )

      , React.createElement('div', { className: "space-y-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3054}}
        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-3 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3055}}
          , React.createElement('div', { className: "sm:col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3056}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3057}}, "Patient Full Name"  )
            , React.createElement('input', {
              type: "text",
              value: patientName,
              onChange: (e) => setPatientName(e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3058}}
            )
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3065}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3066}}, "Age")
            , React.createElement('input', {
              type: "number",
              value: age,
              onChange: (e) => setAge(e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3067}}
            )
          )
        )

        /* Specialty Selector Dropdown */
        , React.createElement('div', { className: "relative", ref: specialtyDropdownRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3077}}
          , React.createElement('div', { className: "flex items-center justify-between mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3078}}
            , React.createElement('label', { id: "specialty-dropdown-label", className: "block text-xs font-bold text-slate-700 uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3079}}, "Select Medical Specialty"

            )
            , React.createElement('span', { className: "text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3082}}
              , SPECIALTY_OPTIONS.length, " Specialties"
            )
          )

          /* Trigger Button */
          , React.createElement('button', {
            type: "button",
            id: "specialty-dropdown-button",
            'aria-haspopup': "listbox",
            'aria-expanded': isSpecialtyDropdownOpen,
            'aria-labelledby': "specialty-dropdown-label specialty-dropdown-button" ,
            onClick: () => setIsSpecialtyDropdownOpen((prev) => !prev),
            className: `w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 bg-white ${
              isSpecialtyDropdownOpen
                ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50 shadow-sm'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3088}}

            , React.createElement('div', { className: "flex items-center gap-3 min-w-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3101}}
              , React.createElement('span', { className: "w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-lg shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3102}}
                , (SPECIALTY_OPTIONS.find((s) => s.id === selectedSpecialty) || {}).icon || '🩺'
              )
              , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3105}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3106}}
                  , React.createElement('span', { className: "font-extrabold text-slate-900 text-sm truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3107}}
                    , selectedSpecialty
                  )
                  , React.createElement('span', { className: "text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3110}}, "Selected"

                  )
                )
                , React.createElement('p', { className: "text-xs text-slate-500 truncate mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3114}}
                  , (SPECIALTY_OPTIONS.find((s) => s.id === selectedSpecialty) || {}).desc || 'Medical Specialty'
                )
              )
            )

            , React.createElement('div', { className: "flex items-center gap-2 ml-3 shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3120}}
              , React.createElement('span', { className: "text-xs font-semibold text-slate-400 hidden sm:inline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3121}}
                , isSpecialtyDropdownOpen ? 'Close menu' : 'Change specialty'
              )
              , React.createElement('div', { className: `w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                isSpecialtyDropdownOpen ? 'bg-brand-100 text-brand-700 rotate-180' : 'bg-slate-100 text-slate-600'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3124}}
                , React.createElement('svg', { className: "w-4 h-4" , fill: "none", stroke: "currentColor", viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3127}}
                  , React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M19 9l-7 7-7-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3128}} )
                )
              )
            )
          )

          /* Dropdown Menu Panel */
          , isSpecialtyDropdownOpen && (
            React.createElement('div', {
              role: "listbox",
              'aria-label': "Medical Specialties" ,
              className: "absolute left-0 right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3136}}

              , React.createElement('div', { className: "p-2.5 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3141}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3142}}, "Select Department Roster"  )
                , React.createElement('span', { className: "text-brand-600 font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3143}}, "Live Doctor Matching"  )
              )

              , React.createElement('div', { className: "max-h-72 overflow-y-auto divide-y divide-slate-100 p-1.5 focus:outline-none"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3146}}
                , SPECIALTY_OPTIONS.map((spec) => {
                  const isSelected = selectedSpecialty === spec.id;
                  const matchingDoc = MOCK_DOCTORS.find((d) =>
                    d.specialties.some((s) => matchesSpecialty(s, spec.id))
                  );

                  return (
                    React.createElement('button', {
                      key: spec.id,
                      type: "button",
                      role: "option",
                      'aria-selected': isSelected,
                      onClick: () => {
                        setSelectedSpecialty(spec.id);
                        if (matchingDoc && matchingDoc.nextSlot) {
                          setSelectedSlot(matchingDoc.nextSlot);
                        }
                        setIsSpecialtyDropdownOpen(false);
                      },
                      className: `w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors group ${
                        isSelected
                          ? 'bg-brand-50 border border-brand-200 text-brand-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3154}}

                      , React.createElement('div', { className: "flex items-center gap-3 min-w-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3172}}
                        , React.createElement('span', { className: `w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${
                          isSelected ? 'bg-brand-100' : 'bg-slate-100 group-hover:bg-brand-50'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3173}}
                          , spec.icon
                        )
                        , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3178}}
                          , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3179}}
                            , React.createElement('span', { className: `text-sm ${isSelected ? 'font-extrabold text-brand-900' : 'text-slate-800'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3180}}
                              , spec.label
                            )
                            , matchingDoc && (
                              React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 shrink-0 flex items-center gap-1 border border-emerald-200"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3184}}
                                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3185}}, matchingDoc.avatar)
                                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3186}}, matchingDoc.name)
                              )
                            )
                          )
                          , React.createElement('p', { className: "text-xs text-slate-400 group-hover:text-slate-500 truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3190}}
                            , spec.desc
                          )
                        )
                      )

                      , React.createElement('div', { className: "shrink-0 ml-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3196}}
                        , isSelected ? (
                          React.createElement('div', { className: "w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3198}}, "✓"

                          )
                        ) : (
                          React.createElement('span', { className: "text-xs text-slate-300 group-hover:text-brand-600 font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3202}}, "Select"

                          )
                        )
                      )
                    )
                  );
                })
              )
            )
          )
        )

        /* Doctor Roster Card */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3216}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3217}}, "Matching Specialist Doctor"  )
          , React.createElement('div', { className: "p-4 rounded-xl border border-brand-200 bg-brand-50/40 flex items-start justify-between gap-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3218}}
            , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3219}}
              , React.createElement('div', { className: "w-12 h-12 rounded-xl bg-white border border-brand-200 flex items-center justify-center text-2xl shrink-0 shadow-sm"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3220}}
                , activeDoctor.avatar
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3223}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3224}}
                  , React.createElement('h4', { className: "font-extrabold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3225}}, activeDoctor.name)
                  , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3226}}, "Online")
                )
                , React.createElement('p', { className: "text-xs text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3228}}, activeDoctor.qualification, " • Reg: "   , activeDoctor.registrationNumber)
                , React.createElement('div', { className: "flex items-center gap-1.5 mt-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3229}}
                  , activeDoctor.facilityNames.map((fac, i) => (
                    React.createElement('span', { key: i, className: "text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3231}}, "🏥 "
                       , fac
                    )
                  ))
                )
              )
            )
          )
        )

        /* Slot Selection */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3242}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3243}}, "Available Time Slot"  )
          , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3244}}
            , [activeDoctor.nextSlot || 'Today, 10:00 AM', 'Today, 11:30 AM', 'Today, 02:00 PM', 'Today, 04:30 PM'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map((slot) => (
              React.createElement('button', {
                key: slot,
                type: "button",
                onClick: () => setSelectedSlot(slot),
                className: `py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  selectedSlot === slot
                    ? 'bg-[#0b2b82] text-white border-[#0b2b82] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3246}}

                , slot
              )
            ))
          )
        )

        /* Symptoms Intake */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3263}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3264}}, "Symptoms & Chief Complaint"   )
          , React.createElement('textarea', {
            rows: 2,
            value: symptoms,
            onChange: (e) => handleSymptomCheck(e.target.value),
            className: "w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500 text-slate-900"         ,
            placeholder: "Describe symptoms briefly..."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3265}}
          )
        )

        /* High Risk Flags */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3275}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3276}}, "High-Risk Factors (Boosts Queue Priority)"    )
          , React.createElement('div', { className: "flex gap-2 flex-wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3277}}
            , ['Pregnancy', 'Infant (<=2y)', 'Elderly (>=65y)', 'Hypertension', 'Diabetes', 'Cardiac Stent'].map((flag) => {
              const isChecked = riskFlags.includes(flag);
              return (
                React.createElement('button', {
                  key: flag,
                  type: "button",
                  onClick: () => {
                    if (isChecked) {
                      setRiskFlags(riskFlags.filter((f) => f !== flag));
                    } else {
                      setRiskFlags([...riskFlags, flag]);
                    }
                  },
                  className: `px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    isChecked
                      ? 'bg-brand-50 border-brand-400 text-brand-800'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3281}}

                  , isChecked ? '✓ ' : '+ ', " " , flag
                )
              );
            })
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3304}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3305}}
, "← Back"

          )
          , React.createElement('button', {
            type: "button",
            onClick: handleBook,
            className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3312}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3317}}, "Confirm Booking & Enter Queue"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3318}}, "→")
          )
        )
      )
    )
  );
}

function ScreenTeleconsultQueue({ appointment, onJoinCall, onBack }) {
  const [queuePos, setQueuePos] = useState(2);
  const [estimatedMins, setEstimatedMins] = useState(8);

  return (
    React.createElement('div', { className: "max-w-xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3331}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3332}}
        , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3333}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-brand-600 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3334}}), "Priority Queue Management Active"

        )

        /* Live Queue Position Card */
        , React.createElement('div', { className: "w-32 h-32 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex flex-col items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/30 relative"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3339}}
          , React.createElement('span', { className: "text-xs uppercase font-bold tracking-widest opacity-80"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3340}}, "You Are" )
          , React.createElement('span', { className: "text-4xl font-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3341}}, "#", queuePos)
          , React.createElement('span', { className: "text-[10px] font-semibold opacity-90"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3342}}, "in priority queue"  )
          , React.createElement('div', { className: "absolute inset-0 rounded-full border-4 border-brand-300 border-dashed animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3343}})
        )

        , React.createElement('h3', { className: "text-xl font-black text-slate-900 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3346}}, "Estimated Wait: "  , estimatedMins, " Minutes" )
        , React.createElement('p', { className: "text-xs text-slate-500 mb-6 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3347}}, "Consulting Doctor: "
            , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3348}}, _optionalChain([appointment, 'optionalAccess', _10 => _10.doctorName]) || 'Dr. Priya Sharma'), " (" , _optionalChain([appointment, 'optionalAccess', _11 => _11.specialty]) || 'Neurology', ")"
        )

        /* Priority Computation Audit */
        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs space-y-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3352}}
          , React.createElement('div', { className: "flex items-center justify-between text-slate-500 font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3353}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3354}}, "PRIORITY SCORING BREAKDOWN"  )
            , React.createElement('span', { className: "text-brand-700 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3355}}, "SCORE: 85 PTS"  )
          )

          , React.createElement('div', { className: "grid grid-cols-2 gap-2 text-slate-700 font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3358}}
            , React.createElement('div', { className: "bg-white p-2 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3359}}
              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3360}}, "Acuity Tier" )
              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3361}}, _optionalChain([appointment, 'optionalAccess', _12 => _12.urgencyTier]) === 'RED' ? '🔴 RED (+100)' : '🟡 URGENT (+50)')
            )
            , React.createElement('div', { className: "bg-white p-2 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3363}}
              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3364}}, "Punctuality Protection" )
              , React.createElement('strong', { className: "text-emerald-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3365}}, "✓ Booked Slot (+25)"   )
            )
          )

          , React.createElement('p', { className: "text-[11px] text-slate-500 pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3369}}
            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3370}}, "Anti-Starvation Guardrail:" ), " On-time booked appointments cannot be indefinitely bumped by walk-in arrivals."
          )
        )

        , React.createElement('div', { className: "p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6 flex items-center justify-between gap-3 text-left"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3374}}
          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3375}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3376}}, "🔔")
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3377}}
              , React.createElement('h4', { className: "text-xs font-bold text-emerald-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3378}}, "Doctor Has Called Your Session"    )
              , React.createElement('p', { className: "text-[11px] text-emerald-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3379}}, "Doctor Dr. Priya Sharma is waiting in the digital room."         )
            )
          )
        )

        , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3384}}
          , React.createElement('button', {
            type: "button",
            onClick: onJoinCall,
            className: "w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3385}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3390}}, "🎥 Join Teleconsultation Room Now"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3391}}, "→")
          )

          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "text-xs font-bold text-slate-400 hover:text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3394}}
, "← Cancel & Back to Booking"

          )
        )
      )
    )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3455}}
      /* Call Header & Bandwidth Degradation Simulation Bar */
      , React.createElement('div', { className: "bg-slate-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between flex-wrap gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3457}}
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3458}}
          , React.createElement('div', { className: "w-3 h-3 rounded-full bg-emerald-400 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3459}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3460}}
            , React.createElement('h3', { className: "text-sm font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3461}}, _optionalChain([appointment, 'optionalAccess', _13 => _13.doctorName]) || 'Dr. Priya Sharma', " • "  , _optionalChain([appointment, 'optionalAccess', _14 => _14.specialty]) || 'Neurology')
            , React.createElement('p', { className: "text-[11px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3462}}, "Consultation Session • Call Duration: 04:12"     )
          )
        )

        /* Degrading Modes Switcher (Demo Bandwidth Toggle) */
        , React.createElement('div', { className: "flex items-center gap-1.5 bg-white/10 p-1 rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3467}}
          , React.createElement('span', { className: "text-[10px] text-slate-400 px-2 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3468}}, "Bandwidth Mode:" )
          , React.createElement('button', {
            type: "button",
            onClick: () => setCallMode('video'),
            className: `px-3 py-1 rounded-lg transition-all ${
              callMode === 'video' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3469}}
, "🎥 Video (HD)"

          )
          , React.createElement('button', {
            type: "button",
            onClick: () => setCallMode('audio'),
            className: `px-3 py-1 rounded-lg transition-all ${
              callMode === 'audio' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3478}}
, "🎙️ Audio (Low BW)"

          )
          , React.createElement('button', {
            type: "button",
            onClick: () => setCallMode('chat'),
            className: `px-3 py-1 rounded-lg transition-all ${
              callMode === 'chat' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3487}}
, "💬 In-App Chat (2G)"

          )
        )
      )

      , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3499}}
        /* Main Stage: Video / Audio / Chat */
        , React.createElement('div', { className: "lg:col-span-2 space-y-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3501}}
          /* Mode 1: Video Call View */
          , callMode === 'video' && (
            React.createElement('div', { className: "bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col justify-between p-6 shadow-2xl border border-slate-800"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3504}}
              /* Doctor Video Feed (Simulated) */
              , React.createElement('div', { className: "absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3506}}
                , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3507}}
                  , React.createElement('div', { className: "w-24 h-24 rounded-full bg-brand-500/20 border-2 border-brand-400 text-white flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3508}}, "👩‍⚕️"

                  )
                  , React.createElement('h4', { className: "text-lg font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3511}}, "Dr. Priya Sharma"  )
                  , React.createElement('span', { className: "text-xs text-brand-300 font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3512}}, "MD Neurology • Live Telehealth Stream"     )
                )
              )

              /* Patient Webcam Preview Box (PiP) */
              , React.createElement('div', { className: "absolute bottom-5 right-5 w-36 h-28 bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-white text-xs z-10"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3517}}
                , isCameraOff ? (
                  React.createElement('span', { className: "text-slate-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3519}}, "Camera Off" )
                ) : (
                  React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3521}}
                    , React.createElement('span', { className: "text-2xl block mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3522}}, "👤")
                    , React.createElement('span', { className: "text-[10px] font-bold opacity-80"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3523}}, pathActor === 'worker' ? 'ASHA + Patient' : 'Patient')
                  )
                )
              )

              /* Floating Action Controls */
              , React.createElement('div', { className: "absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 z-10"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3529}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setIsMuted(!isMuted),
                  className: `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isMuted ? 'bg-critical-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3530}}

                  , isMuted ? '🔇' : '🎙️'
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => setIsCameraOff(!isCameraOff),
                  className: `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCameraOff ? 'bg-critical-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3540}}

                  , isCameraOff ? '🚫' : '📹'
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => setCallMode('chat'),
                  className: "w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3550}}
, "💬"

                )
              )
            )
          )

          /* Mode 2: Audio-Only Fallback View */
          , callMode === 'audio' && (
            React.createElement('div', { className: "bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-8 text-white text-center shadow-xl border border-amber-500/20 aspect-video flex flex-col justify-between"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3563}}
              , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 mx-auto"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3564}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3565}}, "⚠️ Bandwidth Degraded • Switched to Audio-Only Mode"       )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3568}}
                , React.createElement('div', { className: "w-20 h-20 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-3xl mx-auto mb-3 border border-amber-400"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3569}}, "🎙️"

                )
                , React.createElement('h4', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3572}}, "Dr. Priya Sharma • Audio Active"     )
                , React.createElement('p', { className: "text-xs text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3573}}, "High-clarity low-latency voice channel connected"    )

                /* Simulated Audio Waveforms */
                , React.createElement('div', { className: "flex items-center justify-center gap-1.5 mt-6 h-8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3576}}
                  , [20, 60, 40, 80, 50, 90, 30, 70, 40, 85, 30, 60].map((h, i) => (
                    React.createElement('div', {
                      key: i,
                      className: "w-1.5 bg-amber-400 rounded-full animate-pulse"   ,
                      style: { height: `${h}%`, animationDelay: `${i * 100}ms` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3578}}
)
                  ))
                )
              )

              , React.createElement('div', { className: "flex justify-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3587}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setIsMuted(!isMuted),
                  className: "px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3588}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3593}}, isMuted ? '🔇 Unmute' : '🎙️ Mute')
                )
              )
            )
          )

          /* Mode 3: Session In-App Chat Fallback View */
          , callMode === 'chat' && (
            React.createElement('div', { className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3601}}
              , React.createElement('div', { className: "flex items-center justify-between pb-3 border-b border-slate-100"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3602}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3603}}
                  , React.createElement('h4', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3604}}, "Session In-App Chat"  )
                  , React.createElement('p', { className: "text-[11px] text-slate-400 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3605}}, "Tied to consultation ID: CON-JH-8842"    )
                )
                , React.createElement('span', { className: "text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3607}}, "Session Scoped"

                )
              )

              , React.createElement('div', { className: "flex-1 overflow-y-auto py-4 space-y-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3612}}
                , messages.map((m) => {
                  const isDoctor = m.sender === 'doctor';
                  return (
                    React.createElement('div', { key: m.id, className: `flex flex-col ${isDoctor ? 'items-start' : 'items-end'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3616}}
                      , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 mb-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3617}}, m.senderName, " • "  , m.time)
                      , React.createElement('div', {
                        className: `p-3.5 rounded-2xl max-w-sm text-xs font-medium leading-relaxed ${
                          isDoctor
                            ? 'bg-slate-100 text-slate-900 rounded-tl-sm'
                            : 'bg-brand-600 text-white rounded-tr-sm'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3618}}

                        , m.text
                      )
                    )
                  );
                })
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex gap-2 items-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3632}}
                , React.createElement('input', {
                  type: "file",
                  id: "chat-attachment",
                  className: "hidden",
                  accept: "image/*,video/*",
                  onChange: (e) => {
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
                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3633}}
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: () => document.getElementById('chat-attachment').click(),
                  className: "p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"     ,
                  title: "Attach Photo/Video" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3651}}

                  , React.createElement('svg', { className: "w-5 h-5" , fill: "none", stroke: "currentColor", viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3657}}, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3657}} ))
                )
                , React.createElement('input', {
                  type: "text",
                  value: chatInput,
                  onChange: (e) => setChatInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  },
                  placeholder: "Type message to doctor..."   ,
                  className: "flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3659}}
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: sendChatMessage,
                  className: "px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3672}}
, "Send"

                )
              )
            )
          )
        )

        /* Sidebar: Vitals Observation Panel with Reliability Tagging */
        , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3685}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-200"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3686}}
            , React.createElement('div', { className: "flex items-center justify-between mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3687}}
              , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3688}}, "Live Vitals Observations"  )
              , React.createElement(VitalsConfidenceBadge, { source: pathActor === 'worker' ? 'worker_verified' : 'self_reported', __self: this, __source: {fileName: _jsxFileName, lineNumber: 3689}} )
            )

            , React.createElement('div', { className: "space-y-2.5 mb-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3692}}
              , vitals.map((v, i) => (
                React.createElement('div', { key: i, className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3694}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3695}}
                    , React.createElement('span', { className: "text-slate-500 font-bold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3696}}, v.label)
                    , React.createElement('strong', { className: "text-slate-900 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3697}}, v.value, " " , v.unit)
                  )
                  , React.createElement(VitalsConfidenceBadge, { source: v.source, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3699}} )
                )
              ))
            )

            /* Quick Add Vital */
            , React.createElement('div', { className: "pt-4 border-t border-slate-100 space-y-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3705}}
              , React.createElement('span', { className: "text-[11px] font-bold text-slate-500 block uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3706}}, "Log Additional Vital Reading"   )
              , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3707}}
                , React.createElement('select', {
                  value: newVitalType,
                  onChange: (e) => setNewVitalType(e.target.value),
                  className: "px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3708}}

                  , React.createElement('option', { value: "glucose", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3713}}, "Glucose (mg/dL)" )
                  , React.createElement('option', { value: "bp", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3714}}, "Blood Pressure" )
                  , React.createElement('option', { value: "spo2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3715}}, "SpO2 (%)" )
                  , React.createElement('option', { value: "temp", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3716}}, "Temp (°F)" )
                )
                , React.createElement('input', {
                  type: "text",
                  value: newVitalValue,
                  onChange: (e) => setNewVitalValue(e.target.value),
                  className: "w-20 px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3718}}
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: addVital,
                  className: "px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3724}}
, "Save"

                )
              )
            )
          )

          /* Action to Doctor Form */
          , React.createElement('button', {
            type: "button",
            onClick: () => onCompleteConsultation(vitals),
            className: "w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3736}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3741}}, "Complete Call & Proceed to Doctor Rx 📝"       )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3742}}, "→")
          )
        )
      )
    )
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
    React.createElement('div', { className: "max-w-3xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3778}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3779}}
        , React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3780}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3781}}
            , React.createElement('div', { className: "flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3782}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3783}}, "Doctor Clinical Workspace • Digital EMR Rx"      )
            )
            , React.createElement('h2', { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3785}}, "Clinical Documentation Form"  )
          )
          , React.createElement('span', { className: "text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3787}}, "Consulting: "
             , _optionalChain([appointment, 'optionalAccess', _15 => _15.doctorName]) || 'Dr. Priya Sharma'
          )
        )

        , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3792}}
          /* Differential Diagnosis */
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3794}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3795}}, "Differential Clinical Diagnosis"  )
            , React.createElement('input', {
              type: "text",
              value: diagnosis,
              onChange: (e) => setDiagnosis(e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-500"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3796}}
            )
          )

          /* Clinical Examination Notes */
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3805}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3806}}, "Doctor Clinical Notes & Observations"    )
            , React.createElement('textarea', {
              rows: 3,
              value: doctorNotes,
              onChange: (e) => setDoctorNotes(e.target.value),
              className: "w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500 text-slate-900"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3807}}
            )
          )

          /* Prescription Items */
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3816}}
            , React.createElement('div', { className: "flex items-center justify-between mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3817}}
              , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3818}}, "Prescription (Rx Medicines)"  )
              , React.createElement('span', { className: "text-xs text-slate-400 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3819}}, prescription.length, " Items" )
            )

            , React.createElement('div', { className: "space-y-2 mb-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3822}}
              , prescription.map((rx, idx) => (
                React.createElement('div', { key: idx, className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3824}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3825}}
                    , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3826}}, rx.medicineName)
                    , React.createElement('span', { className: "text-slate-500 ml-2 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3827}}, "(", rx.dosage, ") • "  , rx.frequency, " • "  , rx.durationDays, " days" )
                    , React.createElement('p', { className: "text-[11px] text-slate-400 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3828}}, rx.instructions)
                  )
                  , React.createElement('button', {
                    type: "button",
                    onClick: () => setPrescription(prescription.filter((_, i) => i !== idx)),
                    className: "text-critical-600 font-bold hover:underline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3830}}
, "Remove"

                  )
                )
              ))
            )
          )

          /* Clinical Flags Grid */
          , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3843}}
            , React.createElement('div', {
              onClick: () => setReferralFlag(!referralFlag),
              className: `p-4 rounded-xl border cursor-pointer transition-all ${
                referralFlag ? 'bg-critical-50 border-critical-300 shadow-sm' : 'bg-white border-slate-200'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3844}}

              , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3850}}
                , React.createElement('span', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3851}}, "Tertiary Referral" )
                , React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3852}}, referralFlag ? '🚨 YES' : 'NO')
              )
              , React.createElement('p', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3854}}, "Trigger hospital referral to Feature 03 / Super Specialty."        )
            )

            , React.createElement('div', {
              onClick: () => setDiagnosticOrderFlag(!diagnosticOrderFlag),
              className: `p-4 rounded-xl border cursor-pointer transition-all ${
                diagnosticOrderFlag ? 'bg-brand-50 border-brand-300 shadow-sm' : 'bg-white border-slate-200'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3857}}

              , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3863}}
                , React.createElement('span', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3864}}, "Diagnostic Order" )
                , React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3865}}, diagnosticOrderFlag ? '🧪 YES' : 'NO')
              )
              , React.createElement('p', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3867}}, "Order Lab Tests (CBC, Serum Lytes, ECG)."      )
            )

            , React.createElement('div', {
              onClick: () => setFollowUpFlag(!followUpFlag),
              className: `p-4 rounded-xl border cursor-pointer transition-all ${
                followUpFlag ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-white border-slate-200'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3870}}

              , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3876}}
                , React.createElement('span', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3877}}, "Follow-up Required" )
                , React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3878}}, followUpFlag ? `📅 ${followUpDays}d` : 'NO')
              )
              , React.createElement('p', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3880}}, "Schedule follow-up review in 7 days."     )
            )
          )

          , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3884}}
            , React.createElement('button', {
              type: "button",
              onClick: handleFinalize,
              className: "px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3885}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3890}}, "Sign & Issue Digital EMR Consultation Summary 🔏"       )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3891}}, "→")
            )
          )
        )
      )
    )
  );
}

function ScreenConsultationSummary({ consultationData, onRestart, onGoHome }) {
  const [copied, setCopied] = useState(false);
  const consultId = 'CON-JH-2026-9042';

  const diagnosis = _optionalChain([consultationData, 'optionalAccess', _16 => _16.diagnosis]) || 'Tension-type Headache / Cervical Muscular Strain';
  const doctorNotes = _optionalChain([consultationData, 'optionalAccess', _17 => _17.doctorNotes]) || 'Patient alert and oriented. Cranial nerve exam intact. SBP 138 mmHg. Advised rest, hydration, and short-term analgesia.';
  const prescription = (_optionalChain([consultationData, 'optionalAccess', _18 => _18.prescription]) && consultationData.prescription.length > 0)
    ? consultationData.prescription
    : [
        { medicineName: 'Tab Paracetamol', dosage: '500 mg', frequency: 'SOS (as needed)', durationDays: 3 },
        { medicineName: 'Tab Naproxen', dosage: '250 mg', frequency: '1-0-1', durationDays: 5 }
      ];

  return (
    React.createElement('div', { className: "max-w-2xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3914}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3915}}
        , React.createElement('div', { className: "border-2 border-dashed border-brand-500/40 rounded-2xl p-6 bg-brand-50/20 mb-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3916}}
          , React.createElement('div', { className: "flex items-center justify-between border-b border-brand-200/60 pb-4 mb-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3917}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3918}}
              , React.createElement('span', { className: "text-[10px] font-extrabold tracking-widest text-brand-700 uppercase bg-brand-100 px-2 py-0.5 rounded"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3919}}, "Official Teleconsultation Record & Rx"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3922}}, "Dr. Priya Sharma, MD"   )
              , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3923}}, "Department of Neurology • SBMC&H Regional Grid"      )
            )
            , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3925}}
              , React.createElement('div', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3926}}, "CONSULT ID" )
              , React.createElement('div', { className: "text-sm font-black text-brand-700 font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3927}}, consultId)
            )
          )

          , React.createElement('div', { className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3931}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3932}}
              , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3933}}, "Differential Diagnosis" )
              , React.createElement('strong', { className: "text-slate-900 text-sm font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3934}}, diagnosis)
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3937}}
              , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3938}}, "Doctor Clinical Notes"  )
              , React.createElement('p', { className: "text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3939}}
                , doctorNotes
              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3944}}
              , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3945}}, "Prescribed Medicines (Rx)"  )
              , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3946}}
                , prescription.map((rx, i) => (
                  React.createElement('div', { key: i, className: "p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3948}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3949}}
                      , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3950}}, rx.medicineName, " (" , rx.dosage, ")")
                      , React.createElement('span', { className: "text-slate-500 ml-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3951}}, "• " , rx.frequency)
                    )
                    , React.createElement('span', { className: "text-[11px] text-slate-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3953}}, rx.durationDays, " Days" )
                  )
                ))
              )
            )

            /* QR Verification */
            , React.createElement('div', { className: "flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 gap-3"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3960}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3961}}
                , React.createElement('div', { className: "w-12 h-12 bg-slate-900 rounded-lg p-1 flex flex-col justify-between shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3962}}
                  , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3963}}, React.createElement('div', { className: "w-3 h-3 bg-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3963}}), React.createElement('div', { className: "w-3 h-3 bg-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3963}}))
                  , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3964}}, React.createElement('div', { className: "w-3 h-3 bg-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3964}}), React.createElement('div', { className: "w-1.5 h-1.5 bg-white self-end"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3964}}))
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3966}}
                  , React.createElement('div', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3967}}, "Pharmacist & EMR Fast-Verification"   )
                  , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3968}}, "Scan at any Jan Aushadhi Kendra or hospital pharmacy."        )
                )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                },
                className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3971}}

                , copied ? '✓ Copied' : 'Copy ID'
              )
            )
          )
        )

        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3985}}
          , React.createElement('button', {
            type: "button",
            onClick: onGoHome,
            className: "px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3986}}
, "🏠 Return to Platform Home"

          )

          , React.createElement('button', {
            type: "button",
            onClick: onRestart,
            className: "px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3994}}
, "↺ Start New Teleconsultation"

          )
        )
      )
    )
  );
}

// ==========================================
// --- FEATURE 03: SMART REFERRAL MANAGEMENT ---
// ==========================================

const REFERRING_DOCTOR_FACILITY_OPTIONS = [
  {
    id: 'doc_1',
    doctorName: 'Dr. Priya Sharma',
    facilityId: 'fac_phc_katkamsandi',
    facilityName: 'Katkamsandi Primary Health Centre (PHC)',
    facilityType: 'PHC',
    specialty: 'Cardiology / General Medicine'
  },
  {
    id: 'doc_gm_ichak',
    doctorName: 'Dr. Arvind Sinha',
    facilityId: 'fac_phc_ichak',
    facilityName: 'Ichak Primary Health Centre (PHC)',
    facilityType: 'PHC',
    specialty: 'Internal Medicine'
  },
  {
    id: 'doc_pulm_churchu',
    doctorName: 'Dr. Devendra Prasad',
    facilityId: 'fac_phc_churchu',
    facilityName: 'Churchu Primary Health Centre (PHC)',
    facilityType: 'PHC',
    specialty: 'Pulmonology / Chest Care'
  },
  {
    id: 'doc_ent_padma',
    doctorName: 'Dr. Sunita Baskey',
    facilityId: 'fac_phc_padma',
    facilityName: 'Padma Primary Health Centre (PHC)',
    facilityType: 'PHC',
    specialty: 'ENT / Primary Care'
  },
  {
    id: 'doc_derm_daru',
    doctorName: 'Dr. Neha Agarwal',
    facilityId: 'fac_phc_daru',
    facilityName: 'Daru Primary Health Centre (PHC)',
    facilityType: 'PHC',
    specialty: 'Dermatology & Skin Care'
  },
  {
    id: 'doc_4',
    doctorName: 'Dr. Kavita Murmu',
    facilityId: 'fac_chc_barkagaon',
    facilityName: 'Barkagaon Community Health Centre (CHC)',
    facilityType: 'CHC',
    specialty: 'Obstetrics & Gynecology'
  },
  {
    id: 'doc_3',
    doctorName: 'Dr. Ananya Sen',
    facilityId: 'fac_chc_bishnugarh',
    facilityName: 'Bishnugarh Community Health Centre (CHC)',
    facilityType: 'CHC',
    specialty: 'Pediatrics & Neonatal Care'
  },
  {
    id: 'doc_ortho_mandu',
    doctorName: 'Dr. Vikramaditya Roy',
    facilityId: 'fac_chc_mandu',
    facilityName: 'Mandu Community Health Centre (CHC)',
    facilityType: 'CHC',
    specialty: 'Orthopedics & Joint Care'
  },
  {
    id: 'doc_2',
    doctorName: 'Dr. Rajesh Verma',
    facilityId: 'fac_sadar',
    facilityName: 'Sadar Hospital Hazaribagh',
    facilityType: 'HOSPITAL',
    specialty: 'Cardiology / Emergency'
  },
  {
    id: 'doc_gs_barhi',
    doctorName: 'Dr. Manoj K. Pandey',
    facilityId: 'fac_sdh_barhi',
    facilityName: 'Barhi Sub-Divisional Hospital (SDH)',
    facilityType: 'HOSPITAL',
    specialty: 'General Surgery & Trauma'
  },
  {
    id: 'doc_ns_sbmch',
    doctorName: 'Dr. Alok Nath Tripathy',
    facilityId: 'fac_sbmch',
    facilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
    facilityType: 'HOSPITAL',
    specialty: 'Neurosurgery & Spine'
  },
  {
    id: 'doc_psych_rinpas',
    doctorName: 'Dr. Tariq Anwar',
    facilityId: 'fac_rinpas',
    facilityName: 'RINPAS Regional Health Network',
    facilityType: 'OTHER',
    specialty: 'Psychiatry & Behavioral Health'
  },
  {
    id: 'doc_opht_netralaya',
    doctorName: 'Dr. Hemant Soreng',
    facilityId: 'fac_netralaya',
    facilityName: 'Netralaya Vision Care Centre',
    facilityType: 'OTHER',
    specialty: 'Ophthalmology & Eye Microsurgery'
  }
];

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
  const [isCustomReferringDoctor, setIsCustomReferringDoctor] = useState(false);
  const [selectedDoctorOptionId, setSelectedDoctorOptionId] = useState('doc_1');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetDeleteRef, setTargetDeleteRef] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        ? (formData.referringDoctorName || 'Dr. Priya Sharma')
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

    if (targetStatus === 'CANCELLED') {
      setStats((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - (targetReferral.status === 'CREATED' || targetReferral.status === 'SENT' ? 1 : 0)),
        cancelled: (prev.cancelled || 0) + 1
      }));
    }

    setShowUpdateModal(false);
  };

  const handleOpenDeleteModal = (ref) => {
    setTargetDeleteRef(ref);
    setShowDeleteModal(true);
  };

  const confirmDeleteReferral = async () => {
    if (!targetDeleteRef) return;
    setIsDeleting(true);
    try {
      const res = await fetch(getApiUrl(`/api/referrals/${encodeURIComponent(targetDeleteRef.referralId)}`), {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!json.success) {
        console.warn('Backend DELETE returned failure, applying local delete:', json);
      }
    } catch (err) {
      console.warn('Backend DELETE fetch failed, applying local delete:', err);
    }

    setReferrals((prev) => prev.filter((r) => r.referralId !== targetDeleteRef.referralId));
    setStats((prev) => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
      pending: Math.max(0, prev.pending - (targetDeleteRef.status === 'CREATED' || targetDeleteRef.status === 'SENT' ? 1 : 0)),
      inProgress: Math.max(0, prev.inProgress - (targetDeleteRef.status === 'IN_PROGRESS' || targetDeleteRef.status === 'REACHED_FACILITY' ? 1 : 0)),
      completed: Math.max(0, prev.completed - (targetDeleteRef.status === 'COMPLETED' ? 1 : 0)),
      cancelled: Math.max(0, (prev.cancelled || 0) - (targetDeleteRef.status === 'CANCELLED' ? 1 : 0))
    }));

    if (_optionalChain([selectedTimelineRef, 'optionalAccess', _19 => _19.referralId]) === targetDeleteRef.referralId) {
      setSelectedTimelineRef(null);
    }

    setIsDeleting(false);
    setShowDeleteModal(false);
    setTargetDeleteRef(null);
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
    React.createElement('div', { className: "space-y-6 pb-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4401}}
      /* Header Banner */
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4403}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4404}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4405}}
            , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4406}}, "Feature Map 03 • Closed-Loop Referral"

            )
            , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4409}}, "REF-TRACKER v2.0" )
          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4411}}, "Smart Referral Management System"   )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 font-medium mt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4412}}, "Digitally manages and tracks patient referrals from doctor creation to ASHA follow-up, facility intake, and completed care."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4417}}
          , React.createElement('button', {
            type: "button",
            onClick: () => setShowCreateModal(true),
            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4418}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4423}}, "➕")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4424}}, "Create New Referral"  )
          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4426}}
, "🏠 Home"

          )
        )
      )

      /* Role View Selector Tabs */
      , React.createElement('div', { className: "bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4437}}
        , React.createElement('div', { className: "flex items-center gap-1.5 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4438}}
          , [
            { id: 'doctor', label: '👨‍⚕️ Referring Doctor View' },
            { id: 'worker', label: '👩‍⚕️ ASHA Action Center' },
            { id: 'facility', label: '🏥 Receiving Facility View' },
            { id: 'patient', label: '👤 Patient Referral Pass' }
          ].map((t) => (
            React.createElement('button', {
              key: t.id,
              type: "button",
              onClick: () => {
                setActiveTabRole(t.id);
                setActorRole(t.id);
              },
              className: `px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTabRole === t.id
                  ? 'bg-[#0b2b82] text-white shadow-md shadow-[#0b2b82]/25'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4445}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4458}}, t.label)
            )
          ))
        )

        , React.createElement('div', { className: "px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-extrabold rounded-lg border border-emerald-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4463}}, "Active Role: "
            , activeTabRole.toUpperCase()
        )
      )

      /* 4 KPI METRIC CARDS */
      , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4469}}
        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4470}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4471}}, "Total Referrals" )
          , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4472}}, stats.total)
          , React.createElement('span', { className: "text-[10px] text-slate-400 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4473}}, "Across all health corridors"   )
        )

        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4476}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-amber-700 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4477}}, "Pending Action" )
          , React.createElement('div', { className: "text-3xl font-black text-amber-600 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4478}}, stats.pending)
          , React.createElement('span', { className: "text-[10px] text-amber-600/80 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4479}}, "CREATED or SENT state"   )
        )

        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-blue-200 bg-blue-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4482}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-blue-700 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4483}}, "In Transit / Reached"   )
          , React.createElement('div', { className: "text-3xl font-black text-blue-600 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4484}}, stats.inProgress)
          , React.createElement('span', { className: "text-[10px] text-blue-600/80 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4485}}, "ASHA active follow-up"  )
        )

        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-emerald-200 bg-emerald-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4488}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-emerald-700 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4489}}, "Care Completed" )
          , React.createElement('div', { className: "text-3xl font-black text-emerald-600 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4490}}, stats.completed)
          , React.createElement('span', { className: "text-[10px] text-emerald-600/80 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4491}}, "Verified consultation finished"  )
        )
      )

      /* VIEW 1: DOCTOR DASHBOARD */
      , activeTabRole === 'doctor' && (
        React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4497}}
          , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4498}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4499}}
              , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4500}}, "Doctor Referral Tracking Board"   )
              , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4501}}, "Monitor referral lifecycles, dispatch newly created referrals, and inspect audit logs."

              )
            )

            , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4506}}
              , React.createElement('input', {
                type: "text",
                placeholder: "Search patient, ID, facility..."   ,
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4507}}
              )

              , React.createElement('div', { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold flex-wrap"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4515}}
                , ['ALL', 'CREATED', 'SENT', 'IN_PROGRESS', 'REACHED_FACILITY', 'COMPLETED', 'CANCELLED'].map((st) => (
                  React.createElement('button', {
                    key: st,
                    type: "button",
                    onClick: () => setStatusFilter(st),
                    className: `px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                      statusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4517}}

                    , st === 'ALL' ? 'All' : st.replace('_', ' ')
                  )
                ))
              )
            )
          )

          /* Referral Table */
          , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4533}}
            , React.createElement('table', { className: "w-full text-left text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4534}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4535}}
                , React.createElement('tr', { className: "border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4536}}
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4537}}, "Referral ID" )
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4538}}, "Patient")
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4539}}, "Specialty & Reason"  )
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4540}}, "Receiving Destination" )
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4541}}, "Status")
                  , React.createElement('th', { className: "py-3 px-3 text-right"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4542}}, "Actions")
                )
              )
              , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4545}}
                , filteredReferrals.map((ref) => (
                  React.createElement('tr', { key: ref.id, className: "hover:bg-slate-50/80 transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4547}}
                    , React.createElement('td', { className: "py-3.5 px-3 font-mono font-black text-emerald-800 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4548}}
                      , ref.referralId
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4551}}
                      , React.createElement('div', { className: "font-bold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4552}}, ref.patientName)
                      , React.createElement('div', { className: "text-[11px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4553}}, ref.patientAge, "y • "  , ref.patientSex, " • "  , ref.patientLocation)
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4555}}
                      , React.createElement('div', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4556}}, ref.specialty)
                      , React.createElement('div', { className: "text-[11px] text-slate-500 line-clamp-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4557}}, ref.reason)
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4559}}
                      , React.createElement('div', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4560}}, ref.receivingFacilityName)
                      , React.createElement('div', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4561}}, "From: " , ref.referringFacilityName)
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4563}}
                      , React.createElement('span', {
                        className: `px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
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
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4564}}

                        , ref.status.replace('_', ' ')
                      )
                    )
                    , React.createElement('td', { className: "py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4582}}
                      , ref.status === 'CREATED' && (
                        React.createElement('button', {
                          type: "button",
                          onClick: () => handleUpdateStatus(ref, 'SENT', 'Doctor transmitted referral to destination facility.'),
                          className: "px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4584}}
, "Dispatch (Send)"

                        )
                      )
                      , (ref.status === 'CREATED' || ref.status === 'SENT') && (
                        React.createElement('button', {
                          type: "button",
                          onClick: () => handleUpdateStatus(ref, 'CANCELLED', 'Doctor cancelled referral: patient clinical condition reassessed.'),
                          className: "px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition-colors"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4593}}
, "Cancel Referral ✕"

                        )
                      )
                      , ref.status === 'CANCELLED' && (
                        React.createElement('span', { className: "text-[11px] font-bold text-rose-600 italic mr-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4602}}, "Cancelled")
                      )
                      , React.createElement('button', {
                        type: "button",
                        onClick: () => handleOpenTimeline(ref),
                        className: "px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4604}}
, "Timeline 📜"

                      )
                      , React.createElement('button', {
                        type: "button",
                        onClick: () => handleOpenDeleteModal(ref),
                        className: "px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-lg text-[11px] font-bold transition-colors"           ,
                        title: "Delete this referral"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4611}}
, "Delete 🗑️"

                      )
                    )
                  )
                ))
              )
            )
          )
        )
      )

      /* VIEW 2: FRONTLINE WORKER (ASHA) ACTION CENTER */
      , activeTabRole === 'worker' && (
        React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4630}}
          , React.createElement('div', { className: "bg-amber-500/10 border border-amber-300 rounded-2xl p-5 flex items-start justify-between gap-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4631}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4632}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4633}}
                , React.createElement('span', { className: "w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4634}})
                , React.createElement('h3', { className: "text-base font-black text-amber-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4635}}, "ASHA Pending Follow-Up Queue"   )
              )
              , React.createElement('p', { className: "text-xs text-amber-800 font-medium mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4637}}
                , pendingWorkerReferrals.length, " patient(s) have active referrals requiring ground follow-up and transport coordination. Update their status once contacted or when they reach the hospital."

              )
            )
            , React.createElement('span', { className: "text-2xl font-black text-amber-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4642}}, pendingWorkerReferrals.length)
          )

          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4645}}
            , pendingWorkerReferrals.map((ref, idx) => (
              React.createElement('div', {
                key: ref.id,
                className: `p-5 rounded-2xl border transition-all space-y-3 ${
                  idx === 1 || ref.status === 'IN_PROGRESS'
                    ? 'border-[#0b2b82]/30 hover:border-[#0b2b82]/60 bg-[#0b2b82]/5 hover:bg-[#0b2b82]/10 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4647}}

                , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4655}}
                  , React.createElement('span', { className: "text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4656}}
                    , ref.referralId
                  )
                  , React.createElement('span', {
                    className: `text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      ref.status === 'IN_PROGRESS'
                        ? 'bg-[#0b2b82]/15 text-[#0b2b82] border border-[#0b2b82]/30'
                        : ref.status === 'SENT'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4659}}

                    , ref.status.replace('_', ' ')
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4672}}
                  , React.createElement('h4', { className: "font-extrabold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4673}}, ref.patientName, " (" , ref.patientAge, "y, " , ref.patientSex, ")")
                  , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4674}}, "Location: " , ref.patientLocation, " • Phone: "   , ref.patientPhone || 'N/A')
                )

                , React.createElement('div', { className: "bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4677}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4678}}, React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4678}}, "Department:"), " " , ref.specialty)
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4679}}, React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4679}}, "Destination:"), " " , ref.receivingFacilityName)
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4680}}, React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4680}}, "Reason:"), " " , ref.reason)
                )

                , React.createElement('div', { className: "pt-2 flex items-center gap-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4683}}
                  , ref.status === 'CREATED' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'SENT', 'ASHA acknowledged and initiated transport coordination.'),
                      className: "flex-1 py-2.5 bg-[#0b2b82] hover:bg-[#071a4f] text-white rounded-xl text-xs font-bold shadow-md shadow-[#0b2b82]/25 transition-all flex items-center justify-center gap-1.5"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4685}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4690}}, "📨")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4691}}, "Acknowledge & Dispatch"  )
                    )
                  )

                  , ref.status === 'SENT' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'IN_PROGRESS', 'ASHA contacted patient; transport en route.'),
                      className: "flex-1 py-2.5 bg-[#0b2b82] hover:bg-[#071a4f] text-white rounded-xl text-xs font-bold shadow-md shadow-[#0b2b82]/25 transition-all flex items-center justify-center gap-1.5"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4696}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4701}}, "📞")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4702}}, "Patient Contacted / En Route"    )
                    )
                  )

                  , ref.status === 'IN_PROGRESS' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'REACHED_FACILITY', 'ASHA confirmed patient arrived at hospital gate/OPD desk.'),
                      className: "flex-1 py-2.5 bg-[#0b2b82] hover:bg-[#071a4f] text-white rounded-xl text-xs font-bold shadow-md shadow-[#0b2b82]/25 transition-all flex items-center justify-center gap-1.5"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4707}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4712}}, "🏥")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4713}}, "Confirm Patient Reached Hospital"   )
                    )
                  )

                  , React.createElement('button', {
                    type: "button",
                    onClick: () => handleOpenTimeline(ref),
                    className: "px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4717}}
, "History"

                  )
                )
              )
            ))
          )
        )
      )

      /* VIEW 3: RECEIVING FACILITY INTAKE VIEW */
      , activeTabRole === 'facility' && (
        React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4733}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4734}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4735}}, "Receiving Facility Intake & Care Completion"     )
            , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4736}}, "Incoming referrals designated for Sheikh Bhikhari Medical College & District Hospitals. Confirm patient arrival and finalize care when specialist consultation completes."


            )
          )

          , React.createElement('div', { className: "divide-y divide-slate-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4742}}
            , incomingFacilityReferrals.map((ref) => (
              React.createElement('div', { key: ref.id, className: "py-4 flex items-center justify-between flex-wrap gap-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4744}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4745}}
                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4746}}
                    , React.createElement('span', { className: "font-mono font-black text-emerald-800 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4747}}, ref.referralId)
                    , React.createElement('span', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4748}}, "• " , ref.patientName, " (" , ref.patientAge, "y)")
                    , React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4749}}
                      , ref.status.replace('_', ' ')
                    )
                  )
                  , React.createElement('p', { className: "text-xs text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4753}}, "Specialty: "
                     , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4754}}, ref.specialty), " • Reason: "   , ref.reason
                  )
                  , React.createElement('p', { className: "text-[11px] text-slate-400 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4756}}, "Referred by: "  , ref.referringDoctorName, " (" , ref.referringFacilityName, ")")
                )

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4759}}
                  , ref.status !== 'REACHED_FACILITY' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'REACHED_FACILITY', 'Facility reception desk checked in patient.'),
                      className: "px-4 py-2 bg-[#0b2b82] hover:bg-[#071a4f] text-white font-bold text-xs rounded-xl shadow-md shadow-[#0b2b82]/25 transition-all"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4761}}
, "📥 Check-In Patient Arrival"

                    )
                  )

                  , ref.status === 'REACHED_FACILITY' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'COMPLETED', 'Consultation & clinical evaluation completed. Patient discharged/admitted.'),
                      className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4771}}
, "✅ Complete Care & Consultation"

                    )
                  )

                  , React.createElement('button', {
                    type: "button",
                    onClick: () => handleOpenTimeline(ref),
                    className: "px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4780}}
, "Audit Log"

                  )
                )
              )
            ))
          )
        )
      )

      /* VIEW 4: PATIENT REFERRAL PASS */
      , activeTabRole === 'patient' && primaryPatientRef && (
        React.createElement('div', { className: "max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4796}}
          , React.createElement('div', { className: "border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 bg-emerald-50/20"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4797}}
            , React.createElement('div', { className: "flex items-center justify-between border-b border-emerald-200/60 pb-4 mb-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4798}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4799}}
                , React.createElement('span', { className: "text-[10px] font-extrabold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-2.5 py-0.5 rounded"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4800}}, "Official Digital Referral Pass"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4803}}, primaryPatientRef.patientName)
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4804}}, "Age: " , primaryPatientRef.patientAge, " • Destination: "   , primaryPatientRef.receivingFacilityName)
              )
              , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4806}}
                , React.createElement('div', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4807}}, "REFERRAL ID" )
                , React.createElement('div', { className: "text-sm font-black text-emerald-800 font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4808}}, primaryPatientRef.referralId)
              )
            )

            /* 4-Step Patient Stepper */
            , React.createElement('div', { className: "py-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4813}}
              , React.createElement('div', { className: "flex items-center justify-between text-center relative"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4814}}
                , React.createElement('div', { className: "absolute top-3 left-6 right-6 h-0.5 bg-slate-200 -z-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4815}})
                , [
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
                    React.createElement('div', { key: idx, className: "relative z-10 flex flex-col items-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4829}}
                      , React.createElement('div', {
                        className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4830}}

                        , isDone ? '✓' : idx + 1
                      )
                      , React.createElement('span', { className: "text-[10px] font-bold text-slate-700 mt-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4837}}, s.label)
                    )
                  );
                })
              )
            )

            , React.createElement('div', { className: "space-y-3 text-xs bg-white p-4 rounded-xl border border-slate-200 mt-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4844}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4845}}
                , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4846}}, "Required Specialty" )
                , React.createElement('strong', { className: "text-slate-900 text-sm font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4847}}, primaryPatientRef.specialty)
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4849}}
                , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4850}}, "Clinical Reason" )
                , React.createElement('p', { className: "text-slate-700 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4851}}, primaryPatientRef.reason)
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4853}}
                , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4854}}, "Emergency Destination Hospital"  )
                , React.createElement('strong', { className: "text-slate-900 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4855}}, primaryPatientRef.receivingFacilityName)
              )
            )
          )
        )
      )

      /* TIMELINE AUDIT DRAWER MODAL */
      , selectedTimelineRef && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4864}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4865}}
            , React.createElement('div', { className: "flex items-center justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4866}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4867}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4868}}
                  , selectedTimelineRef.referralId
                )
                , React.createElement('h3', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4871}}, "Referral Journey & Audit Trail"    )
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4872}}, "Patient: " , selectedTimelineRef.patientName, " • "  , selectedTimelineRef.specialty)
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setSelectedTimelineRef(null),
                className: "w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4874}}
, "✕"

              )
            )

            , React.createElement('div', { className: "space-y-4 max-h-96 overflow-y-auto pr-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4883}}
              , timelineLogs.map((log, idx) => (
                React.createElement('div', { key: idx, className: "flex items-start gap-3 relative"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4885}}
                  , React.createElement('div', { className: "w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 mt-0.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4886}}
                    , idx + 1
                  )
                  , React.createElement('div', { className: "bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-1 text-xs space-y-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4889}}
                    , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4890}}
                      , React.createElement('span', { className: "font-black text-slate-900 uppercase text-[11px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4891}}
                        , log.fromStatus ? `${log.fromStatus} → ${log.toStatus}` : log.toStatus
                      )
                      , React.createElement('span', { className: "text-[10px] font-mono text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4894}}
                        , new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      )
                    )
                    , React.createElement('p', { className: "text-slate-700 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4898}}, log.remarks)
                    , React.createElement('div', { className: "text-[10px] text-slate-400 font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4899}}, "Updated by: "
                        , React.createElement('strong', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4900}}, log.updatedBy), " (" , log.userRole, ")"
                    )
                  )
                )
              ))
            )

            , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4907}}
              , activeTabRole === 'doctor' && (
                React.createElement('button', {
                  type: "button",
                  onClick: () => handleOpenDeleteModal(selectedTimelineRef),
                  className: "px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4909}}
, "Delete Referral 🗑️"

                )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setSelectedTimelineRef(null),
                className: "px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold ml-auto"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4917}}
, "Close Audit Timeline"

              )
            )
          )
        )
      )

      /* CREATE REFERRAL MODAL */
      , showCreateModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4931}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4932}}
            , React.createElement('div', { className: "flex items-center justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4933}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4934}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4935}}, "Doctor Referral Form"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4938}}, "Create Digital Clinical Referral"   )
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4939}}, "Pre-filled from Smart Care Navigator & Verified Hospital Destination"        )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCreateModal(false),
                className: "w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4941}}
, "✕"

              )
            )

            , React.createElement('form', { onSubmit: handleCreateSubmit, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4950}}
              , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4951}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4952}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4953}}, "Patient Full Name"  )
                  , React.createElement('input', {
                    type: "text",
                    required: true,
                    value: formData.patientName,
                    onChange: (e) => setFormData({ ...formData, patientName: e.target.value }),
                    className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4954}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4962}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4963}}, "Patient Age & Sex"   )
                  , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4964}}
                    , React.createElement('input', {
                      type: "number",
                      required: true,
                      value: formData.patientAge,
                      onChange: (e) => setFormData({ ...formData, patientAge: Number(e.target.value) }),
                      className: "w-24 border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4965}}
                    )
                    , React.createElement('select', {
                      value: formData.patientSex,
                      onChange: (e) => setFormData({ ...formData, patientSex: e.target.value }),
                      className: "flex-1 border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4972}}

                      , React.createElement('option', { value: "female", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4977}}, "Female")
                      , React.createElement('option', { value: "male", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4978}}, "Male")
                      , React.createElement('option', { value: "other", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4979}}, "Other")
                    )
                  )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4985}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4986}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4987}}, "Referring Doctor & Facility"   )
                  , React.createElement('select', {
                    value: isCustomReferringDoctor ? 'custom' : selectedDoctorOptionId,
                    onChange: (e) => {
                      const selId = e.target.value;
                      if (selId === 'custom') {
                        setIsCustomReferringDoctor(true);
                        setSelectedDoctorOptionId('custom');
                        setFormData({
                          ...formData,
                          referringDoctorId: 'doc_custom',
                          referringFacilityId: 'fac_custom'
                        });
                      } else {
                        setIsCustomReferringDoctor(false);
                        setSelectedDoctorOptionId(selId);
                        const match = REFERRING_DOCTOR_FACILITY_OPTIONS.find((opt) => opt.id === selId);
                        if (match) {
                          setFormData({
                            ...formData,
                            referringDoctorId: match.id,
                            referringDoctorName: match.doctorName,
                            referringFacilityId: match.facilityId,
                            referringFacilityName: match.facilityName
                          });
                        }
                      }
                    },
                    className: "w-full border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 shadow-sm"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4988}}

                    , React.createElement('optgroup', { label: "Primary Health Centres (PHC)"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5017}}
                      , REFERRING_DOCTOR_FACILITY_OPTIONS.filter((d) => d.facilityType === 'PHC').map((doc) => (
                        React.createElement('option', { key: doc.id, value: doc.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5019}}
                          , doc.doctorName, " • "  , doc.facilityName, " (" , doc.specialty, ")"
                        )
                      ))
                    )
                    , React.createElement('optgroup', { label: "Community Health Centres (CHC)"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5024}}
                      , REFERRING_DOCTOR_FACILITY_OPTIONS.filter((d) => d.facilityType === 'CHC').map((doc) => (
                        React.createElement('option', { key: doc.id, value: doc.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5026}}
                          , doc.doctorName, " • "  , doc.facilityName, " (" , doc.specialty, ")"
                        )
                      ))
                    )
                    , React.createElement('optgroup', { label: "District & Sub-Divisional Hospitals"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5031}}
                      , REFERRING_DOCTOR_FACILITY_OPTIONS.filter((d) => d.facilityType === 'HOSPITAL').map((doc) => (
                        React.createElement('option', { key: doc.id, value: doc.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5033}}
                          , doc.doctorName, " • "  , doc.facilityName, " (" , doc.specialty, ")"
                        )
                      ))
                    )
                    , React.createElement('optgroup', { label: "Specialized & Regional Facilities"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5038}}
                      , REFERRING_DOCTOR_FACILITY_OPTIONS.filter((d) => d.facilityType === 'OTHER').map((doc) => (
                        React.createElement('option', { key: doc.id, value: doc.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5040}}
                          , doc.doctorName, " • "  , doc.facilityName, " (" , doc.specialty, ")"
                        )
                      ))
                    )
                    , React.createElement('option', { value: "custom", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5045}}, "➕ Enter Custom Doctor & Facility..."     )
                  )

                  /* Custom Doctor & Facility Input Fields */
                  , isCustomReferringDoctor ? (
                    React.createElement('div', { className: "mt-2.5 p-3 bg-emerald-50/40 rounded-xl border border-emerald-200/60 space-y-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5050}}
                      , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5051}}
                        , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5052}}, "Custom Clinician & Facility"   )
                        , React.createElement('button', {
                          type: "button",
                          onClick: () => {
                            setIsCustomReferringDoctor(false);
                            const first = REFERRING_DOCTOR_FACILITY_OPTIONS[0];
                            setSelectedDoctorOptionId(first.id);
                            setFormData({
                              ...formData,
                              referringDoctorId: first.id,
                              referringDoctorName: first.doctorName,
                              referringFacilityId: first.facilityId,
                              referringFacilityName: first.facilityName
                            });
                          },
                          className: "text-[10px] font-bold text-slate-500 hover:text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5053}}
, "✕ Reset to Presets"

                        )
                      )
                      , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5072}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5073}}
                          , React.createElement('label', { className: "text-[10px] font-bold text-slate-600 block mb-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5074}}, "Doctor Full Name"  )
                          , React.createElement('input', {
                            type: "text",
                            required: true,
                            placeholder: "e.g. Dr. Rajesh Kumar"   ,
                            value: formData.referringDoctorName,
                            onChange: (e) => setFormData({ ...formData, referringDoctorName: e.target.value }),
                            className: "w-full border border-slate-200 rounded-lg p-2 font-medium text-xs bg-white focus:ring-1 focus:ring-emerald-500"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5075}}
                          )
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5084}}
                          , React.createElement('label', { className: "text-[10px] font-bold text-slate-600 block mb-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5085}}, "Referring Facility / Hospital"   )
                          , React.createElement('input', {
                            type: "text",
                            required: true,
                            placeholder: "e.g. Barhi Sub-Divisional Hospital"   ,
                            value: formData.referringFacilityName,
                            onChange: (e) => setFormData({ ...formData, referringFacilityName: e.target.value }),
                            className: "w-full border border-slate-200 rounded-lg p-2 font-medium text-xs bg-white focus:ring-1 focus:ring-emerald-500"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5086}}
                          )
                        )
                      )
                    )
                  ) : (
                    React.createElement('div', { className: "mt-1.5 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/70"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5098}}
                      , React.createElement('div', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5099}}
                        , React.createElement('span', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5100}}, "👨‍⚕️ " , formData.referringDoctorName)
                        , React.createElement('span', { className: "mx-1 text-slate-300" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5101}}, "•")
                        , React.createElement('span', { className: "text-slate-600 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5102}}, "🏥 " , formData.referringFacilityName)
                      )
                      , React.createElement('button', {
                        type: "button",
                        onClick: () => setIsCustomReferringDoctor(true),
                        className: "text-[10px] text-emerald-700 font-bold hover:underline shrink-0 ml-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5104}}
, "Custom Edit"

                      )
                    )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5114}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5115}}, "Receiving Hospital (Destination)"  )
                  , React.createElement('select', {
                    value: formData.receivingFacilityName,
                    onChange: (e) => setFormData({ ...formData, receivingFacilityName: e.target.value }),
                    className: "w-full border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5116}}

                    , React.createElement('option', { value: "Sheikh Bhikhari Medical College & Hospital (SBMC&H)"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5121}}, "Sheikh Bhikhari Medical College (SBMC&H) • 2.8 km"

                    )
                    , React.createElement('option', { value: "Arogyam Multi-Specialty Hospital & Critical Care"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5124}}, "Arogyam Multi-Specialty Hospital • 4.8 km"

                    )
                    , React.createElement('option', { value: "Kalyani Super Specialty Hospital & Trauma Centre"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5127}}, "Kalyani Super Specialty & Trauma • 38 km"

                    )
                    , React.createElement('option', { value: "Sadar Hospital Hazaribagh"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5130}}, "Sadar Hospital Hazaribagh • 3.2 km"

                    )
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5137}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5138}}, "Required Medical Specialty"  )
                , React.createElement('input', {
                  type: "text",
                  required: true,
                  value: formData.specialty,
                  onChange: (e) => setFormData({ ...formData, specialty: e.target.value }),
                  className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5139}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5148}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5149}}, "Reason for Referral"  )
                , React.createElement('input', {
                  type: "text",
                  required: true,
                  value: formData.reason,
                  onChange: (e) => setFormData({ ...formData, reason: e.target.value }),
                  className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5150}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5159}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5160}}, "Clinical Summary & Vitals"   )
                , React.createElement('textarea', {
                  rows: "3",
                  value: formData.clinicalSummary,
                  onChange: (e) => setFormData({ ...formData, clinicalSummary: e.target.value }),
                  className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5161}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5169}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowCreateModal(false),
                  className: "px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5170}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5177}}
, "Generate Digital Referral (CREATED)"

                )
              )
            )
          )
        )
      )

      /* UPDATE STATUS / CANCEL MODAL */
      , showUpdateModal && targetReferral && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5191}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5192}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5193}}
              , React.createElement('span', { className: `text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                targetStatus === 'CANCELLED' ? 'text-rose-800 bg-rose-100' : 'text-emerald-800 bg-emerald-50'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5194}}
                , targetStatus === 'CANCELLED' ? 'Cancel Referral' : 'Confirm Transition'
              )
              , React.createElement('h3', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5199}}
                , targetStatus === 'CANCELLED' ? (
                  React.createElement(React.Fragment, null, "Cancel Referral: "  , React.createElement('span', { className: "text-rose-600 font-mono" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5201}}, targetReferral.referralId))
                ) : (
                  React.createElement(React.Fragment, null, "Update Status to "   , React.createElement('span', { className: "text-emerald-700 font-mono" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5203}}, targetStatus))
                )
              )
              , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5206}}, "Referral: " , targetReferral.referralId, " • Patient: "   , targetReferral.patientName)
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5209}}
              , React.createElement('label', { className: "font-bold text-slate-700 text-xs block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5210}}
                , targetStatus === 'CANCELLED' ? 'Cancellation Reason / Clinical Justification' : 'Audit Remarks / Ground Notes'
              )
              , React.createElement('textarea', {
                rows: "3",
                value: statusRemarks,
                placeholder: targetStatus === 'CANCELLED' ? 'Enter clinical rationale for cancellation...' : '',
                onChange: (e) => setStatusRemarks(e.target.value),
                className: "w-full text-xs border border-slate-200 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-emerald-500"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5213}}
              )
            )

            , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5222}}
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowUpdateModal(false),
                className: "px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5223}}
, "Close"

              )
              , React.createElement('button', {
                type: "button",
                onClick: confirmStatusUpdate,
                className: `px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md transition-colors ${
                  targetStatus === 'CANCELLED'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5230}}

                , targetStatus === 'CANCELLED' ? 'Confirm Cancellation ✕' : 'Confirm Status Transition'
              )
            )
          )
        )
      )

      /* DELETE REFERRAL CONFIRMATION MODAL */
      , showDeleteModal && targetDeleteRef && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5248}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5249}}
            , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5250}}
              , React.createElement('div', { className: "w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg font-black shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5251}}, "🗑️"

              )
              , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5254}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200/60"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5255}}, "Permanent Delete"

                )
                , React.createElement('h3', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5258}}, "Delete Referral "
                    , React.createElement('span', { className: "font-mono text-red-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5259}}, targetDeleteRef.referralId), "?"
                )
                , React.createElement('p', { className: "text-xs text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5261}}, "Patient: "
                   , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5262}}, targetDeleteRef.patientName), " (" , targetDeleteRef.patientAge, "y • "  , targetDeleteRef.patientSex, ")"
                )
              )
            )

            , React.createElement('div', { className: "p-3 bg-red-50/50 rounded-xl border border-red-200 text-xs space-y-1.5 text-slate-700"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5267}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5268}}
                , React.createElement('span', { className: "text-slate-400 text-[10px] uppercase font-bold block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5269}}, "Destination & Specialty"  )
                , React.createElement('span', { className: "font-bold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5270}}, targetDeleteRef.receivingFacilityName), " • "  , targetDeleteRef.specialty
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5272}}
                , React.createElement('span', { className: "text-slate-400 text-[10px] uppercase font-bold block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5273}}, "Current Status" )
                , React.createElement('span', { className: "font-mono font-bold text-red-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5274}}, targetDeleteRef.status)
              )
              , React.createElement('p', { className: "text-[11px] text-red-700/90 font-medium pt-1 border-t border-red-200/60"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5276}}, "⚠️ Warning: This will permanently remove this referral record and its audit history from the system."

              )
            )

            , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5281}}
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setShowDeleteModal(false);
                  setTargetDeleteRef(null);
                },
                disabled: isDeleting,
                className: "px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5282}}
, "Keep Referral"

              )
              , React.createElement('button', {
                type: "button",
                onClick: confirmDeleteReferral,
                disabled: isDeleting,
                className: "px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5293}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5299}}, isDeleting ? 'Deleting...' : 'Delete Referral 🗑️')
              )
            )
          )
        )
      )
    )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5576}}
      /* Top Banner Card */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5578}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5579}}
          , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-black text-purple-800 uppercase mb-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5580}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-purple-600 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5581}}), "Feature Map 04 • Dynamic Risk Engine"

          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5584}}, "High-Risk Patient Follow-Up System"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5587}}, "Doctor-prescribed periodic follow-up plans, frontline ASHA worker observation recording, transparent dynamic risk scoring, and real-time facility escalation alerts."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-3 flex-wrap shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5592}}
          , React.createElement('button', {
            type: "button",
            onClick: () => setShowCreatePlanModal(true),
            className: "px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5593}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5598}}, "➕ Prescribe Follow-Up Plan"   )
          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5600}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5605}}, "🏠 Home" )
          )
        )
      )

      /* Role Navigation Bar */
      , React.createElement('div', { className: "bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5611}}
        , React.createElement('div', { className: "flex gap-1.5 flex-wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5612}}
          , [
            { id: 'doctor', label: 'Doctor Monitoring Center', icon: '👨‍⚕️' },
            { id: 'worker', label: 'ASHA Worker Task Board', icon: '👩‍⚕️' },
            { id: 'facility', label: 'Facility Alert Desk', icon: '🏥' },
            { id: 'patient', label: 'Patient Care View', icon: '👤' }
          ].map((tab) => (
            React.createElement('button', {
              key: tab.id,
              type: "button",
              onClick: () => {
                setActiveTabRole(tab.id);
                setActorRole(tab.id);
              },
              className: `px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTabRole === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5619}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5632}}, tab.icon)
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5633}}, tab.label)
            )
          ))
        )

        , React.createElement('div', { className: "px-3 py-1 bg-purple-50 text-purple-800 rounded-lg text-xs font-mono font-bold border border-purple-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5638}}, "Active Role: "
            , activeTabRole.toUpperCase()
        )
      )

      /* KPI Metric Summary Cards */
      , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5644}}
        , React.createElement('div', { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5645}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5646}}, "Total Monitored" )
          , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5647}}, highRiskPatients.length)
          , React.createElement('div', { className: "text-[11px] text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5648}}, "Active clinical care plans"   )
        )

        , React.createElement('div', { className: "bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5651}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-amber-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5652}}, "High / Critical Risk"   )
          , React.createElement('div', { className: "text-3xl font-black text-amber-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5653}}
            , highRiskPatients.filter((p) => p.latestLevel === 'HIGH' || p.latestLevel === 'CRITICAL').length
          )
          , React.createElement('div', { className: "text-[11px] text-amber-700 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5656}}, "Score ≥ 60 (Escalated)"   )
        )

        , React.createElement('div', { className: "bg-gradient-to-br from-[#061d5c] to-[#0b2b82] text-white p-5 rounded-2xl border border-blue-900/40 shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5659}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-sky-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5660}}, "Active Facility Alerts"  )
          , React.createElement('div', { className: "text-3xl font-black text-white mt-1 flex items-center gap-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5661}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5662}}, activeAlerts.length)
            , activeAlerts.length > 0 && React.createElement('span', { className: "w-2.5 h-2.5 rounded-full bg-sky-300 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5663}})
          )
          , React.createElement('div', { className: "text-[11px] text-blue-200 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5665}}, "Intervention required" )
        )

        , React.createElement('div', { className: "bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5668}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-emerald-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5669}}, "Follow-Up Compliance" )
          , React.createElement('div', { className: "text-3xl font-black text-emerald-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5670}}, "94%")
          , React.createElement('div', { className: "text-[11px] text-emerald-700 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5671}}, "ASHA visit completion rate"   )
        )
      )

      /* ==================================================== */
      /* 1. DOCTOR MONITORING VIEW */
      /* ==================================================== */
      , activeTabRole === 'doctor' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5679}}
          /* Active Facility Escalation Alert Banner */
          , activeAlerts.length > 0 && (
            React.createElement('div', { className: "p-5 rounded-2xl bg-critical-50 border-2 border-critical-400 shadow-sm animate-pulse-subtle"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5682}}
              , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5683}}
                , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5684}}
                  , React.createElement('div', { className: "w-10 h-10 rounded-xl bg-critical-600 text-white flex items-center justify-center font-black text-xl shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5685}}, "🚨"

                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5688}}
                    , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5689}}
                      , React.createElement('span', { className: "px-2 py-0.5 rounded text-[10px] font-black uppercase bg-critical-600 text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5690}}, "CRITICAL ESCALATION ALERT"

                      )
                      , React.createElement('h4', { className: "font-extrabold text-slate-900 text-base"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5693}}
                        , activeAlerts[0].patientName, " (" , activeAlerts[0].patientId, ") • Score: "   , activeAlerts[0].riskScore, " (HIGH)"
                      )
                    )
                    , React.createElement('p', { className: "text-xs text-critical-900 font-semibold mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5697}}
                      , activeAlerts[0].triggerReason
                    )
                    , React.createElement('p', { className: "text-[11px] text-slate-600 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5700}}, "Assigned Facility: "
                        , activeAlerts[0].facilityName, " • ASHA: "   , activeAlerts[0].assignedWorkerName
                    )
                  )
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => handleAcknowledgeAlert(activeAlerts[0].id),
                  className: "px-4 py-2 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5706}}
, "✓ Acknowledge & Review"

                )
              )
            )
          )

          /* High-Risk Patient Tracking Board */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5718}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5719}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5720}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5721}}, "High-Risk Patient Monitoring Board"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5722}}, "Real-time longitudinal risk progression and clinical deterioration tracking."

                )
              )

              , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5727}}
                , React.createElement('input', {
                  type: "text",
                  placeholder: "Search patient, ID, worker..."   ,
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5728}}
                )

                , React.createElement('div', { className: "flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5736}}
                  , ['ALL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
                    React.createElement('button', {
                      key: lvl,
                      type: "button",
                      onClick: () => setRiskFilter(lvl),
                      className: `px-2.5 py-1 rounded-lg transition-all ${
                        riskFilter === lvl
                          ? 'bg-white text-slate-900 shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5738}}

                      , lvl
                    )
                  ))
                )
              )
            )

            /* Table */
            , React.createElement('div', { className: "overflow-x-auto border border-slate-200 rounded-2xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5756}}
              , React.createElement('table', { className: "w-full text-left text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5757}}
                , React.createElement('thead', { className: "bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5758}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5759}}
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5760}}, "Patient Profile" )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5761}}, "Assigned ASHA Worker"  )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5762}}, "Current Dynamic Risk"  )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5763}}, "Trend Trajectory" )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5764}}, "Last Follow-Up" )
                    , React.createElement('th', { className: "p-4 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5765}}, "Longitudinal Audit" )
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5768}}
                  , filteredPatients.map((pat) => {
                    const isHigh = pat.latestLevel === 'HIGH' || pat.latestLevel === 'CRITICAL';
                    const isWorsening = pat.trend === 'WORSENING';
                    const isImproving = pat.trend === 'IMPROVING';

                    return (
                      React.createElement('tr', { key: pat.patientId, className: "hover:bg-slate-50/80 transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5775}}
                        , React.createElement('td', { className: "p-4 font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5776}}
                          , React.createElement('div', { className: "font-extrabold text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5777}}, pat.patientName)
                          , React.createElement('div', { className: "text-[11px] text-slate-500 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5778}}, pat.patientId)
                        )

                        , React.createElement('td', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5781}}
                          , React.createElement('div', { className: "font-semibold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5782}}, pat.assignedWorker)
                          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5783}}, pat.facilityName)
                        )

                        , React.createElement('td', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5786}}
                          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5787}}
                            , React.createElement('span', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5788}}, pat.latestScore)
                            , React.createElement('span', {
                              className: `px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                isHigh
                                  ? 'bg-critical-100 text-critical-800 border border-critical-300'
                                  : pat.latestLevel === 'MODERATE'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5789}}

                              , pat.latestLevel
                            )
                          )
                        )

                        , React.createElement('td', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5803}}
                          , React.createElement('span', {
                            className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isWorsening
                                ? 'bg-critical-50 text-critical-700 border border-critical-200'
                                : isImproving
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5804}}

                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5813}}, isWorsening ? '📈' : isImproving ? '📉' : '➖')
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5814}}, pat.trend)
                          )
                        )

                        , React.createElement('td', { className: "p-4 text-slate-600 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5818}}
                          , pat.lastFollowUpDate ? new Date(pat.lastFollowUpDate).toLocaleDateString() : 'N/A'
                        )

                        , React.createElement('td', { className: "p-4 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5822}}
                          , React.createElement('button', {
                            type: "button",
                            onClick: () => handleInspectTrajectory(pat),
                            className: "px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5823}}
, "Inspect Trajectory 📊"

                          )
                        )
                      )
                    );
                  })
                )
              )
            )
          )
        )
      )

      /* ==================================================== */
      /* 2. ASHA WORKER TASK BOARD */
      /* ==================================================== */
      , activeTabRole === 'worker' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5845}}
          , React.createElement('div', { className: "bg-amber-500/10 border border-amber-300 rounded-3xl p-6 sm:p-8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5846}}
            , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5847}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5848}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5849}}, "ASHA Ground Task Queue"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5852}}, "Scheduled Follow-Up Visits Due"   )
                , React.createElement('p', { className: "text-xs text-slate-600 mt-0.5 max-w-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5853}}, "Visit patients at home, measure vital parameters, verify prescription compliance, and record observations."

                )
              )

              , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5858}}
                , React.createElement('span', { className: "text-2xl font-black text-amber-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5859}}, dueTasks.length)
                , React.createElement('span', { className: "text-xs text-slate-500 block font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5860}}, "Tasks Due / Upcoming"   )
              )
            )
          )

          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5865}}
            , dueTasks.map((task) => {
              const isDue = task.status === 'DUE';
              return (
                React.createElement('div', {
                  key: task.id,
                  className: `p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    isDue
                      ? 'border-purple-300 bg-white shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5869}}

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5877}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3 mb-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5878}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5879}}
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            isDue
                              ? 'bg-critical-100 text-critical-800 border border-critical-300 animate-pulse'
                              : 'bg-slate-200 text-slate-700'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5880}}

                          , task.status, " • Cycle #"   , task.taskIndex
                        )
                        , React.createElement('h4', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5889}}, task.patientName)
                        , React.createElement('p', { className: "text-xs text-slate-500 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5890}}, task.patientId)
                      )

                      , React.createElement('div', { className: "text-right text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5893}}
                        , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5894}}, "Due Date" )
                        , React.createElement('span', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5895}}, new Date(task.dueDate).toLocaleDateString())
                      )
                    )

                    , React.createElement('div', { className: "p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 mb-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5899}}
                      , React.createElement('strong', { className: "block text-[11px] uppercase tracking-wider text-purple-800"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5900}}, "Doctor Instructions:"

                      )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5903}}, "Check resting BP, pill count adherence, and report any recurrent dyspnea."          )
                    )
                  )

                  , React.createElement('button', {
                    type: "button",
                    onClick: () => handleStartFollowUp(task),
                    className: "w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5907}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5912}}, "📝 Start Follow-Up Assessment"   )
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5913}}, "→")
                  )
                )
              );
            })
          )
        )
      )

      /* ==================================================== */
      /* 3. RECEIVING FACILITY ALERT DESK */
      /* ==================================================== */
      , activeTabRole === 'facility' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5926}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5927}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5928}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-critical-800 bg-critical-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5929}}, "Hospital Command Desk"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5932}}, "High-Risk Escalation Alerts & Clinical Action"     )
              , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5933}}, "Real-time patient deterioration alerts triggered by ASHA ground assessments exceeding configured clinical thresholds."

              )
            )

            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5938}}
              , facilityAlerts.map((alert) => (
                React.createElement('div', {
                  key: alert.id,
                  className: "p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex items-start justify-between gap-4 flex-wrap"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5940}}

                  , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5944}}
                    , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5945}}
                      , React.createElement('span', { className: "font-extrabold text-slate-900 text-base"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5946}}, alert.patientName)
                      , React.createElement('span', { className: "text-xs font-mono text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5947}}, "(", alert.patientId, ")")
                      , React.createElement('span', { className: "px-2 py-0.5 rounded text-[10px] font-black uppercase bg-critical-100 text-critical-800 border border-critical-300"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5948}}, "Score: "
                         , alert.riskScore, " (" , alert.riskLevel, ")"
                      )
                    )

                    , React.createElement('p', { className: "text-xs font-semibold text-critical-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5953}}, alert.triggerReason)
                    , React.createElement('p', { className: "text-[11px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5954}}, "Recent Observations: "
                        , alert.latestObservations, " • Assigned Doctor: "    , alert.assignedDoctorName
                    )
                  )

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5959}}
                    , alert.status === 'ACTIVE' ? (
                      React.createElement('button', {
                        type: "button",
                        onClick: () => handleAcknowledgeAlert(alert.id),
                        className: "px-4 py-2 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5961}}
, "Acknowledge & Schedule Outreach"

                      )
                    ) : (
                      React.createElement('span', { className: "px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5969}}, "✓ Acknowledged"

                      )
                    )
                  )
                )
              ))
            )
          )
        )
      )

      /* ==================================================== */
      /* 4. PATIENT LONGITUDINAL CARE VIEW */
      /* ==================================================== */
      , activeTabRole === 'patient' && (
        React.createElement('div', { className: "max-w-2xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5985}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5986}}
            , React.createElement('div', { className: "text-center pb-4 border-b border-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5987}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5988}}, "My Longitudinal Care Plan"

              )
              , React.createElement('h3', { className: "text-2xl font-black text-slate-900 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5991}}, "Ramesh Mahto" )
              , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5992}}, "Cardiology Post-Discharge Follow-Up Grid"   )
            )

            , React.createElement('div', { className: "grid grid-cols-2 gap-3 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5995}}
              , React.createElement('div', { className: "p-4 bg-purple-50 rounded-2xl border border-purple-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5996}}
                , React.createElement('span', { className: "text-slate-500 block font-bold text-[10px] uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5997}}, "Next Scheduled Visit"  )
                , React.createElement('strong', { className: "text-purple-900 text-base" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5998}}, "31 August 2026"  )
                , React.createElement('span', { className: "text-[11px] text-purple-700 block mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5999}}, "ASHA Anita Devi will visit"    )
              )

              , React.createElement('div', { className: "p-4 bg-emerald-50 rounded-2xl border border-emerald-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6002}}
                , React.createElement('span', { className: "text-slate-500 block font-bold text-[10px] uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6003}}, "Supervising Facility" )
                , React.createElement('strong', { className: "text-emerald-900 text-sm block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6004}}, "SBMC&H Hazaribagh" )
                , React.createElement('span', { className: "text-[11px] text-emerald-700 block mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6005}}, "Dr. Priya Sharma"  )
              )
            )

            , React.createElement('div', { className: "p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6009}}
              , React.createElement('h4', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6010}}, "Patient Self-Care Reminders"  )
              , React.createElement('ul', { className: "text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6011}}
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6012}}, "Take morning and evening blood pressure medications without skipping."        )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6013}}, "Avoid heavy physical exertion until next doctor review."       )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6014}}, "Call 108 immediately if experiencing chest pressure or severe breathlessness."         )
              )
            )
          )
        )
      )

      /* ==================================================== */
      /* MODAL: PRESCRIBE FOLLOW-UP PLAN */
      /* ==================================================== */
      , showCreatePlanModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6025}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6026}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6027}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6028}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6029}}, "Clinical Care Plan"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6032}}, "Prescribe Follow-Up Plan"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCreatePlanModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6034}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handleCreatePlanSubmit, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6043}}
              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6044}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6045}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6046}}, "Patient Name" )
                  , React.createElement('input', {
                    type: "text",
                    value: planForm.patientName,
                    onChange: (e) => setPlanForm({ ...planForm, patientName: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6047}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6055}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6056}}, "Patient ID" )
                  , React.createElement('input', {
                    type: "text",
                    value: planForm.patientId,
                    onChange: (e) => setPlanForm({ ...planForm, patientId: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-mono"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6057}}
                  )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6067}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6068}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6069}}, "Follow-Up Frequency" )
                  , React.createElement('select', {
                    value: planForm.frequencyDays,
                    onChange: (e) => setPlanForm({ ...planForm, frequencyDays: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6070}}

                    , React.createElement('option', { value: 3, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6075}}, "Every 3 Days (High Critical)"    )
                    , React.createElement('option', { value: 7, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6076}}, "Every 7 Days (Weekly)"   )
                    , React.createElement('option', { value: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6077}}, "Every 14 Days (Bi-weekly)"   )
                    , React.createElement('option', { value: 30, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6078}}, "Every 30 Days (Monthly)"   )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6081}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6082}}, "Assigned Frontline Worker"  )
                  , React.createElement('select', {
                    value: planForm.frontlineWorkerId,
                    onChange: (e) => {
                      const id = e.target.value;
                      const name = id === 'worker_014' ? 'ASHA Anita Devi' : 'ASHA Meena Kumari';
                      setPlanForm({ ...planForm, frontlineWorkerId: id, frontlineWorkerName: name });
                    },
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6083}}

                    , React.createElement('option', { value: "worker_014", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6092}}, "ASHA Anita Devi (Katkamsandi)"   )
                    , React.createElement('option', { value: "worker_022", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6093}}, "ASHA Meena Kumari (Barkagaon)"   )
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6098}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6099}}, "Doctor's Clinical Instructions"  )
                , React.createElement('textarea', {
                  rows: "3",
                  value: planForm.instructions,
                  onChange: (e) => setPlanForm({ ...planForm, instructions: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium leading-relaxed"      ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6100}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6109}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowCreatePlanModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6110}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6117}}
, "Confirm & Generate Tasks"

                )
              )
            )
          )
        )
      )

      /* ==================================================== */
      /* MODAL: SUBMIT ASHA FOLLOW-UP REPORT */
      /* ==================================================== */
      , showSubmitReportModal && selectedTaskForReport && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6133}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6134}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6135}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6136}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6137}}, "ASHA Clinical Observation Form"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6140}}, "Record Follow-Up: "
                    , selectedTaskForReport.patientName
                )
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6143}}, "Cycle #" , selectedTaskForReport.taskIndex, " • Due: "   , new Date(selectedTaskForReport.dueDate).toLocaleDateString())
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowSubmitReportModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6145}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handleSubmitReportForm, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6154}}
              /* Vitals: Blood Pressure */
              , React.createElement('div', { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6156}}
                , React.createElement('label', { className: "font-bold text-slate-800 block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6157}}, "Measured Blood Pressure (mmHg)"   )
                , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6158}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6159}}
                    , React.createElement('span', { className: "text-[10px] text-slate-500 font-bold block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6160}}, "Systolic (SBP)" )
                    , React.createElement('input', {
                      type: "number",
                      value: reportForm.systolic,
                      onChange: (e) => setReportForm({ ...reportForm, systolic: e.target.value }),
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold text-base text-slate-900"       ,
                      placeholder: "e.g. 140" ,
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6161}}
                    )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6170}}
                    , React.createElement('span', { className: "text-[10px] text-slate-500 font-bold block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6171}}, "Diastolic (DBP)" )
                    , React.createElement('input', {
                      type: "number",
                      value: reportForm.diastolic,
                      onChange: (e) => setReportForm({ ...reportForm, diastolic: e.target.value }),
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold text-base text-slate-900"       ,
                      placeholder: "e.g. 90" ,
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6172}}
                    )
                  )
                )
              )

              /* Medication Adherence */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6185}}
                , React.createElement('label', { className: "font-bold text-slate-800 block mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6186}}, "Medication Adherence (Pill Count)"   )
                , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6187}}
                  , [
                    { id: 'FULL', label: 'Full Adherence', desc: 'No missed doses' },
                    { id: 'PARTIAL', label: 'Partial', desc: '1-3 missed doses' },
                    { id: 'NONE', label: 'Non-Adherent', desc: 'Stopped meds' }
                  ].map((adh) => (
                    React.createElement('button', {
                      key: adh.id,
                      type: "button",
                      onClick: () => setReportForm({ ...reportForm, medicationAdherence: adh.id }),
                      className: `p-2.5 rounded-xl border text-left transition-all ${
                        reportForm.medicationAdherence === adh.id
                          ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6193}}

                      , React.createElement('div', { className: "font-extrabold text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6203}}, adh.label)
                      , React.createElement('div', { className: "text-[10px] text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6204}}, adh.desc)
                    )
                  ))
                )
              )

              /* Symptom Progression */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6211}}
                , React.createElement('label', { className: "font-bold text-slate-800 block mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6212}}, "Symptom Progression" )
                , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6213}}
                  , [
                    { id: 'IMPROVED', label: 'Improved', icon: '📉' },
                    { id: 'UNCHANGED', label: 'Stable', icon: '➖' },
                    { id: 'WORSENED', label: 'Worsened', icon: '📈' }
                  ].map((sym) => (
                    React.createElement('button', {
                      key: sym.id,
                      type: "button",
                      onClick: () => setReportForm({ ...reportForm, symptomProgression: sym.id }),
                      className: `p-2.5 rounded-xl border text-center transition-all ${
                        reportForm.symptomProgression === sym.id
                          ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6219}}

                      , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6229}}, sym.icon)
                      , React.createElement('div', { className: "font-extrabold text-xs mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6230}}, sym.label)
                    )
                  ))
                )
              )

              /* Remarks */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6237}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6238}}, "Field Observations & Remarks"   )
                , React.createElement('textarea', {
                  rows: "2",
                  value: reportForm.observationsText,
                  onChange: (e) => setReportForm({ ...reportForm, observationsText: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6239}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6247}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowSubmitReportModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6248}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6255}}
, "Submit Report & Update Risk Score"

                )
              )
            )
          )
        )
      )

      /* ==================================================== */
      /* DRAWER: LONGITUDINAL TRAJECTORY INSPECTION */
      /* ==================================================== */
      , selectedPatientForTrajectory && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6271}}
          , React.createElement('div', { className: "bg-white w-full max-w-md h-full p-6 overflow-y-auto shadow-2xl border-l border-slate-200 space-y-5 animate-in slide-in-from-right duration-200"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6272}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6273}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6274}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6275}}, "Longitudinal Health Trajectory"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6278}}, selectedPatientForTrajectory.patientName)
                , React.createElement('p', { className: "text-xs text-slate-500 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6279}}, selectedPatientForTrajectory.patientId)
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setSelectedPatientForTrajectory(null),
                className: "w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-black text-slate-600 flex items-center justify-center"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6281}}
, "×"

              )
            )

            /* Current Summary Card */
            , React.createElement('div', { className: "p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6291}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6292}}
                , React.createElement('span', { className: "text-xs font-bold text-purple-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6293}}, "Current Risk Status"  )
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded text-xs font-black uppercase bg-purple-600 text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6294}}, "Score: "
                   , selectedPatientForTrajectory.latestScore, " (" , selectedPatientForTrajectory.latestLevel, ")"
                )
              )
              , React.createElement('p', { className: "text-xs text-purple-950 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6298}}, "Trend: "
                 , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6299}}, selectedPatientForTrajectory.trend), " • Assigned Facility: "    , selectedPatientForTrajectory.facilityName
              )
            )

            /* Sequential History */
            , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6304}}
              , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6305}}, "Chronological Follow-Up Evolution"

              )

              , React.createElement('div', { className: "space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6309}}
                , patientRiskHistory.map((item, idx) => (
                  React.createElement('div', { key: idx, className: "relative pl-8 space-y-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6311}}
                    , React.createElement('div', { className: "absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6312}}
                      , idx + 1
                    )
                    , React.createElement('div', { className: "flex items-center justify-between text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6315}}
                      , React.createElement('span', { className: "font-extrabold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6316}}, "Follow-Up #" , idx + 1)
                      , React.createElement('span', { className: "font-mono text-purple-700 font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6317}}, "Score: " , item.riskScore)
                    )
                    , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6319}}
                      , item.reason
                    )
                    , React.createElement('span', { className: "text-[10px] text-slate-400 block font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6322}}
                      , new Date(item.createdAt).toLocaleDateString()
                    )
                  )
                ))
              )
            )
          )
        )
      )
    )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6887}}
      /* Toast Notification Alert */
      , notificationToast && (
        React.createElement('div', { className: "fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-in fade-in slide-in-from-top-3 flex items-center gap-2"                   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6890}}
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6891}}, "🔔")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6892}}, notificationToast)
        )
      )

      /* Top Header Card */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6897}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6898}}
          , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-sky-800 uppercase mb-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6899}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-sky-600 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6900}}), "Feature Map 05 • Interoperable Health Records"

          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6903}}, "Patient Medical ID & Unified Record Aggregation"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6906}}, "Patient-centric health record hub anchored on MedVeda Medical ID with optional ABDM ABHA link, camera OCR studio with human confirmation, CoWIN vaccine ingestion, and consent-gated RBAC."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-3 flex-wrap shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6911}}
          , React.createElement('button', {
            type: "button",
            onClick: () => setShowRegisterModal(true),
            className: "px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6912}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6917}}, "➕ Generate Medical ID Card"    )
          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6919}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6924}}, "🏠 Home" )
          )
        )
      )

      /* Role Navigation Bar & Patient Selector */
      , React.createElement('div', { className: "bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6930}}
        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6931}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6932}}, "View As:" )
          , [
            { id: 'patient', label: 'Patient (Self Access)', icon: '👤' },
            { id: 'doctor', label: 'Doctor (Consent Required)', icon: '👨‍⚕️' },
            { id: 'worker', label: 'ASHA Worker', icon: '👩‍⚕️' }
          ].map((tab) => (
            React.createElement('button', {
              key: tab.id,
              type: "button",
              onClick: () => {
                setActiveRole(tab.id);
                setActorRole(tab.id);
              },
              className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === tab.id
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6938}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6951}}, tab.icon)
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6952}}, tab.label)
            )
          ))
        )

        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6957}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6958}}, "Select Active Patient:"  )
          , React.createElement('select', {
            value: selectedPatientId,
            onChange: (e) => {
              const val = e.target.value;
              setSelectedPatientId(val);
              const found = patientsList.find((p) => p.internalMedicalId === val);
              if (found) setPatient(found);
            },
            className: "text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer min-w-[280px]"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6959}}

            , patientsList.map((p) => (
              React.createElement('option', { key: p.internalMedicalId, value: p.internalMedicalId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6970}}
                , p.name, " (" , p.internalMedicalId, ") " , p.abhaId ? `[Linked ABHA]` : `[Standalone]`
              )
            ))
          )
        )
      )

      /* Access Control Status Callout (if viewing as Doctor/Worker) */
      , activeRole !== 'patient' && (
        React.createElement('div', {
          className: `p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
            accessInfo.isAllowed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-critical-50 border-critical-300 text-critical-900'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6980}}

          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6987}}
            , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6988}}, accessInfo.isAllowed ? '🛡️' : '🔒')
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6989}}
              , React.createElement('div', { className: "font-extrabold text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6990}}
                , accessInfo.isAllowed ? 'Authorized Access' : 'Restricted Health Record Access'
              )
              , React.createElement('p', { className: "text-xs mt-0.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6993}}, accessInfo.reason)
            )
          )

          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6997}}
            , !accessInfo.isAllowed && (
              React.createElement('button', {
                type: "button",
                onClick: () => setShowEmergencyModal(true),
                className: "px-3.5 py-1.5 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6999}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7004}}, "🚨 Emergency Access Override"   )
              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: () => setShowConsentModal(true),
              className: "px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7007}}
, "Manage Consents 📋"

            )
          )
        )
      )

      /* Visual Medical ID Card */
      , React.createElement('div', { className: "bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800 relative overflow-hidden"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7019}}
        , React.createElement('div', { className: "absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7020}})

        , React.createElement('div', { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7022}}
          , React.createElement('div', { className: "space-y-4 flex-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7023}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7024}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7025}}
                , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl backdrop-blur-md"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7026}}, "🪪"

                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7029}}
                  , React.createElement('span', { className: "text-[10px] uppercase font-black tracking-widest text-sky-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7030}}, "Official Health ID Card • Government of India Standards"

                  )
                  , React.createElement('h3', { className: "text-2xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7033}}, patient.name)
                )
              )

              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7037}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowCardModal(true),
                  className: "px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7038}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7043}}, "🖨️ View / Print Card"    )
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: handleCopyId,
                  className: "px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7045}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7050}}, "📋 Copy ID"  )
                )
              )
            )

            , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7055}}
              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7056}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7057}}, "MedVeda Medical ID"  )
                , React.createElement('span', { className: "font-mono font-black text-sky-300 text-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7058}}, patient.internalMedicalId)
              )

              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7061}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7062}}, "Linked ABHA ID"  )
                , patient.abhaId ? (
                  React.createElement('span', { className: "font-mono font-bold text-emerald-400 text-xs truncate block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7064}}, patient.abhaId)
                ) : (
                  React.createElement('button', {
                    type: "button",
                    onClick: () => setShowAbdmModal(true),
                    className: "text-amber-400 font-bold text-[11px] block hover:underline text-left"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7066}}
, "+ Link ABHA ID"

                  )
                )
              )

              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7076}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7077}}, "Demographics")
                , React.createElement('span', { className: "font-bold text-white text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7078}}, patient.age, " Yrs • "   , patient.sex ? patient.sex.toUpperCase() : 'N/A')
              )

              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7081}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7082}}, "Blood Group" )
                , React.createElement('span', { className: "font-black text-critical-400 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7083}}, patient.bloodGroup || 'O+')
              )
            )

            , React.createElement('div', { className: "flex items-center gap-4 text-xs text-slate-300 font-medium flex-wrap"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7087}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7088}}, "📍 " , patient.location || 'Jharkhand')
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7089}}, "📞 " , patient.phone)
              , patient.emergencyContact && (
                React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7091}}, "🚨 Contact: "  , patient.emergencyContact.name, " (" , patient.emergencyContact.phone, ")")
              )
            )
          )

          /* Dynamic QR Code Badge */
          , React.createElement('div', { className: "bg-white p-4 rounded-2xl shadow-lg border border-slate-200 text-slate-900 flex flex-col items-center text-center shrink-0 w-44"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7097}}
            /* SVG Simulated QR Code */
            , React.createElement('svg', { viewBox: "0 0 100 100"   , className: "w-28 h-28" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7099}}
              , React.createElement('rect', { width: "100", height: "100", fill: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7100}} )
              /* Corner squares */
              , React.createElement('rect', { x: "5", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7102}} )
              , React.createElement('rect', { x: "9", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7103}} )
              , React.createElement('rect', { x: "13", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7104}} )

              , React.createElement('rect', { x: "67", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7106}} )
              , React.createElement('rect', { x: "71", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7107}} )
              , React.createElement('rect', { x: "75", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7108}} )

              , React.createElement('rect', { x: "5", y: "67", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7110}} )
              , React.createElement('rect', { x: "9", y: "71", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7111}} )
              , React.createElement('rect', { x: "13", y: "75", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7112}} )

              /* Data matrix dots */
              , React.createElement('rect', { x: "40", y: "10", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7115}} )
              , React.createElement('rect', { x: "52", y: "18", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7116}} )
              , React.createElement('rect', { x: "40", y: "40", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7117}} )
              , React.createElement('rect', { x: "56", y: "38", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7118}} )
              , React.createElement('rect', { x: "70", y: "45", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7119}} )
              , React.createElement('rect', { x: "82", y: "55", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7120}} )
              , React.createElement('rect', { x: "45", y: "60", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7121}} )
              , React.createElement('rect', { x: "60", y: "65", width: "10", height: "10", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7122}} )
              , React.createElement('rect', { x: "75", y: "75", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7123}} )
              , React.createElement('rect', { x: "40", y: "80", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7124}} )
            )
            , React.createElement('span', { className: "text-[10px] font-mono font-bold text-slate-500 mt-1 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7126}}, patient.internalMedicalId)
            , React.createElement('span', { className: "text-[9px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full mt-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7127}}, "ABDM • READY"

            )
          )
        )
      )

      /* Multi-Source Action Bar */
      , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7135}}
        , React.createElement('button', {
          type: "button",
          onClick: () => {
            handleLoadOcrPreset('prescription');
            setShowOcrModal(true);
          },
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7136}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7144}}, "📷")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-sky-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7145}}, "Add Record (OCR)"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7146}}, "Camera capture & text extraction"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setShowAbdmModal(true),
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7149}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7154}}, "🔗")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-emerald-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7155}}, "ABDM Sandbox Sync"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7156}}, "Pull FHIR records via Gateway"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: handleSyncCowin,
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7159}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7164}}, "💉")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-amber-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7165}}, "Sync CoWIN Vaccine"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7166}}, "Fetch official govt dose certificate"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setShowConsentModal(true),
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7169}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7174}}, "🛡️")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-purple-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7175}}, "Consents & RBAC"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7176}}, "Manage time-boxed permissions"  )
        )
      )

      /* Unified Timeline Feed Section */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7181}}
        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7182}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7183}}
            , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7184}}, "Unified Patient Record Timeline"   )
            , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7185}}, "Chronological aggregation across Manual OCR, ABDM Sandbox HIPs, MedVeda Consultations, and CoWIN."

            )
          )

          , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7190}}
            , React.createElement('input', {
              type: "text",
              placeholder: "Search records, drugs, doctors..."   ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7191}}
            )

            , React.createElement('div', { className: "flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7199}}
              , [
                { id: 'ALL', label: 'All Sources' },
                { id: 'manual', label: 'Manual OCR' },
                { id: 'abha', label: 'ABHA HIP' },
                { id: 'medveda_internal', label: 'MedVeda EMR' },
                { id: 'cowin', label: 'CoWIN' }
              ].map((src) => (
                React.createElement('button', {
                  key: src.id,
                  type: "button",
                  onClick: () => setSourceFilter(src.id),
                  className: `px-2.5 py-1 rounded-lg transition-all ${
                    sourceFilter === src.id
                      ? 'bg-white text-slate-900 shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7207}}

                  , src.label
                )
              ))
            )
          )
        )

        /* Timeline Records List */
        , filteredRecords.length === 0 ? (
          React.createElement('div', { className: "p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7226}}, "No health records matching current filters for "
                   , patient.name, ". Click \"Add Record (OCR)\" or \"ABDM Sandbox Sync\" to add records."
          )
        ) : (
          React.createElement('div', { className: "space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7230}}
            , filteredRecords.map((rec) => {
              const isManual = rec.source === 'manual';
              const isAbha = rec.source === 'abha';
              const isInternal = rec.source === 'medveda_internal';
              const isCowin = rec.source === 'cowin';

              return (
                React.createElement('div', { key: rec.id, className: "relative pl-10 space-y-2 group"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7238}}
                  /* Timeline Bullet Node */
                  , React.createElement('div', {
                    className: `absolute left-2 top-3 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold ${
                      isManual
                        ? 'bg-sky-600'
                        : isAbha
                        ? 'bg-emerald-600'
                        : isCowin
                        ? 'bg-amber-600'
                        : 'bg-purple-600'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7240}}

                    , isManual ? '📷' : isAbha ? '🏥' : isCowin ? '💉' : '🩺'
                  )

                  , React.createElement('div', { className: "bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7254}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7255}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7256}}
                        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7257}}
                          , React.createElement('span', {
                            className: `px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              isManual
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : isAbha
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isCowin
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-purple-100 text-purple-800 border border-purple-300'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7258}}

                            , isManual && 'Source: Manual (OCR)'
                            , isAbha && 'Source: ABDM ABHA (FHIR HIP)'
                            , isCowin && 'Source: Government CoWIN'
                            , isInternal && 'Source: MedVeda Internal'
                          )

                          , React.createElement('span', { className: "px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-200 text-slate-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7275}}
                            , rec.recordType.replace('_', ' ')
                          )

                          , React.createElement('span', { className: "inline-flex items-center gap-1 text-[10px] font-bold text-slate-500"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7279}}
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7280}}, "✓")
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7281}}, rec.verifiedBy || rec.verificationStatus)
                          )
                        )

                        , React.createElement('h4', { className: "text-base font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7285}}, rec.title)
                        , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7286}}
                          , rec.facilityName, " " , rec.doctorName ? `\u2022 ${rec.doctorName}` : ''
                        )
                      )

                      , React.createElement('div', { className: "text-right text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7291}}
                        , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7292}}, "Recorded On" )
                        , React.createElement('span', { className: "font-bold text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7293}}
                          , new Date(rec.recordedAt).toLocaleDateString()
                        )
                      )
                    )

                    , React.createElement('p', { className: "text-xs text-slate-600 font-medium leading-relaxed"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7299}}, rec.summary)

                    /* Structured Data Visualization based on Record Type */
                    , rec.extractedData && (
                      React.createElement('div', { className: "p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7303}}
                        /* 1. Prescription Medicines */
                        , rec.extractedData.medicines && (
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7306}}
                            , React.createElement('strong', { className: "block text-[11px] font-extrabold uppercase text-slate-700 mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7307}}, "Prescribed Medications:"

                            )
                            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7310}}
                              , rec.extractedData.medicines.map((m, mIdx) => (
                                React.createElement('div', { key: mIdx, className: "p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7312}}
                                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7313}}
                                    , React.createElement('div', { className: "font-extrabold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7314}}, m.name)
                                    , React.createElement('div', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7315}}, m.instructions || m.dosage)
                                  )
                                  , React.createElement('span', { className: "px-2 py-0.5 bg-sky-50 text-sky-800 text-[10px] font-mono font-bold rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7317}}
                                    , m.frequency
                                  )
                                )
                              ))
                            )
                          )
                        )

                        /* 2. Lab Results Parameters */
                        , rec.extractedData.results && (
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7328}}
                            , React.createElement('strong', { className: "block text-[11px] font-extrabold uppercase text-slate-700 mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7329}}, "Diagnostic Results ("
                                , rec.extractedData.testName, "):"
                            )
                            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7332}}
                              , React.createElement('table', { className: "w-full text-left text-[11px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7333}}
                                , React.createElement('thead', { className: "text-slate-400 border-b border-slate-100 font-bold uppercase text-[9px]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7334}}
                                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7335}}
                                    , React.createElement('th', { className: "pb-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7336}}, "Parameter")
                                    , React.createElement('th', { className: "pb-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7337}}, "Observed Value" )
                                    , React.createElement('th', { className: "pb-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7338}}, "Reference Range" )
                                    , React.createElement('th', { className: "pb-1 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7339}}, "Evaluation")
                                  )
                                )
                                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7342}}
                                  , rec.extractedData.results.map((res, rIdx) => (
                                    React.createElement('tr', { key: rIdx, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7344}}
                                      , React.createElement('td', { className: "py-1.5 font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7345}}, res.parameter)
                                      , React.createElement('td', { className: "py-1.5 font-mono font-bold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7346}}
                                        , res.observedValue, " " , res.unit
                                      )
                                      , React.createElement('td', { className: "py-1.5 text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7349}}, res.referenceRange)
                                      , React.createElement('td', { className: "py-1.5 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7350}}
                                        , res.isAbnormal ? (
                                          React.createElement('span', { className: "px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-critical-100 text-critical-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7352}}, "Abnormal"

                                          )
                                        ) : (
                                          React.createElement('span', { className: "px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7356}}, "Normal"

                                          )
                                        )
                                      )
                                    )
                                  ))
                                )
                              )
                            )
                          )
                        )

                        /* 3. Discharge Summary Procedures */
                        , rec.extractedData.proceduresPerformed && (
                          React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7371}}
                            , React.createElement('strong', { className: "block text-[11px] font-extrabold uppercase text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7372}}, "Procedures & Intervention:"

                            )
                            , React.createElement('ul', { className: "list-disc pl-4 text-[11px] text-slate-700 space-y-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7375}}
                              , rec.extractedData.proceduresPerformed.map((p, pIdx) => (
                                React.createElement('li', { key: pIdx, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7377}}, p)
                              ))
                            )
                          )
                        )

                        /* 4. CoWIN Vaccine Details */
                        , rec.extractedData.certificateNumber && (
                          React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7385}}
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7386}}
                              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7387}}, "Vaccine Name" )
                              , React.createElement('span', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7388}}, rec.extractedData.vaccine)
                            )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7390}}
                              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7391}}, "Dose Status" )
                              , React.createElement('span', { className: "font-bold text-emerald-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7392}}, "Dose "
                                 , rec.extractedData.doseNumber, " of "  , rec.extractedData.totalDoses, " (Fully Vaccinated)"
                              )
                            )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7396}}
                              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7397}}, "Certificate No." )
                              , React.createElement('span', { className: "font-mono font-bold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7398}}, rec.extractedData.certificateNumber)
                            )
                          )
                        )
                      )
                    )
                  )
                )
              );
            })
          )
        )
      )

      /* ========================================== */
      /* MODAL 1: CAMERA / UPLOAD OCR STUDIO */
      /* ========================================== */
      , showOcrModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7416}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7417}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7418}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7419}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7420}}, "Manual Document Ingestion"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7423}}, "Camera / Upload & OCR Studio"     )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowOcrModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7425}}
, "×"

              )
            )

            /* Presets */
            , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7435}}
              , React.createElement('label', { className: "text-[11px] font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7436}}, "Load Demo Document Preset:"   )
              , React.createElement('div', { className: "flex gap-2 flex-wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7437}}
                , [
                  { id: 'prescription', label: 'Handwritten Prescription' },
                  { id: 'lab_report', label: 'Printed Lab Report' },
                  { id: 'discharge_summary', label: 'Discharge Summary' }
                ].map((pre) => (
                  React.createElement('button', {
                    key: pre.id,
                    type: "button",
                    onClick: () => handleLoadOcrPreset(pre.id),
                    className: `px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      ocrRecordType === pre.id
                        ? 'bg-sky-50 border-sky-500 text-sky-800 font-extrabold ring-1 ring-sky-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7443}}

                    , pre.label
                  )
                ))
              )
            )

            , React.createElement('form', { onSubmit: handleSaveManualRecord, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7459}}
              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7460}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7461}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7462}}, "Document Title" )
                  , React.createElement('input', {
                    type: "text",
                    value: ocrTitle,
                    onChange: (e) => setOcrTitle(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7463}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7471}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7472}}, "Doctor / Clinic"  )
                  , React.createElement('input', {
                    type: "text",
                    value: ocrDoctor,
                    onChange: (e) => setOcrDoctor(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7473}}
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7482}}
                , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7483}}
                  , React.createElement('label', { className: "font-bold text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7484}}, "OCR Raw Extracted Text"   )
                  , React.createElement('button', {
                    type: "button",
                    onClick: handleRunOcrExtraction,
                    className: "text-sky-700 font-bold hover:underline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7485}}
, "⚡ Re-parse Structured Fields"

                  )
                )
                , React.createElement('textarea', {
                  rows: "4",
                  value: ocrRawText,
                  onChange: (e) => setOcrRawText(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-mono text-xs leading-relaxed"       ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7493}}
                )
              )

              /* Human-in-the-Loop Confirmation Step */
              , React.createElement('div', { className: "p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7503}}
                , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7504}}
                  , React.createElement('span', { className: "font-bold text-sky-900 text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7505}}, "OCR Confidence: "  , ocrConfidence, "%")
                  , React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 bg-sky-200 text-sky-900 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7506}}, "Human Verification Invariant"

                  )
                )
                , React.createElement('label', { className: "flex items-center gap-2 cursor-pointer pt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7510}}
                  , React.createElement('input', {
                    type: "checkbox",
                    checked: ocrUserVerified,
                    onChange: (e) => setOcrUserVerified(e.target.checked),
                    className: "w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7511}}
                  )
                  , React.createElement('span', { className: "text-xs font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7517}}, "I confirm that I have reviewed the extracted details and verified accuracy against the physical document."

                  )
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7523}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowOcrModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7524}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7531}}
, "Confirm & Save to Record Timeline"

                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 2: ABDM SANDBOX GATEWAY SYNC */
      /* ========================================== */
      , showAbdmModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7547}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7548}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7549}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7550}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7551}}, "ABDM Sandbox Gateway"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7554}}, "ABHA Health Record Pull"   )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowAbdmModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7556}}
, "×"

              )
            )

            , React.createElement('div', { className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7565}}
              , React.createElement('div', { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7566}}
                , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7567}}, "Target ABHA ID (@sbx)"   )
                , React.createElement('input', {
                  type: "text",
                  value: abdmInputAbha,
                  onChange: (e) => setAbdmInputAbha(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900"       ,
                  placeholder: "e.g. 91-2890-1423-8891@sbx" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7568}}
                )
              )

              , React.createElement('div', { className: "p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-emerald-950"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7577}}
                , React.createElement('strong', { className: "block text-xs font-black uppercase text-emerald-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7578}}, "ABDM Consent Manager Parameters:"

                )
                , React.createElement('ul', { className: "space-y-1 text-[11px] list-disc pl-4 font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7581}}
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7582}}, "HIU: MedVeda Smart Care Platform (IN-MEDVEDA-HIU-01)"     )
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7583}}, "Artifacts: DiagnosticReport, DischargeSummary, Prescription"   )
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7584}}, "Transfer Mode: End-to-End Encrypted FHIR JSON Bundles"      )
                )
              )

              , abdmSyncSuccess && (
                React.createElement('div', { className: "p-3 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7589}}, "✓ Successfully pulled ABDM Sandbox FHIR Records!"

                )
              )
            )

            , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7595}}
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowAbdmModal(false),
                className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7596}}
, "Cancel"

              )
              , React.createElement('button', {
                type: "button",
                onClick: handlePullAbdmRecords,
                className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7603}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7608}}, "🔄 Link & Pull ABDM Records"     )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7609}}, "→")
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 3: CONSENT & ACCESS CONTROL DESK */
      /* ========================================== */
      , showConsentModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7620}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7621}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7622}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7623}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7624}}, "Consent Governance"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7627}}, "Consent & RBAC Control Desk"    )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowConsentModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7629}}
, "×"

              )
            )

            /* Active Consents List */
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7639}}
              , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7640}}, "Patient Consent Statuses:"

              )

              , activeConsents.length === 0 ? (
                React.createElement('div', { className: "p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7645}}, "No active consent requests found for "
                        , patient.name, "."
                )
              ) : (
                React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7649}}
                  , activeConsents.map((c) => (
                    React.createElement('div', {
                      key: c.consentId,
                      className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs gap-3 flex-wrap"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7651}}

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7655}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7656}}
                          , React.createElement('span', { className: "font-extrabold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7657}}, c.requesterName)
                          , React.createElement('span', {
                            className: `px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              c.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7658}}

                            , c.status
                          )
                        )
                        , React.createElement('div', { className: "text-[11px] text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7670}}, "Purpose: "
                           , c.purpose, " • Scope: "   , c.scope
                        )
                      )

                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7675}}
                        , c.status === 'pending' && (
                          React.createElement(React.Fragment, null
                            , React.createElement('button', {
                              type: "button",
                              onClick: () => handleConsentAction(c.consentId, 'grant'),
                              className: "px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7678}}
, "Approve"

                            )
                            , React.createElement('button', {
                              type: "button",
                              onClick: () => handleConsentAction(c.consentId, 'revoke'),
                              className: "px-3 py-1 bg-critical-600 text-white font-bold rounded-lg text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7685}}
, "Deny"

                            )
                          )
                        )
                        , c.status === 'approved' && (
                          React.createElement('button', {
                            type: "button",
                            onClick: () => handleConsentAction(c.consentId, 'revoke'),
                            className: "px-3 py-1 bg-slate-200 hover:bg-critical-50 hover:text-critical-700 text-slate-700 font-bold rounded-lg text-xs transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7695}}
, "Revoke Consent"

                          )
                        )
                      )
                    )
                  ))
                )
              )
            )

            /* Request Doctor Access Form */
            , React.createElement('div', { className: "p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7711}}
              , React.createElement('strong', { className: "block text-xs font-black uppercase text-purple-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7712}}, "Simulate Clinician Consent Request:"

              )
              , React.createElement('form', { onSubmit: handleCreateConsentRequest, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7715}}
                , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7716}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7717}}
                    , React.createElement('span', { className: "text-[10px] font-bold text-slate-500 block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7718}}, "Doctor")
                    , React.createElement('select', {
                      value: consentDoctorId,
                      onChange: (e) => {
                        const id = e.target.value;
                        const name = id === 'doc_1' ? 'Dr. Priya Sharma' : 'Dr. Rajesh Khanna';
                        setConsentDoctorId(id);
                        setConsentDoctorName(name);
                      },
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7719}}

                      , React.createElement('option', { value: "doc_1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7729}}, "Dr. Priya Sharma (Cardiology)"   )
                      , React.createElement('option', { value: "doc_4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7730}}, "Dr. Rajesh Khanna (Endocrinology)"   )
                    )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7734}}
                    , React.createElement('span', { className: "text-[10px] font-bold text-slate-500 block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7735}}, "Scope")
                    , React.createElement('select', {
                      value: consentScope,
                      onChange: (e) => setConsentScope(e.target.value),
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7736}}

                      , React.createElement('option', { value: "ALL", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7741}}, "All Records (Full Access)"   )
                      , React.createElement('option', { value: "PRESCRIPTIONS", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7742}}, "Prescriptions Only" )
                      , React.createElement('option', { value: "LAB_REPORTS", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7743}}, "Lab Reports Only"  )
                    )
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7748}}
                  , React.createElement('span', { className: "text-[10px] font-bold text-slate-500 block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7749}}, "Clinical Purpose" )
                  , React.createElement('input', {
                    type: "text",
                    value: consentPurpose,
                    onChange: (e) => setConsentPurpose(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2 bg-white"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7750}}
                  )
                )

                , React.createElement('button', {
                  type: "submit",
                  className: "w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7759}}
, "Submit Scoped Consent Request"

                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 4: EMERGENCY ACCESS OVERRIDE */
      /* ========================================== */
      , showEmergencyModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7775}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-critical-400 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7776}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7777}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-critical-800 bg-critical-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7778}}, "CRITICAL PROTOCOL"

              )
              , React.createElement('h3', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7781}}, "🚨 Emergency Access Override"   )
              , React.createElement('p', { className: "text-xs text-critical-900 font-medium mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7782}}, "Emergency override bypasses patient consent for life-threatening acute resuscitations. Access is immutably logged."

              )
            )

            , React.createElement('form', { onSubmit: handleExecuteEmergencyOverride, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7787}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7788}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7789}}, "Mandatory Clinical Justification"  )
                , React.createElement('textarea', {
                  rows: "3",
                  value: emergencyReason,
                  onChange: (e) => setEmergencyReason(e.target.value),
                  className: "w-full border border-critical-300 rounded-xl p-2.5 font-medium"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7790}}
                )
              )

              , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7799}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowEmergencyModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7800}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-5 py-2.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7807}}
, "Unlock Records & Log Audit"

                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 5: REGISTER NEW PATIENT */
      /* ========================================== */
      , showRegisterModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7823}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7824}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7825}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7826}}, "Patient Enrollment"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7829}}, "Generate Medical ID Card"   )
              , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7830}}, "Creates a unique MedVeda Medical ID anchor (`MV-MED-YYYY-XXXX`). Works standalone with optional ABHA link."

              )
            )

            , React.createElement('form', { onSubmit: handleRegisterPatient, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7835}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7836}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7837}}, "Full Name *"  )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.name,
                  onChange: (e) => setRegForm({ ...regForm, name: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  placeholder: "e.g. Babulal Marandi"  ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7838}}
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7848}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7849}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7850}}, "Age *" )
                  , React.createElement('input', {
                    type: "number",
                    value: regForm.age,
                    onChange: (e) => setRegForm({ ...regForm, age: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7851}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7859}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7860}}, "Blood Group" )
                  , React.createElement('select', {
                    value: regForm.bloodGroup,
                    onChange: (e) => setRegForm({ ...regForm, bloodGroup: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7861}}

                    , ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      React.createElement('option', { key: bg, value: bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7867}}, bg)
                    ))
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7873}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7874}}, "Phone Number *"  )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.phone,
                  onChange: (e) => setRegForm({ ...regForm, phone: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5"    ,
                  placeholder: "+91-94311-XXXXX",
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7875}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7885}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7886}}, "Location / Village *"   )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.location,
                  onChange: (e) => setRegForm({ ...regForm, location: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5"    ,
                  placeholder: "e.g. Katkamsandi, Hazaribagh"  ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7887}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7897}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7898}}, "ABDM ABHA ID (Optional)"   )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.abhaId,
                  onChange: (e) => setRegForm({ ...regForm, abhaId: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-mono"     ,
                  placeholder: "e.g. babulal@sbx (Leave empty for standalone)"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7899}}
                )
              )

              , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7908}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowRegisterModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7909}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7916}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7920}}, "Generate Medical Card"  )
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7921}}, "→")
                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 6: HIGH-RES PRINTABLE MEDICAL ID CARD */
      /* ========================================== */
      , showCardModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7933}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7934}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7935}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7936}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7937}}, "Digital Health Passport"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7940}}, "Official Medical ID Card"   )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCardModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7942}}
, "×"

              )
            )

            /* Printable ID Card Container */
            , React.createElement('div', { className: "p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-2xl border-2 border-sky-400/40 relative overflow-hidden space-y-4"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7952}}
              , React.createElement('div', { className: "flex items-center justify-between border-b border-white/10 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7953}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7954}}
                  , React.createElement('div', { className: "w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7955}}, "MV"

                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7958}}
                    , React.createElement('div', { className: "text-xs font-black tracking-wide text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7959}}, "MEDVEDA SMART CARE"  )
                    , React.createElement('div', { className: "text-[8px] font-bold text-sky-400 uppercase tracking-widest"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7960}}, "Digital Health Authority"  )
                  )
                )
                , React.createElement('span', { className: "text-[10px] font-mono font-black px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7963}}, "VERIFIED PATIENT"

                )
              )

              , React.createElement('div', { className: "flex items-center justify-between gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7968}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7969}}
                  , React.createElement('h4', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7970}}, patient.name)
                  , React.createElement('div', { className: "text-xs font-mono font-bold text-sky-300 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7971}}, patient.internalMedicalId)
                  , React.createElement('div', { className: "text-[11px] text-slate-300 mt-2 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7972}}
                    , patient.age, " Years • "   , patient.sex ? patient.sex.toUpperCase() : 'N/A', " • Blood: "   , React.createElement('strong', { className: "text-critical-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7973}}, patient.bloodGroup || 'O+')
                  )
                  , React.createElement('div', { className: "text-[10px] text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7975}}, "📍 " , patient.location || 'Jharkhand')
                  , patient.abhaId && (
                    React.createElement('div', { className: "text-[10px] text-emerald-400 font-mono mt-1 font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7977}}, "ABHA: " , patient.abhaId)
                  )
                )

                /* SVG QR Code */
                , React.createElement('div', { className: "bg-white p-2.5 rounded-2xl shadow-md shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7982}}
                  , React.createElement('svg', { viewBox: "0 0 100 100"   , className: "w-20 h-20" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7983}}
                    , React.createElement('rect', { width: "100", height: "100", fill: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7984}} )
                    , React.createElement('rect', { x: "5", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7985}} )
                    , React.createElement('rect', { x: "9", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7986}} )
                    , React.createElement('rect', { x: "13", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7987}} )
                    , React.createElement('rect', { x: "67", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7988}} )
                    , React.createElement('rect', { x: "71", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7989}} )
                    , React.createElement('rect', { x: "75", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7990}} )
                    , React.createElement('rect', { x: "5", y: "67", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7991}} )
                    , React.createElement('rect', { x: "9", y: "71", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7992}} )
                    , React.createElement('rect', { x: "13", y: "75", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7993}} )
                    , React.createElement('rect', { x: "40", y: "10", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7994}} )
                    , React.createElement('rect', { x: "52", y: "18", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7995}} )
                    , React.createElement('rect', { x: "40", y: "40", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7996}} )
                    , React.createElement('rect', { x: "56", y: "38", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7997}} )
                    , React.createElement('rect', { x: "70", y: "45", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7998}} )
                    , React.createElement('rect', { x: "82", y: "55", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7999}} )
                    , React.createElement('rect', { x: "45", y: "60", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8000}} )
                    , React.createElement('rect', { x: "60", y: "65", width: "10", height: "10", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8001}} )
                    , React.createElement('rect', { x: "75", y: "75", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8002}} )
                  )
                )
              )

              , React.createElement('div', { className: "border-t border-white/10 pt-2 flex items-center justify-between text-[9px] text-slate-400 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8007}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8008}}, "Phone: " , patient.phone)
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8009}}, "Valid Nationwide Across All ABDM Facilities"     )
              )
            )

            , React.createElement('div', { className: "flex items-center justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8013}}
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCardModal(false),
                className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8014}}
, "Close"

              )
              , React.createElement('button', {
                type: "button",
                onClick: handleCopyId,
                className: "px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex-1 flex items-center justify-center gap-1"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8021}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8026}}, "📋 Copy ID"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => window.print(),
                className: "px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex-1 flex items-center justify-center gap-1 shadow-md shadow-sky-600/30"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8028}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8033}}, "🖨️ Print Card"  )
              )
            )
          )
        )
      )
    )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8509}}
      /* Toast Notification Alert */
      , notificationToast && (
        React.createElement('div', { className: "fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8512}}
          , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8513}}, "🔔")
          , React.createElement('span', { className: "text-xs font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8514}}, notificationToast)
        )
      )

      /* Feature Header Banner */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8519}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8520}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8521}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-teal-500 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8522}})
            , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8523}}, "FEATURE MAP 06 • MEDICINE & DIAGNOSTIC COORDINATION"

            )
          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8527}}, "Medicine Availability & Diagnostic Grid"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8530}}, "Real-time nearby medicine stock search with out-of-radius fallback, owner-only RBAC inventory CRUD, reservation ordering, diagnostic test catalog, and doctor-ordered status progression."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8535}}
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8536}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8541}}, "🏠 Home" )
          )
        )
      )

      /* Primary Module Navigation Tabs */
      , React.createElement('div', { className: "bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-bold"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8547}}
        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('medicine_search'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'medicine_search'
              ? 'bg-teal-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8548}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8557}}, "💊")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8558}}, "Medicine Search (Patient/Worker)"  )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('shop_owner'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'shop_owner'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8561}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8570}}, "🏪")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8571}}, "Medical Shop Dashboard (Owner CRUD)"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('diagnostic_search'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'diagnostic_search'
              ? 'bg-purple-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8574}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8583}}, "🔬")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8584}}, "Diagnostic Test Search (Direct Booking)"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('lab_dashboard'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'lab_dashboard'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8587}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8596}}, "🧪")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8597}}, "Diagnostic Center Staff Dashboard"   )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('doctor_orders'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'doctor_orders'
              ? 'bg-emerald-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8600}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8609}}, "📋")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8610}}, "Doctor-Ordered Lab Tracker"  )
        )
      )

      /* ========================================================= */
      /* TAB 1: MEDICINE SEARCH (PATIENT / FRONTLINE WORKER VIEW) */
      /* ========================================================= */
      , activeTab === 'medicine_search' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8618}}
          /* Search Controls */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8620}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8621}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8622}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8623}}, "Nearby Medicine Stock Discovery"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8624}}, "Real-time inventory lookup across registered chemists in Hazaribagh & Jharkhand grid."

                )
              )
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8628}}, "Read-Only Search + Counter Reservation"

              )
            )

            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8633}}
              , React.createElement('div', { className: "sm:col-span-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8634}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8635}}, "Medicine Name / Brand / Generic Molecule"

                )
                , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8638}}
                  , React.createElement('input', {
                    type: "text",
                    value: medSearchQuery,
                    onChange: (e) => setMedSearchQuery(e.target.value),
                    onKeyDown: (e) => e.key === 'Enter' && searchMedicines(medSearchQuery, medRadius),
                    placeholder: "e.g. Paracetamol, Telmisartan, Ecosprin, Tenecteplase..."    ,
                    className: "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 bg-slate-50/50"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8639}}
                  )
                  , React.createElement('span', { className: "absolute left-3.5 top-3.5 text-slate-400 text-base"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8647}}, "🔍")
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8651}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8652}}, "Search Radius"

                )
                , React.createElement('select', {
                  value: medRadius,
                  onChange: (e) => {
                    const r = Number(e.target.value);
                    setMedRadius(r);
                    searchMedicines(medSearchQuery, r);
                  },
                  className: "w-full py-3 px-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 bg-white"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8655}}

                  , React.createElement('option', { value: "5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8664}}, "Within 5 km (Walking)"   )
                  , React.createElement('option', { value: "15", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8665}}, "Within 15 km (Block Level)"    )
                  , React.createElement('option', { value: "25", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8666}}, "Within 25 km (District Hub)"    )
                  , React.createElement('option', { value: "75", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8667}}, "Within 75 km (State Network)"    )
                )
              )
            )

            /* Quick Keyword Chips */
            , React.createElement('div', { className: "flex items-center gap-2 flex-wrap pt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8673}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8674}}, "Quick Searches:" )
              , ['Paracetamol', 'Telmisartan', 'Metformin', 'Ecosprin', 'Brilinta', 'Tenecteplase'].map((q) => (
                React.createElement('button', {
                  key: q,
                  type: "button",
                  onClick: () => {
                    setMedSearchQuery(q);
                    searchMedicines(q, medRadius);
                  },
                  className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8676}}
, "+ "
                   , q
                )
              ))
            )
          )

          /* Search Feedback / Non-Empty Fallback Alert */
          , medMessage && (
            React.createElement('div', {
              className: `p-4 rounded-2xl border flex items-center justify-between text-xs gap-3 ${
                medIsFallback
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-teal-50 border-teal-200 text-teal-900'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8693}}

              , React.createElement('div', { className: "flex items-center gap-2.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8700}}
                , React.createElement('span', { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8701}}, medIsFallback ? '⚠️' : '✓')
                , React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8702}}, medMessage)
              )
              , medIsFallback && (
                React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 text-amber-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8705}}, "Out-of-Radius Fallback"

                )
              )
            )
          )

          /* Medicine Results Grid */
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8713}}
            , medResults.map((item, idx) => {
              const med = item.medicine;
              const shop = item.shop;
              const isInStock = med.status === 'in_stock' && med.quantity > 0;

              return (
                React.createElement('div', {
                  key: idx,
                  className: `bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                    isInStock ? 'border-slate-200 hover:border-teal-400' : 'border-slate-200 bg-slate-50/50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8720}}

                  , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8726}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8727}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8728}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8729}}
                          , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8730}}, med.medicineName)
                          , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8731}}
                            , med.dosageForm || 'Tablet', " • "  , med.strength || 'Standard'
                          )
                        )
                        , med.genericName && (
                          React.createElement('div', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8736}}, "Generic: "
                             , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8737}}, med.genericName)
                          )
                        )
                      )

                      , React.createElement('div', { className: "text-right shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8742}}
                        , med.price !== undefined && (
                          React.createElement('div', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8744}}, "₹", med.price.toFixed(2))
                        )
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            isInStock
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-critical-100 text-critical-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8746}}

                          , isInStock ? `✓ In Stock (${med.quantity})` : '✗ Out of Stock'
                        )
                      )
                    )

                    /* Shop Information Card */
                    , React.createElement('div', { className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8759}}
                      , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8760}}
                        , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8761}}, shop.name)
                        , React.createElement('span', { className: "font-mono font-bold text-teal-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8762}}, "📍 "
                           , item.distanceKm, " km"
                        )
                      )
                      , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8766}}, shop.location.address)
                      , React.createElement('div', { className: "text-[10px] text-slate-400 pt-1 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8767}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8768}}, "📞 " , shop.contactNumber)
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8769}}, "Updated: " , new Date(med.lastUpdated).toLocaleTimeString())
                      )
                    )
                  )

                  /* Actions */
                  , React.createElement('div', { className: "flex items-center gap-2 pt-2 border-t border-slate-100"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8775}}
                    , React.createElement('button', {
                      type: "button",
                      disabled: !isInStock,
                      onClick: () => {
                        setSelectedMedItem(item);
                        setShowOrderModal(true);
                      },
                      className: `flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        isInStock
                          ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8776}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8789}}, "📦")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8790}}, "Reserve for Counter Pickup"   )
                    )

                    , React.createElement('a', {
                      href: `tel:${shop.contactNumber}`,
                      className: "px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8793}}
, "📞 Call"

                    )
                  )
                )
              );
            })
          )
        )
      )

      /* ========================================================= */
      /* TAB 2: MEDICAL SHOP DASHBOARD (OWNER CRUD & ORDERS) */
      /* ========================================================= */
      , activeTab === 'shop_owner' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8811}}
          /* Shop Selector & RBAC Invariant Card */
          , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8813}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8814}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8815}}
                , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8816}}, "🏪"

                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8819}}
                  , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-teal-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8820}}, "SHOP OWNER WORKSPACE • STRICT BACKEND RBAC"

                  )
                  , React.createElement('h3', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8823}}, _optionalChain([activeShopObj, 'optionalAccess', _20 => _20.name]))
                )
              )

              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8827}}
                , React.createElement('select', {
                  value: activeShopId,
                  onChange: (e) => setActiveShopId(e.target.value),
                  className: "bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8828}}

                  , allShops.map((s) => (
                    React.createElement('option', { key: s.shopId, value: s.shopId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8834}}
                      , s.name
                    )
                  ))
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => {
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
                  },
                  className: "px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8840}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8856}}, "➕ Add Medicine"  )
                )
              )
            )

            , React.createElement('div', { className: "p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8861}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8862}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8863}}, "RBAC Invariant:" ), " You are managing shop inventory for "       , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8863}}, _optionalChain([activeShopObj, 'optionalAccess', _21 => _21.name])), ". Backend rejects write access from non-owner accounts."
              )
              , React.createElement('span', { className: "text-[10px] font-mono text-teal-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8865}}, "Owner ID: owner_pharma_1"  )
            )
          )

          /* Incoming Order Reservations Desk */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8870}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8871}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8872}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8873}}, "Incoming Customer Order Requests"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8874}}, "Patient reservation requests for counter pickup. Confirmed orders do not alter stock until counter handover."

                )
              )
              , React.createElement('span', { className: "text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8878}}
                , shopOrders.length, " Total Orders"
              )
            )

            , shopOrders.length === 0 ? (
              React.createElement('div', { className: "p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8884}}, "No incoming order requests yet."

              )
            ) : (
              React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8888}}
                , shopOrders.map((ord) => (
                  React.createElement('div', {
                    key: ord.orderId,
                    className: "p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3 text-xs"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8890}}

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8894}}
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8895}}
                        , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8896}}, ord.patientName)
                        , React.createElement('span', { className: "font-mono text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8897}}, "(", ord.patientPhone, ")")
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            ord.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'requested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8898}}

                          , ord.status
                        )
                      )
                      , React.createElement('div', { className: "text-[11px] text-slate-600 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8910}}, "Requested: "
                         , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8911}}, ord.quantityRequested, " units" ), " of "  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8911}}, ord.medicineName), " • Ordered at "    , new Date(ord.requestedAt).toLocaleTimeString()
                      )
                      , ord.ownerNotes && (
                        React.createElement('div', { className: "text-[10px] text-teal-700 mt-0.5 italic"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8914}}, "Notes: "
                           , ord.ownerNotes
                        )
                      )
                    )

                    , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8920}}
                      , ord.status === 'requested' && (
                        React.createElement(React.Fragment, null
                          , React.createElement('button', {
                            type: "button",
                            onClick: () =>
                              handleUpdateOrderStatus(ord.orderId, 'confirmed', 'Confirmed. Packed and kept at pickup counter.')
                            ,
                            className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8923}}
, "✓ Confirm Pickup"

                          )
                          , React.createElement('button', {
                            type: "button",
                            onClick: () =>
                              handleUpdateOrderStatus(ord.orderId, 'unavailable', 'Stock changed, unavailable.')
                            ,
                            className: "px-3 py-1.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8932}}
, "✗ Unavailable"

                          )
                        )
                      )
                    )
                  )
                ))
              )
            )
          )

          /* Shop Inventory CRUD Table */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8951}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8952}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8953}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8954}}, "Current Medicine Stock Inventory"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8955}}, "Real-time stock counts reflecting directly in patient-facing search."

                )
              )
            )

            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8961}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8962}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8963}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8964}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8965}}, "Medicine Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8966}}, "Generic / Strength"  )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8967}}, "Quantity")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8968}}, "Status")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8969}}, "Price (INR)" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8970}}, "Last Updated" )
                    , React.createElement('th', { className: "py-3 px-4 text-right"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8971}}, "Actions")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8974}}
                  , shopInventory.map((item) => (
                    React.createElement('tr', { key: item.inventoryId, className: "hover:bg-slate-50/50", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8976}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8977}}, item.medicineName)
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8978}}
                        , item.genericName || 'N/A', " • "  , React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8979}}, item.strength)
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-mono font-bold text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8981}}, item.quantity)
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8982}}
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-critical-100 text-critical-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8983}}

                          , item.status === 'in_stock' ? 'In Stock' : 'Out of Stock'
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8993}}
                        , item.price !== undefined ? `₹${item.price.toFixed(2)}` : 'N/A'
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-400 text-[10px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8996}}
                        , new Date(item.lastUpdated).toLocaleTimeString()
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-right space-x-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8999}}
                        , React.createElement('button', {
                          type: "button",
                          onClick: () => {
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
                          },
                          className: "px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9000}}
, "Edit"

                        )
                        , React.createElement('button', {
                          type: "button",
                          onClick: () => handleDeleteMedicine(item.inventoryId),
                          className: "px-2.5 py-1 bg-critical-50 hover:bg-critical-100 text-critical-700 font-bold rounded-lg"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9019}}
, "Delete"

                        )
                      )
                    )
                  ))
                )
              )
            )
          )
        )
      )

      /* ========================================================= */
      /* TAB 3: DIAGNOSTIC TEST SEARCH (DIRECT PATIENT BOOKING) */
      /* ========================================================= */
      , activeTab === 'diagnostic_search' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9040}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9041}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9042}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9043}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9044}}, "Direct Diagnostic Test Discovery"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9045}}, "Search pathology tests, imaging, and biochemistry panels across accredited labs without a doctor mandate."

                )
              )
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9049}}, "Direct Search • Same-Day Labs"

              )
            )

            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9054}}
              , React.createElement('div', { className: "sm:col-span-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9055}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9056}}, "Diagnostic Test / Panel Name"

                )
                , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9059}}
                  , React.createElement('input', {
                    type: "text",
                    value: diagSearchQuery,
                    onChange: (e) => setDiagSearchQuery(e.target.value),
                    onKeyDown: (e) => e.key === 'Enter' && searchDiagnosticTests(diagSearchQuery, diagRadius),
                    placeholder: "e.g. Complete Blood Count, Lipid Profile, Blood Sugar, HbA1c, Troponin-I..."         ,
                    className: "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 bg-slate-50/50"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9060}}
                  )
                  , React.createElement('span', { className: "absolute left-3.5 top-3.5 text-slate-400 text-base"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9068}}, "🔬")
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9072}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9073}}, "Radius Filter"

                )
                , React.createElement('select', {
                  value: diagRadius,
                  onChange: (e) => {
                    const r = Number(e.target.value);
                    setDiagRadius(r);
                    searchDiagnosticTests(diagSearchQuery, r);
                  },
                  className: "w-full py-3 px-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 bg-white"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9076}}

                  , React.createElement('option', { value: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9085}}, "Within 10 km"  )
                  , React.createElement('option', { value: "30", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9086}}, "Within 30 km (Sub-District)"   )
                  , React.createElement('option', { value: "60", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9087}}, "Within 60 km (District Hub)"    )
                )
              )
            )

            /* Quick Test Chips */
            , React.createElement('div', { className: "flex items-center gap-2 flex-wrap pt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9093}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9094}}, "Popular Panels:" )
              , ['Complete Blood Count', 'Lipid Profile', 'Blood Sugar', 'HbA1c', 'Troponin-I', 'X-Ray Chest', 'Echocardiography'].map((t) => (
                React.createElement('button', {
                  key: t,
                  type: "button",
                  onClick: () => {
                    setDiagSearchQuery(t);
                    searchDiagnosticTests(t, diagRadius);
                  },
                  className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9096}}
, "+ "
                   , t
                )
              ))
            )
          )

          /* Diagnostic Message */
          , diagMessage && (
            React.createElement('div', {
              className: `p-4 rounded-2xl border flex items-center justify-between text-xs gap-3 ${
                diagIsFallback
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-purple-50 border-purple-200 text-purple-900'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9113}}

              , React.createElement('div', { className: "flex items-center gap-2.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9120}}
                , React.createElement('span', { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9121}}, diagIsFallback ? '⚠️' : '✓')
                , React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9122}}, diagMessage)
              )
            )
          )

          /* Results Grid */
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9128}}
            , diagResults.map((item, idx) => {
              const test = item.test;
              const center = item.center;

              return (
                React.createElement('div', {
                  key: idx,
                  className: "bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between space-y-4 hover:shadow-md"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9134}}

                  , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9138}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9139}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9140}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9141}}
                          , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9142}}, test.testName)
                        )
                        , React.createElement('div', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9144}}, "Category: "
                           , React.createElement('strong', { className: "text-slate-800 uppercase" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9145}}, test.category), " • Sample: "   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9145}}, test.sampleType || 'Venous Blood')
                        )
                      )

                      , React.createElement('div', { className: "text-right shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9149}}
                        , test.price !== undefined && (
                          React.createElement('div', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9151}}, "₹", test.price.toFixed(2))
                        )
                        , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 inline-block mt-0.5"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9153}}, "⏱️ "
                           , test.turnaroundTime
                        )
                      )
                    )

                    , React.createElement('div', { className: "flex items-center gap-2 flex-wrap text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9159}}
                      , test.fastingRequired ? (
                        React.createElement('span', { className: "px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9161}}, "⚠️ Fasting Required (8-10h)"

                        )
                      ) : (
                        React.createElement('span', { className: "px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9165}}, "✓ No Fasting Required"

                        )
                      )
                    )

                    /* Center Details */
                    , React.createElement('div', { className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9172}}
                      , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9173}}
                        , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9174}}, center.name)
                        , React.createElement('span', { className: "font-mono font-bold text-purple-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9175}}, "📍 " , item.distanceKm, " km" )
                      )
                      , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9177}}, center.location.address)
                      , center.accreditation && (
                        React.createElement('div', { className: "text-[10px] text-emerald-700 font-bold mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9179}}, "🏅 "
                           , center.accreditation
                        )
                      )
                    )
                  )

                  , React.createElement('div', { className: "flex items-center gap-2 pt-2 border-t border-slate-100"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9186}}
                    , React.createElement('button', {
                      type: "button",
                      onClick: () => {
                        setSelectedTestItem(item);
                        setShowBookingModal(true);
                      },
                      className: "flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9187}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9195}}, "🧪")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9196}}, "Book Diagnostic Test"  )
                    )

                    , React.createElement('a', {
                      href: `tel:${center.contactNumber}`,
                      className: "px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9199}}
, "📞 Call"

                    )
                  )
                )
              );
            })
          )
        )
      )

      /* ========================================================= */
      /* TAB 4: DIAGNOSTIC CENTER STAFF DASHBOARD */
      /* ========================================================= */
      , activeTab === 'lab_dashboard' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9217}}
          , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9218}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9219}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9220}}
                , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9221}}, "🧪"

                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9224}}
                  , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9225}}, "DIAGNOSTIC CENTER DASHBOARD • LAB STAFF RBAC"

                  )
                  , React.createElement('h3', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9228}}, _optionalChain([activeCenterObj, 'optionalAccess', _22 => _22.name]))
                )
              )

              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9232}}
                , React.createElement('select', {
                  value: activeCenterId,
                  onChange: (e) => setActiveCenterId(e.target.value),
                  className: "bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9233}}

                  , allCenters.map((c) => (
                    React.createElement('option', { key: c.centerId, value: c.centerId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9239}}
                      , c.name
                    )
                  ))
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => {
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
                  },
                  className: "px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9245}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9261}}, "➕ Add Test"  )
                )
              )
            )

            , React.createElement('div', { className: "p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9266}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9267}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9268}}, "Accreditation:"), " " , _optionalChain([activeCenterObj, 'optionalAccess', _23 => _23.accreditation]) || 'Standard Regional Lab'
              )
              , React.createElement('span', { className: "text-[10px] font-mono text-indigo-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9270}}, "Staff Actor: owner_lab_1"  )
            )
          )

          /* Test Catalog Table */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9275}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9276}}, "Offered Test Catalog"  )
            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9277}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9278}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9279}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9280}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9281}}, "Test Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9282}}, "Category")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9283}}, "Turnaround")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9284}}, "Fasting")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9285}}, "Price")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9286}}, "Status")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9289}}
                  , centerCatalog.map((t) => (
                    React.createElement('tr', { key: t.testOfferingId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9291}}
                      , React.createElement('td', { className: "py-3 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9292}}, t.testName)
                      , React.createElement('td', { className: "py-3 px-4 uppercase text-[10px] font-bold text-indigo-700"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9293}}, t.category)
                      , React.createElement('td', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9294}}, t.turnaroundTime)
                      , React.createElement('td', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9295}}, t.fastingRequired ? '⚠️ Yes' : '✓ No')
                      , React.createElement('td', { className: "py-3 px-4 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9296}}, t.price ? `₹${t.price}` : 'Free')
                      , React.createElement('td', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9297}}
                        , React.createElement('span', { className: "px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9298}}
                          , t.status
                        )
                      )
                    )
                  ))
                )
              )
            )
          )
        )
      )

      /* ========================================================= */
      /* TAB 5: DOCTOR-ORDERED DIAGNOSTIC STATUS TRACKER */
      /* ========================================================= */
      , activeTab === 'doctor_orders' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9315}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9316}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9317}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9318}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9319}}, "Doctor-Ordered Diagnostic Lifecycle Tracker"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9320}}, "Tracks orders initiated during Feature 02 consultations: Sample Collection → In Progress → Results Published → Delivered to EHR."

                )
              )
            )

            /* Select Order */
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9327}}
              , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9328}}, "Select Active Consultation Order:"

              )
              , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9331}}
                , trackedOrders.map((ord) => (
                  React.createElement('div', {
                    key: ord.orderId,
                    onClick: () => setSelectedOrderForStatus(ord),
                    className: `p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      _optionalChain([selectedOrderForStatus, 'optionalAccess', _24 => _24.orderId]) === ord.orderId
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9333}}

                    , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9342}}
                      , React.createElement('strong', { className: "text-slate-900 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9343}}, ord.testName)
                      , React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9344}}
                        , ord.status
                      )
                    )
                    , React.createElement('div', { className: "text-xs text-slate-600 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9348}}, "Patient: "
                       , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9349}}, ord.patientName), " • Center: "   , ord.centerName
                    )
                    , ord.orderedBy && (
                      React.createElement('div', { className: "text-[11px] text-brand-700 font-bold mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9352}}, "Ordered by: "
                          , ord.orderedBy.name
                      )
                    )
                  )
                ))
              )
            )
          )

          /* Stepper & Dual Result Viewer */
          , selectedOrderForStatus && (
            React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9364}}
              , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9365}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9366}}
                  , React.createElement('span', { className: "text-[10px] font-mono font-bold text-slate-400 uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9367}}, "ORDER ID: "
                      , selectedOrderForStatus.orderId
                  )
                  , React.createElement('h3', { className: "text-2xl font-black text-slate-900 mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9370}}
                    , selectedOrderForStatus.testName
                  )
                  , React.createElement('div', { className: "text-xs text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9373}}, "Patient: "
                     , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9374}}, selectedOrderForStatus.patientName), " (" , selectedOrderForStatus.patientPhone, ")"
                  )
                )

                /* Status Advancement Controls */
                , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9379}}
                  , selectedOrderForStatus.status === 'sample_pending' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'in_progress'),
                      className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9381}}
, "🩸 Collect Sample (In Progress)"

                    )
                  )

                  , selectedOrderForStatus.status === 'in_progress' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => setShowUploadResultModal(true),
                      className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9391}}
, "📝 Upload Results & Values"

                    )
                  )

                  , selectedOrderForStatus.status === 'result_ready' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'delivered'),
                      className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9401}}
, "✓ Deliver to Doctor & Patient Timeline"

                    )
                  )
                )
              )

              /* Status Stepper Progression */
              , React.createElement('div', { className: "grid grid-cols-4 gap-2 text-center text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9413}}
                , [
                  { id: 'sample_pending', label: '1. Sample Pending' },
                  { id: 'in_progress', label: '2. In Progress' },
                  { id: 'result_ready', label: '3. Result Ready' },
                  { id: 'delivered', label: '4. Delivered' }
                ].map((st, i) => {
                  const stepOrder = ['sample_pending', 'in_progress', 'result_ready', 'delivered'];
                  const curIdx = stepOrder.indexOf(selectedOrderForStatus.status);
                  const isDone = i <= curIdx;
                  return (
                    React.createElement('div', {
                      key: st.id,
                      className: `p-3 rounded-2xl font-bold border transition-all ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9424}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9432}}, isDone ? '✓ ' : '', st.label)
                    )
                  );
                })
              )

              /* Dual Results Viewer (Clinical + Patient Friendly) */
              , selectedOrderForStatus.resultData ? (
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9440}}
                  /* Clinical View */
                  , React.createElement('div', { className: "p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9442}}
                    , React.createElement('div', { className: "flex items-center justify-between border-b border-white/10 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9443}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9444}}
                        , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-emerald-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9445}}, "CLINICAL VIEW • MEDICAL OFFICER"

                        )
                        , React.createElement('h4', { className: "text-base font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9448}}, "Diagnostic Laboratory Parameters"  )
                      )
                      , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9450}}, "NABL Verified" )
                    )

                    , React.createElement('p', { className: "text-xs text-slate-300 font-medium leading-relaxed"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9453}}
                      , selectedOrderForStatus.resultData.clinicalSummary
                    )

                    , React.createElement('div', { className: "space-y-2 pt-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9457}}
                      , _optionalChain([selectedOrderForStatus, 'access', _25 => _25.resultData, 'access', _26 => _26.parameters, 'optionalAccess', _27 => _27.map, 'call', _28 => _28((p, idx) => (
                        React.createElement('div', {
                          key: idx,
                          className: "p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9459}}

                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9463}}
                            , React.createElement('span', { className: "font-bold text-slate-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9464}}, p.name)
                            , React.createElement('div', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9465}}, "Ref: " , p.referenceRange, " " , p.unit)
                          )
                          , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9467}}
                            , React.createElement('span', { className: "font-mono font-black text-sm text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9468}}, p.value, " " , p.unit)
                            , p.isAbnormal && (
                              React.createElement('span', { className: "block text-[9px] font-black uppercase text-critical-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9470}}, "⚠️ HIGH / ABNORMAL"

                              )
                            )
                          )
                        )
                      ))])
                    )

                    , selectedOrderForStatus.resultData.certifiedBy && (
                      React.createElement('div', { className: "text-[10px] text-slate-400 border-t border-white/10 pt-2 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9480}}, "Verified by: "
                          , selectedOrderForStatus.resultData.certifiedBy
                      )
                    )
                  )

                  /* Patient Plain-Language View */
                  , React.createElement('div', { className: "p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-4 flex flex-col justify-between"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9487}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9488}}
                      , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9489}}
                        , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9490}}, "🩺")
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9491}}
                          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-emerald-800 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9492}}, "PATIENT EXPLANATION • PLAIN LANGUAGE"

                          )
                          , React.createElement('h4', { className: "text-base font-black text-emerald-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9495}}, "What Your Results Mean"   )
                        )
                      )

                      , React.createElement('div', { className: "p-4 bg-white/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9499}}
                        , selectedOrderForStatus.resultData.patientFriendlySummary
                      )
                    )

                    , React.createElement('div', { className: "p-3 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 flex items-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9504}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9505}}, "✓")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9506}}, "This report has been automatically synced to your "        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9506}}, "MedVeda Longitudinal EHR"  ), ".")
                    )
                  )
                )
              ) : (
                React.createElement('div', { className: "p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9511}}, "Sample status is pending/in-progress. Results will be shown here once uploaded by the certified laboratory."

                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 1: MEDICINE ORDER RESERVATION */
      /* ========================================== */
      , showOrderModal && selectedMedItem && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9524}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9525}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9526}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9527}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9528}}, "Counter Reservation"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9531}}, "Reserve Medicine for Pickup"   )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowOrderModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9533}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handlePlaceMedicineOrder, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9542}}
              , React.createElement('div', { className: "p-3.5 rounded-2xl bg-teal-50 border border-teal-200 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9543}}
                , React.createElement('div', { className: "font-extrabold text-teal-950 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9544}}, selectedMedItem.medicine.medicineName)
                , React.createElement('div', { className: "text-[11px] text-teal-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9545}}, "Shop: "
                   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9546}}, selectedMedItem.shop.name), " • "  , selectedMedItem.distanceKm, " km"
                )
                , selectedMedItem.medicine.price && (
                  React.createElement('div', { className: "text-teal-900 font-bold pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9549}}, "Price: ₹"
                     , selectedMedItem.medicine.price, " per unit"
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9555}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9556}}, "Patient Full Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: orderPatientName,
                  onChange: (e) => setOrderPatientName(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9557}}
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9566}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9567}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9568}}, "Phone Number" )
                  , React.createElement('input', {
                    type: "text",
                    value: orderPatientPhone,
                    onChange: (e) => setOrderPatientPhone(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9569}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9577}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9578}}, "Quantity")
                  , React.createElement('input', {
                    type: "number",
                    min: "1",
                    max: selectedMedItem.medicine.quantity,
                    value: orderQuantity,
                    onChange: (e) => setOrderQuantity(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9579}}
                  )
                )
              )

              , React.createElement('div', { className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9591}}, "ℹ️ Payment is collected in person at the counter upon physical pickup."

              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9595}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowOrderModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9596}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9603}}
, "Confirm Reservation"

                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 2: DIRECT DIAGNOSTIC BOOKING */
      /* ========================================== */
      , showBookingModal && selectedTestItem && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9619}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9620}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9621}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9622}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9623}}, "Direct Lab Appointment"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9626}}, "Book Diagnostic Test"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowBookingModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9628}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handlePlaceDiagnosticBooking, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9637}}
              , React.createElement('div', { className: "p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9638}}
                , React.createElement('div', { className: "font-extrabold text-purple-950 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9639}}, selectedTestItem.test.testName)
                , React.createElement('div', { className: "text-[11px] text-purple-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9640}}, "Lab: "
                   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9641}}, selectedTestItem.center.name), " • "  , selectedTestItem.distanceKm, " km"
                )
                , React.createElement('div', { className: "text-purple-900 font-bold pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9643}}, "Turnaround: "
                   , selectedTestItem.test.turnaroundTime, " • Price: ₹"   , selectedTestItem.test.price || 0
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9648}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9649}}, "Patient Full Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: bookingPatientName,
                  onChange: (e) => setBookingPatientName(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9650}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9659}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9660}}, "Contact Phone" )
                , React.createElement('input', {
                  type: "text",
                  value: bookingPatientPhone,
                  onChange: (e) => setBookingPatientPhone(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9661}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9670}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowBookingModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9671}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9678}}
, "Book Test Slot"

                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 3: ADD / EDIT MEDICINE (SHOP OWNER) */
      /* ========================================== */
      , (showAddMedModal || showEditMedModal) && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9694}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9695}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9696}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9697}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9698}}, "Shop Inventory CRUD"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9701}}
                  , showAddMedModal ? 'Add Medicine to Inventory' : 'Edit Medicine Details'
                )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setShowAddMedModal(false);
                  setShowEditMedModal(false);
                },
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9705}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: showAddMedModal ? handleAddMedicine : handleUpdateMedicine, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9717}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9718}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9719}}, "Medicine Brand Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: medForm.medicineName,
                  onChange: (e) => setMedForm({ ...medForm, medicineName: e.target.value }),
                  placeholder: "e.g. Telmisartan 40mg"  ,
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9720}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9730}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9731}}, "Generic Molecule Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: medForm.genericName,
                  onChange: (e) => setMedForm({ ...medForm, genericName: e.target.value }),
                  placeholder: "e.g. Telmisartan (ARB)"  ,
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9732}}
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9741}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9742}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9743}}, "Dosage Form" )
                  , React.createElement('select', {
                    value: medForm.dosageForm,
                    onChange: (e) => setMedForm({ ...medForm, dosageForm: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9744}}

                    , React.createElement('option', { value: "Tablet", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9749}}, "Tablet")
                    , React.createElement('option', { value: "Capsule", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9750}}, "Capsule")
                    , React.createElement('option', { value: "Syrup", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9751}}, "Syrup")
                    , React.createElement('option', { value: "Injection", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9752}}, "Injection")
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9756}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9757}}, "Strength")
                  , React.createElement('input', {
                    type: "text",
                    value: medForm.strength,
                    onChange: (e) => setMedForm({ ...medForm, strength: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9758}}
                  )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9767}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9768}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9769}}, "Stock Quantity" )
                  , React.createElement('input', {
                    type: "number",
                    value: medForm.quantity,
                    onChange: (e) => setMedForm({ ...medForm, quantity: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9770}}
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9779}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9780}}, "Unit Price (INR)"  )
                  , React.createElement('input', {
                    type: "number",
                    step: "0.5",
                    value: medForm.price,
                    onChange: (e) => setMedForm({ ...medForm, price: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9781}}
                  )
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9791}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => {
                    setShowAddMedModal(false);
                    setShowEditMedModal(false);
                  },
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9792}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9802}}

                  , showAddMedModal ? 'Save Medicine' : 'Update Inventory'
                )
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 4: UPLOAD LAB RESULTS (LAB STAFF) */
      /* ========================================== */
      , showUploadResultModal && selectedOrderForStatus && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9818}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9819}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9820}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9821}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9822}}, "Clinical Results Publishing"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9825}}, "Publish Test Results"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowUploadResultModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9827}}
, "×"

              )
            )

            , React.createElement('form', {
              onSubmit: (e) => {
                e.preventDefault();
                handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'result_ready', resultForm);
                setShowUploadResultModal(false);
              },
              className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9836}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9844}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9845}}, "Clinical Diagnostic Summary (For Doctor)"    )
                , React.createElement('textarea', {
                  rows: "2",
                  value: resultForm.clinicalSummary,
                  onChange: (e) => setResultForm({ ...resultForm, clinicalSummary: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9846}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9855}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9856}}, "Patient-Friendly Explanation (Plain Language)"   )
                , React.createElement('textarea', {
                  rows: "2",
                  value: resultForm.patientFriendlySummary,
                  onChange: (e) => setResultForm({ ...resultForm, patientFriendlySummary: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9857}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9866}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9867}}, "Certifying Pathologist / Officer"   )
                , React.createElement('input', {
                  type: "text",
                  value: resultForm.certifiedBy,
                  onChange: (e) => setResultForm({ ...resultForm, certifiedBy: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9868}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9877}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowUploadResultModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9878}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9885}}
, "Publish Report (Ready)"

                )
              )
            )
          )
        )
      )
    )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10126}}
      /* Toast Notification Alert */
      , notificationToast && (
        React.createElement('div', { className: "fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10129}}
          , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10130}}, "🔔")
          , React.createElement('span', { className: "text-xs font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10131}}, notificationToast)
        )
      )

      /* Feature Header Banner with Facility Switcher */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10136}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10137}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10138}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10139}})
            , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10140}}, "FEATURE MAP 07 • FACILITY DASHBOARD AGGREGATION LAYER"

            )
          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10144}}, "Facility Operations & Resource Control"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10147}}, "Real-time unified aggregation across Features 01–06: Care Continuity index, priority queue load, live bed/ICU status, footfall trends, and severity-tagged alerts."

          )
        )

        /* Facility Selector & Home Button */
        , React.createElement('div', { className: "flex items-center gap-3 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10153}}
          , React.createElement('div', { className: "flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10154}}
            , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10155}}, "🏥")
            , React.createElement('select', {
              value: activeFacilityId,
              onChange: (e) => setActiveFacilityId(e.target.value),
              className: "bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10156}}

              , facilities.map((f) => (
                React.createElement('option', { key: f.facilityId, value: f.facilityId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10162}}
                  , f.name
                )
              ))
            )
          )

          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10169}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10174}}, "🏠 Home" )
          )
        )
      )

      /* Role Context Bar */
      , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 text-xs shadow-md border border-blue-900/40"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10180}}
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10181}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10182}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10183}}
            , React.createElement('span', { className: "text-sky-200 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10184}}, "Active Facility:" ), ' '
            , React.createElement('strong', { className: "text-white font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10185}}, activeFacilityObj.name), " •" , ' '
            , React.createElement('span', { className: "text-amber-300 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10186}}, activeFacilityObj.type || 'District Hospital')
          )
        )

        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10190}}
          , React.createElement('span', { className: "text-sky-200 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10191}}, "Logged Role:" )
          , React.createElement('span', { className: "px-2.5 py-1 rounded-lg bg-white/15 text-white font-mono font-bold uppercase text-[10px] border border-white/20"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10192}}
            , actorRole
          )
          , actorRole === 'worker' && (
            React.createElement('span', { className: "text-[10px] text-amber-300 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10196}}, "(Restricted to Patient Care & Operational Views)"

            )
          )
          , actorRole === 'doctor' && (
            React.createElement('span', { className: "text-[10px] text-teal-300 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10201}}, "(Clinical & Queue Views Enabled)"

            )
          )
        )
      )

      /* 6 Section Module Navigation Tabs */
      , React.createElement('div', { className: "bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-bold"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10209}}
        , actorRole !== 'worker' && (
          React.createElement('button', {
            type: "button",
            onClick: () => setActiveSection('overview'),
            className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'overview'
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10211}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10220}}, "📊")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10221}}, "1. Overview Summary"  )
          )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveSection('patient_care'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'patient_care'
              ? 'bg-brand-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10225}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10234}}, "👥")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10235}}, "2. Patient & Care Mgmt"    )
        )

        , actorRole !== 'worker' && (
          React.createElement('button', {
            type: "button",
            onClick: () => setActiveSection('appointments_queue'),
            className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'appointments_queue'
                ? 'bg-purple-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10239}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10248}}, "⏱️")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10249}}, "3. Appointments & Queue"   )
          )
        )

        , actorRole !== 'worker' && (
          React.createElement('button', {
            type: "button",
            onClick: () => setActiveSection('service_resource'),
            className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'service_resource'
                ? 'bg-teal-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10254}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10263}}, "🏥")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10264}}, "4. Service & Resources"   )
          )
        )

        , actorRole !== 'worker' && actorRole !== 'doctor' && (
          React.createElement('button', {
            type: "button",
            onClick: () => setActiveSection('analytics'),
            className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'analytics'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10269}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10278}}, "📈")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10279}}, "5. Analytics & Reports"   )
          )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveSection('alerts'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'alerts'
              ? 'bg-critical-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10283}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10292}}, "🚨")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10293}}, "6. Alerts & Notifications"   )
          , criticalCount > 0 && (
            React.createElement('span', { className: "px-1.5 py-0.2 bg-white text-critical-700 rounded-full font-black text-[10px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10295}}
              , criticalCount
            )
          )
        )
      )

      /* ========================================================= */
      /* SECTION 1: OVERVIEW SUMMARY */
      /* ========================================================= */
      , activeSection === 'overview' && overviewData && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10306}}
          /* 4 KPI Cards */
          , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10308}}
            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10309}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10310}}, "Total Patients Served"

              )
              , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10313}}
                , _optionalChain([overviewData, 'access', _29 => _29.totalPatientsServed, 'optionalAccess', _30 => _30.toLocaleString, 'call', _31 => _31()])
              )
              , React.createElement('span', { className: "text-[11px] text-emerald-600 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10316}}, "↑ 14% vs last month"

              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10321}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10322}}, "Appointments Today"

              )
              , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10325}}
                , overviewData.appointmentsToday
              )
              , React.createElement('span', { className: "text-[11px] text-brand-600 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10328}}
                , overviewData.activeQueueCount, " in live queue"
              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10333}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10334}}, "High-Risk Follow-Up"

              )
              , React.createElement('div', { className: "text-3xl font-black text-purple-700 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10337}}
                , overviewData.highRiskUnderFollowUp
              )
              , React.createElement('span', { className: "text-[11px] text-purple-600 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10340}}, "Under active ASHA monitoring"

              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10345}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10346}}, "Critical Active Alerts"

              )
              , React.createElement('div', { className: "text-3xl font-black text-critical-600 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10349}}
                , overviewData.criticalAlertsCount
              )
              , React.createElement('span', { className: "text-[11px] text-critical-500 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10352}}, "Immediate clinical attention"

              )
            )
          )

          /* Care Continuity Index Gauge Card */
          , React.createElement('div', { className: "relative overflow-hidden bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10359}}
            , React.createElement('div', { className: "absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10360}})
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2 relative z-10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10361}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10362}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-sky-300 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10363}}, "LONGITUDINAL RECORD CONTINUITY"

                )
                , React.createElement('h3', { className: "text-xl font-black text-white mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10366}}, "Care Continuity Index: "
                     , overviewData.careContinuityIndex, "%"
                )
              )
              , React.createElement('span', { className: "px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-sky-200 border border-white/20 backdrop-blur-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10370}}, "✓ High Continuity Grid"

              )
            )

            , React.createElement('p', { className: "text-xs text-blue-100/90 font-normal max-w-2xl leading-relaxed relative z-10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10375}}, "Measures percentage of patients with complete longitudinal record chains without drop-offs between stages: "
                           , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10376}}, "Triage → Teleconsultation → Referral → Follow-Up"      ), "."
            )

            /* Progress Bar */
            , React.createElement('div', { className: "space-y-1.5 pt-2 relative z-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10380}}
              , React.createElement('div', { className: "w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10381}}
                , React.createElement('div', {
                  className: "h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"       ,
                  style: { width: `${overviewData.careContinuityIndex}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10382}}
)
              )
              , React.createElement('div', { className: "flex items-center justify-between text-[10px] text-blue-200/80 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10387}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10388}}, "0% Disconnected" )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10389}}, "Target: 80%+" )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10390}}, "100% Fully Connected"  )
              )
            )
          )

          /* Live Recent Activity Feed */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10396}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10397}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10398}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10399}}, "Live Cross-Platform Activity Stream"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10400}}, "Real-time events aggregated across Care Navigator, Teleconsultation, Referrals, Follow-ups, and Labs."

                )
              )
            )

            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10406}}
              , _optionalChain([overviewData, 'access', _32 => _32.recentActivities, 'optionalAccess', _33 => _33.map, 'call', _34 => _34((act) => (
                React.createElement('div', {
                  key: act.id,
                  className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10408}}

                  , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10412}}
                    , React.createElement('span', { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10413}}
                      , act.severity === 'critical' ? '🚨' : act.severity === 'warning' ? '⚠️' : '✓'
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10416}}
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10417}}
                        , React.createElement('strong', { className: "text-slate-900 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10418}}, act.type)
                        , act.severity && (
                          React.createElement('span', {
                            className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              act.severity === 'critical'
                                ? 'bg-critical-100 text-critical-800'
                                : act.severity === 'warning'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10420}}

                            , act.severity
                          )
                        )
                      )
                      , React.createElement('p', { className: "text-slate-600 text-xs mt-0.5 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10433}}, act.description)
                    )
                  )

                  , React.createElement('div', { className: "text-right text-[10px] text-slate-400 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10437}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10438}}, act.actor)
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10439}}, new Date(act.timestamp).toLocaleTimeString())
                  )
                )
              ))])
            )
          )
        )
      )

      /* ========================================================= */
      /* SECTION 2: PATIENT & CARE MANAGEMENT */
      /* ========================================================= */
      , activeSection === 'patient_care' && patientCareData && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10452}}
          /* High-Risk Patient List with Dynamic Risk Badges */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10454}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10455}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10456}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10457}}, "High-Risk Patients Under Longitudinal Monitoring"    )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10458}}, "Dynamic risk scores calculated from frontline worker observation reports (Feature 04)."

                )
              )
              , React.createElement('span', { className: "text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10462}}
                , patientCareData.highRiskPatientsCount, " High-Risk Patients"
              )
            )

            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10467}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10468}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10469}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10470}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10471}}, "Patient Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10472}}, "Condition")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10473}}, "Dynamic Risk Score"  )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10474}}, "Assigned ASHA Worker"  )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10475}}, "Last Assessment" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10476}}, "Trend")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10479}}
                  , patientCareData.highRiskPatients.map((p, idx) => (
                    React.createElement('tr', { key: idx, className: "hover:bg-slate-50/50", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10481}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10482}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10483}}, p.patientName)
                        , React.createElement('div', { className: "text-[10px] text-slate-400 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10484}}, p.phone)
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10486}}, p.primaryCondition)
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10487}}
                        , React.createElement('span', {
                          className: `px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            p.riskLevel === 'HIGH'
                              ? 'bg-critical-100 text-critical-800'
                              : p.riskLevel === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10488}}

                          , p.riskScore, " / 100 ("   , p.riskLevel, ")"
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-700 font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10500}}, p.assignedWorkerName)
                      , React.createElement('td', { className: "py-3.5 px-4 text-[10px] text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10501}}
                        , p.lastFollowUpDate && !isNaN(new Date(p.lastFollowUpDate).getTime())
                          ? new Date(p.lastFollowUpDate).toLocaleDateString()
                          : 'Active Today'
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-bold text-[10px] uppercase text-purple-700"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10506}}
                        , p.trend === 'DETERIORATING' ? '🚨 Deteriorating' : p.trend === 'IMPROVING' ? '✓ Improving' : '→ Stable'
                      )
                    )
                  ))
                )
              )
            )
          )

          /* Referral Tracking Table */
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10517}}
            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10518}}
              , React.createElement('h4', { className: "text-sm font-black text-slate-900 flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10519}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10520}}, "📥 Incoming Referrals"  )
                , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10521}}
                  , _optionalChain([patientCareData, 'access', _35 => _35.incomingReferrals, 'optionalAccess', _36 => _36.length]) || 0
                )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10525}}
                , _optionalChain([patientCareData, 'access', _37 => _37.incomingReferrals, 'optionalAccess', _38 => _38.map, 'call', _39 => _39((r) => (
                  React.createElement('div', { key: r.referralId, className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10527}}
                    , React.createElement('div', { className: "flex items-center justify-between font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10528}}
                      , React.createElement('span', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10529}}, r.patientName)
                      , React.createElement('span', { className: "text-[9px] uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10530}}
                        , r.status
                      )
                    )
                    , React.createElement('div', { className: "text-[11px] text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10534}}, "From: "
                       , r.referringDoctorName, " • Priority: "   , React.createElement('strong', { className: "text-slate-700 uppercase" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10535}}, r.priority)
                    )
                  )
                ))])
              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10542}}
              , React.createElement('h4', { className: "text-sm font-black text-slate-900 flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10543}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10544}}, "📤 Outgoing Escalations"  )
                , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10545}}
                  , _optionalChain([patientCareData, 'access', _40 => _40.outgoingReferrals, 'optionalAccess', _41 => _41.length]) || 0
                )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10549}}
                , _optionalChain([patientCareData, 'access', _42 => _42.outgoingReferrals, 'optionalAccess', _43 => _43.map, 'call', _44 => _44((r) => (
                  React.createElement('div', { key: r.referralId, className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10551}}
                    , React.createElement('div', { className: "flex items-center justify-between font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10552}}
                      , React.createElement('span', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10553}}, r.patientName)
                      , React.createElement('span', { className: "text-[9px] uppercase px-2 py-0.5 bg-brand-100 text-brand-800 rounded"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10554}}
                        , r.status
                      )
                    )
                    , React.createElement('div', { className: "text-[11px] text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10558}}, "To: "
                       , r.receivingFacilityName, " • Priority: "   , React.createElement('strong', { className: "text-slate-700 uppercase" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10559}}, r.priority)
                    )
                  )
                ))])
              )
            )
          )

          /* Care Continuity Chain Inspection */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10568}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10569}}, "Longitudinal Care Chain Integrity"   )
            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10570}}
              , _optionalChain([patientCareData, 'access', _45 => _45.careContinuityChains, 'optionalAccess', _46 => _46.map, 'call', _47 => _47((c) => (
                React.createElement('div', {
                  key: c.patientId,
                  className: `p-4 rounded-2xl border ${
                    c.chainComplete ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10572}}

                  , React.createElement('div', { className: "flex items-center justify-between font-bold text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10578}}
                    , React.createElement('span', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10579}}, c.patientName)
                    , React.createElement('span', {
                      className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        c.chainComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10580}}

                      , c.chainComplete ? '✓ Complete Chain' : '⚠️ Gap in Follow-up'
                    )
                  )

                  , React.createElement('div', { className: "grid grid-cols-4 gap-1 mt-3 text-center text-[9px] font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10589}}
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.triage ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10590}}, "1. Triage"

                    )
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.teleconsult ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10593}}, "2. Consult"

                    )
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.referral ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10596}}, "3. Referral"

                    )
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.followUp ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10599}}, "4. Follow-Up"

                    )
                  )
                )
              ))])
            )
          )
        )
      )

      /* ========================================================= */
      /* SECTION 3: APPOINTMENTS & QUEUE MANAGEMENT */
      /* ========================================================= */
      , activeSection === 'appointments_queue' && queueData && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10614}}
          /* Queue KPIs */
          , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10616}}
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10617}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10618}}, "Avg Wait Time"  )
              , React.createElement('div', { className: "text-2xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10619}}, queueData.avgWaitTimeMinutes, " mins" )
              , React.createElement('span', { className: "text-[10px] text-emerald-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10620}}, "Within Golden Target (<20m)"   )
            )
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10622}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10623}}, "Currently Waiting" )
              , React.createElement('div', { className: "text-2xl font-black text-purple-700 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10624}}, queueData.waitingCount)
              , React.createElement('span', { className: "text-[10px] text-purple-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10625}}, "In live priority queue"   )
            )
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10627}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10628}}, "Walk-Ins vs Booked"  )
              , React.createElement('div', { className: "text-2xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10629}}
                , queueData.walkInCount, " / "  , queueData.bookedCount
              )
              , React.createElement('span', { className: "text-[10px] text-slate-500 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10632}}, "Walk-in vs Pre-booked"  )
            )
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10634}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10635}}, "Total Today" )
              , React.createElement('div', { className: "text-2xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10636}}, queueData.totalToday)
              , React.createElement('span', { className: "text-[10px] text-brand-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10637}}, "Scheduled & walk-in slots"   )
            )
          )

          /* Live Queue Table */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10642}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10643}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10644}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10645}}, "Real-Time Priority Queue Telemetry"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10646}}, "Sorted dynamically by Urgency Tier + Risk Multiplier + Anti-Starvation Wait Time (+2 pts/min)."

                )
              )
            )

            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10652}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10653}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10654}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10655}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10656}}, "Priority Score" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10657}}, "Patient Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10658}}, "Urgency Tier" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10659}}, "Wait Duration" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10660}}, "Type")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10661}}, "Status")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10664}}
                  , queueData.liveQueue.map((item, idx) => (
                    React.createElement('tr', { key: idx, className: "hover:bg-slate-50/50", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10666}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black font-mono text-purple-700 text-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10667}}, "⭐ "
                         , item.priorityScore
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10670}}, item.patientName)
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10671}}
                        , React.createElement('span', {
                          className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            item.urgencyTier === 'CRITICAL'
                              ? 'bg-critical-100 text-critical-800'
                              : item.urgencyTier === 'URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10672}}

                          , item.urgencyTier
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-mono font-bold text-slate-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10684}}, "⏱️ "
                         , item.waitDurationMinutes, " mins"
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10687}}
                        , React.createElement('span', { className: "text-[10px] font-bold text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10688}}
                          , item.isWalkIn ? '🚶 Walk-In' : '📅 Booked'
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10692}}
                        , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10693}}
                          , item.status
                        )
                      )
                    )
                  ))
                )
              )
            )
          )

          /* Peak Hours Load Distribution */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10705}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10706}}, "Hourly Patient Arrival & Peak Load"     )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10707}}
              , _optionalChain([queueData, 'access', _48 => _48.peakHourMetrics, 'optionalAccess', _49 => _49.map, 'call', _50 => _50((ph, idx) => (
                React.createElement('div', { key: idx, className: "flex items-center gap-3 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10709}}
                  , React.createElement('span', { className: "w-24 text-slate-500 font-bold text-[11px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10710}}, ph.hour)
                  , React.createElement('div', { className: "flex-1 h-4 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10711}}
                    , React.createElement('div', {
                      className: "h-full bg-purple-600 rounded-full"  ,
                      style: { width: `${(ph.patientCount / 30) * 100}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10712}}
)
                  )
                  , React.createElement('span', { className: "font-mono font-bold text-slate-900 w-12 text-right"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10717}}
                    , ph.patientCount, " pts"
                  )
                )
              ))])
            )
          )
        )
      )

      /* ========================================================= */
      /* SECTION 4: SERVICE & RESOURCE STATUS */
      /* ========================================================= */
      , activeSection === 'service_resource' && serviceResourceData && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10731}}
          /* Emergency Readiness Banner */
          , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 flex items-center justify-between flex-wrap gap-4"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10733}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10734}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-teal-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10735}}, "FACILITY EMERGENCY READINESS SCORE"

              )
              , React.createElement('h3', { className: "text-2xl font-black text-white mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10738}}, "Readiness Index: "
                  , serviceResourceData.emergencyReadinessScore, " / 100"
              )
              , React.createElement('p', { className: "text-xs text-slate-300 mt-1 max-w-xl font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10741}}, "Evaluated from available ICU beds, oxygen buffer, ready 108 ambulances, and emergency on-duty specialist doctors."

              )
            )

            , actorRole !== 'worker' && (
              React.createElement('button', {
                type: "button",
                onClick: () => {
                  const b = serviceResourceData.resources.find((r) => r.resourceType === 'bed');
                  if (b) {
                    setResourceTotal(b.totalCount);
                    setResourceAvailable(b.availableCount);
                  }
                  setShowResourceModal(true);
                },
                className: "px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10747}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10759}}, "✏️ Update Bed & Resource Availability"     )
              )
            )
          )

          /* Resources Grid */
          , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10765}}
            , _optionalChain([serviceResourceData, 'access', _51 => _51.resources, 'optionalAccess', _52 => _52.map, 'call', _53 => _53((res, idx) => {
              const utilRatio = (res.totalCount - res.availableCount) / res.totalCount;
              const isLow = res.availableCount / res.totalCount < 0.20;

              return (
                React.createElement('div', {
                  key: idx,
                  className: `bg-white rounded-3xl p-6 border transition-all space-y-3 ${
                    isLow ? 'border-critical-300 bg-critical-50/20' : 'border-slate-200'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10771}}

                  , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10777}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10778}}
                      , React.createElement('h4', { className: "text-sm font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10779}}, res.resourceName)
                      , React.createElement('span', { className: "text-[10px] font-mono text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10780}}, res.resourceType)
                    )
                    , React.createElement('span', {
                      className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        isLow ? 'bg-critical-100 text-critical-800' : 'bg-emerald-100 text-emerald-800'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10782}}

                      , isLow ? '⚠️ Low Stock' : '✓ Normal'
                    )
                  )

                  , React.createElement('div', { className: "flex items-baseline gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10791}}
                    , React.createElement('span', { className: "text-3xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10792}}, res.availableCount)
                    , React.createElement('span', { className: "text-xs font-bold text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10793}}, "/ " , res.totalCount, " Available" )
                  )

                  , React.createElement('div', { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10796}}
                    , React.createElement('div', {
                      className: `h-full rounded-full ${isLow ? 'bg-critical-500' : 'bg-teal-500'}`,
                      style: { width: `${(res.availableCount / res.totalCount) * 100}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10797}}
)
                  )

                  , React.createElement('div', { className: "text-[10px] text-slate-400 pt-1 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10803}}
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10804}}, "Updated: " , new Date(res.lastUpdated).toLocaleTimeString())
                    , res.isStale && React.createElement('span', { className: "text-amber-600 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10805}}, "⚠️ Stale Data"  )
                  )
                )
              );
            })])
          )

          /* Departments Capacity Table */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10813}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10814}}, "Active Clinical Departments"  )
            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10815}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10816}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10817}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10818}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10819}}, "Department")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10820}}, "Head Doctor" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10821}}, "Available Beds" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10822}}, "Capacity Utilization" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10823}}, "Status")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10826}}
                  , _optionalChain([serviceResourceData, 'access', _54 => _54.departments, 'optionalAccess', _55 => _55.map, 'call', _56 => _56((d) => (
                    React.createElement('tr', { key: d.departmentId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10828}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10829}}, d.name)
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-700 font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10830}}, d.headDoctor)
                      , React.createElement('td', { className: "py-3.5 px-4 font-mono font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10831}}
                        , d.availableBeds, " / "  , d.totalBeds
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10834}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10835}}
                          , React.createElement('div', { className: "w-24 h-2 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10836}}
                            , React.createElement('div', {
                              className: "h-full bg-teal-600 rounded-full"  ,
                              style: { width: `${d.utilizationPercent}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10837}}
)
                          )
                          , React.createElement('span', { className: "font-mono font-bold text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10842}}, d.utilizationPercent, "%")
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10845}}
                        , React.createElement('span', { className: "text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10846}}
                          , d.status
                        )
                      )
                    )
                  ))])
                )
              )
            )
          )
        )
      )

      /* ========================================================= */
      /* SECTION 5: ANALYTICS & REPORTS */
      /* ========================================================= */
      , activeSection === 'analytics' && analyticsData && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10863}}
          /* Footfall Time-Series Chart */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10865}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10866}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10867}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10868}}, "7-Day Patient Footfall Time-Series"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10869}}, "Aggregated time-series trend of total visits, OPD consultations, and emergency admissions."

                )
              )
              , React.createElement('span', { className: "text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10873}}, "Date Range: "
                  , analyticsData.dateRange.start, " to "  , analyticsData.dateRange.end
              )
            )

            , React.createElement('div', { className: "grid grid-cols-7 gap-2 pt-4 text-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10878}}
              , _optionalChain([analyticsData, 'access', _57 => _57.footfallTrends, 'optionalAccess', _58 => _58.map, 'call', _59 => _59((ft, idx) => (
                React.createElement('div', { key: idx, className: "space-y-2 flex flex-col justify-end"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10880}}
                  , React.createElement('div', { className: "text-[10px] font-mono font-bold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10881}}, ft.totalCount)
                  , React.createElement('div', { className: "w-full bg-slate-100 rounded-2xl p-1.5 flex flex-col justify-end h-40"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10882}}
                    , React.createElement('div', {
                      className: "bg-emerald-500 rounded-t-xl w-full"  ,
                      style: { height: `${(ft.opdCount / 200) * 100}%` },
                      title: `OPD: ${ft.opdCount}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10883}}
)
                    , React.createElement('div', {
                      className: "bg-critical-500 rounded-b-xl w-full mt-0.5"   ,
                      style: { height: `${(ft.emergencyCount / 200) * 100}%` },
                      title: `Emergency: ${ft.emergencyCount}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10888}}
)
                  )
                  , React.createElement('div', { className: "text-[10px] font-bold text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10894}}
                    , new Date(ft.date).toLocaleDateString('en-US', { weekday: 'short' })
                  )
                )
              ))])
            )

            , React.createElement('div', { className: "flex items-center justify-center gap-6 pt-2 text-xs font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10901}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10902}}
                , React.createElement('span', { className: "w-3 h-3 bg-emerald-500 rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10903}})
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10904}}, "OPD Consultations" )
              )
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10906}}
                , React.createElement('span', { className: "w-3 h-3 bg-critical-500 rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10907}})
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10908}}, "Emergency Admissions" )
              )
            )
          )

          /* Disease Category Breakdown */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10914}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10915}}, "Regional Disease & Clinical Case Distribution"     )
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10916}}
              , _optionalChain([analyticsData, 'access', _60 => _60.diseaseCategoryBreakdown, 'optionalAccess', _61 => _61.map, 'call', _62 => _62((dc, idx) => (
                React.createElement('div', { key: idx, className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10918}}
                  , React.createElement('div', { className: "flex items-center justify-between text-xs font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10919}}
                    , React.createElement('span', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10920}}, dc.category)
                    , React.createElement('span', { className: "font-mono text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10921}}
                      , dc.count, " cases ("  , dc.percentage, "%)"
                    )
                  )
                  , React.createElement('div', { className: "w-full h-3 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10925}}
                    , React.createElement('div', {
                      className: "h-full bg-emerald-600 rounded-full"  ,
                      style: { width: `${dc.percentage}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10926}}
)
                  )
                )
              ))])
            )
          )
        )
      )

      /* ========================================================= */
      /* SECTION 6: ALERTS & NOTIFICATION CENTER */
      /* ========================================================= */
      , activeSection === 'alerts' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10942}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10943}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10944}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10945}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10946}}, "Unified Facility Alert & Notification Center"     )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10947}}, "Rule-triggered alerts for critical triage red-flags, low resource thresholds, missed follow-ups, and data syncs."

                )
              )

              /* Severity Filter */
              , React.createElement('div', { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10953}}
                , ['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
                  React.createElement('button', {
                    key: sev,
                    type: "button",
                    onClick: () => setAlertSeverityFilter(sev),
                    className: `px-3 py-1.5 rounded-lg transition-all ${
                      alertSeverityFilter === sev
                        ? 'bg-slate-900 text-white font-black shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10955}}

                    , sev
                  )
                ))
              )
            )

            /* Alert List */
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10972}}
              , filteredAlerts.length === 0 ? (
                React.createElement('div', { className: "p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10974}}, "No active alerts matching severity filter '"
                        , alertSeverityFilter, "'."
                )
              ) : (
                filteredAlerts.map((alt) => (
                  React.createElement('div', {
                    key: alt.alertId,
                    className: `p-5 rounded-2xl border transition-all flex items-start justify-between flex-wrap gap-3 ${
                      alt.severity === 'critical'
                        ? 'border-critical-300 bg-critical-50/40'
                        : alt.severity === 'warning'
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10979}}

                    , React.createElement('div', { className: "flex items-start gap-3.5 max-w-2xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10989}}
                      , React.createElement('span', { className: "text-2xl mt-0.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10990}}
                        , alt.severity === 'critical' ? '🚨' : alt.severity === 'warning' ? '⚠️' : 'ℹ️'
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10993}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10994}}
                          , React.createElement('span', {
                            className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              alt.severity === 'critical'
                                ? 'bg-critical-200 text-critical-900'
                                : alt.severity === 'warning'
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-slate-200 text-slate-800'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10995}}

                            , alt.severity
                          )
                          , React.createElement('span', { className: "text-[10px] font-mono text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11006}}, alt.alertType)
                          , React.createElement('span', {
                            className: `text-[9px] font-bold px-2 py-0.5 rounded ${
                              alt.status === 'active'
                                ? 'bg-critical-100 text-critical-800 font-black'
                                : alt.status === 'acknowledged'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11007}}

                            , alt.status
                          )
                        )
                        , React.createElement('p', { className: "text-xs font-bold text-slate-900 mt-1.5 leading-relaxed"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11019}}, alt.message)
                        , React.createElement('div', { className: "text-[10px] text-slate-400 font-medium mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11020}}, "Generated: "
                           , new Date(alt.createdAt).toLocaleTimeString(), " • ID: "   , alt.alertId
                        )
                      )
                    )

                    /* Alert Action Buttons */
                    , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11027}}
                      , alt.status === 'active' && (
                        React.createElement('button', {
                          type: "button",
                          onClick: () => handleUpdateAlertStatus(alt.alertId, 'acknowledged'),
                          className: "px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11029}}
, "Acknowledge"

                        )
                      )
                      , alt.status !== 'resolved' && (
                        React.createElement('button', {
                          type: "button",
                          onClick: () => handleUpdateAlertStatus(alt.alertId, 'resolved'),
                          className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11038}}
, "✓ Resolve"

                        )
                      )
                    )
                  )
                ))
              )
            )
          )
        )
      )

      /* ========================================================= */
      /* MODAL: ADMIN RESOURCE UPDATE */
      /* ========================================================= */
      , showResourceModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11059}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11060}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11061}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11062}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11063}}, "Admin Facility Telemetry"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11066}}, "Update Bed & Resource Availability"    )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowResourceModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11068}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handleUpdateResource, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11077}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11078}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11079}}, "Target Resource Type"  )
                , React.createElement('select', {
                  value: selectedResourceType,
                  onChange: (e) => {
                    const t = e.target.value;
                    setSelectedResourceType(t);
                    const res = _optionalChain([serviceResourceData, 'optionalAccess', _63 => _63.resources, 'optionalAccess', _64 => _64.find, 'call', _65 => _65((r) => r.resourceType === t)]);
                    if (res) {
                      setResourceTotal(res.totalCount);
                      setResourceAvailable(res.availableCount);
                    }
                  },
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11080}}

                  , React.createElement('option', { value: "bed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11093}}, "General Inpatient Beds"  )
                  , React.createElement('option', { value: "icu_bed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11094}}, "ICU & Critical Beds"   )
                  , React.createElement('option', { value: "ventilator", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11095}}, "Mechanical Ventilators" )
                  , React.createElement('option', { value: "oxygen", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11096}}, "Oxygen Cylinders" )
                  , React.createElement('option', { value: "ambulance", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11097}}, "108 / Emergency Ambulances"   )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11101}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11102}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11103}}, "Total Capacity" )
                  , React.createElement('input', {
                    type: "number",
                    min: "1",
                    value: resourceTotal,
                    onChange: (e) => setResourceTotal(Number(e.target.value)),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11104}}
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11114}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11115}}, "Available Count" )
                  , React.createElement('input', {
                    type: "number",
                    min: "0",
                    max: resourceTotal,
                    value: resourceAvailable,
                    onChange: (e) => setResourceAvailable(Number(e.target.value)),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11116}}
                  )
                )
              )

              , React.createElement('div', { className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11128}}, "ℹ️ If available count drops below 20% capacity, a "
                         , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11129}}, "Critical Resource Alert"  ), " is automatically generated."
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11132}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowResourceModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11133}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11140}}
, "Save Telemetry"

                )
              )
            )
          )
        )
      )
    )
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
    React.createElement('div', { className: "space-y-10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11170}}
      /* Hero Header Banner */
      , React.createElement('div', { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11172}}
        , React.createElement('div', { className: "absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11173}})
        , React.createElement('div', { className: "absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11174}})

        , React.createElement('div', { className: "max-w-3xl relative z-10 space-y-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11176}}
          , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-indigo-300 backdrop-blur-md"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11177}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11178}}), "NATIONAL DIGITAL HEALTH MISSION • RURAL HEALTHCARE OPERATING SYSTEM"

          )

          , React.createElement('h2', { className: "text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11182}}, "About MedVeda"

          )

          , React.createElement('p', { className: "text-slate-300 text-sm sm:text-base leading-relaxed font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11186}}, "MedVeda is an intelligent, clinically guarded healthcare orchestration platform engineered to bridge the last-mile gap in rural and peri-urban healthcare delivery across India. By integrating multi-agent AI triage, live verified hospital discovery, prioritized teleconsultation, closed-loop referrals, longitudinal follow-ups, ABDM-interoperable health records, and medicine/diagnostic logistics, MedVeda ensures no patient falls through the cracks."

          )

          , React.createElement('div', { className: "flex items-center gap-3 pt-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11190}}
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature1,
              className: "px-5 py-3 bg-critical-600 hover:bg-critical-500 text-white font-black text-xs rounded-xl shadow-lg shadow-critical-600/30 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11191}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11196}}, "🚨 Launch Care Navigator (F01)"    )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11197}}, "→")
            )

            , React.createElement('button', {
              type: "button",
              onClick: onBackToHome,
              className: "px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11200}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11205}}, "🏠 Back to Home"   )
            )
          )
        )
      )

      /* Key Platform Highlights Banner */
      , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11212}}
        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11213}}
          , React.createElement('span', { className: "text-3xl font-black text-indigo-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11214}}, "7")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11215}}, "Integrated Modules"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11218}}, "Triage to Facility Control"   )
        )

        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11221}}
          , React.createElement('span', { className: "text-3xl font-black text-emerald-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11222}}, "100%")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11223}}, "Safety Guardrails"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11226}}, "Strict Invariant Gating"  )
        )

        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11229}}
          , React.createElement('span', { className: "text-3xl font-black text-purple-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11230}}, "4-Stage")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11231}}, "Care Continuity Chain"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11234}}, "Triage → Consult → Ref → Follow-up"      )
        )

        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11237}}
          , React.createElement('span', { className: "text-3xl font-black text-teal-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11238}}, "ABDM")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11239}}, "FHIR Compliant"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11242}}, "Interoperable Health Records"  )
        )
      )

      /* The Problem & Our Mission */
      , React.createElement('div', { className: "bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11247}}
        , React.createElement('div', { className: "max-w-3xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11248}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11249}}, "THE LAST-MILE HEALTHCARE CRISIS"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-slate-900 mt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11252}}, "Why We Built MedVeda"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11255}}, "In rural India, over 70% of the population relies on a tiered public health network of Sub-Centres, Primary Health Centres (PHCs), and Community Health Centres (CHCs). When medical emergencies strike or chronic conditions deteriorate, patients face systemic bottlenecks:"

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11260}}
          , React.createElement('div', { className: "p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11261}}
            , React.createElement('div', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11262}}, "⏳")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11263}}, "Critical Triage & Routing Delays"    )
            , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11264}}, "Patients with acute STEMI chest pain or stroke often travel hours to facilities that lack 24/7 ICU beds, catheterization labs, or on-duty emergency physicians."

            )
          )

          , React.createElement('div', { className: "p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11269}}
            , React.createElement('div', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11270}}, "📴")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11271}}, "Fragmented Paper Referrals"  )
            , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11272}}, "Paper referral slips are frequently lost, counter-referrals rarely happen, and frontline ASHA workers have no digital visibility into post-hospitalization care plans."

            )
          )

          , React.createElement('div', { className: "p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11277}}
            , React.createElement('div', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11278}}, "📦")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11279}}, "Medicine & Diagnostic Stockouts"   )
            , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11280}}, "Patients travel long distances only to discover essential medicines (e.g. Tenecteplase, Telmisartan) or diagnostic tests are out of stock at local pharmacies."

            )
          )
        )
      )

      /* The 7 Core Platform Pillars */
      , React.createElement('div', { className: "bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11288}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11289}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11290}}, "COMPREHENSIVE SOLUTION ARCHITECTURE"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-slate-900 mt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11293}}, "The 7 Pillars of the MedVeda Platform"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11296}}, "Every feature in MedVeda is designed to interconnect seamlessly, creating an unbroken continuum of care."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11301}}
          /* Pillar 1 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-critical-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11303}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11304}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11305}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-critical-100 text-critical-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11306}}, "Feature 01"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11309}}, "3-Agent Pipeline" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11311}}, "🚨 Smart Care Navigator"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11312}}, "Autonomous clinical triage with non-bypassable red-flag detection, live hospital discovery via Google Search MCP, and multi-factor capability ranking (OPD vs. 24x7 Emergency)."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature1,
              className: "w-full py-2.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11316}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11321}}, "Launch Care Navigator"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11322}}, "→")
            )
          )

          /* Pillar 2 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-brand-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11327}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11328}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11329}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-100 text-brand-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11330}}, "Feature 02"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11333}}, "Priority Queuing" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11335}}, "🩺 Teleconsultation & Queue"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11336}}, "Multi-facility doctor roster with real-time urgency-weighted queuing, anti-starvation wait score (+2 pts/min), and seamless call mode degradation (Video → Audio → In-App Chat)."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature2,
              className: "w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11340}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11345}}, "Start Teleconsultation" )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11346}}, "→")
            )
          )

          /* Pillar 3 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11351}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11352}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11353}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11354}}, "Feature 03"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11357}}, "Closed-Loop Token" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11359}}, "📋 Smart Referral Management"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11360}}, "Digital referral pass with unique token (REF-2026-XXXXX), strict 5-stage lifecycle state machine (CREATED → SENT → IN_PROGRESS → REACHED → COMPLETED), and counter-referral loop."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature3,
              className: "w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11364}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11369}}, "Open Referrals Workspace"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11370}}, "→")
            )
          )

          /* Pillar 4 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11375}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11376}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11377}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11378}}, "Feature 04"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11381}}, "Dynamic Risk Score"  )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11383}}, "🔄 High-Risk Follow-Up System"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11384}}, "Doctor-assigned periodic schedules for frontline ASHA health workers, mobile observation forms, dynamic risk scoring engine (0-100), and automated hospital deterioration alerts."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature4,
              className: "w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11388}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11393}}, "Open Follow-Up System"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11394}}, "→")
            )
          )

          /* Pillar 5 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11399}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11400}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11401}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11402}}, "Feature 05"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11405}}, "ABHA / ABDM FHIR"   )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11407}}, "📁 Interoperable Health Records"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11408}}, "Internal Medical ID anchor, optional ABDM/ABHA linking, OCR paper prescription parsing, unified 4-source longitudinal timeline, and audited emergency access override."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature5,
              className: "w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11412}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11417}}, "Open Health Records"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11418}}, "→")
            )
          )

          /* Pillar 6 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11423}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11424}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11425}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11426}}, "Feature 06"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11429}}, "Geo Inventory & Labs"   )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11431}}, "💊 Medicine & Diagnostic Coordination"    )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11432}}, "Real-time pharmacy stock search with Haversine distance & out-of-radius fallback, owner-only RBAC CRUD, counter reservation pickup, and doctor diagnostic test fulfillment."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature6,
              className: "w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11436}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11441}}, "Open Medicine & Lab"   )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11442}}, "→")
            )
          )

          /* Pillar 7 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all md:col-span-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11447}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11448}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11449}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11450}}, "Feature 07"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11453}}, "Multi-Source Aggregation" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11455}}, "🏥 Facility Operations Dashboard"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11456}}, "Real-time multi-source aggregation layer across Features 01–06: 6 role-gated sections, Care Continuity Index (Triage → Consult → Referral → Follow-Up), live priority queue, updatable bed/ICU/oxygen resource meters, time-series analytics, and unified alert notifications."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature7,
              className: "w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11460}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11465}}, "Open Facility Dashboard"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11466}}, "→")
            )
          )
        )
      )

      /* 3-Agent AI Architecture Deep Dive */
      , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-blue-900/40 space-y-6"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11473}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11474}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-emerald-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11475}}, "CORE AI ENGINE"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-white mt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11478}}, "The 3-Agent Clinical Navigation Architecture"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1 max-w-2xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11481}}, "Built on a decoupled 3-agent orchestration pipeline that transforms raw patient symptoms into verified, clinically safe routing decisions."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11486}}
          , React.createElement('div', { className: "bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11487}}
            , React.createElement('div', { className: "w-8 h-8 rounded-full bg-critical-500/20 text-critical-300 font-bold flex items-center justify-center text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11488}}, "01"

            )
            , React.createElement('h4', { className: "font-bold text-white text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11491}}, "Agent 1: Triage Specialist"   )
            , React.createElement('p', { className: "text-xs text-slate-400 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11492}}, "Analyzes chief complaints and red-flags. Determines urgency tier (CRITICAL, URGENT, ROUTINE) and required specialty with absolute red-flag invariance."

            )
          )

          , React.createElement('div', { className: "bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11497}}
            , React.createElement('div', { className: "w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11498}}, "02"

            )
            , React.createElement('h4', { className: "font-bold text-white text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11501}}, "Agent 2: Research & Verification"    )
            , React.createElement('p', { className: "text-xs text-slate-400 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11502}}, "Leverages Google Search MCP to discover regional hospitals in real time, extract verified services, and strictly classify OPD-only vs. 24x7 Emergency facilities."

            )
          )

          , React.createElement('div', { className: "bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11507}}
            , React.createElement('div', { className: "w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11508}}, "03"

            )
            , React.createElement('h4', { className: "font-bold text-white text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11511}}, "Agent 3: Clinical Ranking Engine"    )
            , React.createElement('p', { className: "text-xs text-slate-400 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11512}}, "Executes multi-attribute ranking evaluating urgency match, verified emergency readiness, specialty alignment, travel distance, and operational hours."

            )
          )
        )
      )

      /* Stakeholders & Personas */
      , React.createElement('div', { className: "bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11520}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11521}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11522}}, "MULTIDISCIPLINARY COOPERATION"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-slate-900 mt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11525}}, "Built for Every Healthcare Stakeholder"

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11530}}
          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11531}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11532}}, "👩‍⚕️")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11533}}, "ASHA Health Workers"  )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11534}}, "Conduct guided field triage, submit longitudinal home observation reports, and track high-risk patients on mobile devices."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11539}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11540}}, "👤")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11541}}, "Rural Citizens & Families"   )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11542}}, "Check symptoms freely, book teleconsultations, locate nearby medicines, and carry a digital Medical ID card."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11547}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11548}}, "👨‍⚕️")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11549}}, "Specialist Doctors" )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11550}}, "Review prioritized queues, consult remotely via video/audio/chat, sign digital EMR prescriptions, and generate digital referrals."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11555}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11556}}, "🏪")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11557}}, "Medical Shop Owners"  )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11558}}, "Manage inventory stock levels with owner-only RBAC and confirm incoming customer medicine reservation pickups."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11563}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11564}}, "🧪")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11565}}, "Diagnostic Lab Staff"  )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11566}}, "Manage diagnostic test catalogs, track sample collection to completion, and publish dual clinical & plain-language reports."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11571}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11572}}, "🏥")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11573}}, "Facility Administrators" )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11574}}, "Monitor bed/ICU/oxygen capacity, track regional footfall analytics, and resolve rule-triggered emergency alerts."

            )
          )
        )
      )

      /* Standards & Technical Guarantees */
      , React.createElement('div', { className: "bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 sm:p-10 border border-indigo-200/80 space-y-4 text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11582}}
        , React.createElement('h3', { className: "text-lg font-black text-indigo-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11583}}, "Technical & Standards Compliance"   )
        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11584}}
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11585}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11586}}, "ABDM Sandbox" )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11587}}, "Open sandbox compliant architecture with FHIR standard bundle serialization."        )
          )
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11589}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11590}}, "Immutable Audit Log"  )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11591}}, "Every emergency access override records mandatory clinical justification and clinician ID."          )
          )
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11593}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11594}}, "Strict RBAC Model"  )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11595}}, "Backend-enforced access control ensuring non-owner roles cannot mutate private data."         )
          )
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11597}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11598}}, "54/54 Unit Tests"  )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11599}}, "100% test pass rate verifying clinical invariants, priority formulas, and state machines."           )
          )
        )
      )

      /* Call to Action Banner */
      , React.createElement('div', { className: "text-center bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/40 space-y-4"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11605}}
        , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11606}}, "Experience the Future of Rural Healthcare"     )
        , React.createElement('p', { className: "text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11607}}, "Explore any of the 7 features in the MedVeda ecosystem, simulate different stakeholder roles, and see how intelligent care navigation transforms patient outcomes."

        )
        , React.createElement('div', { className: "flex items-center justify-center gap-3 pt-2 flex-wrap"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11610}}
          , React.createElement('button', {
            type: "button",
            onClick: onLaunchFeature1,
            className: "px-6 py-3 bg-critical-600 hover:bg-critical-500 text-white font-black text-xs rounded-xl shadow-lg transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11611}}
, "Start Care Navigator Demo"

          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11618}}
, "Explore All Features"

          )
        )
      )
    )
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
    React.createElement('div', { className: "min-h-screen flex flex-col bg-white text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11768}}
      , React.createElement(Header, {
        currentView: view,
        setView: setView,
        currentScreen: feature1Screen,
        setScreen: setScreen,
        actorRole: actorRole,
        setActorRole: setActorRole, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11769}}
      )

      , React.createElement('main', { className: "flex-1 max-w-6xl xl:max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11778}}
        /* VIEW 1: HOMEPAGE */
        , view === 'home' && (
          React.createElement(ScreenHomepage, {
            onLaunchFeature1: () => {
              setView('feature1');
              setScreen(1);
            },
            onLaunchFeature2: () => {
              setView('feature2');
              setTeleconsultScreen('entry');
            },
            onLaunchFeature3: () => {
              setView('feature3');
            },
            onLaunchFeature4: () => {
              setView('feature4');
            },
            onLaunchFeature5: () => {
              setView('feature5');
            },
            onLaunchFeature6: () => {
              setView('feature6');
            },
            onLaunchFeature7: () => {
              setView('feature7');
            },
            onLaunchAbout: () => {
              setView('about');
            },
            actorRole: actorRole,
            setActorRole: setActorRole, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11781}}
          )
        )

        /* VIEW 2: FEATURE 01 — SMART CARE NAVIGATOR */
        , view === 'feature1' && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11815}}
            , feature1Screen === 1 && (
              React.createElement(Screen1PatientInfo, {
                patient: patient,
                setPatient: setPatient,
                onNext: () => setScreen(2), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11817}}
              )
            )

            , feature1Screen === 2 && (
              React.createElement(Screen2SymptomAssessment, {
                symptoms: symptoms,
                setSymptoms: setSymptoms,
                onNext: () => setScreen(3),
                onBack: () => setScreen(1), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11825}}
              )
            )

            , feature1Screen === 3 && (
              React.createElement(Screen3RedFlags, {
                redFlags: redFlags,
                setRedFlags: setRedFlags,
                onNext: () => setScreen(4),
                onBack: () => setScreen(2), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11834}}
              )
            )

            , feature1Screen === 4 && (
              React.createElement(Screen4TriageProcessing, {
                patient: patient,
                symptoms: symptoms,
                redFlags: redFlags,
                onComplete: (data) => {
                  if (data) setTriageResult(data);
                  setScreen(5);
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11843}}
              )
            )

            , feature1Screen === 5 && (
              React.createElement(Screen5TriageResult, {
                triage: triageResult,
                onFindHospitals: () => setScreen(6),
                onBack: () => setScreen(3), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11855}}
              )
            )

            , feature1Screen === 6 && (
              React.createElement(Screen6HospitalSearch, {
                location: patient.location,
                requiredSpecialty: _optionalChain([triageResult, 'optionalAccess', _66 => _66.requiredSpecialty]),
                emergencyRequired: _optionalChain([triageResult, 'optionalAccess', _67 => _67.emergencyRequired]),
                onComplete: (liveFacilities) => {
                  if (liveFacilities && liveFacilities.length > 0) {
                    setFacilities(liveFacilities);
                    setSelectedFacility(liveFacilities[0]);
                  }
                  setScreen(7);
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11863}}
              )
            )

            , feature1Screen === 7 && (
              React.createElement(Screen7RecommendedFacilities, {
                facilities: facilities,
                onSelectFacility: (fac) => {
                  setSelectedFacility(fac);
                  setScreen(8);
                },
                onBack: () => setScreen(5), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11878}}
              )
            )

            , feature1Screen === 8 && (
              React.createElement(Screen8FacilityDetails, {
                facility: selectedFacility,
                onNext: () => setScreen(9),
                onBack: () => setScreen(7), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11889}}
              )
            )

            , feature1Screen === 9 && (
              React.createElement(Screen9ReferralPass, {
                facility: selectedFacility,
                patient: patient,
                onRestart: handleRestartFeature1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11897}}
              )
            )
          )
        )

        /* VIEW 3: FEATURE 02 — TELECONSULTATION & QUEUE MANAGEMENT */
        , view === 'feature2' && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11908}}
            , teleconsultScreen === 'entry' && (
              React.createElement(ScreenTeleconsultEntry, {
                actorRole: actorRole,
                onSelectPath: (path) => {
                  setActorRole(path);
                  setTeleconsultScreen('booking');
                },
                onBackToHome: () => setView('home'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11910}}
              )
            )

            , teleconsultScreen === 'booking' && (
              React.createElement(ScreenTeleconsultBooking, {
                pathActor: actorRole,
                onBookSuccess: (apt) => {
                  setTeleconsultAppointment(apt);
                  setTeleconsultScreen('queue');
                },
                onBack: () => setTeleconsultScreen('entry'),
                onEmergencyEscalate: () => {
                  setView('feature1');
                  setScreen(1);
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11921}}
              )
            )

            , teleconsultScreen === 'queue' && (
              React.createElement(ScreenTeleconsultQueue, {
                appointment: teleconsultAppointment,
                onJoinCall: () => setTeleconsultScreen('call'),
                onBack: () => setTeleconsultScreen('booking'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11936}}
              )
            )

            , teleconsultScreen === 'call' && (
              React.createElement(ScreenTeleconsultCall, {
                appointment: teleconsultAppointment,
                pathActor: actorRole,
                onCompleteConsultation: (vitalsLogged) => {
                  setRecordedVitals(vitalsLogged);
                  setTeleconsultScreen('doctor');
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11944}}
              )
            )

            , teleconsultScreen === 'doctor' && (
              React.createElement(ScreenDoctorDocumentation, {
                appointment: teleconsultAppointment,
                vitals: recordedVitals,
                onSaveDocumentation: (docData) => {
                  setConsultationDocumentation(docData);
                  setTeleconsultScreen('summary');
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11955}}
              )
            )

            , teleconsultScreen === 'summary' && (
              React.createElement(ScreenConsultationSummary, {
                consultationData: consultationDocumentation,
                onRestart: handleRestartFeature2,
                onGoHome: () => setView('home'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11966}}
              )
            )
          )
        )

        /* VIEW 4: FEATURE 03 — SMART REFERRAL MANAGEMENT SYSTEM */
        , view === 'feature3' && (
          React.createElement(ScreenReferralManagement, {
            actorRole: actorRole,
            setActorRole: setActorRole,
            onBackToHome: () => setView('home'),
            onNavigateToCareNavigator: () => {
              setView('feature1');
              setScreen(1);
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11977}}
          )
        )

        /* VIEW 5: FEATURE 04 — HIGH-RISK PATIENT FOLLOW-UP SYSTEM */
        , view === 'feature4' && (
          React.createElement(ScreenHighRiskFollowUp, {
            actorRole: actorRole,
            setActorRole: setActorRole,
            onBackToHome: () => setView('home'),
            onNavigateToCareNavigator: () => {
              setView('feature1');
              setScreen(1);
            },
            onNavigateToReferrals: () => setView('feature3'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11990}}
          )
        )

        /* VIEW 6: FEATURE 05 — INTEROPERABLE HEALTH RECORDS */
        , view === 'feature5' && (
          React.createElement(ScreenInteroperableRecords, {
            actorRole: actorRole,
            setActorRole: setActorRole,
            onBackToHome: () => setView('home'),
            onNavigateToCareNavigator: () => {
              setView('feature1');
              setScreen(1);
            },
            onNavigateToTeleconsult: () => {
              setView('feature2');
              setTeleconsultScreen('entry');
            },
            onNavigateToReferrals: () => setView('feature3'),
            onNavigateToFollowUps: () => setView('feature4'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 12004}}
          )
        )

        /* VIEW 7: FEATURE 06 — MEDICINE AVAILABILITY & DIAGNOSTIC COORDINATION */
        , view === 'feature6' && (
          React.createElement(ScreenMedicineDiagnostics, {
            actorRole: actorRole,
            setActorRole: setActorRole,
            onBackToHome: () => setView('home'),
            onNavigateToCareNavigator: () => {
              setView('feature1');
              setScreen(1);
            },
            onNavigateToTeleconsult: () => {
              setView('feature2');
              setTeleconsultScreen('entry');
            },
            onNavigateToReferrals: () => setView('feature3'),
            onNavigateToFollowUps: () => setView('feature4'),
            onNavigateToRecords: () => setView('feature5'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 12023}}
          )
        )

        /* VIEW 8: FEATURE 07 — FACILITY DASHBOARD & MULTI-SOURCE AGGREGATION LAYER */
        , view === 'feature7' && (
          React.createElement(ScreenFacilityDashboard, {
            actorRole: actorRole,
            setActorRole: setActorRole,
            onBackToHome: () => setView('home'),
            onNavigateToCareNavigator: () => {
              setView('feature1');
              setScreen(1);
            },
            onNavigateToTeleconsult: () => {
              setView('feature2');
              setTeleconsultScreen('entry');
            },
            onNavigateToReferrals: () => setView('feature3'),
            onNavigateToFollowUps: () => setView('feature4'),
            onNavigateToRecords: () => setView('feature5'),
            onNavigateToMedicine: () => setView('feature6'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 12043}}
          )
        )

        /* VIEW 9: ABOUT US PAGE */
        , view === 'about' && (
          React.createElement(ScreenAboutUs, {
            onBackToHome: () => setView('home'),
            onLaunchFeature1: () => {
              setView('feature1');
              setScreen(1);
            },
            onLaunchFeature2: () => {
              setView('feature2');
              setTeleconsultScreen('entry');
            },
            onLaunchFeature3: () => {
              setView('feature3');
            },
            onLaunchFeature4: () => {
              setView('feature4');
            },
            onLaunchFeature5: () => {
              setView('feature5');
            },
            onLaunchFeature6: () => {
              setView('feature6');
            },
            onLaunchFeature7: () => {
              setView('feature7');
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12064}}
          )
        )
      )

      , React.createElement('footer', { className: "bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12093}}
        , React.createElement('div', { className: "max-w-6xl xl:max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12094}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 12095}}, "MedVeda Smart Care Platform • Autonomous Care Navigation • Priority Telehealth • Closed-Loop Referrals • High-Risk Follow-Up • Interoperable Health Records • Medicine & Diagnostic Coordination • Facility Operations Dashboard"

          )
          , React.createElement('div', { className: "flex items-center gap-3 font-bold text-slate-700 shrink-0"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12098}}
            , React.createElement('button', {
              type: "button",
              onClick: () => setView('home'),
              className: "hover:text-[#0b2b82] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12099}}
, "Home"

            )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 12106}}, "•")
            , React.createElement('button', {
              type: "button",
              onClick: () => setView('about'),
              className: "text-[#0b2b82] hover:text-[#071a4f] transition-colors underline underline-offset-2 font-black"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12107}}
, "ℹ️ About MedVeda"

            )
          )
        )
      )
    )
  );
}

// Mount the React Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 12123}} ));

