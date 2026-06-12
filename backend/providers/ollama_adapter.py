"""
Ollama adapter for local model development and testing
"""

from typing import Dict, Any, List, Optional
import httpx
import logging
from .base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class OllamaAdapter(BaseAdapter):
    """Adapter for Ollama local model hosting"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.base_url = config.get("base_url", "http://localhost:11434")
        self.timeout = config.get("timeout", 60)

    async def generate(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate text completion using Ollama"""
        try:
            payload = {
                "model": model,
                "messages": messages,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                },
                "stream": stream,
            }
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json=payload,
                )
                response.raise_for_status()
                result = response.json()
            return {
                "success": True,
                "content": result.get("message", {}).get("content", ""),
                "model": model,
                "provider": "ollama",
            }
        except Exception as e:
            logger.error(f"Ollama generation error: {e}")
            return {"success": False, "error": str(e), "provider": "ollama"}

    async def generate_stream(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs
    ):
        """Generate streaming text completion using Ollama"""
        try:
            payload = {
                "model": model,
                "messages": messages,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                },
                "stream": True,
            }
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/chat",
                    json=payload,
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line:
                            import json
                            data = json.loads(line)
                            if "message" in data:
                                yield data["message"].get("content", "")
        except Exception as e:
            logger.error(f"Ollama streaming error: {e}")
            yield f"Error: {str(e)}"

    async def list_models(self) -> List[Dict[str, Any]]:
        """List available models from Ollama"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                data = response.json()
                return data.get("models", [])
        except Exception as e:
            logger.error(f"Ollama list models error: {e}")
            return []

    async def health_check(self) -> bool:
        """Check if Ollama is healthy"""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except:
            return False

    def get_model_info(self, model: str) -> Dict[str, Any]:
        """Get information about a specific model"""
        return {
            "model": model,
            "provider": "ollama",
            "base_url": self.base_url,
            "capabilities": ["text-generation", "streaming", "local"],
        }

    async def pull_model(self, model: str) -> bool:
        """Pull a model from Ollama registry"""
        try:
            async with httpx.AsyncClient(timeout=300) as client:
                response = await client.post(
                    f"{self.base_url}/api/pull",
                    json={"name": model},
                )
                response.raise_for_status()
                return True
        except Exception as e:
            logger.error(f"Ollama pull model error: {e}")
            return False
