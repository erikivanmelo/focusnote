import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: (name: string, params: any[]) => Promise<any>;
  }
}
