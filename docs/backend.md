# Backend Documentation

## Technology Stack

### Core Technologies
- **Framework**: Hono
- **Runtime**: Bun
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Validation**: Zod for request/response validation

## Architecture

### Application Structure
```
apps/api/
├── src/
│   ├── index.ts              # Hono entrypoint and server configuration
│   ├── auth.ts               # Better Auth server instance
│   ├── middleware/
│   │   └── rate-limit.ts     # Rate limiting middleware
│   ├── routes/
│   │   ├── predictions.ts    # Logo generation endpoints
│   │   ├── credits.ts        # Credit management endpoints
│   │   ├── webhooks.ts       # Payment webhooks
│   │   ├── generations.ts    # User generation history
│   │   └── admin.ts          # Administrative endpoints
│   └── db/
│       ├── index.ts          # Database connection setup
│       ├── schema.ts         # Database schema definitions
│       └── schemas/          # Individual schema files
├── drizzle/                  # Generated migrations
├── drizzle.config.ts         # Drizzle CLI configuration
└── package.json              # API package definition
```

## HTTP Server Configuration

### CORS Middleware
- Configured with allowed origins from `ALLOWED_ORIGINS` environment variable
- Credentials enabled for authenticated requests
- Permissive for development environments

### Rate Limiting
- **Strict Rate Limit**: 10 requests per minute for prediction endpoints
- **Moderate Rate Limit**: 30 requests per minute for credit endpoints
- Custom middleware implementation using memory storage

## Route Organization

### Prediction Routes (`/api/predictions/*`)
Handles all logo generation functionality:
- **POST** `/api/predictions` - Create new logo generation
- **GET** `/api/predictions` - Get user's generation history
- **GET** `/api/predictions/:id` - Get specific generation status

### Credit Routes (`/api/credits/*`)
Manages user credits:
- **GET** `/api/credits` - Get user's credit balance
- **POST** `/api/credits/purchase` - Initiate credit purchase
- **GET** `/api/credits/packages` - Get available credit packages

### Webhook Routes (`/api/webhooks/*`)
Handles external service callbacks:
- **POST** `/api/webhooks/polar` - Process Polar payment notifications

### Generation Routes (`/api/generations/*`)
Manages user's generation history:
- **GET** `/api/generations` - Get user's generation history
- **GET** `/api/generations/:id` - Get specific generation details

### Admin Routes (`/api/admin/*`)
Administrative functionality (admin authentication required):
- **GET** `/api/admin/analytics` - Usage analytics
- **GET** `/api/admin/users` - User management
- **POST** `/api/admin/credits` - Manual credit adjustments

## Database Integration

### Connection Management
- PostgreSQL connection pooling with pg.Pool
- Environment-based configuration for SSL and pool settings
- Global instance to prevent multiple pool creation
- Configurable pool settings via environment variables

### Schema Management
- Drizzle ORM for type-safe database queries
- TypeScript-first schema definitions
- Automatic TypeScript type generation from schema
- Migrations managed through Drizzle Kit

## Authentication Integration

### Better Auth Configuration
- Email/password authentication
- Anonymous user support with guest domain
- Integration with Polar for payment processing
- Session management with secure cookies

### Authentication Middleware
- `getAuthUser()` helper function for route protection
- Session validation for all authenticated endpoints
- Automatic user ID extraction from session
- Proper error handling for unauthenticated requests

## External API Integration

### Eachlabs API Integration
- **Base URL**: `https://api.eachlabs.ai/v1/prediction`
- **Authentication**: API key via `X-API-Key` header
- **Timeout Handling**: Configurable request timeouts (default 30s)
- **Error Recovery**: Automatic credit refunds on provider failures
- **Model Mapping**: Conversion between internal and Eachlabs model names

### Request Flow
1. Validate user input using Zod
2. Check user's credit balance
3. Create database record for the generation
4. Deduct required credits from user balance
5. Make API call to Eachlabs with proper parameters
6. Store provider response in database
7. Return prediction ID to client
8. Handle status polling via separate endpoint

## Error Handling Strategy

### Client-Side Errors (4xx)
- **400**: Invalid request format (validated with Zod)
- **401**: Authentication required
- **402**: Insufficient credits
- **403**: Forbidden access (not owner of resource)
- **404**: Resource not found

### Server-Side Errors (5xx)
- **500**: Internal server error
- **502**: Failed to reach Eachlabs provider
- **503**: Service temporarily unavailable

### Error Recovery
- Automatic credit refunds for failed generations
- Comprehensive error logging for debugging
- Graceful degradation when external services are unavailable
- Proper error message propagation to frontend

## Validation and Security

### Request Validation
- Zod schemas for all incoming requests
- Comprehensive input validation
- Type-safe request handling
- Automated documentation through schema definitions

### Security Measures
- Environment-based configuration of API keys
- Server-side API calls to prevent client exposure
- Rate limiting to prevent abuse
- Input sanitization and validation
- Proper authentication checks on all sensitive endpoints

## Performance Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling for efficient database usage
- Batch operations where appropriate
- Optimized queries with proper selection of fields

### API Performance
- Async request processing
- Connection pooling with configurable settings
- Timeout handling to prevent hanging requests
- Efficient polling mechanism for status updates

## Monitoring and Logging

### Error Logging
- Comprehensive error logging with context
- Structured logging for easier analysis
- Performance monitoring for key operations
- Request/response logging for debugging

### Health Monitoring
- Health check endpoint (`/health`)
- Database connection monitoring
- External API availability monitoring
- Request rate tracking