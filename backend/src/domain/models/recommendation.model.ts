import type { HospitalCandidate } from './hospital.model.ts';
import type { UrgencyLevel } from './triage.model.ts';

export interface RankedFacility extends HospitalCandidate {
  readonly rank: number;
  readonly clinicalSuitabilityScore: number;
  readonly distanceScore: number;
  readonly totalScore: number;
  readonly clinicalExplanation: string;
}

export interface RecommendationRequest {
  readonly urgency: UrgencyLevel;
  readonly requiredSpecialty: string;
  readonly emergencyRequired: boolean;
  readonly location: string;
  readonly facilities: readonly HospitalCandidate[];
}

export interface RecommendationResponse {
  readonly location: string;
  readonly requiredSpecialty: string;
  readonly urgency: UrgencyLevel;
  readonly topFacilities: readonly RankedFacility[];
  readonly totalEvaluated: number;
}
