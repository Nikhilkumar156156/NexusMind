import type {
  SpecialtyMode,
  VerificationStatus,
  SourceReliability,
  SourceType,
  HospitalSource
} from '../models/hospital.model.ts';

export interface SpecialtyClassificationResult {
  readonly specialtyMode: SpecialtyMode;
  readonly hasEmergencyDepartment: boolean;
  readonly emergencySpecialtyVerified: boolean;
  readonly verificationNotes: string;
}

/**
 * Classifies a facility's specialty service into EMERGENCY_AND_OPD vs OPD_ONLY vs UNKNOWN.
 * Strictly enforces that an outpatient clinic is NOT marked as an emergency-capable destination.
 */
export function classifySpecialtyMode(
  snippets: readonly string[],
  specialty: string
): SpecialtyClassificationResult {
  const combinedText = snippets.join(' ').toLowerCase();
  const specialtyLower = specialty.toLowerCase();

  const hasGeneralEmergency =
    combinedText.includes('emergency') ||
    combinedText.includes('casualty') ||
    combinedText.includes('trauma') ||
    combinedText.includes('24x7') ||
    combinedText.includes('24 hours');

  const specialtyMentioned = combinedText.includes(specialtyLower);

  if (!specialtyMentioned) {
    return {
      specialtyMode: 'UNKNOWN',
      hasEmergencyDepartment: hasGeneralEmergency,
      emergencySpecialtyVerified: false,
      verificationNotes: `Emergency ${specialty} availability not verified from available records.`
    };
  }

  // Check for explicit OPD-only indicators
  const opdOnlyIndicators = [
    'opd only',
    'outpatient only',
    'opd schedule',
    'outpatient clinic',
    'consultation on',
    'no emergency admission',
    'no emergency neurological',
    'no icu admission'
  ];

  const hasOpdIndicator = opdOnlyIndicators.some((indicator) => combinedText.includes(indicator));

  // Check for explicit 24x7 acute specialty indicators
  const acuteSpecialtyIndicators = [
    `24x7 ${specialtyLower}`,
    `emergency ${specialtyLower}`,
    `${specialtyLower} emergency`,
    `stroke center`,
    `stroke unit`,
    `on-call ${specialtyLower}`,
    `neuro-icu`,
    `cardiac icu`,
    `acute trauma`
  ];

  const hasAcuteIndicator = acuteSpecialtyIndicators.some((indicator) => combinedText.includes(indicator));

  if (hasAcuteIndicator) {
    return {
      specialtyMode: 'EMERGENCY_AND_OPD',
      hasEmergencyDepartment: true,
      emergencySpecialtyVerified: true,
      verificationNotes: `Verified active 24x7 emergency coverage and acute intervention capability for ${specialty}.`
    };
  }

  if (hasOpdIndicator) {
    return {
      specialtyMode: 'OPD_ONLY',
      hasEmergencyDepartment: hasGeneralEmergency,
      emergencySpecialtyVerified: false,
      verificationNotes: `Facility provides ${specialty} consultation via OPD only; not equipped for acute emergency admission.`
    };
  }

  // If general emergency exists but specialty-specific emergency is unconfirmed
  return {
    specialtyMode: 'UNKNOWN',
    hasEmergencyDepartment: hasGeneralEmergency,
    emergencySpecialtyVerified: false,
    verificationNotes: `Emergency ${specialty} availability not verified. Call facility before proceeding.`
  };
}

/**
 * Classifies source reliability based on domain patterns and authority.
 */
export function classifySourceReliability(url: string): { type: SourceType; reliability: SourceReliability } {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // Government domains
    if (host.endsWith('.gov') || host.endsWith('.gov.in') || host.endsWith('.nic.in') || host.includes('nhm.')) {
      return { type: 'government_directory', reliability: 'high' };
    }

    // Official hospital domain patterns
    if (
      host.includes('hospital') ||
      host.includes('health') ||
      host.includes('medical') ||
      host.endsWith('.org') ||
      host.endsWith('.edu')
    ) {
      return { type: 'official_website', reliability: 'primary' };
    }

    // Reputable health aggregators
    if (host.includes('practo') || host.includes('justdial') || host.includes('apollo') || host.includes('fortis')) {
      return { type: 'reputable_platform', reliability: 'moderate' };
    }

    return { type: 'other', reliability: 'low' };
  } catch {
    return { type: 'other', reliability: 'low' };
  }
}

/**
 * Determines overall facility verification status from source trust hierarchy.
 */
export function determineVerificationStatus(
  sources: readonly HospitalSource[],
  emergencyVerified: boolean
): VerificationStatus {
  if (sources.length === 0) {
    return 'unverified';
  }

  const hasPrimaryOrGov = sources.some(
    (s) => s.reliability === 'primary' || s.reliability === 'high'
  );

  if (hasPrimaryOrGov && emergencyVerified) {
    return 'verified';
  }

  if (hasPrimaryOrGov || sources.some((s) => s.reliability === 'moderate')) {
    return 'partially_verified';
  }

  return 'unverified';
}
