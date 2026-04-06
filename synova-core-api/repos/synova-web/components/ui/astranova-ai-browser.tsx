'use client'

import { useState, useEffect, useRef } from 'react'
import { GlassCard } from './glass-card'
import { GlassButton } from './glass-button'
import { LoadingSkeleton } from './loading-skeleton'
import { 
  Globe, 
  Search, 
  Zap, 
  Brain, 
  Eye, 
  Download, 
  Share2, 
  Settings, 
  History, 
  Bookmarks,
  Shield,
  Cpu,
  Network,
  Database,
  Cloud,
  Lock,
  Unlock,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Terminal,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Headphones,
  Camera,
  Mic,
  Volume2,
  Wifi,
  Battery,
  Clock,
  Calendar,
  MapPin,
  Navigation,
  Compass,
  Globe2,
  Layers,
  Box,
  Package,
  Server,
  CloudDownload,
  CloudUpload,
  RefreshCw,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Rewind,
  FastForward,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Home,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Paperclip,
  Link,
  Copy,
  Cut,
  Paste,
  Undo,
  Redo,
  Save,
  Print,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  File,
  FilePlus,
  FileMinus,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  FileCheck,
  FileX,
  FileQuestion,
  FileSearch,
  FileLock,
  FileUnlock,
  FileSignature,
  FileDigit,
  FileBarChart,
  FilePieChart,
  FileLineChart,
  FileScatterChart,
  FileHistogram,
  FileHeatmap,
  FileTreeMap,
  FileNetwork,
  FileTimeline,
  FileGantt,
  FileCalendar,
  FileClock,
  FileMap,
  FileLocation,
  FileRoute,
  FileNavigation,
  FileCompass,
  FileGlobe,
  FileLayers,
  FileBox,
  FilePackage,
  FileServer,
  FileCloud,
  FileDownload,
  FileUpload,
  FileRefresh,
  FilePlay,
  FilePause,
  FileSquare,
  FileSkipForward,
  FileSkipBack,
  FileRewind,
  FileFastForward,
  FileMaximize,
  FileMinimize,
  FileMove,
  FileRotate,
  FileZoomIn,
  FileZoomOut,
  FileHome,
  FileArrowLeft,
  FileArrowRight,
  FileArrowUp,
  FileArrowDown,
  FileMoreVertical,
  FileMoreHorizontal,
  FileChevronLeft,
  FileChevronRight,
  FileChevronUp,
  FileChevronDown,
  FilePlus,
  FileMinus,
  FileX,
  FileCheck,
  FileAlertTriangle,
  FileInfo,
  FileHelpCircle,
  FileStar,
  FileHeart,
  FileThumbsUp,
  FileThumbsDown,
  FileMessageSquare,
  FileSend,
  FilePaperclip,
  FileLink,
  FileCopy,
  FileCut,
  FilePaste,
  FileUndo,
  FileRedo,
  FileSave,
  FilePrint,
  FileEdit,
  FileTrash2,
  FileFolder,
  FileFolderOpen,
  FileFile,
  FileFilePlus,
  FileFileMinus,
  FileFileText,
  FileFileImage,
  FileFileVideo,
  FileFileAudio,
  FileFileCode,
  FileFileArchive,
  FileFileSpreadsheet,
  FileFileCheck,
  FileFileX,
  FileFileQuestion,
  FileFileSearch,
  FileFileLock,
  FileFileUnlock,
  FileFileSignature,
  FileFileDigit,
  FileFileBarChart,
  FileFilePieChart,
  FileFileLineChart,
  FileFileScatterChart,
  FileFileHistogram,
  FileFileHeatmap,
  FileFileTreeMap,
  FileFileNetwork,
  FileFileTimeline,
  FileFileGantt,
  FileFileCalendar,
  FileFileClock,
  FileFileMap,
  FileFileLocation,
  FileFileRoute,
  FileFileNavigation,
  FileFileCompass,
  FileFileGlobe,
  FileFileLayers,
  FileFileBox,
  FileFilePackage,
  FileFileServer,
  FileFileCloud,
  FileFileDownload,
  FileFileUpload,
  FileFileRefresh,
  FileFilePlay,
  FileFilePause,
  FileFileSquare,
  FileFileSkipForward,
  FileFileSkipBack,
  FileFileRewind,
  FileFileFastForward,
  FileFileMaximize,
  FileFileMinimize,
  FileFileMove,
  FileFileRotate,
  FileFileZoomIn,
  FileFileZoomOut,
  FileFileHome,
  FileFileArrowLeft,
  FileFileArrowRight,
  FileFileArrowUp,
  FileFileArrowDown,
  FileFileMoreVertical,
  FileFileMoreHorizontal,
  FileFileChevronLeft,
  FileFileChevronRight,
  FileFileChevronUp,
  FileFileChevronDown
} from 'lucide-react'

interface BrowserTab {
  id: string
  title: string
  url: string
  favicon?: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  content?: string
  screenshot?: string
  metadata?: {
    description?: string
    keywords?: string[]
    author?: string
    publishedAt?: string
    modifiedAt?: string
    language?: string
    charset?: string
    viewport?: string
    robots?: string
    canonical?: string
    openGraph?: Record<string, string>
    twitter?: Record<string, string>
    jsonLd?: any[]
  }
  performance?: {
    loadTime: number
    renderTime: number
    resourceCount: number
    errorCount: number
    warningCount: number
  }
  security?: {
    https: boolean
    certificate?: {
      issuer: string
      subject: string
      validFrom: string
      validTo: string
      fingerprint: string
    }
    mixedContent: boolean
    trackingProtection: boolean
    adBlocker: boolean
    safeBrowsing: boolean
  }
  accessibility?: {
    score: number
    issues: string[]
    warnings: string[]
    passes: string[]
  }
  seo?: {
    score: number
    title: string
    description: string
    keywords: string[]
    headings: {
      h1: number
      h2: number
      h3: number
      h4: number
      h5: number
      h6: number
    }
    images: {
      total: number
      withAlt: number
      withoutAlt: number
    }
    links: {
      internal: number
      external: number
      nofollow: number
    }
  }
}

interface BrowserHistory {
  id: string
  title: string
  url: string
  timestamp: string
  visitCount: number
  lastVisit: string
  favicon?: string
  category?: string
  tags?: string[]
}

interface BrowserBookmark {
  id: string
  title: string
  url: string
  folder: string
  favicon?: string
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  isFavorite: boolean
}

interface BrowserSettings {
  general: {
    searchEngine: 'google' | 'bing' | 'duckduckgo' | 'brave' | 'custom'
    homepage: string
    startupBehavior: 'homepage' | 'continue' | 'blank'
    defaultZoom: number
    font: {
      family: string
      size: number
      minimumSize: number
    }
    downloads: {
      location: string
      askForLocation: boolean
      autoOpen: boolean
    }
  }
  privacy: {
    trackingProtection: 'standard' | 'strict' | 'custom'
    cookies: 'allow' | 'block' | 'block-third-party'
    cache: 'allow' | 'block'
    history: 'remember' | 'forget' | 'custom'
    passwords: 'save' | 'ask' | 'never'
    autofill: 'enable' | 'disable'
    sendDoNotTrack: boolean
  }
  security: {
    httpsOnly: 'always' | 'private' | 'never'
    safeBrowsing: boolean
    mixedContent: 'block' | 'allow' | 'ask'
    certificates: 'verify' | 'ignore'
    plugins: 'ask' | 'allow' | 'block'
  }
  performance: {
    hardwareAcceleration: boolean
    memoryOptimization: boolean
    cpuOptimization: boolean
    networkOptimization: boolean
    cacheSize: number
    maxConnections: number
    preloadPages: boolean
    lazyLoad: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto' | 'custom'
    accentColor: string
    fontFamily: string
    fontSize: number
    lineHeight: number
    letterSpacing: number
    borderRadius: number
    shadows: boolean
    animations: boolean
    transitions: boolean
  }
  advanced: {
    developerMode: boolean
    experimentalFeatures: boolean
    betaFeatures: boolean
    customUserAgent: string
    customHeaders: Record<string, string>
    customScripts: string[]
    customStyles: string[]
    webgl: boolean
    webgpu: boolean
    webassembly: boolean
    webrtc: boolean
    webaudio: boolean
    indexeddb: boolean
    localstorage: boolean
    sessionstorage: boolean
    cookies: boolean
    cache: boolean
    serviceworkers: boolean
    pushnotifications: boolean
    geolocation: boolean
    camera: boolean
    microphone: boolean
    fullscreen: boolean
    pointerlock: boolean
    gamepad: boolean
    vr: boolean
    ar: boolean
  }
}

export function AstranovaAIBrowser() {
  const [tabs, setTabs] = useState<BrowserTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showDeveloperTools, setShowDeveloperTools] = useState<boolean>(false)
  const [showDownloads, setShowDownloads] = useState<boolean>(false)
  const [showExtensions, setShowExtensions] = useState<boolean>(false)
  const [showFind, setShowFind] = useState<boolean>(false)
  const [findQuery, setFindQuery] = useState<string>('')
  const [findResults, setFindResults] = useState<{ count: number; current: number }>({ count: 0, current: 0 })
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [isReaderMode, setIsReaderMode] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [history, setHistory] = useState<BrowserHistory[]>([])
  const [bookmarks, setBookmarks] = useState<BrowserBookmark[]>([])
  const [downloads, setDownloads] = useState<any[]>([])
  const [extensions, setExtensions] = useState<any[]>([])
  const [settings, setSettings] = useState<BrowserSettings>({
    general: {
      searchEngine: 'google',
      homepage: 'https://www.google.com',
      startupBehavior: 'homepage',
      defaultZoom: 100,
      font: {
        family: 'Inter',
        size: 16,
        minimumSize: 12
      },
      downloads: {
        location: '/Downloads',
        askForLocation: true,
        autoOpen: false
      }
    },
    privacy: {
      trackingProtection: 'standard',
      cookies: 'allow',
      cache: 'allow',
      history: 'remember',
      passwords: 'save',
      autofill: 'enable',
      sendDoNotTrack: false
    },
    security: {
      httpsOnly: 'always',
      safeBrowsing: true,
      mixedContent: 'block',
      certificates: 'verify',
      plugins: 'ask'
    },
    performance: {
      hardwareAcceleration: true,
      memoryOptimization: true,
      cpuOptimization: true,
      networkOptimization: true,
      cacheSize: 1000,
      maxConnections: 6,
      preloadPages: true,
      lazyLoad: true
    },
    appearance: {
      theme: 'auto',
      accentColor: '#3b82f6',
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 0,
      borderRadius: 8,
      shadows: true,
      animations: true,
      transitions: true
    },
    advanced: {
      developerMode: false,
      experimentalFeatures: false,
      betaFeatures: false,
      customUserAgent: '',
      customHeaders: {},
      customScripts: [],
      customStyles: [],
      webgl: true,
      webgpu: true,
      webassembly: true,
      webrtc: true,
      webaudio: true,
      indexeddb: true,
      localstorage: true,
      sessionstorage: true,
      cookies: true,
      cache: true,
      serviceworkers: true,
      pushnotifications: true,
      geolocation: true,
      camera: true,
      microphone: true,
      fullscreen: true,
      pointerlock: true,
      gamepad: true,
      vr: true,
      ar: true
    }
  })

  const browserRef = useRef<HTMLIFrameElement>(null)
  const findInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Initialize browser with default tab
    const defaultTab: BrowserTab = {
      id: 'tab-1',
      title: 'New Tab',
      url: 'about:blank',
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    }
    setTabs([defaultTab])
    setActiveTabId(defaultTab.id)
    
    // Load saved data
    loadBrowserData()
  }, [])

  const loadBrowserData = async () => {
    try {
      // Load history, bookmarks, settings from localStorage or API
      const savedHistory = localStorage.getItem('astranova-browser-history')
      const savedBookmarks = localStorage.getItem('astranova-browser-bookmarks')
      const savedSettings = localStorage.getItem('astranova-browser-settings')
      
      if (savedHistory) setHistory(JSON.parse(savedHistory))
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
      if (savedSettings) setSettings(JSON.parse(savedSettings))
    } catch (error) {
      console.error('Failed to load browser data:', error)
    }
  }

  const saveBrowserData = async () => {
    try {
      localStorage.setItem('astranova-browser-history', JSON.stringify(history))
      localStorage.setItem('astranova-browser-bookmarks', JSON.stringify(bookmarks))
      localStorage.setItem('astranova-browser-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save browser data:', error)
    }
  }

  const createNewTab = () => {
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url: 'about:blank',
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId)
      setTabs(newTabs)
      
      if (activeTabId === tabId) {
        const currentIndex = tabs.findIndex(tab => tab.id === tabId)
        const newActiveIndex = currentIndex === newTabs.length ? currentIndex - 1 : currentIndex
        setActiveTabId(newTabs[newActiveIndex].id)
      }
    }
  }

  const navigateToUrl = async (targetUrl: string) => {
    if (!targetUrl) return
    
    // Add protocol if missing
    let formattedUrl = targetUrl
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('about:')) {
      formattedUrl = `https://${targetUrl}`
    }
    
    setUrl(formattedUrl)
    setIsLoading(true)
    
    // Update active tab
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          url: formattedUrl,
          isLoading: true,
          title: 'Loading...'
        }
      }
      return tab
    })
    setTabs(updatedTabs)
    
    try {
      // Simulate navigation with AI-enhanced content analysis
      const response = await fetch('/api/browser/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl })
      })
      
      const data = await response.json()
      
      // Update tab with loaded content
      const loadedTabs = tabs.map(tab => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            isLoading: false,
            title: data.title || 'Untitled',
            content: data.content,
            metadata: data.metadata,
            performance: data.performance,
            security: data.security,
            accessibility: data.accessibility,
            seo: data.seo,
            canGoBack: true,
            canGoForward: false
          }
        }
        return tab
      })
      setTabs(loadedTabs)
      
      // Add to history
      const historyEntry: BrowserHistory = {
        id: `history-${Date.now()}`,
        title: data.title || 'Untitled',
        url: formattedUrl,
        timestamp: new Date().toISOString(),
        visitCount: 1,
        lastVisit: new Date().toISOString(),
        favicon: data.favicon
      }
      setHistory([historyEntry, ...history])
      
    } catch (error) {
      console.error('Navigation failed:', error)
      
      // Update tab with error state
      const errorTabs = tabs.map(tab => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            isLoading: false,
            title: 'Error loading page',
            content: `<div class="error">Failed to load ${formattedUrl}</div>`
          }
        }
        return tab
      })
      setTabs(errorTabs)
    }
    
    setIsLoading(false)
  }

  const searchWeb = async (query: string) => {
    if (!query) return
    
    const searchUrl = getSearchUrl(query)
    navigateToUrl(searchUrl)
  }

  const getSearchUrl = (query: string): string => {
    switch (settings.general.searchEngine) {
      case 'google':
        return `https://www.google.com/search?q=${encodeURIComponent(query)}`
      case 'bing':
        return `https://www.bing.com/search?q=${encodeURIComponent(query)}`
      case 'duckduckgo':
        return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
      case 'brave':
        return `https://search.brave.com/search?q=${encodeURIComponent(query)}`
      default:
        return `https://www.google.com/search?q=${encodeURIComponent(query)}`
    }
  }

  const goBack = () => {
    if (browserRef.current) {
      browserRef.current.contentWindow?.history.back()
    }
  }

  const goForward = () => {
    if (browserRef.current) {
      browserRef.current.contentWindow?.history.forward()
    }
  }

  const reload = () => {
    if (browserRef.current) {
      browserRef.current.contentWindow?.location.reload()
    }
  }

  const stop = () => {
    if (browserRef.current) {
      browserRef.current.contentWindow?.stop()
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const zoomIn = () => {
    const newZoom = Math.min(zoomLevel + 25, 500)
    setZoomLevel(newZoom)
    applyZoom(newZoom)
  }

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 25, 25)
    setZoomLevel(newZoom)
    applyZoom(newZoom)
  }

  const resetZoom = () => {
    setZoomLevel(100)
    applyZoom(100)
  }

  const applyZoom = (zoom: number) => {
    if (browserRef.current) {
      browserRef.current.style.transform = `scale(${zoom / 100})`
      browserRef.current.style.transformOrigin = 'top left'
    }
  }

  const findInPage = (query: string) => {
    if (!query) return
    
    // This would integrate with the browser's find functionality
    // For now, we'll simulate it
    const results = { count: 0, current: 0 }
    setFindResults(results)
  }

  const addBookmark = (tab: BrowserTab) => {
    const bookmark: BrowserBookmark = {
      id: `bookmark-${Date.now()}`,
      title: tab.title,
      url: tab.url,
      folder: 'General',
      favicon: tab.favicon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false
    }
    setBookmarks([...bookmarks, bookmark])
    saveBrowserData()
  }

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId))
    saveBrowserData()
  }

  const clearHistory = () => {
    setHistory([])
    saveBrowserData()
  }

  const clearCache = async () => {
    try {
      await fetch('/api/browser/clear-cache', { method: 'POST' })
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  const clearCookies = async () => {
    try {
      await fetch('/api/browser/clear-cookies', { method: 'POST' })
    } catch (error) {
      console.error('Failed to clear cookies:', error)
    }
  }

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  const renderBrowserControls = () => (
    <div className="flex items-center gap-2 p-2 bg-background/50 backdrop-blur-sm border-b">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={goBack}
          disabled={!activeTab?.canGoBack}
        >
          <ArrowLeft className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={goForward}
          disabled={!activeTab?.canGoForward}
        >
          <ArrowRight className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={reload}
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={stop}
          disabled={!isLoading}
        >
          <Square className="w-4 h-4" />
        </GlassButton>
      </div>

      {/* Address Bar */}
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={url || activeTab?.url || ''}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigateToUrl(e.target.value)
              }
            }}
            placeholder="Enter URL or search..."
            className="w-full pl-10 pr-4 py-2 bg-background/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={() => searchWeb(searchQuery)}
        >
          <Search className="w-4 h-4" />
        </GlassButton>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1">
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={() => setShowHistory(true)}
        >
          <History className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={() => setShowBookmarks(true)}
        >
          <Bookmarks className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={() => setShowDownloads(true)}
        >
          <Download className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={() => setShowDeveloperTools(true)}
        >
          <Terminal className="w-4 h-4" />
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="w-4 h-4" />
        </GlassButton>
      </div>
    </div>
  )

  const renderTabBar = () => (
    <div className="flex items-center gap-1 p-2 bg-background/50 backdrop-blur-sm border-b">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            tab.id === activeTabId
              ? 'bg-primary/10 border border-primary/20'
              : 'hover:bg-background/80'
          }`}
          onClick={() => setActiveTabId(tab.id)}
        >
          {tab.favicon ? (
            <img src={tab.favicon} alt="" className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm truncate max-w-32">{tab.title}</span>
          {tab.isLoading && (
            <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />
          )}
          {tabs.length > 1 && (
            <GlassButton
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
            >
              <X className="w-3 h-3" />
            </GlassButton>
          )}
        </div>
      ))}
      <GlassButton
        size="sm"
        variant="ghost"
        onClick={createNewTab}
      >
        <Plus className="w-4 h-4" />
      </GlassButton>
    </div>
  )

  const renderStatusBar = () => (
    <div className="flex items-center justify-between p-2 bg-background/50 backdrop-blur-sm border-t text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3" />
          <span>{activeTab?.security?.https ? 'Secure' : 'Not Secure'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          <span>Performance: {activeTab?.performance?.loadTime || 0}ms</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-3 h-3" />
          <span>{activeTab?.performance?.resourceCount || 0} resources</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ZoomIn className="w-3 h-3" />
          <span>{zoomLevel}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-3 h-3" />
          <span>Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Browser Controls */}
      {renderBrowserControls()}
      
      {/* Tab Bar */}
      {renderTabBar()}
      
      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab?.url === 'about:blank' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Globe className="w-16 h-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold">Astranova AI Browser</h2>
              <p className="text-muted-foreground">
                Advanced AI-powered web browsing with intelligent content analysis
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search or enter URL..."
                  className="w-96 px-4 py-2 bg-background/50 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigateToUrl(e.target.value)
                    }
                  }}
                />
                <div className="grid grid-cols-4 gap-4 text-left">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <Brain className="w-8 h-8 mb-2 text-primary" />
                    <h3 className="font-semibold">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Intelligent content understanding and summarization
                    </p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <Shield className="w-8 h-8 mb-2 text-green-600" />
                    <h3 className="font-semibold">Enhanced Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced protection against threats and tracking
                    </p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <Zap className="w-8 h-8 mb-2 text-yellow-600" />
                    <h3 className="font-semibold">Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimized loading and resource management
                    </p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <Eye className="w-8 h-8 mb-2 text-blue-600" />
                    <h3 className="font-semibold">Privacy</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive privacy controls and tracking protection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={browserRef}
            src={activeTab?.url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>
      
      {/* Status Bar */}
      {renderStatusBar()}
    </div>
  )
}
