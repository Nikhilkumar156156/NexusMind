import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchHospitalsUseCase } from '../../src/application/use-cases/research-hospitals.use-case.ts';
import { InMemoryHospitalCacheAdapter } from '../../src/infrastructure/cache/in-memory-hospital.cache.ts';
import type { ISearchToolPort, RawSearchItem } from '../../src/domain/ports/search.port.ts';
import type { HospitalCandidate } from '../../src/domain/models/hospital.model.ts';

class MockSearchTool implements ISearchToolPort {
  private items: readonly RawSearchItem[];
  private shouldFail: boolean;

  constructor(items: readonly RawSearchItem[] = [], shouldFail = false) {
    this.items = items;
    this.shouldFail = shouldFail;
  }

  async search(): Promise<readonly RawSearchItem[]> {
    if (this.shouldFail) throw new Error('Search tool unavailable');
    return this.items;
  }

  async searchBatch(): Promise<readonly RawSearchItem[]> {
    if (this.shouldFail) throw new Error('Search tool unavailable');
    return this.items;
  }
}

describe('Agent 2: Hospital Research & Verification Orchestration', () => {
  it('should discover facilities dynamically and classify OPD vs Emergency from search results', async () => {
    const mockItems: RawSearchItem[] = [
      {
        title: 'Sadar Hospital Hazaribagh - Health Department',
        snippet: 'Sadar Hospital Hazaribagh OPD Schedule: Neurology consultation on Tuesdays. Emergency casualty on ground floor.',
        link: 'https://hazaribag.nic.in/health-facilities'
      },
      {
        title: 'Ranchi Super Specialty Hospital Emergency',
        snippet: '24x7 Emergency stroke unit and acute neurology ICU with on-call neurologist.',
        link: 'https://ranchihospital.org/neuro-emergency'
      }
    ];

    const searchTool = new MockSearchTool(mockItems);
    const cache = new InMemoryHospitalCacheAdapter();
    const useCase = new ResearchHospitalsUseCase(searchTool, cache);

    const response = await useCase.execute({
      location: 'Hazaribagh',
      requiredSpecialty: 'Neurology',
      emergencyRequired: true,
      searchQueries: ['neurology emergency hospital near Hazaribagh']
    });

    assert.equal(response.facilities.length, 2);

    const sadar = response.facilities.find((f) => f.name.includes('Sadar Hospital'));
    assert.ok(sadar);
    assert.equal(sadar.specialtyMode, 'OPD_ONLY');
    assert.equal(sadar.emergencySpecialtyVerified, false);

    const ranchi = response.facilities.find((f) => f.name.includes('Ranchi Super Specialty'));
    assert.ok(ranchi);
    assert.equal(ranchi.specialtyMode, 'EMERGENCY_AND_OPD');
    assert.equal(ranchi.emergencySpecialtyVerified, true);
    assert.equal(ranchi.verificationStatus, 'verified');
  });

  it('should gracefully fall back to local cached facilities if search tool fails or times out', async () => {
    const cachedFacility: HospitalCandidate = {
      id: 'hosp_cached_1',
      name: 'District Civil Hospital Hazaribagh',
      address: 'District Hospital, Hazaribagh',
      distanceKm: 4.0,
      hasEmergencyDepartment: true,
      hasRequiredSpecialty: true,
      specialtyMode: 'OPD_ONLY',
      emergencySpecialtyVerified: false,
      verificationStatus: 'verified',
      verificationNotes: 'Pre-seeded official district health registry data.',
      contactNumber: '+91-6546-222222',
      sources: [{ type: 'government_directory', url: 'https://nhm.gov.in', reliability: 'high' }]
    };

    const failingSearchTool = new MockSearchTool([], true);
    const cache = new InMemoryHospitalCacheAdapter([cachedFacility]);
    const useCase = new ResearchHospitalsUseCase(failingSearchTool, cache);

    const response = await useCase.execute({
      location: 'Hazaribagh',
      requiredSpecialty: 'Neurology',
      emergencyRequired: true,
      searchQueries: ['neurology emergency hospital near Hazaribagh']
    });

    assert.equal(response.facilities.length, 1);
    assert.equal(response.facilities[0].name, 'District Civil Hospital Hazaribagh');
  });
});
