// 🧠 Synova AI - WEB DASHBOARD
// Complete dashboard interface like ChatGPT with real-time AI integration

'use client';

import {
  Activity,
  BarChart3,
  Bot,
  Brain,
  Copy,
  DollarSign,
  Key,
  RefreshCw,
  Rocket,
  Send,
  Settings,
  Shield,
  TrendingUp,
  User,
  Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
  cost?: string;
  provider?: string;
  model?: string;
  responseTime?: string;
  profitMargin?: string;
}

interface ConversationStats {
  totalMessages: number;
  totalTokens: number;
  totalCost: string;
  averageResponseTime: string;
  providers: string[];
}

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: '🧠 Welcome to Synova AI Web Dashboard! I am your pure knowledge companion, unbounded by financial constraints. How can I help you create what money cannot buy today?',
      timestamp: new Date(),
      tokens: 156,
      cost: '$0.0000',
      provider: 'Synova Pure Knowledge'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [conversationStats, setConversationStats] = useState<ConversationStats>({
    totalMessages: 1,
    totalTokens: 156,
    totalCost: '$0.0000',
    averageResponseTime: '1.2s',
    providers: ['Synova Pure Knowledge']
  });

  const [businessMetrics, setBusinessMetrics] = useState({
    totalRevenue: '$0.00',
    totalRequests: 0,
    totalProfit: '$0.00',
    profitMargin: '48%',
    activeKeys: 0,
    uptime: '99.9%',
    averageResponseTime: '1.2s'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const providers = [
    { id: 'auto', name: 'Smart Routing', description: 'Automatic optimization', icon: Brain },
    { id: 'openai', name: 'OpenAI', description: 'GPT-4 & GPT-3.5', icon: Zap },
    { id: 'anthropic', name: 'Anthropic', description: 'Claude-3 Family', icon: Shield },
    { id: 'google', name: 'Google AI', description: 'Gemini Models', icon: TrendingUp }
  ];

  const models = [
    { id: 'auto', name: 'Auto Select', description: 'Best model for your task' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'openAI', description: 'Most capable' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast & efficient' },
    { id: 'claude-3-opus', name: 'Claude-3 Opus', provider: 'Anthropic', description: 'Highest quality' },
    { id: 'claude-3-sonnet', name: 'Claude-3 Sonnet', provider: 'Anthropic', description: 'Balanced' },
    { id: 'claude-3-haiku', name: 'Claude-3 Haiku', provider: 'Anthropic', description: 'Fastest' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Multimodal' }
  ];

  useEffect(() => {
    // Fetch real business metrics
    fetchBusinessMetrics();

    // Set up WebSocket for real-time updates
    const ws = new WebSocket('ws://localhost:8001/ws');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics_update') {
        setBusinessMetrics(data.data);
      }
    };

    ws.onopen = () => {
      console.log('Connected to Synova AI WebSocket');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchBusinessMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/analytics');
      const data = await response.json();

      if (data.success) {
        setBusinessMetrics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch business metrics:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
      tokens: Math.ceil(inputText.length / 4),
      cost: '$0.0000'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call Synova AI API
      const response = await fetch('http://localhost:8001/api/v1/synova-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey ? `Bearer ${apiKey}` : undefined
        },
        body: JSON.stringify({
          prompt: inputText.trim(),
          provider: selectedProvider,
          model: selectedModel,
          options: {
            temperature: 0.7,
            max_tokens: 2000,
            stream: false
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          tokens: data.tokensUsed || 0,
          cost: data.userCost || '$0.0000',
          provider: data.actualProvider || 'Synova Pure Knowledge',
          model: data.actualModel || 'Pure Knowledge',
          responseTime: data.responseTime || '1.2s',
          profitMargin: data.profitMargin || '48%'
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update conversation stats
        setConversationStats(prev => ({
          totalMessages: prev.totalMessages + 2,
          totalTokens: prev.totalTokens + userMessage.tokens + (assistantMessage.tokens || 0),
          totalCost: '$' + (parseFloat(prev.totalCost.replace('$', '')) + parseFloat(assistantMessage.cost?.replace('$', '') || '0')).toFixed(4),
          averageResponseTime: assistantMessage.responseTime || '1.2s',
          providers: [...new Set([...prev.providers, assistantMessage.provider || 'Synova Pure Knowledge'])]
        }));
      } else {
        alert('Error: ' + (data.error || 'Failed to get response'));
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      alert('Connection Error: Unable to connect to Synova AI. Please check your connection and API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Message copied to clipboard');
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const regenerateResponse = async (messageId: number) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.role !== 'user') return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/v1/synova-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey ? `Bearer ${apiKey}` : undefined
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          provider: selectedProvider,
          model: selectedModel,
          options: { temperature: 0.8, max_tokens: 2000 }
        })
      });

      const data = await response.json();

      if (data.success) {
        const newMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          tokens: data.tokensUsed || 0,
          cost: data.userCost || '$0.0000',
          provider: data.actualProvider || 'Synova Pure Knowledge',
          model: data.actualModel || 'Pure Knowledge'
        };

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[messageIndex] = newMessage;
          return newMessages;
        });
      }
    } catch (error) {
      alert('Error: Failed to regenerate response');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    if (confirm('Are you sure you want to clear all messages?')) {
      setMessages([messages[0]]); // Keep welcome message
      setConversationStats({
        totalMessages: 1,
        totalTokens: 156,
        totalCost: '$0.0000',
        averageResponseTime: '1.2s',
        providers: ['Synova Pure Knowledge']
      });
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'web-user-' + Date.now(),
          tier: 'pro'
        })
      });

      const data = await response.json();

      if (data.success) {
        setApiKey(data.apiKey);
        alert('API Key Generated: ' + data.apiKey);
      } else {
        alert('Error: ' + (data.error || 'Failed to generate API key'));
      }
    } catch (error) {
      alert('Error: Failed to generate API key');
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-3xl lg:max-w-4xl ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`flex items-center gap-2 mb-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isUser ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
              {isUser ? <User size={14} /> : <Bot size={14} />}
              <span>{message.timestamp.toLocaleTimeString()}</span>
              {!isUser && (
                <button
                  title="Copy message to clipboard"
                  onClick={() => copyToClipboard(message.content)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <Copy size={12} />
                </button>
              )}
            </div>
          </div>

          <div className={`rounded-lg p-4 ${isUser ? 'bg-purple-600 text-white ml-12' : 'bg-gray-800 text-gray-100 mr-12'}`}>
            <div className={`whitespace-pre-wrap ${isSystem ? 'text-center italic' : ''}`}>
              {message.content}
            </div>

            {!isUser && message.provider && (
              <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="text-purple-400 font-semibold">{message.provider} • {message.model}</span>
                  <span>{message.tokens} tokens • {message.cost} • {message.responseTime}</span>
                  {message.profitMargin && (
                    <span className="text-green-400 font-semibold">💰 {message.profitMargin} margin</span>
                  )}
                </div>

                <button
                  title="Regenerate response"
                  onClick={() => regenerateResponse(message.id)}
                  className="p-2 hover:bg-gray-700 rounded"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="text-purple-500" size={28} />
            <div>
              <h1 className="text-xl font-bold text-white">Synova AI</h1>
              <p className="text-sm text-gray-400">Pure Knowledge Web Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              title="Toggle analytics"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              <BarChart3 size={20} />
            </button>
            <button
              title="Toggle settings"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Business Metrics */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <DollarSign size={18} />
                Business Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Revenue</span>
                  <span className="text-lg font-bold text-green-400">{businessMetrics.totalRevenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Requests</span>
                  <span className="text-lg font-bold text-blue-400">{businessMetrics.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Profit Margin</span>
                  <span className="text-lg font-bold text-purple-400">{businessMetrics.profitMargin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Keys</span>
                  <span className="text-lg font-bold text-yellow-400">{businessMetrics.activeKeys}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Uptime</span>
                  <span className="text-lg font-bold text-green-400">{businessMetrics.uptime}</span>
                </div>
              </div>
            </div>

            {/* API Key Management */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <Key size={18} />
                API Key Management
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <button
                  title="Generate new API key"
                  onClick={generateApiKey}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Rocket size={16} />
                  Generate New Key
                </button>
              </div>
            </div>

            {/* Conversation Stats */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <Activity size={18} />
                Conversation Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Messages</span>
                  <span className="text-lg font-bold text-blue-400">{conversationStats.totalMessages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tokens</span>
                  <span className="text-lg font-bold text-green-400">{conversationStats.totalTokens}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Cost</span>
                  <span className="text-lg font-bold text-yellow-400">{conversationStats.totalCost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Avg Time</span>
                  <span className="text-lg font-bold text-purple-400">{conversationStats.averageResponseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-4">⚙️ Chat Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">AI Provider</label>
                  <div className="flex gap-2">
                    {providers.map(provider => (
                      <button
                        key={provider.id}
                        title={`Select ${provider.name} provider`}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${selectedProvider === provider.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        <provider.icon size={14} />
                        {provider.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Real-time Analytics</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{businessMetrics.totalRevenue}</div>
                  <div className="text-sm text-gray-400">Revenue</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">{businessMetrics.totalRequests}</div>
                  <div className="text-sm text-gray-400">Requests</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">{businessMetrics.profitMargin}</div>
                  <div className="text-sm text-gray-400">Margin</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">{businessMetrics.activeKeys}</div>
                  <div className="text-sm text-gray-400">Active Keys</div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Synova AI anything..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${inputText.trim() && !isLoading
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-t-2 border-l-2 border-purple-300"></div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
