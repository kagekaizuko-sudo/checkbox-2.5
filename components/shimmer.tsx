"use client";

import React from 'react';

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ShimmerText({ children, className = '', ...rest }: ShimmerTextProps) {
  return (
    <div className={className} {...rest}>
      <style jsx>{`
        .shimmer-root {
          display: inline-block;
        }

        .shimmer-text {
          background: linear-gradient(90deg, rgba(0,0,0,0.95), #ffffff, rgba(0,0,0,0.95));
          background-size: 200% 100%;
          background-position: -100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 400;
          font-size: inherit;
          animation: shimmer 1.5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
          will-change: background-position;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Fallback for browsers without background-clip support */
        @supports not (-webkit-background-clip: text) {
          .shimmer-text {
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

        @keyframes shimmer {
          from { background-position: -100% 0; }
          to { background-position: 100% 0; }
        }
      `}</style>
      <span className={`shimmer-root ${className}`}>
        <span className="shimmer-text">{children}</span>
      </span>
    </div>
  );
}

export default ShimmerText;
