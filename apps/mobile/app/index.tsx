import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Synova AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [userMessage],
          mode: 'chat'
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Synova AI</Text>
        <TextInput
          style={styles.apiInput}
          value={apiUrl}
          onChangeText={setApiUrl}
          placeholder="API URL"
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
        {messages.map((msg, i) => (
          <View key={i} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.message, styles.assistantMessage]}>
            <Text style={styles.messageText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          editable={!loading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    backgroundColor: '#16213e',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 8,
  },
  apiInput: {
    backgroundColor: '#0f3460',
    borderWidth: 1,
    borderColor: '#e94560',
    color: '#eee',
    padding: 8,
    borderRadius: 4,
    fontSize: 12,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e94560',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#0f3460',
  },
  messageText: {
    color: '#eee',
    fontSize: 16,
    lineHeight: 22,
  },
  inputArea: {
    backgroundColor: '#16213e',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  input: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderWidth: 1,
    borderColor: '#e94560',
    color: '#eee',
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#e94560',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
