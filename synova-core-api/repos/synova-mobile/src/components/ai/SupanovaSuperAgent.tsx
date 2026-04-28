import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SuperAgentTask {
  id: string;
  name: string;
  description: string;
  type: 'automation' | 'analysis' | 'generation' | 'optimization' | 'monitoring' | 'security';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startTime?: string;
  endTime?: string;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  logs?: string[];
  metadata?: Record<string, any>;
  dependencies?: string[];
  tags?: string[];
  createdBy?: string;
  assignedTo?: string;
  notifications?: boolean;
  retryCount?: number;
  maxRetries?: number;
  timeout?: number;
  resources?: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  configuration?: Record<string, any>;
  permissions?: string[];
}

interface SuperAgentWorkflow {
  id: string;
  name: string;
  description: string;
  tasks: SuperAgentTask[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  schedule?: {
    type: 'immediate' | 'scheduled' | 'triggered';
    cron?: string;
    timezone?: string;
    startDate?: string;
    endDate?: string;
  };
  triggers?: Array<{
    type: 'webhook' | 'event' | 'schedule' | 'manual';
    config: Record<string, any>;
  }>;
  notifications?: Array<{
    type: 'email' | 'sms' | 'webhook' | 'push';
    config: Record<string, any>;
  }>;
  variables?: Record<string, any>;
  environment?: Record<string, any>;
  secrets?: Record<string, any>;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  lastRun?: string;
  nextRun?: string;
  runCount?: number;
  successCount?: number;
  failureCount?: number;
}

interface SuperAgentModel {
  id: string;
  name: string;
  type: 'llm' | 'vision' | 'audio' | 'multimodal' | 'specialized';
  provider: 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral' | 'custom';
  model: string;
  version: string;
  capabilities: string[];
  parameters?: Record<string, any>;
  limits?: {
    maxTokens: number;
    maxRequests: number;
    maxContext: number;
    maxTemperature: number;
  };
  pricing?: {
    inputTokens: number;
    outputTokens: number;
    currency: string;
  };
  status: 'active' | 'inactive' | 'deprecated' | 'beta';
  performance?: {
    accuracy: number;
    speed: number;
    reliability: number;
    efficiency: number;
  };
  usage?: {
    requests: number;
    tokens: number;
    cost: number;
    lastUsed: string;
  };
}

interface SuperAgentResource {
  id: string;
  name: string;
  type: 'compute' | 'storage' | 'network' | 'database' | 'cache' | 'queue' | 'monitoring';
  provider: 'aws' | 'gcp' | 'azure' | 'local' | 'custom';
  region?: string;
  configuration: Record<string, any>;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  metrics?: Record<string, number>;
  limits?: Record<string, number>;
  costs?: {
    hourly: number;
    monthly: number;
    currency: string;
  };
  tags?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export const SupanovaSuperAgent: React.FC = () => {
  const [tasks, setTasks] = useState<SuperAgentTask[]>([]);
  const [workflows, setWorkflows] = useState<SuperAgentWorkflow[]>([]);
  const [models, setModels] = useState<SuperAgentModel[]>([]);
  const [resources, setResources] = useState<SuperAgentResource[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'workflows' | 'models' | 'resources'>('tasks');
  const [selectedTask, setSelectedTask] = useState<SuperAgentTask | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<SuperAgentWorkflow | null>(null);
  const [selectedModel, setSelectedModel] = useState<SuperAgentModel | null>(null);
  const [selectedResource, setSelectedResource] = useState<SuperAgentResource | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showNotifications, setShowNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [isOnline, setIsOnline] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'down'>('healthy');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();

    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadData = async () => {
    try {
      // Simulate API calls - in real app, these would be actual API calls
      const mockTasks: SuperAgentTask[] = [
        {
          id: 'task-1',
          name: 'Code Generation',
          description: 'Generate React Native components',
          type: 'generation',
          status: 'running',
          priority: 'high',
          progress: 75,
          startTime: new Date().toISOString(),
          duration: 45000,
          resources: { cpu: 60, memory: 40, storage: 20, network: 10 },
        },
        {
          id: 'task-2',
          name: 'Security Analysis',
          description: 'Analyze code for vulnerabilities',
          type: 'security',
          status: 'completed',
          priority: 'critical',
          progress: 100,
          startTime: new Date(Date.now() - 3600000).toISOString(),
          endTime: new Date(Date.now() - 1800000).toISOString(),
          duration: 1800000,
        },
      ];

      const mockWorkflows: SuperAgentWorkflow[] = [
        {
          id: 'workflow-1',
          name: 'CI/CD Pipeline',
          description: 'Automated build and deployment',
          tasks: mockTasks,
          status: 'active',
          runCount: 42,
          successCount: 38,
          failureCount: 4,
          lastRun: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      const mockModels: SuperAgentModel[] = [
        {
          id: 'model-1',
          name: 'GPT-4',
          type: 'llm',
          provider: 'openai',
          model: 'gpt-4',
          version: '1.0',
          capabilities: ['text-generation', 'code-generation', 'analysis'],
          status: 'active',
          performance: { accuracy: 95, speed: 85, reliability: 92, efficiency: 88 },
          usage: { requests: 1250, tokens: 250000, cost: 12.50, lastUsed: new Date().toISOString() },
        },
      ];

      const mockResources: SuperAgentResource[] = [
        {
          id: 'resource-1',
          name: 'Compute Instance',
          type: 'compute',
          provider: 'aws',
          region: 'us-east-1',
          status: 'active',
          costs: { hourly: 0.25, monthly: 180, currency: 'USD' },
        },
      ];

      setTasks(mockTasks);
      setWorkflows(mockWorkflows);
      setModels(mockModels);
      setResources(mockResources);

    } catch (error) {
      console.error('Failed to load Supanova data:', error);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const createTask = async (taskData: Partial<SuperAgentTask>) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const newTask: SuperAgentTask = {
        id: `task-${Date.now()}`,
        name: taskData.name || 'New Task',
        description: taskData.description || '',
        type: taskData.type || 'automation',
        status: 'pending',
        priority: taskData.priority || 'medium',
        progress: 0,
        resources: { cpu: 0, memory: 0, storage: 0, network: 0 },
        ...taskData,
      };

      setTasks([...tasks, newTask]);
      setIsCreating(false);
      Alert.alert('Success', 'Task created successfully');

    } catch (error) {
      console.error('Failed to create task:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<SuperAgentTask>) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } as SuperAgentTask : task
      );
      setTasks(updatedTasks);
      setIsEditing(false);
      Alert.alert('Success', 'Task updated successfully');

    } catch (error) {
      console.error('Failed to update task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      setTasks(tasks.filter(task => task.id !== taskId));
      Alert.alert('Success', 'Task deleted successfully');

    } catch (error) {
      console.error('Failed to delete task:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const executeTask = async (taskId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'running', progress: 0, startTime: new Date().toISOString() }
          : task
      );
      setTasks(updatedTasks);

      // Simulate task execution
      setTimeout(() => {
        const completedTasks = tasks.map(task =>
          task.id === taskId
            ? { ...task, status: 'completed' as const, progress: 100, endTime: new Date().toISOString() }
            : task
        );
        setTasks(completedTasks);
      }, 3000);

    } catch (error) {
      console.error('Failed to execute task:', error);
      Alert.alert('Error', 'Failed to execute task');
    }
  };

  const pauseTask = async (taskId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: 'paused' as const } : task
      );
      setTasks(updatedTasks);

    } catch (error) {
      console.error('Failed to pause task:', error);
      Alert.alert('Error', 'Failed to pause task');
    }
  };

  const resumeTask = async (taskId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: 'running' as const } : task
      );
      setTasks(updatedTasks);

    } catch (error) {
      console.error('Failed to resume task:', error);
      Alert.alert('Error', 'Failed to resume task');
    }
  };

  const getFilteredTasks = () => {
    return tasks
      .filter(task => {
        if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (filterStatus !== 'all' && task.status !== filterStatus) {
          return false;
        }
        if (filterType !== 'all' && task.type !== filterType) {
          return false;
        }
        if (filterPriority !== 'all' && task.priority !== filterPriority) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aValue = a[sortBy as keyof SuperAgentTask];
        const bValue = b[sortBy as keyof SuperAgentTask];

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'running': return '#007AFF';
      case 'completed': return '#34C759';
      case 'failed': return '#FF3B30';
      case 'paused': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#8E8E93';
      case 'medium': return '#007AFF';
      case 'high': return '#FF9500';
      case 'critical': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const renderTaskCard = (task: SuperAgentTask) => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <View style={styles.taskIcon}>
            <Ionicons name="flash" size={24} color="#fff" />
          </View>
          <View style={styles.taskDetails}>
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
          </View>
        </View>
        <View style={styles.taskStatus}>
          <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
            {task.status}
          </Text>
          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
            {task.priority}
          </Text>
        </View>
      </View>

      <View style={styles.taskProgress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{task.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${task.progress}%`, backgroundColor: getStatusColor(task.status) }
            ]}
          />
        </View>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.taskMeta}>
          <Text style={styles.taskDuration}>
            {task.duration ? `${Math.round(task.duration / 1000)}s` : '0s'}
          </Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setSelectedTask(task)}
          >
            <Ionicons name="eye" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create" size={20} color="#007AFF" />
          </TouchableOpacity>
          {task.status === 'pending' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => executeTask(task.id)}
            >
              <Ionicons name="play" size={20} color="#34C759" />
            </TouchableOpacity>
          )}
          {task.status === 'running' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pauseTask(task.id)}
            >
              <Ionicons name="pause" size={20} color="#FF9500" />
            </TouchableOpacity>
          )}
          {task.status === 'paused' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => resumeTask(task.id)}
            >
              <Ionicons name="play" size={20} color="#34C759" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteTask(task.id)}
          >
            <Ionicons name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTasks = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Super-Agent Tasks</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsCreating(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>New Task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterRow}>
          <View style={styles.filterSelect}>
            <Text style={styles.filterLabel}>Status</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{filterStatus}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSelect}>
            <Text style={styles.filterLabel}>Type</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{filterType}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSelect}>
            <Text style={styles.filterLabel}>Priority</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{filterPriority}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.tasksList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {getFilteredTasks().map(renderTaskCard)}
      </ScrollView>
    </View>
  );

  const renderWorkflows = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Workflows</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => Alert.alert('Coming Soon', 'Workflow creation coming soon')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>New Workflow</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.workflowsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workflows.map((workflow) => (
          <View key={workflow.id} style={styles.workflowCard}>
            <View style={styles.workflowHeader}>
              <View style={styles.workflowInfo}>
                <View style={styles.workflowIcon}>
                  <Ionicons name="layers" size={24} color="#fff" />
                </View>
                <View style={styles.workflowDetails}>
                  <Text style={styles.workflowName}>{workflow.name}</Text>
                  <Text style={styles.workflowDescription}>{workflow.description}</Text>
                </View>
              </View>
              <View style={styles.workflowStatus}>
                <Text style={[styles.statusText, { color: getStatusColor(workflow.status) }]}>
                  {workflow.status}
                </Text>
              </View>
            </View>

            <View style={styles.workflowStats}>
              <Text style={styles.workflowStat}>
                {workflow.tasks.length} tasks
              </Text>
              <Text style={styles.workflowStat}>
                Run count: {workflow.runCount || 0}
              </Text>
            </View>

            <View style={styles.workflowFooter}>
              <Text style={styles.workflowLastRun}>
                Last run: {workflow.lastRun ? new Date(workflow.lastRun).toLocaleString() : 'Never'}
              </Text>
              <View style={styles.workflowActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="play" size={20} color="#34C759" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderModels = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>AI Models</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => Alert.alert('Coming Soon', 'Model management coming soon')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Add Model</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.modelsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {models.map((model) => (
          <View key={model.id} style={styles.modelCard}>
            <View style={styles.modelHeader}>
              <View style={styles.modelInfo}>
                <View style={styles.modelIcon}>
                  <Ionicons name="brain" size={24} color="#fff" />
                </View>
                <View style={styles.modelDetails}>
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={styles.modelDescription}>
                    {model.provider} - {model.model}
                  </Text>
                </View>
              </View>
              <View style={styles.modelStatus}>
                <Text style={[styles.statusText, { color: getStatusColor(model.status) }]}>
                  {model.status}
                </Text>
              </View>
            </View>

            <View style={styles.modelStats}>
              <Text style={styles.modelStat}>Type: {model.type}</Text>
              <Text style={styles.modelStat}>Version: {model.version}</Text>
              {model.performance && (
                <Text style={styles.modelStat}>
                  Accuracy: {model.performance.accuracy}%
                </Text>
              )}
            </View>

            <View style={styles.modelFooter}>
              <Text style={styles.modelUsage}>
                {model.usage?.requests || 0} requests
              </Text>
              <View style={styles.modelActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="settings" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderResources = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Resources</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => Alert.alert('Coming Soon', 'Resource management coming soon')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Add Resource</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.resourcesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {resources.map((resource) => (
          <View key={resource.id} style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
              <View style={styles.resourceInfo}>
                <View style={styles.resourceIcon}>
                  <Ionicons name="server" size={24} color="#fff" />
                </View>
                <View style={styles.resourceDetails}>
                  <Text style={styles.resourceName}>{resource.name}</Text>
                  <Text style={styles.resourceDescription}>
                    {resource.provider} - {resource.type}
                  </Text>
                </View>
              </View>
              <View style={styles.resourceStatus}>
                <Text style={[styles.statusText, { color: getStatusColor(resource.status) }]}>
                  {resource.status}
                </Text>
              </View>
            </View>

            <View style={styles.resourceStats}>
              <Text style={styles.resourceStat}>
                Region: {resource.region || 'Local'}
              </Text>
              {resource.costs && (
                <Text style={styles.resourceStat}>
                  Cost: ${resource.costs.hourly}/hour
                </Text>
              )}
            </View>

            <View style={styles.resourceFooter}>
              <Text style={styles.resourceStatus}>Active</Text>
              <View style={styles.resourceActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="settings" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Supanova Super-Agent</Text>
        <View style={styles.headerStatus}>
          <View style={[
            styles.statusDot,
            {
              backgroundColor: systemStatus === 'healthy' ? '#34C759' :
                systemStatus === 'degraded' ? '#FF9500' : '#FF3B30'
            }
          ]} />
          <Text style={styles.statusText}>
            {systemStatus === 'healthy' ? 'Healthy' :
              systemStatus === 'degraded' ? 'Degraded' : 'Down'}
          </Text>
        </View>
        <View style={styles.headerConnection}>
          <Ionicons
            name={isOnline ? "wifi" : "wifi-off"}
            size={16}
            color={isOnline ? "#34C759" : "#FF3B30"}
          />
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => setAutoRefresh(!autoRefresh)}
        >
          <Ionicons
            name="refresh"
            size={20}
            color="#fff"
            style={autoRefresh ? { transform: [{ rotate: '180deg' }] } : {}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'tasks' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('tasks')}
        >
          <Ionicons
            name="flash"
            size={20}
            color={activeTab === 'tasks' ? '#fff' : '#666'}
          />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'tasks' && styles.activeTabButtonText
          ]}>
            Tasks ({tasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'workflows' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('workflows')}
        >
          <Ionicons
            name="layers"
            size={20}
            color={activeTab === 'workflows' ? '#fff' : '#666'}
          />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'workflows' && styles.activeTabButtonText
          ]}>
            Workflows ({workflows.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'models' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('models')}
        >
          <Ionicons
            name="brain"
            size={20}
            color={activeTab === 'models' ? '#fff' : '#666'}
          />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'models' && styles.activeTabButtonText
          ]}>
            Models ({models.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'resources' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('resources')}
        >
          <Ionicons
            name="server"
            size={20}
            color={activeTab === 'resources' ? '#fff' : '#666'}
          />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'resources' && styles.activeTabButtonText
          ]}>
            Resources ({resources.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'models' && renderModels()}
        {activeTab === 'resources' && renderResources()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  createButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  filters: {
    padding: 16,
    backgroundColor: '#2a2a2a',
  },
  searchInput: {
    backgroundColor: '#3a3a3a',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterSelect: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#fff',
  },
  tasksList: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskProgress: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressValue: {
    fontSize: 12,
    color: '#fff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#3a3a3a',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDuration: {
    fontSize: 12,
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#3a3a3a',
  },
  workflowsList: {
    flex: 1,
    padding: 16,
  },
  workflowCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workflowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  workflowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workflowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workflowDetails: {
    flex: 1,
  },
  workflowName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  workflowDescription: {
    fontSize: 14,
    color: '#666',
  },
  workflowStats: {
    marginBottom: 12,
  },
  workflowStat: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  workflowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workflowLastRun: {
    fontSize: 12,
    color: '#666',
  },
  workflowActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modelsList: {
    flex: 1,
    padding: 16,
  },
  modelCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modelDetails: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 14,
    color: '#666',
  },
  modelStats: {
    marginBottom: 12,
  },
  modelStat: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  modelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modelUsage: {
    fontSize: 12,
    color: '#666',
  },
  modelActions: {
    flexDirection: 'row',
    gap: 8,
  },
  resourcesList: {
    flex: 1,
    padding: 16,
  },
  resourceCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceDetails: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
  resourceStats: {
    marginBottom: 12,
  },
  resourceStat: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  resourceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resourceActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
