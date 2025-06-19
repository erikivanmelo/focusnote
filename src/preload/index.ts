import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Function for generic IPC calls
function ipcCall(name: string, params?: any): Promise<any> {
  return ipcRenderer.invoke('ipcCall', name, params);
}

// Update API
const updateApi = {
  onUpdateAvailable: (callback: (info: { version: string; releaseNotes?: string }) => void) => {
    const listener = (_: unknown, info: { version: string; releaseNotes?: string }) => callback(info);
    ipcRenderer.on('update-available', listener);
    return () => {
      ipcRenderer.removeListener('update-available', listener);
    };
  },
  onDownloadProgress: (callback: (progress: { percent: number; bytesPerSecond: number; total: number; transferred: number }) => void) => {
    const listener = (_: unknown, progress: { percent: number; bytesPerSecond: number; total: number; transferred: number }) => callback(progress);
    ipcRenderer.on('download-progress', listener);
    return () => {
      ipcRenderer.removeListener('download-progress', listener);
    };
  },
  onUpdateDownloaded: (callback: (info: { version: string; releaseNotes?: string }) => void) => {
    const listener = (_: unknown, info: { version: string; releaseNotes?: string }) => callback(info);
    ipcRenderer.on('update-downloaded', listener);
    return () => {
      ipcRenderer.removeListener('update-downloaded', listener);
    };
  },
  onUpdateError: (callback: (error: Error) => void) => {
    const listener = (_: unknown, error: Error) => callback(error);
    ipcRenderer.on('update-error', listener);
    return () => {
      ipcRenderer.removeListener('update-error', listener);
    };
  },
  checkForUpdates: (): Promise<void> => {
    return ipcRenderer.invoke('check-for-updates');
  },
  quitAndInstall: (): void => {
    ipcRenderer.send('quit-and-install');
  }
};

// Window control API
const windowApi = {
  minimize: (): void => ipcRenderer.send('window:minimize'),
  maximize: (): void => ipcRenderer.send('window:maximize'),
  close: (): void => ipcRenderer.send('window:close'),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:is-maximized'),
  onMaximized: (callback: (isMaximized: boolean) => void): (() => void) => {
    const listener = (_: unknown, isMaximized: boolean) => callback(isMaximized);
    ipcRenderer.on('window:maximized', listener);
    return () => {
      ipcRenderer.removeListener('window:maximized', listener);
    };
  }
};

// Combine all APIs
type ExposedApis = typeof electronAPI & {
  window: typeof windowApi;
  update: typeof updateApi;
};

const api: ExposedApis = {
  ...electronAPI,
  window: windowApi,
  update: updateApi
};

// Expose to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', api);
    contextBridge.exposeInMainWorld('ipcCall', ipcCall);
  } catch (error) {
    console.error('Failed to expose API to renderer:', error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = api;
  // @ts-ignore (define in dts)
  window.ipcCall = ipcCall;
}
