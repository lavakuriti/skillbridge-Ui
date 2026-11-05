import { useQuery } from '@tanstack/react-query'
import { reportApi } from '../services/report-api'

export const reportKeys = {
  all: ['reports'] as const,
  list: () => [...reportKeys.all, 'list'] as const,
  completion: (filters: { department?: string; program?: string }) => [...reportKeys.all, 'completion', filters] as const,
}

export function useReports() {
  return useQuery({ queryKey: reportKeys.list(), queryFn: reportApi.list })
}

export function useTrainingCompletionReport(filters: { department?: string; program?: string }) {
  return useQuery({ queryKey: reportKeys.completion(filters), queryFn: () => reportApi.trainingCompletion(filters) })
}