import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// XR/VR Context
interface XRContextType {
  isXRSupported: boolean;
  isVRSupported: boolean;
  isSessionActive: boolean;
  startXRSession: () => Promise<boolean>;
  stopXRSession: () => void;
  xrCapabilities: XRCapabilities;
}

interface XRCapabilities {
  handTracking: boolean;
  eyeTracking: boolean;
  spatialAudio: boolean;
  roomScale: boolean;
  passThrough: boolean;
  webXRSupport: boolean;
}

const XRContext = createContext<XRContextType | null>(null);

export function XRProvider({ children }: { children: React.ReactNode }) {
  const [isXRSupported, setIsXRSupported] = useState(false);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [xrCapabilities, setXRCapabilities] = useState<XRCapabilities>({
    handTracking: false,
    eyeTracking: false,
    spatialAudio: false,
    roomScale: false,
    passThrough: false,
    webXRSupport: false,
  });

  useEffect(() => {
    checkXRCapabilities();
  }, []);

  const checkXRCapabilities = async () => {
    try {
      // Check WebXR support
      if (Platform.OS === 'web' && 'xr' in navigator) {
        const xr = (navigator as any).xr;
        const isVRSupported = await xr.isSessionSupported('immersive-vr');
        const isARSupported = await xr.isSessionSupported('immersive-ar');
        
        setIsXRSupported(isVRSupported || isARSupported);
        setIsVRSupported(isVRSupported);
        
        setXRCapabilities({
          handTracking: true, // Most modern VR headsets support this
          eyeTracking: false, // Requires specific hardware
          spatialAudio: true,
          roomScale: true,
          passThrough: isARSupported,
          webXRSupport: true,
        });
      } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Mobile VR/AR capabilities
        setIsXRSupported(true);
        setIsVRSupported(false); // Mobile typically AR, not VR
        
        setXRCapabilities({
          handTracking: false,
          eyeTracking: false,
          spatialAudio: true,
          roomScale: false,
          passThrough: true, // AR on mobile
          webXRSupport: false,
        });
      }
    } catch (error) {
      console.warn('XR capability check failed:', error);
    }
  };

  const startXRSession = async (): Promise<boolean> => {
    try {
      if (!isXRSupported) {
        return false;
      }

      if (Platform.OS === 'web') {
        const xr = (navigator as any).xr;
        const session = await xr.requestSession('immersive-vr', {
          requiredFeatures: ['local'],
          optionalFeatures: ['hand-tracking', 'eye-tracking'],
        });
        
        setIsSessionActive(true);
        
        // Handle session end
        session.addEventListener('end', () => {
          setIsSessionActive(false);
        });
        
        return true;
      } else {
        // Mobile AR session
        setIsSessionActive(true);
        return true;
      }
    } catch (error) {
      console.error('Failed to start XR session:', error);
      return false;
    }
  };

  const stopXRSession = () => {
    setIsSessionActive(false);
  };

  const value: XRContextType = {
    isXRSupported,
    isVRSupported,
    isSessionActive,
    startXRSession,
    stopXRSession,
    xrCapabilities,
  };

  return (
    <XRContext.Provider value={value}>
      {children}
    </XRContext.Provider>
  );
}

export function useXR() {
  const context = useContext(XRContext);
  if (!context) {
    throw new Error('useXR must be used within XRProvider');
  }
  return context;
}

// XR Status Component
export function XRStatus() {
  const { isXRSupported, isVRSupported, isSessionActive, xrCapabilities } = useXR();

  if (!isXRSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>XR Not Supported</Text>
        <Text style={styles.subtitle}>Your device doesn't support XR/VR features</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isVRSupported ? 'VR Supported' : 'AR Supported'}
      </Text>
      <Text style={styles.subtitle}>
        Session: {isSessionActive ? 'Active' : 'Inactive'}
      </Text>
      
      <View style={styles.capabilities}>
        <Text style={styles.capabilityTitle}>Capabilities:</Text>
        {xrCapabilities.handTracking && <Text style={styles.capability}>✓ Hand Tracking</Text>}
        {xrCapabilities.eyeTracking && <Text style={styles.capability}>✓ Eye Tracking</Text>}
        {xrCapabilities.spatialAudio && <Text style={styles.capability}>✓ Spatial Audio</Text>}
        {xrCapabilities.roomScale && <Text style={styles.capability}>✓ Room Scale</Text>}
        {xrCapabilities.passThrough && <Text style={styles.capability}>✓ Pass-Through</Text>}
        {xrCapabilities.webXRSupport && <Text style={styles.capability}>✓ WebXR</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  capabilities: {
    marginTop: 8,
  },
  capabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  capability: {
    fontSize: 12,
    opacity: 0.8,
  },
});
