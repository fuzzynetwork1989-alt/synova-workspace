import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card'
import { Button } from '../../src/components/ui/button'
import { ThemeToggle } from '../../src/components/ui/theme-toggle'
import { useTheme } from '../../src/components/ui/theme'

export default function HomeScreen() {
  const { colors } = useTheme()

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          🚀 Synova AI
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Mobile App
        </Text>
        <ThemeToggle />
      </View>

      <View style={styles.content}>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>System Status</CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={[styles.statusText, { color: colors.primary }]}>
              ✅ Connected to API
            </Text>
            <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
              🌐 Server: http://localhost:8000
            </Text>
          </CardContent>
        </Card>

        <Card style={styles.marginTop}>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Available Features</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.featureList}>
              <Text style={[styles.featureItem, { color: colors.foreground }]}>
                💬 AI Chat
              </Text>
              <Text style={[styles.featureItem, { color: colors.foreground }]}>
                🏢 Workspaces
              </Text>
              <Text style={[styles.featureItem, { color: colors.foreground }]}>
                🤖 AI Agents
              </Text>
              <Text style={[styles.featureItem, { color: colors.foreground }]}>
                ⚙️ Settings
              </Text>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.marginTop}>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Appearance Settings</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.themeRow}>
              <Text style={[styles.themeText, { color: colors.foreground }]}>
                Toggle theme in the Settings tab
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  content: {
    padding: 20,
  },
  marginTop: {
    marginTop: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    fontSize: 16,
    flex: 1,
  },
})
