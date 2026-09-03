export type ReferralStatus =
  | 'CREATED'
  | 'SENT'
  | 'IN_PROGRESS'
  | 'REACHED_FACILITY'
  | 'COMPLETED'
  | 'CANCELLED';

export type UserRole = 'doctor' | 'worker' | 'facility' | 'patient' | 'admin';

export interface ReferralStatusHistoryItem {
  readonly id: string;
  readonly referralId: string;
  readonly fromStatus: ReferralStatus | null;
  readonly toStatus: ReferralStatus;
  readonly updatedBy: string;
  readonly userRole: UserRole;
  readonly remarks: string;
  readonly timestamp: string;
}

export interface Referral {
  readonly id: string;
  readonly referralId: string; // e.g. REF-2026-00125
  readonly patientId: string;
  readonly patientName: string;
  readonly patientAge: number;
  readonly patientSex: 'female' | 'male' | 'other';
  readonly patientPhone?: string;
  readonly patientLocation: string;
  readonly referringDoctorId: string;
  readonly referringDoctorName: string;
  readonly referringFacilityId: string;
  readonly referringFacilityName: string;
  readonly receivingFacilityId: string;
  readonly receivingFacilityName: string;
  readonly specialty: string;
  readonly reason: string;
  readonly clinicalSummary: string;
  readonly urgencyTier: 'CRITICAL' | 'URGENT' | 'ROUTINE';
  readonly status: ReferralStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly statusHistory: readonly ReferralStatusHistoryItem[];
}

export interface CreateReferralDto {
  readonly patientId: string;
  readonly patientName: string;
  readonly patientAge: number;
  readonly patientSex: 'female' | 'male' | 'other';
  readonly patientPhone?: string;
  readonly patientLocation: string;
  readonly referringDoctorId: string;
  readonly referringDoctorName: string;
  readonly referringFacilityId: string;
  readonly referringFacilityName: string;
  readonly receivingFacilityId: string;
  readonly receivingFacilityName: string;
  readonly specialty: string;
  readonly reason: string;
  readonly clinicalSummary: string;
  readonly urgencyTier?: 'CRITICAL' | 'URGENT' | 'ROUTINE';
}

export interface UpdateReferralStatusDto {
  readonly toStatus: ReferralStatus;
  readonly updatedBy: string;
  readonly userRole: UserRole;
  readonly remarks?: string;
}
