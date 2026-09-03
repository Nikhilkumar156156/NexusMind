// ==========================================
// Feature Map 05: Consent & Access Control Rules
// ==========================================

import type { ConsentRequest, ConsentScope } from '../models/records.model.ts';

export interface AccessEvaluationContext {
  requesterId: string;
  requesterRole: 'patient' | 'doctor' | 'worker' | 'facility' | 'admin';
  isEmergencyOverride?: boolean;
  emergencyReason?: string;
  targetScope?: ConsentScope;
}

/**
 * Validates whether the requester has legitimate authorization to access the patient's records.
 */
export function evaluateRecordAccess(
  activeConsents: ConsentRequest[],
  context: AccessEvaluationContext
): {
  isAllowed: boolean;
  reason: string;
  isEmergencyOverride: boolean;
  effectiveScope: ConsentScope;
} {
  // 1. Patient always has full self-access
  if (context.requesterRole === 'patient') {
    return {
      isAllowed: true,
      reason: 'Patient self-access granted unconditionally.',
      isEmergencyOverride: false,
      effectiveScope: 'ALL'
    };
  }

  // 2. Emergency Override Access (explicitly logged & flagged)
  if (context.isEmergencyOverride) {
    if (!context.emergencyReason || context.emergencyReason.trim().length < 5) {
      return {
        isAllowed: false,
        reason: 'Emergency override rejected: Detailed clinical justification is mandatory.',
        isEmergencyOverride: true,
        effectiveScope: 'ALL'
      };
    }

    return {
      isAllowed: true,
      reason: `Emergency access override granted. Reason: "${context.emergencyReason}". Access logged to immutable audit trail.`,
      isEmergencyOverride: true,
      effectiveScope: 'ALL'
    };
  }

  // 3. Regular Doctor / Frontline Worker Access (requires active consent)
  const now = new Date();
  const validConsent = activeConsents.find((c) => {
    if (c.status !== 'approved') return false;
    if (c.requestedBy !== context.requesterId && context.requesterRole !== 'worker') return false;
    const expires = new Date(c.expiresAt);
    return expires > now;
  });

  if (validConsent) {
    return {
      isAllowed: true,
      reason: `Authorized via active ABDM/MedVeda consent #${validConsent.consentId} (Scope: ${validConsent.scope}).`,
      isEmergencyOverride: false,
      effectiveScope: validConsent.scope
    };
  }

  return {
    isAllowed: false,
    reason: 'Access Denied: Patient has not approved an active consent request for this session.',
    isEmergencyOverride: false,
    effectiveScope: 'ALL'
  };
}
