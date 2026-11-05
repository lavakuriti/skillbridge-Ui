export interface ReportDefinition {
  id: string
  title: string
  description: string
  route: string
  group: 'Training' | 'Examination' | 'Employees' | 'Certificates'
}

export interface CompletionRow {
  program: string
  department: string
  enrolled: number
  completed: number
  inProgress: number
  completionRate: number
}

export interface TrainingCompletionReport {
  totalEnrolled: number
  completed: number
  inProgress: number
  notStarted: number
  completionRate: number
  programs: CompletionRow[]
}