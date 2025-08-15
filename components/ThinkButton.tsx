import React, { useCallback, useState } from 'react';
import { Button } from './ui/button'; // Adjusted path for components/ui/button.tsx
import { BrainCircuit } from 'lucide-react'; // Fallback for DeepThing, install with npm install lucide-react
import type { UIMessage } from 'ai'; // Import UIMessage for type safety
import { DeepThing } from './icons';

interface ThinkButtonProps {
  onModelChange: (modelId: string) => void;
  setMessages: (messages: UIMessage[]) => void;
}

const ThinkButton: React.FC<ThinkButtonProps> = ({ onModelChange, setMessages }) => {
  const [isThinking, setIsThinking] = useState(false);

  const handleThinkClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsThinking(true);
      if (typeof onModelChange === 'function') {
        onModelChange('chat-model-reasoning'); // Switch to reasoning mode
      }
      if (typeof setMessages === 'function') {
        setMessages((prev: UIMessage[]) => [...prev]); // Trigger re-render
      }
      setTimeout(() => setIsThinking(false), 200); // Reset after click effect
    },
    [onModelChange, setMessages]
  );

  return (
    <Button
      data-testid="think-button"
      className="rounded-full h-fit border transition-all bg-transparent duration-200 flex items-center gap-1"
      onClick={handleThinkClick}
      disabled={isThinking}
      aria-label="Activate Think Mode"
      variant="outline"
      size="default"
    >
      <DeepThing />
      <span>DeepThink</span>
    </Button>
  );
};

export default ThinkButton;