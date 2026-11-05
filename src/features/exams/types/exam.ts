export interface Exam {
  id: string
  name: string
  program: string
  date: string
  candidates: number
  averageScore: number | null
  status: 'Scheduled' | 'Present' | 'Completed'
  duration?: number
  questions?: number
  passingScore?: number
  attempts?: number
}

export interface ExamListResponse {
  data: Exam[]
  total: number
}

export interface ExamResult {
  id: string
  name: string
  email: string
  score: number
  status: 'Passed' | 'Failed'
}

export interface ExamResultsResponse {
  exam: string
  totalCandidates: number
  completed: number
  passed: number
  failed: number
  averageScore: number
  results: ExamResult[]
}