import type { TriageInput, TriageAssessment } from '../../domain/models/triage.model.ts';
import type { RankedFacility } from '../../domain/models/recommendation.model.ts';
import { AssessTriageUseCase } from './assess-triage.use-case.ts';
import { ResearchHospitalsUseCase } from './research-hospitals.use-case.ts';
import { RankFacilitiesUseCase } from './rank-facilities.use-case.ts';

export interface PipelineExecutionResult {
  readonly sessionId: string;
  readonly triage: TriageAssessment;
  readonly recommendations: readonly RankedFacility[];
  readonly meta: {
    readonly latencyMs: number;
    readonly agentsInvoked: readonly string[];
    readonly searchLocation: string;
    readonly totalCandidates: number;
  };
}

export class CareNavigationPipelineUseCase {
  private readonly triageUseCase: AssessTriageUseCase;
  private readonly researchUseCase: ResearchHospitalsUseCase;
  private readonly rankUseCase: RankFacilitiesUseCase;

  constructor(
    triageUseCase: AssessTriageUseCase,
    researchUseCase: ResearchHospitalsUseCase,
    rankUseCase: RankFacilitiesUseCase
  ) {
    this.triageUseCase = triageUseCase;
    this.researchUseCase = researchUseCase;
    this.rankUseCase = rankUseCase;
  }

  async execute(input: TriageInput): Promise<PipelineExecutionResult> {
    const startTime = Date.now();

    // 1. AGENT 1: Clinical Symptom & Triage Assessment
    const triage = await this.triageUseCase.execute(input);

    // 2. AGENT 2: Google Search MCP Research (PII ISOLATION: passes only location + specialty + queries)
    const hospitalSearch = await this.researchUseCase.execute({
      location: input.location,
      requiredSpecialty: triage.requiredSpecialty,
      emergencyRequired: triage.emergencyRequired,
      searchQueries: triage.searchQueries
    });

    // 3. AGENT 3: Clinical Suitability > Proximity Ranking & Plain-Language Justification
    const rankedResponse = await this.rankUseCase.execute({
      urgency: triage.urgency,
      requiredSpecialty: triage.requiredSpecialty,
      emergencyRequired: triage.emergencyRequired,
      location: input.location,
      facilities: hospitalSearch.facilities
    });

    const latencyMs = Date.now() - startTime;

    return {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      triage,
      recommendations: rankedResponse.topFacilities,
      meta: {
        latencyMs,
        agentsInvoked: ['symptom-triage-agent', 'hospital-research-agent', 'facility-recommendation-agent'],
        searchLocation: input.location,
        totalCandidates: hospitalSearch.facilities.length
      }
    };
  }
}
