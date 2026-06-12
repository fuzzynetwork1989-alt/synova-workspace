import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTheme } from './theme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      default:
        return '🖥️'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      default:
        return 'System'
    }
  }

  return (
    <TouchableOpacity
      style={[styles.toggle, { backgroundColor: useTheme().colors.card }]}
      onPress={toggleTheme}
    >
      <Text style={[styles.icon, { color: useTheme().colors.foreground }]}>
        {getThemeIcon()}
      </Text>
      <Text style={[styles.label, { color: useTheme().colors.foreground }]}>
        {getThemeLabel()}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
})
