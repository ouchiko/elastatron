import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import {
  listEndpoints,
  addEndpoint,
  updateEndpoint,
  deleteEndpoint,
  getActiveEndpointId,
  setActiveEndpoint,
  EndpointInput
} from './endpoints'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.elastatron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('endpoints:list', () => listEndpoints())
  ipcMain.handle('endpoints:add', (_, input: EndpointInput) => addEndpoint(input))
  ipcMain.handle('endpoints:update', (_, id: string, input: EndpointInput) =>
    updateEndpoint(id, input)
  )
  ipcMain.handle('endpoints:delete', (_, id: string) => deleteEndpoint(id))
  ipcMain.handle('endpoints:getActive', () => getActiveEndpointId())
  ipcMain.handle('endpoints:setActive', (_, id: string) => setActiveEndpoint(id))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
