import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      window: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
        isMaximized: () => Promise<boolean>;
        onMaximized: (callback: (isMaximized: boolean) => void) => void;
      }
    };
    ipcCall: (name: string, params?: any) => Promise<any>;
  }
}
