# API Reference

## Configuration

### Base URLs
- **Internal API**: `http://localhost:3002` (configurable via `NEXT_PUBLIC_API_BASE_URL`)
- **External API**: `https://api.eachlabs.ai/v1/prediction/`

### Authentication
- **Internal Auth**: Better Auth sessions for app endpoints
- **External Auth**: API key via `X-API-Key` header for Eachlabs provider

---

## Prediction Endpoints

### 1. Get Generation History

#### `GET /api/predictions`

Lists the authenticated user's generation history with retention filtering and pagination.

**Authentication**: Required (Better Auth session)

**Query Parameters**:
- `limit` (optional, default: 50, max: 100): Number of results to return
- `offset` (optional, default: 0): Pagination offset

**Response (Success - 200)**:
```typescript
{
  history: LogoGeneration[]
  pagination: { 
    limit: number; 
    offset: number 
  }
}
```

**Response (Error - 401)**:
```json
{
  "error": "Authentication required"
}
```

**Notes**: Results are filtered to the requesting user and to the last 365 days by default (`GENERATION_RETENTION_DAYS` override).

---

### 2. Create New Generation

#### `POST /api/predictions`

Creates a new logo generation prediction.

**Authentication**: Required (Better Auth session); charges `outputCount` credits (1 per logo output, max 4 per request)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
{
  appName: string,      // Application name (min 2 chars)
  appFocus: string,     // Application focus/theme (min 2 chars)
  color1: string,       // Primary color
  color2: string,       // Secondary color
  model: string,        // Model selection: "nano-banana" | "seedream-v4" | "reve-text"
  outputCount: string   // Number of images to generate: "1" | "2" | "3" | "4"
}
```

**Response (Success - 200)**:
```typescript
{
  predictionID: string,  // Provider prediction identifier
  prediction: object     // Full Eachlabs response (for debugging)
}
```

**Model-Specific Parameters**:
- **nano-banana**: `output_format: "png"`, `aspect_ratio: "1:1"`, `limit_generations: true`
- **seedream-v4**: `image_size: "square_hd"`, `enable_safety_checker: true`
- **reve-text**: `aspect_ratio: "1:1"`, `output_format: "png"`

**Response (Error - 400)**:
```json
{
  "error": "Invalid request body" | "Invalid model selected"
}
```

**Response (Error - 402)**:
```json
{
  "error": "Insufficient credits",
  "balance": number,
  "required": number
}
```

**Response (Error - 500)**:
```json
{
  "error": "EACHLABS_API_KEY is not set" | "Internal server error"
}
```

**Response (Error - 502)**:
```json
{
  "error": "Failed to reach provider" | "Invalid provider response"
}
```

---

### 3. Get Prediction Status

#### `GET /api/predictions/{id}`

Retrieves prediction status and results.

**Authentication**: Required; must be the owner of the generation

**Path Parameters**:
- `id` (string, required): Prediction ID from creation endpoint

**Response (Success - 200)**:
```typescript
{
  status: "queued" | "running" | "success" | "failed",
  output?: string[]  // Generated image URLs (on success)
  // ... full Eachlabs response passthrough
}
```

**Response (Error - 400)**:
```json
{
  "error": "Invalid prediction id"
}
```

**Response (Error - 401)**:
```json
{
  "error": "Authentication required"
}
```

**Response (Error - 403)**:
```json
{
  "error": "Forbidden (prediction does not belong to user)"
}
```

**Response (Error - 500)**:
```json
{
  "error": "EACHLABS_API_KEY is not set" | "Internal server error"
}
```

**Response (Error - 502)**:
```json
{
  "error": "Failed to reach provider"
}
```

---

## Additional Endpoints

### 4. Health Check

#### `GET /`

Verifies that the API server is running.

**Response (Success - 200)**:
```
API is running
```

---

### 5. Health Status

#### `GET /health`

Returns application health status.

**Response (Success - 200)**:
```json
{
  "status": "ok"
}
```

---

## Error Handling

### Common Error Scenarios

| Status Code | Error Message | Cause | Solution |
|------------|---------------|-------|----------|
| 400 | Invalid request body / Invalid model selected | Malformed request or unknown model | Validate request body format and use valid model |
| 401 | Authentication required | Missing or invalid session | Authenticate via Better Auth |
| 402 | Insufficient credits | Not enough credits for request | Purchase more credits |
| 403 | Forbidden | Attempting to access another user's data | Access only your own predictions |
| 404 | Prediction not found | Invalid prediction ID | Verify prediction ID from create response |
| 500 | EACHLABS_API_KEY is not set | Missing configuration | Set environment variable |
| 500 | Internal server error | Unexpected error | Check server logs |
| 502 | Failed to reach provider | Eachlabs API unreachable | Retry or check provider status |

---

## Performance Considerations

### Current Implementation
- Efficient polling mechanism with 2-second intervals
- 5-minute timeout prevents hung requests
- Server-side rate limiting (10 requests per minute for predictions)

### Recommendations
- Implement WebSocket connections for real-time updates
- Add caching for completed predictions
- Use request queuing for high-volume scenarios