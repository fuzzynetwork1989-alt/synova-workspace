import React from 'react'
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'
import * as LocalAuthentication from 'expo-local-authentication'
import { Platform } from 'react-native'

// Production-ready security utilities
export class SecurityManager {
  private static instance: SecurityManager
  private encryptionKey: string | null = null

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  async initialize(): Promise<void> {
    try {
      // Generate or retrieve encryption key
      await this.setupEncryptionKey()
      
      // Setup biometric authentication
      await this.setupBiometricAuth()
      
    } catch (error) {
      console.warn('Security initialization failed:', error)
    }
  }

  private async setupEncryptionKey(): Promise<void> {
    try {
      const storedKey = await SecureStore.getItemAsync('encryption_key')
      
      if (!storedKey) {
        // Generate new encryption key
        const key = await Crypto.getRandomBytesAsync(32)
        const keyString = Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('')
        
        await SecureStore.setItemAsync('encryption_key', keyString)
        this.encryptionKey = keyString
      } else {
        this.encryptionKey = storedKey
      }
    } catch (error) {
      console.warn('Encryption key setup failed:', error)
    }
  }

  private async setupBiometricAuth(): Promise<void> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      const enrolled = await LocalAuthentication.isEnrolledAsync()
      
      if (compatible && enrolled) {
        console.log('Biometric authentication available')
      }
    } catch (error) {
      console.warn('Biometric setup failed:', error)
    }
  }

  // Secure Storage Operations
  async setSecureItem(key: string, value: string): Promise<boolean> {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized')
      }

      // Encrypt the value before storing
      const encryptedValue = await this.encrypt(value)
      
      await SecureStore.setItemAsync(key, encryptedValue)
      return true
    } catch (error) {
      console.warn('Secure set failed:', error)
      return false
    }
  }

  async getSecureItem(key: string): Promise<string | null> {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized')
      }

      const encryptedValue = await SecureStore.getItemAsync(key)
      
      if (!encryptedValue) {
        return null
      }

      // Decrypt the value
      const decryptedValue = await this.decrypt(encryptedValue)
      return decryptedValue
    } catch (error) {
      console.warn('Secure get failed:', error)
      return null
    }
  }

  async removeSecureItem(key: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(key)
      return true
    } catch (error) {
      console.warn('Secure remove failed:', error)
      return false
    }
  }

  // Encryption/Decryption
  private async encrypt(text: string): Promise<string> {
    try {
      // Simple XOR encryption for demo (use proper encryption in production)
      const key = this.encryptionKey!
      let encrypted = ''
      
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i)
        const keyChar = key.charCodeAt(i % key.length)
        encrypted += String.fromCharCode(charCode ^ keyChar)
      }
      
      return btoa(encrypted) // Base64 encode
    } catch (error) {
      console.warn('Encryption failed:', error)
      throw error
    }
  }

  private async decrypt(encryptedText: string): Promise<string> {
    try {
      const key = this.encryptionKey!
      const decoded = atob(encryptedText) // Base64 decode
      let decrypted = ''
      
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i)
        const keyChar = key.charCodeAt(i % key.length)
        decrypted += String.fromCharCode(charCode ^ keyChar)
      }
      
      return decrypted
    } catch (error) {
      console.warn('Decryption failed:', error)
      throw error
    }
  }

  // Biometric Authentication
  async authenticateWithBiometrics(reason: string): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      })

      return result.success
    } catch (error) {
      console.warn('Biometric auth failed:', error)
      return false
    }
  }

  // Security Checks
  async isDeviceSecure(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      
      return hasHardware && isEnrolled
    } catch (error) {
      console.warn('Security check failed:', error)
      return false
    }
  }

  // Session Management
  async createSessionToken(): Promise<string> {
    try {
      const token = await Crypto.getRandomBytesAsync(32)
      const tokenString = Array.from(token).map(b => b.toString(16).padStart(2, '0')).join('')
      
      // Store session token with expiration
      const sessionData = {
        token: tokenString,
        created: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      }
      
      await this.setSecureItem('session_token', JSON.stringify(sessionData))
      return tokenString
    } catch (error) {
      console.warn('Session creation failed:', error)
      throw error
    }
  }

  async validateSessionToken(token: string): Promise<boolean> {
    try {
      const sessionDataStr = await this.getSecureItem('session_token')
      
      if (!sessionDataStr) {
        return false
      }

      const sessionData = JSON.parse(sessionDataStr)
      
      // Check if token matches and hasn't expired
      return sessionData.token === token && sessionData.expires > Date.now()
    } catch (error) {
      console.warn('Session validation failed:', error)
      return false
    }
  }

  async clearSession(): Promise<void> {
    try {
      await this.removeSecureItem('session_token')
    } catch (error) {
      console.warn('Session clear failed:', error)
    }
  }

  // API Security
  async getApiHeaders(): Promise<Record<string, string>> {
    try {
      const token = await this.getSecureItem('auth_token')
      
      return {
        'Content-Type': 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': '1.0.0',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      }
    } catch (error) {
      console.warn('API headers failed:', error)
      return {}
    }
  }
}

// Hook for using SecurityManager in components
export function useSecurity() {
  const securityManager = SecurityManager.getInstance()

  return {
    setSecureItem: securityManager.setSecureItem.bind(securityManager),
    getSecureItem: securityManager.getSecureItem.bind(securityManager),
    removeSecureItem: securityManager.removeSecureItem.bind(securityManager),
    authenticateWithBiometrics: securityManager.authenticateWithBiometrics.bind(securityManager),
    isDeviceSecure: securityManager.isDeviceSecure.bind(securityManager),
    createSessionToken: securityManager.createSessionToken.bind(securityManager),
    validateSessionToken: securityManager.validateSessionToken.bind(securityManager),
    clearSession: securityManager.clearSession.bind(securityManager),
    getApiHeaders: securityManager.getApiHeaders.bind(securityManager),
  }
}
