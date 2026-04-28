# PowerShell Commands to Fix WSL2/Docker

## 🚀 Run These Commands in PowerShell (Admin)

### **STEP 1: Shutdown WSL2 Completely**
```powershell
wsl --shutdown
```

### **STEP 2: Restart Docker Desktop**
1. **Right-click Docker Desktop icon** in system tray
2. **Select "Quit Docker Desktop"**
3. **Wait 10 seconds**
4. **Launch Docker Desktop** from Start Menu
5. **Wait for "Docker Desktop is running"**

### **STEP 3: Test WSL2 Integration**
```powershell
wsl -d Ubuntu docker --version
```

### **STEP 4: If Still Failing - Reset WSL2**
```powershell
wsl --unregister Ubuntu
wsl --install
```

### **STEP 5: Test Docker in WSL2**
```powershell
wsl -d Ubuntu docker run hello-world
```

## ✅ Expected Results

### **After STEP 3:**
```
Docker version 20.10.17, build c79f32a
Docker Compose version v2.20.2
```

### **After STEP 5:**
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

## 🎯 Success Criteria

- ✅ WSL2 starts without timeout
- ✅ Docker Desktop recognizes WSL2
- ✅ `docker --version` works in WSL2
- ✅ `docker run hello-world` works
- ✅ Development environment ready

## 🚨 If Commands Fail

### **Alternative: Use PowerShell Direct**
```powershell
# Test Docker on Windows directly
docker --version
docker run hello-world
```

---

**🎯 Run STEP 1 command now: `wsl --shutdown`**
