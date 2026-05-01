import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassInput } from '@/components/ui/glass-input';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { 
  Bot, 
  Settings, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Code, 
  Workflow, 
  Server, 
  TestTube, 
  Shield, 
  Zap, 
  FileText, 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Database, 
  Globe, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Plus, 
  Minus, 
  X, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  MoreVertical, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight, 
  ArrowLeft, 
  GitBranch, 
  Package, 
  Layers, 
  Grid3X3, 
  List, 
  Table, 
  Calendar, 
  Timer, 
  Stopwatch, 
  Gauge, 
  Tachometer, 
  Speedometer, 
  Compass, 
  Navigation, 
  Map, 
  Target, 
  Bullseye, 
  Flag, 
  Award, 
  Trophy, 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  BookmarkPlus, 
  BookmarkMinus, 
  Tag, 
  Hash, 
  AtSign, 
  DollarSign, 
  Euro, 
  PoundSterling, 
  Yen, 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  LineChart, 
  PieChart, 
  AreaChart, 
  ScatterChart, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Umbrella, 
  Wind, 
  Thermometer, 
  Droplets, 
  Waves, 
  Flame, 
  Snowflake, 
  Zap, 
  Battery, 
  BatteryLow, 
  BatteryMedium, 
  BatteryHigh, 
  BatteryFull, 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalLow, 
  SignalMedium, 
  SignalHigh, 
  Radio, 
  RadioOff, 
  Bluetooth, 
  BluetoothOff, 
  Usb, 
  UsbPlug, 
  UsbUnplug, 
  Power, 
  PowerOff, 
  Plug, 
  PlugZap, 
  Unplug, 
  ZapOff, 
  ZapOn, 
  Flashlight, 
  FlashlightOff, 
  Lightbulb, 
  LightbulbOff, 
  Candle, 
  CandleOff, 
  Lamp, 
  LampOff, 
  CeilingLight, 
  CeilingLightOff, 
  WallSconce, 
  WallSconceOff, 
  Chandelier, 
  ChandelierOff, 
  FloorLamp, 
  FloorLampOff, 
  TableLamp, 
  TableLampOff, 
  DeskLamp, 
  DeskLampOff, 
  BedLamp, 
  BedLampOff, 
  ReadingLamp, 
  ReadingLampOff, 
  Spotlight, 
  SpotlightOff, 
  Floodlight, 
  FloodlightOff, 
  Searchlight, 
  SearchlightOff, 
  Headlight, 
  HeadlightOff, 
  Taillight, 
  TaillightOff, 
  BrakeLight, 
  BrakeLightOff, 
  TurnLeft, 
  TurnRight, 
  Stop, 
  Yield, 
  Railroad, 
  Train, 
  Tram, 
  Subway, 
  Bus, 
  Taxi, 
  Car, 
  Truck, 
  Ambulance, 
  FireTruck, 
  PoliceCar, 
  Motorcycle, 
  Bicycle, 
  Scooter, 
  Skateboard, 
  RollerSkates, 
  Boat, 
  Ship, 
  Ferry, 
  Yacht, 
  Sailboat, 
  Speedboat, 
  Jetski, 
  Surfboard, 
  Waterski, 
  Wakeboard, 
  Kitesurf, 
  Windsurf, 
  Paragliding, 
  Skydiving, 
  Bungee, 
  Climbing, 
  Hiking, 
  Camping, 
  Fishing, 
  Hunting, 
  Shooting, 
  Archery, 
  Darts, 
  Bowling, 
  Billiards, 
  Pool, 
  Snooker, 
  Chess, 
  Checkers, 
  Dominoes, 
  Mahjong, 
  Poker, 
  Blackjack, 
  Roulette, 
  SlotMachine, 
  Dice, 
  Spinner, 
  Slot, 
  Reel, 
  Jackpot, 
  Trophy, 
  Medal, 
  Ribbon, 
  Award, 
  Prize, 
  Gift, 
  Present, 
  Package, 
  Box, 
  Crate, 
  Barrel, 
  Chest, 
  Treasure, 
  Gold, 
  Silver, 
  Bronze, 
  Diamond, 
  Gem, 
  Crystal, 
  Pearl, 
  Ruby, 
  Emerald, 
  Sapphire, 
  Amethyst, 
  Topaz, 
  Opal, 
  Jade, 
  Onyx, 
  Obsidian, 
  Granite, 
  Marble, 
  Sandstone, 
  Limestone, 
  Slate, 
  Shale, 
  Coal, 
  Oil, 
  Gas, 
  Nuclear, 
  Solar, 
  Wind, 
  Hydro, 
  Geothermal, 
  Biomass, 
  Biofuel, 
  Ethanol, 
  Hydrogen, 
  Electricity, 
  Power, 
  Energy, 
  Battery, 
  Generator, 
  Turbine, 
  Engine, 
  Motor, 
  Pump, 
  Compressor, 
  Fan, 
  Blower, 
  Heater, 
  Cooler, 
  Refrigerator, 
  Freezer, 
  Oven, 
  Stove, 
  Microwave, 
  Toaster, 
  Blender, 
  Mixer, 
  Juicer, 
  CoffeeMaker, 
  TeaKettle, 
  WaterHeater, 
  WashingMachine, 
  Dryer, 
  Dishwasher, 
  Vacuum, 
  Iron, 
  SewingMachine, 
  Printer, 
  Scanner, 
  Copier, 
  Fax, 
  Phone, 
  Mobile, 
  Tablet, 
  Laptop, 
  Desktop, 
  Monitor, 
  Keyboard, 
  Mouse, 
  Trackpad, 
  Webcam, 
  Microphone, 
  Speaker, 
  Headphones, 
  Earbuds, 
  Amplifier, 
  Equalizer, 
  Tuner, 
  Radio, 
  Television, 
  Projector, 
  Screen, 
  Display, 
  Console, 
  Controller, 
  Joystick, 
  SteeringWheel, 
  Pedals, 
  Gear, 
  Clutch, 
  Brake, 
  Accelerator, 
  Fuel, 
  Oil, 
  Coolant, 
  BrakeFluid, 
  PowerSteering, 
  Transmission, 
  Differential, 
  Axle, 
  Wheel, 
  Tire, 
  Rim, 
  Hub, 
  Spoke, 
  Valve, 
  Tube, 
  InnerTube, 
  Patch, 
  Plug, 
  Nail, 
  Screw, 
  Bolt, 
  Nut, 
  Washer, 
  Lock, 
  Key, 
  Padlock, 
  Chain, 
  Rope, 
  Cable, 
  Wire, 
  Cord, 
  Extension, 
  Adapter, 
  Converter, 
  Transformer, 
  Inverter, 
  Rectifier, 
  Regulator, 
  Capacitor, 
  Resistor, 
  Inductor, 
  Diode, 
  Transistor, 
  IntegratedCircuit, 
  Microchip, 
  Processor, 
  Memory, 
  Storage, 
  HardDrive, 
  SolidState, 
  Flash, 
  Card, 
  Slot, 
  Port, 
  Connector, 
  Jack, 
  Plug, 
  Socket, 
  Outlet, 
  Switch, 
  Breaker, 
  Fuse, 
  Relay, 
  Solenoid, 
  Actuator, 
  Sensor, 
  Detector, 
  Meter, 
  Gauge, 
  Dial, 
  Knob, 
  Button, 
  Lever, 
  Handle, 
  Grip, 
  Clamp, 
  Vise, 
  Press, 
  Punch, 
  Drill, 
  Saw, 
  Cutter, 
  Grinder, 
  Sander, 
  Polisher, 
  Buffer, 
  Welder, 
  Solder, 
  Glue, 
  Tape, 
  Staple, 
  Nail, 
  Screw, 
  Bolt, 
  Nut, 
  Washer, 
  Lock, 
  Key, 
  Chain, 
  Rope, 
  Cable, 
  Wire, 
  Cord, 
  Extension, 
  Adapter, 
  Converter, 
  Transformer, 
  Inverter, 
  Rectifier, 
  Regulator, 
  Capacitor, 
  Resistor, 
  Inductor, 
  Diode, 
  Transistor, 
  IntegratedCircuit, 
  Microchip, 
  Processor, 
  Memory, 
  Storage, 
  HardDrive, 
  SolidState, 
  Flash, 
  Card, 
  Slot, 
  Port, 
  Connector, 
  Jack, 
  Plug, 
  Socket, 
  Outlet, 
  Switch, 
  Breaker, 
  Fuse, 
  Relay, 
  Solenoid, 
  Actuator, 
  Sensor, 
  Detector, 
  Meter, 
  Gauge, 
  Dial, 
  Knob, 
  Button, 
  Lever, 
  Handle, 
  Grip, 
  Clamp, 
  Vise, 
  Press, 
  Punch, 
  Drill, 
  Saw, 
  Cutter, 
  Grinder, 
  Sander, 
  Polisher, 
  Buffer, 
  Welder, 
  Solder, 
  Glue, 
  Tape, 
  Staple
} from 'lucide-react';

interface ViktorTask {
  id: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  progress: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result?: any;
  error?: string;
  logs: string[];
}

interface ViktorEngineStatus {
  engine: {
    active: boolean;
    version: string;
    uptime: number;
    tasks_completed: number;
    tasks_failed: number;
    current_load: number;
    max_concurrent_tasks: number;
  };
  capabilities: Record<string, boolean>;
  tasks: {
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
  };
}

interface AutomationCapabilities {
  automation_types: Array<{
    type: string;
    description: string;
    enabled: boolean;
  }>;
  priorities: string[];
  statuses: string[];
}

export function ViktorAutomation() {
  const [tasks, setTasks] = useState<ViktorTask[]>([]);
  const [engineStatus, setEngineStatus] = useState<ViktorEngineStatus | null>(null);
  const [capabilities, setCapabilities] = useState<AutomationCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ViktorTask | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState({
    type: 'code_generation',
    priority: 'medium',
    description: '',
    parameters: {}
  });

  const automationTypes = [
    { value: 'code_generation', label: 'Code Generation', icon: Code },
    { value: 'workflow_automation', label: 'Workflow Automation', icon: Workflow },
    { value: 'system_deployment', label: 'System Deployment', icon: Server },
    { value: 'testing_automation', label: 'Testing Automation', icon: TestTube },
    { value: 'monitoring_setup', label: 'Monitoring Setup', icon: Activity },
    { value: 'security_scanning', label: 'Security Scanning', icon: Shield },
    { value: 'performance_optimization', label: 'Performance Optimization', icon: Zap },
    { value: 'documentation_generation', label: 'Documentation Generation', icon: FileText }
  ];

  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
    urgent: 'text-purple-600'
  };

  const statusColors = {
    pending: 'text-yellow-600',
    running: 'text-blue-600',
    completed: 'text-green-600',
    failed: 'text-red-600',
    cancelled: 'text-gray-600',
    retrying: 'text-orange-600'
  };

  const statusIcons = {
    pending: Clock,
    running: RefreshCw,
    completed: CheckCircle,
    failed: AlertCircle,
    cancelled: X,
    retrying: RefreshCw
  };

  useEffect(() => {
    loadViktorData();
    const interval = setInterval(loadViktorData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadViktorData = async () => {
    try {
      const [tasksResponse, statusResponse, capabilitiesResponse] = await Promise.all([
        fetch('http://localhost:8000/api/v1/viktor/tasks'),
        fetch('http://localhost:8000/api/v1/viktor/engine/status'),
        fetch('http://localhost:8000/api/v1/viktor/capabilities')
      ]);

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks || []);
      }

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setEngineStatus(statusData);
      }

      if (capabilitiesResponse.ok) {
        const capabilitiesData = await capabilitiesResponse.json();
        setCapabilities(capabilitiesData);
      }
    } catch (error) {
      console.error('Error loading Viktor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.description.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/v1/viktor/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const result = await response.json();
        setShowCreateTask(false);
        setNewTask({
          type: 'code_generation',
          priority: 'medium',
          description: '',
          parameters: {}
        });
        loadViktorData();
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const cancelTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/viktor/tasks/${taskId}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        loadViktorData();
      }
    } catch (error) {
      console.error('Error cancelling task:', error);
    }
  };

  const getTaskTypeIcon = (type: string) => {
    const automationType = automationTypes.find(t => t.value === type);
    return automationType ? automationType.icon : Bot;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <GlassCard variant="elevated" className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold">Loading Viktor Automation</h3>
            <p className="text-muted-foreground">Initializing automation engine...</p>
            <div className="space-y-2">
              <LoadingSkeleton className="h-2 w-full" />
              <LoadingSkeleton className="h-2 w-3/4" />
              <LoadingSkeleton className="h-2 w-1/2" />
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold synova-gradient-text mb-2">
              🤖 Viktor Engineering Automation
            </h2>
            <p className="text-muted-foreground">
              Advanced automation and engineering capabilities for Synova AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GlassButton
              variant="default"
              onClick={() => setShowCreateTask(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </GlassButton>
          </div>
        </div>

        {/* Engine Status */}
        {engineStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {engineStatus.engine.tasks_completed}
              </div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {engineStatus.engine.current_load}
              </div>
              <div className="text-sm text-muted-foreground">Current Load</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {engineStatus.engine.uptime.toFixed(0)}s
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {engineStatus.tasks.total}
              </div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Create Task Modal */}
      {showCreateTask && (
        <GlassCard variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create New Task</h3>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setShowCreateTask(false)}
            >
              <X className="w-4 h-4" />
            </GlassButton>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task Type</label>
              <select
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                {automationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <GlassInput
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description..."
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <GlassButton
                onClick={createTask}
                disabled={!newTask.description.trim()}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Create Task
              </GlassButton>
              <GlassButton
                variant="outline"
                onClick={() => setShowCreateTask(false)}
                className="flex-1"
              >
                Cancel
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Filters and Search */}
      <GlassCard variant="compact" className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <GlassInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </GlassCard>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const TaskIcon = getTaskTypeIcon(task.type);
          const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
          
          return (
            <GlassCard key={task.id} variant="floating" className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <TaskIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{task.description}</h4>
                      <span className={`text-sm font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="capitalize">{task.type.replace('_', ' ')}</span>
                      <span>Created: {new Date(task.created_at).toLocaleString()}</span>
                      {task.started_at && (
                        <span>Started: {new Date(task.started_at).toLocaleString()}</span>
                      )}
                    </div>
                    
                    {task.status === 'running' && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{task.progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {task.logs.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Logs</span>
                          <span className="text-xs text-muted-foreground">({task.logs.length})</span>
                        </div>
                        <div className="bg-muted/50 rounded p-2 max-h-20 overflow-y-auto">
                          {task.logs.slice(-3).map((log, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {task.result && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Result</span>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                            {JSON.stringify(task.result, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {task.error && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-red-600">Error</span>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <p className="text-xs text-red-600">{task.error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <StatusIcon className={`w-4 h-4 ${statusColors[task.status as keyof typeof statusColors]}`} />
                    <span className={`text-sm font-medium ${statusColors[task.status as keyof typeof statusColors]}`}>
                      {task.status}
                    </span>
                  </div>
                  
                  {(task.status === 'pending' || task.status === 'running') && (
                    <GlassButton
                      variant="outline"
                      size="sm"
                      onClick={() => cancelTask(task.id)}
                    >
                      <Square className="w-3 h-3" />
                    </GlassButton>
                  )}
                  
                  <GlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTask(task)}
                  >
                    <Eye className="w-3 h-3" />
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <GlassCard variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Task Details</h3>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setSelectedTask(null)}
            >
              <X className="w-4 h-4" />
            </GlassButton>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <span className="ml-2">{selectedTask.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 capitalize">{selectedTask.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority:</span>
                  <span className="ml-2">{selectedTask.priority}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2">{selectedTask.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2">{new Date(selectedTask.created_at).toLocaleString()}</span>
                </div>
                {selectedTask.started_at && (
                  <div>
                    <span className="text-muted-foreground">Started:</span>
                    <span className="ml-2">{new Date(selectedTask.started_at).toLocaleString()}</span>
                  </div>
                )}
                {selectedTask.completed_at && (
                  <div>
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="ml-2">{new Date(selectedTask.completed_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Logs</h4>
              <div className="bg-muted/50 rounded p-3 max-h-40 overflow-y-auto">
                {selectedTask.logs.map((log, index) => (
                  <div key={index} className="text-sm text-muted-foreground mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {selectedTask.result && (
              <div>
                <h4 className="font-semibold mb-2">Result</h4>
                <div className="bg-muted/50 rounded p-3 max-h-40 overflow-y-auto">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {JSON.stringify(selectedTask.result, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {selectedTask.error && (
              <div>
                <h4 className="font-semibold mb-2">Error</h4>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm text-red-600">{selectedTask.error}</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
