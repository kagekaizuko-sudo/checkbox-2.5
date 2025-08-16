
import { NextResponse } from 'next/server';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!TAVILY_API_KEY) {
      return NextResponse.json({ error: 'Tavily API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query: query.trim(),
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
        include_domains: [],
        exclude_domains: []
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    const results = data.results?.map((result: any) => ({
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score,
      published_date: result.published_date,
    })) || [];

    return NextResponse.json({
      results,
      answer: data.answer,
      query: query.trim(),
    });
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch web search results' },
      { status: 500 }
    );
  }
}
