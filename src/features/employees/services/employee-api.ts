import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { Employee, EmployeeListResponse } from '../types/employee'
import type { EmployeeFormValues } from '../schemas/employee-schema'

export const employeeApi = {
  async list(search?: string): Promise<EmployeeListResponse> {
    const response = await apiClient.get<EmployeeListResponse>(API_ENDPOINTS.employees, { params: { search } })
    return response.data
  },
  async get(id: string): Promise<Employee> {
    const response = await apiClient.get<{ data: Employee }>(API_ENDPOINTS.employee(id))
    return response.data.data
  },
  async create(input: EmployeeFormValues): Promise<Employee> {
    const response = await apiClient.post<{ data: Employee }>(API_ENDPOINTS.employees, input)
    return response.data.data
  },
}