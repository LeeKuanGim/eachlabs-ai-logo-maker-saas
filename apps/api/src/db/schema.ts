import { boolean, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// ============================================================================
// ENUMS
// ============================================================================

export const generationStatusEnum = pgEnum("generation_status", [
  "queued",
  "running",
  "succeeded",
  "failed",
])

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "signup_bonus",
  "purchase",
  "usage",
  "refund",
  "adjustment_add",
  "adjustment_remove",
])

// ============================================================================
// LOGO GENERATIONS
// ============================================================================

export const logoGenerations = pgTable(
  "logo_generations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id"),
    appName: text("app_name").notNull(),
    appFocus: text("app_focus").notNull(),
    color1: varchar("color1", { length: 64 }).notNull(),
    color2: varchar("color2", { length: 64 }).notNull(),
    model: varchar("model", { length: 64 }).notNull(),
    outputCount: integer("output_count").notNull().default(1),
    creditsCharged: integer("credits_charged").notNull().default(1),
    prompt: text("prompt").notNull(),
    status: generationStatusEnum("status").notNull().default("queued"),
    providerPredictionId: varchar("provider_prediction_id", { length: 128 }),
    images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    providerResponse: jsonb("provider_response").$type<Record<string, unknown> | null>(),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("logo_generations_created_at_idx").on(table.createdAt),
    statusIdx: index("logo_generations_status_idx").on(table.status),
    providerPredictionIdIdx: index("logo_generations_provider_prediction_id_idx").on(
      table.providerPredictionId
    ),
    userIdCreatedAtIdx: index("logo_generations_user_id_created_at_idx").on(
      table.userId,
      table.createdAt.desc()
    ),
  })
)

export type LogoGeneration = typeof logoGenerations.$inferSelect
export type NewLogoGeneration = typeof logoGenerations.$inferInsert

// ============================================================================
// CREDIT SYSTEM
// ============================================================================

export const userCreditBalances = pgTable("user_credit_balances", {
  userId: text("user_id").primaryKey(),
  balance: integer("balance").notNull().default(0),
  totalPurchased: integer("total_purchased").notNull().default(0),
  totalUsed: integer("total_used").notNull().default(0),
  lastTransactionAt: timestamp("last_transaction_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type UserCreditBalance = typeof userCreditBalances.$inferSelect
export type NewUserCreditBalance = typeof userCreditBalances.$inferInsert

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    type: creditTransactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(),
    balanceAfter: integer("balance_after").notNull(),
    description: text("description"),
    polarOrderId: varchar("polar_order_id", { length: 256 }),
    polarProductId: varchar("polar_product_id", { length: 256 }),
    logoGenerationId: uuid("logo_generation_id"),
    performedBy: text("performed_by"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdCreatedAtIdx: index("credit_transactions_user_id_created_at_idx").on(
      table.userId,
      table.createdAt.desc()
    ),
    userIdIdx: index("credit_transactions_user_id_idx").on(table.userId),
    typeCreatedAtIdx: index("credit_transactions_type_created_at_idx").on(
      table.type,
      table.createdAt
    ),
    polarOrderIdIdx: index("credit_transactions_polar_order_id_idx").on(table.polarOrderId),
    logoGenerationIdIdx: index("credit_transactions_logo_generation_id_idx").on(
      table.logoGenerationId
    ),
  })
)

export type CreditTransaction = typeof creditTransactions.$inferSelect
export type NewCreditTransaction = typeof creditTransactions.$inferInsert

export const creditPackages = pgTable(
  "credit_packages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 128 }).notNull(),
    credits: integer("credits").notNull(),
    priceInCents: integer("price_in_cents").notNull(),
    polarProductId: varchar("polar_product_id", { length: 256 }),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    polarProductIdIdx: index("credit_packages_polar_product_id_idx").on(table.polarProductId),
    activeOrderIdx: index("credit_packages_active_order_idx").on(table.isActive, table.sortOrder),
  })
)

export type CreditPackage = typeof creditPackages.$inferSelect
export type NewCreditPackage = typeof creditPackages.$inferInsert
