import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryTeleconsultStore } from '../../src/infrastructure/cache/teleconsult.cache.ts';
import { TeleconsultSessionUseCase } from '../../src/application/use-cases/teleconsult-session.use-case.ts';

describe('Feature 02: Consultation Degrading Modes & Vitals Reliability Tagging', () => {
  it('should start consultation in Video mode and seamlessly degrade to Audio-only and In-App Chat', async () => {
    const store = new InMemoryTeleconsultStore();
    const sessionUseCase = new TeleconsultSessionUseCase(store);

    const consultationId = 'CON-TEST-101';
    const session = await sessionUseCase.startSession(
      consultationId,
      'APT-123',
      'Geeta Devi',
      'doc_1',
      'Dr. Priya Sharma',
      'Neurology',
      'video'
    );

    assert.equal(session.modeUsed, 'video');
    assert.equal(session.modeDegraded, false);

    // Bandwidth drops -> Degrade to Audio
    const audioSession = await sessionUseCase.switchMode(consultationId, 'audio');
    assert.ok(audioSession);
    assert.equal(audioSession.modeUsed, 'audio');
    assert.equal(audioSession.modeDegraded, true);

    // Severe packet loss -> Fallback to Session In-App Chat
    const chatSession = await sessionUseCase.switchMode(consultationId, 'chat');
    assert.ok(chatSession);
    assert.equal(chatSession.modeUsed, 'chat');
  });

  it('should exchange session-scoped in-app chat messages tied to consultation_id', async () => {
    const store = new InMemoryTeleconsultStore();
    const sessionUseCase = new TeleconsultSessionUseCase(store);
    const consultationId = 'CON-TEST-102';

    await sessionUseCase.sendMessage({
      consultationId,
      sender: 'doctor',
      senderName: 'Dr. Priya Sharma',
      messageText: 'Please share current blood pressure reading if available.'
    });

    await sessionUseCase.sendMessage({
      consultationId,
      sender: 'worker',
      senderName: 'ASHA Sarita',
      messageText: 'BP measured via cuff is 138/88 mmHg, pulse 76.'
    });

    const messages = await sessionUseCase.getMessages(consultationId);
    assert.equal(messages.length, 2);
    assert.equal(messages[0].sender, 'doctor');
    assert.equal(messages[1].sender, 'worker');
    assert.match(messages[1].messageText, /138\/88/);
  });

  it('should tag vitals with data reliability source (worker_verified vs self_reported)', async () => {
    const store = new InMemoryTeleconsultStore();
    const sessionUseCase = new TeleconsultSessionUseCase(store);
    const consultationId = 'CON-TEST-103';

    // 1. Worker verified vitals (High Clinical Confidence)
    const workerVital = await sessionUseCase.recordVitals({
      consultationId,
      patientId: 'PAT-1',
      type: 'bp',
      label: 'Blood Pressure',
      value: '130/85',
      unit: 'mmHg',
      source: 'worker_verified'
    });

    // 2. Self-reported vitals (Layperson confidence warning)
    const patientVital = await sessionUseCase.recordVitals({
      consultationId,
      patientId: 'PAT-2',
      type: 'spo2',
      label: 'Oxygen Saturation',
      value: '97',
      unit: '%',
      source: 'self_reported'
    });

    assert.equal(workerVital.source, 'worker_verified');
    assert.equal(patientVital.source, 'self_reported');
  });

  it('should finalize doctor clinical documentation with prescription, referral, and diagnostic orders', async () => {
    const store = new InMemoryTeleconsultStore();
    const sessionUseCase = new TeleconsultSessionUseCase(store);
    const consultationId = 'CON-TEST-104';

    await sessionUseCase.startSession(consultationId, undefined, 'Manoj Kumar', 'doc_1', 'Dr. Priya Sharma', 'Neurology');

    const finalized = await sessionUseCase.finalizeConsultation({
      consultationId,
      doctorNotes: 'Patient presents with tension headache; neurological exam normal.',
      differentialDiagnosis: 'Tension-type Headache / Cervical Strain',
      prescription: [
        { medicineName: 'Tab Paracetamol', dosage: '500mg', frequency: 'SOS (as needed)', durationDays: 3, instructions: 'After meals with water' },
        { medicineName: 'Tab Naproxen', dosage: '250mg', frequency: '1-0-1', durationDays: 5, instructions: 'Twice daily' }
      ],
      referralFlag: false,
      diagnosticOrderFlag: true,
      diagnosticTestsOrdered: ['CBC', 'Serum Electrolytes'],
      followUpFlag: true,
      followUpDays: 7
    });

    assert.ok(finalized);
    assert.equal(finalized.prescription.length, 2);
    assert.equal(finalized.diagnosticOrderFlag, true);
    assert.equal(finalized.followUpDays, 7);
  });
});
