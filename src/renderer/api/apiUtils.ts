export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export async function callApi<T = any>(serviceName: string, methodName: string, params?: any): Promise<ApiResponse<T>> {
  console.log('[API CALL]', `${serviceName}.${methodName}`, 'params:', params);
  try {
    const response = await window.ipcCall(`${serviceName}.${methodName}`, params);
    console.log('[API RESPONSE]', `${serviceName}.${methodName}`, 'response:', response);

    if (!response.success) {
      throw new Error(response.error || 'Unknown error');
    }

    return {
      success: true,
      data: response.data,
      error: undefined,
      status: undefined
    };
  } catch (error) {
    console.error('[API ERROR]', `${serviceName}.${methodName}`, error);
    return {
      success: false,
      data: undefined,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

export function createApiHandler<T = any>(serviceName: string, methodName: string) {
  return async (params?: any): Promise<ApiResponse<T>> => {
    return callApi<T>(serviceName, methodName, params);
  };
}

// Helper para endpoints que devuelven arrays
export async function apiArrayCall<T>(serviceName: string, methodName: string, params?: any): Promise<T[]> {
  const response = await callApi<T[]>(serviceName, methodName, params);
  if (response.success) return Array.isArray(response.data) ? response.data : [];
  throw new Error(response.error || 'Error en API array call');
}

// Helper para endpoints que devuelven un objeto
export async function apiObjectCall<T>(serviceName: string, methodName: string, params?: any): Promise<T | null> {
  const response = await callApi<T>(serviceName, methodName, params);
  if (response.success) return response.data ?? null;
  throw new Error(response.error || 'Error en API object call');
}

export function createApiHandlers<T extends Record<string, (...args: any[]) => Promise<ApiResponse<any>>>>(
  serviceName: string,
  methodNames: string[]
): T {
  const handlers: Record<string, (...args: any[]) => Promise<ApiResponse<any>>> = {};

  // Crear un handler para cada método
  methodNames.forEach(methodName => {
    handlers[methodName] = createApiHandler(serviceName, methodName);
  });

  return handlers as T;
}
