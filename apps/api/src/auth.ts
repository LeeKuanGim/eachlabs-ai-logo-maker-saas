import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db, schema } from "./db"

const authSecret = process.env.BETTER_AUTH_SECRET
const authBaseUrl = process.env.BETTER_AUTH_URL

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is required for Better Auth")
}

if (!authBaseUrl) {
  throw new Error("BETTER_AUTH_URL is required for Better Auth")
}

export const auth = betterAuth({
  secret: authSecret,
  baseURL: authBaseUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
})
