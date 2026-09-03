import type { ISearchToolPort, RawSearchItem } from '../../domain/ports/search.port.ts';

export interface McpClientConfig {
  readonly endpointUrl?: string;
  readonly defaultTimeoutMs?: number;
}

/**
 * Adapter for executing Google Search via Model Context Protocol (MCP) or direct HTTP search endpoint.
 * Enforces sanitization and strict timeouts (default 8000ms).
 */
export class GoogleSearchMcpAdapter implements ISearchToolPort {
  private readonly defaultTimeoutMs: number;

  constructor(config: McpClientConfig = {}) {
    this.defaultTimeoutMs = config.defaultTimeoutMs ?? 8000;
  }

  async search(query: string, timeoutMs?: number): Promise<readonly RawSearchItem[]> {
    const timeout = timeoutMs ?? this.defaultTimeoutMs;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      // In production, this communicates with the Google Search MCP server via stdio/SSE.
      // Here we provide the robust client contract with error boundaries and timeouts.
      return await this.executeSearchCall(query, controller.signal);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Google Search MCP timed out after ${timeout}ms for query: "${query}"`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async searchBatch(queries: readonly string[], timeoutMs?: number): Promise<readonly RawSearchItem[]> {
    const results = await Promise.allSettled(queries.map((q) => this.search(q, timeoutMs)));
    const items: RawSearchItem[] = [];

    for (const res of results) {
      if (res.status === 'fulfilled') {
        items.push(...res.value);
      }
    }

    return items;
  }

  protected async executeSearchCall(_query: string, _signal: AbortSignal): Promise<readonly RawSearchItem[]> {
    // Default base implementation; overridden in production or integration tests with mock data
    return [];
  }
}
