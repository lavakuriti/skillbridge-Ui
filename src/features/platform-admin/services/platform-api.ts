import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type {
    Organization,
    OrganizationActivity,
    OrganizationDashboard,
    OrganizationFilters,
    OrganizationLifecycleAction,
    OrganizationPageResult,
} from '../types/organization'
import type { OrganizationFormValues } from '../schemas/organization-schema'

export const platformApi = {
    async dashboard(): Promise<OrganizationDashboard> {
        const response = await apiClient.get<{ data: OrganizationDashboard }>(API_ENDPOINTS.platformDashboard)
        return response.data.data
    },
    async listOrganizations(filters: OrganizationFilters): Promise<OrganizationPageResult> {
        const response = await apiClient.get<OrganizationPageResult>(API_ENDPOINTS.platformOrganizations, { params: filters })
        return response.data
    },
    async getOrganization(id: string): Promise<Organization> {
        const response = await apiClient.get<{ data: Organization }>(API_ENDPOINTS.platformOrganization(id))
        return response.data.data
    },
    async createOrganization(input: OrganizationFormValues): Promise<Organization> {
        const response = await apiClient.post<{ data: Organization }>(API_ENDPOINTS.platformOrganizations, input)
        return response.data.data
    },
    async updateOrganization(id: string, input: OrganizationFormValues): Promise<Organization> {
        const response = await apiClient.put<{ data: Organization }>(API_ENDPOINTS.platformOrganization(id), input)
        return response.data.data
    },
    async transitionOrganization(id: string, action: OrganizationLifecycleAction): Promise<Organization> {
        const response = await apiClient.post<{ data: Organization }>(API_ENDPOINTS.platformOrganizationLifecycle(id), { action })
        return response.data.data
    },
    async bulkApprove(ids: string[]): Promise<Organization[]> {
        const response = await apiClient.post<{ data: Organization[] }>(API_ENDPOINTS.platformOrganizationBulkApprove, { ids })
        return response.data.data
    },
    async organizationActivity(id: string): Promise<OrganizationActivity[]> {
        const response = await apiClient.get<{ data: OrganizationActivity[] }>(API_ENDPOINTS.platformOrganizationActivity(id))
        return response.data.data
    },
}