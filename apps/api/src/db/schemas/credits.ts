import { boolean, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar, integer, index } from "drizzle-orm/pg-core"

// ============================================================================
// ENUMS
// ============================================================================

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "signup_bonus",
  "purchase",
  "usage",
  "refund",
  "adjustment_add",
  "adjustment_remove",
])

// ============================================================================
// USER CREDIT BALANCES
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

// ============================================================================
// CREDIT TRANSACTIONS
// ============================================================================

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

// ============================================================================
// CREDIT PACKAGES
// ============================================================================

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
