# Railway Individual Service Deployment Checklist

## Pre-Deployment Checklist

### Repository Preparation

- [ ] All services have proper Dockerfiles
- [ ] All package.json files have build/start scripts
- [ ] Environment variables documented
- [ ] No hardcoded secrets in code
- [ ] Health endpoints implemented

### Service Configuration Verification

#### synova-core-api

- [ ] Dockerfile exists and is valid
- [ ] requirements.txt includes all dependencies
- [ ] PORT environment variable handled in code
- [ ] Health endpoint `/health` works locally
- [ ] Main.py listens on correct port

#### synova-ui-system

- [ ] Dockerfile exists and is valid
- [ ] package.json has build/start scripts
- [ ] Next.js configuration is production-ready
- [ ] Static optimization enabled
- [ ] Environment variables for API URL

#### synova-holo-renderer

- [ ] Dockerfile exists and is valid
- [ ] package.json has build/start scripts
- [ ] Express server setup correctly
- [ ] Health endpoint `/health` implemented
- [ ] Babylon.js dependencies resolved

#### synova-monitoring

- [ ] Dockerfile exists and is valid
- [ ] package.json has build/start scripts
- [ ] TypeScript compilation works
- [ ] Health endpoint `/health` implemented
- [ ] Monitoring services configured

#### synova-revenue

- [ ] Dockerfile exists and is valid
- [ ] package.json has build/start scripts
- [ ] Stripe configuration ready
- [ ] Health endpoint `/health` implemented
- [ ] Webhook endpoints secured

#### synova-voice-integration

- [ ] Dockerfile exists and is valid
- [ ] package.json has build/start scripts
- [ ] Next.js configuration for voice features
- [ ] Health endpoint `/health` implemented
- [ ] MediaPipe dependencies resolved

## Deployment Steps

### Step 1: Railway Setup

- [ ] Railway account created
- [ ] GitHub connected to Railway
- [ ] Repository selected: `fuzzynetwork1989-alt/synova-workspace`
- [ ] Branch selected: `main`

### Step 2: Deploy Core API

- [ ] New Service created
- [ ] Root Directory: `synova-core-api`
- [ ] Environment variables set:
  - [ ] PORT=8000
  - [ ] PYTHONUNBUFFERED=1
  - [ ] ENVIRONMENT=production
  - [ ] NODE_ENV=production
  - [ ] LOG_LEVEL=info
  - [ ] OPENAI_API_KEY=***
  - [ ] ANTHROPIC_API_KEY=***
  - [ ] JWT_SECRET=***
  - [ ] SESSION_SECRET=***
- [ ] Health check configured: `/health`
- [ ] Restart policy: ON_FAILURE, 10 retries
- [ ] Deployment successful
- [ ] Health endpoint responding

### Step 3: Deploy UI System

- [ ] New Service created
- [ ] Root Directory: `synova-ui-system`
- [ ] Environment variables set:
  - [ ] NODE_ENV=production
  - [ ] NEXT_PUBLIC_API_URL=<https://synova-core-api-production.up.railway.app>
  - [ ] PORT=3000
- [ ] Health check configured: `/`
- [ ] Restart policy: ON_FAILURE, 10 retries
- [ ] Deployment successful
- [ ] Frontend loads correctly

### Step 4: Deploy Holo Renderer

- [ ] New Service created
- [ ] Root Directory: `synova-holo-renderer`
- [ ] Environment variables set:
  - [ ] NODE_ENV=production
  - [ ] PORT=3001
  - [ ] API_URL=<https://synova-core-api-production.up.railway.app>
- [ ] Health check configured: `/health`
- [ ] Restart policy: ON_FAILURE, 10 retries
- [ ] Deployment successful
- [ ] 3D rendering service responding

### Step 5: Deploy Monitoring

- [ ] New Service created
- [ ] Root Directory: `synova-monitoring`
- [ ] Environment variables set:
  - [ ] NODE_ENV=production
  - [ ] PORT=3002
  - [ ] API_URL=<https://synova-core-api-production.up.railway.app>
- [ ] Health check configured: `/health`
- [ ] Restart policy: ON_FAILURE, 10 retries
- [ ] Deployment successful
- [ ] Monitoring dashboard accessible

### Step 6: Deploy Revenue

- [ ] New Service created
- [ ] Root Directory: `synova-revenue`
- [ ] Environment variables set:
  - [ ] NODE_ENV=production
  - [ ] PORT=3003
  - [ ] API_URL=<https://synova-core-api-production.up.railway.app>
  - [ ] STRIPE_SECRET_KEY=***
  - [ ] STRIPE_WEBHOOK_SECRET=***
- [ ] Health check configured: `/health`
- [ ] Restart policy: ON_FAILURE, 10 retries
- [ ] Deployment successful
- [ ] Payment processing working

### Step 7: Deploy Voice Integration

- [ ] New Service created
- [ ] Root Directory: `synova-voice-integration`
- [ ] Environment variables set:
  - [ ] NODE_ENV=production
  - [ ] PORT=3004
  - [ ] API_URL=<https://synova-core-api-production.up.railway.app>
- [ ] Health check configured: `/health`
- [ ] Restart policy: ON_FAILURE, 10 retries
- [ ] Deployment successful
- [ ] Voice features working

## Post-Deployment Verification

### Health Check Tests

```bash
# Test all services
curl https://synova-core-api-production.up.railway.app/health
curl https://synova-ui-system-production.up.railway.app
curl https://synova-holo-renderer-production.up.railway.app/health
curl https://synova-monitoring-production.up.railway.app/health
curl https://synova-revenue-production.up.railway.app/health
curl https://synova-voice-integration-production.up.railway.app/health
```

- [ ] Core API health check passes
- [ ] UI System loads correctly
- [ ] Holo Renderer responds
- [ ] Monitoring service active
- [ ] Revenue service operational
- [ ] Voice integration working

### Integration Tests

- [ ] Frontend can communicate with API
- [ ] Authentication flow works
- [ ] File upload functionality works
- [ ] AI generation features working
- [ ] 3D rendering loads correctly
- [ ] Payment processing functional
- [ ] Voice recognition operational

### Performance Checks

- [ ] Response times under 2 seconds
- [ ] No 502 errors
- [ ] Memory usage within limits
- [ ] Error rates below 1%

## Production Optimization

### Custom Domains

- [ ] Custom domains configured
- [ ] DNS records set up
- [ ] SSL certificates active
- [ ] Domain redirects working

### Scaling Configuration

- [ ] Instance sizes optimized
- [ ] Auto-scaling rules set
- [ ] Load balancing configured
- [ ] Resource limits defined

### Monitoring Setup

- [ ] Railway metrics enabled
- [ ] Custom dashboards created
- [ ] Alert rules configured
- [ ] Log aggregation working

### Security Configuration

- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] API keys secured
- [ ] Webhook signatures validated

## Troubleshooting Guide

### Common Issues and Solutions

#### 502 Bad Gateway

- [ ] Check environment variables
- [ ] Verify PORT configuration
- [ ] Review deployment logs
- [ ] Test health endpoint locally

#### Build Failures

- [ ] Check Dockerfile syntax
- [ ] Verify dependencies
- [ ] Review build logs
- [ ] Test build locally

#### Service Communication

- [ ] Verify API URLs
- [ ] Check network policies
- [ ] Test service connectivity
- [ ] Review CORS settings

#### Performance Issues

- [ ] Monitor resource usage
- [ ] Check for memory leaks
- [ ] Optimize database queries
- [ ] Enable caching

## Emergency Procedures

### Service Recovery

- [ ] Restart failed services
- [ ] Rollback to previous deployment
- [ ] Scale up resources
- [ ] Enable maintenance mode

### Data Recovery

- [ ] Database backups verified
- [ ] File storage checked
- [ ] User data integrity confirmed
- [ ] Recovery procedures tested

## Documentation Updates

### Post-Deployment

- [ ] Update API documentation
- [ ] Document production URLs
- [ ] Update environment variable guide
- [ ] Create troubleshooting guide

### Team Communication

- [ ] Deployment summary sent
- [ ] Access credentials shared
- [ ] Monitoring access granted
- [ ] Support procedures documented

---

## Final Verification

### Complete System Test

- [ ] All services deployed and healthy
- [ ] Full user journey tested
- [ ] Performance benchmarks met
- [ ] Security measures verified
- [ ] Documentation complete
- [ ] Team trained on production system

**Deployment Complete!** The Synova AI application is now running on Railway with individual services for optimal scaling and management.
