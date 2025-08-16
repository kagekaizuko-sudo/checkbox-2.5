'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, DeepThing } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Markdown } from './markdown';

interface MessageReasoningProps {
  isLoading: boolean;
  reasoning: string;
}

export function MessageReasoning({ isLoading, reasoning }: MessageReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Keep expanded during loading and for longer after completion
    if (isLoading) {
      setIsExpanded(true);
    } else if (reasoning) {
      // Auto-collapse after 5 seconds instead of 2
      const timeout = setTimeout(() => setIsExpanded(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, reasoning]);

  if (!reasoning) return null;

  const variants = {
    collapsed: { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 },
    expanded: { height: 'auto', opacity: 1, marginTop: '1rem', marginBottom: '0.5rem' },
  };

  return (
    <div className="flex flex-col rounded-lg bg-muted shadow-sm p-2">
      <style jsx>{`
        .shine-text-dark {
          background: linear-gradient(
            90deg,
            rgba(156, 163, 175, 0.6) 0%,
            rgba(156, 163, 175, 0.6) 40%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(156, 163, 175, 0.6) 60%,
            rgba(156, 163, 175, 0.6) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: smooth-shine 2s linear infinite;
          font-weight: 500;
          will-change: background-position;
        }

        .dots-loader {
          display: inline-flex;
          gap: 2px;
          align-items: center;
        }

        .dots-loader span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(156, 163, 175, 0.8);
          animation: dots-bounce 1.4s ease-in-out infinite both;
        }

        .dots-loader span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .dots-loader span:nth-child(2) {
          animation-delay: -0.16s;
        }

        .dots-loader span:nth-child(3) {
          animation-delay: 0s;
        }

        @keyframes smooth-shine {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes dots-bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @supports not (-webkit-background-clip: text) {
          .shine-text-dark {
            color: rgba(156, 163, 175, 0.8);
            animation: text-glow 2s ease-in-out infinite;
          }

          @keyframes text-glow {
            0%, 100% {
              opacity: 0.6;
              text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
            }
            50% {
              opacity: 1;
              text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
            }
          }
        }

        .chevron {
          transition: transform 0.2s ease-in-out;
        }
        .chevron.expanded {
          transform: rotate(180deg);
        }
      `}</style>

      {isLoading ? (
        <div className="flex flex-row gap-2 w-fit rounded-xl p-1.5 items-center">
          <DeepThing />
          <div className="shine-text-background">Thinking</div>
          <div className="dots-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <button
            data-testid="message-reasoning-toggle"
            type="button"
            className="cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className={`chevron ${isExpanded ? 'expanded' : ''}`}>
            
            </div>
          </button>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium">Reasoned for a few seconds</div>
          <button
            data-testid="message-reasoning-toggle"
            type="button"
            className="cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className={`chevron ${isExpanded ? 'expanded' : ''}`} >
            <ChevronDownIcon  />
            </div>
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            data-testid="message-reasoning"
            key="content"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="pl-4 text-zinc-600 dark:text-zinc-400 flex flex-col gap-4"
          >
            <Markdown className="space-y-6">{reasoning}</Markdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
