export interface DashboardSummary {
  activePrograms: number
  pendingAssignments: number
  employeesToday: number
  skillGaps: number
  totalEnrolled: number
  completionRate: number
  completed: number
  inProgress: number
  notStarted: number
}

export interface DashboardActivity {
  id: string
  title: string
  detail: string
  time: string
  type: 'employee' | 'program' | 'exam'
}