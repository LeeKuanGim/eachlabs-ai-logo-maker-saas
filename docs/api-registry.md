# API Registry - Eachlabs AI Logo Maker

## API Configuration

### Base URLs
- **Internal API**: `http://localhost:3000/api` (development)
- **External API**: `https://api.eachlabs.ai/v1/prediction/`

### Authentication
- **Type**: API Key
- **Header**: `X-API-Key`
- **Storage**: Environment variable `EACHLABS_API_KEY`

---

## Endpoint Documentation

### 1. Create Logo Prediction

#### `POST /api/predictions`

Creates a new AI logo generation request.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
interface CreatePredictionRequest {
  appName: string;      // Min 2 characters, e.g., "Tuncer Kuruyemis"
  appFocus: string;     // Min 3 characters, e.g., "Antep Fistigi"
  color1: string;       // Primary color name or hex
  color2: string;       // Secondary color name or hex
  model: "nano-banana" | "seedream-v4" | "reve-text";
  outputCount: "1" | "2" | "3" | "4";
}
```

**Response (Success - 200):**
```typescript
interface CreatePredictionResponse {
  predictionID: string;  // UUID for tracking the generation
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid model selected"
}
```

**Response (Error - 500):**
```json
{
  "error": "EACHLABS_API_KEY is not set" | "Internal server error"
}
```

**Implementation Details:**
- Constructs a Turkish language prompt for logo generation
- Maps model names to Eachlabs API model identifiers
- Applies model-specific parameters for optimal results
- Returns immediately with prediction ID (async processing)

**Model Configurations:**

| Model | Eachlabs Name | Special Parameters |
|-------|--------------|-------------------|
| nano-banana | nano-banana | output_format: "png", aspect_ratio: "1:1", limit_generations: true |
| seedream-v4 | seedream-v4-text-to-image | image_size: "square_hd", enable_safety_checker: true |
| reve-text | reve-text-to-image | aspect_ratio: "1:1", output_format: "png" |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "FinansTakip",
    "appFocus": "Cüzdan",
    "color1": "Turkuaz",
    "color2": "Safir Yesil",
    "model": "nano-banana",
    "outputCount": "2"
  }'
```

---

### 2. Get Prediction Status

#### `GET /api/predictions/[id]`

Retrieves the status and results of a logo generation prediction.

**Path Parameters:**
- `id` (string, required): The prediction ID received from the create endpoint

**Request Headers:**
None required

**Response (Success - 200):**
```typescript
interface PredictionStatusResponse {
  status: "processing" | "success" | "failed" | "error";
  output?: string | string[];  // URLs of generated images (when status is "success")
  error?: string;              // Error message (when status is "failed" or "error")
  progress?: number;           // Optional progress percentage
}
```

**Response (Error - 500):**
```json
{
  "error": "EACHLABS_API_KEY is not set" | "Internal server error"
}
```

**Status Definitions:**
- `processing`: Generation is in progress
- `success`: Images generated successfully
- `failed`: Generation failed (see error field)
- `error`: System error occurred

**Polling Strategy:**
- Client should poll every 2 seconds
- Continue polling while status is "processing"
- Stop polling on "success", "failed", or "error"
- Typical generation time: 5-20 seconds

**Example Request:**
```bash
curl http://localhost:3000/api/predictions/550e8400-e29b-41d4-a716-446655440000
```

**Example Success Response:**
```json
{
  "status": "success",
  "output": [
    "https://storage.eachlabs.ai/predictions/550e8400/image_1.png",
    "https://storage.eachlabs.ai/predictions/550e8400/image_2.png"
  ]
}
```

---

## Error Handling

### Common Error Scenarios

| Status Code | Error Message | Cause | Solution |
|------------|---------------|-------|----------|
| 400 | Invalid model selected | Unknown model name | Use valid model: nano-banana, seedream-v4, or reve-text |
| 401 | Unauthorized | Invalid Eachlabs API key | Check EACHLABS_API_KEY environment variable |
| 404 | Prediction not found | Invalid prediction ID | Verify prediction ID from create response |
| 429 | Rate limit exceeded | Too many requests | Implement backoff strategy |
| 500 | EACHLABS_API_KEY is not set | Missing configuration | Set environment variable |
| 500 | Internal server error | Unexpected error | Check server logs |

---

## Rate Limits & Performance

### Current Implementation
- No internal rate limiting
- Relies on Eachlabs API limits
- Polling interval: 2 seconds (hardcoded)

### Recommendations
- Implement rate limiting middleware
- Add exponential backoff for polling
- Cache prediction results
- Add request timeout handling

---

## Integration Examples

### React Hook Example
```typescript
const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const generateLogo = async (params: CreatePredictionRequest) => {
    setLoading(true);

    // Create prediction
    const createRes = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const { predictionID } = await createRes.json();

    // Poll for results
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusRes = await fetch(`/api/predictions/${predictionID}`);
      const result = await statusRes.json();

      if (result.status === "success") {
        setImages(result.output);
        setLoading(false);
        break;
      } else if (result.status === "failed" || result.status === "error") {
        setLoading(false);
        throw new Error(result.error);
      }
    }
  };

  return { generateLogo, loading, images };
};
```

---

## Security Considerations

### Current Implementation
- API key stored in environment variable
- Server-side API calls only
- No client exposure of API keys

### Security Gaps
- No request signing
- No CSRF protection
- No input sanitization beyond type checking
- No audit logging
- No rate limiting

### Recommended Improvements
1. Add request validation middleware
2. Implement rate limiting per IP
3. Add CSRF token validation
4. Sanitize color inputs
5. Add comprehensive logging
6. Implement API versioning
7. Add request/response encryption for sensitive data