import { useQuery } from '@tanstack/react-query'
import { platformAccessApi } from '../services/platform-access-api'

export const platformAccessKeys = { currentUser: ['platform-access', 'current-user'] as const }

export function usePlatformUser() {
  return useQuery({ queryKey: platformAccessKeys.currentUser, queryFn: platformAccessApi.currentUser })
}