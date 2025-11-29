import { describe, expect, it, beforeEach, vi } from "vitest"

// Set env before module load
process.env.SIGNUP_BONUS_CREDITS = "2"

type BalanceRow = {
  userId: string
  balance: number
  totalPurchased: number
  totalUsed: number
  lastTransactionAt?: Date
  createdAt: Date
  updatedAt: Date
}

type TransactionRow = {
  userId: string
  type: string
  amount: number
  balanceAfter: number
  description?: string
  performedBy?: string
  logoGenerationId?: string
  polarOrderId?: string
  polarProductId?: string
  metadata?: Record<string, unknown>
  createdAt: Date
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

// In-memory tables
const balances: BalanceRow[] = []
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
const userCreditBalances = {
  table: "balances",
  userId: "userId",
  balance: "balance",
  totalPurchased: "totalPurchased",
  totalUsed: "totalUsed",
  lastTransactionAt: "lastTransactionAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
}

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

// Mock drizzle eq/desc/sql
vi.mock("drizzle-orm", () => ({
  eq: (column: string, value: unknown) => ({ column, value }),
  desc: (column: string) => ({ column, direction: "desc" }),
  sql: (_strings: TemplateStringsArray, _field: unknown, addValue: number) => ({
    __op: "add",
    value: addValue,
  }),
}))

// Mock schema barrel
vi.mock("../../db/schemas", () => ({
  userCreditBalances,
  creditTransactions,
  creditPackages,
}))

// Minimal select/update/insert builders
const tableData = new Map([
  [userCreditBalances, balances],
  [creditTransactions, transactions],
  [creditPackages, packages],
])

const buildSelect = () => {
  const state: { table?: any; predicate?: Predicate; limitCount?: number; offsetCount?: number } = {}

  const exec = () => {
    const data = state.table ? tableData.get(state.table) ?? [] : []
    const filtered = data.filter((row: any) => matches(row, state.predicate))
    const sliced = filtered.slice(state.offsetCount ?? 0, (state.offsetCount ?? 0) + (state.limitCount ?? filtered.length))
    return sliced
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
    offset(offsetCount: number) {
      state.offsetCount = offsetCount
      return this
    },
    orderBy() {
      return this
    },
    for() {
      return this
    },
  }
}

const buildInsert = (table: any) => ({
  values(record: Record<string, any>) {
    const data = tableData.get(table)
    if (Array.isArray(data)) {
      data.push(record as any)
    }
    return [record]
  },
})

const applySet = (row: Record<string, any>, setObj: Record<string, any>) => {
  Object.entries(setObj).forEach(([key, val]) => {
    if (val && typeof val === "object" && val.__op === "add") {
      row[key] = (row[key] ?? 0) + val.value
    } else {
      row[key] = val
    }
  })
}

const buildUpdate = (table: any) => {
  const state: { setObj?: Record<string, any> } = {}
  return {
    set(setObj: Record<string, any>) {
      state.setObj = setObj
      return this
    },
    where(predicate: Predicate) {
      const data = tableData.get(table) ?? []
      data.forEach((row: any) => {
        if (matches(row, predicate)) {
          applySet(row, state.setObj ?? {})
        }
      })
      return { returning: () => [] }
    },
  }
}

// Mock db module
vi.mock("../../db", () => {
  const db = {
    select: buildSelect,
    transaction: async (cb: any) =>
      cb({
        select: buildSelect,
        insert: buildInsert,
        update: buildUpdate,
      }),
    insert: buildInsert,
    update: buildUpdate,
  }

  return { db }
})

describe("credits helpers and routes", async () => {
  const module = await import("../credits")
  const { getUserBalance, addCredits, deductCredits, credits } = module

  beforeEach(() => {
    balances.length = 0
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
  })

  it("initializes signup bonus on first balance fetch and is idempotent", async () => {
    const balance = await getUserBalance("user-1")
    expect(balance).toBe(2)
    expect(balances).toHaveLength(1)
    expect(transactions).toHaveLength(1)
    expect(transactions[0].type).toBe("signup_bonus")

    const balanceAgain = await getUserBalance("user-1")
    expect(balanceAgain).toBe(2)
    expect(transactions).toHaveLength(1) // no duplicate signup bonus
  })

  it("adds credits for purchases and records transaction metadata", async () => {
    await getUserBalance("user-1")
    const result = await addCredits("user-1", 3, "purchase", {
      polarOrderId: "order-123",
      polarProductId: "prod-123",
      description: "Purchased pack",
    })

    expect(result.success).toBe(true)
    expect(result.newBalance).toBe(5) // 2 bonus + 3 purchased

    const purchaseTx = transactions[transactions.length - 1]
    expect(purchaseTx.type).toBe("purchase")
    expect(purchaseTx.amount).toBe(3)
    expect(purchaseTx.polarOrderId).toBe("order-123")
    expect(purchaseTx.polarProductId).toBe("prod-123")

    expect(balances[0].totalPurchased).toBe(3)
  })

  it("deducts credits when sufficient balance and logs usage", async () => {
    await getUserBalance("user-1")
    await addCredits("user-1", 3, "purchase")

    const result = await deductCredits("user-1", 2, "gen-1", "Logo generation")
    expect(result.success).toBe(true)
    expect(result.newBalance).toBe(3)

    const usageTx = transactions[transactions.length - 1]
    expect(usageTx.type).toBe("usage")
    expect(usageTx.amount).toBe(-2)
    expect(usageTx.logoGenerationId).toBe("gen-1")
    expect(balances[0].totalUsed).toBe(2)
  })

  it("does not deduct credits when balance is insufficient", async () => {
    await getUserBalance("user-1")

    const result = await deductCredits("user-1", 5, "gen-2")
    expect(result.success).toBe(false)
    expect(result.newBalance).toBe(2)
    expect(balances[0].balance).toBe(2)
    // No additional transaction logged
    expect(transactions).toHaveLength(1)
  })

  it("returns polar product ids from packages route", async () => {
    const response = await credits.request("/packages")
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.packages[0].polarProductId).toBe("polar-prod-1")
    expect(body.packages[0].credits).toBe(10)
  })
})
