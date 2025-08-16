import React, { useCallback, useState } from 'react';
import { Button } from './ui/button';
import type { UIMessage } from 'ai';
import { DeepThing } from './icons';

interface ThinkButtonProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onThinkModeToggle?: (isThinking: boolean) => void;
}

const ThinkButton: React.FC<ThinkButtonProps> = ({ 
  selectedModelId, 
  onModelChange, 
  onThinkModeToggle 
}) => {
  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const handleThinkClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      const newThinkingMode = !isThinkingMode;
      setIsThinkingMode(newThinkingMode);
      
      // Toggle between reasoning model and current selected model
      if (newThinkingMode) {
        // Store current model and switch to reasoning
        sessionStorage.setItem('previousModel', selectedModelId);
        onModelChange('chat-model-reasoning');
      } else {
        // Restore previous model or default
        const previousModel = sessionStorage.getItem('previousModel') || 'chat-model';
        onModelChange(previousModel);
        sessionStorage.removeItem('previousModel');
      }
      
      // Notify parent component about thinking mode change
      if (onThinkModeToggle) {
        onThinkModeToggle(newThinkingMode);
      }
    },
    [isThinkingMode, selectedModelId, onModelChange, onThinkModeToggle]
  );

  return (
    <Button
      data-testid="think-button"
      className={`rounded-full h-fit border transition-all duration-200 flex items-center gap-1 ${
        isThinkingMode 
          ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300' 
          : 'bg-transparent hover:bg-accent/20'
      }`}
      onClick={handleThinkClick}
      aria-label="Toggle Think Mode"
      variant="outline"
      size="default"
    >
      <DeepThing />
      <span>{isThinkingMode ? 'DeepThink ON' : 'DeepThink'}</span>
    </Button>
  );
};

export default ThinkButton;