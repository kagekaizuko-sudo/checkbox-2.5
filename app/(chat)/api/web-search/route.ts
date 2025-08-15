import { NextResponse } from 'next/server';
import { exa } from 'exa-js';
import Redis from 'redis';

// Initialize Redis (for caching)
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);

const EXA_API_KEY = process.env.EXA_API_KEY;

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!EXA_API_KEY) {
    return NextResponse.json({ error: 'Exa API key not configured' }, { status: 500 });
  }

  // Check cache
  const cacheKey = `websearch:${query}`;
  const cachedResult = await redisClient.get(cacheKey);
  if (cachedResult) {
    return NextResponse.json(JSON.parse(cachedResult));
  }

  try {
    const exaClient = new exa(EXA_API_KEY);
    const searchResults = await exaClient.search({
      query,
      type: 'auto',
      use_autoprompt: true,
      num_results: 10,
    });

    // Fetch additional data (e.g., from NewsAPI)
    const additionalResults = await fetchAdditionalData(query);

    const filteredResults = [
      ...searchResults.results
        .filter((result: any) => result.score > 0.7)
        .map((result: any) => ({
          title: result.title,
          url: result.url,
          snippet: result.text,
          source: 'exa',
        })),
      ...additionalResults,
    ].slice(0, 15);

    // Cache the result for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify({ results: filteredResults }));

    return NextResponse.json({ results: filteredResults });
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json({ error: 'Failed to fetch web search results' }, { status: 500 });
  }
}

async function fetchAdditionalData(query: string) {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  if (!NEWS_API_KEY) return [];

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}&pageSize=5`
    );
    const data = await response.json();
    return data.articles.map((article: any) => ({
      title: article.title,
      url: article.url,
      snippet: article.description,
      source: 'news',
    }));
  } catch (error) {
    console.error('Additional data fetch error:', error);
    return [];
  }
}