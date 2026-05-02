import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import * as Network from 'expo-network';

const API_BASE_URL = 'http://localhost:8000'; // Replace with production URL

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    loadStoredMessages();
  }, []);

  const checkConnection = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
    } catch (error) {
      console.error('Network check failed:', error);
      setIsConnected(false);
    }
  };

  const loadStoredMessages = async () => {
    try {
      const stored = await SecureStore.getItemAsync('synova_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const saveMessages = async (messagesToSave) => {
    try {
      await SecureStore.setItemAsync('synova_messages', JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading || !isConnected) return;

    const userMessage = { text: message, sender: 'user', timestamp: Date.now() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { 
        text: data.response || 'Sorry, I could not process your request.', 
        sender: 'ai', 
        timestamp: Date.now() 
      };
      
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);

    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = { 
        text: 'Connection failed. Please check your internet connection and try again.', 
        sender: 'ai', 
        timestamp: Date.now(),
        isError: true
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setMessages([]);
            await SecureStore.deleteItemAsync('synova_messages');
          }
        }
      ]
    );
  };

  const renderMessage = (msg, index) => (
    <View
      key={index}
      style={[
        styles.messageContainer,
        msg.sender === 'user' ? styles.userMessage : styles.aiMessage,
        msg.isError && styles.errorMessage
      ]}
    >
      <Text style={[
        styles.messageText,
        msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText,
        msg.isError && styles.errorMessageText
      ]}>
        {msg.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Synova AI</Text>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {!isConnected && (
          <Text style={styles.connectionWarning}>No internet connection</Text>
        )}
      </LinearGradient>

      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
            <Text style={styles.welcomeText}>Welcome to Synova AI</Text>
            <Text style={styles.welcomeSubtext}>Start a conversation below</Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={1000}
          editable={!isLoading && isConnected}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || isLoading || !isConnected) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!message.trim() || isLoading || !isConnected}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() && !isLoading && isConnected ? 'white' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  clearButton: {
    padding: 8,
  },
  connectionWarning: {
    color: '#FEE2E2',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: #374151,
    marginTop: 16,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: #9CA3AF',
    marginTop: 8,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F46E5',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#374151',
  },
  errorMessageText: {
    color: '#DC2626',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});
