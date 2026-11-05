import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { platformApi } from '../services/platform-api'
import type { OrganizationFilters, OrganizationLifecycleAction } from '../types/organization'
import type { OrganizationFormValues } from '../schemas/organization-schema'

export const platformKeys = {
    dashboard: ['platform', 'dashboard'] as const,
    organizations: ['platform', 'organizations'] as const,
    list: (filters: OrganizationFilters) => [...platformKeys.organizations, filters] as const,
    detail: (id: string) => [...platformKeys.organizations, 'detail', id] as const,
    activity: (id: string) => [...platformKeys.organizations, 'activity', id] as const,
}

export function usePlatformDashboard() {
    return useQuery({ queryKey: platformKeys.dashboard, queryFn: platformApi.dashboard })
}

export function useOrganizations(filters: OrganizationFilters) {
    return useQuery({ queryKey: platformKeys.list(filters), queryFn: () => platformApi.listOrganizations(filters) })
}

export function useOrganization(id: string) {
    return useQuery({ queryKey: platformKeys.detail(id), queryFn: () => platformApi.getOrganization(id), enabled: Boolean(id) })
}

export function useOrganizationActivity(id: string) {
    return useQuery({ queryKey: platformKeys.activity(id), queryFn: () => platformApi.organizationActivity(id), enabled: Boolean(id) })
}

export function useCreateOrganization() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (input: OrganizationFormValues) => platformApi.createOrganization(input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['platform'] }),
    })
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: OrganizationFormValues }) => platformApi.updateOrganization(id, input),
        onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: platformKeys.detail(variables.id) }),
    })
}

export function useOrganizationLifecycle() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: OrganizationLifecycleAction }) => platformApi.transitionOrganization(id, action),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: ['platform'] })
            void queryClient.invalidateQueries({ queryKey: platformKeys.detail(variables.id) })
            void queryClient.invalidateQueries({ queryKey: platformKeys.activity(variables.id) })
        },
    })
}

export function useBulkApproveOrganizations() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: string[]) => platformApi.bulkApprove(ids),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['platform'] }),
    })
}