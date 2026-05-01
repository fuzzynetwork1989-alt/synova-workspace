import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from './theme'

interface ButtonProps {
  children: React.ReactNode
  onPress: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  style?: ViewStyle
}

export function Button({ children, onPress, variant = 'default', size = 'default', disabled = false, style }: ButtonProps) {
  const { colors } = useTheme()

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    }

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        }
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: colors.destructive,
        }
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        }
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        }
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        }
      default:
        return baseStyle
    }
  }

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    }

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          color: colors.primaryForeground,
        }
      case 'destructive':
        return {
          ...baseStyle,
          color: colors.destructiveForeground,
        }
      case 'outline':
        return {
          ...baseStyle,
          color: colors.foreground,
        }
      case 'secondary':
        return {
          ...baseStyle,
          color: colors.secondaryForeground,
        }
      case 'ghost':
        return {
          ...baseStyle,
          color: colors.foreground,
        }
      default:
        return baseStyle
    }
  }

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 12, paddingVertical: 8 }
      case 'lg':
        return { paddingHorizontal: 32, paddingVertical: 16 }
      case 'icon':
        return { padding: 8 }
      default:
        return { paddingHorizontal: 16, paddingVertical: 12 }
    }
  }

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: 14 }
      case 'lg':
        return { fontSize: 18 }
      default:
        return { fontSize: 16 }
    }
  }

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        getSizeStyle(),
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[getTextStyle(), getTextSize()]}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}
