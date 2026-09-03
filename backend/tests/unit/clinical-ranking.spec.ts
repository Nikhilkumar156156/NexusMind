import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { rankFacilities } from '../../src/domain/rules/clinical-ranking.rules.ts';
import type { HospitalCandidate } from '../../src/domain/models/hospital.model.ts';
import type { RecommendationRequest } from '../../src/domain/models/recommendation.model.ts';

describe('Clinical Safety & Proximity Prioritization Rules', () => {
  it('should rank a nearby verified emergency center within 50 km ahead of a distant 92 km emergency center', () => {
    const nearbyEmergencyHospital: HospitalCandidate = {
      id: 'fac_sbmch',
      name: 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)',
      address: 'Hazaribagh',
      distanceKm: 2.8,
      hasEmergencyDepartment: true,
      hasRequiredSpecialty: true,
      specialtyMode: 'EMERGENCY_AND_OPD',
      emergencySpecialtyVerified: true,
      verificationStatus: 'verified',
      verificationNotes: '24x7 Emergency Trauma & Acute Stroke Centre.',
      contactNumber: '+91-6546-270100',
      sources: [{ type: 'official_website', url: 'https://sbmch.jharkhand.gov.in', reliability: 'primary' }]
    };

    const distantEmergencyHospital: HospitalCandidate = {
      id: 'fac_ranchi',
      name: 'Ranchi Super Specialty Hospital',
      address: 'Bariatu Road, Ranchi',
      distanceKm: 92.0,
      hasEmergencyDepartment: true,
      hasRequiredSpecialty: true,
      specialtyMode: 'EMERGENCY_AND_OPD',
      emergencySpecialtyVerified: true,
      verificationStatus: 'verified',
      verificationNotes: '24x7 Stroke center with active ICU.',
      contactNumber: '+91-651-2541234',
      sources: [{ type: 'official_website', url: 'https://ranchisuperspecialty.org', reliability: 'primary' }]
    };

    const request: RecommendationRequest = {
      urgency: 'CRITICAL',
      requiredSpecialty: 'Neurology',
      emergencyRequired: true,
      location: 'Hazaribagh',
      facilities: [distantEmergencyHospital, nearbyEmergencyHospital]
    };

    const response = rankFacilities(request);

    // Verify SBMC&H (2.8 km, emergency verified) is ranked #1 due to <= 50km priority!
    assert.equal(response.topFacilities[0].name, 'Sheikh Bhikhari Medical College & Hospital (SBMC&H)');
    assert.equal(response.topFacilities[0].rank, 1);
    assert.match(response.topFacilities[0].clinicalExplanation, /Top priority destination within 50 km/i);

    // Verify Ranchi (92 km) is ranked #2
    assert.equal(response.topFacilities[1].name, 'Ranchi Super Specialty Hospital');
    assert.equal(response.topFacilities[1].rank, 2);
  });

  it('should rank a distant verified emergency center ahead of a closer OPD-only facility when closer facility lacks emergency care', () => {
    const distantEmergencyHospital: HospitalCandidate = {
      id: 'fac_ranchi',
      name: 'Ranchi Super Specialty Hospital',
      address: 'Bariatu Road, Ranchi',
      distanceKm: 92.0,
      hasEmergencyDepartment: true,
      hasRequiredSpecialty: true,
      specialtyMode: 'EMERGENCY_AND_OPD',
      emergencySpecialtyVerified: true,
      verificationStatus: 'verified',
      verificationNotes: '24x7 Stroke center with active ICU.',
      contactNumber: '+91-651-2541234',
      sources: [{ type: 'official_website', url: 'https://ranchisuperspecialty.org', reliability: 'primary' }]
    };

    const closerOpdHospital: HospitalCandidate = {
      id: 'fac_sadar',
      name: 'Sadar Hospital Hazaribagh',
      address: 'Main Hospital Road, Hazaribagh',
      distanceKm: 3.2,
      hasEmergencyDepartment: true,
      hasRequiredSpecialty: true,
      specialtyMode: 'OPD_ONLY',
      emergencySpecialtyVerified: false,
      verificationStatus: 'partially_verified',
      verificationNotes: 'Neurology consultation on Tuesday OPD only.',
      contactNumber: '+91-6546-264210',
      sources: [{ type: 'government_directory', url: 'https://hazaribag.nic.in', reliability: 'high' }]
    };

    const request: RecommendationRequest = {
      urgency: 'CRITICAL',
      requiredSpecialty: 'Neurology',
      emergencyRequired: true,
      location: 'Hazaribagh',
      facilities: [closerOpdHospital, distantEmergencyHospital]
    };

    const response = rankFacilities(request);

    assert.equal(response.topFacilities[0].name, 'Ranchi Super Specialty Hospital');
    assert.equal(response.topFacilities[0].rank, 1);
    assert.equal(response.topFacilities[1].name, 'Sadar Hospital Hazaribagh');
    assert.equal(response.topFacilities[1].rank, 2);
  });
});
