import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { CreateProgramInput, Program, ProgramContentItem, ProgramFilters, ProgramListResponse, UpdateProgramInput } from '../types/program'
import type { ProgramContentValues } from '../schemas/program-content-schema'

export const programApi = {
  async list(filters: ProgramFilters): Promise<ProgramListResponse> {
    const response = await apiClient.get<ProgramListResponse>(API_ENDPOINTS.programs, { params: filters })
    return response.data
  },
  async create(input: CreateProgramInput): Promise<Program> {
    const response = await apiClient.post<{ data: Program }>(API_ENDPOINTS.programs, input)
    return response.data.data
  },
  async update(id: string, input: UpdateProgramInput): Promise<Program> {
    const response = await apiClient.patch<{ data: Program }>(API_ENDPOINTS.program(id), input)
    return response.data.data
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.program(id))
  },
  async content(id: string): Promise<ProgramContentItem[]> {
    const response = await apiClient.get<{ data: ProgramContentItem[] }>(`${API_ENDPOINTS.program(id)}/content`)
    return response.data.data
  },
  async addContent(id: string, input: ProgramContentValues): Promise<ProgramContentItem> {
    const response = await apiClient.post<{ data: ProgramContentItem }>(`${API_ENDPOINTS.program(id)}/content`, input)
    return response.data.data
  },
}