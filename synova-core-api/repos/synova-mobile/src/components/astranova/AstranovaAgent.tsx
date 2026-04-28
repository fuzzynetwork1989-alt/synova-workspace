import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../ui/theme';

interface AstranovaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model: string;
  tokens_used?: number;
}

interface AstranovaResponse {
  response: string;
  model: string;
  tokens_used: number;
  processing_time: float;
}

export function AstranovaAgent() {
  const [messages, setMessages] = useState<AstranovaMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('astranova-pro');
  const { colors } = useTheme();

  const models = [
    { id: 'astranova-pro', name: 'Astranova Pro', description: 'Advanced reasoning' },
    { id: 'astranova-fast', name: 'Astranova Fast', description: 'Quick responses' },
    { id: 'astranova-creative', name: 'Astranova Creative', description: 'Creative writing' },
  ];

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AstranovaMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      model: model,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/astranova/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input.trim(),
          model: model,
          max_tokens: 4096,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Astranova');
      }

      const data: AstranovaResponse = await response.json();

      const assistantMessage: AstranovaMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
        model: data.model,
        tokens_used: data.tokens_used,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Astranova error:', error);
      
      const errorMessage: AstranovaMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        model: model,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          🤖 Astranova AI Agent
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Advanced AI reasoning system
        </Text>
      </View>

      {/* Model Selection */}
      <View style={[styles.modelSelector, { backgroundColor: colors.card }]}>
        <Text style={[styles.modelLabel, { color: colors.foreground }]}>Model:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {models.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.modelOption,
                {
                  backgroundColor: model === m.id ? colors.primary : colors.muted,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setModel(m.id)}
            >
              <Text
                style={[
                  styles.modelOptionText,
                  { color: model === m.id ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {m.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.role === 'user'
                ? { backgroundColor: colors.primary, alignSelf: 'flex-end' }
                : { backgroundColor: colors.muted, alignSelf: 'flex-start' },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color: message.role === 'user' ? colors.primaryForeground : colors.foreground,
                },
              ]}
            >
              {message.content}
            </Text>
            <View style={styles.messageMeta}>
              <Text
                style={[
                  styles.modelText,
                  { color: message.role === 'user' ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {message.model}
              </Text>
              {message.tokens_used && (
                <Text
                  style={[
                    styles.tokensText,
                    { color: message.role === 'user' ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {message.tokens_used} tokens
                </Text>
              )}
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View style={[styles.loadingMessage, { backgroundColor: colors.muted }]}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.foreground }]}>
              Astranova is thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.foreground,
              borderColor: colors.border,
            },
          ]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Astranova anything..."
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={2000}
          editable={!isLoading}
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: colors.muted }]}
            onPress={clearConversation}
            disabled={messages.length === 0}
          >
            <Text style={[styles.clearButtonText, { color: colors.foreground }]}>
              Clear
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: input.trim() && !isLoading ? colors.primary : colors.muted,
                opacity: (input.trim() && !isLoading) ? 1 : 0.5,
              },
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <Text
              style={[
                styles.sendButtonText,
                { color: input.trim() && !isLoading ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  modelSelector: {
    padding: 12,
    margin: 8,
    borderRadius: 8,
  },
  modelLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modelOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  modelOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 8,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  modelText: {
    fontSize: 10,
  },
  tokensText: {
    fontSize: 10,
  },
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    maxHeight: 100,
    minHeight: 44,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
