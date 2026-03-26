import React, { useState, useEffect, useRef } from 'react';
import { SynovaBrainLLM } from './synova-brain-llm-wrapper-production';

const EnhancedSynovaChat = ({ 
  apiUrl = 'https://synova-ai-production.up.railway.app',
  className = '',
  placeholder = 'Ask Enhanced Synova Brain anything...',
  maxTokens = 2000,
  temperature = 0.7,
  showReasoning = false,
  enableMemory = true,
  enableFunctionCalling = true,
  enableMultimodal = true,
  enableCodeGeneration = true
}) => {
  const [llm] = useState(() => new SynovaBrainLLM(apiUrl));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState(null);
  const [conversationMode, setConversationMode] = useState('chat'); // chat, reasoning, blueprint, code, multimodal
  const [healthStatus, setHealthStatus] = useState('checking');
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Health check on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await llm.healthCheck();
        setHealthStatus('healthy');
      } catch (error) {
        setHealthStatus('unhealthy');
        console.error('Health check failed:', error);
      }
    };
    checkHealth();
  }, [llm]);

  // Handle streaming response
  const handleStreamingResponse = async (prompt, options = {}) => {
    setIsStreaming(true);
    setStreamingMessage('');
    setError(null);

    try {
      const stream = llm.generateStream(prompt, options);
      
      for await (const chunk of stream) {
        if (chunk.choices?.[0]?.delta?.content) {
          setStreamingMessage(prev => prev + chunk.choices[0].delta.content);
        }
      }

      // Add complete message to conversation
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: streamingMessage,
        timestamp: new Date().toISOString(),
        mode: conversationMode
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch (error) {
      setError(error.message);
      console.error('Streaming error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  // Handle function calling
  const handleFunctionCall = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await llm.functionCall(prompt);
      
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: result.choices[0]?.message?.content || 'Function executed',
        functionCall: result.function_call,
        type: result.type,
        timestamp: new Date().toISOString(),
        mode: 'function'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError(error.message);
      console.error('Function call error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle blueprint generation
  const handleBlueprintGeneration = async (blueprintType, parameters) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await llm.generateBlueprint(blueprintType, parameters);
      
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `Generated ${blueprintType} blueprint`,
        blueprint: result,
        timestamp: new Date().toISOString(),
        mode: 'blueprint'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError(error.message);
      console.error('Blueprint generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle code generation
  const handleCodeGeneration = async (prompt, language = 'javascript') => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await llm.generateCode(prompt, language);
      
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: result.code,
        explanation: result.explanation,
        language: result.language,
        timestamp: new Date().toISOString(),
        mode: 'code'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError(error.message);
      console.error('Code generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle advanced reasoning
  const handleReasoning = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await llm.reason(prompt);
      
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: result.conclusion,
        reasoningSteps: result.reasoning_steps,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
        mode: 'reasoning'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError(error.message);
      console.error('Reasoning error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle multimodal analysis
  const handleMultimodalAnalysis = async (text, images) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await llm.analyzeMultimodal(text, images);
      
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: result.text_analysis || 'Analysis complete',
        imageAnalysis: result.image_analysis,
        timestamp: new Date().toISOString(),
        mode: 'multimodal'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError(error.message);
      console.error('Multimodal analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      mode: conversationMode
    };

    setMessages(prev => [...prev, userMessage]);
    const prompt = input.trim();
    setInput('');

    // Route to appropriate handler based on mode
    switch (conversationMode) {
      case 'function':
        await handleFunctionCall(prompt);
        break;
      case 'reasoning':
        await handleReasoning(prompt);
        break;
      case 'code':
        await handleCodeGeneration(prompt);
        break;
      case 'multimodal':
        await handleMultimodalAnalysis(prompt, []);
        break;
      case 'blueprint':
        await handleBlueprintGeneration('modern', { description: prompt });
        break;
      default:
        await handleStreamingResponse(prompt);
    }
  };

  // Handle file upload for multimodal
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle image files for multimodal analysis
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Process image for multimodal analysis
          console.log('Image loaded for multimodal analysis');
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Stop streaming
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    llm.stopStreaming();
    setIsStreaming(false);
    setStreamingMessage('');
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    llm.clearHistory();
    setError(null);
  };

  // Render message based on mode
  const renderMessage = (message) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-3xl p-4 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs opacity-75">
              {isUser ? 'You' : 'Enhanced Synova Brain'}
            </span>
            <span className="text-xs opacity-50">
              {message.mode && `(${message.mode})`}
            </span>
          </div>
          
          {/* Regular message content */}
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Reasoning steps */}
          {message.reasoningSteps && (
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold text-sm mb-2">Reasoning Steps:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {message.reasoningSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              {message.confidence && (
                <div className="mt-2 text-xs text-gray-600">
                  Confidence: {Math.round(message.confidence * 100)}%
                </div>
              )}
            </div>
          )}

          {/* Code display */}
          {message.language && message.code && (
            <div className="mt-3">
              <div className="text-xs font-semibold mb-1">
                {message.language.toUpperCase()}
              </div>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                <code>{message.code}</code>
              </pre>
              {message.explanation && (
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Explanation:</strong> {message.explanation}
                </div>
              )}
            </div>
          )}

          {/* Function call results */}
          {message.functionCall && (
            <div className="mt-3 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <h4 className="font-semibold text-sm mb-2">
                Function Call: {message.functionCall.name}
              </h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(message.functionCall.arguments, null, 2)}
              </pre>
            </div>
          )}

          {/* Blueprint results */}
          {message.blueprint && (
            <div className="mt-3 p-3 bg-purple-50 rounded border-l-4 border-purple-500">
              <h4 className="font-semibold text-sm mb-2">
                Generated Blueprint
              </h4>
              <div className="text-sm">
                <strong>ID:</strong> {message.blueprint.blueprint_id}
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto max-h-40">
                {JSON.stringify(message.blueprint, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-xs opacity-50 mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`enhanced-synova-chat ${className}`}>
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              healthStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <h3 className="text-lg font-semibold">Enhanced Synova Brain</h3>
            <span className="text-sm text-gray-500">v3.2</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Mode selector */}
            <select
              value={conversationMode}
              onChange={(e) => setConversationMode(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="chat">💬 Chat</option>
              <option value="reasoning">🧠 Reasoning</option>
              <option value="function">🔧 Function Call</option>
              <option value="code">💻 Code</option>
              <option value="blueprint">🏗️ Blueprint</option>
              {enableMultimodal && (
                <option value="multimodal">🖼️ Multimodal</option>
              )}
            </select>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ⚙️
            </button>
            
            <button
              onClick={clearConversation}
              className="p-2 hover:bg-gray-100 rounded"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="border-b p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => {/* Handle max tokens change */}}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={temperature}
                onChange={(e) => {/* Handle temperature change */}}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(renderMessage)}
        
        {/* Streaming message */}
        {isStreaming && streamingMessage && (
          <div className="flex justify-start mb-4">
            <div className="max-w-3xl p-4 rounded-lg bg-gray-100 text-gray-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-75">Enhanced Synova Brain</span>
                <button
                  onClick={stopStreaming}
                  className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Stop
                </button>
              </div>
              <div className="whitespace-pre-wrap">
                {streamingMessage}
                <span className="animate-pulse">▊</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && !isStreaming && (
          <div className="flex justify-start mb-4">
            <div className="p-4 rounded-lg bg-gray-100">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="flex justify-start mb-4">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          {/* File upload for multimodal */}
          {conversationMode === 'multimodal' && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          )}
          
          {conversationMode === 'multimodal' && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 border rounded hover:bg-gray-50"
            >
              📎
            </button>
          )}
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading || isStreaming}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isStreaming}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? '⏹️' : '🚀'}
          </button>
        </div>
        
        {/* Mode hints */}
        <div className="mt-2 text-xs text-gray-500">
          {conversationMode === 'reasoning' && '🧠 Advanced reasoning mode - step-by-step analysis'}
          {conversationMode === 'function' && '🔧 Function calling mode - automatic blueprint generation'}
          {conversationMode === 'code' && '💻 Code generation mode - React/JS/Python components'}
          {conversationMode === 'blueprint' && '🏗️ Blueprint generation mode - architectural designs'}
          {conversationMode === 'multimodal' && '🖼️ Multimodal mode - image + text analysis'}
          {conversationMode === 'chat' && '💬 Chat mode - real-time streaming responses'}
        </div>
      </form>
    </div>
  );
};

export default EnhancedSynovaChat;
