# Synova AI API System Guide
Complete documentation of the Synova AI API system, authentication, and token management

## Overview
Synova AI has a complete REST API system built with FastAPI that provides access to all AI capabilities including Deep Resonance Thinking, multi-agent orchestration, RAG, memory, and more.

## API Architecture

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.synova.ai` (configure in deployment)

### API Endpoints

#### Core Endpoints
- `GET /` - API information and status
- `GET /health` - Health check for all services
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

#### Chat & Reasoning
- `POST /api/chat/stream` - Streaming chat responses
- `POST /brain/chat` - Deep Resonance Thinking chat
- `POST /brain/reasoning` - Advanced reasoning endpoint
- `POST /brain/coding` - Code generation and analysis

#### RAG (Retrieval Augmented Generation)
- `POST /api/rag/upload` - Upload documents for indexing
- `POST /api/rag/query` - Query documents with RAG
- `DELETE /api/rag/documents/{id}` - Delete indexed document
- `GET /api/rag/stats` - RAG statistics

#### Multi-Agent System
- `POST /api/agents/supanova/run` - Run Supanova multi-agent system
- `GET /api/agents/stats` - Agent system statistics

#### Autopilot (Application Generation)
- `POST /api/autopilot/build` - Generate full-stack applications
- `GET /api/autopilot/stats` - Autopilot statistics

#### Memory Management
- `GET /api/memory/` - List user memories
- `POST /api/memory/` - Create new memory
- `DELETE /api/memory/{id}` - Delete memory
- `PUT /api/memory/{id}` - Update memory

#### Usage & Billing
- `GET /api/usage/` - Get overall usage statistics
- `GET /api/usage/summary/{tenant_id}` - Get tenant usage summary

#### Vision & Voice
- `POST /api/vision/analyze` - Analyze images with AI
- `POST /api/voice/transcribe` - Transcribe audio to text
- `POST /api/voice/synthesize` - Synthesize text to speech

#### Brain Management
- `GET /brain/status` - Brain component status
- `GET /brain/health` - Brain health check
- `POST /brain/mode` - Switch brain mode
- `GET /brain/governance/dashboard` - Governance dashboard
- `GET /brain/observability/metrics` - Observability metrics

## Authentication System

### JWT-Based Authentication
Synova AI uses JWT (JSON Web Tokens) for API authentication.

#### How It Works
1. User registers/logs in via auth endpoint
2. Server generates JWT token with user ID and claims
3. Client includes token in `Authorization: Bearer <token>` header
4. Server validates token on each request
5. Token expires after configured time (default: 24 hours)

#### Token Structure
```json
{
  "user_id": "user_123",
  "tenant_id": "tenant_456",
  "role": "user",
  "exp": 1714567890,
  "iat": 1714481490
}
```

### API Keys
For programmatic access, Synova AI supports API keys.

#### API Key Format
```
synova_sk_<tenant_id>_<random_string>
```

Example: `synova_sk_tenant_abc123_xyz789`

### Token Generation Methods

#### Method 1: Free Self-Generated Tokens (Development)
For development and testing, you can generate your own tokens:

```python
import jwt
import secrets
from datetime import datetime, timedelta

def generate_free_token(user_id: str, secret: str = "your-jwt-secret"):
    """Generate a free token for development"""
    payload = {
        "user_id": user_id,
        "tenant_id": "dev_tenant",
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(days=365),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

# Generate token
token = generate_free_token("dev_user")
print(f"Bearer {token}")
```

#### Method 2: API Key Generation
```python
import secrets

def generate_api_key(tenant_id: str):
    """Generate API key for a tenant"""
    random_part = secrets.token_urlsafe(32)
    api_key = f"synova_sk_{tenant_id}_{random_part}"
    return api_key

# Generate API key
api_key = generate_api_key("tenant_123")
print(api_key)
```

#### Method 3: Registration Endpoint (Production)
In production, users register via the API:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password",
    "tenant_name": "My Company"
  }'
```

Response:
```json
{
  "user_id": "user_123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "api_key": "synova_sk_tenant_abc_xyz789"
}
```

### Using Tokens

#### With Bearer Token
```bash
curl -X POST http://localhost:8000/api/chat/stream \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'
```

#### With API Key
```bash
curl -X POST http://localhost:8000/api/chat/stream \
  -H "X-API-Key: synova_sk_tenant_abc_xyz789" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'
```

### Token Management

#### Token Refresh
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Authorization: Bearer <expired_token>"
```

#### Token Revocation
```bash
curl -X POST http://localhost:8000/api/auth/revoke \
  -H "Authorization: Bearer <token>"
```

#### API Key Rotation
```bash
curl -X POST http://localhost:8000/api/auth/rotate-key \
  -H "Authorization: Bearer <token>"
```

## Rate Limiting

### Default Limits
- **Free Tier**: 100 requests/minute
- **Pro Tier**: 1000 requests/minute
- **Enterprise**: Unlimited

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1714567890
```

### Handling Rate Limits
```python
import time
import requests

def make_request_with_retry(url, headers, data, max_retries=3):
    for attempt in range(max_retries):
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 429:
            # Rate limited - wait and retry
            retry_after = int(response.headers.get("Retry-After", 60))
            time.sleep(retry_after)
            continue
        
        return response
    
    raise Exception("Max retries exceeded")
```

## Usage Tracking

### Request Format
All requests are tracked with:
- User ID
- Tenant ID
- Timestamp
- Endpoint used
- Token count
- Cost
- Latency

### Usage Endpoint
```bash
curl -X GET http://localhost:8000/api/usage/ \
  -H "Authorization: Bearer <token>"
```

Response:
```json
{
  "total_requests": 1000,
  "total_tokens": 500000,
  "total_cost": 5.50,
  "by_endpoint": {
    "/api/chat/stream": 500,
    "/brain/chat": 300,
    "/api/rag/query": 200
  },
  "by_date": {
    "2024-04-23": 100,
    "2024-04-22": 150
  }
}
```

## Billing Integration

### Stripe Integration
Synova AI uses Stripe for subscription billing.

### Subscription Tiers
- **Starter**: $9/month - 100K tokens/month
- **Pro**: $49/month - 1M tokens/month
- **Enterprise**: Custom - Unlimited tokens

### Quota Enforcement
```python
# In billing_service.py
async def check_quota(tenant_id: str, tokens: int) -> bool:
    """Check if tenant has sufficient quota"""
    usage = await get_usage(tenant_id)
    quota = await get_quota(tenant_id)
    
    return usage + tokens <= quota
```

## Environment Variables

### Required Variables
```bash
# API Configuration
APP_HOST=0.0.0.0
APP_PORT=8000
APP_ENV=development
DEBUG=true

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION_HOURS=24

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Redis
REDIS_URL=redis://localhost:6379

# LLM Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Billing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Quick Start

### 1. Start the API Server
```bash
cd apps/api/src
python main.py
```

### 2. Generate a Free Token
```python
import jwt
from datetime import datetime, timedelta

secret = "dev-secret"  # Change in production
payload = {
    "user_id": "test_user",
    "tenant_id": "test_tenant",
    "role": "admin",
    "exp": datetime.utcnow() + timedelta(days=365)
}
token = jwt.encode(payload, secret, algorithm="HS256")
print(f"Bearer {token}")
```

### 3. Make Your First Request
```bash
curl -X POST http://localhost:8000/brain/chat \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "prompt": "Explain Deep Resonance Thinking",
    "complexity": 0.8
  }'
```

### 4. View Interactive Documentation
Open `http://localhost:8000/docs` in your browser for interactive API documentation.

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate tokens regularly** - Especially for production
3. **Use HTTPS in production** - Never expose API over HTTP
4. **Implement IP whitelisting** - For enterprise accounts
5. **Monitor usage** - Track unusual activity
6. **Revoke compromised tokens** - Immediately revoke suspicious tokens

## Troubleshooting

### 401 Unauthorized
- Check token is valid and not expired
- Verify token is sent in correct header
- Ensure JWT_SECRET matches between generation and validation

### 429 Too Many Requests
- Check rate limit headers
- Implement exponential backoff
- Consider upgrading subscription tier

### 500 Internal Server Error
- Check server logs
- Verify all environment variables are set
- Ensure dependent services (database, Redis) are running

## Next Steps
- Read the User Manual for detailed usage instructions
- Review legal documents (Terms of Service, Privacy Policy)
- Set up production deployment
- Configure billing with Stripe
