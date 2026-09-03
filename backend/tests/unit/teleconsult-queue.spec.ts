import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computePriorityScore, sortQueueByPriority } from '../../src/domain/rules/queue-priority.rules.ts';
import { TeleconsultQueueUseCase } from '../../src/application/use-cases/teleconsult-queue.use-case.ts';
import { InMemoryTeleconsultStore } from '../../src/infrastructure/cache/teleconsult.cache.ts';

describe('Feature 02: Priority Queue & Scoring Rules', () => {
  it('should compute highest priority for RED urgency with pregnancy high-risk flag', () => {
    const score = computePriorityScore({
      urgencyTier: 'RED',
      highRiskFlags: ['Pregnancy (34 weeks)'],
      patientAge: 26,
      isBookedAppointment: false,
      minutesWaiting: 0
    });

    // Urgency RED (100) + Pregnancy (25) = 125
    assert.equal(score, 125);
  });

  it('should apply anti-starvation wait-time penalty accumulating +2 pts per minute up to +40 cap', () => {
    const scoreInitial = computePriorityScore({
      urgencyTier: 'YELLOW',
      patientAge: 40,
      isBookedAppointment: false,
      minutesWaiting: 0
    });

    const scoreAfter10Min = computePriorityScore({
      urgencyTier: 'YELLOW',
      patientAge: 40,
      isBookedAppointment: false,
      minutesWaiting: 10
    });

    const scoreAfter60Min = computePriorityScore({
      urgencyTier: 'YELLOW',
      patientAge: 40,
      isBookedAppointment: false,
      minutesWaiting: 60
    });

    assert.equal(scoreInitial, 50); // YELLOW = 50
    assert.equal(scoreAfter10Min, 70); // 50 + (10 * 2) = 70
    assert.equal(scoreAfter60Min, 90); // 50 + 40 (capped) = 90
  });

  it('should protect on-time booked patient with punctuality bonus against low-urgency walk-ins', () => {
    const bookedPatientScore = computePriorityScore({
      urgencyTier: 'YELLOW',
      patientAge: 35,
      isBookedAppointment: true,
      minutesWaiting: 0
    });

    const walkInRoutineScore = computePriorityScore({
      urgencyTier: 'ROUTINE',
      patientAge: 35,
      isBookedAppointment: false,
      minutesWaiting: 0
    });

    // Booked YELLOW (50 + 25 = 75) vs Walk-in ROUTINE (10)
    assert.ok(bookedPatientScore > walkInRoutineScore);
    assert.equal(bookedPatientScore, 75);
    assert.equal(walkInRoutineScore, 10);
  });

  it('should sort merged queue prioritizing higher score and earliest arrival', async () => {
    const store = new InMemoryTeleconsultStore();
    const queueUseCase = new TeleconsultQueueUseCase(store);

    const routineEntry = await queueUseCase.joinQueue({
      patientName: 'Sunita Devi',
      patientAge: 45,
      patientSex: 'female',
      doctorId: 'doc_1',
      specialty: 'Neurology',
      urgencyTier: 'ROUTINE',
      bookedBy: 'self'
    });

    const criticalWalkIn = await queueUseCase.joinQueue({
      patientName: 'Ram Kumar',
      patientAge: 68,
      patientSex: 'male',
      doctorId: 'doc_1',
      specialty: 'Neurology',
      urgencyTier: 'RED',
      highRiskFlags: ['Elderly', 'Hypertension'],
      bookedBy: 'worker',
      workerName: 'ASHA Manju Devi'
    });

    const status = await queueUseCase.getQueueStatus(criticalWalkIn.id);
    assert.ok(status);
    assert.equal(status.currentRank, 1); // Critical walk-in moves to #1 in queue
    assert.equal(status.activeDoctorName, 'Dr. Priya Sharma');
  });
});
