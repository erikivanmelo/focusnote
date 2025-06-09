import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI;
    ipcCall: (name: string, params?: any) => Promise<any>;
  }
}
