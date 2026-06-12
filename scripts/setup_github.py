"""
Automated GitHub repository setup script
"""

import os
import subprocess
import json
from typing import Dict, Any


class GitHubSetup:
    """Automated GitHub repository creation and configuration"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.repo_name = config.get("repo_name", "synova-nexus")
        self.description = config.get("description", "Synova Nexus AI Platform")
        self.private = config.get("private", False)
        self.github_token = os.getenv("GITHUB_TOKEN")

    def create_repository(self) -> bool:
        """Create GitHub repository via GitHub CLI or API"""
        try:
            if self.github_token:
                return self._create_via_api()
            else:
                return self._create_via_cli()
        except Exception as e:
            print(f"Error creating repository: {e}")
            return False

    def _create_via_cli(self) -> bool:
        """Create repository using GitHub CLI"""
        try:
            cmd = f"gh repo create {self.repo_name} --description '{self.description}'"
            if self.private:
                cmd += " --private"
            else:
                cmd += " --public"
            cmd += " --source=. --remote=origin"
            subprocess.run(cmd, shell=True, check=True)
            return True
        except subprocess.CalledProcessError as e:
            print(f"GitHub CLI error: {e}")
            return False

    def _create_via_api(self) -> bool:
        """Create repository using GitHub API"""
        try:
            import httpx
            headers = {
                "Authorization": f"token {self.github_token}",
                "Accept": "application/vnd.github.v3+json",
            }
            data = {
                "name": self.repo_name,
                "description": self.description,
                "private": self.private,
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.github.com/user/repos",
                    headers=headers,
                    json=data,
                )
                response.raise_for_status()
            return True
        except Exception as e:
            print(f"GitHub API error: {e}")
            return False

    def setup_branch_protection(self) -> bool:
        """Setup branch protection rules"""
        try:
            cmd = f"gh api repos/:owner/{self.repo_name}/branches/main/protection -X PUT -f enforce_admins=true -f required_pull_request_reviews='{{\"required_approving_review_count\":1}}'"
            subprocess.run(cmd, shell=True, check=True)
            return True
        except:
            return False

    def setup_secrets(self, secrets: Dict[str, str]) -> bool:
        """Setup repository secrets"""
        try:
            for key, value in secrets.items():
                cmd = f"gh secret set {key} -b '{value}'"
                subprocess.run(cmd, shell=True, check=True)
            return True
        except:
            return False

    def enable_pages(self) -> bool:
        """Enable GitHub Pages for documentation"""
        try:
            cmd = f"gh api repos/:owner/{self.repo_name}/pages -X POST -f source='{{\"branch\":\"{{\"branch\":\"main\",\"path\":\"docs\"}}\"}}'"
            subprocess.run(cmd, shell=True, check=True)
            return True
        except:
            return False


if __name__ == "__main__":
    config = {
        "repo_name": "synova-nexus",
        "description": "Production-ready AI platform with multi-agent orchestration",
        "private": False,
    }
    setup = GitHubSetup(config)
    setup.create_repository()
    setup.setup_branch_protection()
