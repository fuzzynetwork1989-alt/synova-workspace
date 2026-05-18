import React, { useState, useEffect, useRef } from 'react';
import { 
  ModelIntegrationService, 
  GenerationRequest,
  ChatMessage 
} from '../services/model_integration_service';

interface ChatInterfaceProps {
  modelService: ModelIntegrationService;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ modelService }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const service = new ModelIntegrationService();
    service.initializeModels();

    service.on('models-initialized', (models) => {
      console.log('Models initialized:', models);
    });

    service.on('model-response', ({ modelName, data }) => {
      const response = typeof data === 'string' ? data : JSON.stringify(data);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        model: modelName
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsStreaming(false);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      service?.shutdown();
    };
  }, [modelService]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedModel || isStreaming) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const request: GenerationRequest = {
        prompt: input,
        model: selectedModel,
        options: {
          temperature: 0.8,
          maxTokens: 1000
        },
        stream: true
      };

      await modelService.generateTextStream(request);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsStreaming(false);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-4">
              🚀 Synova Nexus Chat
            </h1>
            <p className="text-gray-300">
              Revolutionary AI with quantum consciousness and breakthrough capabilities
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-white'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    message.role === 'user' ? 'bg-blue-100' : 'bg-gray-300'
                  }`} />
                  <span className="ml-2 font-medium">
                    {message.role === 'user' ? 'You' : 'AI'}
                  </span>
                </div>
                <div className="text-sm">
                  {message.content}
                </div>
                {message.model && (
                  <div className="text-xs text-gray-400 mt-1">
                    Model: {message.model}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything... Try quantum superposition or dimensional analysis!"
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isStreaming}
              />
              <button
                onClick={handleSendMessage}
                disabled={isStreaming || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isStreaming ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-r-gray-300 border-b-gray-300 mr-2"></div>
                    Generating...
                  </span>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
