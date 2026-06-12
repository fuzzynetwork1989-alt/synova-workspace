"""
Workspace manager for Synova Brain
"""

from typing import Dict, Any, Optional
import logging
import uuid

logger = logging.getLogger(__name__)


class Workspace:
    """User workspace"""

    def __init__(self, workspace_id: str, user_id: str, name: str):
        self.workspace_id = workspace_id
        self.user_id = user_id
        self.name = name
        self.created_at = self._get_timestamp()
        self.updated_at = self._get_timestamp()
        self.settings = {}
        self.memory = {}
        self.tools = []
        self.agents = []

    def update(self):
        """Update workspace timestamp"""
        self.updated_at = self._get_timestamp()

    def set_setting(self, key: str, value: Any):
        """Set workspace setting"""
        self.settings[key] = value
        self.update()

    def get_setting(self, key: str, default: Any = None) -> Any:
        """Get workspace setting"""
        return self.settings.get(key, default)

    def add_memory(self, key: str, value: Any):
        """Add memory to workspace"""
        self.memory[key] = value
        self.update()

    def get_memory(self, key: str, default: Any = None) -> Any:
        """Get memory from workspace"""
        return self.memory.get(key, default)

    def _get_timestamp(self) -> float:
        """Get current timestamp"""
        import time
        return time.time()


class WorkspaceManager:
    """Manager for user workspaces"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.workspaces: Dict[str, Workspace] = {}
        self.user_workspaces: Dict[str, list] = {}

    async def get_workspace(self, workspace_id: str, user_id: str) -> Optional[Workspace]:
        """Get workspace by ID"""
        if workspace_id in self.workspaces:
            workspace = self.workspaces[workspace_id]
            if workspace.user_id == user_id:
                return workspace
        return None

    async def create_workspace(self, user_id: str, name: str) -> Workspace:
        """Create new workspace"""
        workspace_id = str(uuid.uuid4())
        workspace = Workspace(workspace_id, user_id, name)
        self.workspaces[workspace_id] = workspace
        if user_id not in self.user_workspaces:
            self.user_workspaces[user_id] = []
        self.user_workspaces[user_id].append(workspace_id)
        return workspace

    async def list_workspaces(self, user_id: str) -> list:
        """List all workspaces for user"""
        if user_id in self.user_workspaces:
            return [
                self.workspaces[workspace_id]
                for workspace_id in self.user_workspaces[user_id]
            ]
        return []

    async def delete_workspace(self, workspace_id: str, user_id: str) -> bool:
        """Delete workspace"""
        workspace = await self.get_workspace(workspace_id, user_id)
        if workspace:
            del self.workspaces[workspace_id]
            if user_id in self.user_workspaces:
                self.user_workspaces[user_id].remove(workspace_id)
            return True
        return False

    async def update_workspace(self, workspace_id: str, user_id: str, updates: Dict[str, Any]) -> bool:
        """Update workspace"""
        workspace = await self.get_workspace(workspace_id, user_id)
        if workspace:
            for key, value in updates.items():
                if hasattr(workspace, key):
                    setattr(workspace, key, value)
            workspace.update()
            return True
        return False
