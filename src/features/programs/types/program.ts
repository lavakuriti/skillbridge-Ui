export type ProgramStatus = 'Active' | 'Draft'

export interface Program {
  id: string
  name: string
  code: string
  category: string
  trainer: string
  enrolled: number
  completion: number
  status: ProgramStatus
  department: string
  startDate: string
  description?: string
  skillLevel?: string
  duration?: number
  mode?: string
  prerequisites?: string
}

export interface ProgramListResponse {
  data: Program[]
  total: number
}

export interface ProgramFilters {
  search?: string
  status?: string
  department?: string
}

export type CreateProgramInput = Pick<Program, 'name' | 'code' | 'category' | 'department' | 'trainer' | 'startDate'> &
  Partial<Pick<Program, 'description' | 'skillLevel' | 'duration' | 'mode' | 'prerequisites'>>

export type UpdateProgramInput = Partial<CreateProgramInput> & { status?: ProgramStatus }

export interface ProgramContentItem {
  id: string
  moduleId: string
  title: string
  type: 'Module' | 'Video' | 'Document' | 'Link' | 'Assessment'
  required: boolean
}