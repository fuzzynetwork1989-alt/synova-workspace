# Railway Service Configuration Guide

## 🎯 How to Configure Railway Service Correctly

### **Step 1: Go to Railway Dashboard**
1. Visit [railway.app](https://railway.app)
2. Select your `synova-workspace` project
3. Click on the "Synova AI" service

### **Step 2: Configure Service Settings**

#### **⚙️ General Settings**
- **Service Name**: `Synova AI`
- **Root Directory**: `synova-core-api` ⚠️ **IMPORTANT**
- **Dockerfile**: `./Dockerfile`
- **Start Command**: `python main.py`

#### **🔧 Build Settings**
- **Builder**: `Dockerfile`
- **Dockerfile Path**: `synova-core-api/Dockerfile`
- **Build Context**: `synova-core-api/`

#### **🌐 Port Settings**
- **Port**: `8000`
- **Health Check Path**: `/health`

### **Step 3: Environment Variables**
```
PORT=8000
PYTHONUNBUFFERED=1
```

### **Step 4: Verify Configuration**

#### **✅ Correct Setup Should Show:**
```
Service: Synova AI
Root Directory: synova-core-api
Dockerfile: ./Dockerfile
Port: 8000
Health Check: /health
```

#### **❌ Wrong Setup (Causes 404):**
```
Root Directory: . (empty/wrong)
Dockerfile: ./Dockerfile (wrong path)
Port: 3000 (wrong port)
```

### **Step 5: Redeploy After Configuration**

1. Click "Deploy" button
2. Wait for build (2-3 minutes)
3. Check logs for: `🚀 Starting on port 8000`

### **Step 6: Test Deployment**

```bash
# Test health endpoint
curl https://synova-ai-production.up.railway.app/health

# Expected response:
{"status": "healthy"}

# Test root endpoint  
curl https://synova-ai-production.up.railway.app/

# Expected response:
{"message": "API is working"}
```

## 🔧 Common Railway Issues & Fixes

### **Issue: 404 Application Not Found**
**Cause**: Wrong root directory or Dockerfile path
**Fix**: Set `Root Directory: synova-core-api`

### **Issue: Build Fails**
**Cause**: Can't find Dockerfile in root
**Fix**: Set `Dockerfile: ./Dockerfile`

### **Issue: Port Mismatch**
**Cause**: App running on different port than expected
**Fix**: Set `Port: 8000`

### **Issue: Health Check Fails**
**Cause**: Wrong health check path
**Fix**: Set `Health Check Path: /health`

## 📋 Railway Configuration Checklist

### **Before Deployment:**
- [ ] Root directory is `synova-core-api`
- [ ] Dockerfile path is `./Dockerfile`
- [ ] Port is set to `8000`
- [ ] Health check path is `/health`
- [ ] Environment variables are set

### **After Configuration:**
- [ ] Service builds successfully
- [ ] Logs show: `🚀 Starting on port 8000`
- [ ] Health check passes
- [ ] All endpoints respond correctly

## 🎯 Expected Final Result

With correct configuration, you should see:

```
✅ Build: Success
✅ Health Check: 200 OK
✅ API Response: {"status": "healthy"}
✅ No 404 errors
✅ No security vulnerabilities
```

## 🚀 Railway URL

Your API will be available at:
```
https://synova-ai-production.up.railway.app
```

### **Working Endpoints:**
```
GET  /health     → {"status": "healthy"}
GET  /           → {"message": "API is working"}
POST /generate  → {"response": "Working correctly"}
```

This configuration ensures Railway builds and deploys your Python API correctly.
