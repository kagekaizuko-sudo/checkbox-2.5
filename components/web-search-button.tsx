import React, { memo, useCallback } from 'react';
import { WebIcon } from './icons';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface WebSearchButtonProps {
  onClick: () => void;
  isGenerating?: boolean;
  status: string;
  isActive?: boolean;
}

function PureWebSearchButton({ onClick, isGenerating, status, isActive }: WebSearchButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isGenerating && status === 'ready') {
        onClick();
      }
    },
    [onClick, isGenerating, status],
  );

  return (
    <Button
      data-testid="web-search-button"
      className={cn(
        "flex items-center gap-1.5 rounded-2xl border px-2 py-1.5 h-fit text-sm transition-all duration-200",
        {
          // Active state - light background with subtle glow
          "bg-blue-50 dark:bg-blue-950/50  text-blue-600 dark:text-blue-400 shadow-sm": isActive,
          // Default state
          "disabled:opacity-50": !isActive,
        }
      )}
      onClick={handleClick}
      disabled={isGenerating || status !== 'ready'}
      variant="ghost"
    >
      <WebIcon/>
      <span>Search</span>
    </Button>
  );
}

export const WebSearchButton = memo(PureWebSearchButton);
