import type { HospitalCandidate, HospitalSearchRequest, HospitalSearchResponse } from '../models/hospital.model.ts';

export interface RawSearchItem {
  readonly title: string;
  readonly snippet: string;
  readonly link: string;
  readonly sourceDomain?: string;
}

export interface ISearchToolPort {
  search(query: string, timeoutMs?: number): Promise<readonly RawSearchItem[]>;
  searchBatch(queries: readonly string[], timeoutMs?: number): Promise<readonly RawSearchItem[]>;
}

export interface IHospitalCachePort {
  findNearby(location: string, specialty: string, emergencyRequired: boolean): Promise<readonly HospitalCandidate[]>;
  save(candidate: HospitalCandidate): Promise<void>;
  saveBatch(candidates: readonly HospitalCandidate[]): Promise<void>;
}
