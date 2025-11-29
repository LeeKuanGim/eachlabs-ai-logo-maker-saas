# LogoLoco - Project Documentation

## 1. Project Overview

### Stack Summary
- **Monorepo**: Turborepo with Bun workspaces
- **Frontend**: Next.js 15.5 (App Router) + React 19 + TypeScript
- **Backend**: Hono framework on Bun runtime + Better Auth (email + anonymous)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **Form Handling**: React Hook Form 7.x with Zod validation
- **Package Manager**: Bun

### Application Type
A **SaaS AI-powered logo generation application** that allows users to create professional logos for their businesses using multiple AI models.

### Key Features
- Multi-model AI logo generation (3 models: Nano Banana, Seedream v4, Reve Text)
- Real-time generation status tracking with polling
- Color-based logo generation with gradient support
- Batch image generation (up to 4 images at once; 1 credit per output)
- Download functionality for generated logos
- Database persistence of generation history (auth-required access)
- Better Auth-backed sessions (email + anonymous); 1 free signup credit

### Architecture Overview
```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Next.js Web   │─────▶│   Hono API      │─────▶│  Eachlabs API   │
│   (port 3000)   │      │   (port 3002)   │      │   (external)    │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         │   (Drizzle)     │
                         └─────────────────┘
```

---

## 2. API Registry

### Base Configuration
- **API Base URL**: `http://localhost:3002` (configurable via `NEXT_PUBLIC_API_BASE_URL`)
- **External API**: `https://api.eachlabs.ai/v1/prediction/`
- **Authentication**: Better Auth sessions for app endpoints; API key (X-API-Key) for Eachlabs provider

### Endpoints
#### GET /api/predictions
**Purpose**: List the authenticated user’s generation history (with retention filtering and pagination).
**Auth**: Required (Better Auth session).
**Query Params**:
- `limit` (default 50, max 100)
- `offset` (default 0)

**Response**:
```typescript
{
  history: LogoGeneration[]
  pagination: { limit: number; offset: number }
}
```
Notes: Results are filtered to the requesting user and to the last 365 days by default (`GENERATION_RETENTION_DAYS` override).

#### POST /api/predictions
**Purpose**: Create a new logo generation prediction
**Auth**: Required (Better Auth session); charges `outputCount` credits (1 per logo output, max 4 per request).

**Request**:
```typescript
{
  appName: string      // Application name (min 2 chars)
  appFocus: string     // Application focus/theme (min 2 chars)
  color1: string       // Primary color
  color2: string       // Secondary color
  model: string        // Model selection: "nano-banana" | "seedream-v4" | "reve-text"
  outputCount: string  // Number of images to generate: "1" | "2" | "3" | "4"
}
```

**Response**:
```typescript
{
  predictionID: string  // Provider prediction identifier
  prediction: object    // Full Eachlabs response (for debugging)
}
```

**Model-Specific Parameters**:
- **nano-banana**: `output_format: "png"`, `aspect_ratio: "1:1"`, `limit_generations: true`
- **seedream-v4**: `image_size: "square_hd"`, `enable_safety_checker: true`
- **reve-text**: `aspect_ratio: "1:1"`, `output_format: "png"`

**Error Responses**:
- 400: Invalid request body / Invalid model selected
- 500: EACHLABS_API_KEY not configured
- 502: Failed to reach provider / Invalid provider response

#### GET /api/predictions/{id}
**Purpose**: Retrieve prediction status and results
**Auth**: Required; must be the owner of the generation.

**Path Parameters**:
- `id`: Prediction ID from creation endpoint

**Response**:
```typescript
{
  status: "queued" | "running" | "success" | "failed"
  output?: string[]  // Generated image URLs (on success)
  // ... full Eachlabs response passthrough
}
```

**Error Responses**:
- 400: Invalid prediction id
- 401: Authentication required
- 403: Forbidden (prediction does not belong to user)
- 500: EACHLABS_API_KEY not configured
- 502: Failed to reach provider

---

## 3. Frontend Usage Matrix

### Component Architecture

#### Main Page (`apps/web/app/page.tsx`)
- **Type**: Server Component
- **Purpose**: Landing page with modular sections (Header, Hero, Features, etc.)

#### LogoMaker Component (`apps/web/components/logo-maker.tsx`)
- **Type**: Client Component (`"use client"`)
- **Location**: Main application logic
- **State Management**: Local React state with useState
- **Form Management**: React Hook Form with Zod validation

### Data Flow

```mermaid
graph LR
    A[User Input] --> B[Form Validation]
    B --> C[POST /api/predictions]
    C --> D[Receive predictionID]
    D --> E[Poll GET /api/predictions/id]
    E --> F{Status Check}
    F -->|running/queued| E
    F -->|success| G[Display Images]
    F -->|failed| H[Show Error]
```

### Form Schema & Validation
```typescript
{
  appName: string (min 2 chars)
  appFocus: string (min 3 chars)
  color1: string (min 2 chars)
  color2: string (min 2 chars)
  model: string (required)
  outputCount: string (required)
}
```

### UI Components Used
- **Form Components**: Input, Select, Button (shadcn/ui)
- **Layout**: Card, CardHeader, CardContent
- **Feedback**: Skeleton (loading), RainbowButton (CTA)
- **Icons**: Lucide React icons

---

## 4. Authentication Details

### Current Status
**Better Auth is integrated and hosted on the API service.**

- Server: `apps/api/src/auth.ts` using `better-auth` + `drizzleAdapter` on Postgres.
- Handler: Mounted at `/api/auth/*` in Hono (`apps/api/src/index.ts`).
- Client: Next.js uses `apps/web/lib/auth-client.ts` (`createAuthClient`) pointing to `NEXT_PUBLIC_API_BASE_URL` (API origin).
- Required env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_API_BASE_URL`, `ALLOWED_ORIGINS` (CORS).
- CORS: `ALLOWED_ORIGINS` comma-separated origins, credentials enabled at the API.
- Migrations: Auth + app tables live under `apps/api/src/db/migrations`.
- Plugins: Anonymous auth enabled (server + client) for guest sessions.

---

## 5. ORM & Database Summary

### Database: PostgreSQL with Drizzle ORM

**Schema Location**: `apps/api/src/db/schemas`
**Connection**: `apps/api/src/db/index.ts`
**Migrations**: `apps/api/src/db/migrations/`

### Tables

#### `logo_generations`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| user_id | TEXT (FK) | References `user.id`, null on delete |
| app_name | TEXT | Application name |
| app_focus | TEXT | Application focus/theme |
| color1 | VARCHAR(64) | Primary color |
| color2 | VARCHAR(64) | Secondary color |
| model | VARCHAR(64) | AI model used |
| output_count | INTEGER | Number of images requested |
| credits_charged | INTEGER | Credits deducted for the request |
| prompt | TEXT | Generated prompt sent to AI |
| status | ENUM | queued, running, succeeded, failed |
| provider_prediction_id | VARCHAR(128) | Eachlabs prediction ID |
| images | JSONB | Array of generated image URLs |
| provider_response | JSONB | Full provider response |
| error | TEXT | Error message (if failed) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes**: `created_at`, `status`, `provider_prediction_id`, `user_id` + `created_at`

### Database Commands
```bash
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Run pending migrations
bun run db:push      # Push schema directly (dev only)
bun run db:studio    # Open Drizzle Studio GUI
```

---

## 6. Payments Integration Summary

### Current Status
**Credit system implemented; Polar payments wiring pending**

- 1 free credit on signup (configurable)
- Credits deducted per generation; refunds on provider failures
- Purchase flows planned via Polar; not yet wired

---

## 7. Middleware & Request Flow

### Request Pipeline
```
Client Request → Next.js (web) → Hono API → PostgreSQL + Eachlabs API → Response
```

### API Server Features
- CORS middleware with configurable origins
- Request timeout handling (default 30s for Eachlabs calls)
- Zod validation on all endpoints
- Graceful error handling with appropriate status codes

### Error Handling
- API routes include try-catch blocks
- Database errors logged but don't crash the server
- Client-side error display through UI state

---

## 8. Security & Access Controls

### Current Security Posture

#### Strengths
- Better Auth for user sessions (email + anonymous); API endpoints require auth where applicable
- API key stored in environment variable (server-side only)
- Input validation with Zod schemas
- CORS configuration for allowed origins
- Separate API server (not exposed through Next.js)
- Rate limiting on predictions/credits/admin routes

#### Areas for Improvement
- Request signing/CSRF for web UI
- Audit logging for admin/credit operations
-.env validation/typing

---

## 9. Performance Analysis

### Current Performance Characteristics

#### Strengths
- Turbopack optimization for Next.js builds
- Efficient polling mechanism with 2-second intervals
- 5-minute timeout prevents hung requests
- Bun runtime for fast API responses

#### Bottlenecks
- Synchronous polling could be optimized with WebSockets
- No caching of prediction status
- No CDN integration for static assets

---

## 10. External Integrations

### Eachlabs AI API
- **Purpose**: AI-powered logo generation
- **Base URL**: `https://api.eachlabs.ai/v1/prediction`
- **Authentication**: API key via X-API-Key header
- **Models Available**:
  - `nano-banana`: Fast, minimalist designs
  - `seedream-v4-text-to-image`: High-quality, detailed images
  - `reve-text-to-image`: Text-focused logo generation

---

## 11. Development & Deployment

### Scripts (from monorepo root)
```bash
bun dev                        # Start both web (3000) and API (3002)
bun run build                  # Build all apps
bun lint                       # Lint all apps
bun start                      # Start production servers

bun run dev -- --filter=web    # Only web app
bun run dev -- --filter=api    # Only API server
```

### Environment Configuration

**API (`apps/api/.env`):**
```bash
DATABASE_URL=postgres://user:pass@host:port/db
DATABASE_SSL=true              # For production
EACHLABS_API_KEY=your_key
PORT=3002                      # Optional, default 3002
ALLOWED_ORIGINS=http://localhost:3000  # Comma-separated
```

**Web (`apps/web/.env.local`):**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

### File Structure
```
/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── globals.css           # Global styles
│   │   ├── components/
│   │   │   ├── logo-maker.tsx        # Main app component
│   │   │   ├── landing/              # Landing page sections
│   │   │   └── ui/                   # shadcn/ui components
│   │   └── lib/
│   │       └── utils.ts              # Utility functions (cn)
│   │
│   └── api/                          # Hono API server
│       ├── src/
│       │   ├── index.ts              # Hono entrypoint
│       │   ├── routes/
│       │   │   └── predictions.ts    # Prediction endpoints
│       │   └── db/
│       │       ├── index.ts          # Database connection
│       │       └── schema.ts         # Drizzle schema
│       ├── drizzle/                  # Generated migrations
│       └── drizzle.config.ts         # Drizzle CLI config
│
├── docs/                             # Documentation
├── turbo.json                        # Turborepo config
└── package.json                      # Root workspace config
```

---

## 12. API Inventory

| Endpoint | Method | Auth | Request | Response | Handler |
|----------|--------|------|---------|----------|---------|
| /api/predictions | GET | Session | limit, offset | history + pagination | `apps/api/src/routes/predictions.ts` |
| /api/predictions | POST | Session | JSON body | predictionID | `apps/api/src/routes/predictions.ts` |
| /api/predictions/{id} | GET | Session | Path param | Prediction status | `apps/api/src/routes/predictions.ts` |
| / | GET | None | None | "API is running" | `apps/api/src/index.ts` |
| /health | GET | None | None | `{status: "ok"}` | `apps/api/src/index.ts` |

---

## Conclusion

LogoLoco is a modern monorepo application with a clear separation between the Next.js frontend and Hono API backend. The architecture supports:
- Independent scaling of web and API
- Database persistence with Drizzle ORM
- Clean API boundaries with Zod validation
- Efficient AI integration with polling-based status updates

For production deployment, consider adding user authentication, rate limiting, and payment integration.
