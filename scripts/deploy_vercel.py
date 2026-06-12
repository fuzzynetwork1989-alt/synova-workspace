"""
Automated Vercel deployment for frontend
"""

import os
import subprocess
import json
from typing import Dict, Any


class VercelDeploy:
    """Automated Vercel deployment configuration"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.project_name = config.get("project_name", "synova-nexus")
        self.vercel_token = os.getenv("VERCEL_TOKEN")

    def deploy(self) -> bool:
        """Deploy to Vercel using Vercel CLI"""
        try:
            cmd = f"vercel --prod --token={self.vercel_token}"
            subprocess.run(cmd, shell=True, check=True)
            return True
        except subprocess.CalledProcessError as e:
            print(f"Vercel deployment error: {e}")
            return False

    def setup_project(self) -> bool:
        """Setup Vercel project configuration"""
        try:
            vercel_json = {
                "buildCommand": "npm run build",
                "outputDirectory": "ui/.next",
                "framework": "nextjs",
                "regions": ["iad1"],
                "env": {
                    "NEXT_PUBLIC_API_URL": self.config.get("api_url", ""),
                    "NEXT_PUBLIC_APP_NAME": "Synova Nexus",
                },
            }
            with open("vercel.json", "w") as f:
                json.dump(vercel_json, f, indent=2)
            return True
        except Exception as e:
            print(f"Error setting up Vercel project: {e}")
            return False

    def deploy_preview(self) -> bool:
        """Deploy preview environment"""
        try:
            cmd = f"vercel --token={self.vercel_token}"
            subprocess.run(cmd, shell=True, check=True)
            return True
        except subprocess.CalledProcessError as e:
            print(f"Vercel preview deployment error: {e}")
            return False


if __name__ == "__main__":
    config = {
        "project_name": "synova-nexus",
        "api_url": "https://api.synova.ai",
    }
    deploy = VercelDeploy(config)
    deploy.setup_project()
    deploy.deploy()
