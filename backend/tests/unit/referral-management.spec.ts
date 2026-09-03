import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { InMemoryReferralStore } from '../../src/infrastructure/cache/referral.store.ts';
import { ManageReferralUseCase } from '../../src/application/use-cases/manage-referral.use-case.ts';
import { validateStatusTransition } from '../../src/domain/rules/referral-transition.rules.ts';

describe('Feature 03: Smart Referral Management System & Invariants', () => {
  it('should allow a doctor to create a referral with unique REF-2026-XXXXX identifier and initial CREATED status', async () => {
    const store = new InMemoryReferralStore();
    const useCase = new ManageReferralUseCase(store);

    const referral = await useCase.createReferral({
      patientId: 'PAT-2001',
      patientName: 'Geeta Devi',
      patientAge: 52,
      patientSex: 'female',
      patientLocation: 'Hazaribagh',
      referringDoctorId: 'doc_1',
      referringDoctorName: 'Dr. Priya Sharma',
      referringFacilityId: 'fac_phc_1',
      referringFacilityName: 'Katkamsandi PHC',
      receivingFacilityId: 'fac_sbmch',
      receivingFacilityName: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
      specialty: 'Cardiology',
      reason: 'Unstable angina evaluation',
      clinicalSummary: 'ECG demonstrates T-wave inversion in V4-V6. Stable SBP 130/85.'
    });

    assert.ok(referral.referralId.startsWith('REF-2026-'));
    assert.equal(referral.status, 'CREATED');
    assert.equal(referral.patientName, 'Geeta Devi');
    assert.equal(referral.receivingFacilityName, 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)');
    assert.equal(referral.statusHistory.length, 1);
    assert.equal(referral.statusHistory[0].toStatus, 'CREATED');
  });

  it('should strictly enforce the valid referral lifecycle: CREATED -> SENT -> IN_PROGRESS -> REACHED_FACILITY -> COMPLETED', async () => {
    const store = new InMemoryReferralStore();
    const useCase = new ManageReferralUseCase(store);

    const referral = await useCase.createReferral({
      patientId: 'PAT-2002',
      patientName: 'Bablu Singh',
      patientAge: 35,
      patientSex: 'male',
      patientLocation: 'Ramgarh',
      referringDoctorId: 'doc_2',
      referringDoctorName: 'Dr. Rajesh Verma',
      referringFacilityId: 'fac_sadar',
      referringFacilityName: 'Sadar Hospital Hazaribagh',
      receivingFacilityId: 'fac_kalyani',
      receivingFacilityName: 'Kalyani Super Specialty Hospital & Trauma Centre',
      specialty: 'Neurology',
      reason: 'Post-trauma concussion workup',
      clinicalSummary: 'Mild headache following low velocity fall. GCS 15/15.'
    });

    // 1. Doctor submits referral: CREATED -> SENT
    const step1 = await useCase.updateReferralStatus(referral.referralId, {
      toStatus: 'SENT',
      updatedBy: 'Dr. Rajesh Verma',
      userRole: 'doctor',
      remarks: 'Referral dispatched to Kalyani Trauma Centre.'
    });
    assert.equal(step1.status, 'SENT');

    // 2. Frontline ASHA worker contacts patient: SENT -> IN_PROGRESS
    const step2 = await useCase.updateReferralStatus(referral.referralId, {
      toStatus: 'IN_PROGRESS',
      updatedBy: 'ASHA Manju Devi',
      userRole: 'worker',
      remarks: 'Contacted patient family; transport confirmed.'
    });
    assert.equal(step2.status, 'IN_PROGRESS');

    // 3. ASHA confirms patient reaches facility: IN_PROGRESS -> REACHED_FACILITY
    const step3 = await useCase.updateReferralStatus(referral.referralId, {
      toStatus: 'REACHED_FACILITY',
      updatedBy: 'ASHA Manju Devi',
      userRole: 'worker',
      remarks: 'Patient safely arrived at Kalyani reception desk.'
    });
    assert.equal(step3.status, 'REACHED_FACILITY');

    // 4. Receiving facility completes care: REACHED_FACILITY -> COMPLETED
    const step4 = await useCase.updateReferralStatus(referral.referralId, {
      toStatus: 'COMPLETED',
      updatedBy: 'Dr. S. K. Mukherjee',
      userRole: 'facility',
      remarks: 'Neuro evaluation and CT head negative. Patient discharged with analgesics.'
    });
    assert.equal(step4.status, 'COMPLETED');
    assert.equal(step4.statusHistory.length, 5);
  });

  it('should strictly reject illegal transitions (e.g. CREATED directly to COMPLETED or unauthorized role transitions)', () => {
    // Cannot jump CREATED -> COMPLETED
    const res1 = validateStatusTransition('CREATED', 'COMPLETED', 'doctor');
    assert.equal(res1.isValid, false);
    assert.ok(res1.error?.includes("Cannot transition from 'CREATED' directly to 'COMPLETED'"));

    // Patient cannot update status to COMPLETED
    const res2 = validateStatusTransition('REACHED_FACILITY', 'COMPLETED', 'patient');
    assert.equal(res2.isValid, false);
    assert.ok(res2.error?.includes("Role 'patient' is not authorized"));

    // Completed is terminal
    const res3 = validateStatusTransition('COMPLETED', 'SENT', 'doctor');
    assert.equal(res3.isValid, false);
  });

  it('should support cancellation from CREATED or SENT states', () => {
    const res1 = validateStatusTransition('CREATED', 'CANCELLED', 'doctor');
    assert.equal(res1.isValid, true);

    const res2 = validateStatusTransition('SENT', 'CANCELLED', 'worker');
    assert.equal(res2.isValid, true);

    const res3 = validateStatusTransition('COMPLETED', 'CANCELLED', 'doctor');
    assert.equal(res3.isValid, false);
  });

  it('should retrieve pending referrals for frontline worker follow-up and retain audit history', async () => {
    const store = new InMemoryReferralStore();
    const useCase = new ManageReferralUseCase(store);

    const pending = await useCase.getPendingReferrals();
    assert.ok(pending.length >= 2);

    const history = await useCase.getHistory('REF-2026-00125');
    assert.ok(history.length >= 3);
    assert.equal(history[0].toStatus, 'CREATED');
    assert.equal(history[1].toStatus, 'SENT');
    assert.equal(history[2].toStatus, 'IN_PROGRESS');

    const stats = await useCase.getStats();
    assert.ok(stats.total >= 3);
    assert.ok(stats.completed >= 1);
  });
});
