// 🧠 Synova AI - ENHANCED CHAT INTERFACE
// Complete chat interface like ChatGPT with real-time AI integration

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Clipboard
} from 'react-native';
import {
  Send,
  Bot,
  User,
  Copy,
  RefreshCw,
  Settings,
  Zap,
  Brain,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react-native';
import { PURE_KNOWLEDGE_COLORS } from '../../components/PureKnowledgeTheme';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '🧠 Welcome to Synova AI! I am your pure knowledge companion, unbounded by financial constraints. How can I help you create what money cannot buy today?',
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
  const [conversationStats, setConversationStats] = useState({
    totalMessages: 1,
    totalTokens: 156,
    totalCost: '$0.0000',
    averageResponseTime: '1.2s',
    providers: ['Synova Pure Knowledge']
  });
  
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);

  const providers = [
    { id: 'auto', name: 'Smart Routing', description: 'Automatic optimization', icon: Brain },
    { id: 'openai', name: 'OpenAI', description: 'GPT-4 & GPT-3.5', icon: Zap },
    { id: 'anthropic', name: 'Anthropic', description: 'Claude-3 Family', icon: Shield },
    { id: 'google', name: 'Google AI', description: 'Gemini Models', icon: TrendingUp }
  ];

  const models = [
    { id: 'auto', name: 'Auto Select', description: 'Best model for your task' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'openai', description: 'Most capable' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', description: 'Fast & efficient' },
    { id: 'claude-3-opus', name: 'Claude-3 Opus', provider: 'anthropic', description: 'Highest quality' },
    { id: 'claude-3-sonnet', name: 'Claude-3 Sonnet', provider: 'anthropic', description: 'Balanced' },
    { id: 'claude-3-haiku', name: 'Claude-3 Haiku', provider: 'anthropic', description: 'Fastest' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google', description: 'Multimodal' }
  ];

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
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

    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

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
        const assistantMessage = {
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
          totalTokens: prev.totalTokens + userMessage.tokens + assistantMessage.tokens,
          totalCost: '$' + (parseFloat(prev.totalCost.replace('$', '')) + parseFloat(assistantMessage.cost.replace('$', ''))).toFixed(4),
          averageResponseTime: assistantMessage.responseTime,
          providers: [...new Set([...prev.providers, assistantMessage.provider])]
        }));
      } else {
        Alert.alert('Error', data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      Alert.alert('Connection Error', 'Unable to connect to Synova AI. Please check your connection and API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setString(text);
      Alert.alert('Copied', 'Message copied to clipboard');
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const regenerateResponse = async (messageId) => {
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
        const newMessage = {
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
      Alert.alert('Error', 'Failed to regenerate response');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setMessages([messages[0]]); // Keep welcome message
            setConversationStats({
              totalMessages: 1,
              totalTokens: 156,
              totalCost: '$0.0000',
              averageResponseTime: '1.2s',
              providers: ['Synova Pure Knowledge']
            });
          }
        }
      ]
    );
  };

  const renderMessage = (message) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage,
        isSystem ? styles.systemMessage : null
      ]}>
        <View style={styles.messageHeader}>
          {isUser ? (
            <User size={16} color={PURE_KNOWLEDGE_COLORS.text} />
          ) : (
            <Bot size={16} color={PURE_KNOWLEDGE_COLORS.primary} />
          )}
          <Text style={styles.messageTime}>
            {message.timestamp.toLocaleTimeString()}
          </Text>
          {!isUser && (
            <TouchableOpacity onPress={() => copyToClipboard(message.content)}>
              <Copy size={14} color={PURE_KNOWLEDGE_COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={[
          styles.messageContent,
          isSystem ? styles.systemContent : null
        ]}>
          {message.content}
        </Text>

        {!isUser && message.provider && (
          <View style={styles.messageMeta}>
            <View style={styles.providerInfo}>
              <Text style={styles.providerText}>
                {message.provider} • {message.model}
              </Text>
              <Text style={styles.metaText}>
                {message.tokens} tokens • {message.cost} • {message.responseTime}
              </Text>
              {message.profitMargin && (
                <Text style={styles.profitText}>
                  💰 {message.profitMargin} margin
                </Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.regenerateButton}
              onPress={() => regenerateResponse(message.id)}
            >
              <RefreshCw size={14} color={PURE_KNOWLEDGE_COLORS.secondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Brain size={24} color={PURE_KNOWLEDGE_COLORS.primary} />
          <View>
            <Text style={styles.headerTitle}>Synova AI</Text>
            <Text style={styles.headerSubtitle}>Pure Knowledge Chat</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.statsButton}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Settings size={20} color={PURE_KNOWLEDGE_COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>⚙️ Chat Settings</Text>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter your API key (optional)"
              secureTextEntry
              multiline
            />
          </View>

          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>AI Provider</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {providers.map(provider => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerChip,
                    selectedProvider === provider.id && styles.selectedProvider
                  ]}
                  onPress={() => setSelectedProvider(provider.id)}
                >
                  <provider.icon size={16} color={selectedProvider === provider.id ? PURE_KNOWLEDGE_COLORS.background : PURE_KNOWLEDGE_COLORS.text} />
                  <Text style={[
                    styles.providerChipText,
                    selectedProvider === provider.id && styles.selectedProviderText
                  ]}>
                    {provider.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.conversationStats}>
            <Text style={styles.statsTitle}>📊 Conversation Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{conversationStats.totalMessages}</Text>
                <Text style={styles.statLabel}>Messages</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{conversationStats.totalTokens}</Text>
                <Text style={styles.statLabel}>Tokens</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{conversationStats.totalCost}</Text>
                <Text style={styles.statLabel}>Cost</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{conversationStats.averageResponseTime}</Text>
                <Text style={styles.statLabel}>Avg Time</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask Synova AI anything..."
          placeholderTextColor={PURE_KNOWLEDGE_COLORS.textSecondary}
          multiline
          maxLength={4000}
          textAlignVertical="top"
          onSubmitEditing={sendMessage}
        />
        
        <View style={styles.inputActions}>
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={PURE_KNOWLEDGE_COLORS.background} />
            ) : (
              <Send size={20} color={PURE_KNOWLEDGE_COLORS.background} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: PURE_KNOWLEDGE_COLORS.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PURE_KNOWLEDGE_COLORS.text,
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 12,
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
  },
  settingsPanel: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    margin: 15,
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PURE_KNOWLEDGE_COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  settingGroup: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PURE_KNOWLEDGE_COLORS.text,
    marginBottom: 8,
  },
  apiKeyInput: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    borderWidth: 1,
    borderColor: PURE_KNOWLEDGE_COLORS.primary,
    borderRadius: 8,
    padding: 12,
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  providerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    borderWidth: 1,
    borderColor: PURE_KNOWLEDGE_COLORS.surface,
    marginRight: 8,
  },
  selectedProvider: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.primary,
  },
  providerChipText: {
    fontSize: 12,
    color: PURE_KNOWLEDGE_COLORS.text,
    marginLeft: 6,
  },
  selectedProviderText: {
    color: PURE_KNOWLEDGE_COLORS.background,
  },
  conversationStats: {
    marginTop: 15,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PURE_KNOWLEDGE_COLORS.text,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PURE_KNOWLEDGE_COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
  },
  userMessage: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.primary,
    alignSelf: 'flex-end',
    marginLeft: 60,
  },
  assistantMessage: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    alignSelf: 'flex-start',
    marginRight: 60,
  },
  systemMessage: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    borderWidth: 2,
    borderColor: PURE_KNOWLEDGE_COLORS.primary,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  messageContent: {
    fontSize: 16,
    lineHeight: 24,
    color: PURE_KNOWLEDGE_COLORS.text,
  },
  systemContent: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  messageMeta: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerInfo: {
    flex: 1,
  },
  providerText: {
    fontSize: 12,
    color: PURE_KNOWLEDGE_COLORS.primary,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 11,
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    marginTop: 2,
  },
  profitText: {
    fontSize: 11,
    color: PURE_KNOWLEDGE_COLORS.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  regenerateButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: PURE_KNOWLEDGE_COLORS.background,
  },
  textInput: {
    flex: 1,
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
    color: PURE_KNOWLEDGE_COLORS.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: PURE_KNOWLEDGE_COLORS.surface,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
  },
});

export default ChatInterface;
