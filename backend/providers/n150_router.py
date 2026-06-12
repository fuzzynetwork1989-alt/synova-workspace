"""
N150 Variant - Low-VRAM routing for constrained hardware
"""

from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class N150Router:
    """Low-VRAM routing for N150 hardware"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.max_vram = config.get("max_vram", 8)  # GB
        self.preferred_models = config.get("preferred_models", [
            "llama-3.2-3b",
            "phi-3-mini",
            "gemma-2-2b",
        ])

    async def route_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Route request to appropriate low-VRAM model"""
        model = self._select_model(request)
        return {"model": model, "provider": "ollama", "optimized": True}

    def _select_model(self, request: Dict[str, Any]) -> str:
        """Select appropriate model for request"""
        task_complexity = request.get("complexity", "low")
        if task_complexity == "low":
            return self.preferred_models[0]
        elif task_complexity == "medium":
            return self.preferred_models[1] if len(self.preferred_models) > 1 else self.preferred_models[0]
        else:
            return self.preferred_models[-1]

    async def check_hardware_constraints(self) -> Dict[str, Any]:
        """Check hardware constraints"""
        return {
            "max_vram": self.max_vram,
            "available_vram": self.max_vram * 0.8,
            "constrained": True,
        }
