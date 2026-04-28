"""
Chat Router - Main chat endpoint with full Nexus integration
Supports multiple modes: chat, supanova, deep_research, rag, autopilot
"""

import json
import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from typing import Dict, Any, List
import structlog
import httpx

log = structlog.get_logger()
router = APIRouter(prefix="/chat", tags=["chat"])

# Ollama configuration
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "synova")


async def stream_ollama_chat(messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 4096):
    """Stream chat completion from Ollama"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        payload = {
            "model": OLLAMA_MODEL,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }

        try:
            async with client.stream("POST", f"{OLLAMA_HOST}/api/chat", json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.strip():
                        try:
                            chunk = json.loads(line)
                            if "content" in chunk.get("message", {}):
                                yield chunk["message"]["content"]
                        except json.JSONDecodeError:
                            continue
        except httpx.HTTPError as e:
            log.error("ollama_stream_error", error=str(e))
            yield f"[Error connecting to Ollama: {str(e)}]"


async def event_stream(generator, conversation_id: str):
    """Format generator output as Server-Sent Events"""
    async for chunk in generator:
        if isinstance(chunk, dict):
            yield f"data: {json.dumps(chunk)}\n\n"
        else:
            yield f"data: {json.dumps({'type': 'token', 'content': chunk, 'conversation_id': conversation_id})}\n\n"
    yield f"data: {json.dumps({'type': 'done', 'conversation_id': conversation_id})}\n\n"


@router.post("/stream")
async def chat_stream(request: Dict[str, Any]):
    """
    Main chat streaming endpoint
    Supports multiple agent modes and integrates all Nexus services
    """
    conversation_id = request.get("conversation_id") or str(uuid.uuid4())
    tenant_id = request.get("tenant_id", "default")
    messages = request.get("messages", [])
    mode = request.get("mode", "chat")
    use_rag = request.get("use_rag", False)
    use_memory = request.get("use_memory", True)
    temperature = request.get("temperature", 0.7)
    max_tokens = request.get("max_tokens", 4096)

    # Get last message for processing
    last_msg = messages[-1].get("content", "") if messages else ""

    # Safety check (would integrate with safety service)
    # safety = await safety_service.check_input(last_msg)
    # if safety.action == "block":
    #     raise HTTPException(status_code=400, detail=f"Content blocked")

    # Quota check (would integrate with billing service)
    # quota = await billing_service.check_quota(tenant_id)
    # if not quota["allowed"]:
    #     raise HTTPException(status_code=429, detail="Token quota exceeded")

    async def generate():
        full_response = ""
        try:
            # Route to appropriate mode
            if mode == "supanova":
                # Would integrate with Supanova Brain
                # async for event in supanova_brain.run_supanova(messages, run_id=conversation_id):
                #     yield event
                #     if event.get("type") == "answer":
                #         full_response = event.get("content", "")
                yield {"type": "info", "message": "Supanova mode requires Supanova Brain integration"}
                full_response = "Supanova response placeholder"

            elif mode == "deep_research":
                # Would integrate with Deep Research Service
                # from packages.research.src.deep_research import DeepResearchService
                # research = DeepResearchService(tool_service, provider_service)
                # async for chunk in research.run_deep_research(last_msg):
                #     full_response += chunk
                #     yield chunk
                yield {"type": "info", "message": "Deep research requires service integration"}
                full_response = "Research results placeholder"

            elif mode == "rag":
                # Would integrate with RAG Service
                # docs = await rag_service.query(last_msg, tenant_id, top_k=5)
                # context = "\n".join([d["content"] for d in docs])
                # async for chunk in provider_service.stream_chat(messages + [{"role": "system", "content": f"Context: {context}"}]):
                #     full_response += chunk
                #     yield chunk
                yield {"type": "info", "message": "RAG mode requires RAG service integration"}
                full_response = "RAG response placeholder"

            elif mode == "autopilot":
                # Would integrate with Autopilot Mode
                # async for event in autopilot_mode.generate_project(last_msg):
                #     yield event
                yield {"type": "info", "message": "Autopilot mode requires Autopilot service integration"}
                full_response = "Autopilot response placeholder"

            else:
                # Standard chat mode - Use Ollama with Synova model
                async for chunk in stream_ollama_chat(messages, temperature=temperature, max_tokens=max_tokens):
                    full_response += chunk
                    yield chunk

            # Save to memory (would integrate with Memory Service)
            # await memory_service.append_short_term(conversation_id, {"role": "user", "content": last_msg})
            # await memory_service.append_short_term(conversation_id, {"role": "assistant", "content": full_response[:2000]})

            # Auto-extract memory
            # await memory_service.extract_and_save_memory(user_id, last_msg)

            # Record usage (would integrate with Billing Service)
            # await billing_service.record_usage(tenant_id, tokens_in, tokens_out, cost, provider, model, endpoint)

        except Exception as e:
            log.error("chat_stream_error", error=str(e))
            yield {"type": "error", "message": str(e)}

    return StreamingResponse(event_stream(generate(), conversation_id), media_type="text/event-stream")


@router.get("/health")
async def chat_health():
    """Health check for chat router"""
    return {"status": "healthy", "modes": ["chat", "supanova", "deep_research", "rag", "autopilot"]}
