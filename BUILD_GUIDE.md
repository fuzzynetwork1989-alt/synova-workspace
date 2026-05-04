# Synova AI - Build and Deployment Guide

**For Mini PC Desktop Installation and Android APK**

---

## Part 1: Android APK Build

### Prerequisites
- Node.js 18+ installed
- Java JDK 17+ installed
- Android Studio with SDK installed
- Expo CLI installed: `npm install -g expo-cli`

### Build APK Locally

#### Step 1: Navigate to Mobile App
```bash
cd apps/mobile
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure Build
Create `eas.json` in the mobile app root:
```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Step 4: Build APK (Preview Build)
```bash
npx expo build:android
```

This will:
- Create an APK file
- Prompt you to sign the APK (or use a test keystore)
- Output the APK location

#### Step 5: Alternative: Use Development Build
If the above fails, use the development build:
```bash
npx expo run:android
```

This requires:
- Android device connected via USB
- USB debugging enabled
- Or an Android emulator running

### APK Output Location
After successful build, the APK will be in:
- `apps/mobile/android/app/build/outputs/apk/`

---

## Part 2: Desktop App for Mini PC

### Option 1: Native Build (Recommended for Mini PC)

The mini PC likely runs Linux or a cleaner Windows environment without the file locking issues present on the development machine.

#### For Linux Mini PC:
```bash
# Navigate to desktop app
cd apps/desktop

# Install dependencies
npm install

# Build native app
npm run tauri build
```

The output will be in:
- `apps/desktop/src-tauri/target/release/bundle/`

#### For Windows Mini PC:
```bash
# Navigate to desktop app
cd apps/desktop

# Install dependencies
npm install

# Build native app
npm run tauri build
```

**Note:** If file locking occurs on Windows mini PC, follow the WSL2 instructions in `TAURI_BUILD_FIX.md`.

### Option 2: Web Version (Fallback)

If native build fails, the web version is fully functional:

#### Start Web Server:
```bash
cd apps/desktop
npm run dev
```

#### Access:
- URL: `http://localhost:1420`
- This provides the same chat interface and functionality

#### Create Desktop Shortcut:
1. Create a batch file `start-synova.bat`:
```batch
@echo off
cd /d "C:\path\to\synova-workspace\apps\desktop"
npm run dev
start http://localhost:1420
```

2. Create a shortcut to this batch file on the desktop

---

## Part 3: Mini PC Deployment Checklist

### Desktop App Installation

#### Native Build:
1. Copy entire `synova-workspace` folder to mini PC
2. Install Node.js on mini PC
3. Install Rust on mini PC (for Tauri)
4. Run build command
5. Copy executable to desired location
6. Create desktop shortcut

#### Web Version:
1. Copy entire `synova-workspace` folder to mini PC
2. Install Node.js on mini PC
3. Run `npm run dev` in desktop folder
4. Create shortcut to localhost:1420

### API Server on Mini PC

The API server should also run on the mini PC for local operation:

```bash
cd apps/api
.\start-api.bat
```

Or configure as a service to start automatically.

---

## Part 4: Configuration for Mini PC

### Update API URL

The mobile and desktop apps need to point to the mini PC's IP address instead of localhost.

#### Desktop App (`apps/desktop/src/App.jsx`):
```javascript
const apiUrl = "http://MINI_PC_IP:8001";  // Replace with actual IP
```

#### Mobile App (`apps/mobile/app/index.tsx`):
```javascript
const apiUrl = "http://MINI_PC_IP:8001";  // Replace with actual IP
```

#### Web UI (`apps/web/src/app/page.tsx`):
```javascript
const [settings, setSettings] = useState({
  apiUrl: "http://MINI_PC_IP:8001",  // Replace with actual IP
  // ...
});
```

### Find Mini PC IP Address:
```bash
# Windows
ipconfig

# Linux
ip addr show
```

---

## Part 5: Troubleshooting

### Android APK Build Issues

**Issue:** "Java not found"
- **Solution:** Install JDK 17 and set JAVA_HOME environment variable

**Issue:** "Android SDK not found"
- **Solution:** Install Android Studio and run SDK Manager

**Issue:** "Gradle build failed"
- **Solution:** Delete `android/.gradle` folder and retry

### Desktop Build Issues

**Issue:** "Rust not found"
- **Solution:** Install Rust from https://rustup.rs/

**Issue:** "File locking error"
- **Solution:** Use WSL2 on Linux or follow TAURI_BUILD_FIX.md

**Issue:** "Port already in use"
- **Solution:** Change port in start-api.bat or kill conflicting process

---

## Part 6: Quick Start on Mini PC

### Complete Setup Sequence:

1. **Copy Project Files**
   - Transfer `synova-workspace` folder to mini PC

2. **Install Dependencies**
   - Node.js 18+
   - Rust (for desktop native build)
   - Python 3.11+ (for API)

3. **Start API Server**
   ```bash
   cd apps/api
   .\start-api.bat
   ```

4. **Start Desktop App**
   ```bash
   cd apps/desktop
   npm run dev
   ```

5. **Access Applications**
   - Desktop: http://localhost:1420
   - Web UI: http://localhost:3000
   - API: http://localhost:8001

---

## Part 7: Android Installation

### Install APK on Device:

1. **Enable Unknown Sources**
   - Settings > Security > Unknown Sources (enable)

2. **Transfer APK**
   - Copy APK file to device via USB or cloud storage

3. **Install**
   - Open APK file on device
   - Follow installation prompts

4. **Configure API URL**
   - Open app
   - Change API URL to mini PC IP address
   - Example: `http://192.168.1.100:8001`

---

## Summary

| Platform | Build Method | Output Location |
|----------|-------------|-----------------|
| Android | `npx expo build:android` | `apps/mobile/android/app/build/outputs/apk/` |
| Desktop (Native) | `npm run tauri build` | `apps/desktop/src-tauri/target/release/bundle/` |
| Desktop (Web) | `npm run dev` | http://localhost:1420 |

**Recommendation:**
- For Android: Use local Expo build
- For Desktop Mini PC: Try native build first, fall back to web version
- API should run on mini PC for all clients to connect
