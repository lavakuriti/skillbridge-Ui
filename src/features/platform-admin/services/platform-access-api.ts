import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { PlatformUser } from '../types/access'

export const platformAccessApi = {
  async currentUser(): Promise<PlatformUser> {
    const response = await apiClient.get<{ data: PlatformUser }>(API_ENDPOINTS.currentUser)
    return response.data.data
  },
}