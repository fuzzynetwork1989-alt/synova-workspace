# Railway Individual Service Deployment Guide

## Overview

This guide walks through deploying each Synova AI service as an individual Railway app for better scaling and management.

## Services to Deploy

### 1. synova-core-api (Python FastAPI Backend)

- **Purpose**: AI generation, authentication, file upload
- **Port**: 8000
- **Health Check**: `/health`
- **Dockerfile**: Available

### 2. synova-ui-system (Next.js Frontend)

- **Purpose**: Main web interface
- **Port**: 3000
- **Health Check**: `/` (root)
- **Dockerfile**: Available

### 3. synova-holo-renderer (3D Rendering Service)

- **Purpose**: 3D blueprint rendering
- **Port**: 3001
- **Health Check**: `/health`
- **Dockerfile**: Available

### 4. synova-monitoring (Monitoring Service)

- **Purpose**: System monitoring and metrics
- **Port**: 3002
- **Health Check**: `/health`
- **Dockerfile**: Available

### 5. synova-revenue (Revenue Management)

- **Purpose**: Stripe integration and billing
- **Port**: 3003
- **Health Check**: `/health`
- **Dockerfile**: Available

### 6. synova-voice-integration (Voice Service)

- **Purpose**: Voice processing and integration
- **Port**: 3004
- **Health Check**: `/health`
- **Dockerfile**: Available

## Step-by-Step Deployment

### Step 1: Connect Railway to GitHub

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select `fuzzynetwork1989-alt/synova-workspace`
6. Choose branch: `main`

### Step 2: Deploy Each Service Individually

#### Service 1: synova-core-api

1. Click "New Service" in Railway dashboard
2. Select "GitHub Repo"
3. Choose `fuzzynetwork1989-alt/synova-workspace`
4. Set **Root Directory**: `synova-core-api`
5. Click "Deploy Service"

**Environment Variables for synova-core-api:**

```
PORT=8000
PYTHONUNBUFFERED=1
ENVIRONMENT=production
NODE_ENV=production
LOG_LEVEL=info
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
JWT_SECRET=your_jwt_secret_32_chars_min
SESSION_SECRET=your_session_secret_32_chars_min
```

#### Service 2: synova-ui-system

1. Click "New Service"
2. Select "GitHub Repo"
3. Choose `fuzzynetwork1989-alt/synova-workspace`
4. Set **Root Directory**: `synova-ui-system`
5. Click "Deploy Service"

**Environment Variables for synova-ui-system:**

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://synova-core-api-production.up.railway.app
PORT=3000
```

#### Service 3: synova-holo-renderer

1. Click "New Service"
2. Select "GitHub Repo"
3. Choose `fuzzynetwork1989-alt/synova-workspace`
4. Set **Root Directory**: `synova-holo-renderer`
5. Click "Deploy Service"

**Environment Variables for synova-holo-renderer:**

```
NODE_ENV=production
PORT=3001
API_URL=https://synova-core-api-production.up.railway.app
```

#### Service 4: synova-monitoring

1. Click "New Service"
2. Select "GitHub Repo"
3. Choose `fuzzynetwork1989-alt/synova-workspace`
4. Set **Root Directory**: `synova-monitoring`
5. Click "Deploy Service"

**Environment Variables for synova-monitoring:**

```
NODE_ENV=production
PORT=3002
API_URL=https://synova-core-api-production.up.railway.app
```

#### Service 5: synova-revenue

1. Click "New Service"
2. Select "GitHub Repo"
3. Choose `fuzzynetwork1989-alt/synova-workspace`
4. Set **Root Directory**: `synova-revenue`
5. Click "Deploy Service"

**Environment Variables for synova-revenue:**

```
NODE_ENV=production
PORT=3003
API_URL=https://synova-core-api-production.up.railway.app
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

#### Service 6: synova-voice-integration

1. Click "New Service"
2. Select "GitHub Repo"
3. Choose `fuzzynetwork1989-alt/synova-workspace`
4. Set **Root Directory**: `synova-voice-integration`
5. Click "Deploy Service"

**Environment Variables for synova-voice-integration:**

```
NODE_ENV=production
PORT=3004
API_URL=https://synova-core-api-production.up.railway.app
```

### Step 3: Configure Health Checks

For each service, go to **Settings** > **Health Checks**:

**synova-core-api:**

- Path: `/health`
- Timeout: 100ms
- Retries: 3

**synova-ui-system:**

- Path: `/`
- Timeout: 100ms
- Retries: 3

**All other services:**

- Path: `/health`
- Timeout: 100ms
- Retries: 3

### Step 4: Set Restart Policy

For each service, go to **Settings** > **Restart Policy**:

- Type: `ON_FAILURE`
- Max Retries: `10`

### Step 5: Verify Deployment

After all services deploy, test each endpoint:

```bash
# Core API
curl https://synova-core-api-production.up.railway.app/health

# Frontend
curl https://synova-ui-system-production.up.railway.app

# Renderer
curl https://synova-holo-renderer-production.up.railway.app/health

# Monitoring
curl https://synova-monitoring-production.up.railway.app/health

# Revenue
curl https://synova-revenue-production.up.railway.app/health

# Voice Integration
curl https://synova-voice-integration-production.up.railway.app/health
```

## Expected URLs After Deployment

```
Core API: https://synova-core-api-production.up.railway.app
Frontend: https://synova-ui-system-production.up.railway.app
Renderer: https://synova-holo-renderer-production.up.railway.app
Monitoring: https://synova-monitoring-production.up.railway.app
Revenue: https://synova-revenue-production.up.railway.app
Voice: https://synova-voice-integration-production.up.railway.app
```

## Troubleshooting

### 502 Bad Gateway

- Check environment variables
- Verify PORT setting
- Check health endpoint
- Review logs: `railway logs`

### Build Failures

- Check Dockerfile syntax
- Verify requirements.txt (Python services)
- Check package.json (Node.js services)
- Review build logs

### Port Issues

- Ensure PORT environment variable is set
- Check service is listening on Railway port
- Verify health check path

### Service Communication

- Update API URLs in environment variables
- Check service-to-service connectivity
- Verify CORS settings

## Production Optimization

### Add Custom Domains

1. Go to **Settings** > **Domains**
2. Add custom domain for each service
3. Configure DNS records

### Scale Services

1. Go to **Settings** > **Scaling**
2. Adjust instance count and memory per service
3. Set auto-scaling rules

### Set Up Monitoring

1. Enable Railway metrics
2. Configure health checks
3. Set up alerting rules

## Security Considerations

### Environment Variables

- Never commit secrets to git
- Use Railway's encrypted environment variables
- Rotate API keys regularly

### Network Security

- Enable Railway's built-in HTTPS
- Configure CORS properly
- Use Railway's private networking for service-to-service communication

## Cost Management

### Free Tier Limits

- Railway offers $5/month free credit
- Each service uses some credit
- Monitor usage in Railway dashboard

### Optimization Tips

- Scale down unused services
- Use appropriate instance sizes
- Monitor logs for optimization opportunities

## Next Steps

After deployment:

1. Test all functionality
2. Set up monitoring and alerting
3. Configure custom domains
4. Set up CI/CD for automatic deployments
5. Document the production architecture

## Support

- Railway Documentation: docs.railway.app
- Railway Discord: discord.gg/railway
- GitHub Issues: Create issues for deployment problems
