# Tauri Desktop App - Windows File Lock Fix

## Problem

Tauri native build fails with "The process cannot access the file because it is being used by another process (os error 32)"

## Root Cause

Windows Defender (or other antivirus) is scanning Rust compilation artifacts during the build process, causing file locking conflicts.

## Solution

### Option 1: Add Windows Defender Exclusion (Recommended)

1. Open Windows Security
2. Go to **Virus & threat protection**
3. Click **Manage settings**
4. Scroll to **Exclusions** and click **Add or remove exclusions**
5. Click **Add an exclusion** > **Folder**
6. Add these paths (add entire directories for broader coverage):
   - `C:\Users\McBuz\CascadeProjects\Synova AI Rebuild\synova-workspace`
   - `C:\Users\McBuz\.cargo`

7. After adding exclusions, run:

   ```cmd
   cd apps\desktop
   .\build-desktop.bat
   ```

### Option 2: Temporarily Disable Real-time Protection

1. Open Windows Security
2. Go to **Virus & threat protection**
3. Click **Manage settings**
4. Turn off **Real-time protection** temporarily
5. Run the build
6. Re-enable Real-time protection after build completes

### Option 3: Use WSL2 (Linux on Windows) - RECOMMENDED

Build in a Linux environment where file locking issues don't occur. This is the most reliable solution for Windows Rust/Tauri builds.

```bash
# In WSL2
cd /mnt/c/Users/McBuz/CascadeProjects/Synova\ AI\ Rebuild/synova-workspace/apps/desktop
npm run tauri:build
```

If WSL2 is not installed:
1. Open PowerShell as Administrator
2. Run: `wsl --install`
3. Restart computer
4. Install Ubuntu from Microsoft Store
5. Install Rust in WSL2: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
6. Install Node.js in WSL2: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`
7. Then run the build command above

### Option 4: Accept Web Version

The desktop app is fully functional as a web application:

- Run: `cd apps/desktop && npm run dev`
- Access: <http://localhost:1420>
- This provides the same chat interface and functionality

## Current Status

✅ Rust installed (version 1.95.0)
✅ Tauri project structure complete
✅ React chat interface implemented
✅ Vite dev server functional (localhost:1420)
❌ Native Windows build blocked by Defender file locking

## Verification

After applying Windows Defender exclusions, the build should complete successfully and produce:

- `apps/desktop/src-tauri/target/release/bundle/msi/Synova AI_1.0.0_x64_en-US.msi`
- `apps/desktop/src-tauri/target/release/synova-desktop.exe`
