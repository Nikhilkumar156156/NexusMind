import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifySpecialtyMode,
  determineVerificationStatus,
  classifySourceReliability
} from '../../src/domain/rules/verification.rules.ts';

describe('Clinical Safety: OPD vs. Emergency Verification Invariants', () => {
  it('should classify facility as OPD_ONLY when snippets indicate outpatient clinic only', () => {
    const snippets = [
      'Sadar Hospital Hazaribagh OPD Schedule: Neurology consultation every Tuesday from 9:00 AM to 1:00 PM.',
      'Outpatient clinic registration open till 12:00 PM. No emergency neurological ICU admission.'
    ];

    const result = classifySpecialtyMode(snippets, 'Neurology');

    assert.equal(result.specialtyMode, 'OPD_ONLY');
    assert.equal(result.hasEmergencyDepartment, true); // Hospital has casualty/emergency desk
    assert.equal(result.emergencySpecialtyVerified, false); // But neurology specialty is OPD only!
    assert.match(result.verificationNotes, /OPD only|outpatient/i);
  });

  it('should classify facility as EMERGENCY_AND_OPD when 24x7 acute emergency and ICU coverage are confirmed', () => {
    const snippets = [
      'Ranchi Super Specialty Hospital Emergency Department: 24x7 Comprehensive Stroke Center with on-call Neurologist and Neuro-ICU.',
      'Emergency admission open 24 hours for acute trauma, neurology, and cardiology emergencies.'
    ];

    const result = classifySpecialtyMode(snippets, 'Neurology');

    assert.equal(result.specialtyMode, 'EMERGENCY_AND_OPD');
    assert.equal(result.hasEmergencyDepartment, true);
    assert.equal(result.emergencySpecialtyVerified, true);
  });

  it('should mark emergency specialty as unverified when information is ambiguous or missing', () => {
    const snippets = [
      'City Health Clinic offers general healthcare and dental services in Hazaribagh.'
    ];

    const result = classifySpecialtyMode(snippets, 'Neurology');

    assert.equal(result.emergencySpecialtyVerified, false);
    assert.equal(result.specialtyMode, 'UNKNOWN');
    assert.match(result.verificationNotes, /not verified/i);
  });
});

describe('Source Reliability & Trust Hierarchy', () => {
  it('should rank official hospital domain as primary source with verified status', () => {
    const sources = [
      { url: 'https://ranchihospital.org/emergency', type: 'official_website' as const, reliability: 'primary' as const }
    ];

    const status = determineVerificationStatus(sources, true);
    assert.equal(status, 'verified');
  });

  it('should rank government health portal as high reliability', () => {
    const reliability = classifySourceReliability('https://hazaribag.nic.in/health-facilities');
    assert.equal(reliability.type, 'government_directory');
    assert.equal(reliability.reliability, 'high');
  });

  it('should classify unverified forum or aggregator as low reliability and unverified status', () => {
    const sources = [
      { url: 'https://random-forum.example.com/topic/123', type: 'other' as const, reliability: 'low' as const }
    ];

    const status = determineVerificationStatus(sources, false);
    assert.equal(status, 'unverified');
  });
});
