const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),
  
  // Menu events - receive
  onNewProject: (callback) => ipcRenderer.on('new-project', callback),
  onOpenFile: (callback) => ipcRenderer.on('open-file', callback),
  onSaveScript: (callback) => ipcRenderer.on('save-script', callback),
  onSaveAs: (callback) => ipcRenderer.on('save-as', callback),
  onImportScript: (callback) => ipcRenderer.on('import-script', callback),
  onExportPDF: (callback) => ipcRenderer.on('export-pdf', callback),
  onAutoFormatScript: (callback) => ipcRenderer.on('auto-format-script', callback),
  onRunAIBreakdown: (callback) => ipcRenderer.on('run-ai-breakdown', callback),
  onOpenScheduling: (callback) => ipcRenderer.on('open-scheduling', callback),
  onOpenCollaboration: (callback) => ipcRenderer.on('open-collaboration', callback),
  onGenerateReports: (callback) => ipcRenderer.on('generate-reports', callback),
  onFindInScript: (callback) => ipcRenderer.on('find-in-script', callback),
  onReplaceInScript: (callback) => ipcRenderer.on('replace-in-script', callback),
  onShowShortcuts: (callback) => ipcRenderer.on('show-shortcuts', callback),
  onOpenPreferences: (callback) => ipcRenderer.on('open-preferences', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform detection
  platform: process.platform,
  
  // Development mode detection
  isDev: process.env.NODE_ENV === 'development'
})

// Expose a limited API for notifications
contextBridge.exposeInMainWorld('notificationAPI', {
  send: (title, body, icon) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body, icon })
        }
      })
    }
  }
})

// Theme detection
contextBridge.exposeInMainWorld('themeAPI', {
  getSystemTheme: () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },
  onThemeChange: (callback) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', callback)
    return () => mediaQuery.removeEventListener('change', callback)
  }
})