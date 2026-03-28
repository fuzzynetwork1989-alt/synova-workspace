# Railway Fresh Start - Step-by-Step Guide

## 🚀 STEP 1: Create New Railway Project

### **Action Required Now:**
1. **Go to Railway**: https://railway.app/new
2. **Click**: "New Project"
3. **Select Repository**: `fuzzynetwork1989-alt/synova-workspace`
4. **Environment**: Production
5. **Create Project**

## 🎯 STEP 2: Deploy synova-core-api (Python API) - CRITICAL FIRST

### **Add Service Configuration:**
```
Service Name: synova-core-api
Root Directory: synova-core-api
Dockerfile: synova-core-api/Dockerfile
Start Command: python main.py
```

### **Build Configuration:**
```
Builder: Dockerfile
Dockerfile Path: synova-core-api/Dockerfile
Build Context: synova-core-api/
```

### **Networking Configuration:**
```
Port: 8000
Health Check Path: /health
```

### **Environment Variables:**
```
PORT=8000
PYTHONUNBUFFERED=1
```

### **Deploy and Test:**
```bash
curl https://synova-core-api-production.up.railway.app/health
# Expected: {"status": "healthy"}
```

## 🔄 STEP 3: Deploy Remaining Services (One by One)

### **After synova-core-api works, deploy:**

#### **synova-voice-integration (Next.js)**
```
Root Directory: synova-voice-integration
Dockerfile: synova-voice-integration/Dockerfile
Start Command: npm start
Port: 3000
Health Check: /
Test: curl https://synova-voice-integration-production.up.railway.app/
```

#### **synova-monitoring (Node.js)**
```
Root Directory: synova-monitoring
Dockerfile: synova-monitoring/Dockerfile
Start Command: npm start
Port: 3000
Health Check: /
Test: curl https://synova-monitoring-production.up.railway.app/
```

#### **synova-holo-renderer (Node.js)**
```
Root Directory: synova-holo-renderer
Dockerfile: synova-holo-renderer/Dockerfile
Start Command: npm start
Port: 3000
Health Check: /
Test: curl https://synova-holo-renderer-production.up.railway.app/
```

#### **synova-ui-system (Next.js)**
```
Root Directory: synova-ui-system
Dockerfile: synova-ui-system/Dockerfile
Start Command: npm start
Port: 3000
Health Check: /
Test: curl https://synova-ui-system-production.up.railway.app/
```

#### **synova-revenue (Node.js)**
```
Root Directory: synova-revenue
Dockerfile: synova-revenue/Dockerfile
Start Command: npm start
Port: 3000
Health Check: /
Test: curl https://synova-revenue-production.up.railway.app/
```

#### **synova-app-template (Next.js)**
```
Root Directory: synova-app-template
Dockerfile: synova-app-template/Dockerfile
Start Command: npm start
Port: 3000
Health Check: /
Test: curl https://synova-app-template-production.up.railway.app/
```

#### **synova-prometheus (Node.js)**
```
Root Directory: synova-prometheus
Dockerfile: synova-prometheus/Dockerfile
Start Command: npm start
Port: 3000
Health Check: /
Test: curl https://synova-prometheus-production.up.railway.app/
```

## 📋 STEP 4: Verification Checklist

### **Test Each Service After Deployment:**
- [ ] synova-core-api: `curl https://synova-core-api-production.up.railway.app/health`
- [ ] synova-voice-integration: `curl https://synova-voice-integration-production.up.railway.app/`
- [ ] synova-monitoring: `curl https://synova-monitoring-production.up.railway.app/`
- [ ] synova-holo-renderer: `curl https://synova-holo-renderer-production.up.railway.app/`
- [ ] synova-ui-system: `curl https://synova-ui-system-production.up.railway.app/`
- [ ] synova-revenue: `curl https://synova-revenue-production.up.railway.app/`
- [ ] synova-app-template: `curl https://synova-app-template-production.up.railway.app/`
- [ ] synova-prometheus: `curl https://synova-prometheus-production.up.railway.app/`

## 🎯 SUCCESS CRITERIA

### **Complete Success When:**
- ✅ All 8 services return 200 OK
- ✅ No build errors in Railway logs
- ✅ All health checks passing
- ✅ All URLs accessible

## 🚀 IMMEDIATE ACTION

### **Start Now:**
1. **Create New Railway Project**: https://railway.app/new
2. **Deploy synova-core-api first** (most critical)
3. **Test it works**
4. **Deploy remaining services one by one**

---

**🎯 This fresh start approach eliminates all accumulated issues and gives us the best chance of success. Start with Step 1 now!**
