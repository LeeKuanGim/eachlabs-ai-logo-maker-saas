# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Monorepo commands (from root)
bun dev                        # Start both web (3000) and API (3002) servers
bun run build                  # Build all apps
bun lint                       # Lint all apps
bun start                      # Start production servers

# Filter to specific app
bun run dev -- --filter=web    # Only web app
bun run dev -- --filter=api    # Only API server
```

### Database Commands (Drizzle ORM)

```bash
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Run pending migrations
bun run db:push      # Push schema directly (dev only)
bun run db:studio    # Open Drizzle Studio GUI
```

## Architecture Overview

LogoLoco is an AI logo generation SaaS built as a Turborepo monorepo with Bun.

### Monorepo Structure

```
apps/
├── web/   # Next.js 15 frontend (port 3000)
└── api/   # Hono + Bun API server (port 3002)
```

### Web App (`apps/web`)
- Next.js 15 with App Router + Turbopack
- React 19 + TypeScript
- shadcn/ui components (Radix primitives + Tailwind v4)
- Path alias: `@/*` maps to `apps/web/`

### API Server (`apps/api`)
- Hono framework running on Bun
- Drizzle ORM with PostgreSQL
- Routes in `src/routes/`, database in `src/db/`

### Data Flow

1. **Logo Generation**: Client submits form → `POST /api/predictions` creates DB record and calls Eachlabs API → Returns prediction ID → Client polls `GET /api/predictions/{id}` until complete
2. **Model Mapping**: Frontend model names map to Eachlabs API names:
   - `nano-banana` → `nano-banana`
   - `seedream-v4` → `seedream-v4-text-to-image`
   - `reve-text` → `reve-text-to-image`

### Environment Variables

**API (`apps/api/.env`):**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `DATABASE_SSL` - Set to "true" for SSL connections
- `EACHLABS_API_KEY` - API key for logo generation
- `PORT` - API server port (default: 3002)
- `ALLOWED_ORIGINS` - Comma-separated CORS origins

**Web (`apps/web/.env.local`):**
- `NEXT_PUBLIC_API_BASE_URL` - API endpoint (default: `http://localhost:3002`)

### Key Files

- `apps/api/src/routes/predictions.ts` - Core logo generation logic and Eachlabs integration
- `apps/api/src/db/schema.ts` - Database schema (`logoGenerations` table)
- `apps/web/components/logo-maker.tsx` - Main form component with polling logic
