@app.post("/ai/generate/stream")
async def synova_brain_stream_generate(request: ChatRequest):
    """Enhanced Synova Brain streaming endpoint with advanced LLM features"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        # Create streaming response
        async def generate_stream():
            for chunk in synova_brain.generate_with_streaming(request.prompt):
                yield f"data: {json.dumps(chunk)}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
        )
        
    except Exception as e:
        return {"error": f"Enhanced generation failed: {str(e)}"}

@app.post("/ai/function-call")
async def synova_brain_function_call(request: Dict[str, Any]):
    """Function calling endpoint like ChatGPT"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        prompt = request.get("prompt", "")
        function_result = synova_brain.function_calling(prompt)
        
        if function_result["type"] == "function_call":
            # Execute the function
            function_name = function_result["function"]["name"]
            arguments = function_result["arguments"]
            
            if function_name == "generate_blueprint":
                blueprint_response = synova_brain.generate_with_streaming(
                    f"Generate {arguments.get('blueprint_type', 'warehouse')} blueprint"
                )
                return {
                    "type": "function_result",
                    "function": function_name,
                    "result": blueprint_response,
                    "arguments": arguments
                }
        
        return function_result
        
    except Exception as e:
        return {"error": f"Function calling failed: {str(e)}"}

@app.post("/ai/multimodal")
async def synova_brain_multimodal(request: Dict[str, Any]):
    """Multimodal endpoint with image and text analysis"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        text = request.get("text", "")
        images = request.get("images", [])
        
        result = synova_brain.multimodal_support(text, images)
        return result
        
    except Exception as e:
        return {"error": f"Multimodal analysis failed: {str(e)}"}

@app.post("/ai/code")
async def synova_brain_code_generation(request: Dict[str, Any]):
    """Code generation endpoint like advanced LLMs"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        prompt = request.get("prompt", "")
        language = request.get("language", "javascript")
        
        result = synova_brain.code_generation(prompt, language)
        return result
        
    except Exception as e:
        return {"error": f"Code generation failed: {str(e)}"}

@app.post("/ai/reasoning")
async def synova_brain_reasoning(request: Dict[str, Any]):
    """Advanced reasoning endpoint like Grok"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        prompt = request.get("prompt", "")
        context = request.get("context", {})
        
        result = synova_brain.advanced_reasoning(prompt, context)
        return result
        
    except Exception as e:
        return {"error": f"Advanced reasoning failed: {str(e)}"}

@app.post("/ai/memory")
async def synova_brain_memory(request: Dict[str, Any]):
    """Conversation memory endpoint"""
    
    if not synova_brain:
        return {"error": "Enhanced Synova Brain is currently unavailable"}
    
    try:
        messages = request.get("messages", [])
        
        result = synova_brain.conversation_memory(messages)
        return result
        
    except Exception as e:
        return {"error": f"Memory analysis failed: {str(e)}"}

@app.post("/ai/generate")
async def synova_brain_generate(request: ChatRequest):
    """Dedicated Synova Brain v3.2 endpoint for XR architecture"""
    
    if not synova_brain:
        return ChatResponse(
            response="Synova Brain is currently unavailable. Please try again later.",
            tier="synova-brain-v3.2",
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or "fallback"
        )
    
    try:
        # Generate response using Synova Brain
        brain_response = synova_brain.generate_response(request.prompt)
        
        return ChatResponse(
            response=brain_response,
            tier="synova-brain-v3.2",
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or f"brain_{datetime.now().timestamp()}"
        )
        
    except Exception as e:
        print(f"Synova Brain error: {e}")
        return ChatResponse(
            response="I apologize, but I'm experiencing technical difficulties. Please try again.",
            tier="synova-brain-v3.2",
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or "error"
        )
