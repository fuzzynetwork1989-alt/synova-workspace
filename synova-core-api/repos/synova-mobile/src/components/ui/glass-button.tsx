import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native'
import { useTheme } from './theme'

interface GlassButtonProps {
  children: React.ReactNode
  onPress: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'gradient' | 'glowing'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon'
  disabled?: boolean
  style?: ViewStyle
}

export function GlassButton({ 
  children, 
  onPress, 
  variant = 'default', 
  size = 'default', 
  disabled = false, 
  style 
}: GlassButtonProps) {
  const { colors } = useTheme()
  const animatedValue = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
        }
      case 'glowing':
        return {
          ...baseStyle,
          shadowColor: '#667eea',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 16,
          elevation: 8,
        }
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
        }
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
        }
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          borderColor: 'rgba(156, 163, 175, 0.2)',
        }
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
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
      case 'gradient':
        return {
          ...baseStyle,
          color: '#ffffff',
        }
      case 'glowing':
        return {
          ...baseStyle,
          color: '#ffffff',
        }
      case 'destructive':
        return {
          ...baseStyle,
          color: '#ef4444',
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
        return {
          ...baseStyle,
          color: colors.foreground,
        }
    }
  }

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 12, paddingVertical: 8 }
      case 'lg':
        return { paddingHorizontal: 32, paddingVertical: 16 }
      case 'xl':
        return { paddingHorizontal: 40, paddingVertical: 20 }
      case 'icon':
        return { padding: 8 }
      default:
        return { paddingHorizontal: 24, paddingVertical: 12 }
    }
  }

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: 14 }
      case 'lg':
        return { fontSize: 18 }
      case 'xl':
        return { fontSize: 20 }
      default:
        return { fontSize: 16 }
    }
  }

  return (
    <Animated.View style={[{ transform: [{ scale: animatedValue }] }]}>
      <TouchableOpacity
        style={[
          getButtonStyle(),
          getSizeStyle(),
          disabled && { opacity: 0.5 },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[getTextStyle(), getTextSize()]}>
          {children}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}
