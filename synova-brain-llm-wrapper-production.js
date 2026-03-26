// Enhanced Synova Brain LLM Wrapper - Production Ready
// Complete integration with Railway backend API

class SynovaBrainLLM {
  constructor(apiUrl = 'https://synova-ai-production.up.railway.app') {
    this.apiUrl = apiUrl;
    this.wsUrl = apiUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws';
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.isStreaming = false;
    this.abortController = null;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Enhanced Generation with OpenAI-Compatible Format
  async generate(prompt, options = {}) {
    const payload = {
      prompt,
      tier: 'synova-brain-v3.2',
      session_id: this.sessionId,
      stream: false,
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update conversation history
      this.conversationHistory.push({
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString()
      });
      
      this.conversationHistory.push({
        role: 'assistant', 
        content: data.response || data.choices?.[0]?.message?.content || '',
        timestamp: new Date().toISOString()
      });

      // Return OpenAI-compatible format
      return {
        choices: [{
          message: {
            content: data.response || data.choices?.[0]?.message?.content || '',
            role: 'assistant'
          }
        }],
        usage: {
          prompt_tokens: data.usage?.prompt_tokens || 10,
          completion_tokens: data.usage?.completion_tokens || 50,
          total_tokens: data.usage?.total_tokens || 60
        },
        model: 'synova-brain-v3.2',
        session_id: this.sessionId
      };
    } catch (error) {
      console.error('Synova Brain generation error:', error);
      throw error;
    }
  }

  // Real-time Streaming Generation
  async *generateStream(prompt, options = {}) {
    if (this.isStreaming) {
      throw new Error('Already streaming');
    }

    this.isStreaming = true;
    this.abortController = new AbortController();

    const payload = {
      prompt,
      tier: 'synova-brain-v3.2',
      session_id: this.sessionId,
      stream: true,
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/generate/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line);
              yield {
                choices: [{
                  delta: {
                    content: chunk.content || chunk.text || ''
                  }
                }],
                usage: chunk.usage || {},
                model: 'synova-brain-v3.2',
                session_id: this.sessionId
              };
            } catch (e) {
              console.warn('Failed to parse chunk:', line);
            }
          }
        }
      }
    } finally {
      this.isStreaming = false;
      this.abortController = null;
    }
  }

  // Function Calling for Blueprint Generation
  async functionCall(prompt, options = {}) {
    const payload = {
      prompt,
      tier: 'synova-brain-v3.2',
      session_id: this.sessionId,
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/function-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        function_call: data.function_call,
        type: data.type,
        result: data.result,
        choices: [{
          message: {
            content: data.response || '',
            function_call: data.function_call
          }
        }],
        usage: data.usage || {},
        model: 'synova-brain-v3.2'
      };
    } catch (error) {
      console.error('Function call error:', error);
      throw error;
    }
  }

  // Blueprint Generation
  async generateBlueprint(blueprintType, parameters = {}) {
    const payload = {
      blueprint_type: blueprintType,
      parameters,
      session_id: this.sessionId
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/blueprint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Blueprint generation error:', error);
      throw error;
    }
  }

  // Code Generation
  async generateCode(prompt, language = 'javascript', options = {}) {
    const payload = {
      prompt,
      language,
      tier: 'synova-brain-v3.2',
      session_id: this.sessionId,
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        code: data.code,
        language: data.language,
        explanation: data.explanation,
        choices: [{
          message: {
            content: data.code || '',
            explanation: data.explanation
          }
        }],
        usage: data.usage || {},
        model: 'synova-brain-v3.2'
      };
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  }

  // Multimodal Analysis
  async analyzeMultimodal(text, images = [], options = {}) {
    const payload = {
      text,
      images,
      tier: 'synova-brain-v3.2',
      session_id: this.sessionId,
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/multimodal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Multimodal analysis error:', error);
      throw error;
    }
  }

  // Advanced Reasoning
  async reason(prompt, options = {}) {
    const payload = {
      prompt,
      tier: 'synova-brain-v3.2',
      session_id: this.sessionId,
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/reasoning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        reasoning_steps: data.reasoning_steps,
        conclusion: data.conclusion,
        confidence: data.confidence,
        choices: [{
          message: {
            content: data.conclusion || '',
            reasoning: data.reasoning_steps
          }
        }],
        usage: data.usage || {},
        model: 'synova-brain-v3.2'
      };
    } catch (error) {
      console.error('Reasoning error:', error);
      throw error;
    }
  }

  // Conversation Memory
  async getMemory(options = {}) {
    const payload = {
      messages: this.conversationHistory,
      tier: 'synova-brain-v3.2',
      session_id: this.sessionId,
      ...options
    };

    try {
      const response = await fetch(`${this.apiUrl}/ai/memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Memory error:', error);
      throw error;
    }
  }

  // WebSocket Connection for Real-time Communication
  connectWebSocket() {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(this.wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connected to Synova Brain');
          resolve(ws);
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
        ws.onclose = () => {
          console.log('WebSocket disconnected');
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('WebSocket message:', data);
          } catch (e) {
            console.warn('Failed to parse WebSocket message:', event.data);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Stop streaming
  stopStreaming() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isStreaming = false;
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
    this.sessionId = this.generateSessionId();
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Detailed health check with performance metrics
  async detailedHealthCheck() {
    try {
      const response = await fetch(`${this.apiUrl}/health/detailed`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Detailed health check error:', error);
      throw error;
    }
  }
}

// Export for use in React components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SynovaBrainLLM;
} else if (typeof window !== 'undefined') {
  window.SynovaBrainLLM = SynovaBrainLLM;
}

// React Hook Integration
export const useSynovaBrain = (apiUrl = 'https://synova-ai-production.up.railway.app') => {
  const [llm] = useState(() => new SynovaBrainLLM(apiUrl));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  const generate = useCallback(async (prompt, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await llm.generate(prompt, options);
      setConversationHistory(llm.getConversationHistory());
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [llm]);

  const generateStream = useCallback(async function* (prompt, options = {}) {
    setIsLoading(true);
    setError(null);
    try {
      yield* llm.generateStream(prompt, options);
      setConversationHistory(llm.getConversationHistory());
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [llm]);

  const clearHistory = useCallback(() => {
    llm.clearHistory();
    setConversationHistory([]);
  }, [llm]);

  return {
    llm,
    generate,
    generateStream,
    clearHistory,
    isLoading,
    error,
    conversationHistory
  };
};
