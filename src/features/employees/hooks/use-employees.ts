import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '../services/employee-api'
import type { EmployeeFormValues } from '../schemas/employee-schema'

export const employeeKeys = {
  all: ['employees'] as const,
  list: (search?: string) => [...employeeKeys.all, 'list', search] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
}

export function useEmployees(search?: string) {
  return useQuery({ queryKey: employeeKeys.list(search), queryFn: () => employeeApi.list(search) })
}

export function useEmployee(id: string) {
  return useQuery({ queryKey: employeeKeys.detail(id), queryFn: () => employeeApi.get(id), enabled: Boolean(id) })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: EmployeeFormValues) => employeeApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  })
}