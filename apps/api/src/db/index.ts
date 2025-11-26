import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const globalForDb = globalThis as unknown as {
  db?: NodePgDatabase<typeof schema>
  pool?: Pool
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your .env file.")
}

const useSsl = process.env.DATABASE_SSL === "true"

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  })

const db = globalForDb.db ?? drizzle(pool, { schema })

if (!globalForDb.pool) {
  globalForDb.pool = pool
}

if (!globalForDb.db) {
  globalForDb.db = db
}

export { db, pool, schema }
