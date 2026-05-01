import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

interface HoloObject3D {
  id: string;
  name: string;
  type: 'model' | 'text' | 'image' | 'video' | 'chart' | 'whiteboard' | 'screen';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  geometry: {
    type: 'box' | 'sphere' | 'cylinder' | 'plane' | 'custom';
    params: any;
  };
  material: {
    type: 'standard' | 'physical' | 'basic' | 'glass' | 'hologram' | 'emissive';
    color: string;
    metalness?: number;
    roughness?: number;
    opacity?: number;
    emissive?: string;
    texture?: string;
    normalMap?: string;
    roughnessMap?: string;
    metalnessMap?: string;
  };
  animation?: {
    type: 'rotation' | 'position' | 'scale' | 'morph';
    duration: number;
    loop: boolean;
    params: any;
  };
  physics?: {
    mass: number;
    friction: number;
    restitution: number;
    gravity: boolean;
    collision: boolean;
  };
  interaction?: {
    grabbable: boolean;
    clickable: boolean;
    hoverable: boolean;
    gestures: string[];
  };
  lighting?: {
    castShadow: boolean;
    receiveShadow: boolean;
    selfIllumination: boolean;
  };
}

interface HoloSpace3D {
  id: string;
  name: string;
  environment: {
    skybox?: string;
    lighting: {
      ambient: { color: string; intensity: number };
      directional: { color: string; intensity: number; position: { x: number; y: number; z: number } };
      point: Array<{ color: string; intensity: number; position: { x: number; y: number; z: number } }>;
      spot: Array<{ color: string; intensity: number; position: { x: number; y: number; z: number; target: { x: number; y: number; z: number } } }>;
    };
    physics: {
      gravity: { x: number; y: number; z: number };
      bounds: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } };
    };
    audio: {
      ambient: string;
      spatial: boolean;
      volume: number;
    };
  };
  objects: HoloObject3D[];
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    isActive: boolean;
  }>;
}

interface RenderingConfig {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  shadows: boolean;
  reflections: boolean;
  postProcessing: boolean;
  antialiasing: number;
  renderScale: number;
  frameRate: number;
  lod: boolean;
  culling: boolean;
  batching: boolean;
  instancing: boolean;
}

export function HoloArchitect3D() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<HoloSpace3D | null>(null);
  const [renderingConfig, setRenderingConfig] = useState<RenderingConfig>({
    quality: Platform.OS === 'ios' ? 'high' : 'ultra',
    shadows: true,
    reflections: true,
    postProcessing: true,
    antialiasing: 8,
    renderScale: 1.5,
    frameRate: 90,
    lod: true,
    culling: true,
    batching: true,
    instancing: true
  });
  
  const [selectedObject, setSelectedObject] = useState<HoloObject3D | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEngine, setAudioEngine] = useState<Audio.Sound | null>(null);
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    drawCalls: 0,
    triangles: 0,
    memory: 0,
    cpu: 0
  });
  
  const holoRendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    initializeHoloArchitect();
    return () => {
      cleanupHoloArchitect();
    };
  }, []);

  const initializeHoloArchitect = async () => {
    try {
      // Initialize 3D rendering engine
      const renderer = await HoloRenderer.initialize({
        canvas: '#holo-canvas',
        antialias: renderingConfig.antialiasing,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
      
      holoRendererRef.current = renderer;
      
      // Set up scene
      const scene = new HoloScene();
      sceneRef.current = scene;
      
      // Configure rendering
      await configureRendering();
      
      // Create default space
      await createDefaultSpace();
      
      // Initialize audio
      await initializeAudio();
      
      // Start rendering loop
      startRenderingLoop();
      
      setIsInitialized(true);
      console.log('Holo-Architect 3D initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Holo-Architect 3D:', error);
      Alert.alert('Initialization Error', 'Failed to initialize 3D rendering engine');
    }
  };

  const configureRendering = async () => {
    if (!holoRendererRef.current) return;
    
    const renderer = holoRendererRef.current;
    
    // Configure quality settings
    renderer.setQuality(renderingConfig.quality);
    renderer.setPixelRatio(renderingConfig.renderScale);
    
    // Configure shadows
    renderer.shadowMap.enabled = renderingConfig.shadows;
    renderer.shadowMap.type = 'PCFSoft';
    renderer.shadowMap.width = 2048;
    renderer.shadowMap.height = 2048;
    
    // Configure reflections
    if (renderingConfig.reflections) {
      renderer.toneMapping.type = 'ACESFilmicToneMapping';
      renderer.toneMapping.exposure = 1.0;
    }
    
    // Configure post-processing
    if (renderingConfig.postProcessing) {
      await setupPostProcessing();
    }
    
    // Configure performance optimizations
    renderer.setLOD(renderingConfig.lod);
    renderer.setFrustumCulling(renderingConfig.culling);
    renderer.setBatching(renderingConfig.batching);
    renderer.setInstancing(renderingConfig.instancing);
  };

  const setupPostProcessing = async () => {
    if (!holoRendererRef.current) return;
    
    const renderer = holoRendererRef.current;
    
    // Add post-processing effects
    const composer = new HoloEffectComposer(renderer);
    
    // Add bloom effect
    const bloom = new HoloBloomEffect({
      threshold: 0.5,
      intensity: 0.8,
      radius: 0.4
    });
    composer.addEffect(bloom);
    
    // Add depth of field
    const dof = new HoloDepthOfFieldEffect({
      focus: 10.0,
      aperture: 0.1,
      maxBlur: 0.02
    });
    composer.addEffect(dof);
    
    // Add screen space reflections
    const ssr = new HoloSSREffect({
      intensity: 0.5,
    });
    composer.addEffect(ssr);
    
    // Add ambient occlusion
    const ssao = new HoloSSAOEffect({
      kernelRadius: 0.8,
      minDistance: 0.005,
      maxDistance: 0.02
    });
    composer.addEffect(ssao);
    
    renderer.setComposer(composer);
  };

  const createDefaultSpace = async () => {
    const defaultSpace: HoloSpace3D = {
      id: 'default-space',
      name: 'Default Holo Space',
      environment: {
        skybox: 'textures/holo-skybox.jpg',
        lighting: {
          ambient: { color: '#ffffff', intensity: 0.4 },
          directional: { color: '#ffffff', intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
          point: [
            { color: '#ff6b6b', intensity: 0.5, position: { x: -5, y: 3, z: 0 } },
            { color: '#4ecdc4', intensity: 0.5, position: { x: 5, y: 3, z: 0 } },
            { color: '#45b7d1', intensity: 0.5, position: { x: 0, y: 3, z: -5 } }
          ],
          spot: [
            { color: '#ffffff', intensity: 1.0, position: { x: 0, y: 8, z: 0 }, target: { x: 0, y: 0, z: 0 } }
          ]
        },
        physics: {
          gravity: { x: 0, y: -9.8, z: 0 },
          bounds: { min: { x: -10, y: -5, z: -10 }, max: { x: 10, y: 10, z: 10 } }
        },
        audio: {
          ambient: 'sounds/holo-ambient.mp3',
          spatial: true,
          volume: 0.3
        }
      },
      objects: await createDefaultObjects(),
      participants: []
    };
    
    await loadSpace(defaultSpace);
    setCurrentSpace(defaultSpace);
  };

  const createDefaultObjects = async (): Promise<HoloObject3D[]> => {
    const objects: HoloObject3D[] = [];
    
    // Create main platform
    objects.push({
      id: 'main-platform',
      name: 'Main Platform',
      type: 'model',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 10, y: 0.5, z: 10 },
      geometry: {
        type: 'box',
        params: { width: 10, height: 0.5, depth: 10 }
      },
      material: {
        type: 'physical',
        color: '#e0e0e0',
        metalness: 0.1,
        roughness: 0.8,
        opacity: 1
      },
      physics: {
        mass: 0,
        friction: 0.8,
        restitution: 0.2,
        gravity: false,
        collision: true
      },
      interaction: {
        grabbable: false,
        clickable: true,
        hoverable: true,
        gestures: ['tap', 'longpress']
      },
      lighting: {
        castShadow: true,
        receiveShadow: true,
        selfIllumination: false
      }
    });
    
    // Create holographic screen
    objects.push({
      id: 'holo-screen',
      name: 'Holographic Screen',
      type: 'screen',
      position: { x: 0, y: 2, z: -3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 4, y: 2.5, z: 0.1 },
      geometry: {
        type: 'plane',
        params: { width: 4, height: 2.5 }
      },
      material: {
        type: 'hologram',
        color: '#00ffff',
        opacity: 0.8,
        emissive: '#00ffff',
        texture: 'textures/holo-grid.png'
      },
      animation: {
        type: 'position',
        duration: 4,
        loop: true,
        params: { amplitude: 0.2, frequency: 0.5 }
      },
      physics: {
        mass: 0,
        friction: 0.5,
        restitution: 0.3,
        gravity: false,
        collision: false
      },
      interaction: {
        grabbable: true,
        clickable: true,
        hoverable: true,
        gestures: ['tap', 'swipe', 'pinch']
      },
      lighting: {
        castShadow: false,
        receiveShadow: true,
        selfIllumination: true
      }
    });
    
    // Create data visualization globe
    objects.push({
      id: 'data-globe',
      name: 'Data Globe',
      type: 'chart',
      position: { x: 3, y: 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      geometry: {
        type: 'sphere',
        params: { radius: 1 }
      },
      material: {
        type: 'emissive',
        color: '#4ecdc4',
        opacity: 0.9,
        emissive: '#4ecdc4',
        texture: 'textures/earth-texture.jpg',
        normalMap: 'textures/earth-normal.jpg'
      },
      animation: {
        type: 'rotation',
        duration: 20,
        loop: true,
        params: { axis: 'y', speed: 0.1 }
      },
      physics: {
        mass: 0,
        friction: 0.1,
        restitution: 0.5,
        gravity: false,
        collision: false
      },
      interaction: {
        grabbable: true,
        clickable: true,
        hoverable: true,
        gestures: ['rotate', 'scale', 'tap']
      },
      lighting: {
        castShadow: true,
        receiveShadow: false,
        selfIllumination: true
      }
    });
    
    // Create interactive whiteboard
    objects.push({
      id: 'holo-whiteboard',
      name: 'Holo Whiteboard',
      type: 'whiteboard',
      position: { x: -3, y: 2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 2, y: 1.5, z: 0.1 },
      geometry: {
        type: 'plane',
        params: { width: 2, height: 1.5 }
      },
      material: {
        type: 'glass',
        color: '#ffffff',
        opacity: 0.1,
        texture: 'textures/whiteboard-texture.jpg'
      },
      physics: {
        mass: 0,
        friction: 0.5,
        restitution: 0.3,
        gravity: false,
        collision: false
      },
      interaction: {
        grabbable: true,
        clickable: true,
        hoverable: true,
        gestures: ['draw', 'write', 'erase', 'clear']
      },
      lighting: {
        castShadow: false,
        receiveShadow: true,
        selfIllumination: false
      }
    });
    
    // Create floating text panels
    for (let i = 0; i < 5; i++) {
      objects.push({
        id: `text-panel-${i}`,
        name: `Text Panel ${i + 1}`,
        type: 'text',
        position: { 
          x: Math.cos((i / 5) * Math.PI * 2) * 4, 
          y: 2.5, 
          z: Math.sin((i / 5) * Math.PI * 2) * 4 
        },
        rotation: { x: 0, y: (i / 5) * Math.PI * 2, z: 0 },
        scale: { x: 0.8, y: 0.6, z: 0.1 },
        geometry: {
          type: 'plane',
          params: { width: 0.8, height: 0.6 }
        },
        material: {
          type: 'emissive',
          color: '#ff6b6b',
          opacity: 0.9,
          emissive: '#ff6b6b'
        },
        animation: {
          type: 'position',
          duration: 3,
          loop: true,
          params: { amplitude: 0.3, frequency: 0.3 }
        },
        physics: {
          mass: 0,
          friction: 0.1,
          restitution: 0.5,
          gravity: false,
          collision: false
        },
        interaction: {
          grabbable: true,
          clickable: true,
          hoverable: true,
          gestures: ['tap', 'edit', 'move']
        },
        lighting: {
          castShadow: false,
          receiveShadow: false,
          selfIllumination: true
        }
      });
    }
    
    return objects;
  };

  const loadSpace = async (space: HoloSpace3D) => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Clear existing scene
    scene.clear();
    
    // Set up environment
    await setupEnvironment(space.environment);
    
    // Load objects
    for (const objectData of space.objects) {
      const object = await createObject(objectData);
      scene.add(object);
    }
    
    // Set up physics
    await setupPhysics(space.physics);
    
    // Set up audio
    await setupAudio(space.audio);
    
    console.log(`Loaded space: ${space.name}`);
  };

  const setupEnvironment = async (environment: HoloSpace3D['environment']) => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Set skybox
    if (environment.skybox) {
      const skybox = await HoloTextureLoader.load(environment.skybox);
      scene.background = skybox;
      scene.environment = skybox;
    }
    
    // Set up lighting
    scene.ambientLight = new HoloAmbientLight(environment.lighting.ambient.color, environment.lighting.ambient.intensity);
    
    // Add directional light
    const directionalLight = new HoloDirectionalLight(environment.lighting.directional.color);
    directionalLight.position.set(environment.lighting.directional.position.x, environment.lighting.directional.position.y, environment.lighting.directional.position.z);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add point lights
    environment.lighting.point.forEach((lightData, index) => {
      const pointLight = new HoloPointLight(lightData.color, lightData.intensity);
      pointLight.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
      pointLight.castShadow = true;
      scene.add(pointLight);
    });
    
    // Add spot lights
    environment.lighting.spot.forEach((lightData, index) => {
      const spotLight = new HoloSpotLight(lightData.color, lightData.intensity);
      spotLight.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
      spotLight.target.position.set(lightData.target.x, lightData.target.y, lightData.target.z);
      spotLight.castShadow = true;
      scene.add(spotLight);
    });
  };

  const createObject = async (objectData: HoloObject3D): Promise<any> => {
    let geometry: any;
    let material: any;
    let object: any;
    
    // Create geometry
    switch (objectData.geometry.type) {
      case 'box':
        geometry = new HoloBoxGeometry(
          objectData.geometry.params.width,
          objectData.geometry.params.height,
          objectData.geometry.params.depth
        );
        break;
      case 'sphere':
        geometry = new HoloSphereGeometry(
          objectData.geometry.params.radius,
          32,
          32
        );
        break;
      case 'cylinder':
        geometry = new HoloCylinderGeometry(
          objectData.geometry.params.radiusTop,
          objectData.geometry.params.radiusBottom,
          objectData.geometry.params.height
        );
        break;
      case 'plane':
        geometry = new HoloPlaneGeometry(
          objectData.geometry.params.width,
          objectData.geometry.params.height
        );
        break;
      case 'custom':
        geometry = await HoloGLTFLoader.load(objectData.geometry.params.modelUrl);
        break;
    }
    
    // Create material
    switch (objectData.material.type) {
      case 'standard':
        material = new HoloMeshStandardMaterial({
          color: objectData.material.color,
          metalness: objectData.material.metalness || 0.0,
          roughness: objectData.material.roughness || 1.0,
          opacity: objectData.material.opacity || 1.0,
          transparent: objectData.material.opacity && objectData.material.opacity < 1
        });
        break;
      case 'physical':
        material = new HoloMeshPhysicalMaterial({
          color: objectData.material.color,
          metalness: objectData.material.metalness || 0.0,
          roughness: objectData.material.roughness || 1.0,
          opacity: objectData.material.opacity || 1.0,
          transparent: objectData.material.opacity && objectData.material.opacity < 1
        });
        break;
      case 'glass':
        material = new HoloMeshPhysicalMaterial({
          color: objectData.material.color,
          metalness: 0.0,
          roughness: 0.0,
          opacity: objectData.material.opacity || 0.8,
          transparent: true,
          transmission: 0.9,
          thickness: 0.5
        });
        break;
      case 'hologram':
        material = new HoloMeshPhysicalMaterial({
          color: objectData.material.color,
          emissive: objectData.material.emissive || objectData.material.color,
          opacity: objectData.material.opacity || 0.8,
          transparent: true,
          transmission: 0.5,
          thickness: 0.1
        });
        break;
      case 'emissive':
        material = new HoloMeshBasicMaterial({
          color: objectData.material.color,
          emissive: objectData.material.emissive || objectData.material.color,
          opacity: objectData.material.opacity || 1.0,
          transparent: objectData.material.opacity && objectData.material.opacity < 1
        });
        break;
    }
    
    // Add textures if specified
    if (objectData.material.texture) {
      const texture = await HoloTextureLoader.load(objectData.material.texture);
      material.map = texture;
    }
    
    if (objectData.material.normalMap) {
      const normalMap = await HoloTextureLoader.load(objectData.material.normalMap);
      material.normalMap = normalMap;
    }
    
    if (objectData.material.roughnessMap) {
      const roughnessMap = await HoloTextureLoader.load(objectData.material.roughnessMap);
      material.roughnessMap = roughnessMap;
    }
    
    if (objectData.material.metalnessMap) {
      const metalnessMap = await HoloTextureLoader.load(objectData.material.metalnessMap);
      material.metalnessMap = metalnessMap;
    }
    
    // Create mesh
    object = new HoloMesh(geometry, material);
    
    // Set transform
    object.position.set(objectData.position.x, objectData.position.y, objectData.position.z);
    object.rotation.set(
      objectData.rotation.x * Math.PI / 180,
      objectData.rotation.y * Math.PI / 180,
      objectData.rotation.z * Math.PI / 180
    );
    object.scale.set(objectData.scale.x, objectData.scale.y, objectData.scale.z);
    
    // Set up physics
    if (objectData.physics) {
      object.userData.physics = objectData.physics;
      object.userData.velocity = { x: 0, y: 0, z: 0 };
      object.userData.angularVelocity = { x: 0, y: 0, z: 0 };
    }
    
    // Set up interaction
    if (objectData.interaction) {
      object.userData.interaction = objectData.interaction;
      object.userData.isGrabbable = objectData.interaction.grabbable;
      object.userData.isClickable = objectData.interaction.clickable;
      object.userData.isHoverable = objectData.interaction.hoverable;
      object.userData.gestures = objectData.interaction.gestures;
    }
    
    // Set up animation
    if (objectData.animation) {
      object.userData.animation = objectData.animation;
      object.userData.animationTime = 0;
    }
    
    // Set up lighting
    if (objectData.lighting) {
      object.castShadow = objectData.lighting.castShadow;
      object.receiveShadow = objectData.lighting.receiveShadow;
    }
    
    // Store original data
    object.userData.originalData = objectData;
    
    return object;
  };

  const setupPhysics = async (physics: HoloSpace3D['physics']) => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Set up physics world
    const physicsWorld = new HoloPhysicsWorld();
    physicsWorld.gravity.set(physics.gravity.x, physics.gravity.y, physics.gravity.z);
    physicsWorld.setBounds(physics.bounds.min, physics.bounds.max);
    
    scene.userData.physics = physicsWorld;
  };

  const setupAudio = async (audio: HoloSpace3D['audio']) => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Load ambient audio
    if (audio.ambient) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio.ambient },
        { shouldPlay: true, isLooping: true, volume: audio.volume }
      );
      scene.userData.ambientAudio = sound;
    }
    
    // Set up spatial audio
    if (audio.spatial) {
      const audioContext = new HoloAudioContext();
      scene.userData.audioContext = audioContext;
    }
  };

  const startRenderingLoop = () => {
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (holoRendererRef.current && sceneRef.current) {
        // Update animations
        updateAnimations();
        
        // Update physics
        updatePhysics();
        
        // Update performance stats
        updatePerformanceStats();
        
        // Render scene
        holoRendererRef.current.render(sceneRef.current, holoRendererRef.current.camera);
      }
    };
    
    animate();
  };

  const updateAnimations = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const currentTime = Date.now() / 1000;
    
    scene.traverse((object: any) => {
      if (object.userData.animation) {
        const animation = object.userData.animation;
        const time = currentTime - object.userData.animationTime;
        
        switch (animation.type) {
          case 'rotation':
            const rotationSpeed = animation.params.speed || 0.1;
            const rotationAxis = animation.params.axis || 'y';
            object.rotation[rotationAxis] += rotationSpeed * 0.016;
            break;
          case 'position':
            const amplitude = animation.params.amplitude || 0.1;
            const frequency = animation.params.frequency || 0.5;
            const offset = Math.sin(time * frequency * Math.PI * 2) * amplitude;
            object.position.y += offset * 0.016;
            break;
          case 'scale':
            const scaleAmplitude = animation.params.amplitude || 0.1;
            const scaleFrequency = animation.params.frequency || 0.3;
            const scaleOffset = Math.sin(time * scaleFrequency * Math.PI * 2) * scaleAmplitude;
            object.scale.multiplyScalar(1 + scaleOffset * 0.016);
            break;
        }
        
        if (!animation.loop && time > animation.duration) {
          object.userData.animation = null;
        }
      }
    });
  };

  const updatePhysics = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const physicsWorld = scene.userData.physics;
    
    if (!physicsWorld) return;
    
    scene.traverse((object: any) => {
      if (object.userData.physics) {
        const physics = object.userData.physics;
        
        if (physics.gravity) {
          // Apply gravity
          object.userData.velocity.y += physicsWorld.gravity.y * 0.016;
        }
        
        // Update position
        object.position.x += object.userData.velocity.x * 0.016;
        object.position.y += object.userData.velocity.y * 0.016;
        object.position.z += object.userData.velocity.z * 0.016;
        
        // Update rotation
        object.rotation.x += object.userData.angularVelocity.x * 0.016;
        object.rotation.y += object.userData.angularVelocity.y * 0.016;
        object.rotation.z += object.userData.angularVelocity.z * 0.016;
        
        // Check boundaries
        if (physics.collision) {
          physicsWorld.checkCollision(object);
        }
        
        // Apply damping
        object.userData.velocity.x *= 0.99;
        object.userData.velocity.y *= 0.99;
        object.userData.velocity.z *= 0.99;
        object.userData.angularVelocity.x *= 0.98;
        object.userData.angularVelocity.y *= 0.98;
        object.userData.angularVelocity.z *= 0.98;
      }
    });
  };

  const updatePerformanceStats = () => {
    if (!holoRendererRef.current) return;
    
    const renderer = holoRendererRef.current;
    const info = renderer.info;
    
    setPerformanceStats({
      fps: Math.round(1000 / info.render.frame),
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      memory: info.memory.geometries,
      cpu: 0 // Would need to implement CPU monitoring
    });
  };

  const cleanupHoloArchitect = async () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioEngine) {
      await audioEngine.unloadAsync();
    }
    
    if (holoRendererRef.current) {
      holoRendererRef.current.dispose();
    }
    
    if (sceneRef.current) {
      sceneRef.current.dispose();
    }
  };

  const handleObjectInteraction = (objectId: string, interaction: string) => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const object = scene.getObjectByName(objectId);
    
    if (!object || !object.userData.interaction) return;
    
    switch (interaction) {
      case 'grab':
        object.userData.isGrabbable = true;
        break;
      case 'release':
        object.userData.isGrabbable = false;
        break;
      case 'click':
        if (object.userData.isClickable) {
          handleObjectClick(object);
        }
        break;
      case 'hover':
        if (object.userData.isHoverable) {
          handleObjectHover(object);
        }
        break;
    }
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleObjectClick = (object: any) => {
    console.log('Object clicked:', object.name);
    
    // Handle different object types
    switch (object.userData.originalData.type) {
      case 'screen':
        // Handle screen interaction
        break;
      case 'whiteboard':
        // Handle whiteboard interaction
        break;
      case 'chart':
        // Handle chart interaction
        break;
      default:
        // Handle generic interaction
        break;
    }
  };

  const handleObjectHover = (object: any) => {
    console.log('Object hovered:', object.name);
    
    // Add hover effect
    const material = object.material;
    if (material.emissive) {
      material.emissiveIntensity = 0.5;
    }
  };

  const startRecording = async () => {
    try {
      if (holoRendererRef.current) {
        await holoRendererRef.current.startRecording({
          format: 'mp4',
          quality: 'high',
          frameRate: 60
        });
        setIsRecording(true);
        Alert.alert('Recording Started', '3D scene recording started');
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (holoRendererRef.current) {
        const recording = await holoRendererRef.current.stopRecording();
        
        // Save recording
        const fileName = `holo-recording-${Date.now()}.mp4`;
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, recording, {
          encoding: FileSystem.EncodingType.Base64
        });
        
        setIsRecording(false);
        Alert.alert('Recording Stopped', `Recording saved as ${fileName}`);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to stop recording');
    }
  };

  const renderControls = () => (
    <View style={styles.controls}>
      <Text style={styles.controlsTitle}>3D Holo-Architect Controls</Text>
      
      <View style={styles.controlRow}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={startRecording}
          disabled={isRecording}
        >
          <Text style={styles.controlButtonText}>
            {isRecording ? 'Recording...' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={stopRecording}
          disabled={!isRecording}
        >
          <Text style={styles.controlButtonText}>Stop Recording</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.qualityControls}>
        <Text style={styles.qualityTitle}>Rendering Quality</Text>
        <View style={styles.qualityButtons}>
          {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
            <TouchableOpacity
              key={quality}
              style={[
                styles.qualityButton,
                renderingConfig.quality === quality && styles.activeQuality
              ]}
              onPress={() => setRenderingConfig({ ...renderingConfig, quality })}
            >
              <Text style={styles.qualityButtonText}>{quality}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.performanceStats}>
        <Text style={styles.statsTitle}>Performance Stats</Text>
        <Text style={styles.statText}>FPS: {performanceStats.fps}</Text>
        <Text style={styles.statText}>Draw Calls: {performanceStats.drawCalls}</Text>
        <Text style={styles.statText}>Triangles: {performanceStats.triangles}</Text>
        <Text style={styles.statText}>Memory: {performanceStats.memory}MB</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3D Holo-Architect</Text>
      <Text style={styles.subtitle}>Advanced 3D Rendering for VR/XR/AR</Text>
      
      {isInitialized ? (
        <View style={styles.content}>
          <View style={styles.canvasContainer}>
            <View style={styles.canvasPlaceholder}>
              <Text style={styles.canvasText}>3D Rendering Canvas</Text>
              <Text style={styles.canvasSubtext}>Meta Quest 3 Optimized</Text>
            </View>
          </View>
          
          {renderControls()}
        </View>
      ) : (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Initializing 3D Engine...</Text>
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
  content: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  canvasPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  canvasSubtext: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  controls: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  controlButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  qualityControls: {
    marginBottom: 15,
  },
  qualityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  qualityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  qualityButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeQuality: {
    backgroundColor: '#4CAF50',
  },
  performanceStats: {
    marginTop: 15,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statText: {
    fontSize: 14,
    marginBottom: 5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});
