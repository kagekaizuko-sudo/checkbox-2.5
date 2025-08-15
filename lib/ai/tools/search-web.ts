import { exa } from 'exa-js';
import { ChatSDKError } from '@/lib/errors';
import type { Attachment, DataStream } from 'ai';

const EXA_API_KEY = process.env.EXA_API_KEY;

export const searchWeb = ({ session, dataStream }: { session: any; dataStream: DataStream }) => {
  return async ({ query, attachments }: { query: string; attachments?: Attachment[] }) => {
    try {
      if (!EXA_API_KEY) {
        throw new ChatSDKError('missing_config:exa_api_key', 'Web search is not configured.');
      }

      let enhancedQuery = query.trim();
      if (attachments?.length) {
        const attachmentText = await Promise.all(attachments.map(async (attachment) => {
          if (attachment.contentType.startsWith('image/')) {
            // Placeholder for OCR (implement with tesseract.js)
            return `Image content from ${attachment.name}`;
          } else if (attachment.contentType === 'application/pdf') {
            // Placeholder for PDF parsing (implement with pdf-parse)
            return `PDF content from ${attachment.name}`;
          } else if (attachment.contentType === 'text/plain') {
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

      const exaClient = new exa(EXA_API_KEY);
      const searchResults = await exaClient.search({
        query: enhancedQuery,
        type: 'auto',
        use_autoprompt: true,
        num_results: 5,
      });

      const filteredResults = searchResults.results
        .filter((result: any) => result.score > 0.7)
        .map((result: any) => ({
          title: result.title,
          url: result.url,
          snippet: result.text.slice(0, 200),
        }));

      dataStream.writeData({
        type: 'web-search-results',
        results: filteredResults,
      });

      return {
        results: filteredResults,
        message: `Found ${filteredResults.length} relevant web results for "${query}"${attachments?.length ? ' with attachments' : ''}.`,
      };
    } catch (error) {
      console.error('Web search error:', error);
      dataStream.writeData({
        type: 'error',
        message: `Web search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      throw new ChatSDKError('internal:web_search', 'Web search execution failed.');
    }
  };
};