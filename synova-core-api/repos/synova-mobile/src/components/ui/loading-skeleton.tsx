import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from './theme'

interface LoadingSkeletonProps {
  style?: ViewStyle
  variant?: 'default' | 'circular' | 'text' | 'rectangular'
  width?: number | string
  height?: number | string
}

export function LoadingSkeleton({ 
  style, 
  variant = 'default', 
  width, 
  height 
}: LoadingSkeletonProps) {
  const { colors } = useTheme()

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: 999,
          width: width || 40,
          height: height || 40,
        }
      case 'text':
        return {
          borderRadius: 4,
          height: height || 16,
          width: width || '80%',
        }
      case 'rectangular':
        return {
          borderRadius: 0,
          width: width || '100%',
          height: height || 100,
        }
      default:
        return {
          borderRadius: 8,
          width: width || '100%',
          height: height || 40,
        }
    }
  }

  return (
    <View
      style={[
        styles.skeleton,
        {
          backgroundColor: colors.muted,
        },
        getVariantStyle(),
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    opacity: 0.7,
  },
})
