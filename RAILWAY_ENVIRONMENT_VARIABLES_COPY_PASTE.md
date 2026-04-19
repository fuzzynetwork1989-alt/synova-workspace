# Railway Environment Variables - Copy and Paste Ready

## synova-core-api Environment Variables
```
PORT=8000
PYTHONUNBUFFERED=1
ENVIRONMENT=production
NODE_ENV=production
LOG_LEVEL=info
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
JWT_SECRET=your_jwt_secret_32_chars_minimum
SESSION_SECRET=your_session_secret_32_chars_minimum
```

## synova-ui-system Environment Variables
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://synova-core-api-production.up.railway.app
PORT=3000
```

## synova-holo-renderer Environment Variables
```
NODE_ENV=production
PORT=3001
API_URL=https://synova-core-api-production.up.railway.app
```

## synova-monitoring Environment Variables
```
NODE_ENV=production
PORT=3002
API_URL=https://synova-core-api-production.up.railway.app
SENTRY_DSN=your_sentry_dsn_here
```

## synova-revenue Environment Variables
```
NODE_ENV=production
PORT=3003
API_URL=https://synova-core-api-production.up.railway.app
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

## synova-voice-integration Environment Variables
```
NODE_ENV=production
PORT=3004
API_URL=https://synova-core-api-production.up.railway.app
```

## Instructions:
1. Copy each section above
2. Go to Railway service settings
3. Click "Variables" tab
4. Click "New Variable" for each line
5. Paste the name and value separately
6. Click "Save Variables"
7. Railway will automatically redeploy
