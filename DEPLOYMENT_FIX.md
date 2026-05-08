# 🚀 Railway Deployment Guide for Enhanced Synova Brain

## 📋 **Prerequisites**

1. **Install Railway CLI**

```bash
npm install -g @railway/cli
```

1. **Login to Railway**

```bash
railway login
# This will open browser for authentication
```

## 🔧 **Deployment Steps**

### **Step 1: Initialize Railway Project**

```bash
# Navigate to Core API directory
cd "c:\Users\fuzzy\Synova AI (updated)\synova-workspace\synova-core-api"

# Initialize Railway project (first time only)
railway init
# Follow prompts to create new project or link existing

# OR create new project directly
railway create
```

### **Step 2: Configure Environment**

```bash
# Set environment variables
railway variables set SYNNOVA_BRAIN_ENABLED=true
railway variables set MODEL_NAME=microsoft/DialoGPT-medium
railway variables set DEVICE=cpu
railway variables set REDIS_URL=redis://redis:6379

# Set production secrets
railway variables set DATABASE_URL=your_postgres_url_here
railway variables set JWT_SECRET=your_jwt_secret_here
```

### **Step 3: Deploy Application**

```bash
# Deploy to Railway
railway up

# Or deploy with specific service name
railway up --service-name synova-core-api

# Deploy to specific environment
railway up --environment production
```

### **Step 4: Get Production URL**

```bash
# Check deployment status
railway status

# Get service URL
railway open
# This will open your deployed app in browser

# Or get URL directly
railway variables list
# Look for RAILWAY_PUBLIC_DOMAIN or similar
```

## 🛠️ **Alternative Deployment Methods**

### **Method 1: Railway Dashboard**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Connect your repository
5. Set environment variables in dashboard
6. Deploy automatically

### **Method 2: GitHub Integration**

```bash
# Add Railway to GitHub
# In your repo: Settings > Secrets and variables > Actions
# Add RAILWAY_TOKEN as secret

# Deploy via GitHub Actions
git push origin main
# Railway will auto-deploy on push
```

## 🔧 **Configuration Files**

### **railway.toml** (Create in synova-core-api root)

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "synova-core-api"
source = "."
```

### **Dockerfile** (For container deployment)

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🌐 **Environment Variables Setup**

### **Required Variables:**

```bash
# Core Configuration
RAILWAY_ENVIRONMENT=production
PORT=8000

# Synova Brain
SYNNOVA_BRAIN_ENABLED=true
MODEL_NAME=microsoft/DialoGPT-medium
DEVICE=cpu

# Database
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGINS=https://yourdomain.com

# External Services (if needed)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### **Optional Variables:**

```bash
# Performance
MAX_TOKENS=2048
TEMPERATURE=0.7
TOP_P=0.9

# Monitoring
LOG_LEVEL=INFO
METRICS_ENABLED=true

# Features
STREAMING_ENABLED=true
MULTIMODAL_ENABLED=true
FUNCTION_CALLING_ENABLED=true
```

## 🧪 **Testing Deployment**

### **Health Check:**

```bash
# Test health endpoint
curl https://your-app-url.railway.app/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-03-23T...",
  "services": {
    "ollama": "connected",
    "redis": "connected", 
    "synova_brain": "loaded"
  }
}
```

### **Test Enhanced Features:**

```bash
# Test streaming
curl -X POST https://your-app-url.railway.app/ai/generate/stream \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Design modern office", "tier": "synova-brain-v3.2"}'

# Test function calling
curl -X POST https://your-app-url.railway.app/ai/function-call \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Build warehouse", "tier": "synova-brain-v3.2"}'

# Test multimodal
curl -X POST https://your-app-url.railway.app/ai/multimodal \
  -H "Content-Type: application/json" \
  -d '{"text": "Analyze design", "images": ["test.jpg"], "tier": "synova-brain-v3.2"}'
```

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **"No linked project found"**

```bash
# Solution: Initialize project first
railway init
# Or create new project
railway create
```

#### **"Cannot find path"**

```bash
# Use quotes for paths with spaces
cd "c:\Users\fuzzy\Synova AI (updated)\synova-workspace\synova-core-api"

# Or use forward slashes
cd c:/Users/fuzzy/Synova\ AI\ \(updated\)/synova-workspace/synova-core-api
```

#### **Build Failures:**

```bash
# Check logs
railway logs

# Check build configuration
railway status

# Redeploy
railway up --force
```

#### **Environment Issues:**

```bash
# List all variables
railway variables list

# Update specific variable
railway variables set VARIABLE_NAME=new_value

# Delete variable
railway variables delete VARIABLE_NAME
```

## 📊 **Monitoring**

### **Railway Dashboard:**

- **Metrics**: CPU, Memory, Disk usage
- **Logs**: Real-time application logs  
- **Environment**: Manage variables and secrets
- **Deployments**: Track deployment history

### **Custom Monitoring:**

```bash
# Add monitoring endpoint
curl https://your-app-url.railway.app/models/list

# Check service health
curl https://your-app-url.railway.app/health
```

## 🎯 **Production URL Structure**

Once deployed, your Enhanced Synova Brain will be available at:

```
https://your-app-name.up.railway.app

# Enhanced Endpoints:
POST /ai/generate/stream     # Streaming generation
POST /ai/function-call       # Function calling
POST /ai/multimodal         # Multimodal analysis
POST /ai/code               # Code generation
POST /ai/reasoning          # Advanced reasoning
POST /ai/memory             # Conversation memory
POST /ai/blueprint           # Blueprint generation
WS   /ws                    # Real-time streaming
```

## 🚀 **Next Steps After Deployment**

1. **Update Astranova** with Railway URL
2. **Test all enhanced features** with production endpoints
3. **Set up monitoring** and alerts
4. **Configure custom domain** (optional)
5. **Set up CI/CD** with GitHub Actions

---

**🎉 Your Enhanced Synova Brain v3.2 is ready for Railway deployment!**

**Use this guide to deploy with all advanced LLM features: streaming, function calling, multimodal, reasoning, and memory.**
