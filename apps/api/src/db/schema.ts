import { jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const generationStatusEnum = pgEnum("generation_status", [
  "queued",
  "running",
  "succeeded",
  "failed",
])

export const logoGenerations = pgTable(
  "logo_generations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appName: text("app_name").notNull(),
    appFocus: text("app_focus").notNull(),
    color1: varchar("color1", { length: 64 }).notNull(),
    color2: varchar("color2", { length: 64 }).notNull(),
    model: varchar("model", { length: 64 }).notNull(),
    outputCount: integer("output_count").notNull().default(1),
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
  })
)

export type LogoGeneration = typeof logoGenerations.$inferSelect
export type NewLogoGeneration = typeof logoGenerations.$inferInsert
