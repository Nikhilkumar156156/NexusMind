import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTriage } from '../../src/domain/rules/triage-rules.ts';
import type { TriageInput } from '../../src/domain/models/triage.model.ts';

describe('Clinical Safety: Agent 1 Triage Invariants', () => {
  it('should immediately escalate to CRITICAL urgency when FAST stroke red-flags are present', () => {
    const input: TriageInput = {
      age: 58,
      sex: 'female',
      location: 'Hazaribagh',
      primarySymptoms: 'Sudden left-sided facial drooping and slurred speech',
      duration: '45 minutes',
      severity: 'severe',
      redFlags: {
        facialDroopOrSpeech: true,
        chestPain: false,
        breathingDistress: false,
        unconsciousOrConfusion: false,
        severeBleeding: false
      }
    };

    const assessment = evaluateTriage(input);

    assert.equal(assessment.urgency, 'CRITICAL');
    assert.equal(assessment.emergencyRequired, true);
    assert.equal(assessment.requiredSpecialty, 'Neurology');
    assert.equal(assessment.conditionCategory, 'Suspected Acute Neurological Emergency');
    // Verify non-definitive diagnosis invariant: does NOT say "You have a stroke"
    assert.doesNotMatch(assessment.clinicalRoutingAdvice, /you have a stroke/i);
    assert.match(assessment.clinicalRoutingAdvice, /possible acute neurological emergency/i);
  });

  it('should escalate crushing chest pain to CRITICAL cardiology emergency', () => {
    const input: TriageInput = {
      age: 62,
      sex: 'male',
      location: 'Ranchi',
      primarySymptoms: 'Heavy pressure in center of chest radiating to jaw and shoulder',
      duration: '20 minutes',
      severity: 'severe',
      redFlags: {
        facialDroopOrSpeech: false,
        chestPain: true,
        breathingDistress: false,
        unconsciousOrConfusion: false,
        severeBleeding: false
      }
    };

    const assessment = evaluateTriage(input);

    assert.equal(assessment.urgency, 'CRITICAL');
    assert.equal(assessment.emergencyRequired, true);
    assert.equal(assessment.requiredSpecialty, 'Cardiology');
  });

  it('should classify non-red-flag moderate symptoms as URGENT without emergency department mandate', () => {
    const input: TriageInput = {
      age: 34,
      sex: 'male',
      location: 'Bokaro',
      primarySymptoms: 'Persistent low-grade fever with mild productive cough',
      duration: '3 days',
      severity: 'moderate',
      redFlags: {
        facialDroopOrSpeech: false,
        chestPain: false,
        breathingDistress: false,
        unconsciousOrConfusion: false,
        severeBleeding: false
      }
    };

    const assessment = evaluateTriage(input);

    assert.equal(assessment.urgency, 'URGENT');
    assert.equal(assessment.emergencyRequired, false);
    assert.equal(assessment.requiredSpecialty, 'General Medicine');
  });
});
