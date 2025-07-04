import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Note: electron-vite already provides HMR (Hot Module Replacement) for development
// The renderer will automatically reload when files change in development mode

let mouseEventsIgnored = false
let mainWindow: BrowserWindow
app.disableHardwareAcceleration()

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    fullscreen: false,
    focusable: true,
        // show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // mainWindow.setIgnoreMouseEvents(true)


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Prevent titlebar from showing when focus is lost
  mainWindow.on('blur', () => {
    // Force hide menu bar when window loses focus
    mainWindow.setMenuBarVisibility(false)
    if (process.platform === 'win32') {
      mainWindow.setAutoHideMenuBar(true)
    }
  })

  mainWindow.on('focus', () => {
    // Ensure menu bar stays hidden when window gains focus
    mainWindow.setMenuBarVisibility(false)
    if (process.platform === 'win32') {
      mainWindow.setAutoHideMenuBar(true)
    }
  })

  // Add keyboard shortcut for manual reload
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if ((input.control || input.meta) && input.key.toLowerCase() === 'r') {
      event.preventDefault()
      mainWindow.reload()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  globalShortcut.register('CommandOrControl+M', () => {
    mouseEventsIgnored = !mouseEventsIgnored
    mainWindow.setIgnoreMouseEvents(mouseEventsIgnored, { forward: true })
    console.log(`Mouse events ${mouseEventsIgnored ? 'disabled' : 'enabled'}`)
  })

  // IPC handler for reload
  ipcMain.handle('reload-app', () => {
    mainWindow.reload()
    return { success: true }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
