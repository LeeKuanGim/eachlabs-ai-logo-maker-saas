# LogoLoco - AI Logo Maker SaaS

## Project Overview

LogoLoco is a modern, monorepo SaaS application for AI-powered logo generation. Built with Next.js 15.5 and TypeScript as the frontend, and Hono with Bun runtime as the backend API, it enables users to create professional, minimalist logos in seconds without design expertise. The platform supports multiple AI models (Nano Banana, Seedream v4, Reve Text) and implements a credit-based system with optional paid packages via Polar.

### Key Features
- Multi-model AI logo generation with real-time polling
- Credit-based system with signup bonus and package purchases
- Responsive design with dark/light mode support
- Authentication via Better Auth with anonymous session support
- PostgreSQL database with Drizzle ORM
- Real-time generation status tracking
- Download functionality for generated logos

## Architecture

The application follows a monorepo structure using Turborepo and Bun workspaces:

```
eachlabs-ai-logo-maker-saas/
├── apps/
│   ├── web/                      # Next.js frontend app
│   └── api/                      # Hono API server
├── docs/                         # Documentation
├── node_modules/                 # Dependencies
└── various config files
```

### Tech Stack
- **Frontend**: Next.js 15.5 (App Router), React 19, TypeScript, Tailwind CSS 4.x
- **UI Components**: Radix UI, shadcn/ui, Lucide React
- **Backend**: Hono framework, Bun runtime
- **Authentication**: Better Auth with anonymous support
- **Database**: PostgreSQL with Drizzle ORM
- **Package Manager**: Bun
- **Build System**: Turborepo

## Building and Running

### Prerequisites
- Node.js 20.x or higher
- Bun package manager
- PostgreSQL database
- Eachlabs API key

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/altudev/eachlabs-ai-logo-maker-saas.git
cd eachlabs-ai-logo-maker-saas
```

2. **Install dependencies**:
```bash
bun install
```

3. **Set up PostgreSQL**:
```bash
docker run --name altu-postgres -p 1453:5432 -e POSTGRES_PASSWORD=123alper123 -d postgres:16.9-alpine3.22
```

4. **Configure environment variables**:
Create `.env.local` in the web app folder and `.env` in the api folder with the following:
```bash
# For API app (apps/api/.env)
DATABASE_URL=postgres://user:pass@localhost:1453/db
DATABASE_SSL=true
EACHLABS_API_KEY=your_api_key_here
PORT=3002
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
GENERATION_RETENTION_DAYS=365
POLAR_ACCESS_TOKEN=your_polar_org_access_token
POLAR_CHECKOUT_SUCCESS_URL=http://localhost:3000/checkout/success?checkout_id={CHECKOUT_ID}
POLAR_CHECKOUT_RETURN_URL=http://localhost:3000/account
POLAR_SERVER=sandbox
PGPOOL_MAX=50
PGPOOL_IDLE_MS=30000
PGPOOL_CONN_TIMEOUT_MS=5000
SIGNUP_BONUS_CREDITS=1
ADMIN_EMAILS=admin@example.com
BETTER_AUTH_SECRET=change-me
BETTER_AUTH_URL=http://localhost:3002

# For Web app (apps/web/.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

5. **Run database migrations**:
```bash
bun run db:migrate
```

6. **Start development servers**:
```bash
# Run both web and API
bun run dev

# Or run specific apps
bun run dev -- --filter=web
bun run dev -- --filter=api
```

The web app will be available at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:3002](http://localhost:3002).

### Production Deployment

To build and run in production:
```bash
# Build the applications
bun run build

# Start the applications
bun run start
```

## Development Commands

### General Commands
```bash
# Development with both web and API
bun run dev

# Build all applications
bun run build

# Lint all applications
bun run lint

# Run in production mode
bun run start
```

### Database Commands
```bash
# Generate database migrations
bun run db:generate

# Run database migrations
bun run db:migrate

# Push schema directly to database (dev only)
bun run db:push

# Open Drizzle Studio GUI
bun run db:studio
```

### Running Specific Applications
```bash
# Run only web app
bun run dev -- --filter=web

# Run only API server
bun run dev -- --filter=api
```

## Key Application Components

### Frontend (Apps/web)
- **Main Page**: Located at `apps/web/app/page.tsx`, uses landing page sections
- **Logo Maker Component**: Core functionality at `apps/web/components/logo-maker.tsx`
- **API Communication**: Uses React Query for data fetching and mutations
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn/ui components with Tailwind CSS

### Backend (Apps/api)
- **API Server**: Located at `apps/api/src/index.ts`, uses Hono framework
- **Authentication**: Better Auth implementation at `apps/api/src/auth.ts`
- **Database**: PostgreSQL with Drizzle ORM at `apps/api/src/db/`
- **Routes**: Various route files in `apps/api/src/routes/`
- **Schema**: Database schemas at `apps/api/src/db/schemas/`

### Database Schema
The application uses PostgreSQL with Drizzle ORM and includes:

1. **Auth Tables** (from Better Auth)
2. **Logo Generations** (`logo_generations` table):
   - Stores generation requests with metadata
   - Tracks status, credits charged, and results
   - Includes indexes for efficient querying

3. **Credit System** (`user_credit_balances`, `credit_transactions`, `credit_packages`):
   - Tracks user credits and transactions
   - Supports signup bonuses and purchases
   - Integrates with Polar for payment processing

### API Endpoints

#### Main API Endpoints
- `GET /api/predictions` - Get user's logo generation history
- `POST /api/predictions` - Create a new logo generation
- `GET /api/predictions/{id}` - Get status of a specific prediction
- `GET /api/credits` - Get user's credit balance
- `POST /api/webhooks/polar` - Handle Polar payment webhooks

#### Auth Endpoints
- `POST /api/auth/*` - Better Auth endpoints

## Development Conventions

### Code Style
- TypeScript with strict mode enabled
- Prettier and ESLint for code formatting and linting
- Component structure follows Next.js App Router patterns
- API routes use Hono framework with Zod validation

### File Structure
- Components are organized in `apps/web/components/`
- API routes in `apps/api/src/routes/`
- Database schemas in `apps/api/src/db/schemas/`
- Landing page components in `apps/web/components/landing/`
- UI components in `apps/web/components/ui/`

### Git Workflow
- Feature branches for development
- Descriptive commit messages
- Pull requests for code review

### Testing
- Unit tests with Vitest (API app)
- Integration testing for critical flows
- Manual testing for UI interactions

## Project Specifics

### Authentication
The application uses Better Auth with support for both email and anonymous sessions. Anonymous users can generate logos but need to sign up to download them.

### Payment Integration
Credit system with signup bonus and optional packages via Polar. The system includes transaction tracking and balance management.

### Logo Generation Process
1. User submits form with app details and preferences
2. System validates and deducts credits
3. Request is sent to Eachlabs AI API
4. Real-time status is polled until completion
5. Results are displayed to user for download

### Error Handling
- Client-side form validation with Zod
- API response validation
- Graceful error handling with status codes
- Credit refunds on failed generations
- Timeout handling for long-running requests

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **API Keys**: Verify Eachlabs and Polar API keys are properly configured
3. **CORS**: Check that ALLOWED_ORIGINS includes your development URLs
4. **Credit System**: Verify the signup bonus is properly configured

### Environment Variables
The application requires several environment variables. Make sure all required variables are set, especially:
- `DATABASE_URL`
- `EACHLABS_API_KEY`
- `BETTER_AUTH_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`

### Debugging Tips
- Check browser network tab for API communication
- Monitor both web and API server logs during development
- Use Drizzle Studio for database inspection (`bun run db:studio`)
- Verify credit balance and transactions in the database