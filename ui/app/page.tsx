'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Brain, Cpu, Settings, Home, Plus, Search, User, Moon, Sun, Volume2, Zap, Code, Database, Globe, Shield, ChevronDown } from 'lucide-react'

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')
  const [model, setModel] = useState('auto')
  const [temperature, setTemperature] = useState(0.7)
  const [streaming, setStreaming] = useState(true)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [personality, setPersonality] = useState('friendly-helpful')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const conversations = [
    {
      id: '1',
      title: 'Music Agent Chat',
      lastMessage: 'What chord progressions work well for jazz?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      tags: ['music', 'agent'],
      pinned: true,
    },
    {
      id: '2',
      title: 'Dev Work Session',
      lastMessage: 'Fixed the authentication flow bug',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      tags: ['development', 'bugfix'],
      pinned: false,
    },
    {
      id: '3',
      title: 'E-commerce Research',
      lastMessage: 'Analyzed competitor pricing strategies',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      tags: ['research', 'ecommerce'],
      pinned: false,
    },
  ]

  const agents = [
    { id: 'general-helper', name: 'General Helper', icon: Brain, description: 'Versatile assistant for everyday tasks' },
    { id: 'music-agent', name: 'Music Agent', icon: Zap, description: 'Specialized in music theory and composition' },
    { id: 'dev-agent', name: 'Dev Agent', icon: Code, description: 'Expert in programming and debugging' },
    { id: 'ecommerce-agent', name: 'E-commerce Researcher', icon: Database, description: 'Market analysis and product research' },
    { id: 'creative-agent', name: 'Creative Agent', icon: Globe, description: 'Brainstorming and creative projects' },
  ]

  const recentProjects = [
    { id: '1', name: 'Music Production App', lastAccessed: new Date(Date.now() - 1000 * 60 * 60), files: 24 },
    { id: '2', name: 'Dev Dashboard', lastAccessed: new Date(Date.now() - 1000 * 60 * 180), files: 156 },
    { id: '3', name: 'E-commerce Analysis', lastAccessed: new Date(Date.now() - 1000 * 60 * 15), files: 89 },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col border-r border-border bg-background transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold text-foreground">Synova</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={sidebarCollapsed ? "ghost" : "default"}
            className={cn("w-full justify-start", !sidebarCollapsed && "h-12")}
            size="sm"
          >
            <Home className="h-4 w-4" />
            {!sidebarCollapsed && <span>Home</span>}
          </Button>
          <Button
            variant={sidebarCollapsed ? "ghost" : "default"}
            className={cn("w-full justify-start", !sidebarCollapsed && "h-12")}
            size="sm"
          >
            <Search className="h-4 w-4" />
            {!sidebarCollapsed && <span>Projects</span>}
          </Button>
          <Button
            variant={sidebarCollapsed ? "ghost" : "default"}
            className={cn("w-full justify-start", !sidebarCollapsed && "h-12")}
            size="sm"
          >
            <Brain className="h-4 w-4" />
            {!sidebarCollapsed && <span>Agents</span>}
          </Button>
          <Button
            variant={sidebarCollapsed ? "ghost" : "default"}
            className={cn("w-full justify-start", !sidebarCollapsed && "h-12")}
            size="sm"
          >
            <Settings className="h-4 w-4" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Button>
        </nav>

        {/* Recent Conversations */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent</h3>
            <ScrollArea className="space-y-2">
              {conversations.map((conv) => (
                <div key={conv.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">
                        {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {conv.pinned && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {conv.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/user/128" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Welcome back, User</h1>
              <p className="text-sm text-muted-foreground">Synova Brain is ready</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="fast-small">Fast Small</SelectItem>
                <SelectItem value="deep-reasoning">Deep Reasoning</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex">
          {/* Chat Sidebar */}
          <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Agents</h3>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <Button
                    key={agent.id}
                    variant={agent.id === 'general-helper' ? 'default' : 'ghost'}
                    className="w-full justify-start h-12"
                    size="sm"
                  >
                    <agent.icon className="h-4 w-4 mr-2" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">{agent.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Projects</h3>
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.files} files</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project.lastAccessed.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Welcome Message */}
              <div className="flex justify-center">
                <Card className="max-w-md">
                  <CardHeader className="text-center">
                    <Brain className="h-12 w-12 mx-auto text-primary mb-4" />
                    <CardTitle className="text-xl">Welcome to Synova Brain</CardTitle>
                    <CardDescription>
                      Your advanced AI assistant is ready to help with music production, development, research, and creative projects.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="h-20 flex flex-col gap-2">
                        <Music className="h-6 w-6" />
                        <span className="text-sm">Music</span>
                      </Button>
                      <Button className="h-20 flex flex-col gap-2" variant="outline">
                        <Code className="h-6 w-6" />
                        <span className="text-sm">Development</span>
                      </Button>
                      <Button className="h-20 flex flex-col gap-2" variant="outline">
                        <Database className="h-6 w-6" />
                        <span className="text-sm">Research</span>
                      </Button>
                      <Button className="h-20 flex flex-col gap-2" variant="outline">
                        <Globe className="h-6 w-6" />
                        <span className="text-sm">Creative</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Choose an agent or start a general conversation
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex items-end gap-3">
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-3 w-3" />
                  <span>Auto-send enabled</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
