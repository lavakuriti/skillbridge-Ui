import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '../services/settings-api'
import type { AdminUserFormValues } from '../schemas/admin-user-schema'

export const settingsKey = ['settings'] as const

export function useSettings() {
  return useQuery({ queryKey: settingsKey, queryFn: settingsApi.get })
}

export function useSaveSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ section, values }: { section: string; values: Record<string, string | number | boolean> }) => settingsApi.save(section, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKey }),
  })
}

export function useSaveAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: AdminUserFormValues }) => id ? settingsApi.updateUser(id, input) : settingsApi.createUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKey }),
  })
}