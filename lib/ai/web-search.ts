import { ChatSDKError } from '@/lib/errors';
import { nanoid } from 'nanoid';
import { isProductionEnvironment } from '@/lib/constants';

// Telemetry logger
const logTelemetry = async (event: string, data: Record<string, any>) => {
  if (isProductionEnvironment) {
    console.log(`[Telemetry] ${event}`, JSON.stringify(data, null, 2));
  }
};

// Retry logic with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 300): Promise<Response> {
  try {
    const startTime = Date.now();
    const response = await fetch(url, options);
    const latency = Date.now() - startTime;

    await logTelemetry('web_search_request', {
      url,
      status: response.status,
      latency_ms: latency,
      retry_count: 0,
    });

    if (!response.ok) {
      throw new Error(`Serper API responded with status ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      await logTelemetry('web_search_retry', {
        url,
        error: error.message,
        retries_remaining: retries - 1,
        backoff_ms: backoff,
      });
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function performWebSearch(query: string): Promise<any[]> {
  if (!query.trim()) {
    throw new ChatSDKError('bad_request:web_search', 'Search query cannot be empty');
  }

  const searchId = nanoid();

  try {
    const startTime = Date.now();
    const response = await fetchWithRetry(
      'https://google.serper.dev/search',
      {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query }),
      },
      3,
      300
    );

    const data = await response.json();
    const results = (data.organic || []).map((result: any) => ({
      title: result.title,
      snippet: result.snippet,
      url: result.link,
    }));

    const latency = Date.now() - startTime;
    await logTelemetry('web_search_success', {
      query,
      search_id: searchId,
      result_count: results.length,
      latency_ms: latency,
    });

    return results;
  } catch (error) {
    await logTelemetry('web_search_error', {
      query,
      search_id: searchId,
      error: error.message,
    });
    throw new ChatSDKError('internal:web_search', 'Failed to fetch web search results');
  }
}

export const webSearchTool = {
  name: 'searchWeb',
  description: 'Perform a web search to fetch real-time information.',
  execute: async ({ query }: { query: string }) => {
    const results = await performWebSearch(query);
    return {
      results,
      metadata: {
        query,
        timestamp: new Date().toISOString(),
      },
    };
  },
};