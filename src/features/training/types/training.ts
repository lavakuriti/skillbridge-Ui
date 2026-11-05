export interface PendingAssignment {
  id: string
  employee: string
  employeeId: string
  department: string
  program: string
  assignmentType: 'Manager Approval' | 'Self Enrolled'
  pendingSince: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface TrainingActivity {
  id: string
  employee: string
  employeeId: string
  program: string
  category: string
  type: 'Online' | 'Classroom'
  session: string
  status: 'Present' | 'Not Marked' | 'Absent'
}

export interface SkillGap {
  id: string
  employee: string
  employeeId: string
  department: string
  skill: string
  currentLevel: string
  requestedLevel: string
  severity: 'High' | 'Medium' | 'Low'
  detectedOn: string
  recommendation: string
  status: 'Open' | 'Reviewed' | 'Closed'
}

export interface LearningPlan {
  id: string
  name: string
  description: string
  programs: number
  employees: number
  status: 'Draft' | 'Active'
}

export interface TrainingWorkspace {
  assignments: PendingAssignment[]
  activities: TrainingActivity[]
  skillGaps: SkillGap[]
  learningPlans: LearningPlan[]
}