# How to Configure Railway Service Settings - Step-by-Step Guide

## 🚀 Step 1: Access Railway Dashboard

1. **Go to Railway Dashboard**: https://railway.com/project/b5fa25e8-97d1-4be1-b538-3358bccc6186?environmentId=819ec215-98c3-4dfa-be24-ac01072e508d

2. **Login** to your Railway account if needed

## 🎯 Step 2: Find Your Service

1. **Look for "synova nexxus"** in your project services list
2. **Click on "synova nexxus"** to open service settings

## ⚙️ Step 3: Configure Service Settings

### **General Tab Settings**

#### **Service Information:**
- **Service Name**: `synova nexxus` ✅ (keep this)
- **Source**: `synova-workspace` repository ✅ (should be correct)

#### **Build Settings:**
- **Root Directory**: `synova-core-api` ⚠️ **CHANGE THIS**
- **Dockerfile**: `synova-core-api/Dockerfile` ⚠️ **CHANGE TO THIS**
- **Start Command**: `python main.py` ⚠️ **CHANGE TO THIS**

#### **How to Change These:**
1. Click on the field (Root Directory, Dockerfile, etc.)
2. Type the correct value
3. Click "Save" or press Enter

### **Build Tab Settings**

#### **Builder Configuration:**
- **Builder**: `Dockerfile` ✅ (should be selected)
- **Dockerfile Path**: `synova-core-api/Dockerfile` ⚠️ **CHANGE TO THIS**
- **Build Context**: `synova-core-api/` ⚠️ **CHANGE TO THIS**

#### **How to Change These:**
1. Click on the "Build" tab
2. Edit the Dockerfile Path field
3. Edit the Build Context field
4. Click "Save Changes"

### **Networking Tab Settings**

#### **Port Configuration:**
- **Port**: `8000` ✅ (should be correct)
- **Health Check Path**: `/health` ✅ (should be correct)

#### **How to Verify:**
1. Click on the "Networking" tab
2. Check that Port is set to 8000
3. Check that Health Check Path is `/health`

### **Environment Tab Settings**

#### **Environment Variables:**
```
PORT=8000
PYTHONUNBUFFERED=1
```

#### **How to Add/Update:**
1. Click on the "Environment" tab
2. Click "Add Variable"
3. Enter variable name and value
4. Click "Save"

## 🔄 Step 4: Deploy After Configuration

### **Trigger Deployment:**
1. **Click "Deploy"** button (usually at top right)
2. **Wait for build** to start (should show "Building...")
3. **Monitor progress** in the "Deployments" tab

### **Check Build Logs:**
1. Click on "Logs" tab
2. Look for: `🚀 Starting on port 8000`
3. Verify no npm install errors

## 🧪 Step 5: Verify Deployment

### **Test Health Endpoint:**
```bash
curl https://synova-nexxus-production.up.railway.app/health
```

**Expected Response:**
```json
{"status": "healthy"}
```

### **Test Root Endpoint:**
```bash
curl https://synova-nexxus-production.up.railway.app/
```

**Expected Response:**
```json
{"message": "API is working"}
```

## 🔧 Troubleshooting Common Issues

### **Issue: Can't Find Settings**
**Solution**: 
- Make sure you clicked on the "synova nexxus" service
- Look for tabs: General, Build, Networking, Environment

### **Issue: Settings Are Locked**
**Solution**:
- Delete the service and recreate it
- Use the correct repository and directory

### **Issue: Build Still Fails**
**Solution**:
- Check that Root Directory is exactly `synova-core-api`
- Verify Dockerfile path is `synova-core-api/Dockerfile`
- Make sure Start Command is `python main.py`

### **Issue: Can't Save Settings**
**Solution**:
- Refresh the page
- Try clicking "Save" button
- Contact Railway support if needed

## 📋 Configuration Checklist

### **Before Deploying:**
- [ ] Service Name: `synova nexxus`
- [ ] Root Directory: `synova-core-api`
- [ ] Dockerfile: `synova-core-api/Dockerfile`
- [ ] Start Command: `python main.py`
- [ ] Port: `8000`
- [ ] Health Check: `/health`
- [ ] Environment Variables: `PORT=8000`, `PYTHONUNBUFFERED=1`

### **After Configuration:**
- [ ] Click "Deploy" button
- [ ] Wait for build completion (2-3 minutes)
- [ ] Check logs for Python startup message
- [ ] Test health endpoint
- [ ] Verify API is working

## 🎯 Expected Result

With correct configuration:

```
✅ Build: Uses Python FastAPI from synova-core-api
✅ Deployment: No npm install errors
✅ Health Check: {"status": "healthy"}
✅ API: Fully functional
✅ URL: https://synova-nexxus-production.up.railway.app
```

## 📞 If You Need Help

### **Railway Documentation**: https://docs.railway.app/
### **Railway Support**: https://railway.app/support

---

**🎯 The most important settings are Root Directory: `synova-core-api` and Dockerfile: `synova-core-api/Dockerfile`.**
