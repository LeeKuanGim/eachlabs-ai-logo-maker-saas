import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { anonymous } from "better-auth/plugins"
import { polar, checkout } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { db, schema } from "./db"

const authSecret = process.env.BETTER_AUTH_SECRET
const authBaseUrl = process.env.BETTER_AUTH_URL
const polarAccessToken = process.env.POLAR_ACCESS_TOKEN
const polarServer = (process.env.POLAR_SERVER ?? "sandbox") as "sandbox" | "production"
const polarSuccessUrl =
  process.env.POLAR_CHECKOUT_SUCCESS_URL ?? "http://localhost:3000/checkout/success?checkout_id={CHECKOUT_ID}"
const polarReturnUrl = process.env.POLAR_CHECKOUT_RETURN_URL

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is required for Better Auth")
}

if (!authBaseUrl) {
  throw new Error("BETTER_AUTH_URL is required for Better Auth")
}

if (!polarAccessToken) {
  throw new Error("POLAR_ACCESS_TOKEN is required for Polar checkout integration")
}

const polarClient = new Polar({
  accessToken: polarAccessToken,
  server: polarServer,
})

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
  plugins: [
    anonymous({
      emailDomainName: "guest.logoloco.local",
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          successUrl: polarSuccessUrl,
          returnUrl: polarReturnUrl,
          authenticatedUsersOnly: true,
        }),
      ],
    }),
  ],
})
