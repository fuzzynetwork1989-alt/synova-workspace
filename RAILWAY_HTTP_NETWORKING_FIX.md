# Railway HTTP Networking - Correct Configuration

## 🚨 Issue: HTTP Doesn't Allow Port Selection

### **Why You Can't Set Port 8000:**
- **HTTP Protocol**: Automatically uses port 80 (HTTP) and 443 (HTTPS)
- **Port 8000**: Only available with TCP Proxy
- **Railway Design**: HTTP networking handles port mapping automatically

## 🔧 Correct Configuration for HTTP

### **HTTP Settings (What Railway Allows):**
```
Protocol: HTTP
Port: [Automatic - Railway handles this]
Domain: Auto-generated
Health Check: /health
```

### **What Happens Internally:**
```
External: https://synova-core-api-production.up.railway.app (port 443)
Internal: Container port 8000 (where FastAPI runs)
Railway automatically maps: 443 → 8000
```

## 🎯 Two Options

### **Option 1: HTTP (Recommended)**
```
Protocol: HTTP
Health Check Path: /health
Health Check Timeout: 30s
Health Check Interval: 10s
```

**Pros:**
- ✅ Automatic HTTPS
- ✅ Easy to test with curl
- ✅ Standard web API
- ✅ Works with browsers

**Cons:**
- ❌ No port selection (Railway handles it)

### **Option 2: TCP Proxy**
```
Protocol: TCP Proxy
Port: 8000
Direct TCP access
```

**Pros:**
- ✅ Can specify port 8000
- ✅ Direct TCP connection

**Cons:**
- ❌ No automatic HTTPS
- ❌ More complex testing
- ❌ Not standard for APIs

## 🚀 Recommended Solution: Use HTTP

### **Step 1: Select HTTP Protocol**
**Choose: HTTP** (not TCP Proxy)

### **Step 2: Configure Health Check**
```
Path: /health
Protocol: HTTP
Timeout: 30s
Interval: 10s
```

### **Step 3: Generate Domain**
**Click: "Generate Domain"**

### **Step 4: Test Results**
```bash
# This will work with HTTP (Railway maps 443→8000)
curl https://synova-core-api-production.up.railway.app/health

# Expected: {"status": "healthy"}
```

## 📋 Understanding the 502 Errors

### **Current Test Results:**
```
All tests failing with 502 errors
URL: https://synova-ai-production.up.railway.app
```

### **502 Error Means:**
- Service is running but not responding
- Health checks failing
- Container may be crashing
- Dependencies not installed properly

### **Fix Needed:**
1. **Use HTTP protocol** (not worry about port 8000)
2. **Ensure service starts properly**
3. **Check Railway logs for container issues**

## 🎯 Immediate Action

### **Configure HTTP Networking:**
1. **Select Protocol**: HTTP
2. **Health Check**: /health
3. **Generate Domain**
4. **Test**: `curl https://your-domain.up.railway.app/health`

### **If Still 502:**
- Check Railway logs for container errors
- Verify Dockerfile is working
- Ensure dependencies install properly

---

**🎯 Use HTTP protocol - Railway automatically handles port mapping from 443 to 8000. Don't worry about port selection with HTTP.**
