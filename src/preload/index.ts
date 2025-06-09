import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ipcRenderer } from 'electron';

function ipcCall(name: string, params?: any): Promise<any> {
  return ipcRenderer.invoke('ipcCall', name, params);
}

// Expose to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('ipcCall', ipcCall);
  } catch (error) {
    console.error('Failed to expose API to renderer:', error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.ipcCall = ipcCall;
}
