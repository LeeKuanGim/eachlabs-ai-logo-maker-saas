# Repository Guidelines

## Project Structure & Module Organization

This is a **Turborepo monorepo** with Bun workspaces:

```
apps/
├── web/                 # Next.js 15 frontend (port 3000)
│   ├── app/             # App Router pages, layouts, styles
│   ├── components/      # UI + landing sections (logo-maker.tsx, landing/*)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Shared helpers (utils.ts with cn function)
│   └── public/          # Static assets
│
└── api/                 # Hono + Bun API server (port 3002)
    ├── src/
    │   ├── db/          # Drizzle schema & connection
    │   ├── routes/      # Hono routes (predictions.ts)
    │   └── index.ts     # Hono entrypoint
    └── drizzle/         # Generated migrations

docs/                    # Documentation (API registry, PRD, platform notes)
```

## Build, Test, and Development Commands

```bash
# Monorepo commands (from root)
bun dev                        # Start both web and API servers
bun run build                  # Build all apps
bun lint                       # ESLint checks on all apps
bun start                      # Start production servers

# Filter to specific app
bun run dev -- --filter=web    # Only web app
bun run dev -- --filter=api    # Only API server

# Database (Drizzle ORM, runs against api app)
bun run db:generate            # Generate migrations from schema changes
bun run db:migrate             # Run pending migrations
bun run db:push                # Push schema directly (dev only)
bun run db:studio              # Open Drizzle Studio GUI
```

## Coding Style & Naming Conventions
- TypeScript-first; App Router for web, Hono for API. Prefer functional components with hooks.
- Tailwind CSS v4 utility classes; avoid inline styles unless needed for animations.
- Use `cn` helper for class merging. Keep copy in English.
- Linting: ESLint 9. Run `bun lint` before pushing.
- Filenames: kebab-case for files, PascalCase for components, camelCase for variables/functions.

## Testing Guidelines
- No formal test suite yet. Add tests alongside features when feasible.
- For API logic, prefer lightweight integration tests and unit tests for helpers.
- Name test files `*.test.ts` / `*.test.tsx`; colocate near source or under `__tests__/`.

## Commit & Pull Request Guidelines
- Commit messages: short imperative summary (e.g., "Rebrand app to LogoLoco", "Update README for bun workflow").
- Pull requests: include summary of changes, relevant screenshots for UI tweaks, and note any lint/test runs. Link issues when applicable.

## Security & Configuration Tips
- Required envs for API: `DATABASE_URL`, `EACHLABS_API_KEY`; set `DATABASE_SSL=true` in production.
- Required envs for Web: `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3002`).
- Do not commit secrets. `.env` / `.env.local` files are ignored.

## Architecture Overview
- Client submits form → `POST /api/predictions` (Hono API) persists request to PostgreSQL and calls Eachlabs API → client polls `GET /api/predictions/{id}` until status is `succeeded`.
- DB table: `logo_generations` with status/images/provider IDs; indexes on `created_at`, `status`, `provider_prediction_id`.
- Model mapping: `nano-banana` → `nano-banana`, `seedream-v4` → `seedream-v4-text-to-image`, `reve-text` → `reve-text-to-image`.
