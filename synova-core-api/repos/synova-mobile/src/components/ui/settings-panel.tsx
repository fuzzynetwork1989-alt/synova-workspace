import React, { useState } from 'react'
import { View, Text, TextInput, Switch, StyleSheet, ScrollView } from 'react-native'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card'
import { Button } from './button'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from './theme'

export function SettingsPanel() {
  const { colors } = useTheme()
  const [apiUrl, setApiUrl] = useState('http://localhost:8000')
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000')
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableAnalytics, setEnableAnalytics] = useState(false)

  const saveSettings = () => {
    // In a real app, you'd save these to AsyncStorage
    console.log('Settings saved:', { apiUrl, wsUrl, enableNotifications, enableAnalytics })
    alert('Settings saved successfully!')
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.space}>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize your app appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                  Theme
                </Text>
                <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                  Toggle between light and dark mode
                </Text>
              </View>
              <ThemeToggle />
            </View>
          </CardContent>
        </Card>
      </View>

      <View style={styles.space}>
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure your API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.space}>
              <Text style={[styles.label, { color: colors.foreground }]}>API Base URL</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.input,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                value={apiUrl}
                onChangeText={setApiUrl}
                placeholder="http://localhost:8000"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
            <View style={styles.space}>
              <Text style={[styles.label, { color: colors.foreground }]}>WebSocket URL</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.input,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                value={wsUrl}
                onChangeText={setWsUrl}
                placeholder="ws://localhost:8000"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
            <Button onPress={saveSettings}>
              Save API Settings
            </Button>
          </CardContent>
        </Card>
      </View>

      <View style={styles.space}>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your app preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                  Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                  Receive push notifications
                </Text>
              </View>
              <Switch
                value={enableNotifications}
                onValueChange={setEnableNotifications}
              />
            </View>
            <View style={[styles.settingRow, styles.marginTop]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                  Analytics
                </Text>
                <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                  Help improve Synova AI
                </Text>
              </View>
              <Switch
                value={enableAnalytics}
                onValueChange={setEnableAnalytics}
              />
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
    padding: 16,
  },
  space: {
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  marginTop: {
    marginTop: 16,
  },
})
