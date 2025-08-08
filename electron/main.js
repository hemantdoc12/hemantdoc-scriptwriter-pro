const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { autoUpdater } = require('electron-updater')

// Keep a global reference of the window object
let mainWindow
let splashWindow

function createSplashWindow() {
  // Create the splash window
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

  splashWindow.loadFile('splash.html')
  
  splashWindow.on('closed', () => {
    splashWindow = null
  })
  
  // Show splash for 2 seconds then create main window
  setTimeout(() => {
    createWindow()
    if (splashWindow) {
      splashWindow.close()
    }
  }, 2000)
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    icon: path.join(__dirname, '../assets/icons/icon.png'),
    show: false // Don't show until ready
  })

  // Load the app
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Check for updates
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  })

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Create application menu
  createMenu()
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Script',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-script')
          }
        },
        {
          label: 'Open Script',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Script Files', extensions: ['fdx', 'txt', 'fountain'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            })
            
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0]
              try {
                const content = fs.readFileSync(filePath, 'utf8')
                mainWindow.webContents.send('menu-open-script', content, filePath)
              } catch (error) {
                dialog.showErrorBox('Error', `Could not read file: ${error.message}`)
              }
            }
          }
        },
        {
          label: 'Save Script',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save-script')
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('menu-save-as-script')
          }
        },
        { type: 'separator' },
        {
          label: 'Export PDF',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-export-pdf')
          }
        },
        {
          label: 'Export Final Draft',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => {
            mainWindow.webContents.send('menu-export-fdx')
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
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
        { role: 'paste' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            mainWindow.webContents.send('menu-find')
          }
        },
        {
          label: 'Find and Replace',
          accelerator: 'CmdOrCtrl+Shift+F',
          click: () => {
            mainWindow.webContents.send('menu-replace')
          }
        }
      ]
    },
    {
      label: 'Format',
      submenu: [
        {
          label: 'Scene Heading',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            mainWindow.webContents.send('menu-format-element', 'scene_heading')
          }
        },
        {
          label: 'Action',
          accelerator: 'CmdOrCtrl+2', 
          click: () => {
            mainWindow.webContents.send('menu-format-element', 'action')
          }
        },
        {
          label: 'Character',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            mainWindow.webContents.send('menu-format-element', 'character')
          }
        },
        {
          label: 'Dialogue',
          accelerator: 'CmdOrCtrl+4',
          click: () => {
            mainWindow.webContents.send('menu-format-element', 'dialogue')
          }
        },
        {
          label: 'Parenthetical',
          accelerator: 'CmdOrCtrl+5',
          click: () => {
            mainWindow.webContents.send('menu-format-element', 'parenthetical')
          }
        },
        {
          label: 'Transition',
          accelerator: 'CmdOrCtrl+6',
          click: () => {
            mainWindow.webContents.send('menu-format-element', 'transition')
          }
        },
        { type: 'separator' },
        {
          label: 'Auto-Format Script',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => {
            mainWindow.webContents.send('menu-auto-format')
          }
        }
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
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Toggle Preview Mode',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.send('menu-toggle-preview')
          }
        }
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
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow.webContents.send('menu-show-shortcuts')
          }
        },
        {
          label: 'About HemantDoc ScriptWriter Pro',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About HemantDoc ScriptWriter Pro',
              message: 'HemantDoc ScriptWriter Pro v3.0.0',
              detail: 'Professional screenplay formatting system with industry-standard positioning, Celtx-style formatting, scene numbering, and AI script analysis.\\n\\nDeveloped with professional-grade features for screenwriters.'
            })
          }
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            autoUpdater.checkForUpdatesAndNotify()
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Window menu
    template[5].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC handlers for file operations
ipcMain.handle('save-file', async (event, content, filePath) => {
  try {
    if (filePath) {
      fs.writeFileSync(filePath, content, 'utf8')
      return { success: true, filePath }
    } else {
      const result = await dialog.showSaveDialog(mainWindow, {
        filters: [
          { name: 'Script Files', extensions: ['fdx', 'txt', 'fountain'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
      
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, content, 'utf8')
        return { success: true, filePath: result.filePath }
      }
    }
    return { success: false }
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

// App event handlers
app.whenReady().then(createSplashWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Security: Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    
    if (parsedUrl.origin !== 'http://localhost:3000' && parsedUrl.origin !== 'file://') {
      event.preventDefault()
    }
  })
})