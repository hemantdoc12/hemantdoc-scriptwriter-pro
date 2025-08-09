const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveFile: (content, filePath) => ipcRenderer.invoke('save-file', content, filePath),
  
  // Menu event listeners
  onMenuNewScript: (callback) => ipcRenderer.on('menu-new-script', callback),
  onMenuOpenScript: (callback) => ipcRenderer.on('menu-open-script', callback),
  onMenuSaveScript: (callback) => ipcRenderer.on('menu-save-script', callback),
  onMenuSaveAsScript: (callback) => ipcRenderer.on('menu-save-as-script', callback),
  onMenuExportPdf: (callback) => ipcRenderer.on('menu-export-pdf', callback),
  onMenuExportFdx: (callback) => ipcRenderer.on('menu-export-fdx', callback),
  onMenuFind: (callback) => ipcRenderer.on('menu-find', callback),
  onMenuReplace: (callback) => ipcRenderer.on('menu-replace', callback),
  onMenuFormatElement: (callback) => ipcRenderer.on('menu-format-element', callback),
  onMenuAutoFormat: (callback) => ipcRenderer.on('menu-auto-format', callback),
  onMenuTogglePreview: (callback) => ipcRenderer.on('menu-toggle-preview', callback),
  onMenuShowShortcuts: (callback) => ipcRenderer.on('menu-show-shortcuts', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // System info
  platform: process.platform,
  versions: process.versions
})

// Security: Remove access to Node.js APIs from the renderer process
delete global.require
delete global.exports
delete global.module