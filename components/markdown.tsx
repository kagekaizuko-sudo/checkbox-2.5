"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

interface MarkdownProps {
  children: string;
  className?: string;
}

const Markdown = memo(({ children, className = "" }: MarkdownProps) => {
  const components: Partial<Components> = useMemo(
    () => ({
      // Code blocks and inline code
      code: ({ node, className, children, ...props }) => {
        return (
          <CodeBlock className={className} {...props}>
            {String(children).replace(/\n$/, "")}
          </CodeBlock>
        );
      },

      // Pre blocks (handled by CodeBlock)
      pre: ({ children }) => <>{children}</>,

      // Headings with contextual emojis and horizontal rules
      h1: ({ children, ...props }) => {
        const text = String(children);
        return (
          <h1
            className="text-4xl font-apple text-primary mb-8 pb-2 border-b border-gray-200 dark:border-gray-700 transition-colors"
            {...props}
          >
            
            {children}
          </h1>
        );
      },

      h2: ({ children, ...props }) => {
        const text = String(children);
        return (
          <h2 className="text-[24px] font-apple text-primary mt-8 mb-3" {...props}>
           
            {children}
          </h2>
        );
      },

      h3: ({ children, ...props }) => {
        const text = String(children);
     
        return (
          <h3 className="text-xl list-decimal font-apple text-primary mt-6 mb-2" {...props}>
            
            {children}
          </h3>
        );
      },

      h4: ({ children, ...props }) => {
        const text = String(children);
     
        return (
          <h4
            className="text-xl font-apple text-primary mt-6 mb-2 transition-colors"
            {...props}
          >
            
            {children}
          </h4>
        );
      },

      h5: ({ children, ...props }) => {
        const text = String(children);
      
        return (
          <h5 className="text-xl font-apple text-primary mt-4 mb-2" {...props}>
            
            {children}
          </h5>
        );
      },

      h6: ({ children, ...props }) => {
        const text = String(children);
     
        return (
          <h6
            className="text-xl font-apple text-primary mt-3 mb-2 uppercase tracking-wide transition-colors"
            {...props}
          >
            
            {children}
          </h6>
        );
      },

      hr: () => (
        <hr className="my-10 border-t border-gray-600/40 dark:border-gray-300/20" />
      ),

      // Modified ul component: Add <hr> after the <ul> (this is the key change)
      ul: ({ children, ...props }) => (
        <>
          <ul
            className="list-square mb-4 pl-[26px] text-base text-primary transition-colors"
            {...props}
          >
            {children}
            <style jsx>{`
              ul {
                list-style-type: disc;
              }
            `}</style>
          </ul>
        </>
      ),

      ol: ({ children, ...props }) => (
        <ol
          className="list-decimal font-apple pl-[26px] my-4 space-y-1 text-primary transition-colors"
          {...props}
        >
          {children}
        </ol>
      ),

      li: ({ children, ...props }) => (
        <li className="pl-2 my-1.5" {...props}>
          {children}
        </li>
      ),

      a: ({ href, children, ...props }) => (
        <Link
          href={href || "#"}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </Link>
      ),

      strong: ({ children, ...props }) => (
        <strong className="font-apple text-primary transition-colors" {...props}>
          {children}
        </strong>
      ),

      em: ({ children, ...props }) => (
        <em className="italic text-primary transition-colors" {...props}>
          {children}
        </em>
      ),

      blockquote: ({ children, ...props }) => (
        <blockquote
          className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-950/30 text-primary italic rounded-r transition-colors"
          {...props}
        >
          {children}
        </blockquote>
      ),

      table: ({ children, ...props }) => (
        <div className="w-full max-w-[22rem] sm:max-w-[48rem] my-6 overflow-x-auto scrollbar scrollbar-thumb-[#2f2f2f]">
          <table
            className="w-full border-collapse text-sm rounded-2xl"
            {...props}
          >
            {children}
          </table>
        </div>
      ),

      thead: ({ children, ...props }) => (
        <thead className="text-lg border-b-2 border-white/10">
          {children}
        </thead>
      ),

      tbody: ({ children, ...props }) => <tbody>{children}</tbody>,

      tr: ({ children, ...props }) => (
        <tr className="transition-colors border-b border-[#ffffff0d]" {...props}>
          {children}
        </tr>
      ),

      th: ({ children, ...props }) => (
        <th
          className="px-4 py-2 text-start text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider whitespace-nowrap"
          {...props}
        >
          {children}
        </th>
      ),

      td: ({ children, ...props }) => (
        <td
          className="px-4 py-2 text-gray-900 dark:text-gray-100 whitespace-nowrap"
          {...props}
        >
          {children}
        </td>
      ),

      input: ({ type, checked, ...props }) => {
        if (type === "checkbox") {
          return (
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
              {...props}
            />
          );
        }
        return <input type={type} {...props} />;
      },
    }),
    []
  );

  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div className={`max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
});

Markdown.displayName = "Markdown";

export { Markdown };
