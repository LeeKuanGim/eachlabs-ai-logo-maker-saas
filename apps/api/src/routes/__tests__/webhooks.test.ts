import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import crypto from "crypto"

process.env.POLAR_WEBHOOK_SECRET = "test-secret"

type TransactionRow = {
  id?: string
  userId?: string
  polarOrderId?: string | null
  polarProductId?: string | null
  amount?: number
}

type PackageRow = {
  id: string
  name: string
  credits: number
  priceInCents: number
  polarProductId?: string | null
  metadata?: Record<string, unknown> | null
  isActive: boolean
  sortOrder: number
}

const transactions: TransactionRow[] = []
const packages: PackageRow[] = [
  {
    id: "pkg-basic",
    name: "Starter",
    credits: 10,
    priceInCents: 500,
    polarProductId: "polar-prod-1",
    metadata: { description: "Starter pack" },
    isActive: true,
    sortOrder: 0,
  },
]

// Column definitions (mock)
const creditTransactions = {
  table: "transactions",
  id: "id",
  userId: "userId",
  type: "type",
  amount: "amount",
  balanceAfter: "balanceAfter",
  description: "description",
  performedBy: "performedBy",
  logoGenerationId: "logoGenerationId",
  polarOrderId: "polarOrderId",
  polarProductId: "polarProductId",
  metadata: "metadata",
  createdAt: "createdAt",
}

const creditPackages = {
  table: "packages",
  id: "id",
  name: "name",
  credits: "credits",
  priceInCents: "priceInCents",
  polarProductId: "polarProductId",
  metadata: "metadata",
  isActive: "isActive",
  sortOrder: "sortOrder",
}

// Helpers to match eq predicate objects
type Predicate = { column: string; value: unknown }
const matches = (row: Record<string, any>, predicate?: Predicate) =>
  predicate ? row[predicate.column] === predicate.value : true

// Mock drizzle eq
vi.mock("drizzle-orm", () => ({
  eq: (column: string, value: unknown) => ({ column, value }),
}))

// Mock schema barrel
vi.mock("../../db/schemas", () => ({
  creditTransactions,
  creditPackages,
}))

// Minimal select builder
const tableData = new Map([
  [creditTransactions, transactions],
  [creditPackages, packages],
])

const buildSelect = () => {
  const state: { table?: any; predicate?: Predicate; limitCount?: number } = {}

  const exec = () => {
    const data = state.table ? tableData.get(state.table) ?? [] : []
    const filtered = data.filter((row: any) => matches(row, state.predicate))
    const limited = state.limitCount ? filtered.slice(0, state.limitCount) : filtered
    return limited
  }

  return {
    from(table: any) {
      state.table = table
      return this
    },
    where(predicate: Predicate) {
      state.predicate = predicate
      return this
    },
    limit(limitCount: number) {
      state.limitCount = limitCount
      return exec()
    },
    orderBy() {
      return this
    },
  }
}

const db = {
  select: buildSelect,
}

// Mock db module
vi.mock("../../db", () => ({
  db,
}))

const addCreditsMock = vi.fn()

vi.mock("../credits", () => ({
  addCredits: (...args: any[]) => addCreditsMock(...args),
}))

let webhooks: Awaited<typeof import("../webhooks")>["webhooks"]

const signPayload = (payload: string) => {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const expectedSignature = crypto
    .createHmac("sha256", process.env.POLAR_WEBHOOK_SECRET as string)
    .update(`${timestamp}.${payload}`)
    .digest("hex")

  return `v1,${timestamp},${expectedSignature}`
}

beforeAll(async () => {
  const module = await import("../webhooks")
  webhooks = module.webhooks
})

beforeEach(() => {
  addCreditsMock.mockClear()
  transactions.length = 0
  packages.splice(0, packages.length, {
    id: "pkg-basic",
    name: "Starter",
    credits: 10,
    priceInCents: 500,
    polarProductId: "polar-prod-1",
    metadata: { description: "Starter pack" },
    isActive: true,
    sortOrder: 0,
  })

  addCreditsMock.mockImplementation(async (userId: string, amount: number, _type: string, options: any) => {
    transactions.push({
      id: crypto.randomUUID(),
      userId,
      polarOrderId: options?.polarOrderId ?? null,
      polarProductId: options?.polarProductId ?? null,
      amount,
    })
    return { success: true, newBalance: 99 }
  })
})

describe("polar webhooks", () => {
  it("processes a signed order.created event and adds credits", async () => {
    const payload = {
      type: "order.created" as const,
      data: {
        id: "order-1",
        product_id: "polar-prod-1",
        user_id: "user-1",
        amount: 500,
        currency: "usd",
      },
    }
    const body = JSON.stringify(payload)
    const response = await webhooks.request("/polar", {
      method: "POST",
      body,
      headers: {
        "webhook-signature": signPayload(body),
      },
    })

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.status).toBe("processed")
    expect(json.credits).toBe(10)
    expect(addCreditsMock).toHaveBeenCalledTimes(1)
  })

  it("rejects invalid signatures", async () => {
    const payload = { type: "order.created", data: { id: "order-2", product_id: "polar-prod-1", user_id: "user-1" } }
    const response = await webhooks.request("/polar", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "webhook-signature": "v1,bad,bad" },
    })

    expect(response.status).toBe(401)
    expect(addCreditsMock).not.toHaveBeenCalled()
  })

  it("returns pending_user_link when user id is missing", async () => {
    const payload = {
      type: "order.created" as const,
      data: { id: "order-3", product_id: "polar-prod-1", customer_email: "test@example.com" },
    }
    const body = JSON.stringify(payload)

    const response = await webhooks.request("/polar", {
      method: "POST",
      body,
      headers: { "webhook-signature": signPayload(body) },
    })

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json.status).toBe("pending_user_link")
    expect(addCreditsMock).not.toHaveBeenCalled()
  })

  it("is idempotent for duplicate order ids", async () => {
    const payload = {
      type: "order.created" as const,
      data: { id: "order-4", product_id: "polar-prod-1", user_id: "user-4" },
    }
    const body = JSON.stringify(payload)
    const headers = { "webhook-signature": signPayload(body) }

    const first = await webhooks.request("/polar", { method: "POST", body, headers })
    expect(first.status).toBe(200)
    expect(addCreditsMock).toHaveBeenCalledTimes(1)

    const second = await webhooks.request("/polar", { method: "POST", body, headers })
    expect(second.status).toBe(200)
    const json = await second.json()
    expect(json.status).toBe("already_processed")
    expect(addCreditsMock).toHaveBeenCalledTimes(1)
  })
})
