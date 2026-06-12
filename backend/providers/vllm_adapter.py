"""
vLLM adapter for production model serving
"""

from typing import Dict, Any, List
import httpx
import logging
from .base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class VLLMAdapter(BaseAdapter):
    """Adapter for vLLM production inference server"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.base_url = config.get("base_url", "http://localhost:8000")
        self.api_key = config.get("api_key", "")

    async def generate(self, messages: List[Dict[str, str]], model: str, temperature: float = 0.7, max_tokens: int = 2048, stream: bool = False, **kwargs) -> Dict[str, Any]:
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            payload = {"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens, "stream": stream}
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(f"{self.base_url}/v1/chat/completions", headers=headers, json=payload)
                response.raise_for_status()
                result = response.json()
            return {"success": True, "content": result["choices"][0]["message"]["content"], "model": model, "provider": "vllm"}
        except Exception as e:
            logger.error(f"vLLM error: {e}")
            return {"success": False, "error": str(e), "provider": "vllm"}

    async def generate_stream(self, messages: List[Dict[str, str]], model: str, temperature: float = 0.7, max_tokens: int = 2048, **kwargs):
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            payload = {"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens, "stream": True}
            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream("POST", f"{self.base_url}/v1/chat/completions", headers=headers, json=payload) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            import json
                            data = json.loads(line[6:])
                            if data["choices"][0].get("delta", {}).get("content"):
                                yield data["choices"][0]["delta"]["content"]
        except Exception as e:
            logger.error(f"vLLM stream error: {e}")
            yield f"Error: {str(e)}"

    async def list_models(self) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.get(f"{self.base_url}/v1/models")
                response.raise_for_status()
                return response.json().get("data", [])
        except Exception as e:
            logger.error(f"vLLM list error: {e}")
            return []

    async def health_check(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except:
            return False

    def get_model_info(self, model: str) -> Dict[str, Any]:
        return {"model": model, "provider": "vllm", "base_url": self.base_url, "capabilities": ["text-generation", "streaming", "production"]}
