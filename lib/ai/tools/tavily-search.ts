
import { ChatSDKError } from '@/lib/errors';
import type { Attachment, DataStream } from 'ai';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export const tavilySearch = ({ session, dataStream }: { session: any; dataStream: DataStream }) => {
  return async ({ query, attachments }: { query: string; attachments?: Attachment[] }) => {
    try {
      if (!TAVILY_API_KEY) {
        throw new ChatSDKError('missing_config:tavily_api_key', 'Tavily API key not configured.');
      }

      let enhancedQuery = query.trim();
      if (attachments?.length) {
        const attachmentText = await Promise.all(attachments.map(async (attachment) => {
          if (attachment.contentType === 'text/plain') {
            const response = await fetch(attachment.url);
            return await response.text();
          }
          return '';
        }));
        enhancedQuery += ` ${attachmentText.filter((text) => text).join(' ')}`;
      }

      if (!enhancedQuery) {
        throw new ChatSDKError('invalid_input', 'No valid query or attachment content');
      }

      // Stream search status
      dataStream.writeData({
        type: 'web-search-status',
        status: 'searching',
        query: enhancedQuery,
      });

      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TAVILY_API_KEY}`,
        },
        body: JSON.stringify({
          query: enhancedQuery,
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

      const searchData = await response.json();
      
      const filteredResults = searchData.results?.map((result: any) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: result.score,
        published_date: result.published_date,
      })) || [];

      // Stream search results
      dataStream.writeData({
        type: 'web-search-results',
        results: filteredResults,
        answer: searchData.answer,
        query: enhancedQuery,
      });

      dataStream.writeData({
        type: 'web-search-status',
        status: 'completed',
        query: enhancedQuery,
      });

      return {
        results: filteredResults,
        answer: searchData.answer,
        message: `Found ${filteredResults.length} relevant web results for "${query}". ${searchData.answer ? `\n\nDirect Answer: ${searchData.answer}` : ''}`,
        sources: filteredResults.map((r: any) => ({ title: r.title, url: r.url })),
      };
    } catch (error) {
      console.error('Tavily search error:', error);
      dataStream.writeData({
        type: 'web-search-status',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new ChatSDKError('internal:web_search', 'Web search execution failed.');
    }
  };
};
