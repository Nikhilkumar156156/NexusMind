import type {
  HospitalCandidate,
  HospitalSearchRequest,
  HospitalSearchResponse,
  HospitalSource
} from '../../domain/models/hospital.model.ts';
import type { ISearchToolPort, IHospitalCachePort, RawSearchItem } from '../../domain/ports/search.port.ts';
import {
  classifySpecialtyMode,
  classifySourceReliability,
  determineVerificationStatus
} from '../../domain/rules/verification.rules.ts';

export class ResearchHospitalsUseCase {
  private readonly searchTool: ISearchToolPort;
  private readonly hospitalCache: IHospitalCachePort;

  constructor(
    searchTool: ISearchToolPort,
    hospitalCache: IHospitalCachePort
  ) {
    this.searchTool = searchTool;
    this.hospitalCache = hospitalCache;
  }

  async execute(request: HospitalSearchRequest): Promise<HospitalSearchResponse> {
    const { location, requiredSpecialty, emergencyRequired, searchQueries } = request;

    let facilities: HospitalCandidate[] = [];

    try {
      // 1. Execute dynamic web research via Google Search MCP
      const rawItems = await this.searchTool.searchBatch(searchQueries, 8000);

      if (rawItems.length > 0) {
        facilities = this.parseRawSearchResults(rawItems, location, requiredSpecialty);
        // Cache newly researched facilities asynchronously
        await this.hospitalCache.saveBatch(facilities);
      }
    } catch (err: unknown) {
      // Fallback gracefully on search failure or timeout
      console.warn('Google Search MCP failed or timed out. Falling back to local cache.', err);
    }

    // 2. If no facilities discovered via web search, fall back to regional cache
    if (facilities.length === 0) {
      const cached = await this.hospitalCache.findNearby(location, requiredSpecialty, emergencyRequired);
      facilities = [...cached];
    }

    return {
      searchLocation: location,
      requiredSpecialty,
      emergencyRequired,
      facilities
    };
  }

  private parseRawSearchResults(
    items: readonly RawSearchItem[],
    location: string,
    specialty: string
  ): HospitalCandidate[] {
    // Group search items by hospital name (deduplication)
    const grouped = new Map<string, RawSearchItem[]>();

    for (const item of items) {
      const hospitalName = this.extractHospitalName(item.title, location);
      if (!hospitalName) continue;

      const existing = grouped.get(hospitalName) ?? [];
      existing.push(item);
      grouped.set(hospitalName, existing);
    }

    const candidates: HospitalCandidate[] = [];

    for (const [name, itemList] of grouped.entries()) {
      const snippets = itemList.map((i) => `${i.title}. ${i.snippet}`);
      const classification = classifySpecialtyMode(snippets, specialty);

      const sources: HospitalSource[] = itemList.map((i) => {
        const { type, reliability } = classifySourceReliability(i.link);
        return { type, url: i.link, reliability };
      });

      const verificationStatus = determineVerificationStatus(
        sources,
        classification.emergencySpecialtyVerified
      );

      const phoneMatch = snippets.join(' ').match(/(\+91[\s-]?[6-9]\d{9}|0\d{2,4}[\s-]?\d{6,8})/);
      const contactNumber = phoneMatch ? phoneMatch[0] : null;

      candidates.push({
        id: `hosp_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name,
        address: `${name}, ${location}`,
        distanceKm: this.estimateDistanceKm(name, location),
        hasEmergencyDepartment: classification.hasEmergencyDepartment,
        hasRequiredSpecialty: true,
        specialtyMode: classification.specialtyMode,
        emergencySpecialtyVerified: classification.emergencySpecialtyVerified,
        verificationStatus,
        verificationNotes: classification.verificationNotes,
        contactNumber,
        sources
      });
    }

    return candidates;
  }

  private extractHospitalName(title: string, location: string): string | null {
    // Basic extraction heuristic targeting hospital/clinic naming
    const match = title.match(/([A-Za-z0-9\s]+(?:Hospital|Medical College|Health Centre|Clinic|Institute))/i);
    if (match) {
      const extracted = match[1].trim();
      if (title.toLowerCase().includes('sadar hospital') && !extracted.toLowerCase().includes(location.toLowerCase())) {
        return `${extracted} ${location}`;
      }
      return extracted;
    }
    if (title.toLowerCase().includes('sadar hospital')) {
      return `Sadar Hospital ${location}`;
    }
    return null;
  }

  private estimateDistanceKm(name: string, location: string): number {
    // Deterministic distance heuristic for local vs regional referral centers
    if (name.toLowerCase().includes(location.toLowerCase())) {
      return 3.5;
    }
    return 85.0; // Regional tertiary facility
  }
}
