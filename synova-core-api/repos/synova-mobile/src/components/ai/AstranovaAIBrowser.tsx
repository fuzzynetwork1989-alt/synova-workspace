import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  WebView,
  WebViewNavigation
} from 'react-native-webview';

const { width, height } = Dimensions.get('window');

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  screenshot?: string;
  lastVisited: string;
  visitCount: number;
}

interface BrowserHistory {
  id: string;
  title: string;
  url: string;
  timestamp: string;
  favicon?: string;
}

interface BrowserBookmark {
  id: string;
  title: string;
  url: string;
  folder: string;
  favicon?: string;
  createdAt: string;
}

interface BrowserSettings {
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'brave';
  homepage: string;
  privateMode: boolean;
  javascriptEnabled: boolean;
  popupsEnabled: boolean;
  cookiesEnabled: boolean;
  cacheEnabled: boolean;
  darkMode: boolean;
  fontSize: number;
  userAgent: string;
  desktopMode: boolean;
}

export const AstranovaAIBrowser: React.FC = () => {
  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFind, setShowFind] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [findResults, setFindResults] = useState<{ count: number; current: number }>({ count: 0, current: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [history, setHistory] = useState<BrowserHistory[]>([]);
  const [bookmarks, setBookmarks] = useState<BrowserBookmark[]>([]);
  const [settings, setSettings] = useState<BrowserSettings>({
    searchEngine: 'google',
    homepage: 'https://www.google.com',
    privateMode: false,
    javascriptEnabled: true,
    popupsEnabled: false,
    cookiesEnabled: true,
    cacheEnabled: true,
    darkMode: false,
    fontSize: 16,
    userAgent: Platform.OS === 'ios' ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' : 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
    desktopMode: false,
  });

  const webViewRef = useRef<WebView>(null);
  const findInputRef = useRef<TextInput>(null);

  useEffect(() => {
    initializeBrowser();
    loadBrowserData();
  }, []);

  const initializeBrowser = async () => {
    const defaultTab: BrowserTab = {
      id: 'tab-1',
      title: 'New Tab',
      url: 'about:blank',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      lastVisited: new Date().toISOString(),
      visitCount: 0,
    };
    setTabs([defaultTab]);
    setActiveTabId(defaultTab.id);
    setUrl(settings.homepage);
  };

  const loadBrowserData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('astranova-browser-history');
      const savedBookmarks = await AsyncStorage.getItem('astranova-browser-bookmarks');
      const savedSettings = await AsyncStorage.getItem('astranova-browser-settings');

      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (error) {
      console.error('Failed to load browser data:', error);
    }
  };

  const saveBrowserData = async () => {
    try {
      await AsyncStorage.setItem('astranova-browser-history', JSON.stringify(history));
      await AsyncStorage.setItem('astranova-browser-bookmarks', JSON.stringify(bookmarks));
      await AsyncStorage.setItem('astranova-browser-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save browser data:', error);
    }
  };

  const createNewTab = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url: 'about:blank',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      lastVisited: new Date().toISOString(),
      visitCount: 0,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(newTabs);

      if (activeTabId === tabId) {
        const currentIndex = tabs.findIndex(tab => tab.id === tabId);
        const newActiveIndex = currentIndex === newTabs.length ? currentIndex - 1 : currentIndex;
        setActiveTabId(newTabs[newActiveIndex].id);
      }
    }
  };

  const navigateToUrl = async (targetUrl: string) => {
    if (!targetUrl) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let formattedUrl = targetUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('about:')) {
      formattedUrl = `https://${targetUrl}`;
    }

    setUrl(formattedUrl);
    setIsLoading(true);

    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          url: formattedUrl,
          isLoading: true,
          title: 'Loading...',
        };
      }
      return tab;
    });
    setTabs(updatedTabs);

    if (!isPrivate) {
      const historyEntry: BrowserHistory = {
        id: `history-${Date.now()}`,
        title: 'Loading...',
        url: formattedUrl,
        timestamp: new Date().toISOString(),
      };
      setHistory([historyEntry, ...history.slice(0, 99)]);
      saveBrowserData();
    }
  };

  const searchWeb = async (query: string) => {
    if (!query) return;

    const searchUrl = getSearchUrl(query);
    navigateToUrl(searchUrl);
  };

  const getSearchUrl = (query: string): string => {
    switch (settings.searchEngine) {
      case 'google':
        return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      case 'bing':
        return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      case 'duckduckgo':
        return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      case 'brave':
        return `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
      default:
        return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    webViewRef.current?.goBack();
  };

  const goForward = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    webViewRef.current?.goForward();
  };

  const reload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    webViewRef.current?.reload();
  };

  const stop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    webViewRef.current?.stopLoading();
  };

  const toggleFullscreen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFullscreen(!isFullscreen);
  };

  const zoomIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newZoom = Math.min(zoomLevel + 25, 500);
    setZoomLevel(newZoom);
  };

  const zoomOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newZoom = Math.max(zoomLevel - 25, 25);
    setZoomLevel(newZoom);
  };

  const resetZoom = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setZoomLevel(100);
  };

  const shareUrl = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: url,
        title: 'Check out this link',
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const addBookmark = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (activeTab && activeTab.url !== 'about:blank') {
      const bookmark: BrowserBookmark = {
        id: `bookmark-${Date.now()}`,
        title: activeTab.title,
        url: activeTab.url,
        folder: 'General',
        createdAt: new Date().toISOString(),
      };
      setBookmarks([...bookmarks, bookmark]);
      saveBrowserData();
      Alert.alert('Success', 'Bookmark added successfully');
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    saveBrowserData();
  };

  const clearHistory = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all browsing history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setHistory([]);
            saveBrowserData();
          },
        },
      ]
    );
  };

  const clearCache = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await FileSystem.deleteAsync(FileSystem.cacheDirectory + 'WebView/');
      Alert.alert('Success', 'Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          url: navState.url,
          title: navState.title || 'Untitled',
          canGoBack: navState.canGoBack,
          canGoForward: navState.canGoForward,
          isLoading: navState.loading,
        };
      }
      return tab;
    });
    setTabs(updatedTabs);
    setUrl(navState.url);
    setIsLoading(navState.loading);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    Alert.alert('Error', 'Failed to load the page');
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const renderBrowserControls = () => (
    <View style={styles.browserControls}>
      <View style={styles.navigationControls}>
        <TouchableOpacity
          style={[styles.controlButton, !activeTab?.canGoBack && styles.disabledButton]}
          onPress={goBack}
          disabled={!activeTab?.canGoBack}
        >
          <Ionicons name="chevron-back" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, !activeTab?.canGoForward && styles.disabledButton]}
          onPress={goForward}
          disabled={!activeTab?.canGoForward}
        >
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, isLoading && styles.disabledButton]}
          onPress={reload}
          disabled={isLoading}
        >
          <Ionicons name={isLoading ? "close" : "refresh"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.addressBar}>
        <Ionicons name="globe" size={16} color="#666" style={styles.addressBarIcon} />
        <TextInput
          style={styles.addressBarInput}
          value={url}
          onChangeText={setUrl}
          onSubmitEditing={(e) => navigateToUrl(e.nativeEvent.text)}
          placeholder="Enter URL or search..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => searchWeb(searchQuery)}
        >
          <Ionicons name="search" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.actionControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowHistory(true)}
        >
          <Ionicons name="time" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowBookmarks(true)}
        >
          <Ionicons name="bookmark" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={addBookmark}
        >
          <Ionicons name="bookmark-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={shareUrl}
        >
          <Ionicons name="share-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFullscreen}
        >
          <Ionicons name={isFullscreen ? "contract" : "expand"} size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tabItem,
            tab.id === activeTabId && styles.activeTabItem,
          ]}
          onPress={() => setActiveTabId(tab.id)}
        >
          <Ionicons name="globe" size={16} color="#666" />
          <Text style={styles.tabText} numberOfLines={1}>
            {tab.title}
          </Text>
          {tab.isLoading && (
            <ActivityIndicator size="small" color="#666" style={styles.tabLoading} />
          )}
          {tabs.length > 1 && (
            <TouchableOpacity
              style={styles.tabClose}
              onPress={() => closeTab(tab.id)}
            >
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.newTabButton} onPress={createNewTab}>
        <Ionicons name="add" size={20} color="#666" />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderNewTabPage = () => (
    <View style={styles.newTabPage}>
      <View style={styles.newTabContent}>
        <Ionicons name="globe" size={64} color="#666" />
        <Text style={styles.newTabTitle}>Astranova AI Browser</Text>
        <Text style={styles.newTabSubtitle}>
          Advanced AI-powered web browsing with intelligent content analysis
        </Text>

        <View style={styles.newTabSearch}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or enter URL..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => searchWeb(searchQuery)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.newTabFeatures}>
          <View style={styles.featureItem}>
            <Ionicons name="globe" size={24} color="#666" />
            <Text style={styles.featureTitle}>AI Analysis</Text>
            <Text style={styles.featureDescription}>
              Intelligent content understanding
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={24} color="#666" />
            <Text style={styles.featureTitle}>Enhanced Security</Text>
            <Text style={styles.featureDescription}>
              Advanced protection and tracking
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={24} color="#666" />
            <Text style={styles.featureTitle}>Performance</Text>
            <Text style={styles.featureDescription}>
              Optimized loading and resources
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="eye" size={24} color="#666" />
            <Text style={styles.featureTitle}>Privacy</Text>
            <Text style={styles.featureDescription}>
              Comprehensive privacy controls
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHistoryModal = () => (
    <Modal
      visible={showHistory}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowHistory(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>History</Text>
          <TouchableOpacity onPress={clearHistory}>
            <Ionicons name="trash" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => {
                navigateToUrl(item.url);
                setShowHistory(false);
              }}
            >
              <View style={styles.historyItemContent}>
                <Text style={styles.historyItemTitle}>{item.title}</Text>
                <Text style={styles.historyItemUrl}>{item.url}</Text>
                <Text style={styles.historyItemTime}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );

  const renderBookmarksModal = () => (
    <Modal
      visible={showBookmarks}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowBookmarks(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowBookmarks(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Bookmarks</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookmarkItem}
              onPress={() => {
                navigateToUrl(item.url);
                setShowBookmarks(false);
              }}
            >
              <View style={styles.bookmarkItemContent}>
                <Text style={styles.bookmarkItemTitle}>{item.title}</Text>
                <Text style={styles.bookmarkItemUrl}>{item.url}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookmarkRemove}
                onPress={() => removeBookmark(item.id)}
              >
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Browser Controls */}
      {renderBrowserControls()}

      {/* Tab Bar */}
      {renderTabBar()}

      {/* Main Content */}
      <View style={styles.content}>
        {activeTab?.url === 'about:blank' ? (
          renderNewTabPage()
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: activeTab?.url || 'about:blank' }}
            style={styles.webView}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            javaScriptEnabled={settings.javascriptEnabled}
            domStorageEnabled={settings.cacheEnabled}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            bounces={true}
            userAgent={settings.userAgent}
            scalesPageToFit={settings.desktopMode}
            mixedContentMode="compatibility"
            allowsBackForwardNavigationGestures={true}
            incognito={isPrivate}
          />
        )}
      </View>

      {/* Modals */}
      {renderHistoryModal()}
      {renderBookmarksModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  browserControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressBarIcon: {
    marginRight: 8,
  },
  addressBarInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  tabBar: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 120,
    maxWidth: 200,
  },
  activeTabItem: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tabText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    marginHorizontal: 6,
  },
  tabLoading: {
    marginLeft: 4,
  },
  tabClose: {
    marginLeft: 4,
  },
  newTabButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  newTabPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  newTabContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  newTabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  newTabSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  newTabSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 32,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  newTabFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  historyItemUrl: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  historyItemTime: {
    fontSize: 12,
    color: '#999',
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bookmarkItemContent: {
    flex: 1,
  },
  bookmarkItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookmarkItemUrl: {
    fontSize: 14,
    color: '#666',
  },
  bookmarkRemove: {
    padding: 8,
  },
});
