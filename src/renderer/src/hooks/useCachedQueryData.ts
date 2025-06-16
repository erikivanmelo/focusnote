// src/renderer/src/hooks/useCachedQueryData.ts
import { useQueryClient, QueryKey, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export function useCachedQueryData<T = unknown, TSelected = T>(
  queryKey: QueryKey,
  options?: {
    select?: (data: T) => TSelected;
    isDataLoading?: boolean;
  }
): {
  data: TSelected | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<void>;
} {
  const queryClient = useQueryClient();
  const { select, isDataLoading: externalIsLoading } = options || {};

  // Obtener los datos actuales de la caché
  const getData = useCallback((): T | undefined => {
    return queryClient.getQueryData<T>(queryKey);
  }, [queryClient, queryKey]);

  // Usar useQuery para suscribirse a los cambios
  const {
    data: queryData,
    isLoading: queryIsLoading,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<T>({
    queryKey,
    queryFn: () => {
      const cached = getData();
      if (cached === undefined) {
        return Promise.reject(new Error('No data in cache'));
      }
      return Promise.resolve(cached);
    },
    enabled: false, // No hacemos fetch automático
    staleTime: Infinity, // Considerar los datos siempre frescos
  });

  // Datos combinados (de la caché o de la query si está disponible)
  const data = useMemo(() => {
    const currentData = queryData ?? getData();
    if (currentData === undefined) return undefined;
    return select ? select(currentData) : (currentData as unknown as TSelected);
  }, [queryData, getData, select]);

  // Estado de carga combinado
  const isLoading = externalIsLoading ?? queryIsLoading;

  // Función para forzar recarga
  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Versión con parámetros
export function useCachedQueryDataWithParams<T = unknown, P = unknown, TSelected = T>(
  queryKey: QueryKey,
  params: P,
  options?: {
    select?: (data: T) => TSelected;
    isDataLoading?: boolean;
  }
): ReturnType<typeof useCachedQueryData<T, TSelected>> {
  const fullQueryKey = [...(Array.isArray(queryKey) ? queryKey : [queryKey]), params];
  return useCachedQueryData<T, TSelected>(fullQueryKey, options);
}
