import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { ReportDefinition, TrainingCompletionReport } from '../types/report'

export const reportApi = {
  async list(): Promise<ReportDefinition[]> {
    const response = await apiClient.get<{ data: ReportDefinition[] }>(API_ENDPOINTS.reports)
    return response.data.data
  },
  async trainingCompletion(filters: { department?: string; program?: string }): Promise<TrainingCompletionReport> {
    const response = await apiClient.get<{ data: TrainingCompletionReport }>(API_ENDPOINTS.trainingCompletionReport, { params: filters })
    return response.data.data
  },
}