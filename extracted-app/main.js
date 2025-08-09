const { app, BrowserWindow, Menu, dialog, shell, ipcMain, nativeTheme } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')
const isDev = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object
let mainWindow
let splashWindow

// macOS specific configuration
if (process.platform === 'darwin') {
  const iconPath = path.join(__dirname, '../assets/icons/icon.png')
  if (require('fs').existsSync(iconPath)) {
    app.dock.setIcon(iconPath)
  }
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  splashWindow.loadFile(path.join(__dirname, 'splash.html'))
  
  splashWindow.on('closed', () => {
    splashWindow = null
  })
}

function createMainWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    show: false, // Don't show until ready
    titleBarStyle: 'hiddenInset', // macOS native title bar
    vibrancy: 'under-window', // macOS blur effect
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev
    },
    // icon: path.join(__dirname, '../assets/icons/icon.png') // Removed to prevent errors
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    // In production, files are packaged in app.asar
    // __dirname points to the asar file, so we need to find the dist files inside it
    const possiblePaths = [
      path.join(__dirname, 'dist/index.html'),     // Inside asar
      path.join(__dirname, '../dist/index.html'),  // Next to asar
      path.join(process.resourcesPath, 'app/dist/index.html'), // Alternative location
    ]
    
    let foundPath = null
    console.log('__dirname:', __dirname)
    console.log('process.resourcesPath:', process.resourcesPath)
    
    for (const testPath of possiblePaths) {
      console.log('Testing path:', testPath, 'exists:', fs.existsSync(testPath))
      if (fs.existsSync(testPath)) {
        foundPath = testPath
        break
      }
    }
    
    if (foundPath) {
      console.log('Loading app from:', foundPath)
      mainWindow.loadFile(foundPath)
    } else {
      console.error('Could not find index.html in any location')
      // Load development server as fallback if available
      mainWindow.loadURL('data:text/html,<h1>HemantDoc ScriptWriter Pro</h1><p>Starting development mode...</p><script>setTimeout(() => window.location="http://localhost:3000", 2000)</script>')
    }
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close()
    }
    mainWindow.show()
    
    // Focus app on macOS
    if (process.platform === 'darwin') {
      app.focus()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // macOS specific window management
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin' && !app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })
}

// macOS Menu Bar Configuration
function createMenu() {
  const template = [
    {
      label: 'HemantDoc ScriptWriter Pro',
      submenu: [
        {
          label: 'About HemantDoc ScriptWriter Pro',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('open-preferences')
          }
        },
        { type: 'separator' },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: 'Hide HemantDoc ScriptWriter Pro',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.isQuiting = true
            app.quit()
          }
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-project')
          }
        },
        {
          label: 'Open Project...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Script Files', extensions: ['fdx', 'fountain', 'txt'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            })
            
            if (!result.canceled) {
              mainWindow.webContents.send('open-file', result.filePaths[0])
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-script')
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              filters: [
                { name: 'PDF Files', extensions: ['pdf'] },
                { name: 'Text Files', extensions: ['txt'] },
                { name: 'Fountain Files', extensions: ['fountain'] }
              ]
            })
            
            if (!result.canceled) {
              mainWindow.webContents.send('save-as', result.filePath)
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Import Script...',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            mainWindow.webContents.send('import-script')
          }
        },
        {
          label: 'Export PDF...',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('export-pdf')
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Find...',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            mainWindow.webContents.send('find-in-script')
          }
        },
        {
          label: 'Replace...',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('replace-in-script')
          }
        },
        { type: 'separator' },
        {
          label: 'Auto-Format Script',
          accelerator: 'CmdOrCtrl+Shift+F',
          click: () => {
            mainWindow.webContents.send('auto-format-script')
          }
        }
      ]
    },
    {
      label: 'Production',
      submenu: [
        {
          label: 'AI Script Breakdown',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.send('run-ai-breakdown')
          }
        },
        {
          label: 'Schedule Production',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('open-scheduling')
          }
        },
        {
          label: 'Generate Reports',
          click: () => {
            mainWindow.webContents.send('generate-reports')
          }
        },
        { type: 'separator' },
        {
          label: 'Team Collaboration',
          click: () => {
            mainWindow.webContents.send('open-collaboration')
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'HemantDoc ScriptWriter Pro Help',
          click: () => {
            shell.openExternal('https://github.com/hemantdoc/scriptwriter-pro/wiki')
          }
        },
        {
          label: 'Keyboard Shortcuts',
          click: () => {
            mainWindow.webContents.send('show-shortcuts')
          }
        },
        { type: 'separator' },
        {
          label: 'Report an Issue',
          click: () => {
            shell.openExternal('https://github.com/hemantdoc/scriptwriter-pro/issues')
          }
        },
        {
          label: 'Check for Updates',
          click: () => {
            autoUpdater.checkForUpdatesAndNotify()
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// App event handlers
app.whenReady().then(() => {
  createSplashWindow()
  
  // Small delay to show splash screen
  setTimeout(() => {
    createMainWindow()
    createMenu()
    
    // Check for updates
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  }, 2000)

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    } else if (mainWindow) {
      mainWindow.show()
    }
  })
})

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  app.isQuiting = true
})

// IPC handlers for native functionality
ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options)
  return result
})

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options)
  return result
})

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options)
  return result
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-app-path', (event, name) => {
  return app.getPath(name)
})

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    await fs.promises.writeFile(filePath, content, 'utf8')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8')
    return { success: true, content }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.')
})

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  console.log(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded')
  autoUpdater.quitAndInstall()
})