import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { XR, AR, VR, Controllers, HandTracking, EyeTracking, SpatialAudio } from 'react-native-xr';
import { WebView } from 'react-native-webview';
import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

interface MetaQuest3Config {
  handTracking: boolean;
  eyeTracking: boolean;
  spatialAudio: boolean;
  hapticFeedback: boolean;
  voiceCommands: boolean;
  gestureRecognition: boolean;
  roomScale: boolean;
  passThrough: boolean;
  mixedReality: boolean;
  performanceMode: 'quality' | 'performance' | 'balanced';
}

interface HoloArchitectSpace {
  id: string;
  name: string;
  type: 'meeting' | 'presentation' | 'collaboration' | 'visualization' | 'training';
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  objects: HoloObject[];
  participants: string[];
  interactions: Interaction[];
}

interface HoloObject {
  id: string;
  type: '3d_model' | 'text' | 'image' | 'video' | 'data_viz' | 'whiteboard' | 'screen';
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  content: any;
  interactive: boolean;
  physics: boolean;
  materials: Material[];
}

interface Material {
  type: 'glass' | 'metal' | 'plastic' | 'wood' | 'fabric' | 'hologram';
  color: string;
  transparency: number;
  emissive: boolean;
  texture?: string;
}

interface Interaction {
  type: 'grab' | 'point' | 'gesture' | 'voice' | 'gaze';
  target: string;
  action: string;
  parameters: any;
}

export function MetaQuest3Integration() {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isXRActive, setIsXRActive] = useState(false);
  const [currentMode, setCurrentMode] = useState<'VR' | 'AR' | 'MR'>('VR');
  const [config, setConfig] = useState<MetaQuest3Config>({
    handTracking: true,
    eyeTracking: true,
    spatialAudio: true,
    hapticFeedback: true,
    voiceCommands: true,
    gestureRecognition: true,
    roomScale: true,
    passThrough: true,
    mixedReality: true,
    performanceMode: 'balanced'
  });
  
  const [holoSpaces, setHoloSpaces] = useState<HoloArchitectSpace[]>([]);
  const [currentSpace, setCurrentSpace] = useState<HoloArchitectSpace | null>(null);
  const [controllers, setControllers] = useState<any[]>([]);
  const [hands, setHands] = useState<any[]>([]);
  const [gazePoint, setGazePoint] = useState<{ x: number; y: number; z: number } | null>(null);
  const [audioEngine, setAudioEngine] = useState<Audio.Sound | null>(null);
  
  const xrSessionRef = useRef<any>(null);
  const holoRendererRef = useRef<any>(null);

  useEffect(() => {
    initializeXR();
    return () => {
      cleanupXR();
    };
  }, []);

  const initializeXR = async () => {
    try {
      // Check VR/AR support
      const vrSupported = await XR.isVRSupported();
      const arSupported = await XR.isARSupported();
      
      setIsVRSupported(vrSupported);
      setIsARSupported(arSupported);
      
      // Initialize audio engine
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/sounds/xr-ambient.mp3'),
        { shouldPlay: false, isLooping: true }
      );
      setAudioEngine(sound);
      
      // Initialize hand tracking
      if (config.handTracking) {
        await HandTracking.initialize();
      }
      
      // Initialize eye tracking
      if (config.eyeTracking) {
        await EyeTracking.initialize();
      }
      
      // Initialize spatial audio
      if (config.spatialAudio) {
        await SpatialAudio.initialize();
      }
      
      console.log('XR initialized successfully');
    } catch (error) {
      console.error('Failed to initialize XR:', error);
      Alert.alert('XR Error', 'Failed to initialize XR features');
    }
  };

  const cleanupXR = async () => {
    try {
      if (xrSessionRef.current) {
        await xrSessionRef.current.end();
        xrSessionRef.current = null;
      }
      
      if (audioEngine) {
        await audioEngine.unloadAsync();
      }
      
      await HandTracking.cleanup();
      await EyeTracking.cleanup();
      await SpatialAudio.cleanup();
    } catch (error) {
      console.error('Error cleaning up XR:', error);
    }
  };

  const startXRSession = async (mode: 'VR' | 'AR' | 'MR') => {
    try {
      setCurrentMode(mode);
      
      const sessionConfig = {
        mode: mode.toLowerCase(),
        handTracking: config.handTracking,
        eyeTracking: config.eyeTracking,
        spatialAudio: config.spatialAudio,
        roomScale: config.roomScale,
        passThrough: mode === 'MR' ? config.passThrough : false,
        performanceMode: config.performanceMode
      };
      
      const session = await XR.startSession(sessionConfig);
      xrSessionRef.current = session;
      
      // Set up event listeners
      session.on('controllersConnected', handleControllersConnected);
      session.on('controllersDisconnected', handleControllersDisconnected);
      session.on('handsTracked', handleHandsTracked);
      session.on('gazeUpdate', handleGazeUpdate);
      session.on('interaction', handleInteraction);
      session.on('speech', handleSpeechCommand);
      
      setIsXRActive(true);
      
      // Start ambient audio
      if (audioEngine && config.spatialAudio) {
        await audioEngine.playAsync();
      }
      
      // Initialize Holo-Architect
      await initializeHoloArchitect();
      
      console.log(`${mode} session started successfully`);
    } catch (error) {
      console.error(`Failed to start ${mode} session:`, error);
      Alert.alert('Session Error', `Failed to start ${mode} session`);
    }
  };

  const initializeHoloArchitect = async () => {
    try {
      // Initialize 3D rendering engine
      const renderer = await HoloArchitect.initialize({
        antialiasing: true,
        shadows: true,
        reflections: true,
        postProcessing: true,
        resolution: Platform.OS === 'ios' ? 'high' : 'ultra',
        frameRate: 90,
        renderScale: 1.2
      });
      
      holoRendererRef.current = renderer;
      
      // Create default spaces
      const defaultSpaces: HoloArchitectSpace[] = [
        {
          id: 'meeting-room',
          name: 'Meeting Room',
          type: 'meeting',
          dimensions: { width: 10, height: 3, depth: 8 },
          objects: await createMeetingRoomObjects(),
          participants: [],
          interactions: []
        },
        {
          id: 'presentation-hall',
          name: 'Presentation Hall',
          type: 'presentation',
          dimensions: { width: 20, height: 5, depth: 15 },
          objects: await createPresentationHallObjects(),
          participants: [],
          interactions: []
        },
        {
          id: 'collaboration-space',
          name: 'Collaboration Space',
          type: 'collaboration',
          dimensions: { width: 15, height: 4, depth: 12 },
          objects: await createCollaborationSpaceObjects(),
          participants: [],
          interactions: []
        }
      ];
      
      setHoloSpaces(defaultSpaces);
      setCurrentSpace(defaultSpaces[0]);
      
      console.log('Holo-Architect initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Holo-Architect:', error);
    }
  };

  const createMeetingRoomObjects = async (): Promise<HoloObject[]> => {
    return [
      {
        id: 'conference-table',
        type: '3d_model',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        content: 'models/conference_table.glb',
        interactive: true,
        physics: true,
        materials: [
          { type: 'wood', color: '#8B4513', transparency: 0, emissive: false }
        ]
      },
      {
        id: 'holo-screen',
        type: 'screen',
        position: { x: 0, y: 2, z: -3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 2.5, z: 0.1 },
        content: { type: 'webview', url: 'https://synova.ai' },
        interactive: true,
        physics: false,
        materials: [
          { type: 'hologram', color: '#00ffff', transparency: 0.3, emissive: true }
        ]
      },
      {
        id: 'whiteboard',
        type: 'whiteboard',
        position: { x: 0, y: 1.5, z: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 2, z: 0.1 },
        content: { drawings: [], text: '' },
        interactive: true,
        physics: false,
        materials: [
          { type: 'glass', color: '#ffffff', transparency: 0.1, emissive: false }
        ]
      }
    ];
  };

  const createPresentationHallObjects = async (): Promise<HoloObject[]> => {
    return [
      {
        id: 'presentation-screen',
        type: 'screen',
        position: { x: 0, y: 3, z: -7 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8, y: 4.5, z: 0.1 },
        content: { type: 'presentation', slides: [] },
        interactive: true,
        physics: false,
        materials: [
          { type: 'hologram', color: '#ffffff', transparency: 0.2, emissive: true }
        ]
      },
      {
        id: 'seating-area',
        type: '3d_model',
        position: { x: 0, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        content: 'models/auditorium_seating.glb',
        interactive: false,
        physics: true,
        materials: [
          { type: 'fabric', color: '#4169E1', transparency: 0, emissive: false }
        ]
      }
    ];
  };

  const createCollaborationSpaceObjects = async (): Promise<HoloObject[]> => {
    return [
      {
        id: 'collaboration-table',
        type: '3d_model',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        content: 'models/round_table.glb',
        interactive: true,
        physics: true,
        materials: [
          { type: 'metal', color: '#C0C0C0', transparency: 0, emissive: false }
        ]
      },
      {
        id: 'data-visualization',
        type: 'data_viz',
        position: { x: 2, y: 1.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 2, z: 0.1 },
        content: { type: '3d_chart', data: [] },
        interactive: true,
        physics: false,
        materials: [
          { type: 'hologram', color: '#00ff00', transparency: 0.4, emissive: true }
        ]
      }
    ];
  };

  const handleControllersConnected = (controllers: any[]) => {
    setControllers(controllers);
    console.log('Controllers connected:', controllers.length);
    
    // Provide haptic feedback
    if (config.hapticFeedback) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleControllersDisconnected = () => {
    setControllers([]);
    console.log('Controllers disconnected');
  };

  const handleHandsTracked = (hands: any[]) => {
    setHands(hands);
    
    // Update hand tracking data
    hands.forEach((hand, index) => {
      if (hand.gesture) {
        handleGesture(hand.gesture, index);
      }
    });
  };

  const handleGazeUpdate = (gazeData: any) => {
    setGazePoint(gazeData.point);
    
    // Highlight objects based on gaze
    if (currentSpace && gazeData.target) {
      highlightObject(gazeData.target);
    }
  };

  const handleInteraction = (interaction: any) => {
    const { type, target, action } = interaction;
    
    switch (type) {
      case 'grab':
        handleGrab(target, action);
        break;
      case 'point':
        handlePoint(target, action);
        break;
      case 'gesture':
        handleGesture(action);
        break;
      default:
        console.log('Unknown interaction type:', type);
    }
  };

  const handleSpeechCommand = async (command: string) => {
    console.log('Speech command:', command);
    
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('switch to vr')) {
      await switchMode('VR');
    } else if (lowerCommand.includes('switch to ar')) {
      await switchMode('AR');
    } else if (lowerCommand.includes('switch to mr')) {
      await switchMode('MR');
    } else if (lowerCommand.includes('meeting room')) {
      await switchSpace('meeting-room');
    } else if (lowerCommand.includes('presentation')) {
      await switchSpace('presentation-hall');
    } else if (lowerCommand.includes('collaboration')) {
      await switchSpace('collaboration-space');
    } else if (lowerCommand.includes('start recording')) {
      await startRecording();
    } else if (lowerCommand.includes('stop recording')) {
      await stopRecording();
    }
  };

  const handleGrab = (target: string, action: string) => {
    if (!currentSpace) return;
    
    const object = currentSpace.objects.find(obj => obj.id === target);
    if (object && object.interactive) {
      // Handle object manipulation
      switch (action) {
        case 'grab':
          object.physics = false;
          break;
        case 'release':
          object.physics = true;
          break;
        case 'throw':
          // Apply physics to throw object
          break;
      }
      
      // Provide haptic feedback
      if (config.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handlePoint = (target: string, action: string) => {
    if (!currentSpace) return;
    
    const object = currentSpace.objects.find(obj => obj.id === target);
    if (object && object.interactive) {
      // Handle pointing interactions
      switch (object.type) {
        case 'screen':
          handleScreenInteraction(object, action);
          break;
        case 'whiteboard':
          handleWhiteboardInteraction(object, action);
          break;
        case 'data_viz':
          handleDataVizInteraction(object, action);
          break;
      }
    }
  };

  const handleGesture = (gesture: string, handIndex?: number) => {
    console.log('Gesture detected:', gesture);
    
    switch (gesture) {
      case 'pinch':
        // Handle pinch gesture for scaling
        break;
      case 'thumbs_up':
        // Handle thumbs up for confirmation
        if (config.hapticFeedback) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        break;
      case 'wave':
        // Handle wave for greeting
        break;
      case 'point':
        // Handle point gesture
        break;
      default:
        console.log('Unknown gesture:', gesture);
    }
  };

  const handleScreenInteraction = (screen: HoloObject, action: string) => {
    if (screen.content.type === 'webview') {
      // Handle webview interactions
      switch (action) {
        case 'click':
          // Simulate click on webview
          break;
        case 'scroll':
          // Handle scroll gesture
          break;
      }
    }
  };

  const handleWhiteboardInteraction = (whiteboard: HoloObject, action: string) => {
    // Handle whiteboard drawing
    switch (action) {
      case 'draw':
        // Start drawing
        break;
      case 'erase':
        // Start erasing
        break;
      case 'clear':
        // Clear whiteboard
        whiteboard.content.drawings = [];
        break;
    }
  };

  const handleDataVizInteraction = (dataViz: HoloObject, action: string) => {
    // Handle data visualization interactions
    switch (action) {
      case 'rotate':
        // Rotate visualization
        dataViz.rotation.y += 0.1;
        break;
      case 'scale':
        // Scale visualization
        dataViz.scale.x *= 1.1;
        dataViz.scale.y *= 1.1;
        break;
      case 'filter':
        // Apply data filter
        break;
    }
  };

  const highlightObject = (objectId: string) => {
    if (!currentSpace) return;
    
    const object = currentSpace.objects.find(obj => obj.id === objectId);
    if (object) {
      // Add highlight effect
      object.materials = object.materials.map(material => ({
        ...material,
        emissive: true,
        emissiveColor: '#ffff00'
      }));
    }
  };

  const switchMode = async (mode: 'VR' | 'AR' | 'MR') => {
    if (isXRActive) {
      await cleanupXR();
    }
    await startXRSession(mode);
  };

  const switchSpace = async (spaceId: string) => {
    const space = holoSpaces.find(s => s.id === spaceId);
    if (space) {
      setCurrentSpace(space);
      
      // Transition to new space
      if (holoRendererRef.current) {
        await holoRendererRef.current.transitionToSpace(space);
      }
      
      // Provide haptic feedback
      if (config.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const startRecording = async () => {
    try {
      await XR.startRecording({
        video: true,
        audio: config.spatialAudio,
        controllers: true,
        hands: config.handTracking,
        gaze: config.eyeTracking
      });
      
      Alert.alert('Recording Started', 'Your XR session is being recorded');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const recording = await XR.stopRecording();
      
      // Save recording to device
      await XR.saveRecording(recording, 'synova-xr-recording.mp4');
      
      Alert.alert('Recording Stopped', 'Recording saved to device');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to stop recording');
    }
  };

  const renderXRControls = () => (
    <View style={styles.xrControls}>
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: currentMode === 'VR' ? '#4CAF50' : '#666' }]}
        onPress={() => switchMode('VR')}
        disabled={!isVRSupported}
      >
        <Text style={styles.controlButtonText}>VR</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: currentMode === 'AR' ? '#4CAF50' : '#666' }]}
        onPress={() => switchMode('AR')}
        disabled={!isARSupported}
      >
        <Text style={styles.controlButtonText}>AR</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: currentMode === 'MR' ? '#4CAF50' : '#666' }]}
        onPress={() => switchMode('MR')}
        disabled={!isVRSupported}
      >
        <Text style={styles.controlButtonText}>MR</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.controlButton}
        onPress={isXRActive ? cleanupXR : () => startXRSession(currentMode)}
      >
        <Text style={styles.controlButtonText}>
          {isXRActive ? 'Stop XR' : 'Start XR'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSpaceSelector = () => (
    <View style={styles.spaceSelector}>
      <Text style={styles.sectionTitle}>Holo-Architect Spaces</Text>
      {holoSpaces.map(space => (
        <TouchableOpacity
          key={space.id}
          style={[
            styles.spaceButton,
            currentSpace?.id === space.id && styles.activeSpaceButton
          ]}
          onPress={() => switchSpace(space.id)}
        >
          <Text style={styles.spaceButtonText}>{space.name}</Text>
          <Text style={styles.spaceTypeText}>{space.type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConfigPanel = () => (
    <View style={styles.configPanel}>
      <Text style={styles.sectionTitle}>Meta Quest 3 Configuration</Text>
      
      <View style={styles.configRow}>
        <Text style={styles.configLabel}>Hand Tracking</Text>
        <TouchableOpacity
          style={[styles.toggle, config.handTracking && styles.toggleOn]}
          onPress={() => setConfig({ ...config, handTracking: !config.handTracking })}
        >
          <Text style={styles.toggleText}>
            {config.handTracking ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.configRow}>
        <Text style={styles.configLabel}>Eye Tracking</Text>
        <TouchableOpacity
          style={[styles.toggle, config.eyeTracking && styles.toggleOn]}
          onPress={() => setConfig({ ...config, eyeTracking: !config.eyeTracking })}
        >
          <Text style={styles.toggleText}>
            {config.eyeTracking ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.configRow}>
        <Text style={styles.configLabel}>Spatial Audio</Text>
        <TouchableOpacity
          style={[styles.toggle, config.spatialAudio && styles.toggleOn]}
          onPress={() => setConfig({ ...config, spatialAudio: !config.spatialAudio })}
        >
          <Text style={styles.toggleText}>
            {config.spatialAudio ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.configRow}>
        <Text style={styles.configLabel}>Haptic Feedback</Text>
        <TouchableOpacity
          style={[styles.toggle, config.hapticFeedback && styles.toggleOn]}
          onPress={() => setConfig({ ...config, hapticFeedback: !config.hapticFeedback })}
        >
          <Text style={styles.toggleText}>
            {config.hapticFeedback ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.configRow}>
        <Text style={styles.configLabel}>Voice Commands</Text>
        <TouchableOpacity
          style={[styles.toggle, config.voiceCommands && styles.toggleOn]}
          onPress={() => setConfig({ ...config, voiceCommands: !config.voiceCommands })}
        >
          <Text style={styles.toggleText}>
            {config.voiceCommands ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.configRow}>
        <Text style={styles.configLabel}>Performance Mode</Text>
        <TouchableOpacity
          style={styles.performanceButton}
          onPress={() => {
            const modes: Array<'quality' | 'performance' | 'balanced'> = ['quality', 'performance', 'balanced'];
            const currentIndex = modes.indexOf(config.performanceMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            setConfig({ ...config, performanceMode: nextMode });
          }}
        >
          <Text style={styles.performanceText}>{config.performanceMode}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatusPanel = () => (
    <View style={styles.statusPanel}>
      <Text style={styles.sectionTitle}>System Status</Text>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>VR Support:</Text>
        <Text style={[styles.statusValue, isVRSupported && styles.statusGood]}>
          {isVRSupported ? 'Available' : 'Not Available'}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>AR Support:</Text>
        <Text style={[styles.statusValue, isARSupported && styles.statusGood]}>
          {isARSupported ? 'Available' : 'Not Available'}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>XR Session:</Text>
        <Text style={[styles.statusValue, isXRActive && styles.statusGood]}>
          {isXRActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Controllers:</Text>
        <Text style={styles.statusValue}>{controllers.length} Connected</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Hands Tracked:</Text>
        <Text style={styles.statusValue}>{hands.length} Tracked</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Current Mode:</Text>
        <Text style={styles.statusValue}>{currentMode}</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Current Space:</Text>
        <Text style={styles.statusValue}>{currentSpace?.name || 'None'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meta Quest 3 Integration</Text>
      <Text style={styles.subtitle}>VR/XR/AR with 3D Holo-Architect</Text>
      
      {renderXRControls()}
      {renderSpaceSelector()}
      {renderConfigPanel()}
      {renderStatusPanel()}
      
      {isXRActive && (
        <View style={styles.activeSession}>
          <Text style={styles.activeText}>XR Session Active</Text>
          <Text style={styles.activeMode}>{currentMode} Mode</Text>
          {currentSpace && (
            <Text style={styles.activeSpace}>Space: {currentSpace.name}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  xrControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  spaceSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  spaceButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeSpaceButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  spaceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  spaceTypeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  configPanel: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  configLabel: {
    fontSize: 16,
  },
  toggle: {
    backgroundColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleOn: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  performanceButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  performanceText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusPanel: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusGood: {
    color: '#4CAF50',
  },
  activeSession: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeMode: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },
  activeSpace: {
    color: 'white',
    fontSize: 14,
    marginTop: 2,
  },
});
