import type { ReferralStatus, UserRole } from '../models/referral.model.ts';

export const VALID_STATUS_TRANSITIONS: Record<ReferralStatus, readonly ReferralStatus[]> = {
  CREATED: ['SENT', 'CANCELLED'],
  SENT: ['IN_PROGRESS', 'REACHED_FACILITY', 'CANCELLED'],
  IN_PROGRESS: ['REACHED_FACILITY', 'CANCELLED'],
  REACHED_FACILITY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
};

export const ROLE_ALLOWED_TRANSITIONS: Record<UserRole, readonly ReferralStatus[]> = {
  doctor: ['SENT', 'CANCELLED'],
  worker: ['IN_PROGRESS', 'REACHED_FACILITY', 'CANCELLED'],
  facility: ['REACHED_FACILITY', 'COMPLETED', 'CANCELLED'],
  patient: [],
  admin: ['SENT', 'IN_PROGRESS', 'REACHED_FACILITY', 'COMPLETED', 'CANCELLED']
};

export interface TransitionValidationResult {
  readonly isValid: boolean;
  readonly error?: string;
}

export function validateStatusTransition(
  currentStatus: ReferralStatus,
  targetStatus: ReferralStatus,
  userRole: UserRole
): TransitionValidationResult {
  if (currentStatus === targetStatus) {
    return {
      isValid: false,
      error: `Referral is already in status '${currentStatus}'.`
    };
  }

  const allowedNextStatuses = VALID_STATUS_TRANSITIONS[currentStatus];
  if (!allowedNextStatuses || !allowedNextStatuses.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Invalid status transition: Cannot transition from '${currentStatus}' directly to '${targetStatus}'. Allowed next statuses: [${allowedNextStatuses?.join(', ') || 'none'}].`
    };
  }

  const roleAllowed = ROLE_ALLOWED_TRANSITIONS[userRole];
  if (!roleAllowed || !roleAllowed.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Role '${userRole}' is not authorized to transition referral to '${targetStatus}'.`
    };
  }

  return { isValid: true };
}
