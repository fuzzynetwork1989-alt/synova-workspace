import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from './theme'

interface GlassCardProps {
  children: React.ReactNode
  style?: ViewStyle
  variant?: 'default' | 'elevated' | 'compact' | 'floating'
  size?: 'default' | 'sm' | 'lg' | 'xl'
}

export function GlassCard({ children, style, variant = 'default', size = 'default' }: GlassCardProps) {
  const { colors } = useTheme()

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    }

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.4,
          shadowRadius: 32,
          elevation: 16,
        }
      case 'compact':
        return {
          ...baseStyle,
          borderRadius: 12,
          padding: 16,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }
      case 'floating':
        return {
          ...baseStyle,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.35,
          shadowRadius: 24,
          elevation: 12,
        }
      default:
        return {
          ...baseStyle,
          borderRadius: 16,
          padding: 24,
        }
    }
  }

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { padding: 12 }
      case 'lg':
        return { padding: 32 }
      case 'xl':
        return { padding: 48 }
      default:
        return { padding: 24 }
    }
  }

  return (
    <View style={[getCardStyle(), getSizeStyle(), style]}>
      {children}
    </View>
  )
}
