/**
 * Synova Brain LLM Wrapper
 * Drop-in replacement for OpenAI, Claude, and other LLM providers
 */

class SynovaBrainLLM {
  constructor(apiUrl = 'https://synova-core-api-production.up.railway.app') {
    this.apiUrl = apiUrl;
    this.tier = 'synova-brain-v3.2';
  }

  async chat(options) {
    const {
      messages,
      temperature = 0.7,
      max_tokens = 150,
      session_id = null
    } = options;

    // Extract latest user message
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    try {
      const response = await fetch(`${this.apiUrl}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tier: this.tier,
          session_id: session_id || `llm_${Date.now()}`
        })
      });

      const data = await response.json();
      
      // Return OpenAI-compatible response format
      return {
        choices: [{
          message: {
            content: data.response,
            role: 'assistant'
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: prompt.length,
          completion_tokens: data.response.length,
          total_tokens: prompt.length + data.response.length
        },
        model: 'synova-brain-v3.2',
        created: Math.floor(Date.now() / 1000)
      };
    } catch (error) {
      throw new Error(`Synova Brain API Error: ${error.message}`);
    }
  }

  async completions(options) {
    const { prompt, ...rest } = options;
    
    // Convert to chat format
    const messages = [{ role: 'user', content: prompt }];
    return this.chat({ messages, ...rest });
  }

  async generateBlueprint(blueprintType, parameters = {}, voiceCommand = null) {
    try {
      const response = await fetch(`${this.apiUrl}/ai/blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint_type: blueprintType,
          parameters,
          voice_command: voiceCommand
        })
      });

      return response.json();
    } catch (error) {
      throw new Error(`Blueprint generation failed: ${error.message}`);
    }
  }

  // WebSocket connection for real-time chat
  connectWebSocket(onMessage, onError) {
    const ws = new WebSocket(`${this.apiUrl.replace('http', 'ws')}/ws`);
    
    ws.onopen = () => {
      console.log('🧠 Connected to Synova Brain WebSocket');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    return ws;
  }

  // Enhanced streaming capabilities
  async streamChat(options) {
    const {
      messages,
      temperature = 0.7,
      max_tokens = 150,
      session_id = null
    } = options;

    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    try {
      const response = await fetch(`${this.apiUrl}/ai/generate/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tier: this.tier,
          session_id: session_id || `stream_${Date.now()}`
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        if (chunk.startsWith('data: ')) {
          const data = JSON.parse(chunk.slice(6));
          
          if (data.type === 'chunk') {
            chunks.push(data.content);
            fullResponse += data.content;
            // Yield streaming chunk
            if (options.onChunk) {
              options.onChunk(data.content);
            }
          } else if (data.type === 'completion') {
            // Return final response
            return {
              choices: [{
                message: {
                  content: fullResponse,
                  role: 'assistant'
                },
                finish_reason: 'stop'
              }],
              usage: data.usage || {
                prompt_tokens: prompt.length,
                completion_tokens: fullResponse.length,
                total_tokens: prompt.length + fullResponse.length
              },
              model: 'synova-brain-v3.2',
              created: Math.floor(Date.now() / 1000),
              chunks: chunks
            };
          }
        }
      }
    } catch (error) {
      throw new Error(`Streaming failed: ${error.message}`);
    }
  }

  // Function calling capabilities
  async functionCall(prompt) {
    try {
      const response = await fetch(`${this.apiUrl}/ai/function-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tier: this.tier
        })
      });

      const result = await response.json();
      
      if (result.type === 'function_call') {
        return {
          type: 'function_call',
          function: result.function,
          arguments: result.arguments
        };
      }
      
      return result;
    } catch (error) {
      throw new Error(`Function calling failed: ${error.message}`);
    }
  }

  // Multimodal capabilities
  async multimodal(text, images = []) {
    try {
      const response = await fetch(`${this.apiUrl}/ai/multimodal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          images,
          tier: this.tier
        })
      });

      return response.json();
    } catch (error) {
      throw new Error(`Multimodal analysis failed: ${error.message}`);
    }
  }

  // Code generation
  async generateCode(prompt, language = 'javascript') {
    try {
      const response = await fetch(`${this.apiUrl}/ai/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language,
          tier: this.tier
        })
      });

      return response.json();
    } catch (error) {
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  // Advanced reasoning
  async reasoning(prompt, context = {}) {
    try {
      const response = await fetch(`${this.apiUrl}/ai/reasoning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context,
          tier: this.tier
        })
      });

      return response.json();
    } catch (error) {
      throw new Error(`Advanced reasoning failed: ${error.message}`);
    }
  }

  // Conversation memory
  async memory(messages) {
    try {
      const response = await fetch(`${this.apiUrl}/ai/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          tier: this.tier
        })
      });

      return response.json();
    } catch (error) {
      throw new Error(`Memory analysis failed: ${error.message}`);
    }
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SynovaBrainLLM;
}

// ES6 export
if (typeof window !== 'undefined') {
  window.SynovaBrainLLM = SynovaBrainLLM;
}
