"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function SettingsPanel() {
  const [apiUrl, setApiUrl] = useState("http://localhost:8000")
  const [wsUrl, setWsUrl] = useState("ws://localhost:8000")
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableAnalytics, setEnableAnalytics] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize your app appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Theme</h4>
              <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure your API endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">API Base URL</label>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="http://localhost:8000"
            />
          </div>
          <div>
            <label className="text-sm font-medium">WebSocket URL</label>
            <input
              type="url"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="ws://localhost:8000"
            />
          </div>
          <Button onClick={() => {
            localStorage.setItem('apiUrl', apiUrl)
            localStorage.setItem('wsUrl', wsUrl)
            alert('Settings saved!')
          }}>
            Save API Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your app preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive desktop notifications</p>
            </div>
            <input
              type="checkbox"
              checked={enableNotifications}
              onChange={(e) => setEnableNotifications(e.target.checked)}
              className="toggle"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Analytics</h4>
              <p className="text-sm text-muted-foreground">Help improve Synova AI</p>
            </div>
            <input
              type="checkbox"
              checked={enableAnalytics}
              onChange={(e) => setEnableAnalytics(e.target.checked)}
              className="toggle"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
