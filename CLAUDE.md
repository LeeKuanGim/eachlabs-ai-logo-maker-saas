# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
bun dev              # Start dev server with Turbopack
bun run build        # Production build with Turbopack
bun start            # Start production server
bun lint             # Run ESLint
```

### Database Commands (Drizzle ORM)

```bash
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Run pending migrations
bun run db:push      # Push schema directly (dev only)
bun run db:studio    # Open Drizzle Studio GUI
```

## Architecture Overview

LogoLoco is a Next.js 15 AI logo generation SaaS using the App Router.

### Key Directories

- `app/` - Next.js App Router pages and API routes
- `components/ui/` - shadcn/ui components (Radix primitives + Tailwind)
- `components/landing/` - Landing page sections
- `db/` - Drizzle ORM schema and database connection
- `drizzle/` - Generated SQL migrations
- `lib/utils.ts` - Shared utilities (cn function for class merging)

### Data Flow

1. **Logo Generation**: User submits form → `/api/predictions` POST creates DB record and calls Eachlabs API → Returns prediction ID → Client polls `/api/predictions/[id]` until complete
2. **Database**: PostgreSQL via Drizzle ORM. Schema in `db/schema.ts`, connection pool in `db/index.ts`
3. **Models Supported**: nano-banana, seedream-v4, reve-text (mapped to Eachlabs API model names)

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `DATABASE_SSL` - Set to "true" for SSL connections
- `EACHLABS_API_KEY` - API key for logo generation

### Path Aliases

`@/*` maps to project root (e.g., `@/components`, `@/db`, `@/lib`)

### Styling

- Tailwind CSS v4 with tw-animate-css
- next-themes for dark/light mode (class-based)
- CSS variables defined in `app/globals.css`
