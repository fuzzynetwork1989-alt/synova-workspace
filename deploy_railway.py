#!/usr/bin/env python3
"""
Deployment script for Enhanced Synova Brain API
"""

import subprocess
import sys
import os

def run_command(command, cwd=None):
    """Run command and return result"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    """Deploy to Railway"""
    print("🚀 Deploying Enhanced Synova Brain API to Railway...")
    
    # Change to API directory
    api_dir = "synova-core-api"
    if not os.path.exists(api_dir):
        print(f"❌ Directory {api_dir} not found")
        return False
    
    # Initialize git if not already done
    print("📦 Initializing git repository...")
    success, output, error = run_command("git init", cwd=api_dir)
    if not success and "already exists" not in error:
        print(f"❌ Git init failed: {error}")
        return False
    
    # Add all files
    print("📝 Adding files...")
    success, output, error = run_command("git add .", cwd=api_dir)
    if not success:
        print(f"❌ Git add failed: {error}")
        return False
    
    # Commit changes
    print("💾 Committing changes...")
    success, output, error = run_command('git commit -m "Deploy Enhanced Synova Brain API v3.2"', cwd=api_dir)
    if not success and "nothing to commit" not in error:
        print(f"❌ Git commit failed: {error}")
        return False
    
    print("✅ Repository ready for deployment")
    print("📍 To deploy to Railway:")
    print("   1. Push this repository to GitHub")
    print("   2. Connect the repository to Railway")
    print("   3. Railway will automatically deploy using the Dockerfile")
    
    return True

if __name__ == "__main__":
    main()
