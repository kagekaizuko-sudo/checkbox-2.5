"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

interface ThemeProviderWrapperProps {
  children: ReactNode
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
