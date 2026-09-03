/**
 * Unit Tests for Feature Map 07: Facility Dashboard
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import { InMemoryFacilityDashboardStore } from '../../src/infrastructure/cache/facility-dashboard.store.ts';
import { InMemoryTeleconsultStore } from '../../src/infrastructure/cache/teleconsult.cache.ts';
import { InMemoryReferralStore } from '../../src/infrastructure/cache/referral.store.ts';
import { InMemoryFollowUpStore } from '../../src/infrastructure/cache/followup.store.ts';
import { ManageFacilityDashboardUseCase } from '../../src/application/use-cases/manage-facility-dashboard.use-case.ts';
import { ForbiddenError } from '../../src/domain/rules/dashboard-aggregation.rules.ts';
import type { DashboardActorContext } from '../../src/domain/models/facility-dashboard.model.ts';

describe('Feature 07: Facility Dashboard & Multi-Source Aggregation Layer', () => {
  let dashboardStore: InMemoryFacilityDashboardStore;
  let teleconsultStore: InMemoryTeleconsultStore;
  let referralStore: InMemoryReferralStore;
  let followUpStore: InMemoryFollowUpStore;
  let useCase: ManageFacilityDashboardUseCase;

  const adminActor: DashboardActorContext = {
    actorId: 'admin_01',
    role: 'facility',
    facilityId: 'fac_01'
  };

  const doctorActor: DashboardActorContext = {
    actorId: 'doc_priya_sharma',
    role: 'doctor',
    facilityId: 'fac_01'
  };

  const workerActor: DashboardActorContext = {
    actorId: 'asha_anita_devi',
    role: 'worker',
    facilityId: 'fac_01'
  };

  beforeEach(() => {
    dashboardStore = new InMemoryFacilityDashboardStore();
    teleconsultStore = new InMemoryTeleconsultStore();
    referralStore = new InMemoryReferralStore();
    followUpStore = new InMemoryFollowUpStore();

    useCase = new ManageFacilityDashboardUseCase(
      dashboardStore,
      teleconsultStore,
      referralStore,
      followUpStore
    );
  });

  it('should enforce role-based access control (RBAC) across dashboard sections', async () => {
    // 1. Admin has access to all sections
    const adminOverview = await useCase.getOverview('fac_01', adminActor);
    assert.strictEqual(adminOverview.facilityId, 'fac_01');

    const adminAnalytics = useCase.getAnalytics('fac_01', adminActor);
    assert.ok(adminAnalytics.footfallTrends.length > 0);

    // 2. Doctor has access to Overview, Patient Care, Queue, and Alerts
    const docOverview = await useCase.getOverview('fac_01', doctorActor);
    assert.strictEqual(docOverview.facilityId, 'fac_01');

    const docPatientCare = await useCase.getPatientCare('fac_01', doctorActor);
    assert.ok(docPatientCare.highRiskPatients !== undefined);

    // Doctor cannot access facility-wide Analytics
    assert.throws(
      () => useCase.getAnalytics('fac_01', doctorActor),
      (err: any) => err instanceof ForbiddenError && err.message.includes('not authorized')
    );

    // 3. Worker has access to Patient Care (operational) and Alerts
    const workerPatientCare = await useCase.getPatientCare('fac_01', workerActor);
    assert.ok(workerPatientCare.highRiskPatients !== undefined);

    // Worker is denied access to Overview and Analytics
    await assert.rejects(
      async () => await useCase.getOverview('fac_01', workerActor),
      (err: any) => err instanceof ForbiddenError && err.message.includes('restricted to operational')
    );
    assert.throws(
      () => useCase.getAnalytics('fac_01', workerActor),
      (err: any) => err instanceof ForbiddenError
    );
  });

  it('should aggregate Section 1: Overview Summary metrics and Care Continuity Index', async () => {
    const overview = await useCase.getOverview('fac_01', adminActor);

    assert.strictEqual(overview.facilityId, 'fac_01');
    assert.ok(overview.totalPatientsServed > 0, 'Total patients served should be positive');
    assert.ok(overview.careContinuityIndex >= 70, 'Care Continuity Index should reflect high continuity');
    assert.ok(overview.criticalAlertsCount >= 1, 'Should detect critical active alerts');
    assert.ok(overview.recentActivities.length >= 3, 'Should aggregate recent activities feed');
  });

  it('should aggregate Section 2: Patient & Care Management with High-Risk and Referral tracking', async () => {
    const care = await useCase.getPatientCare('fac_01', adminActor);

    assert.ok(care.highRiskPatients.length > 0, 'Should list high-risk patients under follow-up');
    assert.ok(care.careContinuityChains.length > 0, 'Should report care continuity chains');
    assert.ok(care.careContinuityChains[0].stages.triage, 'First chain should have triage stage');
  });

  it('should aggregate Section 3: Appointment & Queue Management with wait times and peak hour metrics', async () => {
    const queueData = await useCase.getAppointmentsQueue('fac_01', adminActor);

    assert.ok(queueData.totalToday >= 0);
    assert.ok(queueData.avgWaitTimeMinutes > 0, 'Average wait time should be computed');
    assert.ok(queueData.peakHourMetrics.length > 0, 'Peak hour distribution should be present');
  });

  it('should manage Section 4: Service & Resource Status and trigger alert on low ICU capacity', () => {
    const service = useCase.getServiceResource('fac_01', adminActor);

    assert.ok(service.departments.length > 0, 'Departments should be listed');
    assert.ok(service.emergencyReadinessScore >= 50, 'Emergency readiness score should be computed');

    // Admin updates ICU beds to critical level (1 available of 12)
    const updated = useCase.updateResourceStatus('fac_01', adminActor, 'icu_bed', 12, 1);
    assert.strictEqual(updated.availableCount, 1);

    // Verify low resource alert was automatically generated
    const alerts = useCase.getAlerts('fac_01', adminActor);
    const lowResAlert = alerts.find(
      (a) => a.alertType === 'critical_resource' && a.message.includes('ICU & High-Dependency Beds')
    );
    assert.ok(lowResAlert, 'Should auto-generate critical resource alert when ICU capacity < 20%');
  });

  it('should strictly deny non-admin roles from updating resource counts', () => {
    assert.throws(
      () => useCase.updateResourceStatus('fac_01', doctorActor, 'bed', 100, 50),
      (err: any) => err instanceof ForbiddenError && err.message.includes('Permission denied')
    );
    assert.throws(
      () => useCase.updateResourceStatus('fac_01', workerActor, 'oxygen', 50, 20),
      (err: any) => err instanceof ForbiddenError
    );
  });

  it('should manage Section 5: Analytics & Reports and Section 6: Alerts lifecycle', () => {
    // Analytics
    const analytics = useCase.getAnalytics('fac_01', adminActor);
    assert.ok(analytics.footfallTrends.length >= 7, 'Should provide 7-day footfall time series');
    assert.ok(analytics.diseaseCategoryBreakdown.length > 0, 'Should break down disease categories');
    assert.ok(analytics.referralAnalytics.totalIncoming > 0, 'Should aggregate incoming referrals');

    // Alerts lifecycle
    const alerts = useCase.getAlerts('fac_01', adminActor);
    const activeAlert = alerts.find((a) => a.status === 'active');
    assert.ok(activeAlert, 'Should find active alert');

    const acknowledged = useCase.updateAlertStatus('fac_01', adminActor, activeAlert.alertId, 'acknowledged');
    assert.strictEqual(acknowledged?.status, 'acknowledged');

    const resolved = useCase.updateAlertStatus('fac_01', adminActor, activeAlert.alertId, 'resolved');
    assert.strictEqual(resolved?.status, 'resolved');
  });
});
