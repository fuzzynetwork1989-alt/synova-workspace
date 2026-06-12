import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  colors: typeof lightTheme
}

const lightTheme = {
  background: '#ffffff',
  foreground: '#000000',
  card: '#f8fafc',
  cardForeground: '#0f172a',
  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  muted: '#f8fafc',
  mutedForeground: '#64748b',
  accent: '#f1f5f9',
  accentForeground: '#0f172a',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#3b82f6',
}

const darkTheme = {
  background: '#0f172a',
  foreground: '#f8fafc',
  card: '#1e293b',
  cardForeground: '#f8fafc',
  primary: '#60a5fa',
  primaryForeground: '#0f172a',
  secondary: '#334155',
  secondaryForeground: '#f8fafc',
  muted: '#1e293b',
  mutedForeground: '#94a3b8',
  accent: '#334155',
  accentForeground: '#f8fafc',
  destructive: '#f87171',
  destructiveForeground: '#0f172a',
  border: '#334155',
  input: '#334155',
  ring: '#60a5fa',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>('system')

  const getColors = () => {
    if (theme === 'system') {
      return systemTheme === 'dark' ? darkTheme : lightTheme
    }
    return theme === 'dark' ? darkTheme : lightTheme
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: getColors() }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
