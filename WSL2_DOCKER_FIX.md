# WSL2 Docker Desktop Connection Timeout - Complete Fix

## 🚨 WSL2 Connection Timeout Error

### **Error Details:**
```
Wsl/Service/RegisterDistro/CreateVm/HCS_E_CONNECTION_TIMEOUT
The operation timed out because a response was not received from the virtual machine or container.
```

## 🔍 Root Cause Analysis

### **Why This Happens:**
- WSL2 VM fails to start properly
- Docker Desktop integration broken
- Hyper-V subsystem communication timeout
- Usually after Windows updates or Docker updates

## 🚀 Complete Fix Plan

### **STEP 1: Restart WSL2 Completely**

#### **Shutdown All WSL Instances:**
```powershell
# In PowerShell (Administrator)
wsl --shutdown
```

#### **Wait 30 Seconds**
- Let WSL subsystem fully stop

#### **Restart WSL2:**
```powershell
# Restart WSL2
wsl -d Ubuntu
```

### **STEP 2: Reset Docker Desktop Integration**

#### **Stop Docker Desktop:**
1. **Right-click Docker Desktop icon** in system tray
2. **Select "Quit Docker Desktop"**
3. **Wait for complete shutdown**

#### **Start Docker Desktop:**
1. **Launch Docker Desktop** from Start Menu
2. **Wait for "Docker Desktop is running"**
3. **Check WSL2 integration is enabled**

#### **Verify Integration:**
```powershell
# Check Docker is working in WSL2
wsl -d Ubuntu docker --version
```

### **STEP 3: Alternative WSL2 Reset**

#### **If Still Failing - Re-register WSL2:**
```powershell
# Unregister current WSL2
wsl --unregister Ubuntu

# Re-register (fresh installation)
wsl --install
```

#### **Complete Fresh Setup:**
```bash
# In new WSL2 instance
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

### **STEP 4: Docker Desktop Settings Fix**

#### **Check Docker Desktop Settings:**
1. **Open Docker Desktop**
2. **Go to Settings → Resources → WSL Integration**
3. **Ensure "Enable WSL 2 integration" is checked**
4. **Select Ubuntu distribution**
5. **Apply & Restart**

#### **Advanced Settings:**
- **Memory**: Allocate at least 4GB
- **CPU**: At least 2 cores
- **Disk**: At least 64GB

### **STEP 5: Test Docker Functionality**

#### **Simple Docker Test:**
```bash
# In WSL2
docker run hello-world
```

#### **Test Docker Compose:**
```bash
# In your project directory
docker compose up -d
```

## 📋 Troubleshooting Steps

### **Option A: Use PowerShell Direct (Bypass WSL2)**
```powershell
# Run Docker directly on Windows
docker version
docker run hello-world
```

### **Option B: Reset Docker Desktop Completely**
1. **Uninstall Docker Desktop**
2. **Restart Windows**
3. **Reinstall Docker Desktop**
4. **Configure WSL2 integration**

### **Option C: Use Docker CLI in WSL2**
```bash
# Install Docker CLI directly in WSL2
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## 🎯 Success Criteria

### **When Fixed:**
- ✅ WSL2 starts without timeout
- ✅ Docker Desktop recognizes WSL2
- ✅ `docker --version` works in WSL2
- ✅ `docker compose up` works
- ✅ Development environment ready

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

**🎯 Start with Step 1: `wsl --shutdown` in PowerShell (Admin), then restart Docker Desktop.**
