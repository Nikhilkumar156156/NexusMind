/**
 * Feature Map 07 — Facility Dashboard Aggregation & RBAC Rules
 */

import type {
  DashboardActorContext,
  DashboardSection,
  FacilityResourceStatus,
  FacilityAlert,
  CareContinuityChain
} from '../models/facility-dashboard.model.ts';

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Validates dashboard section access by actor role.
 * Role permissions:
 * - admin / facility: Full access to all sections.
 * - doctor: Access to 'overview', 'patient_care', 'appointments_queue', 'alerts'.
 * - worker: Operational access to 'patient_care' and 'alerts' only.
 */
export function validateDashboardAccess(
  actor: DashboardActorContext,
  section: DashboardSection
): void {
  if (actor.role === 'admin' || actor.role === 'facility') {
    return; // Full access
  }

  if (actor.role === 'doctor') {
    const doctorAllowed: DashboardSection[] = [
      'overview',
      'patient_care',
      'appointments_queue',
      'alerts'
    ];
    if (!doctorAllowed.includes(section)) {
      throw new ForbiddenError(
        `Doctor role (ID: ${actor.actorId}) is not authorized to access facility dashboard section: '${section}'.`
      );
    }
    return;
  }

  if (actor.role === 'worker') {
    const workerAllowed: DashboardSection[] = ['patient_care', 'alerts'];
    if (!workerAllowed.includes(section)) {
      throw new ForbiddenError(
        `Frontline Worker role (ID: ${actor.actorId}) is restricted to operational patient care & queue views. Access to '${section}' is denied.`
      );
    }
    return;
  }

  throw new ForbiddenError(`Role '${actor.role}' is not authorized to access facility dashboard.`);
}

/**
 * Validates permission to update bed / resource status.
 * Only 'admin' or 'facility' roles are permitted.
 */
export function validateResourceUpdateAccess(actor: DashboardActorContext): void {
  if (actor.role !== 'admin' && actor.role !== 'facility') {
    throw new ForbiddenError(
      `Permission denied: Only Facility Administrators or Coordinators can update bed and resource counts. Actor role '${actor.role}' is unauthorized.`
    );
  }
}

/**
 * Computes Care Continuity Index as percentage of unbroken longitudinal record chains.
 */
export function calculateCareContinuityIndex(chains: CareContinuityChain[]): number {
  if (!chains || chains.length === 0) return 100;
  const completeCount = chains.filter((c) => c.chainComplete).length;
  return Math.round((completeCount / chains.length) * 100);
}

/**
 * Checks if a resource count is critically low (< 20% available capacity).
 */
export function checkResourceAlertThreshold(resource: FacilityResourceStatus): FacilityAlert | null {
  if (resource.totalCount === 0) return null;
  const ratio = resource.availableCount / resource.totalCount;

  if (ratio < 0.20) {
    const severity = ratio <= 0.10 ? 'critical' : 'warning';
    return {
      alertId: `ALT_RES_${resource.facilityId}_${resource.resourceType}_${Date.now().toString(36)}`,
      facilityId: resource.facilityId,
      alertType: 'critical_resource',
      severity,
      message: `Critical Resource Alert: Available ${resource.resourceName} is low (${resource.availableCount}/${resource.totalCount} remaining, ${(ratio * 100).toFixed(0)}% capacity). Immediate replenishment or diversion required.`,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }

  return null;
}

/**
 * Evaluates whether resource data is stale (not updated within maxHours).
 */
export function isResourceStale(lastUpdated: string, maxHours = 24): boolean {
  if (!lastUpdated) return true;
  const updatedTime = new Date(lastUpdated).getTime();
  const diffHours = (Date.now() - updatedTime) / (1000 * 60 * 60);
  return diffHours > maxHours;
}
