# Railway Fresh Start - New Project Deployment Plan

## 🎯 Strategy: Clean Slate Deployment

Starting with a fresh Railway project eliminates all the accumulated issues and gives us a clean foundation.

## 📋 Phase 1: Prepare for Fresh Start

### **Step 1: Archive Current Railway Project**
- **Current Project**: https://railway.com/project/b5fa25e8-97d1-4be1-b538-3358bccc6186
- **Action**: Archive or keep as reference
- **Reason**: Avoid confusion with new project

### **Step 2: Create New Railway Project**
1. **Go to Railway**: https://railway.app/new
2. **Create New Project**: Choose "New Project"
3. **Select Repository**: `fuzzynetwork1989-alt/synova-workspace`
4. **Environment**: Production

## 🚀 Phase 2: Systematic Service Deployment

### **Service Deployment Priority:**

#### **1. synova-core-api (Python FastAPI) - HIGHEST PRIORITY**
- **Root Directory**: `synova-core-api`
- **Dockerfile**: `synova-core-api/Dockerfile`
- **Port**: `8000`
- **Health Check**: `/health`

#### **2. synova-voice-integration (Next.js)**
- **Root Directory**: `synova-voice-integration`
- **Dockerfile**: `synova-voice-integration/Dockerfile`
- **Port**: `3000`
- **Health Check**: `/`

#### **3. synova-monitoring (Node.js)**
- **Root Directory**: `synova-monitoring`
- **Dockerfile**: `synova-monitoring/Dockerfile`
- **Port**: `3000`
- **Health Check**: `/`

#### **4. synova-holo-renderer (Node.js)**
- **Root Directory**: `synova-holo-renderer`
- **Dockerfile**: `synova-holo-renderer/Dockerfile`
- **Port**: `3000`
- **Health Check**: `/`

#### **5. synova-ui-system (Next.js)**
- **Root Directory**: `synova-ui-system`
- **Dockerfile**: `synova-ui-system/Dockerfile`
- **Port**: `3000`
- **Health Check**: `/`

#### **6. synova-revenue (Node.js)**
- **Root Directory**: `synova-revenue`
- **Dockerfile**: `synova-revenue/Dockerfile`
- **Port**: `3000`
- **Health Check**: `/`

#### **7. synova-app-template (Next.js)**
- **Root Directory**: `synova-app-template`
- **Dockerfile**: `synova-app-template/Dockerfile`
- **Port**: `3000`
- **Health Check**: `/`

#### **8. synova-prometheus (Node.js)**
- **Root Directory**: `synova-prometheus`
- **Dockerfile**: `synova-prometheus/Dockerfile`
- **Port**: `3000`
- **Health Check**: `/`

## 🔧 Phase 3: Service Configuration Template

### **For Each Service (Copy-Paste Configuration):**

#### **General Tab:**
```
Service Name: [service-name]
Root Directory: [service-directory]
Dockerfile: [service-directory]/Dockerfile
Start Command: [start-command]
```

#### **Build Tab:**
```
Builder: Dockerfile
Dockerfile Path: [service-directory]/Dockerfile
Build Context: [service-directory]/
```

#### **Networking Tab:**
```
Port: [port-number]
Health Check Path: [health-path]
```

#### **Environment Tab:**
```
PORT=[port-number]
NODE_ENV=production (for Node.js)
PYTHONUNBUFFERED=1 (for Python)
```

## 📊 Phase 4: Verification Checklist

### **After Each Service Deployment:**

#### **Test Commands:**
```bash
# Python API
curl https://[service-name]-production.up.railway.app/health

# Node.js Services
curl https://[service-name]-production.up.railway.app/
```

#### **Expected Results:**
- ✅ **200 OK**: Service working
- ❌ **404/500**: Fix before proceeding to next service

### **Deployment Progress Tracker:**
- [ ] synova-core-api (Python API) - CRITICAL
- [ ] synova-voice-integration (Next.js)
- [ ] synova-monitoring (Node.js)
- [ ] synova-holo-renderer (Node.js)
- [ ] synova-ui-system (Next.js)
- [ ] synova-revenue (Node.js)
- [ ] synova-app-template (Next.js)
- [ ] synova-prometheus (Node.js)

## 🎯 Phase 5: Success Criteria

### **Complete Success When:**
- [ ] All 8 services deployed successfully
- [ ] All services return 200 OK
- [ ] All Railway URLs are accessible
- [ ] No build errors in logs
- [ ] Health checks passing

## 🚀 Immediate Actions

### **Step 1: Create New Railway Project**
1. **Go to**: https://railway.app/new
2. **Select**: `fuzzynetwork1989-alt/synova-workspace`
3. **Create**: New project

### **Step 2: Deploy synova-core-api First**
1. **Add Service**: Python API
2. **Configure**: Using template above
3. **Deploy**: Monitor logs
4. **Test**: Verify health endpoint

### **Step 3: Deploy Remaining Services**
Deploy remaining services one by one, testing each before proceeding to next.

---

**🎯 This fresh start approach eliminates all accumulated issues and gives us the best chance of success.**
