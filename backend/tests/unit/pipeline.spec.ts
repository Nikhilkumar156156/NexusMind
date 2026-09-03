import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CareNavigationPipelineUseCase } from '../../src/application/use-cases/pipeline.use-case.ts';
import { AssessTriageUseCase } from '../../src/application/use-cases/assess-triage.use-case.ts';
import { ResearchHospitalsUseCase } from '../../src/application/use-cases/research-hospitals.use-case.ts';
import { RankFacilitiesUseCase } from '../../src/application/use-cases/rank-facilities.use-case.ts';
import { InMemoryHospitalCacheAdapter } from '../../src/infrastructure/cache/in-memory-hospital.cache.ts';
import type { ISearchToolPort, RawSearchItem } from '../../src/domain/ports/search.port.ts';
import type { TriageInput } from '../../src/domain/models/triage.model.ts';

class MockPipelineSearchTool implements ISearchToolPort {
  private items: readonly RawSearchItem[];

  constructor(items: readonly RawSearchItem[]) {
    this.items = items;
  }

  async search(): Promise<readonly RawSearchItem[]> {
    return this.items;
  }

  async searchBatch(): Promise<readonly RawSearchItem[]> {
    return this.items;
  }
}

describe('3-Agent Care Navigation Pipeline Integration', () => {
  it('should execute full 3-Agent pipeline from clinical input to ranked recommendations', async () => {
    const mockSearchResults: RawSearchItem[] = [
      {
        title: 'Sadar Hospital Hazaribagh - Health Department',
        snippet: 'Sadar Hospital Hazaribagh OPD Schedule: Neurology consultation on Tuesdays. Emergency casualty on ground floor.',
        link: 'https://hazaribag.nic.in/health-facilities'
      },
      {
        title: 'Ranchi Super Specialty Hospital Emergency',
        snippet: '24x7 Emergency stroke unit and acute neurology ICU with on-call neurologist.',
        link: 'https://ranchisuperspecialty.org/neuro-emergency'
      }
    ];

    const triageUseCase = new AssessTriageUseCase();
    const searchTool = new MockPipelineSearchTool(mockSearchResults);
    const cache = new InMemoryHospitalCacheAdapter();
    const researchUseCase = new ResearchHospitalsUseCase(searchTool, cache);
    const rankUseCase = new RankFacilitiesUseCase();

    const pipeline = new CareNavigationPipelineUseCase(triageUseCase, researchUseCase, rankUseCase);

    const input: TriageInput = {
      age: 58,
      sex: 'female',
      location: 'Hazaribagh',
      primarySymptoms: 'Sudden left-sided facial drooping, weakness in left arm, slurred speech',
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

    const result = await pipeline.execute(input);

    assert.ok(result.sessionId);
    assert.equal(result.triage.urgency, 'CRITICAL');
    assert.equal(result.triage.requiredSpecialty, 'Neurology');
    assert.equal(result.recommendations.length, 2);

    // Verify Ranchi is ranked #1 due to Clinical Suitability > Proximity
    assert.equal(result.recommendations[0].name, 'Ranchi Super Specialty Hospital');
    assert.equal(result.recommendations[0].specialtyMode, 'EMERGENCY_AND_OPD');

    // Verify Sadar Hospital is ranked #2 due to OPD Only
    assert.equal(result.recommendations[1].name, 'Sadar Hospital Hazaribagh');
    assert.equal(result.recommendations[1].specialtyMode, 'OPD_ONLY');
  });
});
