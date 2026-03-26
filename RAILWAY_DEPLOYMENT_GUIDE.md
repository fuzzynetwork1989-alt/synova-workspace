# Railway Deployment Guide for Synova AI v4.1
# Follow these steps to deploy backend services

## 🔑 Step 1: Get Railway Token

1. **Go to**: https://railway.app
2. **Sign up/login** with GitHub
3. **Get API Token**:
   - Click avatar → Account Settings → API Tokens
   - Click "New Token"
   - Name it "Synova AI Deployment"
   - Copy token (starts with `railway_`)

## 🚀 Step 2: Deploy Core API

### Option A: Web Interface (Recommended)
1. Go to https://railway.app/new
2. Click "Import from GitHub"
3. Select `synova-workspace` repository
4. Set root directory to `synova-core-api/`
5. Click "Deploy"

### Option B: CLI (After getting token)
```bash
# Login with your token
railway login

# Deploy Core API
cd synova-core-api
railway up --service-name synova-core-api

# Get the URL
railway domain --service synova-core-api
```

## 🎨 Step 3: Deploy Holo Renderer

### Option A: Web Interface
1. In same Railway project, click "New Service"
2. Select "GitHub"
3. Set root directory to `synova-holo-renderer/`
4. Click "Deploy"

### Option B: CLI
```bash
cd synova-holo-renderer
railway up --service-name synova-holo-renderer

# Get the URL
railway domain --service synova-holo-renderer
```

## ⚙️ Step 4: Configure Environment Variables

In Railway dashboard for each service:

### Core API Environment Variables:
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@localhost:5432/synova
REDIS_URL=redis://localhost:6379
OLLAMA_HOST=http://localhost:11434
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
PORT=8000
```

### Holo Renderer Environment Variables:
```
NODE_ENV=production
PORT=3001
CORE_API_URL=https://your-core-api-url.railway.app
OUTPUT_DIR=/app/output
```

## 🌐 Step 5: Get Production URLs

After deployment, your services will be available at:
- Core API: `https://synova-core-api-production.up.railway.app`
- Holo Renderer: `https://synova-holo-renderer-production.up.railway.app`

## 🔍 Step 6: Health Checks

Test your deployments:
```bash
# Test Core API
curl https://your-core-api-url.railway.app/health

# Test Holo Renderer
curl https://your-holo-renderer-url.railway.app/
```

## 📊 Step 7: Update Frontend Configuration

Update your frontend to use Railway URLs:
```javascript
// In synova-ui-system/.env.local
NEXT_PUBLIC_API_URL=https://synova-core-api-production.up.railway.app
NEXT_PUBLIC_RENDERER_URL=https://synova-holo-renderer-production.up.railway.app
```

## 🎯 Expected Timeline

- **Token Setup**: 5 minutes
- **Core API Deploy**: 3-5 minutes
- **Holo Renderer Deploy**: 3-5 minutes
- **Configuration**: 5 minutes
- **Total**: ~20 minutes

## ✅ Success Criteria

- [ ] Core API health endpoint returns 200
- [ ] Holo Renderer loads without errors
- [ ] Frontend can connect to backend services
- [ ] All environment variables configured
- [ ] Production URLs accessible

## 🚨 Troubleshooting

### Common Issues:
1. **Build Failures**: Check `package.json` and `requirements.txt`
2. **Runtime Errors**: Check environment variables
3. **Connection Issues**: Verify service names and URLs
4. **Permission Errors**: Ensure Railway has repo access

### Debug Commands:
```bash
# Check logs
railway logs --service synova-core-api

# Check status
railway status

# Redeploy
railway up --service synova-core-api
```

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Dashboard**: https://railway.app/dashboard
- **Status**: https://status.railway.app

---

**Ready to deploy?** Start with Step 1 to get your Railway token!
