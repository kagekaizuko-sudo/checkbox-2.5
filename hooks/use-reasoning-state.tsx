
import { useState, useEffect, useCallback } from 'react';

interface ReasoningState {
  isLoading: boolean;
  isExpanded: boolean;
  showReasoned: boolean;
  isCollapsed: boolean;
}

interface WebSearchState {
  isActive: boolean;
  isSearching: boolean;
  results: any[];
  answer?: string;
  query?: string;
  error?: string;
}

export function useReasoningState(reasoning: string, isLoading: boolean) {
  const [state, setState] = useState<ReasoningState>({
    isLoading: false,
    isExpanded: false,
    showReasoned: false,
    isCollapsed: false,
  });

  useEffect(() => {
    if (isLoading && reasoning) {
      // Start reasoning phase
      setState({
        isLoading: true,
        isExpanded: true,
        showReasoned: false,
        isCollapsed: false,
      });
    } else if (reasoning && !isLoading && !state.isCollapsed) {
      // Reasoning complete - show success state
      setState(prev => ({
        ...prev,
        isLoading: false,
        showReasoned: true,
        isExpanded: true,
      }));
      
      // Auto-collapse after 3 seconds
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isExpanded: false,
          showReasoned: false,
          isCollapsed: true,
        }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, reasoning, state.isCollapsed]);

  const toggleExpanded = useCallback(() => {
    setState(prev => ({
      ...prev,
      isExpanded: !prev.isExpanded,
      showReasoned: false,
    }));
  }, []);

  const forceCollapse = useCallback(() => {
    setState(prev => ({
      ...prev,
      isExpanded: false,
      showReasoned: false,
      isCollapsed: true,
    }));
  }, []);

  return {
    ...state,
    toggleExpanded,
    forceCollapse,
  };
}
