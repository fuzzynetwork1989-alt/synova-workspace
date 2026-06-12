# Railway Environment Variables - Complete Setup

## 🌟 Essential Environment Variables for synova-core-api

### **🚀 Critical Variables (Must Add):**

#### **Port Configuration:**
```
PORT=8000
```
**Why:** Railway sets this to tell your app which port to listen on

#### **Python Configuration:**
```
PYTHONUNBUFFERED=1
```
**Why:** Ensures Python output appears immediately in logs

#### **Environment Mode:**
```
NODE_ENV=production
ENVIRONMENT=production
```
**Why:** Sets production mode for optimal performance

### **🔧 Optional Variables (Recommended):**

#### **API Configuration:**
```
API_HOST=0.0.0.0
API_PORT=8000
```
**Why:** Explicitly sets API binding configuration

#### **Logging:**
```
LOG_LEVEL=info
```
**Why:** Controls logging verbosity

#### **Performance:**
```
WORKERS=1
```
**Why:** Number of worker processes (Railway handles this mostly)

## 📋 How to Add Environment Variables in Railway

### **Step 1: Go to Service Settings**
1. **Railway Dashboard** → synova-core-api service
2. **Click "Variables" tab**
3. **Click "New Variable"**

### **Step 2: Add Each Variable**

#### **Variable 1: PORT**
```
Name: PORT
Value: 8000
Type: Plain
```

#### **Variable 2: PYTHONUNBUFFERED**
```
Name: PYTHONUNBUFFERED
Value: 1
Type: Plain
```

#### **Variable 3: ENVIRONMENT**
```
Name: ENVIRONMENT
Value: production
Type: Plain
```

#### **Variable 4: NODE_ENV**
```
Name: NODE_ENV
Value: production
Type: Plain
```

#### **Variable 5: LOG_LEVEL**
```
Name: LOG_LEVEL
Value: info
Type: Plain
```

### **Step 3: Save and Redeploy**
1. **Click "Save Variables"**
2. **Railway will automatically redeploy**
3. **Monitor deployment status**

## 🎯 Why These Variables Matter

### **PORT=8000:**
- Your FastAPI app reads: `port = int(os.environ.get("PORT", 8000))`
- Railway sets this to route traffic correctly
- Without this, app might listen on wrong port

### **PYTHONUNBUFFERED=1:**
- Ensures print statements appear in logs immediately
- Critical for debugging startup issues
- Without this, logs might be delayed or lost

### **ENVIRONMENT=production:**
- Optimizes app for production performance
- Disables debug features
- Sets appropriate logging levels

## 🚀 Quick Setup Steps

### **Add These 5 Variables:**
```
PORT=8000
PYTHONUNBUFFERED=1
ENVIRONMENT=production
NODE_ENV=production
LOG_LEVEL=info
```

### **Test After Adding:**
```bash
curl https://synova-core-api-production.up.railway.app/health
# Expected: {"status": "healthy"}
```

## 📊 Expected Impact

### **With Correct Variables:**
- ✅ Service starts on correct port
- ✅ Logs appear in Railway dashboard
- ✅ Health checks pass
- ✅ API responds correctly

### **Without Correct Variables:**
- ❌ Service starts on wrong port
- ❌ No logs visible
- ❌ Health checks fail
- ❌ 502 errors continue

## 🔄 Next Steps

### **After Adding Variables:**
1. **Monitor deployment** for success
2. **Check logs** for startup messages
3. **Test health endpoint**
4. **Deploy remaining services** with similar variables

---

**🎯 Add these environment variables now - they're critical for Railway deployment success!**
