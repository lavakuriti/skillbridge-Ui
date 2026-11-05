import { apiClient } from '../../../services/api/axios-instance'
import type { DashboardActivity, DashboardSummary } from '../types/dashboard'

export const dashboardApi = {
  async summary(): Promise<DashboardSummary> {
    const response = await apiClient.get<{ data: DashboardSummary }>('/dashboard/summary')
    return response.data.data
  },
  async activity(): Promise<DashboardActivity[]> {
    const response = await apiClient.get<{ data: DashboardActivity[] }>('/dashboard/activity')
    return response.data.data
  },
}