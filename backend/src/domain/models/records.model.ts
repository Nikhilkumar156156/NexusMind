// ==========================================
// Feature Map 05: Interoperable Health Records Domain Models
// ==========================================

export type RecordSource = 'manual' | 'abha' | 'medveda_internal' | 'cowin';

export type RecordType =
  | 'prescription'
  | 'lab_report'
  | 'discharge_summary'
  | 'vaccination'
  | 'triage_assessment'
  | 'teleconsult_prescription'
  | 'followup_report';

export type VerificationStatus =
  | 'verified'
  | 'unverified'
  | 'govt_sourced'
  | 'hip_verified'
  | 'clinician_signed';

export type ConsentStatus = 'pending' | 'approved' | 'denied' | 'revoked' | 'expired';

export type ConsentScope =
  | 'ALL'
  | 'PRESCRIPTIONS'
  | 'LAB_REPORTS'
  | 'DISCHARGE_SUMMARIES'
  | 'EMR_CONSULTATIONS';

export interface PatientProfile {
  internalMedicalId: string; // MedVeda primary anchor (e.g. "MV-MED-2026-1024")
  abhaId?: string | null;     // Optional linked ABDM ABHA ID (e.g. "91-2890-1423-8891@sbx")
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  phone: string;
  location: string;
  bloodGroup?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  createdAt: string;
}

export interface ExtractedPrescriptionData {
  medicines: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  diagnosis?: string;
  doctorName?: string;
  facilityName?: string;
  date?: string;
  rawTextPreview?: string;
}

export interface ExtractedLabReportData {
  testName: string;
  results: Array<{
    parameter: string;
    observedValue: string;
    unit: string;
    referenceRange?: string;
    isAbnormal?: boolean;
  }>;
  labName?: string;
  date?: string;
  rawTextPreview?: string;
}

export interface ExtractedDischargeSummaryData {
  admissionDate?: string;
  dischargeDate?: string;
  primaryDiagnosis?: string;
  proceduresPerformed?: string[];
  dischargeMedications?: string[];
  followUpAdvice?: string;
  facilityName?: string;
  rawTextPreview?: string;
}

export interface CowinVaccineData {
  beneficiaryId: string;
  vaccine: string;
  doseNumber: number;
  totalDoses: number;
  dateOfDose: string;
  vaccinationCenter: string;
  administeredBy: string;
  certificateNumber: string;
}

export type ExtractedRecordData =
  | ExtractedPrescriptionData
  | ExtractedLabReportData
  | ExtractedDischargeSummaryData
  | CowinVaccineData
  | Record<string, any>;

export interface HealthRecordItem {
  id: string;
  internalMedicalId: string;
  source: RecordSource;
  recordType: RecordType;
  title: string;
  summary: string;
  facilityName: string;
  doctorName?: string;
  recordedAt: string;
  rawImageUrl?: string;
  extractedData?: ExtractedRecordData;
  verificationStatus: VerificationStatus;
  verifiedBy?: string; // e.g. "Patient Verified", "ASHA Anita Devi", "Apollo HIP"
  metadata?: Record<string, any>;
}

export interface ConsentRequest {
  consentId: string;
  internalMedicalId: string;
  requestedBy: string; // Doctor ID or Facility ID
  requesterName: string;
  requesterRole: 'doctor' | 'worker' | 'facility';
  purpose: string;
  scope: ConsentScope;
  status: ConsentStatus;
  createdAt: string;
  expiresAt: string;
  grantedAt?: string;
  revokedAt?: string;
}

export interface EmergencyOverrideLog {
  id: string;
  internalMedicalId: string;
  accessedBy: string;
  accessorName: string;
  accessorRole: 'doctor' | 'emergency_officer';
  facilityName: string;
  clinicalReason: string;
  timestamp: string;
}

export interface RegisterPatientDto {
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  phone: string;
  location: string;
  bloodGroup?: string;
  abhaId?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface CreateManualRecordDto {
  internalMedicalId: string;
  recordType: RecordType;
  title: string;
  summary?: string;
  facilityName?: string;
  doctorName?: string;
  recordedAt?: string;
  rawImageUrl?: string;
  rawText?: string;
  extractedData?: ExtractedRecordData;
  isVerifiedByUser: boolean;
  verifiedBy?: string;
}

export interface CreateConsentRequestDto {
  internalMedicalId: string;
  requestedBy: string;
  requesterName: string;
  requesterRole: 'doctor' | 'worker' | 'facility';
  purpose: string;
  scope: ConsentScope;
  validityMinutes?: number;
}
