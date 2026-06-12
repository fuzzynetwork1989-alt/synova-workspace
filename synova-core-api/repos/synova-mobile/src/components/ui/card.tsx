import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from './theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardTitleProps {
  children: React.ReactNode
  style?: TextStyle
}

interface CardDescriptionProps {
  children: React.ReactNode
  style?: TextStyle
}

interface CardContentProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: CardProps) {
  const { colors } = useTheme()

  return (
    <View style={[
      styles.card,
      { backgroundColor: colors.card, borderColor: colors.border },
      style
    ]}>
      {children}
    </View>
  )
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View style={[styles.cardHeader, style]}>
      {children}
    </View>
  )
}

export function CardTitle({ children, style }: CardTitleProps) {
  const { colors } = useTheme()

  return (
    <Text style={[
      styles.cardTitle,
      { color: colors.cardForeground },
      style
    ]}>
      {children}
    </Text>
  )
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  const { colors } = useTheme()

  return (
    <Text style={[
      styles.cardDescription,
      { color: colors.mutedForeground },
      style
    ]}>
      {children}
    </Text>
  )
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardContent: {
    padding: 20,
    paddingTop: 0,
  },
})
