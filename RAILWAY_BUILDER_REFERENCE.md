# Railway Builder Values Reference

## 🏗️ Valid Railway Builders

### **For Node.js Services:**
- `"builder": "NIXPACKAGES"`
- `"builder": "DOCKERFILE"`

### **For Python Services:**
- `"builder": "DOCKERFILE"`

### **For Monorepo:**
- `"builder": "NIXPACKAGES"`

## 🎯 Current Issue

The `railway.json` file is invalid because:
1. **"NIXPACKAGES" is not a valid builder value**
2. **Missing deploy section for proper configuration**

## 🔧 Correct Configuration

### **Option 1: Remove railway.json (Let Railway auto-detect)**
```bash
# Remove the invalid railway.json
rm railway.json
git add railway.json
git commit -m "Remove invalid railway.json - let Railway auto-detect services"
git push
```

### **Option 2: Use DOCKERFILE for Each Service**
Create individual `Dockerfile` in each service directory and let Railway auto-detect.

### **Option 3: Use MONOREPO with Proper Structure**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  }
}
```

---

**Recommendation: Remove railway.json and let Railway auto-detect each service individually.**
