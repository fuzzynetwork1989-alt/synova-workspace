const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without revealing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  
  // App version
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Window controls
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close: () => ipcRenderer.invoke('close-window'),
  
  // App events
  onNewChat: (callback) => ipcRenderer.on('new-chat', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (data, filename) => ipcRenderer.invoke('save-file', data, filename),
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // Model operations
  getModels: () => ipcRenderer.invoke('get-models'),
  getModelConfig: (modelId) => ipcRenderer.invoke('get-model-config', modelId),
  switchModel: (modelId) => ipcRenderer.invoke('switch-model', modelId)
});

// Security: prevent node integration in renderer
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
