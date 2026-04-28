# WSL2 Docker Desktop Timeout Fix - HCS_E_CONNECTION_TIMEOUT

**Version**: 1.0  
**Date**: April 24, 2026  
**Error**: `Wsl/Service/RegisterDistro/CreateVm/HCS_E_CONNECTION_TIMEOUT`

---

## 🚨 Error Details

```
running wslexec: The operation timed out because a response was not received from the virtual machine or container.
Wsl/Service/RegisterDistro/CreateVm/HCS_E_CONNECTION_TIMEOUT: 
c:\windows\system32\wsl.exe --import-in-place docker-desktop <home>\appdata\local\docker\wsl\main\ext4.vhdx
Error code: Wsl/Service/RegisterDistro/CreateVm/HCS_E_CONNECTION_TIMEOUT
```

---

## 🔍 Root Cause

The WSL2 virtual machine is failing to start or respond, preventing Docker Desktop from registering its distro. Common causes:
- WSL2 subsystem is in a corrupted state
- Docker Desktop's WSL2 backend is stuck
- Hyper-V/Hypervisor communication failure
- Windows update or Docker update broke integration

---

## 🚀 FIX #1: Quick Restart (Try First)

### Step 1: Complete WSL2 Shutdown
```powershell
# Run in PowerShell as Administrator
wsl --shutdown
```

### Step 2: Wait 30 Seconds
- Let WSL subsystem fully terminate
- Ensure no WSL processes remain

### Step 3: Restart Docker Desktop
1. Right-click Docker Desktop icon in system tray
2. Select "Quit Docker Desktop"
3. Wait 10 seconds
4. Launch Docker Desktop from Start Menu
5. Wait for "Docker Desktop is running" message

### Step 4: Test
```powershell
# Test WSL2
wsl -d Ubuntu echo "WSL2 is working"

# Test Docker in WSL2
wsl -d Ubuntu docker --version
```

---

## 🚀 FIX #2: Reset Docker Desktop WSL Integration

### Step 1: Disable WSL2 Integration in Docker Desktop
1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Uncheck "Enable WSL 2 integration"
4. Click "Apply & Restart"

### Step 2: Shutdown WSL2
```powershell
wsl --shutdown
```

### Step 3: Re-enable WSL2 Integration
1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Check "Enable WSL 2 integration"
4. Select your Ubuntu distribution
5. Click "Apply & Restart"

### Step 4: Test
```powershell
wsl -d Ubuntu docker run hello-world
```

---

## 🚀 FIX #3: Force Re-register Docker Desktop Distro

### Step 1: List All WSL Distributions
```powershell
wsl --list --verbose
```

### Step 2: Unregister Docker Desktop Distro
```powershell
# Unregister docker-desktop distro
wsl --unregister docker-desktop

# Unregister docker-desktop-data if it exists
wsl --unregister docker-desktop-data
```

### Step 3: Restart Docker Desktop
1. Quit Docker Desktop completely
2. Wait 10 seconds
3. Launch Docker Desktop
4. It will automatically re-register the distro

### Step 4: Test
```powershell
wsl -d docker-desktop echo "Docker Desktop WSL is working"
```

---

## 🚀 FIX #4: Complete WSL2 Reset (If Above Fail)

### Step 1: Backup Important Data
```bash
# In WSL2, backup any important data
cd ~
tar -czf ~/backup.tar.gz synova-workspace
cp ~/backup.tar.gz /mnt/c/Users/$USER/
```

### Step 2: Unregister All WSL Distributions
```powershell
# List all distributions
wsl --list --verbose

# Unregister each distribution (replace with actual names)
wsl --unregister Ubuntu
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data
```

### Step 3: Reinstall WSL2
```powershell
# Reinstall WSL2
wsl --install -d Ubuntu-22.04
```

### Step 4: Complete Fresh Setup
Follow the setup guide from scratch:
- Update system
- Install Docker in WSL2
- Configure Docker Desktop integration

---

## 🚀 FIX #5: Windows Hypervisor Reset

### Step 1: Disable WSL2 Feature
```powershell
# Run as Administrator
dism.exe /online /disable-feature /featurename:VirtualMachinePlatform /norestart
```

### Step 2: Restart Windows
```powershell
Restart-Computer
```

### Step 3: Re-enable WSL2 Feature
```powershell
# Run as Administrator
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### Step 4: Restart Windows Again
```powershell
Restart-Computer
```

### Step 5: Set WSL2 as Default
```powershell
wsl --set-default-version 2
```

### Step 6: Restart Docker Desktop
- Quit and relaunch Docker Desktop

---

## 🚀 FIX #6: Use Docker Directly on Windows (Fallback)

If WSL2 integration continues to fail, use Docker directly on Windows:

### Step 1: Verify Docker Works on Windows
```powershell
docker --version
docker run hello-world
```

### Step 2: Run Synova Services from Windows
```powershell
# Navigate to project in Windows
cd "C:\Users\McBuz\CascadeProjects\Synova AI Rebuild\synova-workspace"

# Run Docker Compose
docker compose up -d
```

### Step 3: Access Services
- Services will be accessible at localhost
- No WSL2 required for basic development

---

## ✅ Success Criteria

### When Fixed:
- ✅ WSL2 starts without timeout
- ✅ Docker Desktop recognizes WSL2
- ✅ `docker --version` works in WSL2
- ✅ `docker run hello-world` works in WSL2
- ✅ `docker compose up` works from WSL2
- ✅ Development environment fully operational

---

## 📋 Troubleshooting Commands

### Check WSL2 Status
```powershell
# List all distributions with versions
wsl --list --verbose

# Check WSL2 is default
wsl --status

# Check running distributions
wsl --list --running
```

### Check Docker Desktop Status
```powershell
# Check Docker is running
docker version

# Check Docker contexts
docker context ls

# Check WSL2 integration
docker context use default
```

### Check System Resources
```powershell
# Check available memory
Get-ComputerInfo | Select-Object CsTotalPhysicalMemory, CsOsUptime

# Check disk space
Get-PSDrive C

# Check Hyper-V status
Get-ComputerInfo | Select-Object CsHyperVisorPresent
```

---

## 🔄 Prevention Tips

### Regular Maintenance
```powershell
# Shutdown WSL2 nightly
wsl --shutdown

# Restart Docker Desktop weekly
# Right-click → Quit → Relaunch
```

### Update Management
- Keep Windows updated
- Keep Docker Desktop updated
- Keep WSL2 kernel updated: `wsl --update`

### Resource Allocation
Create `%UserProfile%\.wslconfig`:
```ini
[wsl2]
memory=8GB
processors=4
swap=4GB
```

---

## 🆘 If All Fixes Fail

### Option A: Contact Support
- Docker Desktop support
- Microsoft WSL2 support

### Option B: Use Alternative Setup
- Use Docker directly on Windows (no WSL2)
- Use a Linux VM (VirtualBox, VMware)
- Use cloud development environment (GitHub Codespaces, Gitpod)

### Option C: Clean Windows Reinstall
- Backup all data
- Clean install Windows
- Fresh WSL2 and Docker Desktop setup

---

## 📊 Fix Priority Order

1. **FIX #1** - Quick restart (5 minutes)
2. **FIX #2** - Reset Docker Desktop integration (5 minutes)
3. **FIX #3** - Re-register Docker Desktop distro (10 minutes)
4. **FIX #4** - Complete WSL2 reset (30-60 minutes)
5. **FIX #5** - Windows Hypervisor reset (20 minutes + 2 reboots)
6. **FIX #6** - Use Docker on Windows (fallback, no WSL2)

---

**🎯 Start with FIX #1. If that fails, proceed sequentially through the fixes.**
