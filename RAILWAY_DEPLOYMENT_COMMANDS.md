# Railway Deployment Commands - Execute in Order

## Prerequisites
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

## Step 1: Initialize Core API
```bash
cd synova-core-api
railway init
railway up
```

## Step 2: Initialize UI System
```bash
cd ../synova-ui-system
railway init
railway up
```

## Step 3: Initialize Holo Renderer
```bash
cd ../synova-holo-renderer
railway init
railway up
```

## Step 4: Initialize Monitoring
```bash
cd ../synova-monitoring
railway init
railway up
```

## Step 5: Initialize Revenue
```bash
cd ../synova-revenue
railway init
railway up
```

## Step 6: Initialize Voice Integration
```bash
cd ../synova-voice-integration
railway init
railway up
```

## Monitor All Deployments
```bash
# Check status of all services
railway status

# View logs for all services
railway logs

# Monitor specific service
railway logs --service synova-core-api
```

## Expected Service URLs After Deployment
```
Core API: https://synova-core-api-production.up.railway.app
Frontend: https://synova-ui-system-production.up.railway.app
Renderer: https://synova-holo-renderer-production.up.railway.app
Monitoring: https://synova-monitoring-production.up.railway.app
Revenue: https://synova-revenue-production.up.railway.app
Voice: https://synova-voice-integration-production.up.railway.app
```

## Health Check Commands (After Deployment)
```bash
# Test all services
./test_health_endpoints.sh

# Or test individually
curl https://synova-core-api-production.up.railway.app/health
curl https://synova-ui-system-production.up.railway.app
curl https://synova-holo-renderer-production.up.railway.app/health
curl https://synova-monitoring-production.up.railway.app/health
curl https://synova-revenue-production.up.railway.app/health
curl https://synova-voice-integration-production.up.railway.app/health
```
