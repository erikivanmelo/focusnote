import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Función para llamadas IPC genéricas
function ipcCall(name: string, params?: any): Promise<any> {
  return ipcRenderer.invoke('ipcCall', name, params);
}

// API para control de ventana
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

// Combinar las APIs
type ExposedApis = typeof electronAPI & {
  window: typeof windowApi;
};

const api: ExposedApis = {
  ...electronAPI,
  window: windowApi
};

// Exponer al renderer
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
