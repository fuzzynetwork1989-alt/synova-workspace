# Railway Monorepo Configuration Fix

## 🚨 Problem Identified

Railway is detecting multiple `package.json` files in your monorepo and trying to build them as separate Node.js services:

- `synova-app-template/package.json`
- `synova-holo-renderer/package.json` 
- `synova-monitoring/package.json`
- `synova-packages-supanova-sdk/package.json`

This is causing npm install failures and blocking your Python API deployment.

## 🔧 Solution: Railway Configuration

### **Step 1: Create railway.json Configuration**

Create a `railway.json` file to tell Railway exactly what to build:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "synova-core-api/Dockerfile",
    "dockerContext": "synova-core-api"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Step 2: Update .dockerignore**

Enhance the .dockerignore to exclude all Node.js projects:

```dockerignore
# Exclude all Node.js projects - only build Python API
synova-app-template/
synova-holo-renderer/
synova-monitoring/
synova-packages-supanova-sdk/
synova-brain/

# Exclude Node.js files
package.json
package-lock.json
yarn.lock
pnpm-lock.yaml
node_modules/
.next/
dist/
build/

# Keep only Python API
synova-core-api/
!synova-core-api/
```

### **Step 3: Disable Auto-Detection**

Railway auto-detects services. To prevent this:

1. **Delete unwanted services** in Railway dashboard
2. **Create single service** pointing to `synova-core-api`
3. **Use railway.json** to override auto-detection

## 🚀 Alternative: Create Dockerfiles for All Services

If you want all services deployed, create Dockerfiles:

### **synova-app-template/Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### **synova-holo-renderer/Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🎯 Recommended Approach

### **Option 1: Python API Only (Recommended)**
1. Create `railway.json` configuration
2. Update `.dockerignore`
3. Configure Railway to build only `synova-core-api`

### **Option 2: Full Monorepo**
1. Create Dockerfiles for all services
2. Configure each service separately in Railway
3. Use proper build contexts

## 📋 Immediate Actions

1. **Create railway.json** in root directory
2. **Update .dockerignore** to exclude Node.js projects
3. **Configure Railway service** to use `synova-core-api`
4. **Delete unwanted services** in Railway dashboard
5. **Redeploy** with correct configuration

---

**🎯 The fastest fix is to create railway.json and tell Railway to only build your Python API.**
