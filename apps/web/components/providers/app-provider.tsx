"use client"

import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./ThemeProvider"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  )
}
