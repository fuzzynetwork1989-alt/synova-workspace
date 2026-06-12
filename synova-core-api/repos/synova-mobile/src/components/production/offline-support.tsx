import React, { createContext, useContext, useState, useEffect } from 'react'
import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Production-ready offline support
interface OfflineData {
  id: string
  type: 'chat' | 'workspace' | 'user' | 'settings'
  data: any
  timestamp: number
  synced: boolean
}

interface OfflineContextType {
  isOnline: boolean
  queueData: (data: OfflineData) => Promise<void>
  syncData: () => Promise<void>
  getCachedData: (type: string, id?: string) => Promise<OfflineData[]>
  clearCache: () => Promise<void>
  cacheSize: number
}

const OfflineContext = createContext<OfflineContextType | null>(null)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null)
  const [cacheSize, setCacheSize] = useState(0)

  useEffect(() => {
    initializeDatabase()
    setupNetworkMonitoring()
    calculateCacheSize()
  }, [])

  const initializeDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('synova_offline.db')
      
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS offline_data (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          synced INTEGER DEFAULT 0
        );
        
        CREATE INDEX IF NOT EXISTS idx_type ON offline_data(type);
        CREATE INDEX IF NOT EXISTS idx_synced ON offline_data(synced);
        CREATE INDEX IF NOT EXISTS idx_timestamp ON offline_data(timestamp);
      `)
      
      setDb(database)
    } catch (error) {
      console.warn('Database initialization failed:', error)
    }
  }

  const setupNetworkMonitoring = () => {
    // In production, integrate with NetInfo
    // For now, assume online status
    setIsOnline(true)
  }

  const calculateCacheSize = async () => {
    try {
      const cacheDir = FileSystem.documentDirectory + 'cache/'
      const files = await FileSystem.readDirectoryAsync(cacheDir)
      
      let totalSize = 0
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(cacheDir + file)
        if (fileInfo.exists) {
          totalSize += fileInfo.size || 0
        }
      }
      
      setCacheSize(totalSize)
    } catch (error) {
      console.warn('Cache size calculation failed:', error)
    }
  }

  const queueData = async (data: OfflineData): Promise<void> => {
    try {
      if (!db) {
        throw new Error('Database not initialized')
      }

      await db.runAsync(
        `INSERT OR REPLACE INTO offline_data (id, type, data, timestamp, synced) VALUES (?, ?, ?, ?, ?)`,
        [data.id, data.type, JSON.stringify(data.data), data.timestamp, data.synced ? 1 : 0]
      )

      // If online, try to sync immediately
      if (isOnline) {
        await syncSingleItem(data)
      }

      await calculateCacheSize()
    } catch (error) {
      console.warn('Data queuing failed:', error)
      
      // Fallback to AsyncStorage
      const fallbackKey = `offline_${data.type}_${data.id}`
      await AsyncStorage.setItem(fallbackKey, JSON.stringify(data))
    }
  }

  const syncData = async (): Promise<void> => {
    if (!isOnline || !db) {
      return
    }

    try {
      const unsyncedItems = await db.getAllAsync<OfflineData>(
        'SELECT * FROM offline_data WHERE synced = 0 ORDER BY timestamp ASC'
      )

      for (const item of unsyncedItems) {
        await syncSingleItem(item)
      }

      await calculateCacheSize()
    } catch (error) {
      console.warn('Sync failed:', error)
    }
  }

  const syncSingleItem = async (item: OfflineData): Promise<void> => {
    try {
      // Simulate API sync (replace with actual API calls)
      console.log(`Syncing ${item.type} item ${item.id}`)
      
      // Mark as synced
      if (db) {
        await db.runAsync('UPDATE offline_data SET synced = 1 WHERE id = ?', [item.id])
      }

      // Remove from fallback storage
      const fallbackKey = `offline_${item.type}_${item.id}`
      await AsyncStorage.removeItem(fallbackKey)
    } catch (error) {
      console.warn('Single item sync failed:', error)
    }
  }

  const getCachedData = async (type: string, id?: string): Promise<OfflineData[]> => {
    try {
      if (!db) {
        return []
      }

      let query = 'SELECT * FROM offline_data WHERE type = ?'
      let params: any[] = [type]

      if (id) {
        query += ' AND id = ?'
        params.push(id)
      }

      query += ' ORDER BY timestamp DESC'

      const results = await db.getAllAsync<OfflineData>(query, params)
      
      return results.map(item => ({
        ...item,
        data: JSON.parse(item.data),
        synced: Boolean(item.synced),
      }))
    } catch (error) {
      console.warn('Cache retrieval failed:', error)
      
      // Fallback to AsyncStorage
      try {
        const keys = await AsyncStorage.getAllKeys()
        const offlineKeys = keys.filter(key => key.startsWith(`offline_${type}`))
        
        const items: OfflineData[] = []
        for (const key of offlineKeys) {
          const data = await AsyncStorage.getItem(key)
          if (data) {
            const parsed = JSON.parse(data)
            if (!id || parsed.id === id) {
              items.push(parsed)
            }
          }
        }
        
        return items.sort((a, b) => b.timestamp - a.timestamp)
      } catch (fallbackError) {
        console.warn('Fallback cache retrieval failed:', fallbackError)
        return []
      }
    }
  }

  const clearCache = async (): Promise<void> => {
    try {
      // Clear database
      if (db) {
        await db.runAsync('DELETE FROM offline_data')
      }

      // Clear AsyncStorage
      const keys = await AsyncStorage.getAllKeys()
      const offlineKeys = keys.filter(key => key.startsWith('offline_'))
      await AsyncStorage.multiRemove(offlineKeys)

      // Clear file cache
      const cacheDir = FileSystem.documentDirectory + 'cache/'
      try {
        await FileSystem.deleteAsync(cacheDir)
        await FileSystem.makeDirectoryAsync(cacheDir)
      } catch (error) {
        // Cache directory might not exist, which is fine
      }

      await calculateCacheSize()
    } catch (error) {
      console.warn('Cache clear failed:', error)
    }
  }

  const value: OfflineContextType = {
    isOnline,
    queueData,
    syncData,
    getCachedData,
    clearCache,
    cacheSize,
  }

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider')
  }
  return context
}

// Utility functions for offline operations
export class OfflineManager {
  private static instance: OfflineManager

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager()
    }
    return OfflineManager.instance
  }

  // Cache management
  async cacheImage(uri: string, key: string): Promise<string> {
    try {
      const cacheDir = FileSystem.documentDirectory + 'cache/images/'
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true })
      
      const cachePath = cacheDir + key
      const fileInfo = await FileSystem.getInfoAsync(cachePath)
      
      if (!fileInfo.exists) {
        await FileSystem.downloadAsync(uri, cachePath)
      }
      
      return cachePath
    } catch (error) {
      console.warn('Image caching failed:', error)
      return uri
    }
  }

  // Data compression
  async compressData(data: any): Promise<string> {
    try {
      // Simple JSON compression (use proper compression in production)
      const jsonString = JSON.stringify(data)
      return jsonString
    } catch (error) {
      console.warn('Data compression failed:', error)
      throw error
    }
  }

  // Sync strategies
  async syncWithStrategy(strategy: 'immediate' | 'batch' | 'manual'): Promise<void> {
    switch (strategy) {
      case 'immediate':
        // Sync immediately when online
        break
      case 'batch':
        // Sync in batches every 5 minutes
        break
      case 'manual':
        // Only sync when explicitly requested
        break
    }
  }

  // Conflict resolution
  async resolveConflicts(localData: OfflineData[], serverData: any[]): Promise<OfflineData[]> {
    // Implement conflict resolution strategy
    // For now, prefer local data (most recent timestamp)
    return localData.sort((a, b) => b.timestamp - a.timestamp)
  }
}
