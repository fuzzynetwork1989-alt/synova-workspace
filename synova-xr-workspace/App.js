/**
 * Synova AI XR Workspace v4.1
 * Meta Quest 3 ready AR/VR architecture application
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ViroARScene, 
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroText,
  ViroBox,
  ViroMaterials,
  ViroNode,
  ViroQuad,
  ViroButton,
  ViroSound,
  ViroVideo,
  Viro360Image,
  ViroAnimatedImage,
  ViroParticleEmitter
} from '@viro-community/react-viro';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SynovaXRWorkspace = () => {
  const [currentBlueprint, setCurrentBlueprint] = useState(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [arMode, setArMode] = useState('AR'); // AR, VR, or 360
  const [selectedModel, setSelectedModel] = useState(null);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef(null);

  // Blueprint configurations
  const blueprints = {
    warehouse: {
      id: 'warehouse-v1',
      name: 'Industrial Warehouse',
      model: require('./assets/models/synova-warehouse.glb'),
      scale: [0.1, 0.1, 0.1],
      position: [0, 0, -5],
      features: ['mezzanine offices', 'steel frame', 'roll-up doors']
    },
    lofts: {
      id: 'lofts-v1',
      name: 'Urban Lofts',
      model: require('./assets/models/synova-lofts.glb'),
      scale: [0.08, 0.08, 0.08],
      position: [0, 0, -4],
      features: ['glass curtain wall', 'rooftop deck', 'mixed-use']
    },
    luxury: {
      id: 'luxury-v1',
      name: 'Luxury Estate',
      model: require('./assets/models/synova-luxury.glb'),
      scale: [0.05, 0.05, 0.05],
      position: [0, 0, -3],
      features: ['infinity pool', 'smart glass', 'home theater']
    }
  };

  useEffect(() => {
    initializeApp();
    setupVoiceRecognition();
  }, []);

  const initializeApp = async () => {
    try {
      // Load saved preferences
      const savedBlueprint = await AsyncStorage.getItem('lastBlueprint');
      if (savedBlueprint) {
        setCurrentBlueprint(savedBlueprint);
      }

      // Initialize audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('🚀 Synova XR Workspace initialized');
    } catch (error) {
      console.error('❌ Initialization failed:', error);
    }
  };

  const setupVoiceRecognition = async () => {
    // Voice recognition setup would go here
    // For now, we'll use mock voice commands
    console.log('🎤 Voice recognition ready');
  };

  const handleVoiceCommand = async (command) => {
    console.log(`🎤 Voice command: ${command}`);
    setVoiceCommand(command);

    // Process voice commands
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('warehouse')) {
      loadBlueprint('warehouse');
      await speak('Loading industrial warehouse blueprint');
    } else if (lowerCommand.includes('loft') || lowerCommand.includes('condo')) {
      loadBlueprint('lofts');
      await speak('Loading urban lofts blueprint');
    } else if (lowerCommand.includes('luxury') || lowerCommand.includes('estate')) {
      loadBlueprint('luxury');
      await speak('Loading luxury estate blueprint');
    } else if (lowerCommand.includes('show')) {
      if (currentBlueprint) {
        await speak(`Showing ${blueprints[currentBlueprint].name}`);
      }
    } else if (lowerCommand.includes('ar mode')) {
      setArMode('AR');
      await speak('Switching to AR mode');
    } else if (lowerCommand.includes('vr mode')) {
      setArMode('VR');
      await speak('Switching to VR mode');
    } else if (lowerCommand.includes('help')) {
      await speak('Say show warehouse, show lofts, or show luxury to load blueprints');
    }
  };

  const speak = async (text) => {
    try {
      await Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        volume: 1.0
      });
    } catch (error) {
      console.error('❌ Speech failed:', error);
    }
  };

  const loadBlueprint = async (blueprintType) => {
    setIsLoading(true);
    try {
      setCurrentBlueprint(blueprintType);
      await AsyncStorage.setItem('lastBlueprint', blueprintType);
      
      // Play loading sound
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
      
      console.log(`🏗️ Loaded ${blueprintType} blueprint`);
    } catch (error) {
      console.error('❌ Failed to load blueprint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelLoad = () => {
    console.log('✅ 3D model loaded successfully');
    setIsLoading(false);
  };

  const handleModelError = (error) => {
    console.error('❌ 3D model load failed:', error);
    setIsLoading(false);
  };

  const renderARScene = () => (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroSpotLight
        position={[0, 5, 0]}
        direction={[0, -1, 0]}
        intensity={500}
        innerAngle={5}
        outerAngle={20}
        attenuationStartDistance={1}
        attenuationEndDistance={10}
      />

      {/* Loading indicator */}
      {isLoading && (
        <ViroText
          text="Loading Blueprint..."
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -2]}
          style={{ fontFamily: 'Arial', color: '#00ffff', fontSize: 20 }}
        />
      )}

      {/* Current 3D Model */}
      {currentBlueprint && !isLoading && (
        <Viro3DObject
          source={blueprints[currentBlueprint].model}
          scale={blueprints[currentBlueprint].scale}
          position={blueprints[currentBlueprint].position}
          type="GLTF"
          onLoad={handleModelLoad}
          onError={handleModelError}
          dragType="FixedDistance"
          onDrag={() => {}}
        />
      )}

      {/* UI Controls */}
      <ViroNode position={[0, -1, -2]} transformBehaviors={['billboard']}>
        {renderControls()}
      </ViroNode>

      {/* Voice Mode Indicator */}
      {isVoiceMode && (
        <ViroText
          text="🎤 Voice Mode Active"
          scale={[0.3, 0.3, 0.3]}
          position={[0, 2, -2]}
          style={{ fontFamily: 'Arial', color: '#ff00ff', fontSize: 16 }}
        />
      )}
    </ViroARScene>
  );

  const renderVRScene = () => (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={300} />
      <Viro360Image
        source={require('./assets/vr/360-office.jpg')}
        format="RGBA8"
      />

      {/* VR-specific UI */}
      {currentBlueprint && (
        <Viro3DObject
          source={blueprints[currentBlueprint].model}
          scale={blueprints[currentBlueprint].scale}
          position={[0, 1, -3]}
          type="GLTF"
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      )}

      <ViroNode position={[0, -2, -3]} transformBehaviors={['billboard']}>
        {renderControls()}
      </ViroNode>
    </ViroARScene>
  );

  const renderControls = () => (
    <>
      {/* Blueprint Selection Buttons */}
      <ViroButton
        position={[-2, 0, 0]}
        scale={[0.5, 0.5, 0.5]}
        onClick={() => loadBlueprint('warehouse')}
        materials={['warehouse']}
      >
        <ViroText
          text="Warehouse"
          scale={[0.2, 0.2, 0.2]}
          position={[0, 0, 0.01]}
          style={{ fontFamily: 'Arial', color: '#ffffff', fontSize: 12 }}
        />
      </ViroButton>

      <ViroButton
        position={[0, 0, 0]}
        scale={[0.5, 0.5, 0.5]}
        onClick={() => loadBlueprint('lofts')}
        materials={['lofts']}
      >
        <ViroText
          text="Lofts"
          scale={[0.2, 0.2, 0.2]}
          position={[0, 0, 0.01]}
          style={{ fontFamily: 'Arial', color: '#ffffff', fontSize: 12 }}
        />
      </ViroButton>

      <ViroButton
        position={[2, 0, 0]}
        scale={[0.5, 0.5, 0.5]}
        onClick={() => loadBlueprint('luxury')}
        materials={['luxury']}
      >
        <ViroText
          text="Luxury"
          scale={[0.2, 0.2, 0.2]}
          position={[0, 0, 0.01]}
          style={{ fontFamily: 'Arial', color: '#ffffff', fontSize: 12 }}
        />
      </ViroButton>

      {/* Voice Toggle */}
      <ViroButton
        position={[0, -1, 0]}
        scale={[0.4, 0.4, 0.4]}
        onClick={() => setIsVoiceMode(!isVoiceMode)}
        materials={[isVoiceMode ? 'voiceActive' : 'voiceInactive']}
      >
        <ViroText
          text={isVoiceMode ? "🎤 ON" : "🎤 OFF"}
          scale={[0.15, 0.15, 0.15]}
          position={[0, 0, 0.01]}
          style={{ fontFamily: 'Arial', color: '#ffffff', fontSize: 10 }}
        />
      </ViroButton>

      {/* Mode Switch */}
      <ViroButton
        position={[0, -2, 0]}
        scale={[0.4, 0.4, 0.4]}
        onClick={() => setArMode(arMode === 'AR' ? 'VR' : 'AR')}
        materials={['modeSwitch']}
      >
        <ViroText
          text={arMode === 'AR' ? "VR Mode" : "AR Mode"}
          scale={[0.15, 0.15, 0.15]}
          position={[0, 0, 0.01]}
          style={{ fontFamily: 'Arial', color: '#ffffff', fontSize: 10 }}
        />
      </ViroButton>
    </>
  );

  const onTrackingUpdated = (state) => {
    console.log('📍 AR Tracking state:', state);
    if (state === 'normal') {
      console.log('✅ AR Tracking initialized');
    }
  };

  // Mock voice command handler (would integrate with actual voice recognition)
  useEffect(() => {
    const mockVoiceCommands = [
      'show warehouse',
      'show lofts', 
      'show luxury',
      'ar mode',
      'vr mode',
      'help'
    ];

    // Simulate voice commands every 10 seconds for demo
    const interval = setInterval(() => {
      if (isVoiceMode) {
        const randomCommand = mockVoiceCommands[Math.floor(Math.random() * mockVoiceCommands.length)];
        handleVoiceCommand(randomCommand);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isVoiceMode]);

  return (
    <ViroARSceneNavigator
      initialScene={{ scene: arMode === 'VR' ? renderVRScene : renderARScene }}
      apiKey="YOUR_VIRO_API_KEY"
    />
  );
};

export default SynovaXRWorkspace;
