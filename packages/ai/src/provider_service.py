"""
Provider-Agnostic LLM Service
Supports multiple LLM providers with unified streaming interface
"""

import os
import httpx
import json
from typing import AsyncGenerator, List, Optional, Dict, Any
from enum import Enum
import structlog

log = structlog.get_logger()


class LLMProvider(str, Enum):
    """Supported LLM providers"""
    openai = "openai"
    anthropic = "anthropic"
    ollama = "ollama"
    gemini = "gemini"
    grok = "grok"
    hf = "hf"


PROVIDER_MODELS = {
    LLMProvider.openai: "gpt-4o",
    LLMProvider.anthropic: "claude-opus-4-5",
    LLMProvider.ollama: "llama3.1:latest",
    LLMProvider.gemini: "gemini-2.5-pro",
    LLMProvider.grok: "grok-3",
    LLMProvider.hf: "mistralai/Mistral-7B-Instruct-v0.3",
}

COST_PER_1K = {
    "gpt-4o": {"in": 0.005, "out": 0.015},
    "gpt-4o-mini": {"in": 0.00015, "out": 0.0006},
    "claude-opus-4-5": {"in": 0.015, "out": 0.075},
    "claude-sonnet-4-6": {"in": 0.003, "out": 0.015},
    "gemini-2.5-pro": {"in": 0.00125, "out": 0.005},
    "grok-3": {"in": 0.005, "out": 0.015},
    "llama3.1:latest": {"in": 0.0, "out": 0.0},
    "gemma4": {"in": 0.0, "out": 0.0},
}


class ProviderService:
    """
    Provider-agnostic LLM service with streaming support
    Supports OpenAI, Anthropic, Ollama, Gemini, Grok, and HuggingFace
    """
    
    def __init__(self, default_provider: Optional[LLMProvider] = None):
        self.default_provider = default_provider or self._get_provider_from_env()
        self.clients = {}
        self._initialize_clients()
    
    def _get_provider_from_env(self) -> LLMProvider:
        """Get default provider from environment"""
        provider_str = os.getenv("LLM_PROVIDER", "openai")
        try:
            return LLMProvider(provider_str)
        except ValueError:
            return LLMProvider.openai
    
    def _initialize_clients(self):
        """Initialize provider clients"""
        # Lazy initialization - clients created on demand
        pass
    
    def get_model(self, provider: Optional[LLMProvider] = None, override: Optional[str] = None) -> str:
        """Get model name for provider"""
        p = provider or self.default_provider
        if override:
            return override
        return PROVIDER_MODELS.get(p, "gpt-4o")
    
    def calc_cost(self, model: str, tokens_in: int, tokens_out: int) -> float:
        """Calculate cost for model usage"""
        rates = COST_PER_1K.get(model, {"in": 0.005, "out": 0.015})
        return (tokens_in / 1000 * rates["in"]) + (tokens_out / 1000 * rates["out"])
    
    def messages_to_openai(self, messages: List[Dict[str, Any]]) -> list:
        """Convert messages to OpenAI format"""
        return [{"role": m.get("role"), "content": m.get("content")} for m in messages]
    
    def messages_to_anthropic(self, messages: List[Dict[str, Any]]) -> tuple:
        """Convert messages to Anthropic format"""
        system = ""
        msgs = []
        for m in messages:
            if m.get("role") == "system":
                system = m.get("content")
            else:
                msgs.append({"role": m.get("role"), "content": m.get("content")})
        return system, msgs
    
    async def stream_chat(
        self,
        messages: List[Dict[str, Any]],
        provider: Optional[LLMProvider] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        vision_url: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat completion from specified provider
        
        Args:
            messages: List of message dictionaries
            provider: LLM provider to use
            model: Model name override
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            vision_url: Optional image URL for vision models
            
        Yields:
            Text chunks from the streaming response
        """
        p = provider or self.default_provider
        m = self.get_model(p, model)
        
        log.info("llm_stream_start", provider=p, model=m)
        
        if p == LLMProvider.openai:
            async for chunk in self._stream_openai(messages, m, temperature, max_tokens, vision_url):
                yield chunk
        elif p == LLMProvider.anthropic:
            async for chunk in self._stream_anthropic(messages, m, temperature, max_tokens):
                yield chunk
        elif p == LLMProvider.ollama:
            async for chunk in self._stream_ollama(messages, m, temperature, max_tokens):
                yield chunk
        elif p == LLMProvider.gemini:
            async for chunk in self._stream_gemini(messages, m, temperature, max_tokens):
                yield chunk
        elif p == LLMProvider.grok:
            async for chunk in self._stream_grok(messages, m, temperature, max_tokens):
                yield chunk
        elif p == LLMProvider.hf:
            async for chunk in self._stream_hf(messages, m, temperature, max_tokens):
                yield chunk
        else:
            raise ValueError(f"Unsupported provider: {p}")
    
    async def _stream_openai(self, messages, model, temperature, max_tokens, vision_url=None):
        """Stream from OpenAI API"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            oai_messages = self.messages_to_openai(messages)
            
            if vision_url and model in ["gpt-4o", "gpt-4o-mini"]:
                last = oai_messages[-1]
                last["content"] = [
                    {"type": "text", "text": last["content"]},
                    {"type": "image_url", "image_url": {"url": vision_url}},
                ]
            
            stream = await client.chat.completions.create(
                model=model,
                messages=oai_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )
            
            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta
                    
        except ImportError:
            log.warning("openai_not_installed", provider="openai")
            yield "[OpenAI client not installed - install with: pip install openai]"
        except Exception as e:
            log.error("openai_stream_error", error=str(e))
            yield f"[Error: {str(e)}]"
    
    async def _stream_anthropic(self, messages, model, temperature, max_tokens):
        """Stream from Anthropic API"""
        try:
            from anthropic import AsyncAnthropic
            
            client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            system, msgs = self.messages_to_anthropic(messages)
            
            async with client.messages.stream(
                model=model,
                system=system or "You are Synova AI, a helpful assistant.",
                messages=msgs,
                temperature=temperature,
                max_tokens=max_tokens,
            ) as stream:
                async for text in stream.text_stream:
                    yield text
                    
        except ImportError:
            log.warning("anthropic_not_installed", provider="anthropic")
            yield "[Anthropic client not installed - install with: pip install anthropic]"
        except Exception as e:
            log.error("anthropic_stream_error", error=str(e))
            yield f"[Error: {str(e)}]"
    
    async def _stream_ollama(self, messages, model, temperature, max_tokens):
        """Stream from Ollama API"""
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        payload = {
            "model": model,
            "messages": self.messages_to_openai(messages),
            "stream": True,
            "options": {"temperature": temperature, "num_predict": max_tokens},
        }
        
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                async with client.stream("POST", f"{base_url}/api/chat", json=payload) as resp:
                    async for line in resp.aiter_lines():
                        if line:
                            data = json.loads(line)
                            content = data.get("message", {}).get("content", "")
                            if content:
                                yield content
        except Exception as e:
            log.error("ollama_stream_error", error=str(e))
            yield f"[Error: {str(e)} - Ensure Ollama is running at {base_url}]"
    
    async def _stream_gemini(self, messages, model, temperature, max_tokens):
        """Stream from Gemini API"""
        try:
            import google.generativeai as genai
            
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            gemini_model = genai.GenerativeModel(model)
            
            contents = [
                {"role": m.get("role") if m.get("role") != "system" else "user", "parts": [m.get("content")]}
                for m in messages if m.get("role") != "system"
            ]
            
            response = await gemini_model.generate_content_async(
                contents,
                generation_config={"temperature": temperature, "max_output_tokens": max_tokens},
                stream=True,
            )
            
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except ImportError:
            log.warning("gemini_not_installed", provider="gemini")
            yield "[Gemini client not installed - install with: pip install google-generativeai]"
        except Exception as e:
            log.error("gemini_stream_error", error=str(e))
            yield f"[Error: {str(e)}]"
    
    async def _stream_grok(self, messages, model, temperature, max_tokens):
        """Stream from Grok API (xAI)"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(
                api_key=os.getenv("GROK_API_KEY"),
                base_url="https://api.x.ai/v1",
            )
            
            stream = await client.chat.completions.create(
                model=model,
                messages=self.messages_to_openai(messages),
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )
            
            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta
                    
        except ImportError:
            log.warning("openai_not_installed", provider="grok")
            yield "[Grok requires OpenAI client - install with: pip install openai]"
        except Exception as e:
            log.error("grok_stream_error", error=str(e))
            yield f"[Error: {str(e)}]"
    
    async def _stream_hf(self, messages, model, temperature, max_tokens):
        """Stream from HuggingFace API"""
        api_key = os.getenv("HF_API_KEY")
        url = f"https://api-inference.huggingface.co/models/{model}"
        prompt = "\n".join([f"{m.get('role')}: {m.get('content')}" for m in messages])
        
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                resp = await client.post(
                    url,
                    headers={"Authorization": f"Bearer {api_key}"},
                    json={"inputs": prompt, "parameters": {"max_new_tokens": max_tokens, "temperature": temperature}},
                )
                data = resp.json()
                if isinstance(data, list):
                    yield data[0].get("generated_text", "")
                else:
                    yield str(data)
                    
        except Exception as e:
            log.error("hf_stream_error", error=str(e))
            yield f"[Error: {str(e)}]"
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for provider service"""
        return {
            "status": "healthy",
            "default_provider": self.default_provider.value,
            "supported_providers": [p.value for p in LLMProvider],
            "available_models": PROVIDER_MODELS,
            "api_keys_configured": {
                "openai": bool(os.getenv("OPENAI_API_KEY")),
                "anthropic": bool(os.getenv("ANTHROPIC_API_KEY")),
                "gemini": bool(os.getenv("GEMINI_API_KEY")),
                "grok": bool(os.getenv("GROK_API_KEY")),
                "hf": bool(os.getenv("HF_API_KEY")),
                "ollama": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            }
        }
