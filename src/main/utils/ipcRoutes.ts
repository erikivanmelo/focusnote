import { IpcMain } from 'electron';
import { registerServiceRoutes } from './ipcRouter';

/**
 * Configura todas las rutas IPC para la aplicación
 */
export function setupIpcRoutes(ipcMain: IpcMain): void {
  // Register service routes
  registerServiceRoutes(ipcMain);

  console.log('[IPC] All routes registered successfully');
}
