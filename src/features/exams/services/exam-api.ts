import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { Exam, ExamListResponse, ExamResultsResponse } from '../types/exam'
import type { ExamFormValues } from '../schemas/exam-schema'

export const examApi = {
  async list(search?: string): Promise<ExamListResponse> {
    const response = await apiClient.get<ExamListResponse>(API_ENDPOINTS.exams, { params: { search } })
    return response.data
  },
  async create(input: ExamFormValues): Promise<Exam> {
    const response = await apiClient.post<{ data: Exam }>(API_ENDPOINTS.exams, input)
    return response.data.data
  },
  async results(id: string): Promise<ExamResultsResponse> {
    const response = await apiClient.get<{ data: ExamResultsResponse }>(`${API_ENDPOINTS.exams}/${id}/results`)
    return response.data.data
  },
}