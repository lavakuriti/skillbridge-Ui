import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trainingApi } from '../services/training-api'

export const trainingKeys = { workspace: ['training', 'workspace'] as const }

export function useTrainingWorkspace() {
  return useQuery({ queryKey: trainingKeys.workspace, queryFn: trainingApi.workspace })
}

export function useUpdateTrainingItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ kind, id, status }: { kind: string; id: string; status: string }) => trainingApi.updateItem(kind, id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.workspace }),
  })
}

export function useCreateLearningPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) => trainingApi.createLearningPlan(name, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trainingKeys.workspace }),
  })
}