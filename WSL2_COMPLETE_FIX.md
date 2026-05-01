# WSL2 Docker Connection Timeout - Complete Fix Guide

## 🚨 WSL2 Error: Connection Timeout

### **Error Details:**

```
Wsl/Service/RegisterDistro/CreateVm/HCS_E_CONNECTION_TIMEOUT
The operation timed out because a response was not received from the virtual machine or container.
```

## 🔍 Root Cause

WSL2 VM is failing to start properly, blocking Docker Desktop integration.

## 🚀 STEP-BY-STEP FIX

### **STEP 1: Complete WSL2 Shutdown**

```powershell
# Run in PowerShell (Administrator)
wsl --shutdown
```

### **STEP 2: Wait 30 Seconds**

- Let WSL subsystem fully stop
- Check Docker Desktop is closed

### **STEP 3: Restart Docker Desktop**

1. **Right-click Docker Desktop icon** in system tray
2. **Select "Quit Docker Desktop"**
3. **Wait 10 seconds**
4. **Launch Docker Desktop** from Start Menu
5. **Wait for "Docker Desktop is running"**

### **STEP 4: Test WSL2 Integration**

```powershell
# Test Docker in WSL2
wsl -d Ubuntu docker --version
 
# If still failing, try:
wsl -d Ubuntu docker run hello-world
```

### **STEP 5: Alternative Fix - Reset WSL2**

If above doesn't work:

```powershell
# Unregister current WSL2
wsl --unregister Ubuntu
 
# Reinstall WSL2
wsl --install
 
# Restart Docker Desktop after WSL2 is ready
```

### **STEP 6: Check Docker Desktop Settings**

1. **Open Docker Desktop**
2. **Go to Settings → Resources → WSL Integration**
3. **Ensure "Enable WSL 2 integration" is checked**
4. **Select Ubuntu distribution**
5. **Apply & Restart**

### **STEP 7: Advanced Settings (if needed)**

- **Memory**: Allocate at least 4GB
- **CPU**: At least 2 cores
- **Disk**: At least 64GB

## ✅ Success Criteria

### **When Fixed:**

- ✅ WSL2 starts without timeout
- ✅ Docker Desktop recognizes WSL2
- ✅ `docker --version` works in WSL2
- ✅ `docker run hello-world` works
- ✅ Development environment ready

## 🔄 Alternative Solutions

### **Option A: Use PowerShell Direct**

```powershell
# Use Docker directly on Windows (bypass WSL2)
docker --version
docker run hello-world
```

### **Option B: Use WSL2 without Docker Desktop**

```bash
# Install Docker CLI directly in WSL2
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### **Option C: Use Different Terminal**

```powershell
# Try Windows Terminal instead of PowerShell
wt -w 0 nt
```

## 🚀 Quick Fix Commands

### **Immediate Actions:**

```powershell
# Step 1: Shutdown WSL
wsl --shutdown
 
# Step 2: Restart Docker Desktop (manually)
# Click Docker Desktop icon → Restart
 
# Step 3: Test WSL2
wsl -d Ubuntu docker --version
```

## 📊 Expected Timeline

### **Quick Fix (5-10 minutes):**

- Restart WSL2 and Docker Desktop
- Verify integration
- Test Docker commands

### **Complete Reset (30-60 minutes):**

- Full WSL2 re-registration
- Docker Desktop reinstall
- Complete setup

---

**🎯 Start with STEP 1: `wsl --shutdown` in PowerShell (Admin), then restart Docker Desktop.**
