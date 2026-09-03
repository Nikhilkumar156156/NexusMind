export type SpecialtyMode = 'EMERGENCY_AND_OPD' | 'OPD_ONLY' | 'EMERGENCY_ONLY' | 'UNKNOWN';
export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified';
export type SourceReliability = 'primary' | 'high' | 'moderate' | 'low';
export type SourceType = 'official_website' | 'government_directory' | 'reputable_platform' | 'other';

export interface HospitalSource {
  readonly type: SourceType;
  readonly url: string;
  readonly reliability: SourceReliability;
}

export interface HospitalFacility {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly distanceKm: number;
  readonly hasEmergencyDepartment: boolean;
  readonly hasRequiredSpecialty: boolean;
  readonly specialtyMode: SpecialtyMode;
  readonly emergencySpecialtyVerified: boolean;
  readonly verificationStatus: VerificationStatus;
  readonly verificationNotes: string;
  readonly contactNumber: string | null;
  readonly sources: readonly HospitalSource[];
}
