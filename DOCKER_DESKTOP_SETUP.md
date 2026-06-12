# Docker Desktop Setup for Synova AI
# Fix permissions and setup guide

## Issue: Docker can't write to Program Files
This happens when Docker Desktop was installed with admin permissions but run as user.

## Solution 1: Run Docker Desktop as Administrator
1. Right-click Docker Desktop icon
2. Select "Run as administrator"
3. Restart Docker Desktop

## Solution 2: Change Docker Desktop data location
1. Open Docker Desktop
2. Go to Settings > Resources > Advanced
3. Change "Disk image location" to a user-writable path:
   - C:\Users\fuzzy\Docker
   - Or: C:\DockerData
4. Apply and restart Docker Desktop

## Solution 3: Reset Docker Desktop permissions
1. Close Docker Desktop completely
2. Run as administrator: 
   ```
   docker system prune -a
   docker volume prune
   ```
3. Restart Docker Desktop

## Verify Docker is working
```bash
docker --version
docker run hello-world
```

## For Synova AI Development
Once Docker is fixed:
1. Open Docker Desktop
2. Go to Settings > Resources > File Sharing
3. Add your workspace path: C:\Users\fuzzy\Synova AI (updated)\synova-workspace
4. Apply changes

## Alternative: Use Docker without Desktop
If Docker Desktop continues to have issues:
1. Install Docker Engine directly
2. Use command line only
3. VS Code will still work with Docker extension
