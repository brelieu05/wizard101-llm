import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  reload: () => ipcRenderer.invoke('reload-app'),
  toggleWindowMouseEvents: () => ipcRenderer.invoke('toggle-window-mouse-events'),
  requestInputFocus: () => ipcRenderer.invoke('request-input-focus'),
  releaseInputFocus: () => ipcRenderer.invoke('release-input-focus'),
  onToggleMouseEvents: (callback: () => void) => {
    ipcRenderer.on('toggle-mouse-events', callback)
    return () => ipcRenderer.removeListener('toggle-mouse-events', callback)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
