
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Globe, ExternalLink } from 'lucide-react';
import { Markdown } from './markdown';
import { cn } from '@/lib/utils';

interface WebSearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  published_date?: string;
}

interface WebSearchDisplayProps {
  isSearching: boolean;
  results: WebSearchResult[];
  answer?: string;
  query?: string;
  error?: string;
}

export function WebSearchDisplay({ 
  isSearching, 
  results, 
  answer, 
  query, 
  error 
}: WebSearchDisplayProps) {
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 mb-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <Globe size={16} />
          <span className="font-medium">Web Search Error</span>
        </div>
        <p className="text-red-700 dark:text-red-300 mt-2 text-sm">{error}</p>
      </div>
    );
  }

  if (!isSearching && (!results || results.length === 0)) {
    return null;
  }

  return (
    <div className="rounded-lg bg-muted/30 shadow-sm border border-dashed border-muted-foreground/20 p-4 mb-4">
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="searching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
          >
            <Loader2 className="animate-spin" size={16} />
            <div className="text-sm text-muted-foreground">
              Web Search
            </div>
            <div className="flex-1 bg-muted-foreground/20 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse rounded-full w-2/3" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe size={16} />
              <span>Web Search Results</span>
              {query && <span className="text-xs">• {query}</span>}
            </div>

            {answer && (
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Quick Answer
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <Markdown>{answer}</Markdown>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="border border-muted-foreground/20 rounded-lg p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-foreground line-clamp-1">
                          {result.title}
                        </h4>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex-shrink-0"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {new URL(result.url).hostname}
                      </p>
                      <div 
                        className={cn(
                          "text-sm text-muted-foreground cursor-pointer",
                          expandedResult === index ? "" : "line-clamp-2"
                        )}
                        onClick={() => setExpandedResult(
                          expandedResult === index ? null : index
                        )}
                      >
                        <Markdown>{result.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
