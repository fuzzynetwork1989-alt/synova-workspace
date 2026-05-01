export default {
  name: 'Synova AI',
  slug: 'synova-ai',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.synova.ai',
    buildNumber: '1.0.0',
    infoPlist: {
      NSCameraUsageDescription: 'This app uses camera for profile pictures and document scanning',
      NSMicrophoneUsageDescription: 'This app uses microphone for voice chat and AI interactions',
      NSLocationWhenInUseUsageDescription: 'This app uses location for workspace features',
      NSFaceIDUsageDescription: 'This app uses Face ID for secure authentication',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.synova.ai',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'RECORD_AUDIO',
      'ACCESS_FINE_LOCATION',
      'USE_FINGERPRINT',
      'USE_BIOMETRIC',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    [
      'expo-updates',
      {
        username: 'synova-ai',
      },
    ],
    [
      'expo-analytics-amplitude',
      {
        apiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      },
    ],
    'expo-secure-store',
    'expo-local-authentication',
    'expo-splash-screen',
    'expo-status-bar',
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
    analyticsApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    wsBaseUrl: process.env.EXPO_PUBLIC_WS_BASE_URL,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id',
    fallbackToCacheTimeout: 0,
  },
  owner: 'synova-ai',
}
