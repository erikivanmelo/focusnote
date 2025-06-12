import { IpcMain} from 'electron';
import colorService from '../services/colorService';
import noteService from '../services/noteService';
import tagService from '../services/tagService';

type IpcResponse<T = any> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number };

type ServiceMap = {
  color: typeof colorService & { [key: string]: (...args: any[]) => any };
  note: typeof noteService & { [key: string]: (...args: any[]) => any };
  tag: typeof tagService & { [key: string]: (...args: any[]) => any };
};

// Mapeo de servicios
const serviceMap: ServiceMap = {
  color: colorService,
  note: noteService,
  tag: tagService
} as const;

// Función para manejar llamadas a métodos de servicios
function handleServiceCall(serviceName: keyof ServiceMap, methodName: string, params: any): Promise<IpcResponse> {
  const service = serviceMap[serviceName];
  if (!service) {
    return Promise.resolve({
      success: false,
      error: `Service ${serviceName} not found`,
      status: 404
    });
  }

  // Get the method using bracket notation
  const method = service[methodName];

  if (!method) {
    return Promise.resolve({
      success: false,
      error: `Method ${methodName} not found in service ${serviceName}`,
      status: 404
    });
  }

  try {
    // Execute the method with the service as context
    const result = params !== undefined && params !== null ?
      method.call(service, params) :
      method.call(service);

    return Promise.resolve({
      success: true,
      data: result
    });
  } catch (error) {
    return Promise.resolve({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    });
  }
}

// Exportar el tipo IpcResponse
export type { IpcResponse };

// Función para registrar rutas IPC
export function registerServiceRoutes(ipcMain: IpcMain) {
  ipcMain.handle('ipcCall', async (_event: Electron.IpcMainInvokeEvent, name: string, params: any) => {
    // Parsear el nombre del método (ej: 'note.getAll' -> ['note', 'getAll'])
    const [serviceName, methodName] = name.split('.');

    if (!serviceName || !methodName) {
      return {
        success: false,
        error: 'Invalid method name format. Expected: service.method',
        status: 400
      };
    }

    // Verificar si el serviceName es una clave válida del ServiceMap
    if (!(serviceName in serviceMap)) {
      return {
        success: false,
        error: `Service ${serviceName} not found`,
        status: 404
      };
    }

    return handleServiceCall(serviceName as keyof ServiceMap, methodName, params);
  });
}

/**
 * Configura todas las rutas IPC
 */
export function setupIpcRoutes(ipcMain: IpcMain) {
  // Configurar todas las rutas de servicios
  Object.entries(serviceMap).forEach(([serviceName, service]) => {
    // Get the keys of the service object type
    const methodNames = Object.keys(service);
    methodNames.forEach(methodName => {
      const method = service[methodName];
      if (typeof method === 'function') {
        const route = `${serviceName}.${methodName}`;
        ipcMain.handle(route, async (_event: any, args: any) => {
          try {
            const result = await method.call(service, args);
            return { success: true, data: result };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : 'An error occurred',
              status: 500
            };
          }
        });
      }
    });
  });
}
