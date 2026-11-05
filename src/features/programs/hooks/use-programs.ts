import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { programApi } from '../services/program-api'
import type { CreateProgramInput, ProgramFilters, UpdateProgramInput } from '../types/program'

export const programKeys = {
  all: ['programs'] as const,
  list: (filters: ProgramFilters) => [...programKeys.all, filters] as const,
}

export function usePrograms(filters: ProgramFilters) {
  return useQuery({ queryKey: programKeys.list(filters), queryFn: () => programApi.list(filters) })
}

export function useCreateProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProgramInput) => programApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programKeys.all }),
  })
}

export function useUpdateProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProgramInput }) => programApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programKeys.all }),
  })
}

export function useDeleteProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => programApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programKeys.all }),
  })
}

export function useProgramContent(id: string) {
  return useQuery({ queryKey: [...programKeys.all, id, 'content'], queryFn: () => programApi.content(id), enabled: Boolean(id) })
}

export function useAddProgramContent(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: import('../schemas/program-content-schema').ProgramContentValues) => programApi.addContent(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...programKeys.all, id, 'content'] }),
  })
}