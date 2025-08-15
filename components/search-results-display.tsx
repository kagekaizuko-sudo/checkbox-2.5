'use client';

import type { UIMessage } from 'ai';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface SearchResultsDisplayProps {
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
}

export function SearchResultsDisplay({ messages, setMessages }: SearchResultsDisplayProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleDataStream = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'web-search-results') {
        setResults(data.results);
        setError(null);
      } else if (data.type === 'error') {
        setError(data.message);
        setResults([]);
      }
    };

    if (typeof window !== 'undefined' && window.EventSource) {
      const source = new EventSource(`/api/chat?chatId=${messages[0]?.id}`);
      source.addEventListener('message', handleDataStream);
      return () => source.close();
    }
  }, [messages]);

  if (!results.length && !error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-muted rounded-lg border border-gray-200 dark:border-gray-700 mt-2"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Web Search Results</h3>
      {error && <p className="text-red-500">{error}</p>}
      {results.map((result, index) => (
        <div key={index} className="border-b border-gray-200 dark:border-gray-700 py-2 last:border-b-0">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            {result.title}
          </a>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
            {result.snippet}
          </p>
        </div>
      ))}
    </motion.div>
  );
}