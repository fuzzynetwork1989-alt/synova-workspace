'use client'

import { useState, useEffect, useRef } from 'react'
import { GlassCard } from './glass-card'
import { GlassButton } from './glass-button'
import { LoadingSkeleton } from './loading-skeleton'
import { 
  Bot, 
  Brain, 
  Zap, 
  Code, 
  Terminal, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Settings, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Save, 
  Copy, 
  Trash2, 
  Plus, 
  Minus, 
  RefreshCw, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  MoreVertical, 
  MoreHorizontal, 
  Edit, 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Link, 
  Globe, 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryLow, 
  BatteryFull, 
  Clock, 
  Calendar, 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  Box, 
  Package, 
  Server, 
  Cloud, 
  CloudDownload, 
  CloudUpload, 
  Database, 
  HardDrive, 
  Cpu, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Tv, 
  Headphones, 
  Camera, 
  Mic, 
  MicOff, 
  VideoOff, 
  Maximize2, 
  Minimize2, 
  Move, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  CornerUpLeft, 
  CornerUpRight, 
  CornerDownLeft, 
  CornerDownRight, 
  DoubleArrowLeft, 
  DoubleArrowRight, 
  DoubleArrowUp, 
  DoubleArrowDown, 
  Expand, 
  Shrink, 
  Fullscreen, 
  FullscreenExit, 
  PictureInPicture, 
  PictureInPicture2, 
  Pipette, 
  Palette, 
  Brush, 
  Eraser, 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Indent, 
  Outdent, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5, 
  Heading6, 
  Subscript, 
  Superscript, 
  Link2, 
  Unlink, 
  Image as ImageIcon, 
  Film, 
  Music as MusicIcon, 
  File, 
  Folder, 
  FolderOpen, 
  FolderPlus, 
  FolderMinus, 
  FilePlus, 
  FileMinus, 
  FileText as FileTextIcon, 
  FileImage as FileImageIcon, 
  FileVideo as FileVideoIcon, 
  FileAudio as FileAudioIcon, 
  FileCode as FileCodeIcon, 
  FileArchive, 
  FileSpreadsheet, 
  FileCheck, 
  FileX, 
  FileQuestion, 
  FileSearch, 
  FileLock, 
  FileUnlock, 
  FileSignature, 
  FileDigit, 
  FileBarChart, 
  FilePieChart, 
  FileLineChart, 
  FileScatterChart, 
  FileHistogram, 
  FileHeatmap, 
  FileTreeMap, 
  FileNetwork, 
  FileTimeline, 
  FileGantt, 
  FileCalendar, 
  FileClock, 
  FileMap, 
  FileLocation, 
  FileRoute, 
  FileNavigation, 
  FileCompass, 
  FileGlobe, 
  FileLayers, 
  FileBox, 
  FilePackage, 
  FileServer, 
  FileCloud, 
  FileDownload, 
  FileUpload, 
  FileRefresh, 
  FilePlay, 
  FilePause, 
  FileSquare, 
  FileSkipForward, 
  FileSkipBack, 
  FileRewind, 
  FileFastForward, 
  FileMaximize, 
  FileMinimize, 
  FileMove, 
  FileRotate, 
  FileZoomIn, 
  FileZoomOut, 
  FileHome, 
  FileArrowLeft, 
  FileArrowRight, 
  FileArrowUp, 
  FileArrowDown, 
  FileMoreVertical, 
  FileMoreHorizontal, 
  FileChevronLeft, 
  FileChevronRight, 
  FileChevronUp, 
  FileChevronDown
} from 'lucide-react'

interface SuperAgentTask {
  id: string
  name: string
  description: string
  type: 'automation' | 'analysis' | 'generation' | 'optimization' | 'monitoring' | 'security'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number
  startTime?: string
  endTime?: string
  duration?: number
  input?: any
  output?: any
  error?: string
  logs?: string[]
  metadata?: Record<string, any>
  dependencies?: string[]
  tags?: string[]
  createdBy?: string
  assignedTo?: string
  notifications?: boolean
  retryCount?: number
  maxRetries?: number
  timeout?: number
  resources?: {
    cpu: number
    memory: number
    storage: number
    network: number
  }
  permissions?: string[]
}

interface SuperAgentWorkflow {
  id: string
  name: string
  description: string
  tasks: SuperAgentTask[]
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed'
  schedule?: {
    type: 'immediate' | 'scheduled' | 'triggered'
    cron?: string
    timezone?: string
    startDate?: string
    endDate?: string
  }
  triggers?: Array<{
    type: 'webhook' | 'event' | 'schedule' | 'manual'
    config: Record<string, any>
  }>
  notifications?: Array<{
    type: 'email' | 'sms' | 'webhook' | 'push'
    config: Record<string, any>
  }>
  variables?: Record<string, any>
  environment?: Record<string, any>
  secrets?: Record<string, any>
  version?: number
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  lastRun?: string
  nextRun?: string
  runCount?: number
  successCount?: number
  failureCount?: number
}

interface SuperAgentModel {
  id: string
  name: string
  type: 'llm' | 'vision' | 'audio' | 'multimodal' | 'specialized'
  provider: 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral' | 'custom'
  model: string
  version: string
  capabilities: string[]
  parameters?: Record<string, any>
  limits?: {
    maxTokens: number
    maxRequests: number
    maxContext: number
    maxTemperature: number
  }
  pricing?: {
    inputTokens: number
    outputTokens: number
    currency: string
  }
  status: 'active' | 'inactive' | 'deprecated' | 'beta'
  performance?: {
    accuracy: number
    speed: number
    reliability: number
    efficiency: number
  }
  usage?: {
    requests: number
    tokens: number
    cost: number
    lastUsed: string
  }
}

interface SuperAgentResource {
  id: string
  name: string
  type: 'compute' | 'storage' | 'network' | 'database' | 'cache' | 'queue' | 'monitoring'
  provider: 'aws' | 'gcp' | 'azure' | 'local' | 'custom'
  region?: string
  configuration: Record<string, any>
  status: 'active' | 'inactive' | 'error' | 'maintenance'
  metrics?: Record<string, number>
  limits?: Record<string, number>
  costs?: {
    hourly: number
    monthly: number
    currency: string
  }
  tags?: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

export function SupanovaSuperAgent() {
  const [tasks, setTasks] = useState<SuperAgentTask[]>([])
  const [workflows, setWorkflows] = useState<SuperAgentWorkflow[]>([])
  const [models, setModels] = useState<SuperAgentModel[]>([])
  const [resources, setResources] = useState<SuperAgentResource[]>([])
  const [activeTab, setActiveTab] = useState<'tasks' | 'workflows' | 'models' | 'resources'>('tasks')
  const [selectedTask, setSelectedTask] = useState<SuperAgentTask | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<SuperAgentWorkflow | null>(null)
  const [selectedModel, setSelectedModel] = useState<SuperAgentModel | null>(null)
  const [selectedResource, setSelectedResource] = useState<SuperAgentResource | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showNotifications, setShowNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000)
  const [isOnline, setIsOnline] = useState(true)
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'down'>('healthy')

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadData()
    
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(loadData, refreshInterval)
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefresh, refreshInterval])

  const loadData = async () => {
    try {
      const [tasksRes, workflowsRes, modelsRes, resourcesRes] = await Promise.all([
        fetch('/api/supanova/tasks'),
        fetch('/api/supanova/workflows'),
        fetch('/api/supanova/models'),
        fetch('/api/supanova/resources')
      ])
      
      const [tasksData, workflowsData, modelsData, resourcesData] = await Promise.all([
        tasksRes.json(),
        workflowsRes.json(),
        modelsRes.json(),
        resourcesRes.json()
      ])
      
      setTasks(tasksData)
      setWorkflows(workflowsData)
      setModels(modelsData)
      setResources(resourcesData)
      
    } catch (error) {
      console.error('Failed to load Supanova data:', error)
    }
  }

  const createTask = async (taskData: Partial<SuperAgentTask>) => {
    try {
      const response = await fetch('/api/supanova/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      
      const newTask = await response.json()
      setTasks([...tasks, newTask])
      setIsCreating(false)
      
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<SuperAgentTask>) => {
    try {
      const response = await fetch(`/api/supanova/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task))
      setIsEditing(false)
      
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/supanova/tasks/${taskId}`, {
        method: 'DELETE'
      })
      
      setTasks(tasks.filter(task => task.id !== taskId))
      
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const executeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/supanova/tasks/${taskId}/execute`, {
        method: 'POST'
      })
      
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task))
      
    } catch (error) {
      console.error('Failed to execute task:', error)
    }
  }

  const pauseTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/supanova/tasks/${taskId}/pause`, {
        method: 'POST'
      })
      
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task))
      
    } catch (error) {
      console.error('Failed to pause task:', error)
    }
  }

  const resumeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/supanova/tasks/${taskId}/resume`, {
        method: 'POST'
      })
      
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task))
      
    } catch (error) {
      console.error('Failed to resume task:', error)
    }
  }

  const getFilteredTasks = () => {
    return tasks
      .filter(task => {
        if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
        if (filterStatus !== 'all' && task.status !== filterStatus) {
          return false
        }
        if (filterType !== 'all' && task.type !== filterType) {
          return false
        }
        if (filterPriority !== 'all' && task.priority !== filterPriority) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        const aValue = a[sortBy as keyof SuperAgentTask]
        const bValue = b[sortBy as keyof SuperAgentTask]
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600'
      case 'running': return 'text-blue-600'
      case 'completed': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'paused': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600'
      case 'medium': return 'text-blue-600'
      case 'high': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const renderTaskCard = (task: SuperAgentTask) => (
    <GlassCard key={task.id} className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">{task.name}</h3>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{task.duration || 0}ms</span>
        </div>
        <div className="flex items-center gap-2">
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={() => setSelectedTask(task)}
          >
            <Eye className="w-4 h-4" />
          </GlassButton>
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4" />
          </GlassButton>
          {task.status === 'pending' && (
            <GlassButton
              size="sm"
              variant="ghost"
              onClick={() => executeTask(task.id)}
            >
              <Play className="w-4 h-4" />
            </GlassButton>
          )}
          {task.status === 'running' && (
            <GlassButton
              size="sm"
              variant="ghost"
              onClick={() => pauseTask(task.id)}
            >
              <Pause className="w-4 h-4" />
            </GlassButton>
          )}
          {task.status === 'paused' && (
            <GlassButton
              size="sm"
              variant="ghost"
              onClick={() => resumeTask(task.id)}
            >
              <Play className="w-4 h-4" />
            </GlassButton>
          )}
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="w-4 h-4" />
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  )

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Super-Agent Tasks</h2>
        <GlassButton onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </GlassButton>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-background/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="paused">Paused</option>
        </select>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-background/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="automation">Automation</option>
          <option value="analysis">Analysis</option>
          <option value="generation">Generation</option>
          <option value="optimization">Optimization</option>
          <option value="monitoring">Monitoring</option>
          <option value="security">Security</option>
        </select>
        
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 bg-background/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getFilteredTasks().map(renderTaskCard)}
      </div>
    </div>
  )

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workflows</h2>
        <GlassButton>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </GlassButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <GlassCard key={workflow.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="text-sm text-muted-foreground mb-1">
                {workflow.tasks.length} tasks
              </div>
              <div className="text-sm text-muted-foreground">
                Run count: {workflow.runCount || 0}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Last run: {workflow.lastRun || 'Never'}</span>
              </div>
              <div className="flex items-center gap-2">
                <GlassButton size="sm" variant="ghost">
                  <Eye className="w-4 h-4" />
                </GlassButton>
                <GlassButton size="sm" variant="ghost">
                  <Play className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )

  const renderModels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Models</h2>
        <GlassButton>
          <Plus className="w-4 h-4 mr-2" />
          Add Model
        </GlassButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <GlassCard key={model.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">{model.provider} - {model.model}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(model.status)}`}>
                {model.status}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="text-sm text-muted-foreground mb-1">
                Type: {model.type}
              </div>
              <div className="text-sm text-muted-foreground">
                Version: {model.version}
              </div>
              {model.performance && (
                <div className="text-sm text-muted-foreground">
                  Accuracy: {model.performance.accuracy}%
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>{model.usage?.requests || 0} requests</span>
              </div>
              <div className="flex items-center gap-2">
                <GlassButton size="sm" variant="ghost">
                  <Eye className="w-4 h-4" />
                </GlassButton>
                <GlassButton size="sm" variant="ghost">
                  <Settings className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resources</h2>
        <GlassButton>
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </GlassButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <GlassCard key={resource.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground">{resource.provider} - {resource.type}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(resource.status)}`}>
                {resource.status}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="text-sm text-muted-foreground mb-1">
                Region: {resource.region || 'Local'}
              </div>
              {resource.costs && (
                <div className="text-sm text-muted-foreground">
                  Cost: ${resource.costs.hourly}/hour
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cpu className="w-4 h-4" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <GlassButton size="sm" variant="ghost">
                  <Eye className="w-4 h-4" />
                </GlassButton>
                <GlassButton size="sm" variant="ghost">
                  <Settings className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Supanova Super-Agent</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              systemStatus === 'healthy' ? 'bg-green-500' : 
              systemStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              {systemStatus === 'healthy' ? 'Healthy' : 
               systemStatus === 'degraded' ? 'Degraded' : 'Down'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </GlassButton>
        </div>
      </div>
      
      <div className="flex items-center gap-2 p-4 border-b">
        <GlassButton
          variant={activeTab === 'tasks' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('tasks')}
        >
          <Bot className="w-4 h-4 mr-2" />
          Tasks ({tasks.length})
        </GlassButton>
        <GlassButton
          variant={activeTab === 'workflows' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('workflows')}
        >
          <Layers className="w-4 h-4 mr-2" />
          Workflows ({workflows.length})
        </GlassButton>
        <GlassButton
          variant={activeTab === 'models' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('models')}
        >
          <Brain className="w-4 h-4 mr-2" />
          Models ({models.length})
        </GlassButton>
        <GlassButton
          variant={activeTab === 'resources' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('resources')}
        >
          <Server className="w-4 h-4 mr-2" />
          Resources ({resources.length})
        </GlassButton>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'models' && renderModels()}
        {activeTab === 'resources' && renderResources()}
      </div>
    </div>
  )
}
