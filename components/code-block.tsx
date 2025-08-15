"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import hljs from "highlight.js"
import { useArtifact } from "@/hooks/use-artifact"
import { CopyIcon1, PencilHeartIcon, CollapseIcon, ExpandIcon } from "./icons"

// C/C++-inspired theme styles with dark background (unchanged)
const codeThemeStylesDark = `
  .hljs {
    color: #D4D4D4 !important;
    font-family: Consolas, 'Courier New', monospace !important;
    background-image: none !important;
    background-attachment: initial !important;
    background-size: initial !important;
    background-repeat: no-repeat !important;
  }
  
  /* Comments - Green and Italic */
  .hljs-comment,
  .hljs-quote {
    color: #ffffff80 !important;

  }
  
  /* Keywords - Blue */
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal,
  .hljs-doctag,
  .hljs-title,
  .hljs-section,
  .hljs-name,
  .hljs-strong {
    color: #569CD6 !important;
  }
  
  /* C/C++ specific keywords - Blue */
  .language-cpp .hljs-keyword,
  .language-c .hljs-keyword,
  .language-cpp .hljs-built_in,
  .language-c .hljs-built_in {
    color: #569CD6 !important;
  }
  
  /* Types - Cyan */
  .hljs-type,
  .hljs-class .hljs-title,
  .hljs-title.class_,
  .hljs-title.class_.inherited__,
  .hljs-built_in {
    color: #df3079 !important;
  }
  
  /* C/C++ specific types - Cyan */
  .language-cpp .hljs-type,
  .language-c .hljs-type,
  .language-cpp .hljs-title.class_,
  .language-c .hljs-title.class_ {
    color: #f22c3d !important;
  }
  
  /* Functions and Methods - Light Yellow */
  .hljs-function .hljs-title,
  .hljs-title.function_,
  .hljs-title.function_.invoke__,
  .hljs-function,
  .hljs-function-name {
    color: #f22c3d !important;
  }
  
  /* Strings - Light Orange */
  .hljs-string,
  .hljs-meta-string,
  .hljs-regexp,
  .hljs-template-string {
    color: #00a67d !important;
  }
  
  .hljs-text {}
  
  /* Numbers and Constants - Light Purple */
  .hljs-number,
  .hljs-literal,
  .hljs-constant {
    color: #B5CEA8 !important;
  }
  
  /* Preprocessor Directives - Purple */
  .hljs-meta,
  .hljs-meta-keyword,
  .hljs-preprocessor {
    color: #569CD6 !important;
  }
  
  /* C/C++ specific preprocessor - Purple */
  .language-cpp .hljs-meta,
  .language-c .hljs-meta,
  .language-cpp .hljs-meta-keyword,
  .language-c .hljs-meta-keyword {
    color: #ffffff !important;
  }
  
  /* Variables and Properties - Default Light Gray */
  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-property,
  .hljs-attribute {
    color: #df3079 !important;
  }
  
  /* Operators - Light Gray */
  .hljs-operator,
  .hljs-punctuation {
    color: #D4D4D4 !important;
  }
  
  /* Tags - Blue */
  .hljs-tag,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: #569CD6 !important;
  }
  
  /* Parameters - Light Gray */
  .hljs-params {
    color: #D4D4D4 !important;
  }
  
  /* CSS Specific Styles */
  .language-css .hljs-selector-class,
  .language-css .hljs-selector-id {
    color: #569CD6 !important;
  }
  
  .language-css .hljs-attribute {
    color: #f22c3d !important;
  }
  
  .language-css .hljs-number {
    color: #B5CEA8 !important;
  }
  
  .language-css .hljs-string {
    color: #00a67d!important;
  }
  
  .language-css .hljs-built_in {
    color: #f22c3d !important;
  }
  
  /* Bash/Terminal Specific Styles */
  .language-bash .hljs-built_in,
  .language-sh .hljs-built_in,
  .language-shell .hljs-built_in,
  .language-bash .hljs-string,
  .language-sh .hljs-string,
  .language-shell .hljs-string,
  .language-bash .hljs-variable,
  .language-sh .hljs-variable,
  .language-shell .hljs-variable,
  .language-bash,
  .language-sh,
  .language-shell {
    color: ##ffffff0d !important;
  }
  
  /* Output/Terminal styling */
  .hljs-output {
    color: #4EC9B0 !important;
  }
  
  /* Special highlighting */
  .hljs-addition {
    color: #6A9955 !important;
    background-color: #1F2937 !important;
  }
  
  .hljs-deletion {
    color: #F14C4C !important;
    background-color: #1F2937 !important;
  }
  
  .hljs-emphasis {
    font-style: italic !important;
  }
  
  .hljs-link {
    text-decoration: underline !important;
    color: #4EC9B0 !important;
  }
  
  .hljs-subst {
    color: #D4D4D4 !important;
  }
  
  .hljs-symbol,
  .hljs-bullet {
    color: #4EC9B0 !important;
  }
  
  .hljs-formula {
    color: #DCDCAA !important;
  }
  
  /* JavaScript specific */
  .language-javascript .hljs-title.function_,
  .language-js .hljs-title.function_ {
    color: #DCDCAA !important;
  }
  
  .language-javascript .hljs-variable.language_,
  .language-js .hljs-variable.language_ {
    color: #569CD6 !important;
  }
  
  /* Python specific */
  .language-python .hljs-built_in {
    color: #4EC9B0 !important;
  }
  
  .language-python .hljs-keyword {
    color: #569CD6 !important;
  }

  .code-form {
    font-family: 'Poppins', sans-serif;
  }

  /* Firefox scrollbar */
  .hljs,
  pre {
    scrollbar-width: thin;
    scrollbar-color: #2f2f2f transparent;
  }
`

// New light mode styles (background white, text colors adjusted for visibility)
const codeThemeStylesLight = `
  .hljs {
    color: #1E1E1E !important; /* Darker text for light mode */
    background: #FFFFFF !important; /* White background */
  }
  
  /* Keep all other colors the same as dark mode for "proper" highlighting */
  /* (You can adjust specific colors here if needed for better contrast in light mode) */

  /* Update scrollbar for light mode */
  .hljs,
  pre {
    scrollbar-color: #D4D4D4 transparent;
  }

  /* Ensure output text is visible */
  .hljs-output {
    color: #007ACC !important;
  }
`

interface CodeBlockProps {
  node?: any
  inline?: boolean
  className?: string
  children: React.ReactNode
  isOutput?: boolean
  onEdit?: (newCode: string) => void
}

export function CodeBlock({
  node,
  inline = false,
  className = "",
  children,
  isOutput = false,
  onEdit,
  ...props
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  const { setArtifact } = useArtifact()
  const [isCopied, setIsCopied] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isWrapped, setIsWrapped] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark") // Default to dark

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setTheme(mediaQuery.matches ? "dark" : "light")

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light")
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Inject theme styles based on detected theme
  useEffect(() => {
    const styleId = "cpp-theme"
    const existingStyle = document.getElementById(styleId)
    if (existingStyle) existingStyle.remove()

    const style = document.createElement("style")
    style.id = styleId
    style.textContent = theme === "dark" ? codeThemeStylesDark : codeThemeStylesLight
    document.head.appendChild(style)
  }, [theme])

  const isCodeBlock = className.includes("language-") || isOutput
  const languageMatch = className.match(/language-(\w+)/)
  const isBashOutput =
    className.includes("language-bash") ||
    className.includes("language-sh") ||
    className.includes("language-shell") ||
    isOutput

  const language = isOutput
    ? "Output"
    : languageMatch
      ? languageMatch[1].charAt(0).toUpperCase() + languageMatch[1].slice(1)
      : "Code"

  const codeContent = typeof children === "string" ? children : String(children)

  useEffect(() => {
    if (codeRef.current && isCodeBlock) {
      codeRef.current.className = `${className || "language-plaintext"} hljs`
      codeRef.current.removeAttribute("data-highlighted")
      try {
        if (!className.includes("language-") && !isOutput) {
          const result = hljs.highlightAuto(codeContent)
          codeRef.current.innerHTML = result.value
          codeRef.current.className = `language-${result.language || "plaintext"} hljs`
        } else if (isOutput) {
          codeRef.current.className = "hljs-output hljs"
          codeRef.current.textContent = codeContent
        } else {
          hljs.highlightElement(codeRef.current)
        }
      } catch (error) {
        console.error("Highlight.js error:", error)
        codeRef.current.textContent = codeContent
      }
    }
  }, [children, className, isCodeBlock, isOutput, codeContent])

  const handleCopy = async () => {
    const textToCopy = codeRef.current?.textContent || codeContent
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  const handleCollapse = () => setIsCollapsed(!isCollapsed)

  const handleEdit = () => {
    const codeText = codeRef.current?.textContent || codeContent
    setArtifact({
      documentId: "init",
      title: `${language} Snippet`,
      kind: "code",
      content: codeText,
      isVisible: true,
      status: "idle",
      boundingBox: {
        top: window.scrollY + 100,
        left: window.innerWidth > 640 ? 100 : 20,
        width: window.innerWidth > 640 ? 600 : window.innerWidth - 40,
        height: 400,
      },
    })
  }

  if (!isCodeBlock) {
    return <span>{children}</span>
  }

  if (inline) {
    return (
      <code
        ref={codeRef}
        className={`${className || "language-plaintext"} inline-block ${theme === "light" ? "bg-white text-black" : "bg-snippet text-white"} px-1 py-0.5 text-[10px] sm:text-xs rounded`}
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <pre className={`code-form w-full sm:max-w-[48rem] mx-auto my-4 contain-inline-size rounded-xl shadow-md overflow-x-auto ${theme === "light" ? "bg-white" : "bg-snippet"}`}>
      <div className={`flex items-center justify-between rounded-t-xl font-apple px-1.5 py-2.5 sm:px-2 sm:py-2 ${theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gradient-to-r bg-snippet text-gray-200"}`}>
        <div className="flex items-center mx-2 space-x-2">
          <span className="text-[12px] sm:text-[12px] font-apple">{language}</span>
        </div>
        <div className="flex space-x-1.5 sm:space-x-2.5">
          <button
            onClick={handleCollapse}
            className={`flex items-center gap-1 rounded px-1 py-0.5 sm:px-1.5 sm:py-0.5 text-[10px] sm:text-[12px] transition-all ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-zinc-200 hover:bg-gray-600/70"}`}
          >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
            {isCollapsed ? "Expand" : "Collapse"}
          </button>

          {!isOutput && (
            <button
              onClick={handleEdit}
              className={`flex items-center gap-1 rounded px-1 py-0.5 sm:px-1.5 sm:py-0.5 text-[10px] sm:text-[12px] transition-all ${theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-zinc-200 hover:bg-gray-600/70"}`}
            >
              <PencilHeartIcon />
              Edit
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 rounded px-1 py-0.5 sm:px-1.5 sm:py-0.5 text-[10px] sm:text-[12px] transition-all ${
              isCopied ? "bg-green-600 text-white" : theme === "light" ? "text-gray-800 hover:bg-gray-200" : "text-gray-200 hover:bg-gray-600/70"
            }`}
          >
            <CopyIcon1 />
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className={isCollapsed ? "hidden" : "block"}>
        <div className={`w-full overflow-x-auto rounded-b-xl text-base font-inherit px-6 py-2.5 ${theme === "light" ? "bg-white scrollbar-thumb-gray-300" : "bg-snippet scrollbar scrollbar-track-transparent scrollbar-thumb-muted"}`}>
          <pre className="flex w-full overflow-auto m-auto pb-2.5 leading-tight">
            <code
              ref={codeRef}
              className={`block ${isWrapped ? "whitespace-pre-wrap break-words" : "whitespace-pre"} ${
                isOutput ? (theme === "light" ? "text-black" : "") : ""
              }`}
            >
              {children}
            </code>
          </pre>
        </div>
      </div>
    </pre>
  )
}
