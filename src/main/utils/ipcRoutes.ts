import { IpcMain } from 'electron';
import { registerServiceRoutes } from './ipcRouter';
import colorService from '../services/colorService';
import noteService from '../services/noteService';
import tagService from '../services/tagService';

/**
 * Configura todas las rutas IPC para la aplicación
 */
export function setupIpcRoutes(ipcMain: IpcMain): void {
  // Register service routes
  registerServiceRoutes(ipcMain);

  console.log('[IPC] All routes registered successfully');
}
