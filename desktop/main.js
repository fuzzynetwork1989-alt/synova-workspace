const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let modelRegistry = null;

function loadModelRegistry() {
  try {
    const registryPath = path.join(__dirname, '..', 'synova-nexus', 'models', 'model-registry.ts');
    if (fs.existsSync(registryPath)) {
      console.log('Model registry path found:', registryPath);
    }
  } catch (error) {
    console.error('Failed to load model registry:', error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
    titleBarStyle: 'default',
    backgroundColor: '#0f0c29'
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    loadModelRegistry();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Setup IPC handlers
  setupIPCHandlers();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Chat',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-chat');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Synova AI',
          click: () => {
            shell.openExternal('https://synova.ai');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.setAsDefaultProtocolClient('synova');

// IPC Handlers
function setupIPCHandlers() {
  // Get available models
  ipcMain.handle('get-models', async () => {
    const models = [
      { id: 'synova-nexus', name: 'Synova Nexus', tier: 'standard', description: 'Advanced AI assistant' },
      { id: 'synova-nexus-pro', name: 'Synova Nexus Pro', tier: 'pro', description: 'Professional-grade model' },
      { id: 'synova-nexus-ultra', name: 'Synova Nexus Ultra', tier: 'ultra', description: 'Ultimate frontier model' },
      { id: 'synova-nexus-voice', name: 'Synova Nexus Voice', tier: 'standard', description: 'Voice-specialized model' },
      { id: 'synova-nexus-xr', name: 'Synova Nexus XR', tier: 'standard', description: 'Extended reality model' },
      { id: 'synova-deepseek-quantum', name: 'Synova DeepSeek Quantum', tier: 'pro', description: 'Quantum-enhanced coding' },
      { id: 'synova-gemma4-quantum', name: 'Synova Gemma4 Quantum', tier: 'pro', description: 'Quantum multimodal' },
      { id: 'synova-gemma4-quantum-elite', name: 'Synova Gemma4 Quantum Elite', tier: 'ultra', description: 'Elite quantum model' },
      { id: 'synova-neural-quantum', name: 'Synova Neural Quantum', tier: 'pro', description: 'Neural quantum model' },
      { id: 'synova-omni-nexus', name: 'Synova Omni Nexus', tier: 'pro', description: 'Omni-capable model' },
      { id: 'synova-quantum-nexus', name: 'Synova Quantum Nexus', tier: 'ultra', description: 'Quantum nexus model' },
      { id: 'synova-nexus-enhanced', name: 'Synova Nexus Enhanced', tier: 'standard', description: 'Enhanced cognitive model' }
    ];
    return models;
  });

  // Get model configuration
  ipcMain.handle('get-model-config', async (_event, modelId) => {
    // Return model configuration based on ID
    return { id: modelId, name: modelId, loaded: true };
  });

  // Switch model
  ipcMain.handle('switch-model', async (_event, modelId) => {
    console.log('Switching to model:', modelId);
    return { success: true, modelId };
  });

  // Get app version
  ipcMain.handle('get-app-version', async () => {
    return app.getVersion();
  });
}
