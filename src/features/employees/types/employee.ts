export interface Employee {
  id: string
  name: string
  email: string
  department: string
  role: string
  programs: number
  completion: number
  status: 'Active' | 'Inactive'
}

export interface EmployeeListResponse {
  data: Employee[]
  total: number
}