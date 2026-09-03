import type { RecommendationRequest, RecommendationResponse } from '../../domain/models/recommendation.model.ts';
import { rankFacilities } from '../../domain/rules/clinical-ranking.rules.ts';

export class RankFacilitiesUseCase {
  async execute(request: RecommendationRequest): Promise<RecommendationResponse> {
    return rankFacilities(request);
  }
}
