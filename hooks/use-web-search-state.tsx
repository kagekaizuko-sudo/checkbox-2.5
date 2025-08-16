
import { useState, useCallback } from 'react';

interface WebSearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  published_date?: string;
}

interface WebSearchState {
  isActive: boolean;
  isSearching: boolean;
  results: WebSearchResult[];
  answer?: string;
  query?: string;
  error?: string;
}

export function useWebSearchState() {
  const [state, setState] = useState<WebSearchState>({
    isActive: false,
    isSearching: false,
    results: [],
    answer: undefined,
    query: undefined,
    error: undefined,
  });

  const activateSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      error: undefined,
    }));
  }, []);

  const deactivateSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      isSearching: false,
      query: undefined,
    }));
  }, []);

  const startSearch = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      isSearching: true,
      query,
      results: [],
      answer: undefined,
      error: undefined,
    }));
  }, []);

  const setResults = useCallback((results: WebSearchResult[], answer?: string) => {
    setState(prev => ({
      ...prev,
      isSearching: false,
      results,
      answer,
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isSearching: false,
      error,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      results: [],
      answer: undefined,
      error: undefined,
      query: undefined,
      isSearching: false,
    }));
  }, []);

  return {
    ...state,
    activateSearch,
    deactivateSearch,
    startSearch,
    setResults,
    setError,
    clearSearch,
  };
}
