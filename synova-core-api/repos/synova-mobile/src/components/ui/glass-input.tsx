import React from 'react'
import { TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from './theme'

interface GlassInputProps extends TextInputProps {
  style?: ViewStyle
}

export function GlassInput({ style, ...props }: GlassInputProps) {
  const { colors } = useTheme()

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: colors.foreground,
        },
        style,
      ]}
      placeholderTextColor={colors.mutedForeground}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
})
