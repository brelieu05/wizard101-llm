import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      reload: () => Promise<{ success: boolean }>
      toggleWindowMouseEvents: () => Promise<{ ignoring: boolean }>
      requestInputFocus: () => Promise<{ success: boolean }>
      releaseInputFocus: () => Promise<{ success: boolean }>
      onToggleMouseEvents: (callback: () => void) => () => void
    }
  }
}
