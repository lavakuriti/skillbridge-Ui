import { useQuery } from '@tanstack/react-query'
import { authApi, readStoredAuthToken } from '../services/auth-api'

export const authQueryKeys = {
  currentUser: ['auth', 'current-user'] as const,
}

export function useCurrentUser() {
  const token = readStoredAuthToken()

  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: authApi.currentUser,
    enabled: Boolean(token),
    retry: false,
    staleTime: 30_000,
  })
}
