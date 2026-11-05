import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { LearningPlan, TrainingWorkspace } from '../types/training'

export const trainingApi = {
  async workspace(): Promise<TrainingWorkspace> {
    const response = await apiClient.get<{ data: TrainingWorkspace }>(API_ENDPOINTS.trainingWorkspace)
    return response.data.data
  },
  async updateItem(kind: string, id: string, status: string): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.trainingWorkspace}/${kind}/${id}`, { status })
  },
  async createLearningPlan(name: string, description: string): Promise<LearningPlan> {
    const response = await apiClient.post<{ data: LearningPlan }>(API_ENDPOINTS.learningPlans, { name, description })
    return response.data.data
  },
}