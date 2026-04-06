import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../ui/theme';

interface SupanovaTask {
  id: string;
  task_type: string;
  description: string;
  priority: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  confidence?: number;
  processing_time?: number;
  created_at: number;
}

interface SupanovaCapability {
  name: string;
  description: string;
  icon: string;
}

export function SupanovaAgent() {
  const [tasks, setTasks] = useState<SupanovaTask[]>([]);
  const [input, setInput] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState('text_generation');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [capabilities, setCapabilities] = useState<SupanovaCapability[]>([]);
  const { colors } = useTheme();

  const taskTypes = [
    { id: 'text_generation', name: 'Text Generation', icon: '✍️' },
    { id: 'image_analysis', name: 'Image Analysis', icon: '🖼️' },
    { id: 'audio_processing', name: 'Audio Processing', icon: '🎵' },
    { id: 'code_generation', name: 'Code Generation', icon: '💻' },
    { id: 'data_analysis', name: 'Data Analysis', icon: '📊' },
    { id: 'task_automation', name: 'Task Automation', icon: '🤖' },
    { id: 'reasoning', name: 'Complex Reasoning', icon: '🧠' },
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: '#10b981' },
    { id: 'medium', name: 'Medium', color: '#f59e0b' },
    { id: 'high', name: 'High', color: '#ef4444' },
  ];

  useEffect(() => {
    loadCapabilities();
  }, []);

  const loadCapabilities = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/supanova/capabilities');
      if (response.ok) {
        const data = await response.json();
        setCapabilities(data.capabilities);
      }
    } catch (error) {
      console.error('Failed to load capabilities:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Handle document selection
        Alert.alert('Document Selected', result.assets[0].name);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const executeTask = async () => {
    if (!input.trim() && !selectedImage) return;

    const newTask: SupanovaTask = {
      id: Date.now().toString(),
      task_type: selectedTaskType,
      description: input.trim() || 'Image/Document Processing',
      priority: 'medium',
      status: 'pending',
      created_at: Date.now(),
    };

    setTasks(prev => [...prev, newTask]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/supanova/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_type: selectedTaskType,
          description: input.trim() || 'Analyze the provided media',
          priority: 'medium',
          context: {
            has_image: !!selectedImage,
            image_data: selectedImage,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute task');
      }

      const data = await response.json();

      setTasks(prev =>
        prev.map(task =>
          task.id === newTask.id
            ? {
                ...task,
                status: 'completed',
                result: data.result,
                confidence: data.confidence,
                processing_time: data.processing_time,
              }
            : task
        )
      );
    } catch (error) {
      console.error('Supanova error:', error);
      
      setTasks(prev =>
        prev.map(task =>
          task.id === newTask.id
            ? { ...task, status: 'failed', result: 'Task execution failed' }
            : task
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'processing': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          🚀 Supanova Super-Agent
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Multi-modal task execution system
        </Text>
      </View>

      {/* Task Type Selection */}
      <View style={[styles.taskTypeSelector, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Task Type:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {taskTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.taskTypeOption,
                {
                  backgroundColor: selectedTaskType === type.id ? colors.primary : colors.muted,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedTaskType(type.id)}
            >
              <Text style={styles.taskTypeIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.taskTypeText,
                  { color: selectedTaskType === type.id ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Section */}
      <View style={[styles.inputSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Task Description:</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.foreground,
              borderColor: colors.border,
            },
          ]}
          value={input}
          onChangeText={setInput}
          placeholder="Describe your task..."
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={2000}
          editable={!isLoading}
        />

        {/* Media Selection */}
        <View style={styles.mediaButtons}>
          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: colors.muted }]}
            onPress={pickImage}
          >
            <Text style={[styles.mediaButtonText, { color: colors.foreground }]}>
              📷 Add Image
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: colors.muted }]}
            onPress={pickDocument}
          >
            <Text style={[styles.mediaButtonText, { color: colors.foreground }]}>
              📄 Add Document
            </Text>
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <View style={styles.selectedMedia}>
            <Text style={[styles.mediaLabel, { color: colors.foreground }]}>Image Selected</Text>
            <TouchableOpacity
              style={[styles.removeMedia, { backgroundColor: colors.danger }]}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeMediaText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.executeButton,
            {
              backgroundColor: (input.trim() || selectedImage) && !isLoading ? colors.primary : colors.muted,
              opacity: (input.trim() || selectedImage) && !isLoading ? 1 : 0.5,
            },
          ]}
          onPress={executeTask}
          disabled={!(input.trim() || selectedImage) || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text
              style={[
                styles.executeButtonText,
                { color: (input.trim() || selectedImage) && !isLoading ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              Execute Task
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <View style={styles.tasksSection}>
        <View style={styles.tasksHeader}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Task History</Text>
          <TouchableOpacity onPress={clearTasks} disabled={tasks.length === 0}>
            <Text style={[styles.clearButton, { color: tasks.length > 0 ? colors.danger : colors.mutedForeground }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.tasksList}>
          {tasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.taskHeader}>
                <Text style={[styles.taskType, { color: colors.foreground }]}>
                  {taskTypes.find(t => t.id === task.task_type)?.icon} {taskTypes.find(t => t.id === task.task_type)?.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                  <Text style={styles.statusText}>{task.status}</Text>
                </View>
              </View>
              
              <Text style={[styles.taskDescription, { color: colors.mutedForeground }]}>
                {task.description}
              </Text>
              
              {task.result && (
                <Text style={[styles.taskResult, { color: colors.foreground }]}>
                  {task.result}
                </Text>
              )}
              
              {task.confidence && (
                <Text style={[styles.taskMeta, { color: colors.mutedForeground }]}>
                  Confidence: {(task.confidence * 100).toFixed(1)}%
                </Text>
              )}
              
              {task.processing_time && (
                <Text style={[styles.taskMeta, { color: colors.mutedForeground }]}>
                  Processing time: {task.processing_time.toFixed(2)}s
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
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
  taskTypeSelector: {
    padding: 12,
    margin: 8,
    borderRadius: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskTypeOption: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    minWidth: 80,
  },
  taskTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  taskTypeText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputSection: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    maxHeight: 100,
    minHeight: 80,
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  mediaButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mediaButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedMedia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    marginBottom: 12,
  },
  mediaLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeMedia: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeMediaText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  executeButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  executeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tasksSection: {
    flex: 1,
    margin: 8,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  tasksList: {
    flex: 1,
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskType: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 13,
    marginBottom: 8,
  },
  taskResult: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});
