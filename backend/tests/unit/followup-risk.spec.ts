import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDynamicRiskScore } from '../../src/domain/rules/risk-scoring.rules.ts';
import { InMemoryFollowUpStore } from '../../src/infrastructure/cache/followup.store.ts';
import { ManageFollowUpUseCase } from '../../src/application/use-cases/manage-followup.use-case.ts';

describe('Feature 04: High-Risk Patient Follow-Up System & Dynamic Risk Invariants', () => {
  it('should allow a doctor to create a follow-up plan and auto-generate scheduled tasks', async () => {
    const store = new InMemoryFollowUpStore();
    const useCase = new ManageFollowUpUseCase(store);

    const result = await useCase.createPlan({
      patientId: 'PAT-TEST-001',
      patientName: 'Sunita Soren',
      patientAge: 32,
      patientSex: 'female',
      patientLocation: 'Barkagaon, Hazaribagh',
      doctorId: 'doc_4',
      doctorName: 'Dr. Kavita Murmu',
      facilityId: 'fac_sadar',
      facilityName: 'Sadar Hospital Hazaribagh',
      frontlineWorkerId: 'worker_014',
      frontlineWorkerName: 'ASHA Anita Devi',
      frequencyDays: 7,
      instructions: 'Check weekly BP and fetal heart sounds. Alert if SBP > 140.'
    });

    assert.ok(result.plan.id.startsWith('plan_'));
    assert.strictEqual(result.plan.patientName, 'Sunita Soren');
    assert.strictEqual(result.plan.frequencyDays, 7);
    assert.strictEqual(result.tasks.length, 4);
    assert.strictEqual(result.tasks[0].status, 'DUE');
    assert.strictEqual(result.tasks[1].status, 'UPCOMING');
  });

  it('should calculate dynamic risk score, elevate to HIGH, and explain score change on deterioration', () => {
    const previousScore = 42;
    const evaluation = evaluateDynamicRiskScore({
      previousScore,
      bloodPressure: { systolic: 162, diastolic: 102 },
      medicationAdherence: 'PARTIAL',
      symptomProgression: 'WORSENED'
    });

    // 42 (base) + 25 (severe BP) + 15 (partial adherence) + 25 (worsened) = 107 -> clamped to 100 or high
    assert.ok(evaluation.riskScore >= 70);
    assert.strictEqual(evaluation.riskLevel === 'HIGH' || evaluation.riskLevel === 'CRITICAL', true);
    assert.strictEqual(evaluation.trend, 'WORSENING');
    assert.strictEqual(evaluation.triggersFacilityAlert, true);
    assert.ok(evaluation.reason.includes('Severely elevated BP'));
    assert.ok(evaluation.reason.includes('symptom worsening'));
  });

  it('should reduce risk score and update trend to IMPROVING when patient adheres and symptoms improve', () => {
    const previousScore = 55;
    const evaluation = evaluateDynamicRiskScore({
      previousScore,
      bloodPressure: { systolic: 120, diastolic: 78 },
      medicationAdherence: 'FULL',
      symptomProgression: 'IMPROVED'
    });

    // 55 (base) - 10 (controlled BP) - 10 (full adherence) - 15 (improved) = 20
    assert.strictEqual(evaluation.riskScore, 20);
    assert.strictEqual(evaluation.riskLevel, 'LOW');
    assert.strictEqual(evaluation.trend, 'IMPROVING');
    assert.strictEqual(evaluation.triggersFacilityAlert, false);
    assert.ok(evaluation.reason.includes('Controlled BP'));
    assert.ok(evaluation.reason.includes('Strict medication adherence'));
  });

  it('should submit a follow-up report, transition task to COMPLETED, and trigger FacilityAlert when threshold crossed', async () => {
    const store = new InMemoryFollowUpStore();
    const useCase = new ManageFollowUpUseCase(store);

    // Get the first due task for pre-seeded P-1024
    const tasks = await useCase.listWorkerTasks('worker_014', 'DUE');
    const targetTask = tasks.find((t) => t.patientId === 'P-1024');
    assert.ok(targetTask, 'Expected due task for P-1024');

    const submitResult = await useCase.submitReport({
      taskId: targetTask.id,
      bloodPressure: { systolic: 165, diastolic: 104 },
      medicationAdherence: 'NONE',
      symptomProgression: 'WORSENED',
      generalCondition: 'Patient bedridden with persistent chest pain.',
      observationsText: 'Patient stopped all medications 4 days ago due to lack of supply.'
    });

    assert.strictEqual(submitResult.report.patientId, 'P-1024');
    assert.ok(submitResult.report.riskScore >= 80);
    assert.strictEqual(submitResult.report.riskLevel, 'CRITICAL');
    assert.ok(submitResult.alertCreated, 'Facility alert must be created');
    assert.strictEqual(submitResult.alertCreated.status, 'ACTIVE');

    // Verify task is now COMPLETED
    const refreshedTask = await store.getTask(targetTask.id);
    assert.strictEqual(refreshedTask?.status, 'COMPLETED');
  });

  it('should maintain longitudinal follow-up reports and risk history accurately', async () => {
    const store = new InMemoryFollowUpStore();
    const useCase = new ManageFollowUpUseCase(store);

    const reports = await useCase.getPatientFollowUps('P-1024');
    const riskHistory = await useCase.getPatientRiskHistory('P-1024');

    assert.ok(reports.length >= 3);
    assert.ok(riskHistory.length >= 3);
    assert.strictEqual(reports[0].followUpNumber, 1);
    assert.strictEqual(reports[1].followUpNumber, 2);
    assert.strictEqual(reports[2].followUpNumber, 3);
    assert.strictEqual(riskHistory[0].riskScore, 42);
    assert.strictEqual(riskHistory[2].riskScore, 78);
  });
});
