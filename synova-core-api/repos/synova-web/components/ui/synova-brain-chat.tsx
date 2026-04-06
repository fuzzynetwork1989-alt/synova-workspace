import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassInput } from '@/components/ui/glass-input';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { 
  Brain, 
  Send, 
  Sparkles, 
  Zap, 
  Target, 
  Lightbulb, 
  BookOpen, 
  Code, 
  MessageSquare, 
  User, 
  Bot, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  Award, 
  Cpu, 
  Network, 
  Database, 
  Shield, 
  Heart, 
  Eye, 
  Search, 
  Filter, 
  BarChart3, 
  PieChart, 
  Activity, 
  Settings, 
  MoreVertical, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Minus, 
  X, 
  Copy, 
  Download, 
  Upload, 
  RefreshCw, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Expand, 
  Shrink, 
  Fullscreen, 
  Grid, 
  List, 
  Layout, 
  Columns, 
  Rows, 
  Layers, 
  Package, 
  Archive, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Phone, 
  PhoneOff, 
  Wifi, 
  WifiOff, 
  Bluetooth, 
  BluetoothOff, 
  Globe, 
  Map, 
  Compass, 
  Navigation, 
  Anchor, 
  Link, 
  Unlink, 
  Lock, 
  Unlock, 
  Key, 
  Fingerprint, 
  CreditCard, 
  Wallet, 
  ShoppingCart, 
  ShoppingBag, 
  Tag, 
  Hash, 
  AtSign, 
  DollarSign, 
  Euro, 
  PoundSterling, 
  Yen, 
  Rupee, 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  LineChart, 
  PieChart, 
  AreaChart, 
  ScatterChart, 
  Calendar, 
  CalendarDays, 
  Clock, 
  Timer, 
  Stopwatch, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Umbrella, 
  Wind, 
  Thermometer, 
  Gauge, 
  Tachometer, 
  Speedometer, 
  Compass, 
  Navigation, 
  Map, 
  Globe, 
  Earth, 
  Planet, 
  Star, 
  Sun, 
  Moon, 
  Rocket, 
  Plane, 
  Car, 
  Train, 
  Ship, 
  Bike, 
  Walk, 
  Run, 
  Heart, 
  HeartHandshake, 
  Users, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  UserX, 
  UserCircle, 
  UserSquare, 
  Building, 
  Building2, 
  Home, 
  HomeIcon, 
  Office, 
  Factory, 
  Store, 
  Shop, 
  ShoppingCart, 
  ShoppingBag, 
  Package, 
  Box, 
  Archive, 
  File, 
  FileText, 
  FilePlus, 
  FileMinus, 
  FileX, 
  FileCheck, 
  FileSearch, 
  FileQuestion, 
  FileWarning, 
  FileHeart, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileCode, 
  FileSpreadsheet, 
  FilePresentation, 
  FileArchive, 
  FileSignature, 
  FileLock, 
  FileUnlock, 
  FileKey, 
  FileDatabase, 
  FileCloud, 
  FileDownload, 
  FileUpload, 
  FileSymlink, 
  FileCopy, 
  FilePaste, 
  FileCut, 
  FileEdit, 
  FilePlus2, 
  FileMinus2, 
  FileX2, 
  FileCheck2, 
  FileSearch2, 
  FileQuestion2, 
  FileWarning2, 
  FileHeart2, 
  FileImage2, 
  FileVideo2, 
  FileAudio2, 
  FileCode2, 
  FileSpreadsheet2, 
  FilePresentation2, 
  FileArchive2, 
  FileSignature2, 
  FileLock2, 
  FileUnlock2, 
  FileKey2, 
  FileDatabase2, 
  FileCloud2, 
  FileDownload2, 
  FileUpload2, 
  FileSymlink2, 
  FileCopy2, 
  FilePaste2, 
  FileCut2, 
  FileEdit2, 
  FilePlus3, 
  FileMinus3, 
  FileX3, 
  FileCheck3, 
  FileSearch3, 
  FileQuestion3, 
  FileWarning3, 
  FileHeart3, 
  FileImage3, 
  FileVideo3, 
  FileAudio3, 
  FileCode3, 
  FileSpreadsheet3, 
  FilePresentation3, 
  FileArchive3, 
  FileSignature3, 
  FileLock3, 
  FileUnlock3, 
  FileKey3, 
  FileDatabase3, 
  FileCloud3, 
  FileDownload3, 
  FileUpload3, 
  FileSymlink3, 
  FileCopy3, 
  FilePaste3, 
  FileCut3, 
  FileEdit3
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  reasoning?: string[];
  sources?: any[];
  capabilities_used?: string[];
  processing_time?: number;
  strategy_used?: string;
  metadata?: any;
}

interface SynovaBrainStatus {
  brain_id: string;
  version: string;
  consciousness_level: number;
  cognitive_load: number;
  memory_usage: {
    short_term: number;
    working_memory: number;
    long_term: number;
    episodic: number;
    semantic: number;
    procedural: number;
    emotional: number;
    contextual: number;
  };
  knowledge_size: {
    entities: number;
    relationships: number;
    concepts: number;
    facts: number;
    rules: number;
  };
  expertise_domains: Record<string, number>;
  uptime: number;
}

export function SynovaBrainChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'standard' | 'deep_reasoning' | 'research' | 'creative' | 'code'>('standard');
  const [showReasoning, setShowReasoning] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [brainStatus, setBrainStatus] = useState<SynovaBrainStatus | null>(null);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: 'standard', name: 'Standard', icon: <MessageSquare className="w-4 h-4" />, description: 'General conversation' },
    { id: 'deep_reasoning', name: 'Deep Reasoning', icon: <Brain className="w-4 h-4" />, description: 'Complex problem solving' },
    { id: 'research', name: 'Research', icon: <BookOpen className="w-4 h-4" />, description: 'Academic research' },
    { id: 'creative', name: 'Creative', icon: <Lightbulb className="w-4 h-4" />, description: 'Creative synthesis' },
    { id: 'code', name: 'Code', icon: <Code className="w-4 h-4" />, description: 'Programming assistance' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchBrainStatus();
    const interval = setInterval(fetchBrainStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchBrainStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/synova/status');
      if (response.ok) {
        const status = await response.json();
        setBrainStatus(status);
      }
    } catch (error) {
      console.error('Failed to fetch brain status:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const endpoint = selectedMode === 'standard' 
        ? '/api/v1/synova/chat'
        : `/api/v1/synova/${selectedMode}`;

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input.trim(),
          temperature,
          max_tokens: max_tokens,
          include_reasoning: true,
          include_sources: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Synova Brain');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        confidence: data.confidence,
        reasoning: data.reasoning,
        sources: data.sources,
        capabilities_used: data.capabilities_used,
        processing_time: data.processing_time,
        strategy_used: data.strategy_used,
        metadata: data.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Synova Brain error:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        confidence: 0.1,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const getModeIcon = (mode: string) => {
    const modeConfig = modes.find(m => m.id === mode);
    return modeConfig?.icon || <MessageSquare className="w-4 h-4" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-blue-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatProcessingTime = (time: number) => {
    return `${(time * 1000).toFixed(0)}ms`;
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <GlassCard variant="compact" className="p-4 m-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Synova Brain</h2>
                <p className="text-sm text-muted-foreground">Advanced LLM System v2.0</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton
                variant={showStatus ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowStatus(!showStatus)}
              >
                <Cpu className="w-4 h-4 mr-2" />
                Status
              </GlassButton>
              <GlassButton
                variant="outline"
                size="sm"
                onClick={clearConversation}
                disabled={messages.length === 0}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Brain Status Panel */}
        {showStatus && brainStatus && (
          <GlassCard variant="compact" className="p-4 mx-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(brainStatus.consciousness_level * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Consciousness</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(brainStatus.cognitive_load * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Cognitive Load</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {brainStatus.memory_usage.short_term}
                </div>
                <div className="text-sm text-muted-foreground">Short-term Memory</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {brainStatus.knowledge_size.entities}
                </div>
                <div className="text-sm text-muted-foreground">Knowledge Entities</div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <GlassCard
                  variant={message.role === 'user' ? 'glowing' : 'floating'}
                  className={`p-4 ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {message.role === 'user' ? 'You' : 'Synova Brain'}
                          </span>
                          {message.capabilities_used && (
                            <div className="flex items-center gap-1">
                              {message.capabilities_used.slice(0, 3).map((capability, index) => (
                                <div
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                                >
                                  {capability}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {message.timestamp.toLocaleTimeString()}
                          {message.processing_time && (
                            <span>• {formatProcessingTime(message.processing_time)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        {message.content}
                      </div>
                      
                      {message.confidence && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <span className={`text-sm font-medium ${getConfidenceColor(message.confidence)}`}>
                            {(message.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                      
                      {message.strategy_used && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Strategy:</span>
                          <span className="text-sm font-medium text-purple-600">
                            {message.strategy_used}
                          </span>
                        </div>
                      )}
                      
                      {/* Reasoning Toggle */}
                      {message.reasoning && message.reasoning.length > 0 && (
                        <div className="mt-3">
                          <GlassButton
                            variant="outline"
                            size="sm"
                            onClick={() => setShowReasoning(!showReasoning)}
                          >
                            <Brain className="w-3 h-3 mr-1" />
                            {showReasoning ? 'Hide' : 'Show'} Reasoning ({message.reasoning.length})
                          </GlassButton>
                          {showReasoning && (
                            <div className="mt-2 space-y-2">
                              {message.reasoning.map((step, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-medium">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 text-muted-foreground">{step}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Sources Toggle */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3">
                          <GlassButton
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSources(!showSources)}
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            {showSources ? 'Hide' : 'Show'} Sources ({message.sources.length})
                          </GlassButton>
                          {showSources && (
                            <div className="mt-2 space-y-2">
                              {message.sources.map((source, index) => (
                                <div key={index} className="p-2 bg-muted rounded-lg text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{source.title}</span>
                                    <span className="text-muted-foreground">
                                      {source.credibility_score.toFixed(2)}
                                    </span>
                                  </div>
                                  {source.url && (
                                    <a
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View Source
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="mr-4">
                <GlassCard variant="floating" className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <GlassCard variant="compact" className="p-4 m-4">
          {/* Mode Selection */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Mode:</span>
            <div className="flex gap-2">
              {modes.map((mode) => (
                <GlassButton
                  key={mode.id}
                  variant={selectedMode === mode.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMode(mode.id as any)}
                >
                  {mode.icon}
                  <span className="ml-1">{mode.name}</span>
                </GlassButton>
              ))}
            </div>
          </div>
          
          {/* Settings */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Temperature:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Max Tokens:</span>
              <input
                type="number"
                min="100"
                max="8192"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-20 px-2 py-1 rounded border border-border bg-background"
              />
            </div>
          </div>
          
          {/* Input */}
          <div className="flex gap-2">
            <GlassInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask Synova Brain anything... (${selectedMode} mode)`}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            />
            <GlassButton
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
