import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native';
import ModelSelector from './src/components/ModelSelector';
import { getModelConfig, getDefaultModel } from './src/config/models';

export default function App() {
  const [selectedModel, setSelectedModel] = useState(getDefaultModel().id);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  const currentModel = getModelConfig(selectedModel) || getDefaultModel();

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { role: 'user', content: message }]);
      setMessage('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Response from ${currentModel.name}: This is a simulated response. The actual model integration will be implemented with the backend API.`
        }]);
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Synova AI</Text>
          <TouchableOpacity
            style={styles.modelButton}
            onPress={() => setShowModelSelector(true)}
          >
            <Text style={styles.modelButtonText}>{currentModel.name}</Text>
            <Text style={styles.modelButtonArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to Synova AI</Text>
            <Text style={styles.welcomeText}>
              Powered by {currentModel.name}
            </Text>
            <Text style={styles.welcomeDescription}>
              {currentModel.description}
            </Text>
            <View style={styles.capabilitiesContainer}>
              {currentModel.capabilities.slice(0, 4).map((capability) => (
                <View key={capability} style={styles.capabilityBadge}>
                  <Text style={styles.capabilityText}>{capability}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userMessage : styles.assistantMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                msg.role === 'user' ? styles.userMessageText : styles.assistantMessageText
              ]}>
                {msg.content}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#718096"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Model Selector Modal */}
      <ModelSelector
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        visible={showModelSelector}
        onClose={() => setShowModelSelector(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    backgroundColor: '#24243e',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#302b63',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  modelButtonArrow: {
    color: '#ffffff',
    fontSize: 10,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: '#667eea',
    marginBottom: 10,
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  capabilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  capabilityBadge: {
    backgroundColor: '#302b63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  capabilityText: {
    color: '#ffffff',
    fontSize: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#667eea',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#24243e',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
  },
  userMessageText: {
    color: '#ffffff',
  },
  assistantMessageText: {
    color: '#e2e8f0',
  },
  inputArea: {
    backgroundColor: '#24243e',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#302b63',
  },
  input: {
    flex: 1,
    backgroundColor: '#302b63',
    color: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
