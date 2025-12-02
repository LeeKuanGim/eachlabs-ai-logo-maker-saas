# Database Documentation

## Technology Stack

### Core Technologies
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Query Builder**: Drizzle Kit for migrations
- **Language**: TypeScript with type-safe queries

## Database Schema

### Logo Generations Table (`logo_generations`)

Stores all logo generation requests with metadata and results.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| userId | TEXT (FK) | References `user.id`, null on delete |
| appName | TEXT | Application name |
| appFocus | TEXT | Application focus/theme |
| color1 | VARCHAR(64) | Primary color |
| color2 | VARCHAR(64) | Secondary color |
| model | VARCHAR(64) | AI model used |
| outputCount | INTEGER | Number of images requested |
| creditsCharged | INTEGER | Credits deducted for the request |
| prompt | TEXT | Generated prompt sent to AI |
| status | ENUM | queued, running, succeeded, failed |
| providerPredictionId | VARCHAR(128) | Eachlabs prediction ID |
| images | JSONB | Array of generated image URLs |
| providerResponse | JSONB | Full provider response |
| error | TEXT | Error message (if failed) |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

#### Indexes
- `logo_generations_created_at_idx`: On `createdAt` for time-based queries
- `logo_generations_status_idx`: On `status` for status filtering
- `logo_generations_provider_prediction_id_idx`: On `providerPredictionId` for lookups
- `logo_generations_user_id_created_at_idx`: On `userId` + `createdAt DESC` for user history

### User Credit Balances Table (`user_credit_balances`)

Manages user credit balances and usage statistics.

| Column | Type | Description |
|--------|------|-------------|
| userId | TEXT | Primary key, references user ID |
| balance | INTEGER | Current credit balance |
| totalPurchased | INTEGER | Total credits purchased |
| totalUsed | INTEGER | Total credits consumed |
| lastTransactionAt | TIMESTAMP | Timestamp of last transaction |
| createdAt | TIMESTAMP | Record creation time |
| updatedAt | TIMESTAMP | Last update time |

### Credit Transactions Table (`credit_transactions`)

Tracks all credit-related transactions for auditing.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| userId | TEXT | User ID associated with transaction |
| type | ENUM | Transaction type (signup_bonus, purchase, usage, refund, etc.) |
| amount | INTEGER | Credits added/removed |
| balanceAfter | INTEGER | Balance after transaction |
| description | TEXT | Transaction description |
| polarOrderId | VARCHAR(256) | Related Polar order ID |
| polarProductId | VARCHAR(256) | Related Polar product ID |
| logoGenerationId | UUID | Related logo generation ID |
| performedBy | TEXT | User who performed the action |
| metadata | JSONB | Additional transaction metadata |
| createdAt | TIMESTAMP | Transaction timestamp |

#### Credit Transaction Indexes
- `credit_transactions_user_id_created_at_idx`: On `userId` + `createdAt DESC` 
- `credit_transactions_user_id_idx`: On `userId` for lookups
- `credit_transactions_type_created_at_idx`: On `type` + `createdAt` for analytics
- `credit_transactions_polar_order_id_idx`: On `polarOrderId` for order tracking
- `credit_transactions_logo_generation_id_idx`: On `logoGenerationId` for generation tracking

### Credit Packages Table (`credit_packages`)

Defines available credit packages for purchase.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| name | VARCHAR(128) | Package name |
| credits | INTEGER | Number of credits in package |
| priceInCents | INTEGER | Price in cents |
| polarProductId | VARCHAR(256) | Related Polar product ID |
| isActive | BOOLEAN | Whether package is available for purchase |
| sortOrder | INTEGER | Order for display |
| metadata | JSONB | Additional package metadata |
| createdAt | TIMESTAMP | Package creation time |
| updatedAt | TIMESTAMP | Last update time |

#### Credit Packages Indexes
- `credit_packages_polar_product_id_idx`: On `polarProductId` for lookups
- `credit_packages_active_order_idx`: On `isActive` + `sortOrder` for display

### Authentication Tables

The application uses Better Auth which creates its own tables for user management:
- `user`: User accounts
- `account`: OAuth provider accounts
- `session`: User sessions
- `verification`: Email verification tokens
- `account_activation`: Account activation tokens

## Migration Management

### Drizzle Kit Commands
```bash
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Run pending migrations
bun run db:push      # Push schema directly (dev only)
bun run db:studio    # Open Drizzle Studio GUI
```

### Migration Files
- Located in `apps/api/src/db/migrations/`
- Versioned with timestamps
- Automatically generated from schema changes
- Applied sequentially with proper dependencies

## Database Configuration

### Connection Pooling
- **Max Connections**: Configured via `PGPOOL_MAX` (default: 50)
- **Idle Timeout**: Configured via `PGPOOL_IDLE_MS` (default: 30000ms)
- **Connection Timeout**: Configured via `PGPOOL_CONN_TIMEOUT_MS` (default: 5000ms)
- **SSL Support**: Configured via `DATABASE_SSL` (default: false)

### Environment Variables
```bash
DATABASE_URL=postgres://user:pass@host:port/db
DATABASE_SSL=true              # Enable SSL for production
PGPOOL_MAX=50                  # Maximum pool size
PGPOOL_IDLE_MS=30000           # Pool idle timeout
PGPOOL_CONN_TIMEOUT_MS=5000    # Connection timeout
```

## Query Patterns

### Common Queries

#### Get User's Generation History
```sql
SELECT * FROM logo_generations 
WHERE user_id = $1 
  AND created_at >= $2 
ORDER BY created_at DESC 
LIMIT $3 OFFSET $4
```

#### Update Generation Status
```sql
UPDATE logo_generations 
SET status = $1, images = $2, provider_response = $3, updated_at = $4 
WHERE provider_prediction_id = $5
```

#### Deduct Credits Safely
```sql
UPDATE user_credit_balances 
SET balance = balance - $1, last_transaction_at = $2 
WHERE user_id = $3 AND balance >= $1
```

## Performance Optimization

### Indexing Strategy
- Primary indexes on foreign keys and frequently queried fields
- Composite indexes for multi-column queries
- Time-series indexes for historical queries
- Optimized for read-heavy operations

### Query Optimization
- Proper SELECT field specification to avoid over-fetching
- Efficient JOIN operations with properly indexed foreign keys
- Use of JSONB for flexible data storage without schema changes
- Prepared statements to prevent SQL injection

## Data Retention

### Generation Retention
- Default retention: 365 days (configurable via `GENERATION_RETENTION_DAYS`)
- Automatic cleanup of older generations
- Soft deletion approach for data recovery

### Audit Trail
- Credit transaction history maintained permanently
- Generation metadata preserved for debugging
- Proper logging for compliance requirements

## Backup and Recovery

### Backup Strategy
- PostgreSQL native backup tools (pg_dump)
- Scheduled automated backups
- Point-in-time recovery capability

### Recovery Procedures
- Database restore procedures
- Data validation post-restore
- Application state synchronization after restore