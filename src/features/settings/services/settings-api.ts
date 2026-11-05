import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { SettingsResponse } from '../types/settings'
import type { AdminUserFormValues } from '../schemas/admin-user-schema'
import type { AdminUser } from '../types/settings'

export const settingsApi = {
  async get(): Promise<SettingsResponse> {
    const response = await apiClient.get<{ data: SettingsResponse }>(API_ENDPOINTS.settings)
    return response.data.data
  },
  async save(section: string, values: Record<string, string | number | boolean>): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.settingsSection(section), { values })
  },
  async createUser(input: AdminUserFormValues): Promise<AdminUser> {
    const response = await apiClient.post<{ data: AdminUser }>(API_ENDPOINTS.settingsUsers, input)
    return response.data.data
  },
  async updateUser(id: string, input: AdminUserFormValues): Promise<AdminUser> {
    const response = await apiClient.patch<{ data: AdminUser }>(API_ENDPOINTS.settingsUser(id), input)
    return response.data.data
  },
}