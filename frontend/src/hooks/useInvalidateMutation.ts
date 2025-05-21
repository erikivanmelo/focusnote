import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

// T = tipo de argumento, R = tipo de retorno
export function useInvalidateMutation<T = unknown, R = unknown>(
  mutationFn: (variables: T) => Promise<R>,
  invalidateKeys: string | string[],
  options?: UseMutationOptions<R, unknown, T>
) {
  const queryClient = useQueryClient();
  const keys = Array.isArray(invalidateKeys) ? invalidateKeys : [invalidateKeys];

  return useMutation<R, unknown, T>({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      keys.forEach(key =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
    },
  });
}
