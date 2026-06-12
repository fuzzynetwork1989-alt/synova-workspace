# Synova AI v4.1 - Standard Deployment Strategy
# Backend: Railway | Frontend: Vercel | Mobile: EAS

## 🚀 Deployment Architecture

### Backend Services → Railway
- synova-core-api (FastAPI)
- synova-holo-renderer (Node.js)
- PostgreSQL Database
- Redis Cache

### Frontend → Vercel  
- synova-ui-system (Next.js)
- Static assets
- Serverless functions

### Mobile → EAS/Expo
- synova-xr-workspace (React Native)
- Android APK builds
- iOS IPA builds

## 📋 Pre-Deployment Checklist

### Always Install/Update First:
```bash
# Update Railway CLI
npm update -g @railway/cli

# Update Vercel CLI  
npm update -g vercel

# Update EAS CLI
npm update -g @expo/eas-cli

# Verify installations
railway --version
vercel --version
eas --version
```

### Environment Setup:
```bash
# Copy template to production env
cp .env.template .env.production

# Fill in actual tokens
# Railway token, Vercel token, EAS token, etc.
```

## 🏗️ Standard Deployment Commands

### 1. Railway Backend Deployment:
```bash
# Login (once per session)
railway login

# Deploy Core API
cd synova-core-api
railway up --service-name synova-core-api

# Deploy Holo Renderer  
cd ../synova-holo-renderer
railway up --service-name synova-holo-renderer

# Get URLs
railway domain --service synova-core-api
railway domain --service synova-holo-renderer
```

### 2. Vercel Frontend Deployment:
```bash
# Login (once per session)
vercel --login

# Deploy UI System
cd synova-ui-system
vercel --prod

# Deploy with custom environment
vercel --prod --env NEXT_PUBLIC_API_URL=https://your-railway-api-url.railway.app
```

### 3. EAS Mobile Deployment:
```bash
# Login (once per session)
eas login

# Build Android
cd synova-xr-workspace
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform all --profile production
```

## 🔗 Service URL Updates

After Railway deployment, update frontend URLs:
```bash
# In synova-ui-system/.env.production
NEXT_PUBLIC_API_URL=https://synova-core-api-production.up.railway.app
NEXT_PUBLIC_RENDERER_URL=https://synova-holo-renderer-production.up.railway.app
NEXT_PUBLIC_WS_URL=wss://synova-core-api-production.up.railway.app/ws
```

## 📊 Deployment Monitoring

### Health Checks:
```bash
# Backend health
curl https://synova-core-api-production.up.railway.app/health

# Frontend health
curl https://your-vercel-app.vercel.app/

# Service status
railway status
vercel ls
eas build:list
```

### Log Monitoring:
```bash
# Railway logs
railway logs --service synova-core-api
railway logs --service synova-holo-renderer

# Vercel logs
vercel logs

# EAS build logs
eas build:view --platform android
```

## 🎯 Success Criteria

### Backend (Railway):
- [ ] Core API health endpoint returns 200
- [ ] Holo Renderer loads without errors
- [ ] Database connections working
- [ ] Redis cache operational

### Frontend (Vercel):
- [ ] Application loads in browser
- [ ] API calls to Railway successful
- [ ] Static assets serving correctly
- [ ] WebSocket connections established

### Mobile (EAS):
- [ ] Android APK builds successfully
- [ ] iOS IPA builds successfully
- [ ] Apps install on test devices
- [ ] Store submission complete

## 🔄 Rollback Procedures

### Railway Rollback:
```bash
# View deployment history
railway deployments

# Rollback to previous version
railway rollback --service synova-core-api
railway rollback --service synova-holo-renderer
```

### Vercel Rollback:
```bash
# View deployment history
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### EAS Rollback:
```bash
# View build history
eas build:list

# Rollback (resubmit previous build)
eas submit --platform android --profile previous
```

## 📞 Quick Commands Reference

```bash
# Full deployment sequence
deploy-all() {
    echo "🚀 Starting full deployment..."
    
    # Update tools
    npm update -g @railway/cli vercel @expo/eas-cli
    
    # Deploy backend
    cd synova-core-api && railway up --service-name synova-core-api
    cd ../synova-holo-renderer && railway up --service-name synova-holo-renderer
    
    # Deploy frontend
    cd ../synova-ui-system && vercel --prod
    
    # Build mobile
    cd ../synova-xr-workspace && eas build --platform all --profile production
    
    echo "✅ Full deployment complete!"
}
```

---

**Standard Operating Procedure**: Always use Railway for backend, Vercel for frontend, EAS for mobile.
