'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { Button } from './button';

interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface WebSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onAddToChat: (results: WebSearchResult[]) => void;
}

export function WebSearchModal({ open, onOpenChange, query, onAddToChat }: WebSearchModalProps) {
  const [results, setResults] = useState<WebSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);
    axios
      .post('/api/web-search', { query })
      .then((response) => {
        const data = response.data;
        if (data?.results && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setError('Invalid response format');
        }
      })
      .catch((err) => setError(err.response?.data?.error || 'An error occurred'))
      .finally(() => setIsLoading(false));
  }, [query]);

  const handleAddToChat = () => {
    onAddToChat(results.sort((a, b) => a.title.localeCompare(b.title)));
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg z-50">
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Web Search Results for "{query}"
          </Dialog.Title>
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: '60%' }}></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Searching the web...</p>
            </div>
          )}
          {error && !isLoading && <p className="text-red-500 text-center">{error}</p>}
          {!isLoading && !error && results.length === 0 && <p className="text-gray-500 text-center">No results found.</p>}
          {!isLoading && !error && results.length > 0 && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    {result.title}
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-3">
                    {result.snippet}
                  </p>
                </div>
              ))}
            </div>
          )}
          {!isLoading && !error && results.length > 0 && (
            <Button onClick={handleAddToChat} className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Add to Chat
            </Button>
          )}
          <Dialog.Close asChild>
            <button
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Close"
            >
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}