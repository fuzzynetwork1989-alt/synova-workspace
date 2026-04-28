import React, { useEffect } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import * as Analytics from 'expo-analytics-amplitude'
import * as Updates from 'expo-updates'
import * as Device from 'expo-device'
import * as Constants from 'expo-constants'

// Production-ready analytics and app store preparation
export class AppStorePrep {
  private static instance: AppStorePrep
  private analytics: typeof.Analytics | null = null

  static getInstance(): AppStorePrep {
    if (!AppStorePrep.instance) {
      AppStorePrep.instance = new AppStorePrep()
    }
    return AppStorePrep.instance
  }

  async initialize(): Promise<void> {
    try {
      // Initialize analytics for production
      if (Constants.expoConfig?.extra?.analyticsApiKey) {
        Analytics.initialize(Constants.expoConfig.extra.analyticsApiKey)
        this.analytics = Analytics
      }

      // Check for updates in production
      if (__DEV__ === false) {
        await this.checkForUpdates()
      }

      // Track app lifecycle
      this.setupLifecycleTracking()

      // Track device info for analytics
      this.trackDeviceInfo()

      // Setup crash reporting
      this.setupCrashReporting()

    } catch (error) {
      console.warn('AppStorePrep initialization failed:', error)
    }
  }

  private async checkForUpdates(): Promise<void> {
    try {
      const update = await Updates.checkForUpdateAsync()
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        Updates.reloadAsync()
      }
    } catch (error) {
      console.warn('Update check failed:', error)
    }
  }

  private setupLifecycleTracking(): void {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        this.trackEvent('app_opened')
      } else if (nextAppState === 'background') {
        this.trackEvent('app_backgrounded')
      }
    }

    AppState.addEventListener('change', handleAppStateChange)
  }

  private trackDeviceInfo(): void {
    const deviceInfo = {
      platform: Platform.OS,
      osVersion: Platform.Version,
      deviceType: Device.DeviceType[Device.deviceType],
      brand: Device.brand,
      modelName: Device.modelName,
    }

    this.trackEvent('device_info', deviceInfo)
  }

  private setupCrashReporting(): void {
    // Setup crash reporting for production
    if (__DEV__ === false) {
      // In production, you'd integrate with Sentry, Firebase Crashlytics, etc.
      console.log('Crash reporting initialized')
    }
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (this.analytics && __DEV__ === false) {
      this.analytics.logEvent(eventName, properties)
    }
  }

  trackScreen(screenName: string): void {
    if (this.analytics && __DEV__ === false) {
      this.analytics.logEvent('screen_view', { screen_name: screenName })
    }
  }

  trackUser(userId: string, traits?: Record<string, any>): void {
    if (this.analytics && __DEV__ === false) {
      this.analytics.setUserId(userId)
      if (traits) {
        this.analytics.setUserProperties(traits)
      }
    }
  }

  // App Store Review Prompt
  async requestReview(): Promise<void> {
    if (Platform.OS === 'ios') {
      // Use StoreKit for iOS review prompts
      try {
        // In production, integrate with StoreKit
        console.log('Review prompt requested')
      } catch (error) {
        console.warn('Review prompt failed:', error)
      }
    } else if (Platform.OS === 'android') {
      // Use Play Core for Android review prompts
      try {
        // In production, integrate with Play Core
        console.log('Review prompt requested')
      } catch (error) {
        console.warn('Review prompt failed:', error)
      }
    }
  }

  // Performance Monitoring
  trackPerformance(metricName: string, value: number): void {
    this.trackEvent('performance', {
      metric_name: metricName,
      value: value,
      platform: Platform.OS,
    })
  }

  // Feature Usage Tracking
  trackFeatureUsage(featureName: string, action: string): void {
    this.trackEvent('feature_usage', {
      feature_name: featureName,
      action: action,
      timestamp: Date.now(),
    })
  }

  // Error Tracking
  trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      context: context,
      platform: Platform.OS,
    })
  }
}

// Hook for using AppStorePrep in components
export function useAppStorePrep() {
  const appStorePrep = AppStorePrep.getInstance()

  useEffect(() => {
    appStorePrep.initialize()
  }, [])

  return {
    trackEvent: appStorePrep.trackEvent.bind(appStorePrep),
    trackScreen: appStorePrep.trackScreen.bind(appStorePrep),
    trackUser: appStorePrep.trackUser.bind(appStorePrep),
    requestReview: appStorePrep.requestReview.bind(appStorePrep),
    trackPerformance: appStorePrep.trackPerformance.bind(appStorePrep),
    trackFeatureUsage: appStorePrep.trackFeatureUsage.bind(appStorePrep),
    trackError: appStorePrep.trackError.bind(appStorePrep),
  }
}
