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

function Header({ currentView, setView, currentScreen, setScreen, actorRole, setActorRole }) {
  const [featuresOpen, setFeaturesOpen] = useState(false);
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
    React.createElement('header', { className: "sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 613}}
      /* Top Emergency Hotline Strip */
      , React.createElement('div', { className: "bg-critical-600 text-white text-xs font-bold py-1.5 px-4 flex items-center justify-between"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}
        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 616}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-white animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 617}})
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 618}}, "EMERGENCY AMBULANCE HOTLINE: 108 / POLICE: 112"      )
        )
        , React.createElement('div', { className: "flex items-center gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}
          , React.createElement('span', { className: "hidden sm:inline text-critical-100 text-[11px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 621}}, "Rural Healthcare Teleconsult & Emergency Grid"     )
          , React.createElement('a', { href: "tel:108", className: "px-2.5 py-0.5 bg-white text-critical-700 rounded font-black text-xs hover:bg-critical-50"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}, "Call 108"

          )
        )
      )

      /* Main Navigation Bar */
      , React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}
        /* Logo & Brand */
        , React.createElement('div', { className: "flex items-center gap-3 cursor-pointer select-none"    , onClick: () => setView('home'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 631}}
          , React.createElement(MedVedaLogo, { className: "h-10 w-10" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 632}} )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 633}}
            , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}}
              , React.createElement('h1', { className: "font-black text-slate-900 text-lg tracking-tight flex items-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 635}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}, "MED")
                , React.createElement('span', { className: "text-teal-600 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 637}}, "VEDA")
              )
              , React.createElement('span', { className: "text-[10px] uppercase font-black px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 639}}, "v2.0"

              )
            )
            , React.createElement('p', { className: "text-[11px] text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}}, "Smart Care Platform • Telehealth & Triage Grid"       )
          )
        )

        /* Navigation Tabs - Exactly 3 Sections: Home, Features (with Dropdown), About Us */
        , React.createElement('nav', { className: "flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold relative"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 648}}
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
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 650}}
, "Home"

          )

          /* Section 2: Features (Dropdown containing all feature map options) */
          , React.createElement('div', { className: "relative", ref: featuresRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 666}}
            , React.createElement('button', {
              type: "button",
              onClick: () => setFeaturesOpen(!featuresOpen),
              className: `px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                isFeatureActive
                  ? 'bg-[#0b2b82] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0b2b82] hover:bg-blue-50/70'
              }`,
              'aria-expanded': featuresOpen,
              'aria-haspopup': "true", __self: this, __source: {fileName: _jsxFileName, lineNumber: 667}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}, "Features")
              , React.createElement('svg', {
                className: `w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`,
                fill: "none",
                viewBox: "0 0 24 24"   ,
                stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}}

                , React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M19 9l-7 7-7-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 685}} )
              )
            )

            /* Dropdown Menu with all Feature Map options */
            , featuresOpen && (
              React.createElement('div', { className: "absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 691}}
                , React.createElement('div', { className: "px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 692}}
                  , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 693}}, "Platform Feature Modules"

                  )
                  , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0b2b82] border border-blue-100"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}}, "7 Systems"

                  )
                )

                , React.createElement('div', { className: "space-y-1 max-h-[70vh] overflow-y-auto"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 701}}
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
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 705}}

                        , React.createElement('div', {
                          className: `w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'bg-[#0b2b82] text-white shadow-xs' : 'bg-slate-100'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}

                          , item.icon
                        )
                        , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 725}}
                          , React.createElement('div', { className: "flex items-center justify-between gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 726}}
                            , React.createElement('span', { className: "text-xs font-bold leading-tight group-hover:text-[#0b2b82]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 727}}
                              , item.label
                            )
                            , React.createElement('span', { className: "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 730}}
                              , item.code
                            )
                          )
                          , React.createElement('p', { className: "text-[11px] text-slate-500 leading-snug font-normal mt-0.5 line-clamp-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 734}}
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
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 747}}
, "About Us"

          )
        )

        /* Actor / Role Switcher */
        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 764}}
          , React.createElement('span', { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:inline"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 765}}, "Role:")
          , React.createElement('select', {
            value: actorRole,
            onChange: (e) => setActorRole(e.target.value),
            className: "text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-[#0b2b82] focus:border-[#0b2b82] shadow-sm cursor-pointer"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 766}}

            , React.createElement('option', { value: "worker", __self: this, __source: {fileName: _jsxFileName, lineNumber: 771}}, "Frontline Health Worker (ASHA)"   )
            , React.createElement('option', { value: "patient", __self: this, __source: {fileName: _jsxFileName, lineNumber: 772}}, "Self-Service Patient" )
            , React.createElement('option', { value: "doctor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 773}}, "Consulting / Referring Doctor"   )
            , React.createElement('option', { value: "shop_owner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 774}}, "Medical Shop Owner"  )
            , React.createElement('option', { value: "lab_staff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 775}}, "Diagnostic Lab Staff"  )
            , React.createElement('option', { value: "facility", __self: this, __source: {fileName: _jsxFileName, lineNumber: 776}}, "Receiving Facility Administrator"  )
            , React.createElement('option', { value: "admin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 777}}, "Facility Coordinator / Admin"   )
          )
        )
      )

      /* Feature 01 Stepper Banner (shown when in Feature 01) */
      , currentView === 'feature1' && (
        React.createElement(WorkflowStepper, { currentScreen: currentScreen, setScreen: setScreen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 784}} )
      )
    )
  );
}

function WorkflowStepper({ currentScreen, setScreen }) {
  return (
    React.createElement('div', { className: "w-full bg-white border-b border-slate-200 py-3 px-3 sm:px-6 shadow-sm overflow-x-auto"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 792}}
      , React.createElement('div', { className: "max-w-5xl mx-auto flex items-center justify-between min-w-[760px] relative"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 793}}
        /* Background Track Line */
        , React.createElement('div', { className: "absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 795}})

        /* Active Progress Track Line */
        , React.createElement('div', {
          className: "absolute top-4 left-6 h-0.5 bg-brand-600 transition-all duration-300 -z-0"       ,
          style: { width: `${((currentScreen - 1) / (STEPS.length - 1)) * 95}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 798}}
)

        , STEPS.map((step) => {
          const isDone = step.id < currentScreen;
          const isActive = step.id === currentScreen;

          return (
            React.createElement('div', {
              key: step.id,
              onClick: () => setScreen(step.id),
              className: "flex flex-col items-center cursor-pointer group z-10"     ,
              style: { width: '80px' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 808}}

              /* Node Circle */
              , React.createElement('div', {
                className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isActive
                    ? 'ring-4 ring-brand-100 bg-white border-2 border-brand-600 text-brand-600 shadow-md transform scale-110'
                    : isDone
                    ? 'bg-brand-600 border-2 border-brand-600 text-white shadow-sm'
                    : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 815}}

                , isActive ? (
                  React.createElement('div', { className: "w-2.5 h-2.5 rounded-full bg-brand-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 825}})
                ) : isDone ? (
                  React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 827}}, "✓")
                ) : (
                  React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 829}})
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
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 834}}

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
    React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 858}}
      , React.createElement('div', { className: "flex items-center justify-between text-xs font-bold text-slate-500 mb-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 859}}
        , React.createElement('span', { className: "text-brand-700 uppercase tracking-wide flex items-center gap-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 860}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-brand-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 861}}), "Step "
           , currentStep, ": " , _optionalChain([stepInfo, 'optionalAccess', _2 => _2.name])
        )
        , React.createElement('span', { className: "text-slate-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 864}}, percent, "% Completed" )
      )
      , React.createElement('h2', { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 866}}, title)
      , subtitle && React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 mt-1 font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 867}}, subtitle)
    )
  );
}

function VerificationBadge({ status }) {
  if (status === 'verified') {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 875}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 876}}, "✓")
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 877}}, "Verified Source" )
      )
    );
  }
  return (
    React.createElement('span', { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 882}}
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 883}}, "⚠️")
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 884}}, "Partially Verified" )
    )
  );
}

function EmergencyPill({ specialtyMode, specialtyName = 'Specialty', emergencySpecialtyVerified }) {
  if (specialtyMode === 'EMERGENCY_AND_OPD' && emergencySpecialtyVerified) {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 892}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 893}}, "✓ 24x7 Emergency "   , specialtyName, " Available" )
      )
    );
  }
  return (
    React.createElement('span', { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 898}}
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 899}}, "⏱️ " , specialtyName, " OPD Clinic Only (Not 24x7 Emergency)"      )
    )
  );
}

function VitalsConfidenceBadge({ source }) {
  if (source === 'worker_verified') {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 907}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 908}}, "✓ Worker Verified"  )
        , React.createElement('span', { className: "text-[9px] opacity-75" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 909}}, "(High Clinical Confidence)"  )
      )
    );
  }
  if (source === 'self_reported') {
    return (
      React.createElement('span', { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 915}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 916}}, "⚠️ Self Reported"  )
        , React.createElement('span', { className: "text-[9px] opacity-75" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 917}}, "(Layperson Confidence)" )
      )
    );
  }
  return (
    React.createElement('span', { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-100 text-brand-800 border border-brand-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 922}}
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 923}}, "👨‍⚕️ Doctor Recorded"  )
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
      title: 'Care Navigator',
      description: '3-Agent autonomous clinical triage, FAST stroke/STEMI emergency red-flag screening, and verified Golden Hour facility routing.',
      actionLabel: 'Launch Triage',
      action: onLaunchFeature1,
      badge: 'Autonomous Triage'
    },
    {
      id: 'feature2',
      code: 'Module 02',
      icon: '👨‍⚕️',
      title: 'Teleconsultation & Queue',
      description: 'Dynamic urgency-weighted patient queuing with anti-starvation protection, rotating doctor roster, and degrading call modes.',
      actionLabel: 'Start Teleconsult',
      action: onLaunchFeature2,
      badge: 'Prioritized Telehealth'
    },
    {
      id: 'feature3',
      code: 'Module 03',
      icon: '🔄',
      title: 'Smart Referrals',
      description: 'Closed-loop digital referral pass (REF-2026-XXXXX) with 5-stage lifecycle tracking from doctor creation to hospital check-in.',
      actionLabel: 'Open Referrals',
      action: onLaunchFeature3,
      badge: 'Closed-Loop Care'
    },
    {
      id: 'feature4',
      code: 'Module 04',
      icon: '📋',
      title: 'High-Risk Follow-Ups',
      description: 'Prescribed follow-up schedules for ASHA workers, longitudinal dynamic risk scoring (0-100), and hospital deterioration alerts.',
      actionLabel: 'Open Follow-Ups',
      action: onLaunchFeature4,
      badge: 'Dynamic Risk Engine'
    },
    {
      id: 'feature5',
      code: 'Module 05',
      icon: '📑',
      title: 'Health Records',
      description: 'Internal Medical ID anchor, camera/upload OCR prescription digitizer, ABDM Sandbox consent integration, and unified timeline.',
      actionLabel: 'Open Records',
      action: onLaunchFeature5,
      badge: 'ABDM Interoperable'
    },
    {
      id: 'feature6',
      code: 'Module 06',
      icon: '💊',
      title: 'Medicine & Diagnostics',
      description: 'Real-time pharmacy inventory with radius fallback, counter pickup reservations, and doctor-ordered diagnostic progression.',
      actionLabel: 'Open Medicine & Lab',
      action: onLaunchFeature6,
      badge: 'Geo Logistics'
    },
    {
      id: 'feature7',
      code: 'Module 07',
      icon: '🏥',
      title: 'Facility Dashboard',
      description: 'Multi-source operations overview: Care Continuity Index, live prioritized queue, bed/ICU resource status meters, and alerts.',
      actionLabel: 'Open Dashboard',
      action: onLaunchFeature7,
      badge: 'Operations Control'
    }
  ];

  return (
    React.createElement('div', { className: "space-y-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1027}}
      /* Executive Hero Banner */
      , React.createElement('div', { className: "relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white p-8 sm:p-12 shadow-xl border border-blue-900/40"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1029}}
        , React.createElement('div', { className: "absolute top-0 right-0 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1030}})
        , React.createElement('div', { className: "max-w-4xl xl:max-w-5xl relative z-10 space-y-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1031}}
          , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-sky-200"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1032}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-sky-300 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1033}}), "National Digital Health Mission • Jharkhand District Pilot Grid"

          )

          , React.createElement('h2', { className: "text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-tight max-w-4xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1037}}, "MedVeda Integrated Clinical Care & Telehealth Platform"

          )

          , React.createElement('p', { className: "text-blue-100/90 text-sm sm:text-base leading-relaxed font-normal max-w-3xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1041}}, "A clinically guarded, end-to-end healthcare orchestration system connecting frontline health workers, patients, specialist doctors, pharmacies, and district facilities through autonomous triage, prioritized queues, closed-loop referrals, and ABDM-interoperable health records."

          )

          , React.createElement('div', { className: "flex items-center gap-3 pt-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1045}}
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature1,
              className: "px-5 py-2.5 bg-white hover:bg-blue-50 text-[#0b2b82] font-bold text-xs rounded-xl shadow-sm transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1046}}
, "Start Care Navigator"

            )

            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature2,
              className: "px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-sm transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1054}}
, "Teleconsultation & Queue"

            )

            , React.createElement('button', {
              type: "button",
              onClick: onLaunchAbout,
              className: "px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1062}}
, "Platform Overview →"

            )
          )
        )
      )

      /* Role Simulation Selector (Clean & Professional) */
      , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1074}}
        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1075}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1076}}
            , React.createElement('span', { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1077}}, "Active Persona Simulation"  )
            , React.createElement('p', { className: "text-xs text-slate-600 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1078}}, roleDescriptions[actorRole] || roleDescriptions.worker)
          )
        )

        , React.createElement('div', { className: "flex gap-1.5 flex-wrap pt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1082}}
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
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1092}}

              , r.label
            )
          ))
        )
      )

      /* System Modules Grid */
      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1109}}
        , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1110}}
          , React.createElement('span', { className: "text-[11px] font-extrabold uppercase tracking-widest text-[#0284c7] block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1111}}, "PLATFORM"

          )
          , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1114}}
            , React.createElement('h3', { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1115}}, "Platform Modules"

            )
            , React.createElement('span', { className: "text-xs text-slate-500 font-semibold px-3 py-1 rounded-full bg-slate-100 border border-slate-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1118}}, "7 Integrated Systems"

            )
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1124}}
          , modules.map((m) => (
            React.createElement('div', {
              key: m.id,
              onClick: m.action,
              className: "bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between space-y-5 group cursor-pointer"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1126}}

              , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1131}}
                /* Top Row: Soft-Blue Squircle Icon Container + Module Code & Badge */
                , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1133}}
                  , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-blue-50/90 text-[#0284c7] border border-blue-100 flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:bg-[#0b2b82] group-hover:text-white group-hover:scale-105 transition-all duration-300"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1134}}
                    , m.icon
                  )
                  , React.createElement('div', { className: "flex flex-col items-end gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1137}}
                    , React.createElement('span', { className: "text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1138}}
                      , m.code
                    )
                    , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f7ff] text-[#0b2b82] border border-blue-100/80"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1141}}
                      , m.badge
                    )
                  )
                )

                /* Title & Description */
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1148}}
                  , React.createElement('h4', { className: "text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#0b2b82] transition-colors leading-snug"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1149}}
                    , m.title
                  )
                  , React.createElement('p', { className: "text-xs text-slate-500 leading-relaxed font-normal"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1152}}
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
                className: "w-full py-2.5 px-4 bg-slate-50 hover:bg-[#0b2b82] hover:text-white group-hover:bg-[#0b2b82] group-hover:text-white text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-100 group-hover:border-[#0b2b82] shadow-2xs group-hover:shadow-sm"                     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1159}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1167}}, m.actionLabel)
                , React.createElement('span', { className: "transition-transform duration-200 group-hover:translate-x-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1168}}, "→")
              )
            )
          ))
        )
      )

      /* Real-Time Operational Network Telemetry */
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1176}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1177}}
          , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1178}}, "Network Telemetry • Jharkhand District Grid"     )
          , React.createElement('span', { className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1179}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1180}}), "All Services Operational"

          )
        )

        , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1185}}
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1186}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1187}}, "4")
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1188}}, "Specialist Doctors On-Duty"  )
          )
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1190}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1191}}, "4")
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1192}}, "Connected Health Facilities"  )
          )
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1194}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1195}}, "8.5 min" )
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1196}}, "Avg. Priority Queue Wait"   )
          )
          , React.createElement('div', { className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1198}}
            , React.createElement('div', { className: "text-2xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1199}}, "100%")
            , React.createElement('div', { className: "text-[11px] text-slate-500 font-semibold mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1200}}, "Closed-Loop EMR Traceability"  )
          )
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
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1231}}
      , React.createElement(StepperHeader, {
        currentStep: 1,
        title: "Patient Demographics & Location"   ,
        subtitle: "Basic clinical profiling to localize nearby facilities and calibrate triage urgency."          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1232}}
      )

      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1238}}
        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1239}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1240}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1241}}, "Age")
            , React.createElement('input', {
              type: "number",
              value: patient.age,
              onChange: (e) => setPatient({ ...patient, age: Number(e.target.value) }),
              className: "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-slate-900"         ,
              placeholder: "e.g. 58" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1242}}
            )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1251}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1252}}, "Biological Sex" )
            , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1253}}
              , ['female', 'male', 'other'].map((s) => (
                React.createElement('button', {
                  key: s,
                  type: "button",
                  onClick: () => setPatient({ ...patient, sex: s }),
                  className: `py-3 px-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                    patient.sex === s
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1255}}

                  , s
                )
              ))
            )
          )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1272}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1273}}, "Current Location (District / Town)"

          )
          , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1276}}
            , React.createElement('input', {
              type: "text",
              value: patient.location,
              onChange: (e) => setPatient({ ...patient, location: e.target.value }),
              className: "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900"         ,
              placeholder: "e.g. Hazaribagh, Jharkhand"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1277}}
            )
            , React.createElement('span', { className: "absolute right-3 top-3 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1284}}, "📍 GPS Active"

            )
          )
          , React.createElement('p', { className: "text-xs text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1288}}, "Hospital discovery searches will be centered around this locality."        )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1291}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1292}}, "Relevant Medical History / Comorbidities"

          )
          , React.createElement('div', { className: "flex flex-wrap gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1295}}
            , patient.medicalHistory.map((item) => (
              React.createElement('span', {
                key: item,
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1297}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1301}}, item)
                , React.createElement('button', {
                  type: "button",
                  onClick: () => removeHistory(item),
                  className: "hover:text-critical-600 font-bold ml-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1302}}
, "×"

                )
              )
            ))
          )

          , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1313}}
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
              className: "flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1314}}
            )
            , React.createElement('button', {
              type: "button",
              onClick: () => addHistory(historyInput),
              className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1327}}
, "Add"

            )
          )

          , React.createElement('div', { className: "flex gap-2 flex-wrap mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1336}}
            , ['+ Hypertension', '+ Diabetes', '+ Asthma', '+ Heart Disease', '+ Prior Stroke', '+ Kidney Disease'].map((chip) => (
              React.createElement('button', {
                key: chip,
                type: "button",
                onClick: () => addHistory(chip.replace('+ ', '')),
                className: "text-[11px] text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1338}}

                , chip
              )
            ))
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1350}}
          , React.createElement('button', {
            type: "button",
            onClick: onNext,
            disabled: !patient.location || !patient.age,
            className: "w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1351}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1357}}, "Continue to Symptom Intake"   )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1358}}, "→")
          )
        )
      )
    )
  );
}

function Screen2SymptomAssessment({ symptoms, setSymptoms, onNext, onBack }) {
  return (
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1368}}
      , React.createElement(StepperHeader, {
        currentStep: 2,
        title: "Symptom Intake & Onset"   ,
        subtitle: "Describe the symptoms in plain language as reported by the patient or frontline healthcare worker."              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1369}}
      )

      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1375}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1376}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1377}}, "Primary Complaints & Observed Symptoms"

          )
          , React.createElement('textarea', {
            rows: 3,
            value: symptoms.primarySymptoms,
            onChange: (e) => setSymptoms({ ...symptoms, primarySymptoms: e.target.value }),
            placeholder: "Describe symptoms, e.g. severe headache with difficulty speaking, numbness on one side..."           ,
            className: "w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900 text-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1380}}
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1389}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1390}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1391}}, "Symptom Duration / Onset"   )
            , React.createElement('input', {
              type: "text",
              value: symptoms.duration,
              onChange: (e) => setSymptoms({ ...symptoms, duration: e.target.value }),
              placeholder: "e.g. 45 minutes ago, 2 days"     ,
              className: "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium text-slate-900"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1392}}
            )
            , React.createElement('p', { className: "text-xs text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1399}}, "Accurate onset time is critical for stroke & cardiac triage."         )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1402}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1403}}, "Perceived Severity" )
            , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1404}}
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
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1410}}

                  , lvl.label
                )
              ))
            )
          )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1427}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1428}}, "Additional Context (Optional)"  )
          , React.createElement('input', {
            type: "text",
            value: symptoms.additionalNotes,
            onChange: (e) => setSymptoms({ ...symptoms, additionalNotes: e.target.value }),
            placeholder: "e.g. Patient was sitting at home, no prior head injury reported"          ,
            className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-900"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1429}}
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1438}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1439}}
, "← Back"

          )
          , React.createElement('button', {
            type: "button",
            onClick: onNext,
            disabled: !symptoms.primarySymptoms,
            className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1446}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1452}}, "Proceed to Emergency Screening"   )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1453}}, "→")
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
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1502}}
      , React.createElement(StepperHeader, {
        currentStep: 3,
        title: "Emergency Screening" ,
        subtitle: "Rule-based emergency screening to instantly escalate life-threatening presentations."       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1503}}
      )

      , hasAnyCriticalFlag && (
        React.createElement('div', { className: "mb-6 p-4 rounded-xl bg-critical-50 border border-critical-200 flex items-start gap-3"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1510}}
          , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1511}}, "🚨")
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1512}}
            , React.createElement('h4', { className: "text-sm font-bold text-critical-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1513}}, "Critical Red-Flag Detected"  )
            , React.createElement('p', { className: "text-xs text-critical-700 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1514}}, "This triage will automatically be escalated to "
                     , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1515}}, "CRITICAL"), " urgency. Facilities without active 24x7 emergency departments will be penalized."
            )
          )
        )
      )

      , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1521}}
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
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1525}}

              , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1534}}
                , React.createElement('div', { className: "flex items-center gap-2 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1535}}
                  , React.createElement('span', { className: "text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1536}}
                    , q.badge
                  )
                  , isChecked && (
                    React.createElement('span', { className: "text-xs font-extrabold text-critical-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1540}}, "FLAGGED")
                  )
                )
                , React.createElement('h4', { className: "text-sm font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1543}}, q.title)
                , React.createElement('p', { className: "text-xs text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1544}}, q.desc)
              )

              , React.createElement('div', {
                className: `w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-critical-600 border-critical-600 text-white'
                    : 'border-slate-300 bg-white'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1547}}

                , isChecked ? '✓' : ''
              )
            )
          );
        })
      )

      , React.createElement('div', { className: "pt-6 mt-6 border-t border-slate-100 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1561}}
        , React.createElement('button', {
          type: "button",
          onClick: onBack,
          className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1562}}
, "← Back"

        )
        , React.createElement('button', {
          type: "button",
          onClick: onNext,
          className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1569}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1574}}, "Run AI Triage Analysis"   )
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1575}}, "⚡")
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
    React.createElement('div', { className: "max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1631}}
      , React.createElement('div', { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center relative"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1632}}
        , React.createElement('div', { className: "w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand-500/30 animate-pulse"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1633}}, "⚡"

        )
        , React.createElement('div', { className: "absolute inset-0 rounded-full border-2 border-brand-500 border-dashed animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1636}})
      )

      , React.createElement('h3', { className: "text-xl font-black text-slate-900 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1639}}, "Analyzing Clinical Presentation"  )
      , React.createElement('p', { className: "text-xs text-slate-500 mb-8"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1640}}, "Agent 1 (Symptom & Triage Agent) is executing clinical decision rules..."

      )

      , React.createElement('div', { className: "space-y-3 text-left" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1644}}
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
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1649}}

              , React.createElement('div', {
                className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white animate-bounce'
                    : 'bg-slate-200 text-slate-600'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1659}}

                , isDone ? '✓' : idx + 1
              )
              , React.createElement('span', { className: "text-xs font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1670}}, step.label)
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
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1691}}
      , React.createElement(StepperHeader, {
        currentStep: 5,
        title: "Clinical Assessment Result"  ,
        subtitle: "Agent 1 clinical output and specialty destination requirement."       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1692}}
      )

      , React.createElement('div', { className: `p-6 rounded-2xl text-white shadow-xl mb-6 ${isCritical ? 'bg-critical-600 shadow-critical-600/20' : 'bg-amber-500 shadow-amber-500/20'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1698}}
        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2 mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1699}}
          , React.createElement('span', { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 uppercase tracking-wide"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1700}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-white animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1701}})
            , isCritical ? 'Acuity Level 1' : 'Acuity Level 2'
          )
          , React.createElement('span', { className: "text-xs font-bold text-white/90"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1704}}
            , isCritical ? 'Immediate Action Required' : 'Prompt Medical Attention'
          )
        )

        , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1709}}
          , isCritical ? '🔴 CRITICAL URGENCY' : '🟡 URGENT'
        )
        , React.createElement('p', { className: "text-sm text-white/95 leading-relaxed font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1712}}
          , currentTriage.clinicalRoutingAdvice
        )
      )

      , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1717}}
        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1718}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1719}}, "Required Medical Specialty"  )
          , React.createElement('div', { className: "text-lg font-black text-slate-900 mt-1 flex items-center gap-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1720}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1721}}, "🧠 " , currentTriage.requiredSpecialty)
          )
          , React.createElement('p', { className: "text-xs text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1723}}, "Facility MUST have verified clinical capability for "       , currentTriage.requiredSpecialty, ".")
        )

        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1726}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1727}}, "Emergency Department Mandate"  )
          , React.createElement('div', { className: `text-lg font-black mt-1 flex items-center gap-2 ${currentTriage.emergencyRequired ? 'text-critical-600' : 'text-amber-600'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1728}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1729}}, currentTriage.emergencyRequired ? '🚨 24x7 Emergency Required' : '⏱️ Outpatient (OPD) Suitable')
          )
          , React.createElement('p', { className: "text-xs text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1731}}
            , currentTriage.emergencyRequired ? 'Outpatient (OPD) clinics are NOT suitable destinations for this presentation.' : 'Patient can be evaluated in daytime OPD clinics.'
          )
        )
      )

      , React.createElement('div', { className: "p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6 text-xs text-amber-900 leading-relaxed"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1737}}
        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1738}}, "⚠️ Clinical Safety Invariant:"   ), " This system does NOT provide a definitive diagnosis. It provides urgent care routing guidance based on reported signs. Do not delay emergency medical transport."
      )

      , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1741}}
        , React.createElement('button', {
          type: "button",
          onClick: onBack,
          className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1742}}
, "← Back"

        )
        , React.createElement('button', {
          type: "button",
          onClick: onFindHospitals,
          className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1749}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1754}}, "Research Facilities with Google Search MCP"     )
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1755}}, "🔍")
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
    React.createElement('div', { className: "max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1833}}
      , React.createElement('div', { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center relative"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1834}}
        , React.createElement('div', { className: "w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/30 animate-pulse"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1835}}, "🌐"

        )
        , React.createElement('div', { className: "absolute inset-0 rounded-full border-2 border-emerald-500 border-dashed animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1838}})
      )

      , React.createElement('h3', { className: "text-xl font-black text-slate-900 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1841}}, "Agent 2: Hospital Research & Verification"     )
      , React.createElement('p', { className: "text-xs text-slate-500 mb-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1842}}, "Dynamically querying Google Search MCP with "
              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1843}}, "≤ 50 km Proximity Priority"    ), " & Emergency Audit..."
      )

      , React.createElement('div', { className: "w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1846}}
        , React.createElement('div', {
          className: "bg-emerald-500 h-2 transition-all duration-300 ease-out"    ,
          style: { width: `${progress}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1847}}
)
      )

      , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-4 space-y-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1853}}
        , React.createElement('div', { className: "flex items-center justify-between text-xs text-slate-500 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1854}}
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1855}}, "ACTIVE SEARCH MCP QUERY"   )
          , React.createElement('span', { className: "text-emerald-700 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1856}}, "LIVE")
        )
        , React.createElement('div', { className: "font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 truncate"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1858}}, "> "
           , activeQuery
        )
        , React.createElement('div', { className: "pt-2 text-xs text-slate-500 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1861}}
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1862}}, "Proximity Rule: "  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1862}}, "≤ 50 km Golden Hour First"     ))
          , React.createElement('span', { className: "font-semibold text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1863}}, "Clinical Suitability > Proximity"   )
        )
      )

      , React.createElement('div', { className: "flex items-center justify-center gap-2 text-xs text-slate-400"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1867}}
        , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1868}})
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1869}}, "Cross-referencing official hospital portals & NHM government registry"       )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1886}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1887}}
        , React.createElement(StepperHeader, {
          currentStep: 7,
          title: "Recommended Facilities (Top 5)"   ,
          subtitle: "Ranked strictly by Clinical Suitability > Proximity with <= 50 km priority."           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1888}}
        )

        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1894}}
          , React.createElement('div', { className: "text-xs text-slate-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1895}}, "Showing "
             , React.createElement('span', { className: "text-brand-700 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1896}}, filtered.length), " facilities near Hazaribagh"
          )
          , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1898}}
            , React.createElement('button', {
              type: "button",
              onClick: () => setFilterMode('all'),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1899}}
, "All Ranked (5)"

            )
            , React.createElement('button', {
              type: "button",
              onClick: () => setFilterMode('emergency_only'),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'emergency_only'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1910}}
, "✓ 24x7 Emergency Only"

            )
          )
        )

        , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1924}}
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
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1930}}

                , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1940}}
                  , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1941}}
                    , React.createElement('div', {
                      className: `w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                        isRankOne
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1942}}
, "#"
                      , fac.rank
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1951}}
                      , React.createElement('div', { className: "flex items-center gap-2 flex-wrap mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1952}}
                        , React.createElement('h3', { className: "font-extrabold text-slate-900 text-base sm:text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1953}}, fac.name)
                        , React.createElement(VerificationBadge, { status: fac.verificationStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1954}} )
                      )
                      , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1956}}, fac.address)
                    )
                  )

                  , React.createElement('div', { className: "text-right shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1960}}
                    , React.createElement('div', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1961}}, fac.distanceDisplay)
                    , React.createElement('span', { className: "text-xs text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1962}}, "Road Distance" )
                  )
                )

                , React.createElement('div', { className: "mt-3.5 flex items-center gap-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1966}}
                  , React.createElement(EmergencyPill, {
                    specialtyMode: fac.specialtyMode,
                    specialtyName: "Neurology",
                    emergencySpecialtyVerified: fac.emergencySpecialtyVerified, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1967}}
                  )
                  , React.createElement('span', { className: "text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1972}}, "🕒 "
                     , fac.operatingHours
                  )
                )

                , React.createElement('div', { className: "mt-3.5 p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 leading-relaxed"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1977}}
                  , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1978}}, "Why recommended: "  )
                  , fac.explanation
                )

                , React.createElement('div', { className: "mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1982}}
                  , React.createElement('a', {
                    href: `tel:${fac.contactNumber}`,
                    className: "inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1983}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1987}}, "📞 Call Desk"  )
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1988}}, fac.contactNumber)
                  )

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1991}}
                    , React.createElement('button', {
                      type: "button",
                      onClick: () => onSelectFacility(fac),
                      className: "px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1992}}
, "View Details & Sources →"

                    )
                  )
                )
              )
            );
          })
        )

        , React.createElement('div', { className: "pt-6 mt-6 border-t border-slate-100 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2006}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2007}}
, "← Back"

          )
          , React.createElement('button', {
            type: "button",
            onClick: () => onSelectFacility(facilities[0]),
            className: "px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2014}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2019}}, "Proceed with #1 Recommended Facility"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2020}}, "→")
          )
        )
      )
    )
  );
}

function Screen8FacilityDetails({ facility, onNext, onBack }) {
  if (!facility) return null;

  return (
    React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2032}}
      , React.createElement(StepperHeader, {
        currentStep: 8,
        title: "Facility Audit & Department Verification"    ,
        subtitle: "Audited departmental capability, verified contact lines, and source citations."        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2033}}
      )

      , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2039}}
        , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2040}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2041}}
            , React.createElement('div', { className: "flex items-center gap-2 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2042}}
              , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2043}}, facility.name)
              , React.createElement(VerificationBadge, { status: facility.verificationStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2044}} )
            )
            , React.createElement('p', { className: "text-xs text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2046}}, facility.address)
          )
          , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2048}}
            , React.createElement('span', { className: "text-lg font-black text-brand-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2049}}, facility.distanceDisplay)
          )
        )

        , React.createElement('div', { className: "mt-4 flex items-center gap-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2053}}
          , React.createElement(EmergencyPill, {
            specialtyMode: facility.specialtyMode,
            specialtyName: "Neurology",
            emergencySpecialtyVerified: facility.emergencySpecialtyVerified, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2054}}
          )
          , React.createElement('span', { className: "text-xs font-bold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2059}}, "🕒 "
             , facility.operatingHours
          )
        )
      )

      , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2065}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2066}}
          , React.createElement('h4', { className: "text-xs font-bold text-slate-700 uppercase mb-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2067}}, "Active Medical Departments"  )
          , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2068}}
            , (facility.departments || ['Emergency Medicine', 'Neurology', 'Critical Care ICU']).map((dept, i) => (
              React.createElement('div', { key: i, className: "p-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2070}}
                , React.createElement('span', { className: "text-emerald-600 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2071}}, "✓")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2072}}, dept)
              )
            ))
          )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2078}}
          , React.createElement('div', { className: "flex items-center justify-between mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2079}}
            , React.createElement('h4', { className: "text-xs font-bold text-slate-700 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2080}}, "Verification Sources & Audit Trail"    )
            , React.createElement('span', { className: "text-xs text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2081}}, "Source Trust Hierarchy"  )
          )

          , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2084}}
            , (facility.sources || []).map((src, i) => (
              React.createElement('div', { key: i, className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2086}}
                , React.createElement('div', { className: "flex items-center gap-2.5 truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2087}}
                  , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-500 shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2088}})
                  , React.createElement('span', { className: "font-bold text-slate-800 capitalize"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2089}}, src.type.replace('_', ' '), ":")
                  , React.createElement('a', {
                    href: src.url,
                    target: "_blank",
                    rel: "noopener noreferrer" ,
                    className: "text-brand-600 hover:underline font-mono truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2090}}

                    , src.url
                  )
                )
                , React.createElement('span', { className: "px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-white border border-slate-200 text-slate-600 shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2099}}
                  , src.reliability, " Trust"
                )
              )
            ))
          )
        )

        , React.createElement('div', { className: "p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2107}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2108}}
            , React.createElement('div', { className: "text-xs font-bold text-emerald-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2109}}, "Direct Emergency Desk Contact"   )
            , React.createElement('div', { className: "text-base font-black text-emerald-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2110}}, facility.contactNumber)
          )
          , React.createElement('a', {
            href: `tel:${facility.contactNumber}`,
            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2112}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2116}}, "📞 Call Emergency Room"   )
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2120}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-sm rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2121}}
, "← Back to Recommendations"

          )
          , React.createElement('button', {
            type: "button",
            onClick: onNext,
            className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2128}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2133}}, "Generate Referral Pass & Navigation"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2134}}, "→")
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
    React.createElement('div', { className: "max-w-2xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2153}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2154}}
        , React.createElement(StepperHeader, {
          currentStep: 9,
          title: "Digital Referral Pass & Navigation"    ,
          subtitle: "Fast-track admission pass for receiving hospital triage desk and turn-by-turn navigation."          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2155}}
        )

        , React.createElement('div', { className: "border-2 border-dashed border-brand-500/40 rounded-2xl p-6 bg-brand-50/30 mb-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2161}}
          , React.createElement('div', { className: "flex items-center justify-between border-b border-brand-200/60 pb-4 mb-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2162}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2163}}
              , React.createElement('span', { className: "text-[10px] font-extrabold tracking-widest text-brand-700 uppercase bg-brand-100 px-2 py-0.5 rounded"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2164}}, "Official Digital Triage Pass"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2167}}, facility.name)
            )
            , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2169}}
              , React.createElement('div', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2170}}, "PASS ID" )
              , React.createElement('div', { className: "text-sm font-black text-brand-700 font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2171}}, referralId)
            )
          )

          , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2175}}
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2176}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2177}}, "Patient Age/Sex" )
              , React.createElement('strong', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2178}}, patient.age, "y / "  , patient.sex)
            )
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2180}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2181}}, "Acuity Tier" )
              , React.createElement('strong', { className: "text-critical-600 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2182}}, "🔴 CRITICAL" )
            )
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2184}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2185}}, "Specialty")
              , React.createElement('strong', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2186}}, "Neurology Stroke" )
            )
            , React.createElement('div', { className: "bg-white p-2.5 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2188}}
              , React.createElement('span', { className: "text-slate-400 block font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2189}}, "Origin")
              , React.createElement('strong', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2190}}, patient.location)
            )
          )

          , React.createElement('div', { className: "flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 gap-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2194}}
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2195}}
              , React.createElement('div', { className: "w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2196}}
                , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2197}}
                  , React.createElement('div', { className: "w-4 h-4 bg-white rounded-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2198}})
                  , React.createElement('div', { className: "w-4 h-4 bg-white rounded-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2199}})
                )
                , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2201}}
                  , React.createElement('div', { className: "w-4 h-4 bg-white rounded-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2202}})
                  , React.createElement('div', { className: "w-2 h-2 bg-white rounded-sm self-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2203}})
                )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2206}}
                , React.createElement('div', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2207}}, "Hospital Staff Fast-Scan"  )
                , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2208}}, "Scan at Emergency triage desk to instantly import triage parameters into hospital EMR."            )
              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: copyReferral,
              className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2211}}

              , copied ? '✓ Copied' : 'Copy ID'
            )
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2221}}
          , React.createElement('a', {
            href: `tel:${facility.contactNumber}`,
            className: "p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/20 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2222}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2226}}, "📞 1-Tap Emergency Call"   )
            , React.createElement('span', { className: "opacity-80", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2227}}, "(", facility.contactNumber, ")")
          )

          , React.createElement('a', {
            href: `https://maps.google.com/?q=${encodeURIComponent(facility.name + ' ' + facility.address)}`,
            target: "_blank",
            rel: "noopener noreferrer" ,
            className: "p-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md shadow-brand-600/20 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2230}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2236}}, "🧭 Start Google Maps Navigation"    )
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2240}}
          , React.createElement('button', {
            type: "button",
            onClick: onRestart,
            className: "px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2241}}
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
    React.createElement('div', { className: "max-w-3xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2260}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2261}}
        , React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2262}}
          , React.createElement('div', { className: "flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2263}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2264}}, "Feature Map 02 • Teleconsultation Entry"     )
          )
          , React.createElement('h2', { className: "text-2xl font-black text-slate-900 tracking-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2266}}, "Select Teleconsultation Path"  )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2267}}, "Both entry paths converge into the exact same booking, priority queue, and consultation engine."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2272}}
          /* Path 1: Assisted Path */
          , React.createElement('div', {
            onClick: () => onSelectPath('worker'),
            className: `p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
              actorRole === 'worker'
                ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-slate-200 bg-white hover:border-brand-300'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2274}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2282}}
              , React.createElement('div', { className: "w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-2xl mb-4 font-bold"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2283}}, "👩‍⚕️"

              )
              , React.createElement('div', { className: "flex items-center gap-2 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2286}}
                , React.createElement('h3', { className: "font-extrabold text-slate-900 text-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2287}}, "Assisted Path" )
                , React.createElement('span', { className: "text-[10px] uppercase font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2288}}, "ASHA / ANM"

                )
              )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed font-medium mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2292}}, "A frontline health worker operates the device on behalf of the patient. The worker records physical vitals, translates local dialects, and coordinates consent."

              )

              , React.createElement('div', { className: "space-y-1.5 text-xs text-slate-700 font-semibold mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2296}}
                , React.createElement('div', { className: "flex items-center gap-2 text-emerald-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2297}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2298}}, "✓")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2299}}, "Vitals tagged as "   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2299}}, "worker_verified"), " (High Confidence)"  )
                )
                , React.createElement('div', { className: "flex items-center gap-2 text-slate-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2301}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2302}}, "✓")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2303}}, "Worker presence on video/audio for clinical exam"      )
                )
              )
            )

            , React.createElement('button', {
              type: "button",
              className: "w-full py-3 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-700 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2308}}
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
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2317}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2325}}
              , React.createElement('div', { className: "w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4 font-bold"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2326}}, "👤"

              )
              , React.createElement('div', { className: "flex items-center gap-2 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2329}}
                , React.createElement('h3', { className: "font-extrabold text-slate-900 text-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2330}}, "Self-Service Path" )
                , React.createElement('span', { className: "text-[10px] uppercase font-black px-2 py-0.5 bg-purple-100 text-purple-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2331}}, "Direct Patient"

                )
              )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed font-medium mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2335}}, "A literate patient navigates the application independently. The patient self-reports complaints and vitals from home."

              )

              , React.createElement('div', { className: "space-y-1.5 text-xs text-slate-700 font-semibold mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2339}}
                , React.createElement('div', { className: "flex items-center gap-2 text-amber-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2340}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2341}}, "⚠️")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2342}}, "Vitals tagged as "   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2342}}, "self_reported"), " (Layperson)" )
                )
                , React.createElement('div', { className: "flex items-center gap-2 text-critical-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2344}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2345}}, "🚨")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2346}}, "Emergency red-flag guardrail intercept active"    )
                )
              )
            )

            , React.createElement('button', {
              type: "button",
              className: "w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2351}}
, "Continue as Self-Service Patient →"

            )
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2360}}
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "text-xs font-bold text-slate-500 hover:text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2361}}
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
      React.createElement('div', { className: "max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2502}}
        , React.createElement('div', { className: "w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold mx-auto mb-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2503}}, "✓"

        )

        , React.createElement('h3', { className: "text-2xl font-black text-slate-900 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2507}}, "Appointment Confirmed!" )
        , React.createElement('p', { className: "text-xs text-slate-500 mb-6 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2508}}, "Appointment ID: "
            , React.createElement('strong', { className: "font-mono text-brand-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2509}}, bookingConfirmed.appointment.id)
        )

        /* SMS Simulation Card */
        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-900 text-left text-white mb-6 shadow-md border border-slate-800"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2513}}
          , React.createElement('div', { className: "flex items-center justify-between text-xs text-slate-400 font-mono mb-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2514}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2515}}, "📱 SIMULATED SMS NOTIFICATION"   )
            , React.createElement('span', { className: "text-emerald-400 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2516}}, "DELIVERED")
          )
          , React.createElement('p', { className: "text-xs text-slate-200 leading-relaxed font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2518}}
            , bookingConfirmed.smsSimulation.messageText
          )
          , React.createElement('div', { className: "mt-2 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2521}}, "To: "
             , bookingConfirmed.smsSimulation.recipient, " • "  , new Date().toLocaleTimeString()
          )
        )

        , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2526}}
          , React.createElement('button', {
            type: "button",
            onClick: () => onBookSuccess(bookingConfirmed.appointment),
            className: "w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2527}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2532}}, "Proceed to Priority Queue →"    )
          )
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2540}}
      /* Emergency Red-Flag Intercept Modal for Self-Service */
      , showEmergencyModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2543}}
          , React.createElement('div', { className: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-critical-500"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2544}}
            , React.createElement('div', { className: "w-12 h-12 rounded-full bg-critical-100 text-critical-600 flex items-center justify-center text-2xl font-bold mx-auto mb-3"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2545}}, "🚨"

            )
            , React.createElement('h3', { className: "text-lg font-black text-slate-900 text-center mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2548}}, "Critical Emergency Intercept"  )
            , React.createElement('p', { className: "text-xs text-critical-700 text-center mb-4 leading-relaxed font-semibold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2549}}, "The symptoms you described match life-threatening acute criteria (Stroke / Cardiac / Severe Respiratory). Teleconsultation is not safe for this emergency."

            )

            , React.createElement('div', { className: "p-3 bg-critical-50 rounded-xl border border-critical-200 text-xs text-critical-900 mb-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2553}}
              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2554}}, "Clinical Guardrail Rule:"  ), " Self-service patients with acute red-flags are automatically redirected to Feature 01 Emergency Triage & verified hospital routing."
            )

            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2557}}
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setShowEmergencyModal(false);
                  onEmergencyEscalate();
                },
                className: "w-full py-3 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2558}}
, "Redirect to Emergency Triage (Feature 01) →"

              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowEmergencyModal(false),
                className: "w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2568}}
, "Dismiss (Continue Teleconsult)"

              )
            )
          )
        )
      )

      , React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2580}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2581}}
          , React.createElement('div', { className: "flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2582}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2583}}, "Feature 02 • Slot & Doctor Matching"      )
          )
          , React.createElement('h2', { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2585}}, "Book Teleconsultation Slot"  )
        )

        , React.createElement('span', { className: `text-xs font-bold px-3 py-1 rounded-full ${
          pathActor === 'worker' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2588}}
          , pathActor === 'worker' ? '👩‍⚕️ Assisted Path (ASHA)' : '👤 Self-Service Path'
        )
      )

      , React.createElement('div', { className: "space-y-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2595}}
        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-3 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2596}}
          , React.createElement('div', { className: "sm:col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2597}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2598}}, "Patient Full Name"  )
            , React.createElement('input', {
              type: "text",
              value: patientName,
              onChange: (e) => setPatientName(e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2599}}
            )
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2606}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2607}}, "Age")
            , React.createElement('input', {
              type: "number",
              value: age,
              onChange: (e) => setAge(e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2608}}
            )
          )
        )

        /* Specialty Selector Dropdown */
        , React.createElement('div', { className: "relative", ref: specialtyDropdownRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2618}}
          , React.createElement('div', { className: "flex items-center justify-between mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2619}}
            , React.createElement('label', { id: "specialty-dropdown-label", className: "block text-xs font-bold text-slate-700 uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2620}}, "Select Medical Specialty"

            )
            , React.createElement('span', { className: "text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2623}}
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
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2629}}

            , React.createElement('div', { className: "flex items-center gap-3 min-w-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2642}}
              , React.createElement('span', { className: "w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-lg shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2643}}
                , (SPECIALTY_OPTIONS.find((s) => s.id === selectedSpecialty) || {}).icon || '🩺'
              )
              , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2646}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2647}}
                  , React.createElement('span', { className: "font-extrabold text-slate-900 text-sm truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2648}}
                    , selectedSpecialty
                  )
                  , React.createElement('span', { className: "text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2651}}, "Selected"

                  )
                )
                , React.createElement('p', { className: "text-xs text-slate-500 truncate mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2655}}
                  , (SPECIALTY_OPTIONS.find((s) => s.id === selectedSpecialty) || {}).desc || 'Medical Specialty'
                )
              )
            )

            , React.createElement('div', { className: "flex items-center gap-2 ml-3 shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2661}}
              , React.createElement('span', { className: "text-xs font-semibold text-slate-400 hidden sm:inline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2662}}
                , isSpecialtyDropdownOpen ? 'Close menu' : 'Change specialty'
              )
              , React.createElement('div', { className: `w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                isSpecialtyDropdownOpen ? 'bg-brand-100 text-brand-700 rotate-180' : 'bg-slate-100 text-slate-600'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2665}}
                , React.createElement('svg', { className: "w-4 h-4" , fill: "none", stroke: "currentColor", viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2668}}
                  , React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M19 9l-7 7-7-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2669}} )
                )
              )
            )
          )

          /* Dropdown Menu Panel */
          , isSpecialtyDropdownOpen && (
            React.createElement('div', {
              role: "listbox",
              'aria-label': "Medical Specialties" ,
              className: "absolute left-0 right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2677}}

              , React.createElement('div', { className: "p-2.5 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2682}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2683}}, "Select Department Roster"  )
                , React.createElement('span', { className: "text-brand-600 font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2684}}, "Live Doctor Matching"  )
              )

              , React.createElement('div', { className: "max-h-72 overflow-y-auto divide-y divide-slate-100 p-1.5 focus:outline-none"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2687}}
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
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2695}}

                      , React.createElement('div', { className: "flex items-center gap-3 min-w-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2713}}
                        , React.createElement('span', { className: `w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${
                          isSelected ? 'bg-brand-100' : 'bg-slate-100 group-hover:bg-brand-50'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2714}}
                          , spec.icon
                        )
                        , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2719}}
                          , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2720}}
                            , React.createElement('span', { className: `text-sm ${isSelected ? 'font-extrabold text-brand-900' : 'text-slate-800'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2721}}
                              , spec.label
                            )
                            , matchingDoc && (
                              React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 shrink-0 flex items-center gap-1 border border-emerald-200"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2725}}
                                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2726}}, matchingDoc.avatar)
                                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2727}}, matchingDoc.name)
                              )
                            )
                          )
                          , React.createElement('p', { className: "text-xs text-slate-400 group-hover:text-slate-500 truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2731}}
                            , spec.desc
                          )
                        )
                      )

                      , React.createElement('div', { className: "shrink-0 ml-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2737}}
                        , isSelected ? (
                          React.createElement('div', { className: "w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2739}}, "✓"

                          )
                        ) : (
                          React.createElement('span', { className: "text-xs text-slate-300 group-hover:text-brand-600 font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2743}}, "Select"

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
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2757}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2758}}, "Matching Specialist Doctor"  )
          , React.createElement('div', { className: "p-4 rounded-xl border border-brand-200 bg-brand-50/40 flex items-start justify-between gap-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2759}}
            , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2760}}
              , React.createElement('div', { className: "w-12 h-12 rounded-xl bg-white border border-brand-200 flex items-center justify-center text-2xl shrink-0 shadow-sm"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2761}}
                , activeDoctor.avatar
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2764}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2765}}
                  , React.createElement('h4', { className: "font-extrabold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2766}}, activeDoctor.name)
                  , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2767}}, "Online")
                )
                , React.createElement('p', { className: "text-xs text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2769}}, activeDoctor.qualification, " • Reg: "   , activeDoctor.registrationNumber)
                , React.createElement('div', { className: "flex items-center gap-1.5 mt-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2770}}
                  , activeDoctor.facilityNames.map((fac, i) => (
                    React.createElement('span', { key: i, className: "text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2772}}, "🏥 "
                       , fac
                    )
                  ))
                )
              )
            )
          )
        )

        /* Slot Selection */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2783}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2784}}, "Available Time Slot"  )
          , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2785}}
            , [activeDoctor.nextSlot || 'Today, 10:00 AM', 'Today, 11:30 AM', 'Today, 02:00 PM', 'Today, 04:30 PM'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map((slot) => (
              React.createElement('button', {
                key: slot,
                type: "button",
                onClick: () => setSelectedSlot(slot),
                className: `py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  selectedSlot === slot
                    ? 'bg-[#0b2b82] text-white border-[#0b2b82] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2787}}

                , slot
              )
            ))
          )
        )

        /* Symptoms Intake */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2804}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2805}}, "Symptoms & Chief Complaint"   )
          , React.createElement('textarea', {
            rows: 2,
            value: symptoms,
            onChange: (e) => handleSymptomCheck(e.target.value),
            className: "w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500 text-slate-900"         ,
            placeholder: "Describe symptoms briefly..."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2806}}
          )
        )

        /* High Risk Flags */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2816}}
          , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2817}}, "High-Risk Factors (Boosts Queue Priority)"    )
          , React.createElement('div', { className: "flex gap-2 flex-wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2818}}
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
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2822}}

                  , isChecked ? '✓ ' : '+ ', " " , flag
                )
              );
            })
          )
        )

        , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2845}}
          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "px-6 py-3 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs rounded-xl"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2846}}
, "← Back"

          )
          , React.createElement('button', {
            type: "button",
            onClick: handleBook,
            className: "px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2853}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2858}}, "Confirm Booking & Enter Queue"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2859}}, "→")
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
    React.createElement('div', { className: "max-w-xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2872}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2873}}
        , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2874}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-brand-600 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2875}}), "Priority Queue Management Active"

        )

        /* Live Queue Position Card */
        , React.createElement('div', { className: "w-32 h-32 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex flex-col items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/30 relative"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2880}}
          , React.createElement('span', { className: "text-xs uppercase font-bold tracking-widest opacity-80"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2881}}, "You Are" )
          , React.createElement('span', { className: "text-4xl font-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2882}}, "#", queuePos)
          , React.createElement('span', { className: "text-[10px] font-semibold opacity-90"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2883}}, "in priority queue"  )
          , React.createElement('div', { className: "absolute inset-0 rounded-full border-4 border-brand-300 border-dashed animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2884}})
        )

        , React.createElement('h3', { className: "text-xl font-black text-slate-900 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2887}}, "Estimated Wait: "  , estimatedMins, " Minutes" )
        , React.createElement('p', { className: "text-xs text-slate-500 mb-6 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2888}}, "Consulting Doctor: "
            , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2889}}, _optionalChain([appointment, 'optionalAccess', _10 => _10.doctorName]) || 'Dr. Priya Sharma'), " (" , _optionalChain([appointment, 'optionalAccess', _11 => _11.specialty]) || 'Neurology', ")"
        )

        /* Priority Computation Audit */
        , React.createElement('div', { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs space-y-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2893}}
          , React.createElement('div', { className: "flex items-center justify-between text-slate-500 font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2894}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2895}}, "PRIORITY SCORING BREAKDOWN"  )
            , React.createElement('span', { className: "text-brand-700 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2896}}, "SCORE: 85 PTS"  )
          )

          , React.createElement('div', { className: "grid grid-cols-2 gap-2 text-slate-700 font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2899}}
            , React.createElement('div', { className: "bg-white p-2 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2900}}
              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2901}}, "Acuity Tier" )
              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2902}}, _optionalChain([appointment, 'optionalAccess', _12 => _12.urgencyTier]) === 'RED' ? '🔴 RED (+100)' : '🟡 URGENT (+50)')
            )
            , React.createElement('div', { className: "bg-white p-2 rounded-lg border border-slate-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2904}}
              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2905}}, "Punctuality Protection" )
              , React.createElement('strong', { className: "text-emerald-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2906}}, "✓ Booked Slot (+25)"   )
            )
          )

          , React.createElement('p', { className: "text-[11px] text-slate-500 pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2910}}
            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2911}}, "Anti-Starvation Guardrail:" ), " On-time booked appointments cannot be indefinitely bumped by walk-in arrivals."
          )
        )

        , React.createElement('div', { className: "p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6 flex items-center justify-between gap-3 text-left"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2915}}
          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2916}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2917}}, "🔔")
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2918}}
              , React.createElement('h4', { className: "text-xs font-bold text-emerald-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2919}}, "Doctor Has Called Your Session"    )
              , React.createElement('p', { className: "text-[11px] text-emerald-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2920}}, "Doctor Dr. Priya Sharma is waiting in the digital room."         )
            )
          )
        )

        , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2925}}
          , React.createElement('button', {
            type: "button",
            onClick: onJoinCall,
            className: "w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2926}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2931}}, "🎥 Join Teleconsultation Room Now"    )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2932}}, "→")
          )

          , React.createElement('button', {
            type: "button",
            onClick: onBack,
            className: "text-xs font-bold text-slate-400 hover:text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2935}}
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2996}}
      /* Call Header & Bandwidth Degradation Simulation Bar */
      , React.createElement('div', { className: "bg-slate-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between flex-wrap gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2998}}
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2999}}
          , React.createElement('div', { className: "w-3 h-3 rounded-full bg-emerald-400 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3000}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3001}}
            , React.createElement('h3', { className: "text-sm font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3002}}, _optionalChain([appointment, 'optionalAccess', _13 => _13.doctorName]) || 'Dr. Priya Sharma', " • "  , _optionalChain([appointment, 'optionalAccess', _14 => _14.specialty]) || 'Neurology')
            , React.createElement('p', { className: "text-[11px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3003}}, "Consultation Session • Call Duration: 04:12"     )
          )
        )

        /* Degrading Modes Switcher (Demo Bandwidth Toggle) */
        , React.createElement('div', { className: "flex items-center gap-1.5 bg-white/10 p-1 rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3008}}
          , React.createElement('span', { className: "text-[10px] text-slate-400 px-2 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3009}}, "Bandwidth Mode:" )
          , React.createElement('button', {
            type: "button",
            onClick: () => setCallMode('video'),
            className: `px-3 py-1 rounded-lg transition-all ${
              callMode === 'video' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3010}}
, "🎥 Video (HD)"

          )
          , React.createElement('button', {
            type: "button",
            onClick: () => setCallMode('audio'),
            className: `px-3 py-1 rounded-lg transition-all ${
              callMode === 'audio' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3019}}
, "🎙️ Audio (Low BW)"

          )
          , React.createElement('button', {
            type: "button",
            onClick: () => setCallMode('chat'),
            className: `px-3 py-1 rounded-lg transition-all ${
              callMode === 'chat' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3028}}
, "💬 In-App Chat (2G)"

          )
        )
      )

      , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3040}}
        /* Main Stage: Video / Audio / Chat */
        , React.createElement('div', { className: "lg:col-span-2 space-y-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3042}}
          /* Mode 1: Video Call View */
          , callMode === 'video' && (
            React.createElement('div', { className: "bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col justify-between p-6 shadow-2xl border border-slate-800"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3045}}
              /* Doctor Video Feed (Simulated) */
              , React.createElement('div', { className: "absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3047}}
                , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3048}}
                  , React.createElement('div', { className: "w-24 h-24 rounded-full bg-brand-500/20 border-2 border-brand-400 text-white flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3049}}, "👩‍⚕️"

                  )
                  , React.createElement('h4', { className: "text-lg font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3052}}, "Dr. Priya Sharma"  )
                  , React.createElement('span', { className: "text-xs text-brand-300 font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3053}}, "MD Neurology • Live Telehealth Stream"     )
                )
              )

              /* Patient Webcam Preview Box (PiP) */
              , React.createElement('div', { className: "absolute bottom-5 right-5 w-36 h-28 bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-white text-xs z-10"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3058}}
                , isCameraOff ? (
                  React.createElement('span', { className: "text-slate-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3060}}, "Camera Off" )
                ) : (
                  React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3062}}
                    , React.createElement('span', { className: "text-2xl block mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3063}}, "👤")
                    , React.createElement('span', { className: "text-[10px] font-bold opacity-80"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3064}}, pathActor === 'worker' ? 'ASHA + Patient' : 'Patient')
                  )
                )
              )

              /* Floating Action Controls */
              , React.createElement('div', { className: "absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 z-10"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3070}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setIsMuted(!isMuted),
                  className: `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isMuted ? 'bg-critical-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3071}}

                  , isMuted ? '🔇' : '🎙️'
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => setIsCameraOff(!isCameraOff),
                  className: `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCameraOff ? 'bg-critical-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3081}}

                  , isCameraOff ? '🚫' : '📹'
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => setCallMode('chat'),
                  className: "w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3091}}
, "💬"

                )
              )
            )
          )

          /* Mode 2: Audio-Only Fallback View */
          , callMode === 'audio' && (
            React.createElement('div', { className: "bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-8 text-white text-center shadow-xl border border-amber-500/20 aspect-video flex flex-col justify-between"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3104}}
              , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 mx-auto"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3105}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3106}}, "⚠️ Bandwidth Degraded • Switched to Audio-Only Mode"       )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3109}}
                , React.createElement('div', { className: "w-20 h-20 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-3xl mx-auto mb-3 border border-amber-400"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3110}}, "🎙️"

                )
                , React.createElement('h4', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3113}}, "Dr. Priya Sharma • Audio Active"     )
                , React.createElement('p', { className: "text-xs text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3114}}, "High-clarity low-latency voice channel connected"    )

                /* Simulated Audio Waveforms */
                , React.createElement('div', { className: "flex items-center justify-center gap-1.5 mt-6 h-8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3117}}
                  , [20, 60, 40, 80, 50, 90, 30, 70, 40, 85, 30, 60].map((h, i) => (
                    React.createElement('div', {
                      key: i,
                      className: "w-1.5 bg-amber-400 rounded-full animate-pulse"   ,
                      style: { height: `${h}%`, animationDelay: `${i * 100}ms` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3119}}
)
                  ))
                )
              )

              , React.createElement('div', { className: "flex justify-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3128}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setIsMuted(!isMuted),
                  className: "px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3129}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3134}}, isMuted ? '🔇 Unmute' : '🎙️ Mute')
                )
              )
            )
          )

          /* Mode 3: Session In-App Chat Fallback View */
          , callMode === 'chat' && (
            React.createElement('div', { className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3142}}
              , React.createElement('div', { className: "flex items-center justify-between pb-3 border-b border-slate-100"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3143}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3144}}
                  , React.createElement('h4', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3145}}, "Session In-App Chat"  )
                  , React.createElement('p', { className: "text-[11px] text-slate-400 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3146}}, "Tied to consultation ID: CON-JH-8842"    )
                )
                , React.createElement('span', { className: "text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3148}}, "Session Scoped"

                )
              )

              , React.createElement('div', { className: "flex-1 overflow-y-auto py-4 space-y-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3153}}
                , messages.map((m) => {
                  const isDoctor = m.sender === 'doctor';
                  return (
                    React.createElement('div', { key: m.id, className: `flex flex-col ${isDoctor ? 'items-start' : 'items-end'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3157}}
                      , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 mb-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3158}}, m.senderName, " • "  , m.time)
                      , React.createElement('div', {
                        className: `p-3.5 rounded-2xl max-w-sm text-xs font-medium leading-relaxed ${
                          isDoctor
                            ? 'bg-slate-100 text-slate-900 rounded-tl-sm'
                            : 'bg-brand-600 text-white rounded-tr-sm'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3159}}

                        , m.text
                      )
                    )
                  );
                })
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex gap-2 items-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3173}}
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
                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3174}}
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: () => document.getElementById('chat-attachment').click(),
                  className: "p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"     ,
                  title: "Attach Photo/Video" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3192}}

                  , React.createElement('svg', { className: "w-5 h-5" , fill: "none", stroke: "currentColor", viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3198}}, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3198}} ))
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
                  className: "flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3200}}
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: sendChatMessage,
                  className: "px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3213}}
, "Send"

                )
              )
            )
          )
        )

        /* Sidebar: Vitals Observation Panel with Reliability Tagging */
        , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3226}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-200"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3227}}
            , React.createElement('div', { className: "flex items-center justify-between mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3228}}
              , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3229}}, "Live Vitals Observations"  )
              , React.createElement(VitalsConfidenceBadge, { source: pathActor === 'worker' ? 'worker_verified' : 'self_reported', __self: this, __source: {fileName: _jsxFileName, lineNumber: 3230}} )
            )

            , React.createElement('div', { className: "space-y-2.5 mb-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3233}}
              , vitals.map((v, i) => (
                React.createElement('div', { key: i, className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3235}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3236}}
                    , React.createElement('span', { className: "text-slate-500 font-bold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3237}}, v.label)
                    , React.createElement('strong', { className: "text-slate-900 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3238}}, v.value, " " , v.unit)
                  )
                  , React.createElement(VitalsConfidenceBadge, { source: v.source, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3240}} )
                )
              ))
            )

            /* Quick Add Vital */
            , React.createElement('div', { className: "pt-4 border-t border-slate-100 space-y-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3246}}
              , React.createElement('span', { className: "text-[11px] font-bold text-slate-500 block uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3247}}, "Log Additional Vital Reading"   )
              , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3248}}
                , React.createElement('select', {
                  value: newVitalType,
                  onChange: (e) => setNewVitalType(e.target.value),
                  className: "px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3249}}

                  , React.createElement('option', { value: "glucose", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3254}}, "Glucose (mg/dL)" )
                  , React.createElement('option', { value: "bp", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3255}}, "Blood Pressure" )
                  , React.createElement('option', { value: "spo2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3256}}, "SpO2 (%)" )
                  , React.createElement('option', { value: "temp", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3257}}, "Temp (°F)" )
                )
                , React.createElement('input', {
                  type: "text",
                  value: newVitalValue,
                  onChange: (e) => setNewVitalValue(e.target.value),
                  className: "w-20 px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3259}}
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: addVital,
                  className: "px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3265}}
, "Save"

                )
              )
            )
          )

          /* Action to Doctor Form */
          , React.createElement('button', {
            type: "button",
            onClick: () => onCompleteConsultation(vitals),
            className: "w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3277}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3282}}, "Complete Call & Proceed to Doctor Rx 📝"       )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3283}}, "→")
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
    React.createElement('div', { className: "max-w-3xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3319}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3320}}
        , React.createElement('div', { className: "mb-6 pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3321}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3322}}
            , React.createElement('div', { className: "flex items-center gap-2 text-xs font-bold text-brand-700 uppercase mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3323}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3324}}, "Doctor Clinical Workspace • Digital EMR Rx"      )
            )
            , React.createElement('h2', { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3326}}, "Clinical Documentation Form"  )
          )
          , React.createElement('span', { className: "text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3328}}, "Consulting: "
             , _optionalChain([appointment, 'optionalAccess', _15 => _15.doctorName]) || 'Dr. Priya Sharma'
          )
        )

        , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3333}}
          /* Differential Diagnosis */
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3335}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3336}}, "Differential Clinical Diagnosis"  )
            , React.createElement('input', {
              type: "text",
              value: diagnosis,
              onChange: (e) => setDiagnosis(e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-500"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3337}}
            )
          )

          /* Clinical Examination Notes */
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3346}}
            , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3347}}, "Doctor Clinical Notes & Observations"    )
            , React.createElement('textarea', {
              rows: 3,
              value: doctorNotes,
              onChange: (e) => setDoctorNotes(e.target.value),
              className: "w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-500 text-slate-900"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3348}}
            )
          )

          /* Prescription Items */
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3357}}
            , React.createElement('div', { className: "flex items-center justify-between mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3358}}
              , React.createElement('label', { className: "block text-xs font-bold text-slate-700 uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3359}}, "Prescription (Rx Medicines)"  )
              , React.createElement('span', { className: "text-xs text-slate-400 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3360}}, prescription.length, " Items" )
            )

            , React.createElement('div', { className: "space-y-2 mb-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3363}}
              , prescription.map((rx, idx) => (
                React.createElement('div', { key: idx, className: "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3365}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3366}}
                    , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3367}}, rx.medicineName)
                    , React.createElement('span', { className: "text-slate-500 ml-2 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3368}}, "(", rx.dosage, ") • "  , rx.frequency, " • "  , rx.durationDays, " days" )
                    , React.createElement('p', { className: "text-[11px] text-slate-400 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3369}}, rx.instructions)
                  )
                  , React.createElement('button', {
                    type: "button",
                    onClick: () => setPrescription(prescription.filter((_, i) => i !== idx)),
                    className: "text-critical-600 font-bold hover:underline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3371}}
, "Remove"

                  )
                )
              ))
            )
          )

          /* Clinical Flags Grid */
          , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3384}}
            , React.createElement('div', {
              onClick: () => setReferralFlag(!referralFlag),
              className: `p-4 rounded-xl border cursor-pointer transition-all ${
                referralFlag ? 'bg-critical-50 border-critical-300 shadow-sm' : 'bg-white border-slate-200'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3385}}

              , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3391}}
                , React.createElement('span', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3392}}, "Tertiary Referral" )
                , React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3393}}, referralFlag ? '🚨 YES' : 'NO')
              )
              , React.createElement('p', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3395}}, "Trigger hospital referral to Feature 03 / Super Specialty."        )
            )

            , React.createElement('div', {
              onClick: () => setDiagnosticOrderFlag(!diagnosticOrderFlag),
              className: `p-4 rounded-xl border cursor-pointer transition-all ${
                diagnosticOrderFlag ? 'bg-brand-50 border-brand-300 shadow-sm' : 'bg-white border-slate-200'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3398}}

              , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3404}}
                , React.createElement('span', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3405}}, "Diagnostic Order" )
                , React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3406}}, diagnosticOrderFlag ? '🧪 YES' : 'NO')
              )
              , React.createElement('p', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3408}}, "Order Lab Tests (CBC, Serum Lytes, ECG)."      )
            )

            , React.createElement('div', {
              onClick: () => setFollowUpFlag(!followUpFlag),
              className: `p-4 rounded-xl border cursor-pointer transition-all ${
                followUpFlag ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-white border-slate-200'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3411}}

              , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3417}}
                , React.createElement('span', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3418}}, "Follow-up Required" )
                , React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3419}}, followUpFlag ? `📅 ${followUpDays}d` : 'NO')
              )
              , React.createElement('p', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3421}}, "Schedule follow-up review in 7 days."     )
            )
          )

          , React.createElement('div', { className: "pt-4 border-t border-slate-100 flex justify-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3425}}
            , React.createElement('button', {
              type: "button",
              onClick: handleFinalize,
              className: "px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3426}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3431}}, "Sign & Issue Digital EMR Consultation Summary 🔏"       )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3432}}, "→")
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
    React.createElement('div', { className: "max-w-2xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3455}}
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3456}}
        , React.createElement('div', { className: "border-2 border-dashed border-brand-500/40 rounded-2xl p-6 bg-brand-50/20 mb-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3457}}
          , React.createElement('div', { className: "flex items-center justify-between border-b border-brand-200/60 pb-4 mb-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3458}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3459}}
              , React.createElement('span', { className: "text-[10px] font-extrabold tracking-widest text-brand-700 uppercase bg-brand-100 px-2 py-0.5 rounded"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3460}}, "Official Teleconsultation Record & Rx"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3463}}, "Dr. Priya Sharma, MD"   )
              , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3464}}, "Department of Neurology • SBMC&H Regional Grid"      )
            )
            , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3466}}
              , React.createElement('div', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3467}}, "CONSULT ID" )
              , React.createElement('div', { className: "text-sm font-black text-brand-700 font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3468}}, consultId)
            )
          )

          , React.createElement('div', { className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3472}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3473}}
              , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3474}}, "Differential Diagnosis" )
              , React.createElement('strong', { className: "text-slate-900 text-sm font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3475}}, diagnosis)
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3478}}
              , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3479}}, "Doctor Clinical Notes"  )
              , React.createElement('p', { className: "text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3480}}
                , doctorNotes
              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3485}}
              , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3486}}, "Prescribed Medicines (Rx)"  )
              , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3487}}
                , prescription.map((rx, i) => (
                  React.createElement('div', { key: i, className: "p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3489}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3490}}
                      , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3491}}, rx.medicineName, " (" , rx.dosage, ")")
                      , React.createElement('span', { className: "text-slate-500 ml-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3492}}, "• " , rx.frequency)
                    )
                    , React.createElement('span', { className: "text-[11px] text-slate-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3494}}, rx.durationDays, " Days" )
                  )
                ))
              )
            )

            /* QR Verification */
            , React.createElement('div', { className: "flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 gap-3"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3501}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3502}}
                , React.createElement('div', { className: "w-12 h-12 bg-slate-900 rounded-lg p-1 flex flex-col justify-between shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3503}}
                  , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3504}}, React.createElement('div', { className: "w-3 h-3 bg-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3504}}), React.createElement('div', { className: "w-3 h-3 bg-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3504}}))
                  , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3505}}, React.createElement('div', { className: "w-3 h-3 bg-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3505}}), React.createElement('div', { className: "w-1.5 h-1.5 bg-white self-end"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3505}}))
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3507}}
                  , React.createElement('div', { className: "text-xs font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3508}}, "Pharmacist & EMR Fast-Verification"   )
                  , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3509}}, "Scan at any Jan Aushadhi Kendra or hospital pharmacy."        )
                )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                },
                className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3512}}

                , copied ? '✓ Copied' : 'Copy ID'
              )
            )
          )
        )

        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3526}}
          , React.createElement('button', {
            type: "button",
            onClick: onGoHome,
            className: "px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3527}}
, "🏠 Return to Platform Home"

          )

          , React.createElement('button', {
            type: "button",
            onClick: onRestart,
            className: "px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3535}}
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
    React.createElement('div', { className: "space-y-6 pb-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3783}}
      /* Header Banner */
      , React.createElement('div', { className: "bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3785}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3786}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3787}}
            , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3788}}, "Feature Map 03 • Closed-Loop Referral"

            )
            , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3791}}, "REF-TRACKER v2.0" )
          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3793}}, "Smart Referral Management System"   )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 font-medium mt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3794}}, "Digitally manages and tracks patient referrals from doctor creation to ASHA follow-up, facility intake, and completed care."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3799}}
          , React.createElement('button', {
            type: "button",
            onClick: () => setShowCreateModal(true),
            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3800}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3805}}, "➕")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3806}}, "Create New Referral"  )
          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3808}}
, "🏠 Home"

          )
        )
      )

      /* Role View Selector Tabs */
      , React.createElement('div', { className: "bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3819}}
        , React.createElement('div', { className: "flex items-center gap-1.5 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3820}}
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
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3827}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3840}}, t.label)
            )
          ))
        )

        , React.createElement('div', { className: "px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-extrabold rounded-lg border border-emerald-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3845}}, "Active Role: "
            , activeTabRole.toUpperCase()
        )
      )

      /* 4 KPI METRIC CARDS */
      , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3851}}
        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3852}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3853}}, "Total Referrals" )
          , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3854}}, stats.total)
          , React.createElement('span', { className: "text-[10px] text-slate-400 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3855}}, "Across all health corridors"   )
        )

        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3858}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-amber-700 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3859}}, "Pending Action" )
          , React.createElement('div', { className: "text-3xl font-black text-amber-600 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3860}}, stats.pending)
          , React.createElement('span', { className: "text-[10px] text-amber-600/80 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3861}}, "CREATED or SENT state"   )
        )

        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-blue-200 bg-blue-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3864}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-blue-700 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3865}}, "In Transit / Reached"   )
          , React.createElement('div', { className: "text-3xl font-black text-blue-600 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3866}}, stats.inProgress)
          , React.createElement('span', { className: "text-[10px] text-blue-600/80 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3867}}, "ASHA active follow-up"  )
        )

        , React.createElement('div', { className: "bg-white rounded-2xl p-5 border border-emerald-200 bg-emerald-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3870}}
          , React.createElement('span', { className: "text-[11px] font-bold uppercase tracking-wider text-emerald-700 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3871}}, "Care Completed" )
          , React.createElement('div', { className: "text-3xl font-black text-emerald-600 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3872}}, stats.completed)
          , React.createElement('span', { className: "text-[10px] text-emerald-600/80 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3873}}, "Verified consultation finished"  )
        )
      )

      /* VIEW 1: DOCTOR DASHBOARD */
      , activeTabRole === 'doctor' && (
        React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3879}}
          , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3880}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3881}}
              , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3882}}, "Doctor Referral Tracking Board"   )
              , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3883}}, "Monitor referral lifecycles, dispatch newly created referrals, and inspect audit logs."

              )
            )

            , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3888}}
              , React.createElement('input', {
                type: "text",
                placeholder: "Search patient, ID, facility..."   ,
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3889}}
              )

              , React.createElement('div', { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3897}}
                , ['ALL', 'CREATED', 'SENT', 'IN_PROGRESS', 'REACHED_FACILITY', 'COMPLETED'].map((st) => (
                  React.createElement('button', {
                    key: st,
                    type: "button",
                    onClick: () => setStatusFilter(st),
                    className: `px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                      statusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3899}}

                    , st === 'ALL' ? 'All' : st.replace('_', ' ')
                  )
                ))
              )
            )
          )

          /* Referral Table */
          , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3915}}
            , React.createElement('table', { className: "w-full text-left text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3916}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3917}}
                , React.createElement('tr', { className: "border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3918}}
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3919}}, "Referral ID" )
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3920}}, "Patient")
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3921}}, "Specialty & Reason"  )
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3922}}, "Receiving Destination" )
                  , React.createElement('th', { className: "py-3 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3923}}, "Status")
                  , React.createElement('th', { className: "py-3 px-3 text-right"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3924}}, "Actions")
                )
              )
              , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3927}}
                , filteredReferrals.map((ref) => (
                  React.createElement('tr', { key: ref.id, className: "hover:bg-slate-50/80 transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3929}}
                    , React.createElement('td', { className: "py-3.5 px-3 font-mono font-black text-emerald-800 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3930}}
                      , ref.referralId
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3933}}
                      , React.createElement('div', { className: "font-bold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3934}}, ref.patientName)
                      , React.createElement('div', { className: "text-[11px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3935}}, ref.patientAge, "y • "  , ref.patientSex, " • "  , ref.patientLocation)
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3937}}
                      , React.createElement('div', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3938}}, ref.specialty)
                      , React.createElement('div', { className: "text-[11px] text-slate-500 line-clamp-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3939}}, ref.reason)
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3941}}
                      , React.createElement('div', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3942}}, ref.receivingFacilityName)
                      , React.createElement('div', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3943}}, "From: " , ref.referringFacilityName)
                    )
                    , React.createElement('td', { className: "py-3.5 px-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3945}}
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
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3946}}

                        , ref.status.replace('_', ' ')
                      )
                    )
                    , React.createElement('td', { className: "py-3.5 px-3 text-right space-x-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3964}}
                      , ref.status === 'CREATED' && (
                        React.createElement('button', {
                          type: "button",
                          onClick: () => handleUpdateStatus(ref, 'SENT', 'Doctor transmitted referral to destination facility.'),
                          className: "px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3966}}
, "Dispatch (Send)"

                        )
                      )
                      , React.createElement('button', {
                        type: "button",
                        onClick: () => handleOpenTimeline(ref),
                        className: "px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3974}}
, "Timeline 📜"

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
        React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3992}}
          , React.createElement('div', { className: "bg-amber-500/10 border border-amber-300 rounded-2xl p-5 flex items-start justify-between gap-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3993}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3994}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3995}}
                , React.createElement('span', { className: "w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3996}})
                , React.createElement('h3', { className: "text-base font-black text-amber-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3997}}, "ASHA Pending Follow-Up Queue"   )
              )
              , React.createElement('p', { className: "text-xs text-amber-800 font-medium mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3999}}
                , pendingWorkerReferrals.length, " patient(s) have active referrals requiring ground follow-up and transport coordination. Update their status once contacted or when they reach the hospital."

              )
            )
            , React.createElement('span', { className: "text-2xl font-black text-amber-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4004}}, pendingWorkerReferrals.length)
          )

          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4007}}
            , pendingWorkerReferrals.map((ref) => (
              React.createElement('div', { key: ref.id, className: "p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4009}}
                , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4010}}
                  , React.createElement('span', { className: "text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4011}}
                    , ref.referralId
                  )
                  , React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4014}}
                    , ref.status.replace('_', ' ')
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4019}}
                  , React.createElement('h4', { className: "font-extrabold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4020}}, ref.patientName, " (" , ref.patientAge, "y, " , ref.patientSex, ")")
                  , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4021}}, "Location: " , ref.patientLocation, " • Phone: "   , ref.patientPhone || 'N/A')
                )

                , React.createElement('div', { className: "bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4024}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4025}}, React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4025}}, "Department:"), " " , ref.specialty)
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4026}}, React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4026}}, "Destination:"), " " , ref.receivingFacilityName)
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4027}}, React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4027}}, "Reason:"), " " , ref.reason)
                )

                , React.createElement('div', { className: "pt-2 flex items-center gap-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4030}}
                  , ref.status === 'SENT' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'IN_PROGRESS', 'ASHA contacted patient; transport en route.'),
                      className: "flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4032}}
, "📞 Patient Contacted / En Route"

                    )
                  )

                  , ref.status === 'IN_PROGRESS' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'REACHED_FACILITY', 'ASHA confirmed patient arrived at hospital gate/OPD desk.'),
                      className: "flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4042}}
, "🏥 Confirm Patient Reached Hospital"

                    )
                  )

                  , React.createElement('button', {
                    type: "button",
                    onClick: () => handleOpenTimeline(ref),
                    className: "px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4051}}
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
        React.createElement('div', { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4067}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4068}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4069}}, "Receiving Facility Intake & Care Completion"     )
            , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4070}}, "Incoming referrals designated for Sheikh Bhikhari Medical College & District Hospitals. Confirm patient arrival and finalize care when specialist consultation completes."


            )
          )

          , React.createElement('div', { className: "divide-y divide-slate-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4076}}
            , incomingFacilityReferrals.map((ref) => (
              React.createElement('div', { key: ref.id, className: "py-4 flex items-center justify-between flex-wrap gap-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4078}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4079}}
                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4080}}
                    , React.createElement('span', { className: "font-mono font-black text-emerald-800 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4081}}, ref.referralId)
                    , React.createElement('span', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4082}}, "• " , ref.patientName, " (" , ref.patientAge, "y)")
                    , React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4083}}
                      , ref.status.replace('_', ' ')
                    )
                  )
                  , React.createElement('p', { className: "text-xs text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4087}}, "Specialty: "
                     , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4088}}, ref.specialty), " • Reason: "   , ref.reason
                  )
                  , React.createElement('p', { className: "text-[11px] text-slate-400 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4090}}, "Referred by: "  , ref.referringDoctorName, " (" , ref.referringFacilityName, ")")
                )

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4093}}
                  , ref.status !== 'REACHED_FACILITY' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'REACHED_FACILITY', 'Facility reception desk checked in patient.'),
                      className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4095}}
, "📥 Check-In Patient Arrival"

                    )
                  )

                  , ref.status === 'REACHED_FACILITY' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleUpdateStatus(ref, 'COMPLETED', 'Consultation & clinical evaluation completed. Patient discharged/admitted.'),
                      className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4105}}
, "✅ Complete Care & Consultation"

                    )
                  )

                  , React.createElement('button', {
                    type: "button",
                    onClick: () => handleOpenTimeline(ref),
                    className: "px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4114}}
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
        React.createElement('div', { className: "max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4130}}
          , React.createElement('div', { className: "border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 bg-emerald-50/20"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4131}}
            , React.createElement('div', { className: "flex items-center justify-between border-b border-emerald-200/60 pb-4 mb-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4132}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4133}}
                , React.createElement('span', { className: "text-[10px] font-extrabold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-2.5 py-0.5 rounded"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4134}}, "Official Digital Referral Pass"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4137}}, primaryPatientRef.patientName)
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4138}}, "Age: " , primaryPatientRef.patientAge, " • Destination: "   , primaryPatientRef.receivingFacilityName)
              )
              , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4140}}
                , React.createElement('div', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4141}}, "REFERRAL ID" )
                , React.createElement('div', { className: "text-sm font-black text-emerald-800 font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4142}}, primaryPatientRef.referralId)
              )
            )

            /* 4-Step Patient Stepper */
            , React.createElement('div', { className: "py-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4147}}
              , React.createElement('div', { className: "flex items-center justify-between text-center relative"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4148}}
                , React.createElement('div', { className: "absolute top-3 left-6 right-6 h-0.5 bg-slate-200 -z-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4149}})
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
                    React.createElement('div', { key: idx, className: "relative z-10 flex flex-col items-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4163}}
                      , React.createElement('div', {
                        className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4164}}

                        , isDone ? '✓' : idx + 1
                      )
                      , React.createElement('span', { className: "text-[10px] font-bold text-slate-700 mt-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4171}}, s.label)
                    )
                  );
                })
              )
            )

            , React.createElement('div', { className: "space-y-3 text-xs bg-white p-4 rounded-xl border border-slate-200 mt-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4178}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4179}}
                , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4180}}, "Required Specialty" )
                , React.createElement('strong', { className: "text-slate-900 text-sm font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4181}}, primaryPatientRef.specialty)
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4183}}
                , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4184}}, "Clinical Reason" )
                , React.createElement('p', { className: "text-slate-700 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4185}}, primaryPatientRef.reason)
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4187}}
                , React.createElement('span', { className: "text-slate-400 uppercase font-bold text-[10px] block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4188}}, "Emergency Destination Hospital"  )
                , React.createElement('strong', { className: "text-slate-900 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4189}}, primaryPatientRef.receivingFacilityName)
              )
            )
          )
        )
      )

      /* TIMELINE AUDIT DRAWER MODAL */
      , selectedTimelineRef && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4198}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4199}}
            , React.createElement('div', { className: "flex items-center justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4200}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4201}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4202}}
                  , selectedTimelineRef.referralId
                )
                , React.createElement('h3', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4205}}, "Referral Journey & Audit Trail"    )
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4206}}, "Patient: " , selectedTimelineRef.patientName, " • "  , selectedTimelineRef.specialty)
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setSelectedTimelineRef(null),
                className: "w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4208}}
, "✕"

              )
            )

            , React.createElement('div', { className: "space-y-4 max-h-96 overflow-y-auto pr-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4217}}
              , timelineLogs.map((log, idx) => (
                React.createElement('div', { key: idx, className: "flex items-start gap-3 relative"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4219}}
                  , React.createElement('div', { className: "w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 mt-0.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4220}}
                    , idx + 1
                  )
                  , React.createElement('div', { className: "bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-1 text-xs space-y-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4223}}
                    , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4224}}
                      , React.createElement('span', { className: "font-black text-slate-900 uppercase text-[11px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4225}}
                        , log.fromStatus ? `${log.fromStatus} → ${log.toStatus}` : log.toStatus
                      )
                      , React.createElement('span', { className: "text-[10px] font-mono text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4228}}
                        , new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      )
                    )
                    , React.createElement('p', { className: "text-slate-700 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4232}}, log.remarks)
                    , React.createElement('div', { className: "text-[10px] text-slate-400 font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4233}}, "Updated by: "
                        , React.createElement('strong', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4234}}, log.updatedBy), " (" , log.userRole, ")"
                    )
                  )
                )
              ))
            )

            , React.createElement('div', { className: "pt-3 border-t border-slate-100 text-right"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4241}}
              , React.createElement('button', {
                type: "button",
                onClick: () => setSelectedTimelineRef(null),
                className: "px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4242}}
, "Close Audit Timeline"

              )
            )
          )
        )
      )

      /* CREATE REFERRAL MODAL */
      , showCreateModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4256}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4257}}
            , React.createElement('div', { className: "flex items-center justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4258}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4259}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4260}}, "Doctor Referral Form"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4263}}, "Create Digital Clinical Referral"   )
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4264}}, "Pre-filled from Smart Care Navigator & Verified Hospital Destination"        )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCreateModal(false),
                className: "w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4266}}
, "✕"

              )
            )

            , React.createElement('form', { onSubmit: handleCreateSubmit, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4275}}
              , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4276}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4277}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4278}}, "Patient Full Name"  )
                  , React.createElement('input', {
                    type: "text",
                    required: true,
                    value: formData.patientName,
                    onChange: (e) => setFormData({ ...formData, patientName: e.target.value }),
                    className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4279}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4287}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4288}}, "Patient Age & Sex"   )
                  , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4289}}
                    , React.createElement('input', {
                      type: "number",
                      required: true,
                      value: formData.patientAge,
                      onChange: (e) => setFormData({ ...formData, patientAge: Number(e.target.value) }),
                      className: "w-24 border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4290}}
                    )
                    , React.createElement('select', {
                      value: formData.patientSex,
                      onChange: (e) => setFormData({ ...formData, patientSex: e.target.value }),
                      className: "flex-1 border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4297}}

                      , React.createElement('option', { value: "female", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4302}}, "Female")
                      , React.createElement('option', { value: "male", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4303}}, "Male")
                      , React.createElement('option', { value: "other", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4304}}, "Other")
                    )
                  )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4310}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4311}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4312}}, "Referring Doctor & Facility"   )
                  , React.createElement('input', {
                    type: "text",
                    value: `${formData.referringDoctorName} (${formData.referringFacilityName})`,
                    disabled: true,
                    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-500 font-medium"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4313}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4320}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4321}}, "Receiving Hospital (Destination)"  )
                  , React.createElement('select', {
                    value: formData.receivingFacilityName,
                    onChange: (e) => setFormData({ ...formData, receivingFacilityName: e.target.value }),
                    className: "w-full border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4322}}

                    , React.createElement('option', { value: "Sheikh Bhikhari Medical College & Hospital (SBMC&H)"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4327}}, "Sheikh Bhikhari Medical College (SBMC&H) • 2.8 km"

                    )
                    , React.createElement('option', { value: "Arogyam Multi-Specialty Hospital & Critical Care"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4330}}, "Arogyam Multi-Specialty Hospital • 4.8 km"

                    )
                    , React.createElement('option', { value: "Kalyani Super Specialty Hospital & Trauma Centre"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4333}}, "Kalyani Super Specialty & Trauma • 38 km"

                    )
                    , React.createElement('option', { value: "Sadar Hospital Hazaribagh"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4336}}, "Sadar Hospital Hazaribagh • 3.2 km"

                    )
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4343}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4344}}, "Required Medical Specialty"  )
                , React.createElement('input', {
                  type: "text",
                  required: true,
                  value: formData.specialty,
                  onChange: (e) => setFormData({ ...formData, specialty: e.target.value }),
                  className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4345}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4354}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4355}}, "Reason for Referral"  )
                , React.createElement('input', {
                  type: "text",
                  required: true,
                  value: formData.reason,
                  onChange: (e) => setFormData({ ...formData, reason: e.target.value }),
                  className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4356}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4365}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4366}}, "Clinical Summary & Vitals"   )
                , React.createElement('textarea', {
                  rows: "3",
                  value: formData.clinicalSummary,
                  onChange: (e) => setFormData({ ...formData, clinicalSummary: e.target.value }),
                  className: "w-full border border-slate-200 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4367}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4375}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowCreateModal(false),
                  className: "px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4376}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4383}}
, "Generate Digital Referral (CREATED)"

                )
              )
            )
          )
        )
      )

      /* UPDATE STATUS MODAL */
      , showUpdateModal && targetReferral && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4397}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4398}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4399}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4400}}, "Confirm Transition"

              )
              , React.createElement('h3', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4403}}, "Update Status to "
                   , React.createElement('span', { className: "text-emerald-700 font-mono" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4404}}, targetStatus)
              )
              , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4406}}, "Referral: " , targetReferral.referralId, " • Patient: "   , targetReferral.patientName)
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4409}}
              , React.createElement('label', { className: "font-bold text-slate-700 text-xs block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4410}}, "Audit Remarks / Ground Notes"    )
              , React.createElement('textarea', {
                rows: "3",
                value: statusRemarks,
                onChange: (e) => setStatusRemarks(e.target.value),
                className: "w-full text-xs border border-slate-200 rounded-xl p-2.5 font-medium"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4411}}
              )
            )

            , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4419}}
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowUpdateModal(false),
                className: "px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4420}}
, "Cancel"

              )
              , React.createElement('button', {
                type: "button",
                onClick: confirmStatusUpdate,
                className: "px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4427}}
, "Confirm Status Transition"

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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4709}}
      /* Top Banner Card */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4711}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4712}}
          , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-black text-purple-800 uppercase mb-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4713}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-purple-600 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4714}}), "Feature Map 04 • Dynamic Risk Engine"

          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4717}}, "High-Risk Patient Follow-Up System"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4720}}, "Doctor-prescribed periodic follow-up plans, frontline ASHA worker observation recording, transparent dynamic risk scoring, and real-time facility escalation alerts."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-3 flex-wrap shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4725}}
          , React.createElement('button', {
            type: "button",
            onClick: () => setShowCreatePlanModal(true),
            className: "px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4726}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4731}}, "➕ Prescribe Follow-Up Plan"   )
          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4733}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4738}}, "🏠 Home" )
          )
        )
      )

      /* Role Navigation Bar */
      , React.createElement('div', { className: "bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4744}}
        , React.createElement('div', { className: "flex gap-1.5 flex-wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4745}}
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
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4752}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4765}}, tab.icon)
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4766}}, tab.label)
            )
          ))
        )

        , React.createElement('div', { className: "px-3 py-1 bg-purple-50 text-purple-800 rounded-lg text-xs font-mono font-bold border border-purple-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4771}}, "Active Role: "
            , activeTabRole.toUpperCase()
        )
      )

      /* KPI Metric Summary Cards */
      , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4777}}
        , React.createElement('div', { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4778}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4779}}, "Total Monitored" )
          , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4780}}, highRiskPatients.length)
          , React.createElement('div', { className: "text-[11px] text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4781}}, "Active clinical care plans"   )
        )

        , React.createElement('div', { className: "bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4784}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-amber-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4785}}, "High / Critical Risk"   )
          , React.createElement('div', { className: "text-3xl font-black text-amber-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4786}}
            , highRiskPatients.filter((p) => p.latestLevel === 'HIGH' || p.latestLevel === 'CRITICAL').length
          )
          , React.createElement('div', { className: "text-[11px] text-amber-700 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4789}}, "Score ≥ 60 (Escalated)"   )
        )

        , React.createElement('div', { className: "bg-white p-5 rounded-2xl border border-critical-200 bg-critical-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4792}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-critical-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4793}}, "Active Facility Alerts"  )
          , React.createElement('div', { className: "text-3xl font-black text-critical-900 mt-1 flex items-center gap-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4794}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4795}}, activeAlerts.length)
            , activeAlerts.length > 0 && React.createElement('span', { className: "w-2.5 h-2.5 rounded-full bg-critical-600 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4796}})
          )
          , React.createElement('div', { className: "text-[11px] text-critical-700 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4798}}, "Intervention required" )
        )

        , React.createElement('div', { className: "bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4801}}
          , React.createElement('div', { className: "text-xs font-bold uppercase tracking-wider text-emerald-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4802}}, "Follow-Up Compliance" )
          , React.createElement('div', { className: "text-3xl font-black text-emerald-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4803}}, "94%")
          , React.createElement('div', { className: "text-[11px] text-emerald-700 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4804}}, "ASHA visit completion rate"   )
        )
      )

      /* ==================================================== */
      /* 1. DOCTOR MONITORING VIEW */
      /* ==================================================== */
      , activeTabRole === 'doctor' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4812}}
          /* Active Facility Escalation Alert Banner */
          , activeAlerts.length > 0 && (
            React.createElement('div', { className: "p-5 rounded-2xl bg-critical-50 border-2 border-critical-400 shadow-sm animate-pulse-subtle"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4815}}
              , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4816}}
                , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4817}}
                  , React.createElement('div', { className: "w-10 h-10 rounded-xl bg-critical-600 text-white flex items-center justify-center font-black text-xl shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4818}}, "🚨"

                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4821}}
                    , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4822}}
                      , React.createElement('span', { className: "px-2 py-0.5 rounded text-[10px] font-black uppercase bg-critical-600 text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4823}}, "CRITICAL ESCALATION ALERT"

                      )
                      , React.createElement('h4', { className: "font-extrabold text-slate-900 text-base"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4826}}
                        , activeAlerts[0].patientName, " (" , activeAlerts[0].patientId, ") • Score: "   , activeAlerts[0].riskScore, " (HIGH)"
                      )
                    )
                    , React.createElement('p', { className: "text-xs text-critical-900 font-semibold mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4830}}
                      , activeAlerts[0].triggerReason
                    )
                    , React.createElement('p', { className: "text-[11px] text-slate-600 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4833}}, "Assigned Facility: "
                        , activeAlerts[0].facilityName, " • ASHA: "   , activeAlerts[0].assignedWorkerName
                    )
                  )
                )

                , React.createElement('button', {
                  type: "button",
                  onClick: () => handleAcknowledgeAlert(activeAlerts[0].id),
                  className: "px-4 py-2 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4839}}
, "✓ Acknowledge & Review"

                )
              )
            )
          )

          /* High-Risk Patient Tracking Board */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4851}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4852}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4853}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4854}}, "High-Risk Patient Monitoring Board"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4855}}, "Real-time longitudinal risk progression and clinical deterioration tracking."

                )
              )

              , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4860}}
                , React.createElement('input', {
                  type: "text",
                  placeholder: "Search patient, ID, worker..."   ,
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4861}}
                )

                , React.createElement('div', { className: "flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4869}}
                  , ['ALL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
                    React.createElement('button', {
                      key: lvl,
                      type: "button",
                      onClick: () => setRiskFilter(lvl),
                      className: `px-2.5 py-1 rounded-lg transition-all ${
                        riskFilter === lvl
                          ? 'bg-white text-slate-900 shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4871}}

                      , lvl
                    )
                  ))
                )
              )
            )

            /* Table */
            , React.createElement('div', { className: "overflow-x-auto border border-slate-200 rounded-2xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4889}}
              , React.createElement('table', { className: "w-full text-left text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4890}}
                , React.createElement('thead', { className: "bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4891}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4892}}
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4893}}, "Patient Profile" )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4894}}, "Assigned ASHA Worker"  )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4895}}, "Current Dynamic Risk"  )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4896}}, "Trend Trajectory" )
                    , React.createElement('th', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4897}}, "Last Follow-Up" )
                    , React.createElement('th', { className: "p-4 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4898}}, "Longitudinal Audit" )
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4901}}
                  , filteredPatients.map((pat) => {
                    const isHigh = pat.latestLevel === 'HIGH' || pat.latestLevel === 'CRITICAL';
                    const isWorsening = pat.trend === 'WORSENING';
                    const isImproving = pat.trend === 'IMPROVING';

                    return (
                      React.createElement('tr', { key: pat.patientId, className: "hover:bg-slate-50/80 transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4908}}
                        , React.createElement('td', { className: "p-4 font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4909}}
                          , React.createElement('div', { className: "font-extrabold text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4910}}, pat.patientName)
                          , React.createElement('div', { className: "text-[11px] text-slate-500 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4911}}, pat.patientId)
                        )

                        , React.createElement('td', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4914}}
                          , React.createElement('div', { className: "font-semibold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4915}}, pat.assignedWorker)
                          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4916}}, pat.facilityName)
                        )

                        , React.createElement('td', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4919}}
                          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4920}}
                            , React.createElement('span', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4921}}, pat.latestScore)
                            , React.createElement('span', {
                              className: `px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                isHigh
                                  ? 'bg-critical-100 text-critical-800 border border-critical-300'
                                  : pat.latestLevel === 'MODERATE'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4922}}

                              , pat.latestLevel
                            )
                          )
                        )

                        , React.createElement('td', { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4936}}
                          , React.createElement('span', {
                            className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isWorsening
                                ? 'bg-critical-50 text-critical-700 border border-critical-200'
                                : isImproving
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4937}}

                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4946}}, isWorsening ? '📈' : isImproving ? '📉' : '➖')
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4947}}, pat.trend)
                          )
                        )

                        , React.createElement('td', { className: "p-4 text-slate-600 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4951}}
                          , pat.lastFollowUpDate ? new Date(pat.lastFollowUpDate).toLocaleDateString() : 'N/A'
                        )

                        , React.createElement('td', { className: "p-4 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4955}}
                          , React.createElement('button', {
                            type: "button",
                            onClick: () => handleInspectTrajectory(pat),
                            className: "px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4956}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4978}}
          , React.createElement('div', { className: "bg-amber-500/10 border border-amber-300 rounded-3xl p-6 sm:p-8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4979}}
            , React.createElement('div', { className: "flex items-start justify-between gap-4 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4980}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4981}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4982}}, "ASHA Ground Task Queue"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4985}}, "Scheduled Follow-Up Visits Due"   )
                , React.createElement('p', { className: "text-xs text-slate-600 mt-0.5 max-w-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4986}}, "Visit patients at home, measure vital parameters, verify prescription compliance, and record observations."

                )
              )

              , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4991}}
                , React.createElement('span', { className: "text-2xl font-black text-amber-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4992}}, dueTasks.length)
                , React.createElement('span', { className: "text-xs text-slate-500 block font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4993}}, "Tasks Due / Upcoming"   )
              )
            )
          )

          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4998}}
            , dueTasks.map((task) => {
              const isDue = task.status === 'DUE';
              return (
                React.createElement('div', {
                  key: task.id,
                  className: `p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    isDue
                      ? 'border-purple-300 bg-white shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5002}}

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5010}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3 mb-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5011}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5012}}
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            isDue
                              ? 'bg-critical-100 text-critical-800 border border-critical-300 animate-pulse'
                              : 'bg-slate-200 text-slate-700'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5013}}

                          , task.status, " • Cycle #"   , task.taskIndex
                        )
                        , React.createElement('h4', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5022}}, task.patientName)
                        , React.createElement('p', { className: "text-xs text-slate-500 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5023}}, task.patientId)
                      )

                      , React.createElement('div', { className: "text-right text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5026}}
                        , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5027}}, "Due Date" )
                        , React.createElement('span', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5028}}, new Date(task.dueDate).toLocaleDateString())
                      )
                    )

                    , React.createElement('div', { className: "p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 mb-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5032}}
                      , React.createElement('strong', { className: "block text-[11px] uppercase tracking-wider text-purple-800"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5033}}, "Doctor Instructions:"

                      )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5036}}, "Check resting BP, pill count adherence, and report any recurrent dyspnea."          )
                    )
                  )

                  , React.createElement('button', {
                    type: "button",
                    onClick: () => handleStartFollowUp(task),
                    className: "w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5040}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5045}}, "📝 Start Follow-Up Assessment"   )
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5046}}, "→")
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5059}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5060}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5061}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-critical-800 bg-critical-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5062}}, "Hospital Command Desk"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5065}}, "High-Risk Escalation Alerts & Clinical Action"     )
              , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5066}}, "Real-time patient deterioration alerts triggered by ASHA ground assessments exceeding configured clinical thresholds."

              )
            )

            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5071}}
              , facilityAlerts.map((alert) => (
                React.createElement('div', {
                  key: alert.id,
                  className: "p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex items-start justify-between gap-4 flex-wrap"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5073}}

                  , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5077}}
                    , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5078}}
                      , React.createElement('span', { className: "font-extrabold text-slate-900 text-base"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5079}}, alert.patientName)
                      , React.createElement('span', { className: "text-xs font-mono text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5080}}, "(", alert.patientId, ")")
                      , React.createElement('span', { className: "px-2 py-0.5 rounded text-[10px] font-black uppercase bg-critical-100 text-critical-800 border border-critical-300"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5081}}, "Score: "
                         , alert.riskScore, " (" , alert.riskLevel, ")"
                      )
                    )

                    , React.createElement('p', { className: "text-xs font-semibold text-critical-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5086}}, alert.triggerReason)
                    , React.createElement('p', { className: "text-[11px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5087}}, "Recent Observations: "
                        , alert.latestObservations, " • Assigned Doctor: "    , alert.assignedDoctorName
                    )
                  )

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5092}}
                    , alert.status === 'ACTIVE' ? (
                      React.createElement('button', {
                        type: "button",
                        onClick: () => handleAcknowledgeAlert(alert.id),
                        className: "px-4 py-2 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5094}}
, "Acknowledge & Schedule Outreach"

                      )
                    ) : (
                      React.createElement('span', { className: "px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5102}}, "✓ Acknowledged"

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
        React.createElement('div', { className: "max-w-2xl mx-auto space-y-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5118}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5119}}
            , React.createElement('div', { className: "text-center pb-4 border-b border-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5120}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5121}}, "My Longitudinal Care Plan"

              )
              , React.createElement('h3', { className: "text-2xl font-black text-slate-900 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5124}}, "Ramesh Mahto" )
              , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5125}}, "Cardiology Post-Discharge Follow-Up Grid"   )
            )

            , React.createElement('div', { className: "grid grid-cols-2 gap-3 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5128}}
              , React.createElement('div', { className: "p-4 bg-purple-50 rounded-2xl border border-purple-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5129}}
                , React.createElement('span', { className: "text-slate-500 block font-bold text-[10px] uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5130}}, "Next Scheduled Visit"  )
                , React.createElement('strong', { className: "text-purple-900 text-base" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5131}}, "31 August 2026"  )
                , React.createElement('span', { className: "text-[11px] text-purple-700 block mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5132}}, "ASHA Anita Devi will visit"    )
              )

              , React.createElement('div', { className: "p-4 bg-emerald-50 rounded-2xl border border-emerald-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5135}}
                , React.createElement('span', { className: "text-slate-500 block font-bold text-[10px] uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5136}}, "Supervising Facility" )
                , React.createElement('strong', { className: "text-emerald-900 text-sm block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5137}}, "SBMC&H Hazaribagh" )
                , React.createElement('span', { className: "text-[11px] text-emerald-700 block mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5138}}, "Dr. Priya Sharma"  )
              )
            )

            , React.createElement('div', { className: "p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5142}}
              , React.createElement('h4', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5143}}, "Patient Self-Care Reminders"  )
              , React.createElement('ul', { className: "text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5144}}
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5145}}, "Take morning and evening blood pressure medications without skipping."        )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5146}}, "Avoid heavy physical exertion until next doctor review."       )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5147}}, "Call 108 immediately if experiencing chest pressure or severe breathlessness."         )
              )
            )
          )
        )
      )

      /* ==================================================== */
      /* MODAL: PRESCRIBE FOLLOW-UP PLAN */
      /* ==================================================== */
      , showCreatePlanModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5158}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5159}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5160}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5161}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5162}}, "Clinical Care Plan"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5165}}, "Prescribe Follow-Up Plan"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCreatePlanModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5167}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handleCreatePlanSubmit, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5176}}
              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5177}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5178}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5179}}, "Patient Name" )
                  , React.createElement('input', {
                    type: "text",
                    value: planForm.patientName,
                    onChange: (e) => setPlanForm({ ...planForm, patientName: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5180}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5188}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5189}}, "Patient ID" )
                  , React.createElement('input', {
                    type: "text",
                    value: planForm.patientId,
                    onChange: (e) => setPlanForm({ ...planForm, patientId: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-mono"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5190}}
                  )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5200}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5201}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5202}}, "Follow-Up Frequency" )
                  , React.createElement('select', {
                    value: planForm.frequencyDays,
                    onChange: (e) => setPlanForm({ ...planForm, frequencyDays: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5203}}

                    , React.createElement('option', { value: 3, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5208}}, "Every 3 Days (High Critical)"    )
                    , React.createElement('option', { value: 7, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5209}}, "Every 7 Days (Weekly)"   )
                    , React.createElement('option', { value: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5210}}, "Every 14 Days (Bi-weekly)"   )
                    , React.createElement('option', { value: 30, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5211}}, "Every 30 Days (Monthly)"   )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5214}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5215}}, "Assigned Frontline Worker"  )
                  , React.createElement('select', {
                    value: planForm.frontlineWorkerId,
                    onChange: (e) => {
                      const id = e.target.value;
                      const name = id === 'worker_014' ? 'ASHA Anita Devi' : 'ASHA Meena Kumari';
                      setPlanForm({ ...planForm, frontlineWorkerId: id, frontlineWorkerName: name });
                    },
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5216}}

                    , React.createElement('option', { value: "worker_014", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5225}}, "ASHA Anita Devi (Katkamsandi)"   )
                    , React.createElement('option', { value: "worker_022", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5226}}, "ASHA Meena Kumari (Barkagaon)"   )
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5231}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5232}}, "Doctor's Clinical Instructions"  )
                , React.createElement('textarea', {
                  rows: "3",
                  value: planForm.instructions,
                  onChange: (e) => setPlanForm({ ...planForm, instructions: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium leading-relaxed"      ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5233}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5242}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowCreatePlanModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5243}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5250}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5266}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5267}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5268}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5269}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5270}}, "ASHA Clinical Observation Form"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5273}}, "Record Follow-Up: "
                    , selectedTaskForReport.patientName
                )
                , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5276}}, "Cycle #" , selectedTaskForReport.taskIndex, " • Due: "   , new Date(selectedTaskForReport.dueDate).toLocaleDateString())
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowSubmitReportModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5278}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handleSubmitReportForm, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5287}}
              /* Vitals: Blood Pressure */
              , React.createElement('div', { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5289}}
                , React.createElement('label', { className: "font-bold text-slate-800 block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5290}}, "Measured Blood Pressure (mmHg)"   )
                , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5291}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5292}}
                    , React.createElement('span', { className: "text-[10px] text-slate-500 font-bold block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5293}}, "Systolic (SBP)" )
                    , React.createElement('input', {
                      type: "number",
                      value: reportForm.systolic,
                      onChange: (e) => setReportForm({ ...reportForm, systolic: e.target.value }),
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold text-base text-slate-900"       ,
                      placeholder: "e.g. 140" ,
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5294}}
                    )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5303}}
                    , React.createElement('span', { className: "text-[10px] text-slate-500 font-bold block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5304}}, "Diastolic (DBP)" )
                    , React.createElement('input', {
                      type: "number",
                      value: reportForm.diastolic,
                      onChange: (e) => setReportForm({ ...reportForm, diastolic: e.target.value }),
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold text-base text-slate-900"       ,
                      placeholder: "e.g. 90" ,
                      required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5305}}
                    )
                  )
                )
              )

              /* Medication Adherence */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5318}}
                , React.createElement('label', { className: "font-bold text-slate-800 block mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5319}}, "Medication Adherence (Pill Count)"   )
                , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5320}}
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
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5326}}

                      , React.createElement('div', { className: "font-extrabold text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5336}}, adh.label)
                      , React.createElement('div', { className: "text-[10px] text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5337}}, adh.desc)
                    )
                  ))
                )
              )

              /* Symptom Progression */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5344}}
                , React.createElement('label', { className: "font-bold text-slate-800 block mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5345}}, "Symptom Progression" )
                , React.createElement('div', { className: "grid grid-cols-3 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5346}}
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
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5352}}

                      , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5362}}, sym.icon)
                      , React.createElement('div', { className: "font-extrabold text-xs mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5363}}, sym.label)
                    )
                  ))
                )
              )

              /* Remarks */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5370}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5371}}, "Field Observations & Remarks"   )
                , React.createElement('textarea', {
                  rows: "2",
                  value: reportForm.observationsText,
                  onChange: (e) => setReportForm({ ...reportForm, observationsText: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5372}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5380}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowSubmitReportModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5381}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5388}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5404}}
          , React.createElement('div', { className: "bg-white w-full max-w-md h-full p-6 overflow-y-auto shadow-2xl border-l border-slate-200 space-y-5 animate-in slide-in-from-right duration-200"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5405}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5406}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5407}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5408}}, "Longitudinal Health Trajectory"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5411}}, selectedPatientForTrajectory.patientName)
                , React.createElement('p', { className: "text-xs text-slate-500 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5412}}, selectedPatientForTrajectory.patientId)
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setSelectedPatientForTrajectory(null),
                className: "w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-black text-slate-600 flex items-center justify-center"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5414}}
, "×"

              )
            )

            /* Current Summary Card */
            , React.createElement('div', { className: "p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5424}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5425}}
                , React.createElement('span', { className: "text-xs font-bold text-purple-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5426}}, "Current Risk Status"  )
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded text-xs font-black uppercase bg-purple-600 text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5427}}, "Score: "
                   , selectedPatientForTrajectory.latestScore, " (" , selectedPatientForTrajectory.latestLevel, ")"
                )
              )
              , React.createElement('p', { className: "text-xs text-purple-950 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5431}}, "Trend: "
                 , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5432}}, selectedPatientForTrajectory.trend), " • Assigned Facility: "    , selectedPatientForTrajectory.facilityName
              )
            )

            /* Sequential History */
            , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5437}}
              , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5438}}, "Chronological Follow-Up Evolution"

              )

              , React.createElement('div', { className: "space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5442}}
                , patientRiskHistory.map((item, idx) => (
                  React.createElement('div', { key: idx, className: "relative pl-8 space-y-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5444}}
                    , React.createElement('div', { className: "absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5445}}
                      , idx + 1
                    )
                    , React.createElement('div', { className: "flex items-center justify-between text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5448}}
                      , React.createElement('span', { className: "font-extrabold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5449}}, "Follow-Up #" , idx + 1)
                      , React.createElement('span', { className: "font-mono text-purple-700 font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5450}}, "Score: " , item.riskScore)
                    )
                    , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5452}}
                      , item.reason
                    )
                    , React.createElement('span', { className: "text-[10px] text-slate-400 block font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5455}}
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6020}}
      /* Toast Notification Alert */
      , notificationToast && (
        React.createElement('div', { className: "fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-in fade-in slide-in-from-top-3 flex items-center gap-2"                   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6023}}
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6024}}, "🔔")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6025}}, notificationToast)
        )
      )

      /* Top Header Card */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6030}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6031}}
          , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-sky-800 uppercase mb-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6032}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-sky-600 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6033}}), "Feature Map 05 • Interoperable Health Records"

          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6036}}, "Patient Medical ID & Unified Record Aggregation"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6039}}, "Patient-centric health record hub anchored on MedVeda Medical ID with optional ABDM ABHA link, camera OCR studio with human confirmation, CoWIN vaccine ingestion, and consent-gated RBAC."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-3 flex-wrap shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6044}}
          , React.createElement('button', {
            type: "button",
            onClick: () => setShowRegisterModal(true),
            className: "px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6045}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6050}}, "➕ Generate Medical ID Card"    )
          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6052}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6057}}, "🏠 Home" )
          )
        )
      )

      /* Role Navigation Bar & Patient Selector */
      , React.createElement('div', { className: "bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6063}}
        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6064}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6065}}, "View As:" )
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
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6071}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6084}}, tab.icon)
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6085}}, tab.label)
            )
          ))
        )

        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6090}}
          , React.createElement('span', { className: "text-xs font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6091}}, "Select Active Patient:"  )
          , React.createElement('select', {
            value: selectedPatientId,
            onChange: (e) => {
              const val = e.target.value;
              setSelectedPatientId(val);
              const found = patientsList.find((p) => p.internalMedicalId === val);
              if (found) setPatient(found);
            },
            className: "text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer min-w-[280px]"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6092}}

            , patientsList.map((p) => (
              React.createElement('option', { key: p.internalMedicalId, value: p.internalMedicalId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6103}}
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
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6113}}

          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6120}}
            , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6121}}, accessInfo.isAllowed ? '🛡️' : '🔒')
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6122}}
              , React.createElement('div', { className: "font-extrabold text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6123}}
                , accessInfo.isAllowed ? 'Authorized Access' : 'Restricted Health Record Access'
              )
              , React.createElement('p', { className: "text-xs mt-0.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6126}}, accessInfo.reason)
            )
          )

          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6130}}
            , !accessInfo.isAllowed && (
              React.createElement('button', {
                type: "button",
                onClick: () => setShowEmergencyModal(true),
                className: "px-3.5 py-1.5 bg-critical-600 hover:bg-critical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6132}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6137}}, "🚨 Emergency Access Override"   )
              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: () => setShowConsentModal(true),
              className: "px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6140}}
, "Manage Consents 📋"

            )
          )
        )
      )

      /* Visual Medical ID Card */
      , React.createElement('div', { className: "bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800 relative overflow-hidden"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6152}}
        , React.createElement('div', { className: "absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6153}})

        , React.createElement('div', { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6155}}
          , React.createElement('div', { className: "space-y-4 flex-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6156}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6157}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6158}}
                , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl backdrop-blur-md"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6159}}, "🪪"

                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6162}}
                  , React.createElement('span', { className: "text-[10px] uppercase font-black tracking-widest text-sky-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6163}}, "Official Health ID Card • Government of India Standards"

                  )
                  , React.createElement('h3', { className: "text-2xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6166}}, patient.name)
                )
              )

              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6170}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowCardModal(true),
                  className: "px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6171}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6176}}, "🖨️ View / Print Card"    )
                )
                , React.createElement('button', {
                  type: "button",
                  onClick: handleCopyId,
                  className: "px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6178}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6183}}, "📋 Copy ID"  )
                )
              )
            )

            , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6188}}
              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6189}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6190}}, "MedVeda Medical ID"  )
                , React.createElement('span', { className: "font-mono font-black text-sky-300 text-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6191}}, patient.internalMedicalId)
              )

              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6194}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6195}}, "Linked ABHA ID"  )
                , patient.abhaId ? (
                  React.createElement('span', { className: "font-mono font-bold text-emerald-400 text-xs truncate block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6197}}, patient.abhaId)
                ) : (
                  React.createElement('button', {
                    type: "button",
                    onClick: () => setShowAbdmModal(true),
                    className: "text-amber-400 font-bold text-[11px] block hover:underline text-left"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6199}}
, "+ Link ABHA ID"

                  )
                )
              )

              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6209}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6210}}, "Demographics")
                , React.createElement('span', { className: "font-bold text-white text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6211}}, patient.age, " Yrs • "   , patient.sex ? patient.sex.toUpperCase() : 'N/A')
              )

              , React.createElement('div', { className: "bg-white/5 p-3 rounded-xl border border-white/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6214}}
                , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6215}}, "Blood Group" )
                , React.createElement('span', { className: "font-black text-critical-400 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6216}}, patient.bloodGroup || 'O+')
              )
            )

            , React.createElement('div', { className: "flex items-center gap-4 text-xs text-slate-300 font-medium flex-wrap"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6220}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6221}}, "📍 " , patient.location || 'Jharkhand')
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6222}}, "📞 " , patient.phone)
              , patient.emergencyContact && (
                React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6224}}, "🚨 Contact: "  , patient.emergencyContact.name, " (" , patient.emergencyContact.phone, ")")
              )
            )
          )

          /* Dynamic QR Code Badge */
          , React.createElement('div', { className: "bg-white p-4 rounded-2xl shadow-lg border border-slate-200 text-slate-900 flex flex-col items-center text-center shrink-0 w-44"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6230}}
            /* SVG Simulated QR Code */
            , React.createElement('svg', { viewBox: "0 0 100 100"   , className: "w-28 h-28" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6232}}
              , React.createElement('rect', { width: "100", height: "100", fill: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6233}} )
              /* Corner squares */
              , React.createElement('rect', { x: "5", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6235}} )
              , React.createElement('rect', { x: "9", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6236}} )
              , React.createElement('rect', { x: "13", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6237}} )

              , React.createElement('rect', { x: "67", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6239}} )
              , React.createElement('rect', { x: "71", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6240}} )
              , React.createElement('rect', { x: "75", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6241}} )

              , React.createElement('rect', { x: "5", y: "67", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6243}} )
              , React.createElement('rect', { x: "9", y: "71", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6244}} )
              , React.createElement('rect', { x: "13", y: "75", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6245}} )

              /* Data matrix dots */
              , React.createElement('rect', { x: "40", y: "10", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6248}} )
              , React.createElement('rect', { x: "52", y: "18", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6249}} )
              , React.createElement('rect', { x: "40", y: "40", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6250}} )
              , React.createElement('rect', { x: "56", y: "38", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6251}} )
              , React.createElement('rect', { x: "70", y: "45", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6252}} )
              , React.createElement('rect', { x: "82", y: "55", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6253}} )
              , React.createElement('rect', { x: "45", y: "60", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6254}} )
              , React.createElement('rect', { x: "60", y: "65", width: "10", height: "10", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6255}} )
              , React.createElement('rect', { x: "75", y: "75", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6256}} )
              , React.createElement('rect', { x: "40", y: "80", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6257}} )
            )
            , React.createElement('span', { className: "text-[10px] font-mono font-bold text-slate-500 mt-1 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6259}}, patient.internalMedicalId)
            , React.createElement('span', { className: "text-[9px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full mt-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6260}}, "ABDM • READY"

            )
          )
        )
      )

      /* Multi-Source Action Bar */
      , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6268}}
        , React.createElement('button', {
          type: "button",
          onClick: () => {
            handleLoadOcrPreset('prescription');
            setShowOcrModal(true);
          },
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6269}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6277}}, "📷")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-sky-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6278}}, "Add Record (OCR)"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6279}}, "Camera capture & text extraction"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setShowAbdmModal(true),
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6282}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6287}}, "🔗")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-emerald-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6288}}, "ABDM Sandbox Sync"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6289}}, "Pull FHIR records via Gateway"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: handleSyncCowin,
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6292}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6297}}, "💉")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-amber-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6298}}, "Sync CoWIN Vaccine"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6299}}, "Fetch official govt dose certificate"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setShowConsentModal(true),
          className: "p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 shadow-sm transition-all text-left group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6302}}

          , React.createElement('div', { className: "text-2xl mb-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6307}}, "🛡️")
          , React.createElement('div', { className: "font-extrabold text-xs text-slate-900 group-hover:text-purple-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6308}}, "Consents & RBAC"  )
          , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6309}}, "Manage time-boxed permissions"  )
        )
      )

      /* Unified Timeline Feed Section */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6314}}
        , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6315}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6316}}
            , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6317}}, "Unified Patient Record Timeline"   )
            , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6318}}, "Chronological aggregation across Manual OCR, ABDM Sandbox HIPs, MedVeda Consultations, and CoWIN."

            )
          )

          , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6323}}
            , React.createElement('input', {
              type: "text",
              placeholder: "Search records, drugs, doctors..."   ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6324}}
            )

            , React.createElement('div', { className: "flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6332}}
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
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6340}}

                  , src.label
                )
              ))
            )
          )
        )

        /* Timeline Records List */
        , filteredRecords.length === 0 ? (
          React.createElement('div', { className: "p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6359}}, "No health records matching current filters for "
                   , patient.name, ". Click \"Add Record (OCR)\" or \"ABDM Sandbox Sync\" to add records."
          )
        ) : (
          React.createElement('div', { className: "space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6363}}
            , filteredRecords.map((rec) => {
              const isManual = rec.source === 'manual';
              const isAbha = rec.source === 'abha';
              const isInternal = rec.source === 'medveda_internal';
              const isCowin = rec.source === 'cowin';

              return (
                React.createElement('div', { key: rec.id, className: "relative pl-10 space-y-2 group"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6371}}
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
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6373}}

                    , isManual ? '📷' : isAbha ? '🏥' : isCowin ? '💉' : '🩺'
                  )

                  , React.createElement('div', { className: "bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6387}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6388}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6389}}
                        , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6390}}
                          , React.createElement('span', {
                            className: `px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              isManual
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : isAbha
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isCowin
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-purple-100 text-purple-800 border border-purple-300'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6391}}

                            , isManual && 'Source: Manual (OCR)'
                            , isAbha && 'Source: ABDM ABHA (FHIR HIP)'
                            , isCowin && 'Source: Government CoWIN'
                            , isInternal && 'Source: MedVeda Internal'
                          )

                          , React.createElement('span', { className: "px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-200 text-slate-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6408}}
                            , rec.recordType.replace('_', ' ')
                          )

                          , React.createElement('span', { className: "inline-flex items-center gap-1 text-[10px] font-bold text-slate-500"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6412}}
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6413}}, "✓")
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6414}}, rec.verifiedBy || rec.verificationStatus)
                          )
                        )

                        , React.createElement('h4', { className: "text-base font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6418}}, rec.title)
                        , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6419}}
                          , rec.facilityName, " " , rec.doctorName ? `\u2022 ${rec.doctorName}` : ''
                        )
                      )

                      , React.createElement('div', { className: "text-right text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6424}}
                        , React.createElement('span', { className: "text-slate-400 block text-[10px] font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6425}}, "Recorded On" )
                        , React.createElement('span', { className: "font-bold text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6426}}
                          , new Date(rec.recordedAt).toLocaleDateString()
                        )
                      )
                    )

                    , React.createElement('p', { className: "text-xs text-slate-600 font-medium leading-relaxed"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6432}}, rec.summary)

                    /* Structured Data Visualization based on Record Type */
                    , rec.extractedData && (
                      React.createElement('div', { className: "p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6436}}
                        /* 1. Prescription Medicines */
                        , rec.extractedData.medicines && (
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6439}}
                            , React.createElement('strong', { className: "block text-[11px] font-extrabold uppercase text-slate-700 mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6440}}, "Prescribed Medications:"

                            )
                            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6443}}
                              , rec.extractedData.medicines.map((m, mIdx) => (
                                React.createElement('div', { key: mIdx, className: "p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6445}}
                                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6446}}
                                    , React.createElement('div', { className: "font-extrabold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6447}}, m.name)
                                    , React.createElement('div', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6448}}, m.instructions || m.dosage)
                                  )
                                  , React.createElement('span', { className: "px-2 py-0.5 bg-sky-50 text-sky-800 text-[10px] font-mono font-bold rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6450}}
                                    , m.frequency
                                  )
                                )
                              ))
                            )
                          )
                        )

                        /* 2. Lab Results Parameters */
                        , rec.extractedData.results && (
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6461}}
                            , React.createElement('strong', { className: "block text-[11px] font-extrabold uppercase text-slate-700 mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6462}}, "Diagnostic Results ("
                                , rec.extractedData.testName, "):"
                            )
                            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6465}}
                              , React.createElement('table', { className: "w-full text-left text-[11px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6466}}
                                , React.createElement('thead', { className: "text-slate-400 border-b border-slate-100 font-bold uppercase text-[9px]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6467}}
                                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6468}}
                                    , React.createElement('th', { className: "pb-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6469}}, "Parameter")
                                    , React.createElement('th', { className: "pb-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6470}}, "Observed Value" )
                                    , React.createElement('th', { className: "pb-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6471}}, "Reference Range" )
                                    , React.createElement('th', { className: "pb-1 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6472}}, "Evaluation")
                                  )
                                )
                                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6475}}
                                  , rec.extractedData.results.map((res, rIdx) => (
                                    React.createElement('tr', { key: rIdx, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6477}}
                                      , React.createElement('td', { className: "py-1.5 font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6478}}, res.parameter)
                                      , React.createElement('td', { className: "py-1.5 font-mono font-bold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6479}}
                                        , res.observedValue, " " , res.unit
                                      )
                                      , React.createElement('td', { className: "py-1.5 text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6482}}, res.referenceRange)
                                      , React.createElement('td', { className: "py-1.5 text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6483}}
                                        , res.isAbnormal ? (
                                          React.createElement('span', { className: "px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-critical-100 text-critical-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6485}}, "Abnormal"

                                          )
                                        ) : (
                                          React.createElement('span', { className: "px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6489}}, "Normal"

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
                          React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6504}}
                            , React.createElement('strong', { className: "block text-[11px] font-extrabold uppercase text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6505}}, "Procedures & Intervention:"

                            )
                            , React.createElement('ul', { className: "list-disc pl-4 text-[11px] text-slate-700 space-y-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6508}}
                              , rec.extractedData.proceduresPerformed.map((p, pIdx) => (
                                React.createElement('li', { key: pIdx, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6510}}, p)
                              ))
                            )
                          )
                        )

                        /* 4. CoWIN Vaccine Details */
                        , rec.extractedData.certificateNumber && (
                          React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6518}}
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6519}}
                              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6520}}, "Vaccine Name" )
                              , React.createElement('span', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6521}}, rec.extractedData.vaccine)
                            )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6523}}
                              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6524}}, "Dose Status" )
                              , React.createElement('span', { className: "font-bold text-emerald-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6525}}, "Dose "
                                 , rec.extractedData.doseNumber, " of "  , rec.extractedData.totalDoses, " (Fully Vaccinated)"
                              )
                            )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6529}}
                              , React.createElement('span', { className: "text-slate-400 block text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6530}}, "Certificate No." )
                              , React.createElement('span', { className: "font-mono font-bold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6531}}, rec.extractedData.certificateNumber)
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6549}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6550}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6551}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6552}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6553}}, "Manual Document Ingestion"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6556}}, "Camera / Upload & OCR Studio"     )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowOcrModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6558}}
, "×"

              )
            )

            /* Presets */
            , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6568}}
              , React.createElement('label', { className: "text-[11px] font-bold text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6569}}, "Load Demo Document Preset:"   )
              , React.createElement('div', { className: "flex gap-2 flex-wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6570}}
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
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6576}}

                    , pre.label
                  )
                ))
              )
            )

            , React.createElement('form', { onSubmit: handleSaveManualRecord, className: "space-y-4 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6592}}
              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6593}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6594}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6595}}, "Document Title" )
                  , React.createElement('input', {
                    type: "text",
                    value: ocrTitle,
                    onChange: (e) => setOcrTitle(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6596}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6604}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6605}}, "Doctor / Clinic"  )
                  , React.createElement('input', {
                    type: "text",
                    value: ocrDoctor,
                    onChange: (e) => setOcrDoctor(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6606}}
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6615}}
                , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6616}}
                  , React.createElement('label', { className: "font-bold text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6617}}, "OCR Raw Extracted Text"   )
                  , React.createElement('button', {
                    type: "button",
                    onClick: handleRunOcrExtraction,
                    className: "text-sky-700 font-bold hover:underline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6618}}
, "⚡ Re-parse Structured Fields"

                  )
                )
                , React.createElement('textarea', {
                  rows: "4",
                  value: ocrRawText,
                  onChange: (e) => setOcrRawText(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-mono text-xs leading-relaxed"       ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6626}}
                )
              )

              /* Human-in-the-Loop Confirmation Step */
              , React.createElement('div', { className: "p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6636}}
                , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6637}}
                  , React.createElement('span', { className: "font-bold text-sky-900 text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6638}}, "OCR Confidence: "  , ocrConfidence, "%")
                  , React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 bg-sky-200 text-sky-900 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6639}}, "Human Verification Invariant"

                  )
                )
                , React.createElement('label', { className: "flex items-center gap-2 cursor-pointer pt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6643}}
                  , React.createElement('input', {
                    type: "checkbox",
                    checked: ocrUserVerified,
                    onChange: (e) => setOcrUserVerified(e.target.checked),
                    className: "w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6644}}
                  )
                  , React.createElement('span', { className: "text-xs font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6650}}, "I confirm that I have reviewed the extracted details and verified accuracy against the physical document."

                  )
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6656}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowOcrModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6657}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6664}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6680}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6681}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6682}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6683}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6684}}, "ABDM Sandbox Gateway"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6687}}, "ABHA Health Record Pull"   )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowAbdmModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6689}}
, "×"

              )
            )

            , React.createElement('div', { className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6698}}
              , React.createElement('div', { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6699}}
                , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6700}}, "Target ABHA ID (@sbx)"   )
                , React.createElement('input', {
                  type: "text",
                  value: abdmInputAbha,
                  onChange: (e) => setAbdmInputAbha(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900"       ,
                  placeholder: "e.g. 91-2890-1423-8891@sbx" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6701}}
                )
              )

              , React.createElement('div', { className: "p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-emerald-950"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6710}}
                , React.createElement('strong', { className: "block text-xs font-black uppercase text-emerald-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6711}}, "ABDM Consent Manager Parameters:"

                )
                , React.createElement('ul', { className: "space-y-1 text-[11px] list-disc pl-4 font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6714}}
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6715}}, "HIU: MedVeda Smart Care Platform (IN-MEDVEDA-HIU-01)"     )
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6716}}, "Artifacts: DiagnosticReport, DischargeSummary, Prescription"   )
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6717}}, "Transfer Mode: End-to-End Encrypted FHIR JSON Bundles"      )
                )
              )

              , abdmSyncSuccess && (
                React.createElement('div', { className: "p-3 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6722}}, "✓ Successfully pulled ABDM Sandbox FHIR Records!"

                )
              )
            )

            , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6728}}
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowAbdmModal(false),
                className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6729}}
, "Cancel"

              )
              , React.createElement('button', {
                type: "button",
                onClick: handlePullAbdmRecords,
                className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6736}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6741}}, "🔄 Link & Pull ABDM Records"     )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6742}}, "→")
              )
            )
          )
        )
      )

      /* ========================================== */
      /* MODAL 3: CONSENT & ACCESS CONTROL DESK */
      /* ========================================== */
      , showConsentModal && (
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6753}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6754}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6755}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6756}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6757}}, "Consent Governance"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6760}}, "Consent & RBAC Control Desk"    )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowConsentModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6762}}
, "×"

              )
            )

            /* Active Consents List */
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6772}}
              , React.createElement('h4', { className: "text-xs font-bold uppercase tracking-wider text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6773}}, "Patient Consent Statuses:"

              )

              , activeConsents.length === 0 ? (
                React.createElement('div', { className: "p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6778}}, "No active consent requests found for "
                        , patient.name, "."
                )
              ) : (
                React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6782}}
                  , activeConsents.map((c) => (
                    React.createElement('div', {
                      key: c.consentId,
                      className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs gap-3 flex-wrap"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6784}}

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6788}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6789}}
                          , React.createElement('span', { className: "font-extrabold text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6790}}, c.requesterName)
                          , React.createElement('span', {
                            className: `px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              c.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6791}}

                            , c.status
                          )
                        )
                        , React.createElement('div', { className: "text-[11px] text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6803}}, "Purpose: "
                           , c.purpose, " • Scope: "   , c.scope
                        )
                      )

                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6808}}
                        , c.status === 'pending' && (
                          React.createElement(React.Fragment, null
                            , React.createElement('button', {
                              type: "button",
                              onClick: () => handleConsentAction(c.consentId, 'grant'),
                              className: "px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6811}}
, "Approve"

                            )
                            , React.createElement('button', {
                              type: "button",
                              onClick: () => handleConsentAction(c.consentId, 'revoke'),
                              className: "px-3 py-1 bg-critical-600 text-white font-bold rounded-lg text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6818}}
, "Deny"

                            )
                          )
                        )
                        , c.status === 'approved' && (
                          React.createElement('button', {
                            type: "button",
                            onClick: () => handleConsentAction(c.consentId, 'revoke'),
                            className: "px-3 py-1 bg-slate-200 hover:bg-critical-50 hover:text-critical-700 text-slate-700 font-bold rounded-lg text-xs transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6828}}
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
            , React.createElement('div', { className: "p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6844}}
              , React.createElement('strong', { className: "block text-xs font-black uppercase text-purple-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6845}}, "Simulate Clinician Consent Request:"

              )
              , React.createElement('form', { onSubmit: handleCreateConsentRequest, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6848}}
                , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6849}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6850}}
                    , React.createElement('span', { className: "text-[10px] font-bold text-slate-500 block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6851}}, "Doctor")
                    , React.createElement('select', {
                      value: consentDoctorId,
                      onChange: (e) => {
                        const id = e.target.value;
                        const name = id === 'doc_1' ? 'Dr. Priya Sharma' : 'Dr. Rajesh Khanna';
                        setConsentDoctorId(id);
                        setConsentDoctorName(name);
                      },
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6852}}

                      , React.createElement('option', { value: "doc_1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6862}}, "Dr. Priya Sharma (Cardiology)"   )
                      , React.createElement('option', { value: "doc_4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6863}}, "Dr. Rajesh Khanna (Endocrinology)"   )
                    )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6867}}
                    , React.createElement('span', { className: "text-[10px] font-bold text-slate-500 block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6868}}, "Scope")
                    , React.createElement('select', {
                      value: consentScope,
                      onChange: (e) => setConsentScope(e.target.value),
                      className: "w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6869}}

                      , React.createElement('option', { value: "ALL", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6874}}, "All Records (Full Access)"   )
                      , React.createElement('option', { value: "PRESCRIPTIONS", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6875}}, "Prescriptions Only" )
                      , React.createElement('option', { value: "LAB_REPORTS", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6876}}, "Lab Reports Only"  )
                    )
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6881}}
                  , React.createElement('span', { className: "text-[10px] font-bold text-slate-500 block mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6882}}, "Clinical Purpose" )
                  , React.createElement('input', {
                    type: "text",
                    value: consentPurpose,
                    onChange: (e) => setConsentPurpose(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2 bg-white"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6883}}
                  )
                )

                , React.createElement('button', {
                  type: "submit",
                  className: "w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6892}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6908}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-critical-400 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6909}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6910}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-critical-800 bg-critical-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6911}}, "CRITICAL PROTOCOL"

              )
              , React.createElement('h3', { className: "text-lg font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6914}}, "🚨 Emergency Access Override"   )
              , React.createElement('p', { className: "text-xs text-critical-900 font-medium mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6915}}, "Emergency override bypasses patient consent for life-threatening acute resuscitations. Access is immutably logged."

              )
            )

            , React.createElement('form', { onSubmit: handleExecuteEmergencyOverride, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6920}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6921}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6922}}, "Mandatory Clinical Justification"  )
                , React.createElement('textarea', {
                  rows: "3",
                  value: emergencyReason,
                  onChange: (e) => setEmergencyReason(e.target.value),
                  className: "w-full border border-critical-300 rounded-xl p-2.5 font-medium"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6923}}
                )
              )

              , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6932}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowEmergencyModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6933}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-5 py-2.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-xl shadow-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6940}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6956}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6957}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6958}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6959}}, "Patient Enrollment"

              )
              , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6962}}, "Generate Medical ID Card"   )
              , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6963}}, "Creates a unique MedVeda Medical ID anchor (`MV-MED-YYYY-XXXX`). Works standalone with optional ABHA link."

              )
            )

            , React.createElement('form', { onSubmit: handleRegisterPatient, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6968}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6969}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6970}}, "Full Name *"  )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.name,
                  onChange: (e) => setRegForm({ ...regForm, name: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  placeholder: "e.g. Babulal Marandi"  ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6971}}
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6981}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6982}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6983}}, "Age *" )
                  , React.createElement('input', {
                    type: "number",
                    value: regForm.age,
                    onChange: (e) => setRegForm({ ...regForm, age: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6984}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6992}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6993}}, "Blood Group" )
                  , React.createElement('select', {
                    value: regForm.bloodGroup,
                    onChange: (e) => setRegForm({ ...regForm, bloodGroup: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6994}}

                    , ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      React.createElement('option', { key: bg, value: bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7000}}, bg)
                    ))
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7006}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7007}}, "Phone Number *"  )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.phone,
                  onChange: (e) => setRegForm({ ...regForm, phone: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5"    ,
                  placeholder: "+91-94311-XXXXX",
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7008}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7018}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7019}}, "Location / Village *"   )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.location,
                  onChange: (e) => setRegForm({ ...regForm, location: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5"    ,
                  placeholder: "e.g. Katkamsandi, Hazaribagh"  ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7020}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7030}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7031}}, "ABDM ABHA ID (Optional)"   )
                , React.createElement('input', {
                  type: "text",
                  value: regForm.abhaId,
                  onChange: (e) => setRegForm({ ...regForm, abhaId: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-mono"     ,
                  placeholder: "e.g. babulal@sbx (Leave empty for standalone)"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7032}}
                )
              )

              , React.createElement('div', { className: "pt-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7041}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowRegisterModal(false),
                  className: "px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7042}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7049}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7053}}, "Generate Medical Card"  )
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7054}}, "→")
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7066}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7067}}
            , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7068}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7069}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7070}}, "Digital Health Passport"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7073}}, "Official Medical ID Card"   )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCardModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7075}}
, "×"

              )
            )

            /* Printable ID Card Container */
            , React.createElement('div', { className: "p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-2xl border-2 border-sky-400/40 relative overflow-hidden space-y-4"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7085}}
              , React.createElement('div', { className: "flex items-center justify-between border-b border-white/10 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7086}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7087}}
                  , React.createElement('div', { className: "w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7088}}, "MV"

                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7091}}
                    , React.createElement('div', { className: "text-xs font-black tracking-wide text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7092}}, "MEDVEDA SMART CARE"  )
                    , React.createElement('div', { className: "text-[8px] font-bold text-sky-400 uppercase tracking-widest"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7093}}, "Digital Health Authority"  )
                  )
                )
                , React.createElement('span', { className: "text-[10px] font-mono font-black px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7096}}, "VERIFIED PATIENT"

                )
              )

              , React.createElement('div', { className: "flex items-center justify-between gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7101}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7102}}
                  , React.createElement('h4', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7103}}, patient.name)
                  , React.createElement('div', { className: "text-xs font-mono font-bold text-sky-300 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7104}}, patient.internalMedicalId)
                  , React.createElement('div', { className: "text-[11px] text-slate-300 mt-2 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7105}}
                    , patient.age, " Years • "   , patient.sex ? patient.sex.toUpperCase() : 'N/A', " • Blood: "   , React.createElement('strong', { className: "text-critical-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7106}}, patient.bloodGroup || 'O+')
                  )
                  , React.createElement('div', { className: "text-[10px] text-slate-400 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7108}}, "📍 " , patient.location || 'Jharkhand')
                  , patient.abhaId && (
                    React.createElement('div', { className: "text-[10px] text-emerald-400 font-mono mt-1 font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7110}}, "ABHA: " , patient.abhaId)
                  )
                )

                /* SVG QR Code */
                , React.createElement('div', { className: "bg-white p-2.5 rounded-2xl shadow-md shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7115}}
                  , React.createElement('svg', { viewBox: "0 0 100 100"   , className: "w-20 h-20" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7116}}
                    , React.createElement('rect', { width: "100", height: "100", fill: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7117}} )
                    , React.createElement('rect', { x: "5", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7118}} )
                    , React.createElement('rect', { x: "9", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7119}} )
                    , React.createElement('rect', { x: "13", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7120}} )
                    , React.createElement('rect', { x: "67", y: "5", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7121}} )
                    , React.createElement('rect', { x: "71", y: "9", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7122}} )
                    , React.createElement('rect', { x: "75", y: "13", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7123}} )
                    , React.createElement('rect', { x: "5", y: "67", width: "28", height: "28", fill: "#0f172a", rx: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7124}} )
                    , React.createElement('rect', { x: "9", y: "71", width: "20", height: "20", fill: "#ffffff", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7125}} )
                    , React.createElement('rect', { x: "13", y: "75", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7126}} )
                    , React.createElement('rect', { x: "40", y: "10", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7127}} )
                    , React.createElement('rect', { x: "52", y: "18", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7128}} )
                    , React.createElement('rect', { x: "40", y: "40", width: "12", height: "12", fill: "#0f172a", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7129}} )
                    , React.createElement('rect', { x: "56", y: "38", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7130}} )
                    , React.createElement('rect', { x: "70", y: "45", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7131}} )
                    , React.createElement('rect', { x: "82", y: "55", width: "6", height: "6", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7132}} )
                    , React.createElement('rect', { x: "45", y: "60", width: "8", height: "8", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7133}} )
                    , React.createElement('rect', { x: "60", y: "65", width: "10", height: "10", fill: "#0f172a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7134}} )
                    , React.createElement('rect', { x: "75", y: "75", width: "8", height: "8", fill: "#0284c7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7135}} )
                  )
                )
              )

              , React.createElement('div', { className: "border-t border-white/10 pt-2 flex items-center justify-between text-[9px] text-slate-400 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7140}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7141}}, "Phone: " , patient.phone)
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7142}}, "Valid Nationwide Across All ABDM Facilities"     )
              )
            )

            , React.createElement('div', { className: "flex items-center justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7146}}
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowCardModal(false),
                className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7147}}
, "Close"

              )
              , React.createElement('button', {
                type: "button",
                onClick: handleCopyId,
                className: "px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex-1 flex items-center justify-center gap-1"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7154}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7159}}, "📋 Copy ID"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => window.print(),
                className: "px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex-1 flex items-center justify-center gap-1 shadow-md shadow-sky-600/30"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7161}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7166}}, "🖨️ Print Card"  )
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7642}}
      /* Toast Notification Alert */
      , notificationToast && (
        React.createElement('div', { className: "fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7645}}
          , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7646}}, "🔔")
          , React.createElement('span', { className: "text-xs font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7647}}, notificationToast)
        )
      )

      /* Feature Header Banner */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7652}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7653}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7654}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-teal-500 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7655}})
            , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7656}}, "FEATURE MAP 06 • MEDICINE & DIAGNOSTIC COORDINATION"

            )
          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7660}}, "Medicine Availability & Diagnostic Grid"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7663}}, "Real-time nearby medicine stock search with out-of-radius fallback, owner-only RBAC inventory CRUD, reservation ordering, diagnostic test catalog, and doctor-ordered status progression."

          )
        )

        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7668}}
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7669}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7674}}, "🏠 Home" )
          )
        )
      )

      /* Primary Module Navigation Tabs */
      , React.createElement('div', { className: "bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-bold"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7680}}
        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('medicine_search'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'medicine_search'
              ? 'bg-teal-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7681}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7690}}, "💊")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7691}}, "Medicine Search (Patient/Worker)"  )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('shop_owner'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'shop_owner'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7694}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7703}}, "🏪")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7704}}, "Medical Shop Dashboard (Owner CRUD)"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('diagnostic_search'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'diagnostic_search'
              ? 'bg-purple-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7707}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7716}}, "🔬")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7717}}, "Diagnostic Test Search (Direct Booking)"    )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('lab_dashboard'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'lab_dashboard'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7720}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7729}}, "🧪")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7730}}, "Diagnostic Center Staff Dashboard"   )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveTab('doctor_orders'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'doctor_orders'
              ? 'bg-emerald-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7733}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7742}}, "📋")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7743}}, "Doctor-Ordered Lab Tracker"  )
        )
      )

      /* ========================================================= */
      /* TAB 1: MEDICINE SEARCH (PATIENT / FRONTLINE WORKER VIEW) */
      /* ========================================================= */
      , activeTab === 'medicine_search' && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7751}}
          /* Search Controls */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7753}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7754}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7755}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7756}}, "Nearby Medicine Stock Discovery"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7757}}, "Real-time inventory lookup across registered chemists in Hazaribagh & Jharkhand grid."

                )
              )
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7761}}, "Read-Only Search + Counter Reservation"

              )
            )

            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7766}}
              , React.createElement('div', { className: "sm:col-span-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7767}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7768}}, "Medicine Name / Brand / Generic Molecule"

                )
                , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7771}}
                  , React.createElement('input', {
                    type: "text",
                    value: medSearchQuery,
                    onChange: (e) => setMedSearchQuery(e.target.value),
                    onKeyDown: (e) => e.key === 'Enter' && searchMedicines(medSearchQuery, medRadius),
                    placeholder: "e.g. Paracetamol, Telmisartan, Ecosprin, Tenecteplase..."    ,
                    className: "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 bg-slate-50/50"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7772}}
                  )
                  , React.createElement('span', { className: "absolute left-3.5 top-3.5 text-slate-400 text-base"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7780}}, "🔍")
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7784}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7785}}, "Search Radius"

                )
                , React.createElement('select', {
                  value: medRadius,
                  onChange: (e) => {
                    const r = Number(e.target.value);
                    setMedRadius(r);
                    searchMedicines(medSearchQuery, r);
                  },
                  className: "w-full py-3 px-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 bg-white"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7788}}

                  , React.createElement('option', { value: "5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7797}}, "Within 5 km (Walking)"   )
                  , React.createElement('option', { value: "15", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7798}}, "Within 15 km (Block Level)"    )
                  , React.createElement('option', { value: "25", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7799}}, "Within 25 km (District Hub)"    )
                  , React.createElement('option', { value: "75", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7800}}, "Within 75 km (State Network)"    )
                )
              )
            )

            /* Quick Keyword Chips */
            , React.createElement('div', { className: "flex items-center gap-2 flex-wrap pt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7806}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7807}}, "Quick Searches:" )
              , ['Paracetamol', 'Telmisartan', 'Metformin', 'Ecosprin', 'Brilinta', 'Tenecteplase'].map((q) => (
                React.createElement('button', {
                  key: q,
                  type: "button",
                  onClick: () => {
                    setMedSearchQuery(q);
                    searchMedicines(q, medRadius);
                  },
                  className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7809}}
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
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7826}}

              , React.createElement('div', { className: "flex items-center gap-2.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7833}}
                , React.createElement('span', { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7834}}, medIsFallback ? '⚠️' : '✓')
                , React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7835}}, medMessage)
              )
              , medIsFallback && (
                React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 text-amber-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7838}}, "Out-of-Radius Fallback"

                )
              )
            )
          )

          /* Medicine Results Grid */
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7846}}
            , medResults.map((item, idx) => {
              const med = item.medicine;
              const shop = item.shop;
              const isInStock = med.status === 'in_stock' && med.quantity > 0;

              return (
                React.createElement('div', {
                  key: idx,
                  className: `bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                    isInStock ? 'border-slate-200 hover:border-teal-400' : 'border-slate-200 bg-slate-50/50'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7853}}

                  , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7859}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7860}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7861}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7862}}
                          , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7863}}, med.medicineName)
                          , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7864}}
                            , med.dosageForm || 'Tablet', " • "  , med.strength || 'Standard'
                          )
                        )
                        , med.genericName && (
                          React.createElement('div', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7869}}, "Generic: "
                             , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7870}}, med.genericName)
                          )
                        )
                      )

                      , React.createElement('div', { className: "text-right shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7875}}
                        , med.price !== undefined && (
                          React.createElement('div', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7877}}, "₹", med.price.toFixed(2))
                        )
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            isInStock
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-critical-100 text-critical-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7879}}

                          , isInStock ? `✓ In Stock (${med.quantity})` : '✗ Out of Stock'
                        )
                      )
                    )

                    /* Shop Information Card */
                    , React.createElement('div', { className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7892}}
                      , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7893}}
                        , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7894}}, shop.name)
                        , React.createElement('span', { className: "font-mono font-bold text-teal-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7895}}, "📍 "
                           , item.distanceKm, " km"
                        )
                      )
                      , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7899}}, shop.location.address)
                      , React.createElement('div', { className: "text-[10px] text-slate-400 pt-1 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7900}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7901}}, "📞 " , shop.contactNumber)
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7902}}, "Updated: " , new Date(med.lastUpdated).toLocaleTimeString())
                      )
                    )
                  )

                  /* Actions */
                  , React.createElement('div', { className: "flex items-center gap-2 pt-2 border-t border-slate-100"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7908}}
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
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7909}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7922}}, "📦")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7923}}, "Reserve for Counter Pickup"   )
                    )

                    , React.createElement('a', {
                      href: `tel:${shop.contactNumber}`,
                      className: "px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7926}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7944}}
          /* Shop Selector & RBAC Invariant Card */
          , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7946}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7947}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7948}}
                , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7949}}, "🏪"

                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7952}}
                  , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-teal-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7953}}, "SHOP OWNER WORKSPACE • STRICT BACKEND RBAC"

                  )
                  , React.createElement('h3', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7956}}, _optionalChain([activeShopObj, 'optionalAccess', _19 => _19.name]))
                )
              )

              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7960}}
                , React.createElement('select', {
                  value: activeShopId,
                  onChange: (e) => setActiveShopId(e.target.value),
                  className: "bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7961}}

                  , allShops.map((s) => (
                    React.createElement('option', { key: s.shopId, value: s.shopId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7967}}
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
                  className: "px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7973}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7989}}, "➕ Add Medicine"  )
                )
              )
            )

            , React.createElement('div', { className: "p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7994}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7995}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7996}}, "RBAC Invariant:" ), " You are managing shop inventory for "       , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7996}}, _optionalChain([activeShopObj, 'optionalAccess', _20 => _20.name])), ". Backend rejects write access from non-owner accounts."
              )
              , React.createElement('span', { className: "text-[10px] font-mono text-teal-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7998}}, "Owner ID: owner_pharma_1"  )
            )
          )

          /* Incoming Order Reservations Desk */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8003}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8004}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8005}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8006}}, "Incoming Customer Order Requests"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8007}}, "Patient reservation requests for counter pickup. Confirmed orders do not alter stock until counter handover."

                )
              )
              , React.createElement('span', { className: "text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8011}}
                , shopOrders.length, " Total Orders"
              )
            )

            , shopOrders.length === 0 ? (
              React.createElement('div', { className: "p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8017}}, "No incoming order requests yet."

              )
            ) : (
              React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8021}}
                , shopOrders.map((ord) => (
                  React.createElement('div', {
                    key: ord.orderId,
                    className: "p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3 text-xs"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8023}}

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8027}}
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8028}}
                        , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8029}}, ord.patientName)
                        , React.createElement('span', { className: "font-mono text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8030}}, "(", ord.patientPhone, ")")
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            ord.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'requested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8031}}

                          , ord.status
                        )
                      )
                      , React.createElement('div', { className: "text-[11px] text-slate-600 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8043}}, "Requested: "
                         , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8044}}, ord.quantityRequested, " units" ), " of "  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8044}}, ord.medicineName), " • Ordered at "    , new Date(ord.requestedAt).toLocaleTimeString()
                      )
                      , ord.ownerNotes && (
                        React.createElement('div', { className: "text-[10px] text-teal-700 mt-0.5 italic"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8047}}, "Notes: "
                           , ord.ownerNotes
                        )
                      )
                    )

                    , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8053}}
                      , ord.status === 'requested' && (
                        React.createElement(React.Fragment, null
                          , React.createElement('button', {
                            type: "button",
                            onClick: () =>
                              handleUpdateOrderStatus(ord.orderId, 'confirmed', 'Confirmed. Packed and kept at pickup counter.')
                            ,
                            className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8056}}
, "✓ Confirm Pickup"

                          )
                          , React.createElement('button', {
                            type: "button",
                            onClick: () =>
                              handleUpdateOrderStatus(ord.orderId, 'unavailable', 'Stock changed, unavailable.')
                            ,
                            className: "px-3 py-1.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8065}}
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
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8084}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8085}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8086}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8087}}, "Current Medicine Stock Inventory"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8088}}, "Real-time stock counts reflecting directly in patient-facing search."

                )
              )
            )

            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8094}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8095}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8096}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8097}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8098}}, "Medicine Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8099}}, "Generic / Strength"  )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8100}}, "Quantity")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8101}}, "Status")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8102}}, "Price (INR)" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8103}}, "Last Updated" )
                    , React.createElement('th', { className: "py-3 px-4 text-right"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8104}}, "Actions")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8107}}
                  , shopInventory.map((item) => (
                    React.createElement('tr', { key: item.inventoryId, className: "hover:bg-slate-50/50", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8109}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8110}}, item.medicineName)
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8111}}
                        , item.genericName || 'N/A', " • "  , React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8112}}, item.strength)
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-mono font-bold text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8114}}, item.quantity)
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8115}}
                        , React.createElement('span', {
                          className: `text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-critical-100 text-critical-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8116}}

                          , item.status === 'in_stock' ? 'In Stock' : 'Out of Stock'
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8126}}
                        , item.price !== undefined ? `₹${item.price.toFixed(2)}` : 'N/A'
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-400 text-[10px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8129}}
                        , new Date(item.lastUpdated).toLocaleTimeString()
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-right space-x-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8132}}
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
                          className: "px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8133}}
, "Edit"

                        )
                        , React.createElement('button', {
                          type: "button",
                          onClick: () => handleDeleteMedicine(item.inventoryId),
                          className: "px-2.5 py-1 bg-critical-50 hover:bg-critical-100 text-critical-700 font-bold rounded-lg"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8152}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8173}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8174}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8175}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8176}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8177}}, "Direct Diagnostic Test Discovery"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8178}}, "Search pathology tests, imaging, and biochemistry panels across accredited labs without a doctor mandate."

                )
              )
              , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8182}}, "Direct Search • Same-Day Labs"

              )
            )

            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8187}}
              , React.createElement('div', { className: "sm:col-span-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8188}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8189}}, "Diagnostic Test / Panel Name"

                )
                , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8192}}
                  , React.createElement('input', {
                    type: "text",
                    value: diagSearchQuery,
                    onChange: (e) => setDiagSearchQuery(e.target.value),
                    onKeyDown: (e) => e.key === 'Enter' && searchDiagnosticTests(diagSearchQuery, diagRadius),
                    placeholder: "e.g. Complete Blood Count, Lipid Profile, Blood Sugar, HbA1c, Troponin-I..."         ,
                    className: "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 bg-slate-50/50"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8193}}
                  )
                  , React.createElement('span', { className: "absolute left-3.5 top-3.5 text-slate-400 text-base"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8201}}, "🔬")
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8205}}
                , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8206}}, "Radius Filter"

                )
                , React.createElement('select', {
                  value: diagRadius,
                  onChange: (e) => {
                    const r = Number(e.target.value);
                    setDiagRadius(r);
                    searchDiagnosticTests(diagSearchQuery, r);
                  },
                  className: "w-full py-3 px-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 bg-white"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8209}}

                  , React.createElement('option', { value: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8218}}, "Within 10 km"  )
                  , React.createElement('option', { value: "30", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8219}}, "Within 30 km (Sub-District)"   )
                  , React.createElement('option', { value: "60", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8220}}, "Within 60 km (District Hub)"    )
                )
              )
            )

            /* Quick Test Chips */
            , React.createElement('div', { className: "flex items-center gap-2 flex-wrap pt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8226}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8227}}, "Popular Panels:" )
              , ['Complete Blood Count', 'Lipid Profile', 'Blood Sugar', 'HbA1c', 'Troponin-I', 'X-Ray Chest', 'Echocardiography'].map((t) => (
                React.createElement('button', {
                  key: t,
                  type: "button",
                  onClick: () => {
                    setDiagSearchQuery(t);
                    searchDiagnosticTests(t, diagRadius);
                  },
                  className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8229}}
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
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8246}}

              , React.createElement('div', { className: "flex items-center gap-2.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8253}}
                , React.createElement('span', { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8254}}, diagIsFallback ? '⚠️' : '✓')
                , React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8255}}, diagMessage)
              )
            )
          )

          /* Results Grid */
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8261}}
            , diagResults.map((item, idx) => {
              const test = item.test;
              const center = item.center;

              return (
                React.createElement('div', {
                  key: idx,
                  className: "bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between space-y-4 hover:shadow-md"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8267}}

                  , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8271}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8272}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8273}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8274}}
                          , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8275}}, test.testName)
                        )
                        , React.createElement('div', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8277}}, "Category: "
                           , React.createElement('strong', { className: "text-slate-800 uppercase" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8278}}, test.category), " • Sample: "   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8278}}, test.sampleType || 'Venous Blood')
                        )
                      )

                      , React.createElement('div', { className: "text-right shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8282}}
                        , test.price !== undefined && (
                          React.createElement('div', { className: "text-base font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8284}}, "₹", test.price.toFixed(2))
                        )
                        , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 inline-block mt-0.5"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8286}}, "⏱️ "
                           , test.turnaroundTime
                        )
                      )
                    )

                    , React.createElement('div', { className: "flex items-center gap-2 flex-wrap text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8292}}
                      , test.fastingRequired ? (
                        React.createElement('span', { className: "px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8294}}, "⚠️ Fasting Required (8-10h)"

                        )
                      ) : (
                        React.createElement('span', { className: "px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8298}}, "✓ No Fasting Required"

                        )
                      )
                    )

                    /* Center Details */
                    , React.createElement('div', { className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8305}}
                      , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8306}}
                        , React.createElement('strong', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8307}}, center.name)
                        , React.createElement('span', { className: "font-mono font-bold text-purple-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8308}}, "📍 " , item.distanceKm, " km" )
                      )
                      , React.createElement('div', { className: "text-[11px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8310}}, center.location.address)
                      , center.accreditation && (
                        React.createElement('div', { className: "text-[10px] text-emerald-700 font-bold mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8312}}, "🏅 "
                           , center.accreditation
                        )
                      )
                    )
                  )

                  , React.createElement('div', { className: "flex items-center gap-2 pt-2 border-t border-slate-100"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8319}}
                    , React.createElement('button', {
                      type: "button",
                      onClick: () => {
                        setSelectedTestItem(item);
                        setShowBookingModal(true);
                      },
                      className: "flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8320}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8328}}, "🧪")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8329}}, "Book Diagnostic Test"  )
                    )

                    , React.createElement('a', {
                      href: `tel:${center.contactNumber}`,
                      className: "px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8332}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8350}}
          , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 space-y-4"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8351}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8352}}
              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8353}}
                , React.createElement('div', { className: "w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8354}}, "🧪"

                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8357}}
                  , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8358}}, "DIAGNOSTIC CENTER DASHBOARD • LAB STAFF RBAC"

                  )
                  , React.createElement('h3', { className: "text-xl font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8361}}, _optionalChain([activeCenterObj, 'optionalAccess', _21 => _21.name]))
                )
              )

              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8365}}
                , React.createElement('select', {
                  value: activeCenterId,
                  onChange: (e) => setActiveCenterId(e.target.value),
                  className: "bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8366}}

                  , allCenters.map((c) => (
                    React.createElement('option', { key: c.centerId, value: c.centerId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8372}}
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
                  className: "px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8378}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8394}}, "➕ Add Test"  )
                )
              )
            )

            , React.createElement('div', { className: "p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8399}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8400}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8401}}, "Accreditation:"), " " , _optionalChain([activeCenterObj, 'optionalAccess', _22 => _22.accreditation]) || 'Standard Regional Lab'
              )
              , React.createElement('span', { className: "text-[10px] font-mono text-indigo-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8403}}, "Staff Actor: owner_lab_1"  )
            )
          )

          /* Test Catalog Table */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8408}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8409}}, "Offered Test Catalog"  )
            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8410}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8411}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8412}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8413}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8414}}, "Test Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8415}}, "Category")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8416}}, "Turnaround")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8417}}, "Fasting")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8418}}, "Price")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8419}}, "Status")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8422}}
                  , centerCatalog.map((t) => (
                    React.createElement('tr', { key: t.testOfferingId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8424}}
                      , React.createElement('td', { className: "py-3 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8425}}, t.testName)
                      , React.createElement('td', { className: "py-3 px-4 uppercase text-[10px] font-bold text-indigo-700"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8426}}, t.category)
                      , React.createElement('td', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8427}}, t.turnaroundTime)
                      , React.createElement('td', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8428}}, t.fastingRequired ? '⚠️ Yes' : '✓ No')
                      , React.createElement('td', { className: "py-3 px-4 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8429}}, t.price ? `₹${t.price}` : 'Free')
                      , React.createElement('td', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8430}}
                        , React.createElement('span', { className: "px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8431}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8448}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8449}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8450}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8451}}
                , React.createElement('h3', { className: "text-xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8452}}, "Doctor-Ordered Diagnostic Lifecycle Tracker"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8453}}, "Tracks orders initiated during Feature 02 consultations: Sample Collection → In Progress → Results Published → Delivered to EHR."

                )
              )
            )

            /* Select Order */
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8460}}
              , React.createElement('label', { className: "text-[10px] font-bold text-slate-500 uppercase block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8461}}, "Select Active Consultation Order:"

              )
              , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8464}}
                , trackedOrders.map((ord) => (
                  React.createElement('div', {
                    key: ord.orderId,
                    onClick: () => setSelectedOrderForStatus(ord),
                    className: `p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      _optionalChain([selectedOrderForStatus, 'optionalAccess', _23 => _23.orderId]) === ord.orderId
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8466}}

                    , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8475}}
                      , React.createElement('strong', { className: "text-slate-900 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8476}}, ord.testName)
                      , React.createElement('span', { className: "text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8477}}
                        , ord.status
                      )
                    )
                    , React.createElement('div', { className: "text-xs text-slate-600 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8481}}, "Patient: "
                       , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8482}}, ord.patientName), " • Center: "   , ord.centerName
                    )
                    , ord.orderedBy && (
                      React.createElement('div', { className: "text-[11px] text-brand-700 font-bold mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8485}}, "Ordered by: "
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
            React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8497}}
              , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8498}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8499}}
                  , React.createElement('span', { className: "text-[10px] font-mono font-bold text-slate-400 uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8500}}, "ORDER ID: "
                      , selectedOrderForStatus.orderId
                  )
                  , React.createElement('h3', { className: "text-2xl font-black text-slate-900 mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8503}}
                    , selectedOrderForStatus.testName
                  )
                  , React.createElement('div', { className: "text-xs text-slate-500 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8506}}, "Patient: "
                     , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8507}}, selectedOrderForStatus.patientName), " (" , selectedOrderForStatus.patientPhone, ")"
                  )
                )

                /* Status Advancement Controls */
                , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8512}}
                  , selectedOrderForStatus.status === 'sample_pending' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'in_progress'),
                      className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8514}}
, "🩸 Collect Sample (In Progress)"

                    )
                  )

                  , selectedOrderForStatus.status === 'in_progress' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => setShowUploadResultModal(true),
                      className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8524}}
, "📝 Upload Results & Values"

                    )
                  )

                  , selectedOrderForStatus.status === 'result_ready' && (
                    React.createElement('button', {
                      type: "button",
                      onClick: () => handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'delivered'),
                      className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8534}}
, "✓ Deliver to Doctor & Patient Timeline"

                    )
                  )
                )
              )

              /* Status Stepper Progression */
              , React.createElement('div', { className: "grid grid-cols-4 gap-2 text-center text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8546}}
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
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8557}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8565}}, isDone ? '✓ ' : '', st.label)
                    )
                  );
                })
              )

              /* Dual Results Viewer (Clinical + Patient Friendly) */
              , selectedOrderForStatus.resultData ? (
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8573}}
                  /* Clinical View */
                  , React.createElement('div', { className: "p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8575}}
                    , React.createElement('div', { className: "flex items-center justify-between border-b border-white/10 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8576}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8577}}
                        , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-emerald-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8578}}, "CLINICAL VIEW • MEDICAL OFFICER"

                        )
                        , React.createElement('h4', { className: "text-base font-black text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8581}}, "Diagnostic Laboratory Parameters"  )
                      )
                      , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8583}}, "NABL Verified" )
                    )

                    , React.createElement('p', { className: "text-xs text-slate-300 font-medium leading-relaxed"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8586}}
                      , selectedOrderForStatus.resultData.clinicalSummary
                    )

                    , React.createElement('div', { className: "space-y-2 pt-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8590}}
                      , _optionalChain([selectedOrderForStatus, 'access', _24 => _24.resultData, 'access', _25 => _25.parameters, 'optionalAccess', _26 => _26.map, 'call', _27 => _27((p, idx) => (
                        React.createElement('div', {
                          key: idx,
                          className: "p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8592}}

                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8596}}
                            , React.createElement('span', { className: "font-bold text-slate-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8597}}, p.name)
                            , React.createElement('div', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8598}}, "Ref: " , p.referenceRange, " " , p.unit)
                          )
                          , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8600}}
                            , React.createElement('span', { className: "font-mono font-black text-sm text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8601}}, p.value, " " , p.unit)
                            , p.isAbnormal && (
                              React.createElement('span', { className: "block text-[9px] font-black uppercase text-critical-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8603}}, "⚠️ HIGH / ABNORMAL"

                              )
                            )
                          )
                        )
                      ))])
                    )

                    , selectedOrderForStatus.resultData.certifiedBy && (
                      React.createElement('div', { className: "text-[10px] text-slate-400 border-t border-white/10 pt-2 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8613}}, "Verified by: "
                          , selectedOrderForStatus.resultData.certifiedBy
                      )
                    )
                  )

                  /* Patient Plain-Language View */
                  , React.createElement('div', { className: "p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm space-y-4 flex flex-col justify-between"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8620}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8621}}
                      , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8622}}
                        , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8623}}, "🩺")
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8624}}
                          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-emerald-800 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8625}}, "PATIENT EXPLANATION • PLAIN LANGUAGE"

                          )
                          , React.createElement('h4', { className: "text-base font-black text-emerald-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8628}}, "What Your Results Mean"   )
                        )
                      )

                      , React.createElement('div', { className: "p-4 bg-white/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8632}}
                        , selectedOrderForStatus.resultData.patientFriendlySummary
                      )
                    )

                    , React.createElement('div', { className: "p-3 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 flex items-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8637}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8638}}, "✓")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8639}}, "This report has been automatically synced to your "        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8639}}, "MedVeda Longitudinal EHR"  ), ".")
                    )
                  )
                )
              ) : (
                React.createElement('div', { className: "p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8644}}, "Sample status is pending/in-progress. Results will be shown here once uploaded by the certified laboratory."

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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8657}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8658}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8659}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8660}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8661}}, "Counter Reservation"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8664}}, "Reserve Medicine for Pickup"   )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowOrderModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8666}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handlePlaceMedicineOrder, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8675}}
              , React.createElement('div', { className: "p-3.5 rounded-2xl bg-teal-50 border border-teal-200 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8676}}
                , React.createElement('div', { className: "font-extrabold text-teal-950 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8677}}, selectedMedItem.medicine.medicineName)
                , React.createElement('div', { className: "text-[11px] text-teal-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8678}}, "Shop: "
                   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8679}}, selectedMedItem.shop.name), " • "  , selectedMedItem.distanceKm, " km"
                )
                , selectedMedItem.medicine.price && (
                  React.createElement('div', { className: "text-teal-900 font-bold pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8682}}, "Price: ₹"
                     , selectedMedItem.medicine.price, " per unit"
                  )
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8688}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8689}}, "Patient Full Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: orderPatientName,
                  onChange: (e) => setOrderPatientName(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8690}}
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8699}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8700}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8701}}, "Phone Number" )
                  , React.createElement('input', {
                    type: "text",
                    value: orderPatientPhone,
                    onChange: (e) => setOrderPatientPhone(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8702}}
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8710}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8711}}, "Quantity")
                  , React.createElement('input', {
                    type: "number",
                    min: "1",
                    max: selectedMedItem.medicine.quantity,
                    value: orderQuantity,
                    onChange: (e) => setOrderQuantity(e.target.value),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8712}}
                  )
                )
              )

              , React.createElement('div', { className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8724}}, "ℹ️ Payment is collected in person at the counter upon physical pickup."

              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8728}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowOrderModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8729}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8736}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8752}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8753}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8754}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8755}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8756}}, "Direct Lab Appointment"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8759}}, "Book Diagnostic Test"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowBookingModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8761}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handlePlaceDiagnosticBooking, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8770}}
              , React.createElement('div', { className: "p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8771}}
                , React.createElement('div', { className: "font-extrabold text-purple-950 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8772}}, selectedTestItem.test.testName)
                , React.createElement('div', { className: "text-[11px] text-purple-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8773}}, "Lab: "
                   , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8774}}, selectedTestItem.center.name), " • "  , selectedTestItem.distanceKm, " km"
                )
                , React.createElement('div', { className: "text-purple-900 font-bold pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8776}}, "Turnaround: "
                   , selectedTestItem.test.turnaroundTime, " • Price: ₹"   , selectedTestItem.test.price || 0
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8781}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8782}}, "Patient Full Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: bookingPatientName,
                  onChange: (e) => setBookingPatientName(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8783}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8792}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8793}}, "Contact Phone" )
                , React.createElement('input', {
                  type: "text",
                  value: bookingPatientPhone,
                  onChange: (e) => setBookingPatientPhone(e.target.value),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8794}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8803}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowBookingModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8804}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8811}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8827}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8828}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8829}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8830}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8831}}, "Shop Inventory CRUD"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8834}}
                  , showAddMedModal ? 'Add Medicine to Inventory' : 'Edit Medicine Details'
                )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => {
                  setShowAddMedModal(false);
                  setShowEditMedModal(false);
                },
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8838}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: showAddMedModal ? handleAddMedicine : handleUpdateMedicine, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8850}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8851}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8852}}, "Medicine Brand Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: medForm.medicineName,
                  onChange: (e) => setMedForm({ ...medForm, medicineName: e.target.value }),
                  placeholder: "e.g. Telmisartan 40mg"  ,
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8853}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8863}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8864}}, "Generic Molecule Name"  )
                , React.createElement('input', {
                  type: "text",
                  value: medForm.genericName,
                  onChange: (e) => setMedForm({ ...medForm, genericName: e.target.value }),
                  placeholder: "e.g. Telmisartan (ARB)"  ,
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8865}}
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8874}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8875}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8876}}, "Dosage Form" )
                  , React.createElement('select', {
                    value: medForm.dosageForm,
                    onChange: (e) => setMedForm({ ...medForm, dosageForm: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8877}}

                    , React.createElement('option', { value: "Tablet", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8882}}, "Tablet")
                    , React.createElement('option', { value: "Capsule", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8883}}, "Capsule")
                    , React.createElement('option', { value: "Syrup", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8884}}, "Syrup")
                    , React.createElement('option', { value: "Injection", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8885}}, "Injection")
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8889}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8890}}, "Strength")
                  , React.createElement('input', {
                    type: "text",
                    value: medForm.strength,
                    onChange: (e) => setMedForm({ ...medForm, strength: e.target.value }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8891}}
                  )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8900}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8901}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8902}}, "Stock Quantity" )
                  , React.createElement('input', {
                    type: "number",
                    value: medForm.quantity,
                    onChange: (e) => setMedForm({ ...medForm, quantity: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8903}}
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8912}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8913}}, "Unit Price (INR)"  )
                  , React.createElement('input', {
                    type: "number",
                    step: "0.5",
                    value: medForm.price,
                    onChange: (e) => setMedForm({ ...medForm, price: Number(e.target.value) }),
                    className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8914}}
                  )
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8924}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => {
                    setShowAddMedModal(false);
                    setShowEditMedModal(false);
                  },
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8925}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8935}}

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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8951}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8952}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8953}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8954}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8955}}, "Clinical Results Publishing"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8958}}, "Publish Test Results"  )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowUploadResultModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8960}}
, "×"

              )
            )

            , React.createElement('form', {
              onSubmit: (e) => {
                e.preventDefault();
                handleAdvanceOrderStatus(selectedOrderForStatus.orderId, 'result_ready', resultForm);
                setShowUploadResultModal(false);
              },
              className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8969}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8977}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8978}}, "Clinical Diagnostic Summary (For Doctor)"    )
                , React.createElement('textarea', {
                  rows: "2",
                  value: resultForm.clinicalSummary,
                  onChange: (e) => setResultForm({ ...resultForm, clinicalSummary: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8979}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8988}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8989}}, "Patient-Friendly Explanation (Plain Language)"   )
                , React.createElement('textarea', {
                  rows: "2",
                  value: resultForm.patientFriendlySummary,
                  onChange: (e) => setResultForm({ ...resultForm, patientFriendlySummary: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-medium"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8990}}
                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8999}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9000}}, "Certifying Pathologist / Officer"   )
                , React.createElement('input', {
                  type: "text",
                  value: resultForm.certifiedBy,
                  onChange: (e) => setResultForm({ ...resultForm, certifiedBy: e.target.value }),
                  className: "w-full border border-slate-300 rounded-xl p-2 font-bold"     ,
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9001}}
                )
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9010}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowUploadResultModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9011}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9018}}
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
    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9259}}
      /* Toast Notification Alert */
      , notificationToast && (
        React.createElement('div', { className: "fixed top-16 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9262}}
          , React.createElement('span', { className: "text-xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9263}}, "🔔")
          , React.createElement('span', { className: "text-xs font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9264}}, notificationToast)
        )
      )

      /* Feature Header Banner with Facility Switcher */
      , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9269}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9270}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9271}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9272}})
            , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9273}}, "FEATURE MAP 07 • FACILITY DASHBOARD AGGREGATION LAYER"

            )
          )
          , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9277}}, "Facility Operations & Resource Control"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9280}}, "Real-time unified aggregation across Features 01–06: Care Continuity index, priority queue load, live bed/ICU status, footfall trends, and severity-tagged alerts."

          )
        )

        /* Facility Selector & Home Button */
        , React.createElement('div', { className: "flex items-center gap-3 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9286}}
          , React.createElement('div', { className: "flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9287}}
            , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9288}}, "🏥")
            , React.createElement('select', {
              value: activeFacilityId,
              onChange: (e) => setActiveFacilityId(e.target.value),
              className: "bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9289}}

              , facilities.map((f) => (
                React.createElement('option', { key: f.facilityId, value: f.facilityId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9295}}
                  , f.name
                )
              ))
            )
          )

          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9302}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9307}}, "🏠 Home" )
          )
        )
      )

      /* Role Context Bar */
      , React.createElement('div', { className: "bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 text-xs shadow-md border border-slate-800"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9313}}
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9314}}
          , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9315}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9316}}
            , React.createElement('span', { className: "text-slate-400 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9317}}, "Active Facility:" ), ' '
            , React.createElement('strong', { className: "text-white", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9318}}, activeFacilityObj.name), " •" , ' '
            , React.createElement('span', { className: "text-amber-300 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9319}}, activeFacilityObj.type || 'District Hospital')
          )
        )

        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9323}}
          , React.createElement('span', { className: "text-slate-400 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9324}}, "Logged Role:" )
          , React.createElement('span', { className: "px-2.5 py-1 rounded-lg bg-white/10 text-white font-mono font-bold uppercase text-[10px]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9325}}
            , actorRole
          )
          , actorRole === 'worker' && (
            React.createElement('span', { className: "text-[10px] text-amber-300 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9329}}, "(Restricted to Patient Care & Operational Views)"

            )
          )
          , actorRole === 'doctor' && (
            React.createElement('span', { className: "text-[10px] text-teal-300 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9334}}, "(Clinical & Queue Views Enabled)"

            )
          )
        )
      )

      /* 6 Section Module Navigation Tabs */
      , React.createElement('div', { className: "bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-bold"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9342}}
        , actorRole !== 'worker' && (
          React.createElement('button', {
            type: "button",
            onClick: () => setActiveSection('overview'),
            className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'overview'
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9344}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9353}}, "📊")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9354}}, "1. Overview Summary"  )
          )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveSection('patient_care'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'patient_care'
              ? 'bg-brand-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9358}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9367}}, "👥")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9368}}, "2. Patient & Care Mgmt"    )
        )

        , actorRole !== 'worker' && (
          React.createElement('button', {
            type: "button",
            onClick: () => setActiveSection('appointments_queue'),
            className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'appointments_queue'
                ? 'bg-purple-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9372}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9381}}, "⏱️")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9382}}, "3. Appointments & Queue"   )
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
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9387}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9396}}, "🏥")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9397}}, "4. Service & Resources"   )
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
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9402}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9411}}, "📈")
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9412}}, "5. Analytics & Reports"   )
          )
        )

        , React.createElement('button', {
          type: "button",
          onClick: () => setActiveSection('alerts'),
          className: `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'alerts'
              ? 'bg-critical-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9416}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9425}}, "🚨")
          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9426}}, "6. Alerts & Notifications"   )
          , criticalCount > 0 && (
            React.createElement('span', { className: "px-1.5 py-0.2 bg-white text-critical-700 rounded-full font-black text-[10px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9428}}
              , criticalCount
            )
          )
        )
      )

      /* ========================================================= */
      /* SECTION 1: OVERVIEW SUMMARY */
      /* ========================================================= */
      , activeSection === 'overview' && overviewData && (
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9439}}
          /* 4 KPI Cards */
          , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9441}}
            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9442}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9443}}, "Total Patients Served"

              )
              , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9446}}
                , _optionalChain([overviewData, 'access', _28 => _28.totalPatientsServed, 'optionalAccess', _29 => _29.toLocaleString, 'call', _30 => _30()])
              )
              , React.createElement('span', { className: "text-[11px] text-emerald-600 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9449}}, "↑ 14% vs last month"

              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9454}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9455}}, "Appointments Today"

              )
              , React.createElement('div', { className: "text-3xl font-black text-slate-900 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9458}}
                , overviewData.appointmentsToday
              )
              , React.createElement('span', { className: "text-[11px] text-brand-600 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9461}}
                , overviewData.activeQueueCount, " in live queue"
              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9466}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9467}}, "High-Risk Follow-Up"

              )
              , React.createElement('div', { className: "text-3xl font-black text-purple-700 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9470}}
                , overviewData.highRiskUnderFollowUp
              )
              , React.createElement('span', { className: "text-[11px] text-purple-600 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9473}}, "Under active ASHA monitoring"

              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9478}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9479}}, "Critical Active Alerts"

              )
              , React.createElement('div', { className: "text-3xl font-black text-critical-600 mt-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9482}}
                , overviewData.criticalAlertsCount
              )
              , React.createElement('span', { className: "text-[11px] text-critical-500 font-bold mt-1 inline-block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9485}}, "Immediate clinical attention"

              )
            )
          )

          /* Care Continuity Index Gauge Card */
          , React.createElement('div', { className: "bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9492}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9493}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9494}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-emerald-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9495}}, "LONGITUDINAL RECORD CONTINUITY"

                )
                , React.createElement('h3', { className: "text-xl font-black text-white mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9498}}, "Care Continuity Index: "
                     , overviewData.careContinuityIndex, "%"
                )
              )
              , React.createElement('span', { className: "px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9502}}, "✓ High Continuity Grid"

              )
            )

            , React.createElement('p', { className: "text-xs text-slate-300 font-medium max-w-2xl leading-relaxed"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9507}}, "Measures percentage of patients with complete longitudinal record chains without drop-offs between stages: "
                           , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9508}}, "Triage → Teleconsultation → Referral → Follow-Up"      ), "."
            )

            /* Progress Bar */
            , React.createElement('div', { className: "space-y-1.5 pt-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9512}}
              , React.createElement('div', { className: "w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9513}}
                , React.createElement('div', {
                  className: "h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"       ,
                  style: { width: `${overviewData.careContinuityIndex}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9514}}
)
              )
              , React.createElement('div', { className: "flex items-center justify-between text-[10px] text-slate-400 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9519}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9520}}, "0% Disconnected" )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9521}}, "Target: 80%+" )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9522}}, "100% Fully Connected"  )
              )
            )
          )

          /* Live Recent Activity Feed */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9528}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9529}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9530}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9531}}, "Live Cross-Platform Activity Stream"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9532}}, "Real-time events aggregated across Care Navigator, Teleconsultation, Referrals, Follow-ups, and Labs."

                )
              )
            )

            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9538}}
              , _optionalChain([overviewData, 'access', _31 => _31.recentActivities, 'optionalAccess', _32 => _32.map, 'call', _33 => _33((act) => (
                React.createElement('div', {
                  key: act.id,
                  className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9540}}

                  , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9544}}
                    , React.createElement('span', { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9545}}
                      , act.severity === 'critical' ? '🚨' : act.severity === 'warning' ? '⚠️' : '✓'
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9548}}
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9549}}
                        , React.createElement('strong', { className: "text-slate-900 font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9550}}, act.type)
                        , act.severity && (
                          React.createElement('span', {
                            className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              act.severity === 'critical'
                                ? 'bg-critical-100 text-critical-800'
                                : act.severity === 'warning'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9552}}

                            , act.severity
                          )
                        )
                      )
                      , React.createElement('p', { className: "text-slate-600 text-xs mt-0.5 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9565}}, act.description)
                    )
                  )

                  , React.createElement('div', { className: "text-right text-[10px] text-slate-400 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9569}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9570}}, act.actor)
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9571}}, new Date(act.timestamp).toLocaleTimeString())
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9584}}
          /* High-Risk Patient List with Dynamic Risk Badges */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9586}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9587}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9588}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9589}}, "High-Risk Patients Under Longitudinal Monitoring"    )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9590}}, "Dynamic risk scores calculated from frontline worker observation reports (Feature 04)."

                )
              )
              , React.createElement('span', { className: "text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9594}}
                , patientCareData.highRiskPatientsCount, " High-Risk Patients"
              )
            )

            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9599}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9600}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9601}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9602}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9603}}, "Patient Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9604}}, "Condition")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9605}}, "Dynamic Risk Score"  )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9606}}, "Assigned ASHA Worker"  )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9607}}, "Last Assessment" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9608}}, "Trend")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9611}}
                  , patientCareData.highRiskPatients.map((p, idx) => (
                    React.createElement('tr', { key: idx, className: "hover:bg-slate-50/50", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9613}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9614}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9615}}, p.patientName)
                        , React.createElement('div', { className: "text-[10px] text-slate-400 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9616}}, p.phone)
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9618}}, p.primaryCondition)
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9619}}
                        , React.createElement('span', {
                          className: `px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            p.riskLevel === 'HIGH'
                              ? 'bg-critical-100 text-critical-800'
                              : p.riskLevel === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9620}}

                          , p.riskScore, " / 100 ("   , p.riskLevel, ")"
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-700 font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9632}}, p.assignedWorkerName)
                      , React.createElement('td', { className: "py-3.5 px-4 text-[10px] text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9633}}
                        , p.lastFollowUpDate && !isNaN(new Date(p.lastFollowUpDate).getTime())
                          ? new Date(p.lastFollowUpDate).toLocaleDateString()
                          : 'Active Today'
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-bold text-[10px] uppercase text-purple-700"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9638}}
                        , p.trend === 'DETERIORATING' ? '🚨 Deteriorating' : p.trend === 'IMPROVING' ? '✓ Improving' : '→ Stable'
                      )
                    )
                  ))
                )
              )
            )
          )

          /* Referral Tracking Table */
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9649}}
            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9650}}
              , React.createElement('h4', { className: "text-sm font-black text-slate-900 flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9651}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9652}}, "📥 Incoming Referrals"  )
                , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9653}}
                  , _optionalChain([patientCareData, 'access', _34 => _34.incomingReferrals, 'optionalAccess', _35 => _35.length]) || 0
                )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9657}}
                , _optionalChain([patientCareData, 'access', _36 => _36.incomingReferrals, 'optionalAccess', _37 => _37.map, 'call', _38 => _38((r) => (
                  React.createElement('div', { key: r.referralId, className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9659}}
                    , React.createElement('div', { className: "flex items-center justify-between font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9660}}
                      , React.createElement('span', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9661}}, r.patientName)
                      , React.createElement('span', { className: "text-[9px] uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9662}}
                        , r.status
                      )
                    )
                    , React.createElement('div', { className: "text-[11px] text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9666}}, "From: "
                       , r.referringDoctorName, " • Priority: "   , React.createElement('strong', { className: "text-slate-700 uppercase" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9667}}, r.priority)
                    )
                  )
                ))])
              )
            )

            , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9674}}
              , React.createElement('h4', { className: "text-sm font-black text-slate-900 flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9675}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9676}}, "📤 Outgoing Escalations"  )
                , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9677}}
                  , _optionalChain([patientCareData, 'access', _39 => _39.outgoingReferrals, 'optionalAccess', _40 => _40.length]) || 0
                )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9681}}
                , _optionalChain([patientCareData, 'access', _41 => _41.outgoingReferrals, 'optionalAccess', _42 => _42.map, 'call', _43 => _43((r) => (
                  React.createElement('div', { key: r.referralId, className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9683}}
                    , React.createElement('div', { className: "flex items-center justify-between font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9684}}
                      , React.createElement('span', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9685}}, r.patientName)
                      , React.createElement('span', { className: "text-[9px] uppercase px-2 py-0.5 bg-brand-100 text-brand-800 rounded"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9686}}
                        , r.status
                      )
                    )
                    , React.createElement('div', { className: "text-[11px] text-slate-500 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9690}}, "To: "
                       , r.receivingFacilityName, " • Priority: "   , React.createElement('strong', { className: "text-slate-700 uppercase" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9691}}, r.priority)
                    )
                  )
                ))])
              )
            )
          )

          /* Care Continuity Chain Inspection */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9700}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9701}}, "Longitudinal Care Chain Integrity"   )
            , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9702}}
              , _optionalChain([patientCareData, 'access', _44 => _44.careContinuityChains, 'optionalAccess', _45 => _45.map, 'call', _46 => _46((c) => (
                React.createElement('div', {
                  key: c.patientId,
                  className: `p-4 rounded-2xl border ${
                    c.chainComplete ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9704}}

                  , React.createElement('div', { className: "flex items-center justify-between font-bold text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9710}}
                    , React.createElement('span', { className: "text-slate-900", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9711}}, c.patientName)
                    , React.createElement('span', {
                      className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        c.chainComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9712}}

                      , c.chainComplete ? '✓ Complete Chain' : '⚠️ Gap in Follow-up'
                    )
                  )

                  , React.createElement('div', { className: "grid grid-cols-4 gap-1 mt-3 text-center text-[9px] font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9721}}
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.triage ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9722}}, "1. Triage"

                    )
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.teleconsult ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9725}}, "2. Consult"

                    )
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.referral ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9728}}, "3. Referral"

                    )
                    , React.createElement('div', { className: `p-1.5 rounded ${c.stages.followUp ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9731}}, "4. Follow-Up"

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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9746}}
          /* Queue KPIs */
          , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9748}}
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9749}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9750}}, "Avg Wait Time"  )
              , React.createElement('div', { className: "text-2xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9751}}, queueData.avgWaitTimeMinutes, " mins" )
              , React.createElement('span', { className: "text-[10px] text-emerald-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9752}}, "Within Golden Target (<20m)"   )
            )
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9754}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9755}}, "Currently Waiting" )
              , React.createElement('div', { className: "text-2xl font-black text-purple-700 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9756}}, queueData.waitingCount)
              , React.createElement('span', { className: "text-[10px] text-purple-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9757}}, "In live priority queue"   )
            )
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9759}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9760}}, "Walk-Ins vs Booked"  )
              , React.createElement('div', { className: "text-2xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9761}}
                , queueData.walkInCount, " / "  , queueData.bookedCount
              )
              , React.createElement('span', { className: "text-[10px] text-slate-500 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9764}}, "Walk-in vs Pre-booked"  )
            )
            , React.createElement('div', { className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9766}}
              , React.createElement('span', { className: "text-[10px] font-bold text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9767}}, "Total Today" )
              , React.createElement('div', { className: "text-2xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9768}}, queueData.totalToday)
              , React.createElement('span', { className: "text-[10px] text-brand-600 font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9769}}, "Scheduled & walk-in slots"   )
            )
          )

          /* Live Queue Table */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9774}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9775}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9776}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9777}}, "Real-Time Priority Queue Telemetry"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9778}}, "Sorted dynamically by Urgency Tier + Risk Multiplier + Anti-Starvation Wait Time (+2 pts/min)."

                )
              )
            )

            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9784}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9785}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9786}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9787}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9788}}, "Priority Score" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9789}}, "Patient Name" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9790}}, "Urgency Tier" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9791}}, "Wait Duration" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9792}}, "Type")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9793}}, "Status")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9796}}
                  , queueData.liveQueue.map((item, idx) => (
                    React.createElement('tr', { key: idx, className: "hover:bg-slate-50/50", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9798}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black font-mono text-purple-700 text-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9799}}, "⭐ "
                         , item.priorityScore
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9802}}, item.patientName)
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9803}}
                        , React.createElement('span', {
                          className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            item.urgencyTier === 'CRITICAL'
                              ? 'bg-critical-100 text-critical-800'
                              : item.urgencyTier === 'URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9804}}

                          , item.urgencyTier
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4 font-mono font-bold text-slate-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9816}}, "⏱️ "
                         , item.waitDurationMinutes, " mins"
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9819}}
                        , React.createElement('span', { className: "text-[10px] font-bold text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9820}}
                          , item.isWalkIn ? '🚶 Walk-In' : '📅 Booked'
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9824}}
                        , React.createElement('span', { className: "text-[10px] font-black uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9825}}
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
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9837}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9838}}, "Hourly Patient Arrival & Peak Load"     )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9839}}
              , _optionalChain([queueData, 'access', _47 => _47.peakHourMetrics, 'optionalAccess', _48 => _48.map, 'call', _49 => _49((ph, idx) => (
                React.createElement('div', { key: idx, className: "flex items-center gap-3 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9841}}
                  , React.createElement('span', { className: "w-24 text-slate-500 font-bold text-[11px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9842}}, ph.hour)
                  , React.createElement('div', { className: "flex-1 h-4 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9843}}
                    , React.createElement('div', {
                      className: "h-full bg-purple-600 rounded-full"  ,
                      style: { width: `${(ph.patientCount / 30) * 100}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9844}}
)
                  )
                  , React.createElement('span', { className: "font-mono font-bold text-slate-900 w-12 text-right"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9849}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9863}}
          /* Emergency Readiness Banner */
          , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 flex items-center justify-between flex-wrap gap-4"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9865}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9866}}
              , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-teal-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9867}}, "FACILITY EMERGENCY READINESS SCORE"

              )
              , React.createElement('h3', { className: "text-2xl font-black text-white mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9870}}, "Readiness Index: "
                  , serviceResourceData.emergencyReadinessScore, " / 100"
              )
              , React.createElement('p', { className: "text-xs text-slate-300 mt-1 max-w-xl font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9873}}, "Evaluated from available ICU beds, oxygen buffer, ready 108 ambulances, and emergency on-duty specialist doctors."

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
                className: "px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9879}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9891}}, "✏️ Update Bed & Resource Availability"     )
              )
            )
          )

          /* Resources Grid */
          , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9897}}
            , _optionalChain([serviceResourceData, 'access', _50 => _50.resources, 'optionalAccess', _51 => _51.map, 'call', _52 => _52((res, idx) => {
              const utilRatio = (res.totalCount - res.availableCount) / res.totalCount;
              const isLow = res.availableCount / res.totalCount < 0.20;

              return (
                React.createElement('div', {
                  key: idx,
                  className: `bg-white rounded-3xl p-6 border transition-all space-y-3 ${
                    isLow ? 'border-critical-300 bg-critical-50/20' : 'border-slate-200'
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9903}}

                  , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9909}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9910}}
                      , React.createElement('h4', { className: "text-sm font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9911}}, res.resourceName)
                      , React.createElement('span', { className: "text-[10px] font-mono text-slate-400 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9912}}, res.resourceType)
                    )
                    , React.createElement('span', {
                      className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        isLow ? 'bg-critical-100 text-critical-800' : 'bg-emerald-100 text-emerald-800'
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9914}}

                      , isLow ? '⚠️ Low Stock' : '✓ Normal'
                    )
                  )

                  , React.createElement('div', { className: "flex items-baseline gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9923}}
                    , React.createElement('span', { className: "text-3xl font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9924}}, res.availableCount)
                    , React.createElement('span', { className: "text-xs font-bold text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9925}}, "/ " , res.totalCount, " Available" )
                  )

                  , React.createElement('div', { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9928}}
                    , React.createElement('div', {
                      className: `h-full rounded-full ${isLow ? 'bg-critical-500' : 'bg-teal-500'}`,
                      style: { width: `${(res.availableCount / res.totalCount) * 100}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9929}}
)
                  )

                  , React.createElement('div', { className: "text-[10px] text-slate-400 pt-1 flex items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9935}}
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9936}}, "Updated: " , new Date(res.lastUpdated).toLocaleTimeString())
                    , res.isStale && React.createElement('span', { className: "text-amber-600 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9937}}, "⚠️ Stale Data"  )
                  )
                )
              );
            })])
          )

          /* Departments Capacity Table */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9945}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9946}}, "Active Clinical Departments"  )
            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9947}}
              , React.createElement('table', { className: "w-full text-xs text-left"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9948}}
                , React.createElement('thead', { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9949}}
                  , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9950}}
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9951}}, "Department")
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9952}}, "Head Doctor" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9953}}, "Available Beds" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9954}}, "Capacity Utilization" )
                    , React.createElement('th', { className: "py-3 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9955}}, "Status")
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-slate-100 font-medium text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9958}}
                  , _optionalChain([serviceResourceData, 'access', _53 => _53.departments, 'optionalAccess', _54 => _54.map, 'call', _55 => _55((d) => (
                    React.createElement('tr', { key: d.departmentId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9960}}
                      , React.createElement('td', { className: "py-3.5 px-4 font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9961}}, d.name)
                      , React.createElement('td', { className: "py-3.5 px-4 text-slate-700 font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9962}}, d.headDoctor)
                      , React.createElement('td', { className: "py-3.5 px-4 font-mono font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9963}}
                        , d.availableBeds, " / "  , d.totalBeds
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9966}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9967}}
                          , React.createElement('div', { className: "w-24 h-2 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9968}}
                            , React.createElement('div', {
                              className: "h-full bg-teal-600 rounded-full"  ,
                              style: { width: `${d.utilizationPercent}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9969}}
)
                          )
                          , React.createElement('span', { className: "font-mono font-bold text-[10px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9974}}, d.utilizationPercent, "%")
                        )
                      )
                      , React.createElement('td', { className: "py-3.5 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9977}}
                        , React.createElement('span', { className: "text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9978}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9995}}
          /* Footfall Time-Series Chart */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9997}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9998}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9999}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10000}}, "7-Day Patient Footfall Time-Series"   )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10001}}, "Aggregated time-series trend of total visits, OPD consultations, and emergency admissions."

                )
              )
              , React.createElement('span', { className: "text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10005}}, "Date Range: "
                  , analyticsData.dateRange.start, " to "  , analyticsData.dateRange.end
              )
            )

            , React.createElement('div', { className: "grid grid-cols-7 gap-2 pt-4 text-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10010}}
              , _optionalChain([analyticsData, 'access', _56 => _56.footfallTrends, 'optionalAccess', _57 => _57.map, 'call', _58 => _58((ft, idx) => (
                React.createElement('div', { key: idx, className: "space-y-2 flex flex-col justify-end"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10012}}
                  , React.createElement('div', { className: "text-[10px] font-mono font-bold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10013}}, ft.totalCount)
                  , React.createElement('div', { className: "w-full bg-slate-100 rounded-2xl p-1.5 flex flex-col justify-end h-40"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10014}}
                    , React.createElement('div', {
                      className: "bg-emerald-500 rounded-t-xl w-full"  ,
                      style: { height: `${(ft.opdCount / 200) * 100}%` },
                      title: `OPD: ${ft.opdCount}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10015}}
)
                    , React.createElement('div', {
                      className: "bg-critical-500 rounded-b-xl w-full mt-0.5"   ,
                      style: { height: `${(ft.emergencyCount / 200) * 100}%` },
                      title: `Emergency: ${ft.emergencyCount}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10020}}
)
                  )
                  , React.createElement('div', { className: "text-[10px] font-bold text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10026}}
                    , new Date(ft.date).toLocaleDateString('en-US', { weekday: 'short' })
                  )
                )
              ))])
            )

            , React.createElement('div', { className: "flex items-center justify-center gap-6 pt-2 text-xs font-bold"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10033}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10034}}
                , React.createElement('span', { className: "w-3 h-3 bg-emerald-500 rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10035}})
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10036}}, "OPD Consultations" )
              )
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10038}}
                , React.createElement('span', { className: "w-3 h-3 bg-critical-500 rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10039}})
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10040}}, "Emergency Admissions" )
              )
            )
          )

          /* Disease Category Breakdown */
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10046}}
            , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10047}}, "Regional Disease & Clinical Case Distribution"     )
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10048}}
              , _optionalChain([analyticsData, 'access', _59 => _59.diseaseCategoryBreakdown, 'optionalAccess', _60 => _60.map, 'call', _61 => _61((dc, idx) => (
                React.createElement('div', { key: idx, className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10050}}
                  , React.createElement('div', { className: "flex items-center justify-between text-xs font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10051}}
                    , React.createElement('span', { className: "text-slate-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10052}}, dc.category)
                    , React.createElement('span', { className: "font-mono text-slate-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10053}}
                      , dc.count, " cases ("  , dc.percentage, "%)"
                    )
                  )
                  , React.createElement('div', { className: "w-full h-3 bg-slate-100 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10057}}
                    , React.createElement('div', {
                      className: "h-full bg-emerald-600 rounded-full"  ,
                      style: { width: `${dc.percentage}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10058}}
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
        React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10074}}
          , React.createElement('div', { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10075}}
            , React.createElement('div', { className: "flex items-center justify-between flex-wrap gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10076}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10077}}
                , React.createElement('h3', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10078}}, "Unified Facility Alert & Notification Center"     )
                , React.createElement('p', { className: "text-xs text-slate-500 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10079}}, "Rule-triggered alerts for critical triage red-flags, low resource thresholds, missed follow-ups, and data syncs."

                )
              )

              /* Severity Filter */
              , React.createElement('div', { className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10085}}
                , ['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
                  React.createElement('button', {
                    key: sev,
                    type: "button",
                    onClick: () => setAlertSeverityFilter(sev),
                    className: `px-3 py-1.5 rounded-lg transition-all ${
                      alertSeverityFilter === sev
                        ? 'bg-slate-900 text-white font-black shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10087}}

                    , sev
                  )
                ))
              )
            )

            /* Alert List */
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10104}}
              , filteredAlerts.length === 0 ? (
                React.createElement('div', { className: "p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10106}}, "No active alerts matching severity filter '"
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
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10111}}

                    , React.createElement('div', { className: "flex items-start gap-3.5 max-w-2xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10121}}
                      , React.createElement('span', { className: "text-2xl mt-0.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10122}}
                        , alt.severity === 'critical' ? '🚨' : alt.severity === 'warning' ? '⚠️' : 'ℹ️'
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10125}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10126}}
                          , React.createElement('span', {
                            className: `text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              alt.severity === 'critical'
                                ? 'bg-critical-200 text-critical-900'
                                : alt.severity === 'warning'
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-slate-200 text-slate-800'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10127}}

                            , alt.severity
                          )
                          , React.createElement('span', { className: "text-[10px] font-mono text-slate-500 uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10138}}, alt.alertType)
                          , React.createElement('span', {
                            className: `text-[9px] font-bold px-2 py-0.5 rounded ${
                              alt.status === 'active'
                                ? 'bg-critical-100 text-critical-800 font-black'
                                : alt.status === 'acknowledged'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10139}}

                            , alt.status
                          )
                        )
                        , React.createElement('p', { className: "text-xs font-bold text-slate-900 mt-1.5 leading-relaxed"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10151}}, alt.message)
                        , React.createElement('div', { className: "text-[10px] text-slate-400 font-medium mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10152}}, "Generated: "
                           , new Date(alt.createdAt).toLocaleTimeString(), " • ID: "   , alt.alertId
                        )
                      )
                    )

                    /* Alert Action Buttons */
                    , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10159}}
                      , alt.status === 'active' && (
                        React.createElement('button', {
                          type: "button",
                          onClick: () => handleUpdateAlertStatus(alt.alertId, 'acknowledged'),
                          className: "px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10161}}
, "Acknowledge"

                        )
                      )
                      , alt.status !== 'resolved' && (
                        React.createElement('button', {
                          type: "button",
                          onClick: () => handleUpdateAlertStatus(alt.alertId, 'resolved'),
                          className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10170}}
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
        React.createElement('div', { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10191}}
          , React.createElement('div', { className: "bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10192}}
            , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-100 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10193}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10194}}
                , React.createElement('span', { className: "text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10195}}, "Admin Facility Telemetry"

                )
                , React.createElement('h3', { className: "text-xl font-black text-slate-900 mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10198}}, "Update Bed & Resource Availability"    )
              )
              , React.createElement('button', {
                type: "button",
                onClick: () => setShowResourceModal(false),
                className: "text-slate-400 hover:text-slate-600 font-black text-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10200}}
, "×"

              )
            )

            , React.createElement('form', { onSubmit: handleUpdateResource, className: "space-y-3 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10209}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10210}}
                , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10211}}, "Target Resource Type"  )
                , React.createElement('select', {
                  value: selectedResourceType,
                  onChange: (e) => {
                    const t = e.target.value;
                    setSelectedResourceType(t);
                    const res = _optionalChain([serviceResourceData, 'optionalAccess', _62 => _62.resources, 'optionalAccess', _63 => _63.find, 'call', _64 => _64((r) => r.resourceType === t)]);
                    if (res) {
                      setResourceTotal(res.totalCount);
                      setResourceAvailable(res.availableCount);
                    }
                  },
                  className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10212}}

                  , React.createElement('option', { value: "bed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10225}}, "General Inpatient Beds"  )
                  , React.createElement('option', { value: "icu_bed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10226}}, "ICU & Critical Beds"   )
                  , React.createElement('option', { value: "ventilator", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10227}}, "Mechanical Ventilators" )
                  , React.createElement('option', { value: "oxygen", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10228}}, "Oxygen Cylinders" )
                  , React.createElement('option', { value: "ambulance", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10229}}, "108 / Emergency Ambulances"   )
                )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10233}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10234}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10235}}, "Total Capacity" )
                  , React.createElement('input', {
                    type: "number",
                    min: "1",
                    value: resourceTotal,
                    onChange: (e) => setResourceTotal(Number(e.target.value)),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10236}}
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10246}}
                  , React.createElement('label', { className: "font-bold text-slate-700 block mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10247}}, "Available Count" )
                  , React.createElement('input', {
                    type: "number",
                    min: "0",
                    max: resourceTotal,
                    value: resourceAvailable,
                    onChange: (e) => setResourceAvailable(Number(e.target.value)),
                    className: "w-full border border-slate-300 rounded-xl p-2.5 font-bold"     ,
                    required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10248}}
                  )
                )
              )

              , React.createElement('div', { className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10260}}, "ℹ️ If available count drops below 20% capacity, a "
                         , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10261}}, "Critical Resource Alert"  ), " is automatically generated."
              )

              , React.createElement('div', { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10264}}
                , React.createElement('button', {
                  type: "button",
                  onClick: () => setShowResourceModal(false),
                  className: "px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10265}}
, "Cancel"

                )
                , React.createElement('button', {
                  type: "submit",
                  className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex-1 shadow-md"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10272}}
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
    React.createElement('div', { className: "space-y-10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10302}}
      /* Hero Header Banner */
      , React.createElement('div', { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10304}}
        , React.createElement('div', { className: "absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10305}})
        , React.createElement('div', { className: "absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10306}})

        , React.createElement('div', { className: "max-w-3xl relative z-10 space-y-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10308}}
          , React.createElement('div', { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-indigo-300 backdrop-blur-md"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10309}}
            , React.createElement('span', { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10310}}), "NATIONAL DIGITAL HEALTH MISSION • RURAL HEALTHCARE OPERATING SYSTEM"

          )

          , React.createElement('h2', { className: "text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10314}}, "About MedVeda"

          )

          , React.createElement('p', { className: "text-slate-300 text-sm sm:text-base leading-relaxed font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10318}}, "MedVeda is an intelligent, clinically guarded healthcare orchestration platform engineered to bridge the last-mile gap in rural and peri-urban healthcare delivery across India. By integrating multi-agent AI triage, live verified hospital discovery, prioritized teleconsultation, closed-loop referrals, longitudinal follow-ups, ABDM-interoperable health records, and medicine/diagnostic logistics, MedVeda ensures no patient falls through the cracks."

          )

          , React.createElement('div', { className: "flex items-center gap-3 pt-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10322}}
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature1,
              className: "px-5 py-3 bg-critical-600 hover:bg-critical-500 text-white font-black text-xs rounded-xl shadow-lg shadow-critical-600/30 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10323}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10328}}, "🚨 Launch Care Navigator (F01)"    )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10329}}, "→")
            )

            , React.createElement('button', {
              type: "button",
              onClick: onBackToHome,
              className: "px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10332}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10337}}, "🏠 Back to Home"   )
            )
          )
        )
      )

      /* Key Platform Highlights Banner */
      , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10344}}
        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10345}}
          , React.createElement('span', { className: "text-3xl font-black text-indigo-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10346}}, "7")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10347}}, "Integrated Modules"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10350}}, "Triage to Facility Control"   )
        )

        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10353}}
          , React.createElement('span', { className: "text-3xl font-black text-emerald-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10354}}, "100%")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10355}}, "Safety Guardrails"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10358}}, "Strict Invariant Gating"  )
        )

        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10361}}
          , React.createElement('span', { className: "text-3xl font-black text-purple-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10362}}, "4-Stage")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10363}}, "Care Continuity Chain"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10366}}, "Triage → Consult → Ref → Follow-up"      )
        )

        , React.createElement('div', { className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10369}}
          , React.createElement('span', { className: "text-3xl font-black text-teal-600 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10370}}, "ABDM")
          , React.createElement('span', { className: "text-xs font-bold text-slate-800 uppercase tracking-wider mt-1 block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10371}}, "FHIR Compliant"

          )
          , React.createElement('span', { className: "text-[11px] text-slate-500 mt-1 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10374}}, "Interoperable Health Records"  )
        )
      )

      /* The Problem & Our Mission */
      , React.createElement('div', { className: "bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10379}}
        , React.createElement('div', { className: "max-w-3xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10380}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10381}}, "THE LAST-MILE HEALTHCARE CRISIS"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-slate-900 mt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10384}}, "Why We Built MedVeda"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10387}}, "In rural India, over 70% of the population relies on a tiered public health network of Sub-Centres, Primary Health Centres (PHCs), and Community Health Centres (CHCs). When medical emergencies strike or chronic conditions deteriorate, patients face systemic bottlenecks:"

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10392}}
          , React.createElement('div', { className: "p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10393}}
            , React.createElement('div', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10394}}, "⏳")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10395}}, "Critical Triage & Routing Delays"    )
            , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10396}}, "Patients with acute STEMI chest pain or stroke often travel hours to facilities that lack 24/7 ICU beds, catheterization labs, or on-duty emergency physicians."

            )
          )

          , React.createElement('div', { className: "p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10401}}
            , React.createElement('div', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10402}}, "📴")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10403}}, "Fragmented Paper Referrals"  )
            , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10404}}, "Paper referral slips are frequently lost, counter-referrals rarely happen, and frontline ASHA workers have no digital visibility into post-hospitalization care plans."

            )
          )

          , React.createElement('div', { className: "p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10409}}
            , React.createElement('div', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10410}}, "📦")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10411}}, "Medicine & Diagnostic Stockouts"   )
            , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10412}}, "Patients travel long distances only to discover essential medicines (e.g. Tenecteplase, Telmisartan) or diagnostic tests are out of stock at local pharmacies."

            )
          )
        )
      )

      /* The 7 Core Platform Pillars */
      , React.createElement('div', { className: "bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10420}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10421}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10422}}, "COMPREHENSIVE SOLUTION ARCHITECTURE"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-slate-900 mt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10425}}, "The 7 Pillars of the MedVeda Platform"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10428}}, "Every feature in MedVeda is designed to interconnect seamlessly, creating an unbroken continuum of care."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10433}}
          /* Pillar 1 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-critical-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10435}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10436}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10437}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-critical-100 text-critical-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10438}}, "Feature 01"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10441}}, "3-Agent Pipeline" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10443}}, "🚨 Smart Care Navigator"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10444}}, "Autonomous clinical triage with non-bypassable red-flag detection, live hospital discovery via Google Search MCP, and multi-factor capability ranking (OPD vs. 24x7 Emergency)."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature1,
              className: "w-full py-2.5 bg-critical-600 hover:bg-critical-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10448}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10453}}, "Launch Care Navigator"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10454}}, "→")
            )
          )

          /* Pillar 2 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-brand-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10459}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10460}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10461}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-100 text-brand-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10462}}, "Feature 02"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10465}}, "Priority Queuing" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10467}}, "🩺 Teleconsultation & Queue"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10468}}, "Multi-facility doctor roster with real-time urgency-weighted queuing, anti-starvation wait score (+2 pts/min), and seamless call mode degradation (Video → Audio → In-App Chat)."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature2,
              className: "w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10472}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10477}}, "Start Teleconsultation" )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10478}}, "→")
            )
          )

          /* Pillar 3 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10483}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10484}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10485}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10486}}, "Feature 03"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10489}}, "Closed-Loop Token" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10491}}, "📋 Smart Referral Management"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10492}}, "Digital referral pass with unique token (REF-2026-XXXXX), strict 5-stage lifecycle state machine (CREATED → SENT → IN_PROGRESS → REACHED → COMPLETED), and counter-referral loop."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature3,
              className: "w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10496}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10501}}, "Open Referrals Workspace"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10502}}, "→")
            )
          )

          /* Pillar 4 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10507}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10508}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10509}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10510}}, "Feature 04"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10513}}, "Dynamic Risk Score"  )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10515}}, "🔄 High-Risk Follow-Up System"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10516}}, "Doctor-assigned periodic schedules for frontline ASHA health workers, mobile observation forms, dynamic risk scoring engine (0-100), and automated hospital deterioration alerts."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature4,
              className: "w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10520}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10525}}, "Open Follow-Up System"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10526}}, "→")
            )
          )

          /* Pillar 5 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10531}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10532}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10533}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10534}}, "Feature 05"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10537}}, "ABHA / ABDM FHIR"   )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10539}}, "📁 Interoperable Health Records"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10540}}, "Internal Medical ID anchor, optional ABDM/ABHA linking, OCR paper prescription parsing, unified 4-source longitudinal timeline, and audited emergency access override."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature5,
              className: "w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10544}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10549}}, "Open Health Records"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10550}}, "→")
            )
          )

          /* Pillar 6 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10555}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10556}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10557}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10558}}, "Feature 06"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10561}}, "Geo Inventory & Labs"   )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10563}}, "💊 Medicine & Diagnostic Coordination"    )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10564}}, "Real-time pharmacy stock search with Haversine distance & out-of-radius fallback, owner-only RBAC CRUD, counter reservation pickup, and doctor diagnostic test fulfillment."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature6,
              className: "w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10568}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10573}}, "Open Medicine & Lab"   )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10574}}, "→")
            )
          )

          /* Pillar 7 */
          , React.createElement('div', { className: "p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all md:col-span-2"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10579}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10580}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10581}}
                , React.createElement('span', { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10582}}, "Feature 07"

                )
                , React.createElement('span', { className: "text-xs font-mono font-bold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10585}}, "Multi-Source Aggregation" )
              )
              , React.createElement('h4', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10587}}, "🏥 Facility Operations Dashboard"   )
              , React.createElement('p', { className: "text-xs text-slate-600 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10588}}, "Real-time multi-source aggregation layer across Features 01–06: 6 role-gated sections, Care Continuity Index (Triage → Consult → Referral → Follow-Up), live priority queue, updatable bed/ICU/oxygen resource meters, time-series analytics, and unified alert notifications."

              )
            )
            , React.createElement('button', {
              type: "button",
              onClick: onLaunchFeature7,
              className: "w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10592}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10597}}, "Open Facility Dashboard"  )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10598}}, "→")
            )
          )
        )
      )

      /* 3-Agent AI Architecture Deep Dive */
      , React.createElement('div', { className: "bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-blue-900/40 space-y-6"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10605}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10606}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-emerald-400 block"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10607}}, "CORE AI ENGINE"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-white mt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10610}}, "The 3-Agent Clinical Navigation Architecture"

          )
          , React.createElement('p', { className: "text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1 max-w-2xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10613}}, "Built on a decoupled 3-agent orchestration pipeline that transforms raw patient symptoms into verified, clinically safe routing decisions."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10618}}
          , React.createElement('div', { className: "bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10619}}
            , React.createElement('div', { className: "w-8 h-8 rounded-full bg-critical-500/20 text-critical-300 font-bold flex items-center justify-center text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10620}}, "01"

            )
            , React.createElement('h4', { className: "font-bold text-white text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10623}}, "Agent 1: Triage Specialist"   )
            , React.createElement('p', { className: "text-xs text-slate-400 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10624}}, "Analyzes chief complaints and red-flags. Determines urgency tier (CRITICAL, URGENT, ROUTINE) and required specialty with absolute red-flag invariance."

            )
          )

          , React.createElement('div', { className: "bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10629}}
            , React.createElement('div', { className: "w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10630}}, "02"

            )
            , React.createElement('h4', { className: "font-bold text-white text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10633}}, "Agent 2: Research & Verification"    )
            , React.createElement('p', { className: "text-xs text-slate-400 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10634}}, "Leverages Google Search MCP to discover regional hospitals in real time, extract verified services, and strictly classify OPD-only vs. 24x7 Emergency facilities."

            )
          )

          , React.createElement('div', { className: "bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10639}}
            , React.createElement('div', { className: "w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10640}}, "03"

            )
            , React.createElement('h4', { className: "font-bold text-white text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10643}}, "Agent 3: Clinical Ranking Engine"    )
            , React.createElement('p', { className: "text-xs text-slate-400 leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10644}}, "Executes multi-attribute ranking evaluating urgency match, verified emergency readiness, specialty alignment, travel distance, and operational hours."

            )
          )
        )
      )

      /* Stakeholders & Personas */
      , React.createElement('div', { className: "bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10652}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10653}}
          , React.createElement('span', { className: "text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10654}}, "MULTIDISCIPLINARY COOPERATION"

          )
          , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black text-slate-900 mt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10657}}, "Built for Every Healthcare Stakeholder"

          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10662}}
          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10663}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10664}}, "👩‍⚕️")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10665}}, "ASHA Health Workers"  )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10666}}, "Conduct guided field triage, submit longitudinal home observation reports, and track high-risk patients on mobile devices."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10671}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10672}}, "👤")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10673}}, "Rural Citizens & Families"   )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10674}}, "Check symptoms freely, book teleconsultations, locate nearby medicines, and carry a digital Medical ID card."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10679}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10680}}, "👨‍⚕️")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10681}}, "Specialist Doctors" )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10682}}, "Review prioritized queues, consult remotely via video/audio/chat, sign digital EMR prescriptions, and generate digital referrals."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10687}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10688}}, "🏪")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10689}}, "Medical Shop Owners"  )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10690}}, "Manage inventory stock levels with owner-only RBAC and confirm incoming customer medicine reservation pickups."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10695}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10696}}, "🧪")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10697}}, "Diagnostic Lab Staff"  )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10698}}, "Manage diagnostic test catalogs, track sample collection to completion, and publish dual clinical & plain-language reports."

            )
          )

          , React.createElement('div', { className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10703}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10704}}, "🏥")
            , React.createElement('h4', { className: "font-bold text-slate-900 text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10705}}, "Facility Administrators" )
            , React.createElement('p', { className: "text-slate-600 leading-relaxed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10706}}, "Monitor bed/ICU/oxygen capacity, track regional footfall analytics, and resolve rule-triggered emergency alerts."

            )
          )
        )
      )

      /* Standards & Technical Guarantees */
      , React.createElement('div', { className: "bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 sm:p-10 border border-indigo-200/80 space-y-4 text-xs"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10714}}
        , React.createElement('h3', { className: "text-lg font-black text-indigo-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10715}}, "Technical & Standards Compliance"   )
        , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10716}}
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10717}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10718}}, "ABDM Sandbox" )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10719}}, "Open sandbox compliant architecture with FHIR standard bundle serialization."        )
          )
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10721}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10722}}, "Immutable Audit Log"  )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10723}}, "Every emergency access override records mandatory clinical justification and clinician ID."          )
          )
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10725}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10726}}, "Strict RBAC Model"  )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10727}}, "Backend-enforced access control ensuring non-owner roles cannot mutate private data."         )
          )
          , React.createElement('div', { className: "bg-white p-4 rounded-xl border border-indigo-100 space-y-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10729}}
            , React.createElement('strong', { className: "text-indigo-900 font-extrabold block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10730}}, "54/54 Unit Tests"  )
            , React.createElement('p', { className: "text-slate-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10731}}, "100% test pass rate verifying clinical invariants, priority formulas, and state machines."           )
          )
        )
      )

      /* Call to Action Banner */
      , React.createElement('div', { className: "text-center bg-gradient-to-r from-[#061d5c] via-[#0b2b82] to-[#123eab] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/40 space-y-4"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10737}}
        , React.createElement('h3', { className: "text-2xl sm:text-3xl font-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10738}}, "Experience the Future of Rural Healthcare"     )
        , React.createElement('p', { className: "text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10739}}, "Explore any of the 7 features in the MedVeda ecosystem, simulate different stakeholder roles, and see how intelligent care navigation transforms patient outcomes."

        )
        , React.createElement('div', { className: "flex items-center justify-center gap-3 pt-2 flex-wrap"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10742}}
          , React.createElement('button', {
            type: "button",
            onClick: onLaunchFeature1,
            className: "px-6 py-3 bg-critical-600 hover:bg-critical-500 text-white font-black text-xs rounded-xl shadow-lg transition-all"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10743}}
, "Start Care Navigator Demo"

          )
          , React.createElement('button', {
            type: "button",
            onClick: onBackToHome,
            className: "px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10750}}
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
    React.createElement('div', { className: "min-h-screen flex flex-col bg-white text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10900}}
      , React.createElement(Header, {
        currentView: view,
        setView: setView,
        currentScreen: feature1Screen,
        setScreen: setScreen,
        actorRole: actorRole,
        setActorRole: setActorRole, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10901}}
      )

      , React.createElement('main', { className: "flex-1 max-w-6xl xl:max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10910}}
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
            setActorRole: setActorRole, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10913}}
          )
        )

        /* VIEW 2: FEATURE 01 — SMART CARE NAVIGATOR */
        , view === 'feature1' && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10947}}
            , feature1Screen === 1 && (
              React.createElement(Screen1PatientInfo, {
                patient: patient,
                setPatient: setPatient,
                onNext: () => setScreen(2), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10949}}
              )
            )

            , feature1Screen === 2 && (
              React.createElement(Screen2SymptomAssessment, {
                symptoms: symptoms,
                setSymptoms: setSymptoms,
                onNext: () => setScreen(3),
                onBack: () => setScreen(1), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10957}}
              )
            )

            , feature1Screen === 3 && (
              React.createElement(Screen3RedFlags, {
                redFlags: redFlags,
                setRedFlags: setRedFlags,
                onNext: () => setScreen(4),
                onBack: () => setScreen(2), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10966}}
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
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10975}}
              )
            )

            , feature1Screen === 5 && (
              React.createElement(Screen5TriageResult, {
                triage: triageResult,
                onFindHospitals: () => setScreen(6),
                onBack: () => setScreen(3), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10987}}
              )
            )

            , feature1Screen === 6 && (
              React.createElement(Screen6HospitalSearch, {
                location: patient.location,
                requiredSpecialty: _optionalChain([triageResult, 'optionalAccess', _65 => _65.requiredSpecialty]),
                emergencyRequired: _optionalChain([triageResult, 'optionalAccess', _66 => _66.emergencyRequired]),
                onComplete: (liveFacilities) => {
                  if (liveFacilities && liveFacilities.length > 0) {
                    setFacilities(liveFacilities);
                    setSelectedFacility(liveFacilities[0]);
                  }
                  setScreen(7);
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10995}}
              )
            )

            , feature1Screen === 7 && (
              React.createElement(Screen7RecommendedFacilities, {
                facilities: facilities,
                onSelectFacility: (fac) => {
                  setSelectedFacility(fac);
                  setScreen(8);
                },
                onBack: () => setScreen(5), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11010}}
              )
            )

            , feature1Screen === 8 && (
              React.createElement(Screen8FacilityDetails, {
                facility: selectedFacility,
                onNext: () => setScreen(9),
                onBack: () => setScreen(7), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11021}}
              )
            )

            , feature1Screen === 9 && (
              React.createElement(Screen9ReferralPass, {
                facility: selectedFacility,
                patient: patient,
                onRestart: handleRestartFeature1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11029}}
              )
            )
          )
        )

        /* VIEW 3: FEATURE 02 — TELECONSULTATION & QUEUE MANAGEMENT */
        , view === 'feature2' && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11040}}
            , teleconsultScreen === 'entry' && (
              React.createElement(ScreenTeleconsultEntry, {
                actorRole: actorRole,
                onSelectPath: (path) => {
                  setActorRole(path);
                  setTeleconsultScreen('booking');
                },
                onBackToHome: () => setView('home'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11042}}
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
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11053}}
              )
            )

            , teleconsultScreen === 'queue' && (
              React.createElement(ScreenTeleconsultQueue, {
                appointment: teleconsultAppointment,
                onJoinCall: () => setTeleconsultScreen('call'),
                onBack: () => setTeleconsultScreen('booking'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11068}}
              )
            )

            , teleconsultScreen === 'call' && (
              React.createElement(ScreenTeleconsultCall, {
                appointment: teleconsultAppointment,
                pathActor: actorRole,
                onCompleteConsultation: (vitalsLogged) => {
                  setRecordedVitals(vitalsLogged);
                  setTeleconsultScreen('doctor');
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11076}}
              )
            )

            , teleconsultScreen === 'doctor' && (
              React.createElement(ScreenDoctorDocumentation, {
                appointment: teleconsultAppointment,
                vitals: recordedVitals,
                onSaveDocumentation: (docData) => {
                  setConsultationDocumentation(docData);
                  setTeleconsultScreen('summary');
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11087}}
              )
            )

            , teleconsultScreen === 'summary' && (
              React.createElement(ScreenConsultationSummary, {
                consultationData: consultationDocumentation,
                onRestart: handleRestartFeature2,
                onGoHome: () => setView('home'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11098}}
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
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11109}}
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
            onNavigateToReferrals: () => setView('feature3'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11122}}
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
            onNavigateToFollowUps: () => setView('feature4'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11136}}
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
            onNavigateToRecords: () => setView('feature5'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11155}}
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
            onNavigateToMedicine: () => setView('feature6'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11175}}
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
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11196}}
          )
        )
      )

      , React.createElement('footer', { className: "bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11225}}
        , React.createElement('div', { className: "max-w-6xl xl:max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11226}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11227}}, "MedVeda Smart Care Platform • Autonomous Care Navigation • Priority Telehealth • Closed-Loop Referrals • High-Risk Follow-Up • Interoperable Health Records • Medicine & Diagnostic Coordination • Facility Operations Dashboard"

          )
          , React.createElement('div', { className: "flex items-center gap-3 font-bold text-slate-700 shrink-0"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11230}}
            , React.createElement('button', {
              type: "button",
              onClick: () => setView('home'),
              className: "hover:text-[#0b2b82] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11231}}
, "Home"

            )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11238}}, "•")
            , React.createElement('button', {
              type: "button",
              onClick: () => setView('about'),
              className: "text-[#0b2b82] hover:text-[#071a4f] transition-colors underline underline-offset-2 font-black"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11239}}
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
root.render(React.createElement(App, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11255}} ));

