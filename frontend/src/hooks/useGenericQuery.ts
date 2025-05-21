import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';

// T = tipo de datos devueltos, P = tipo de parámetros
export function useGenericQuery<T, P = void>(
  queryKey: QueryKey,
  queryFn: (params: P) => Promise<T>,
  params: P,
  options?: UseQueryOptions<T>
) {
  return useQuery<T>({
    queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey]), params],
    queryFn: () => queryFn(params),
    ...options,
  });
}

// Sobrecarga para queries sin parámetros
export function useGenericQueryNoParams<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: UseQueryOptions<T>
) {
  return useQuery<T>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
    ...options,
  });
}
