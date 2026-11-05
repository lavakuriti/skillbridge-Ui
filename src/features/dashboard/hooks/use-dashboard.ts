import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../services/dashboard-api'

export const dashboardKeys = { all: ['dashboard'] as const }

export function useDashboardSummary() {
  return useQuery({ queryKey: [...dashboardKeys.all, 'summary'], queryFn: dashboardApi.summary })
}

export function useDashboardActivity() {
  return useQuery({ queryKey: [...dashboardKeys.all, 'activity'], queryFn: dashboardApi.activity })
}