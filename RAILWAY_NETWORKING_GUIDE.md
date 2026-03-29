# Railway Networking Configuration Guide

## 🌐 Public Networking Setup

### **Current Step: Configuring Public Access**

You're now setting up the public networking for synova-core-api service.

## 🔧 Recommended Configuration

### **Option 1: HTTP (Recommended for API)**
```
Protocol: HTTP
Port: 8000
Domain: Auto-generated (e.g., synova-core-api-production.up.railway.app)
Health Check: /health
```

### **Option 2: TCP Proxy**
```
Protocol: TCP
Port: 8000
Domain: Auto-generated
Direct TCP access
```

## 🎯 Best Settings for synova-core-api

### **HTTP Configuration (Recommended):**
- **Protocol**: HTTP
- **Port**: 8000
- **Health Check Path**: /health
- **Health Check Timeout**: 30s
- **Health Check Interval**: 10s

### **Why HTTP for API:**
- ✅ Standard for REST APIs
- ✅ Automatic HTTPS (Railway provides)
- ✅ Health checks work properly
- ✅ Easy to test with curl
- ✅ Compatible with web clients

## 🚀 Configuration Steps

### **Step 1: Choose Protocol**
**Select: HTTP** (not TCP Proxy)

### **Step 2: Set Port**
**Port: 8000** (matches your FastAPI app)

### **Step 3: Configure Health Check**
```
Path: /health
Protocol: HTTP
Timeout: 30s
Interval: 10s
```

### **Step 4: Generate Domain**
**Click: "Generate Domain"** - Railway will create:
`https://synova-core-api-production.up.railway.app`

## 📋 After Configuration

### **Expected URL:**
```
https://synova-core-api-production.up.railway.app
```

### **Test Endpoints:**
```bash
# Health check
curl https://synova-core-api-production.up.railway.app/health

# Root endpoint
curl https://synova-core-api-production.up.railway.app/

# Generate endpoint
curl -X POST https://synova-core-api-production.up.railway.app/generate \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### **Expected Responses:**
```json
// Health check
{"status": "healthy"}

// Root endpoint
{"message": "API is working"}

// Generate endpoint
{"response": "Working correctly"}
```

## 🎯 Success Criteria

### **When Networking Works:**
- ✅ Domain generated successfully
- ✅ HTTP access working
- ✅ Health checks passing
- ✅ All endpoints responding
- ✅ HTTPS automatically provided

## 🔄 Next Steps After Networking

### **1. Test All Endpoints**
Verify all API endpoints work with the new domain.

### **2. Deploy Remaining Services**
Once synova-core-api is working, deploy the 7 remaining services:
- synova-voice-integration
- synova-monitoring
- synova-holo-renderer
- synova-ui-system
- synova-revenue
- synova-app-template
- synova-prometheus

### **3. Configure Each Service**
Each service will need similar networking configuration.

---

**🎯 Configure HTTP networking with port 8000 and health check /health for best results.**
