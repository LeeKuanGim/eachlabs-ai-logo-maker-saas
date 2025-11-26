import { createAuthClient } from "better-auth/react"

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window === "undefined" ? "http://localhost:3002" : `${window.location.origin}`)

export const authClient = createAuthClient({
  baseURL,
})
