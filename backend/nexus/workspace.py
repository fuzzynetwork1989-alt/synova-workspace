"""
Nexus Workspace - User workspace management
"""

from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)


class Workspace:
    """Nexus workspace for organizing user work"""

    def __init__(self, workspace_id: str, user_id: str, name: str):
        self.workspace_id = workspace_id
        self.user_id = user_id
        self.name = name
        self.zones = []
        self.settings = {}

    def add_zone(self, zone: 'Zone'):
        """Add zone to workspace"""
        self.zones.append(zone)

    def get_zone(self, zone_id: str) -> 'Zone':
        """Get zone by ID"""
        for zone in self.zones:
            if zone.zone_id == zone_id:
                return zone
        return None
