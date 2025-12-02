# Authentication Documentation

## Technology Stack

### Core Technology
- **Authentication Provider**: Better Auth
- **Integration**: Custom server and client setup
- **Session Management**: Cookie-based sessions
- **Additional Features**: Anonymous authentication, Polar integration

## Authentication Architecture

### Server-Side Setup (`apps/api/src/auth.ts`)

The authentication server is configured with:

- **Database Adapter**: Drizzle adapter for PostgreSQL integration
- **Email/Password**: Enabled for account creation and login
- **Anonymous Authentication**: Enabled for guest sessions
- **Polar Integration**: Payment processing with checkout functionality

### Client-Side Integration (`apps/web/lib/auth-client.ts`)

The frontend uses Better Auth's client SDK to:

- Connect to the API server authentication endpoints
- Handle session state management
- Provide authentication utilities to components
- Manage tokens and session persistence

## Configuration

### Environment Variables
```bash
BETTER_AUTH_SECRET=your_secret_key      # Secret key for session encryption
BETTER_AUTH_URL=http://localhost:3002   # Base URL for auth server
POLAR_ACCESS_TOKEN=your_polar_token     # Access token for Polar integration
POLAR_CHECKOUT_SUCCESS_URL=http://localhost:3000/checkout/success?checkout_id={CHECKOUT_ID}
POLAR_CHECKOUT_RETURN_URL=http://localhost:3000/account
POLAR_SERVER=sandbox                    # Environment: sandbox or production
```

### CORS Configuration
- Origins defined in `ALLOWED_ORIGINS` environment variable
- Credentials enabled for secure session management
- Supports both development and production domains

## Authentication Flow

### 1. User Registration/Login
1. User provides email and password
2. Better Auth validates credentials
3. Session cookie is set with secure tokens
4. User is redirected to appropriate page

### 2. Session Management
1. Session tokens stored in secure, HTTP-only cookies
2. Session validation on protected API routes
3. Automatic session refresh when needed
4. Proper logout functionality

### 3. Anonymous Authentication
1. Automatic session creation for guest users
2. Email domain: `guest.logoloco.local` for anonymous users
3. Guest session persistence across visits
4. Option to upgrade to full account later

## Route Protection

### API Route Protection
Each protected API endpoint includes:
```typescript
const user = await getAuthUser(c.req.raw)
if (!user) {
  return c.json({ error: "Authentication required" }, 401)
}
```

### Frontend Route Protection
Components check authentication state before allowing access:
- Generation history requires authentication
- Credit management requires authentication
- Download functionality requires authentication

## Integration Points

### API Endpoints
- **Authentication**: `/api/auth/*` - Handled by Better Auth
- **User Data**: Protected endpoints check session validity
- **Credits**: Credit endpoints require authentication
- **Generations**: History endpoints require authentication

### Database Integration
- User sessions stored in Better Auth's database tables
- Foreign key relationships with `logo_generations` table
- User-specific data filtering based on session

## Anonymous User Support

### Guest Session Creation
- Automatic creation of anonymous sessions
- Special email domain (`guest.logoloco.local`) for tracking
- Full functionality available in guest mode (except downloads)

### Guest to Registered User Flow
1. Guest user creates account
2. Anonymous session merged with new account
3. Previous generation history preserved
4. Credits transferred appropriately

## Security Features

### Session Security
- Encrypted session tokens
- Secure, HTTP-only cookies
- Session timeout configuration
- CSRF protection built-in

### Password Security
- Built-in password validation
- Secure password hashing
- Password reset functionality
- Account lockout mechanisms

## Payment Integration

### Polar Checkout Integration
- Automatic customer creation on sign-up
- Secure checkout flows
- Webhook handling for payment status updates
- Credit package purchases linked to user accounts

### Subscription/Purchase Flow
1. User selects credit package
2. Redirected to secure Polar checkout
3. Webhook processes successful purchase
4. Credits added to user account automatically

## Error Handling

### Authentication Errors
- **401 Unauthorized**: Missing or invalid session
- **403 Forbidden**: Access to another user's data
- Proper error messages to guide user action
- Secure error message formatting

### Session Errors
- Session expiration handling
- Automatic re-authentication prompts
- Graceful degradation of functionality
- Clear user communication about state

## Migration and Maintenance

### Schema Considerations
- Better Auth manages its own database schema
- Migration files included with Better Auth
- Compatibility with existing application schema
- Proper indexing on authentication-related fields

### Updates and Maintenance
- Better Auth version compatibility
- Schema migration management
- Session data migration between versions
- Testing authentication flows after updates