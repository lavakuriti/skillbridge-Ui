import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { examApi } from '../services/exam-api'
import type { ExamFormValues } from '../schemas/exam-schema'

export const examKeys = {
  all: ['exams'] as const,
  list: (search?: string) => [...examKeys.all, 'list', search] as const,
  results: (id: string) => [...examKeys.all, 'results', id] as const,
}

export function useExams(search?: string) {
  return useQuery({ queryKey: examKeys.list(search), queryFn: () => examApi.list(search) })
}

export function useExamResults(id: string) {
  return useQuery({ queryKey: examKeys.results(id), queryFn: () => examApi.results(id), enabled: Boolean(id) })
}

export function useCreateExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ExamFormValues) => examApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  })
}