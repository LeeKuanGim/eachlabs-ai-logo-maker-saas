# Deployment and Environment Configuration

## Development Environment

### Prerequisites
- **Node.js**: Version 20.x or higher
- **Bun**: Version 1.2.22 or higher (primary package manager)
- **PostgreSQL**: Version 14 or higher for database
- **Git**: For version control

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/altudev/eachlabs-ai-logo-maker-saas.git
   cd eachlabs-ai-logo-maker-saas
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up PostgreSQL database:
   ```bash
   docker run --name altu-postgres -p 1453:5432 -e POSTGRES_PASSWORD=123alper123 -d postgres:16.9-alpine3.22
   ```

4. Configure environment variables (see Environment Variables section below)

5. Run database migrations:
   ```bash
   bun run db:migrate
   ```

6. Start development servers:
   ```bash
   bun run dev                    # Both web and API
   bun run dev -- --filter=web   # Only web app
   bun run dev -- --filter=api   # Only API server
   ```

## Environment Variables

### API Server Configuration (`apps/api/.env`)

#### Database Configuration
```bash
DATABASE_URL=postgres://user:pass@localhost:1453/db
DATABASE_SSL=true              # Enable SSL for production
```

#### API Configuration
```bash
EACHLABS_API_KEY=your_eachlabs_api_key
PORT=3002                      # Optional, default 3002
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
```

#### Authentication Configuration
```bash
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3002
```

#### Application Configuration
```bash
GENERATION_RETENTION_DAYS=365
SIGNUP_BONUS_CREDITS=1
ADMIN_EMAILS=admin@example.com
```

#### Payment Configuration
```bash
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_CHECKOUT_SUCCESS_URL=http://localhost:3000/checkout/success?checkout_id={CHECKOUT_ID}
POLAR_CHECKOUT_RETURN_URL=http://localhost:3000/account
POLAR_SERVER=sandbox           # Use 'production' in prod
```

#### Database Pool Configuration
```bash
PGPOOL_MAX=50
PGPOOL_IDLE_MS=30000
PGPOOL_CONN_TIMEOUT_MS=5000
```

#### Timeout Configuration
```bash
EACHLABS_TIMEOUT_MS=30000      # Default 30 seconds
```

### Web Application Configuration (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

## Monorepo Structure

### Repository Structure
```
eachlabs-ai-logo-maker-saas/
├── apps/
│   ├── web/                  # Next.js frontend application
│   └── api/                  # Hono API server
├── docs/                     # Documentation
├── node_modules/             # Dependencies (shared)
├── turbo.json                # Turborepo configuration
├── package.json              # Root workspace configuration
├── tsconfig.base.json        # Shared TypeScript configuration
└── tsconfig.json             # TypeScript project references
```

## Build Process

### Turborepo Commands
```bash
bun run build                    # Build all applications
bun run lint                     # Lint all applications
bun run dev                      # Development mode for all
bun run start                    # Production start for all
```

### Application-Specific Commands
```bash
# Web application
cd apps/web && bun run build
cd apps/web && bun run dev
cd apps/web && bun run start

# API application
cd apps/api && bun run build
cd apps/api && bun run dev
cd apps/api && bun run start
```

### Selective Commands
```bash
bun run dev -- --filter=web     # Only web app
bun run dev -- --filter=api     # Only API server
bun run build -- --filter=web   # Only web build
bun run build -- --filter=api   # Only API build
```

## Database Management

### Migration Commands
```bash
bun run db:generate             # Generate migrations from schema changes
bun run db:migrate              # Run pending migrations
bun run db:push                 # Push schema directly (dev only)
bun run db:studio               # Open Drizzle Studio GUI
```

### Schema Management
- Schema files located in `apps/api/src/db/schemas/`
- TypeScript-first schema definitions
- Automatic TypeScript type generation
- Drizzle Kit manages migration files

## Deployment Strategies

### Local Development Deployment
- Use `bun run dev` for development
- Web app runs on port 3000 by default
- API server runs on port 3002 by default
- Automatic reloading on file changes

### Production Deployment
1. Build applications:
   ```bash
   bun run build
   ```

2. Start production servers:
   ```bash
   bun run start
   ```

3. Configure reverse proxy (nginx, Apache, etc.) to route:
   - `/api/*` → API server port 3002
   - `/*` → Web app server port 3000 (or serve static files)

### Container Deployment
1. Create Dockerfile for each application
2. Use multi-stage builds for optimization
3. Configure environment variables via container configuration
4. Set up volume mounts for persistent data
5. Configure health checks for orchestration

## Environment-Specific Configuration

### Development Environment
- Database SSL: Optional
- Debug logging enabled
- Hot reloading enabled
- Local storage for file uploads
- CORS permissive for local development

### Staging Environment
- Database SSL: Required
- Moderate logging
- No hot reloading
- Staging-specific external services
- Restricted CORS to staging domains

### Production Environment
- Database SSL: Required
- Structured logging
- No hot reloading
- Production external services
- Restricted CORS to production domains
- Performance monitoring enabled

## External Service Configuration

### Eachlabs API Integration
- API key stored in environment variables
- Timeouts configured for reliability
- Error handling for service unavailability
- Fallback mechanisms when possible

### Polar Payment Integration
- Access tokens stored securely
- Webhook endpoints configured
- Sandbox vs production environments
- Secure checkout flows

### Database Service
- Connection pooling configuration
- SSL configuration for production
- Backup and maintenance schedules
- Monitoring and alerting

## Monitoring and Logging

### Application Monitoring
- Response time tracking
- Error rate monitoring
- Resource utilization metrics
- Database query performance

### Logging Configuration
- Structured logging for analysis
- Log level configuration per environment
- Log rotation and archival
- Centralized logging in production

## Security Considerations

### Environment Security
- Never commit secrets to version control
- Use environment variables for configuration
- Encrypt sensitive data in transit and at rest
- Regular security audits of dependencies

### Deployment Security
- HTTPS/TLS termination
- Secure headers configuration
- Rate limiting implementation
- Input validation and sanitization

## Troubleshooting

### Common Issues

#### Database Issues
- Connection refused: Check database is running and accessible
- SSL errors: Verify DATABASE_SSL setting
- Migration failures: Check migration files and dependencies

#### Authentication Issues
- 401 errors: Verify session configuration and CORS settings
- Redirect loops: Check BETTER_AUTH_URL configuration
- Anonymous sessions not working: Verify configuration

#### API Communication Issues
- CORS errors: Check ALLOWED_ORIGINS configuration
- API keys not working: Verify EACHLABS_API_KEY setting
- Timeout errors: Check timeout configuration

#### Build Issues
- Missing dependencies: Run bun install in root
- TypeScript errors: Check tsconfig configuration
- Bundle size issues: Analyze and optimize dependencies

### Debugging Commands
```bash
# Check current environment variables
bun run --cwd apps/api printenv | grep -i auth
bun run --cwd apps/web printenv | grep -i public

# Run with additional logging
DEBUG=* bun run dev

# Check specific service status
curl http://localhost:3002/health
curl http://localhost:3000/api/health (if available)
```