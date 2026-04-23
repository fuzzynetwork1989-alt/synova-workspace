# PowerShell Python Path Fix

## 🐍 Python Path Error Fix

### **Current Error:**

```
Unable to handle c:\Users\fuzzy\Synova AI (updated)\synova-workspace\.venv\Scripts\python.exe
```

### **🔍 Root Cause:**

PowerShell is finding a virtual environment Python instead of system Python
This happens when .venv folder exists and PowerShell prioritizes it

## 🚀 Fix Commands

### **STEP 1: Check Python Paths**

```powershell
# Check which Python PowerShell is using
Get-Command python

# Check system Python path
where python

# Check if .venv exists
Test-Path ".venv"
```

### **STEP 2: Remove Virtual Environment**

```powershell
# If .venv exists, remove it
Remove-Item -Recurse -Force .venv

# OR rename it
Rename-Item .venv .venv.backup
```

### **STEP 3: Use System Python**

```powershell
# Force use of system Python
C:\Python39\python.exe --version

# Or use Python launcher
py --version
```

### **STEP 4: Set Python Path**

```powershell
# Add Python to PATH temporarily
$env:PATH = "C:\Python39\Scripts;$env:PATH"

# Test Python version
python --version
```

## 🎯 Alternative Solutions

### **Option A: Use WSL2 for Python**

```powershell
# Use Python inside WSL2 (recommended)
wsl -d Ubuntu python3 --version
```

### **Option B: Use Virtual Environment Correctly**

```powershell
# Activate virtual environment properly
.venv\Scripts\Activate.ps1

# Then use Python from venv
python --version
```

### **Option C: Clean Python Installation**

```powershell
# Install Python properly for Windows
# Download from python.org
# Add to system PATH
```

## ✅ Expected Results

### **After Fix:**

```
Python 3.9.x or higher
No .venv path conflicts
PowerShell uses correct Python
```

---

**🎯 Try STEP 1 commands first to identify which Python is being used.**
