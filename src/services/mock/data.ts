import type { SettingsResponse } from '../../features/settings/types/settings'
import type { ProgramContentItem } from '../../features/programs/types/program'

export type RecordStatus = 'Active' | 'Draft' | 'Scheduled' | 'Present' | 'Pending' | 'Passed' | 'Failed'

export interface ProgramRecord {
  id: string
  name: string
  code: string
  category: string
  trainer: string
  enrolled: number
  completion: number
  status: RecordStatus
  department: string
  startDate: string
  description?: string
  skillLevel?: string
  duration?: number
  mode?: string
  prerequisites?: string
}

export interface EmployeeRecord {
  id: string
  name: string
  email: string
  department: string
  role: string
  programs: number
  completion: number
  status: 'Active' | 'Inactive'
}

export interface ExamRecord {
  id: string
  name: string
  program: string
  date: string
  candidates: number
  averageScore: number | null
  status: RecordStatus
}

export const pendingAssignments = [
  { id: 'a-001', employee: 'Arun Kumar', employeeId: 'EMP001', department: 'IT', program: 'AWS Cloud Basics', assignmentType: 'Manager Approval' as const, pendingSince: '24 Sep 2026', status: 'Pending' as const },
  { id: 'a-002', employee: 'Priya S', employeeId: 'EMP002', department: 'Human Resources', program: 'Leadership Skills', assignmentType: 'Self Enrolled' as const, pendingSince: '25 Sep 2026', status: 'Pending' as const },
  { id: 'a-003', employee: 'Kumar R', employeeId: 'EMP003', department: 'Finance', program: 'Python Programming', assignmentType: 'Manager Approval' as const, pendingSince: '26 Sep 2026', status: 'Pending' as const },
]

export const trainingActivities = [
  { id: 't-001', employee: 'Arun Kumar', employeeId: 'EMP001', program: 'Java Fundamentals', category: 'Technical', type: 'Online' as const, session: '10:00 AM', status: 'Present' as const },
  { id: 't-002', employee: 'Priya S', employeeId: 'EMP002', program: 'Leadership Skills', category: 'Soft Skill', type: 'Classroom' as const, session: '11:30 AM', status: 'Not Marked' as const },
  { id: 't-003', employee: 'Sneha V', employeeId: 'EMP004', program: 'AWS Cloud Basics', category: 'Cloud', type: 'Online' as const, session: '02:00 PM', status: 'Not Marked' as const },
]

export const skillGaps = [
  { id: 'g-001', employee: 'Arun Kumar', employeeId: 'EMP001', department: 'IT', skill: 'AWS', currentLevel: 'Intermediate', requestedLevel: 'Advanced', severity: 'High' as const, detectedOn: '25 Sep 2026', recommendation: 'AWS Advanced Cloud', status: 'Open' as const },
  { id: 'g-002', employee: 'Priya S', employeeId: 'EMP002', department: 'Human Resources', skill: 'Leadership', currentLevel: 'Intermediate', requestedLevel: 'Expert', severity: 'Medium' as const, detectedOn: '24 Sep 2026', recommendation: 'Leadership Skills', status: 'Open' as const },
  { id: 'g-003', employee: 'Kumar R', employeeId: 'EMP003', department: 'Finance', skill: 'Python', currentLevel: 'Beginner', requestedLevel: 'Intermediate', severity: 'Low' as const, detectedOn: '23 Sep 2026', recommendation: 'Python Programming', status: 'Open' as const },
]

export const learningPlans = [
  { id: 'lp-001', name: 'New Hire Engineering Onboarding', description: 'Core technical and compliance programs for new engineering employees.', programs: 4, employees: 18, status: 'Active' as const },
  { id: 'lp-002', name: 'Cloud Certification Path', description: 'Role-based learning path for cloud engineering certification.', programs: 3, employees: 12, status: 'Draft' as const },
]

export const programs: ProgramRecord[] = [
  { id: 'p-001', name: 'Java Fundamentals', code: 'TRN-001', category: 'Technical', trainer: 'Ravi Kumar', enrolled: 80, completion: 78, status: 'Active', department: 'Engineering', startDate: '01 Sep 2026' },
  { id: 'p-002', name: 'Python Programming', code: 'TRN-002', category: 'Technical', trainer: 'Andrew', enrolled: 70, completion: 65, status: 'Active', department: 'Engineering', startDate: '10 Sep 2026' },
  { id: 'p-003', name: 'Leadership Skills', code: 'TRN-003', category: 'Soft Skill', trainer: 'Priya', enrolled: 0, completion: 0, status: 'Draft', department: 'Human Resources', startDate: '15 Sep 2026' },
  { id: 'p-004', name: 'AWS Cloud Basics', code: 'TRN-004', category: 'Cloud', trainer: 'Olivia', enrolled: 65, completion: 72, status: 'Active', department: 'IT', startDate: '10 Sep 2026' },
]

export const employees: EmployeeRecord[] = [
  { id: 'EMP001', name: 'Arun Kumar', email: 'arun@company.com', department: 'IT', role: 'HR Admin', programs: 3, completion: 85, status: 'Active' },
  { id: 'EMP002', name: 'Priya S', email: 'priya@company.com', department: 'Human Resources', role: 'HR Manager', programs: 2, completion: 92, status: 'Active' },
  { id: 'EMP003', name: 'Kumar R', email: 'kumar@company.com', department: 'Finance', role: 'Trainer', programs: 1, completion: 60, status: 'Active' },
  { id: 'EMP004', name: 'Sneha V', email: 'sneha@company.com', department: 'Engineering', role: 'Employee', programs: 2, completion: 76, status: 'Active' },
]

export const exams: ExamRecord[] = [
  { id: 'e-001', name: 'Java Test', program: 'Java Fundamentals', date: '25 Sep 2026', candidates: 80, averageScore: 82, status: 'Scheduled' },
  { id: 'e-002', name: 'AWS Test', program: 'AWS Cloud Basics', date: '25 Sep 2026', candidates: 65, averageScore: null, status: 'Scheduled' },
  { id: 'e-003', name: 'Python Assessment', program: 'Python Programming', date: '25 Sep 2026', candidates: 70, averageScore: 78, status: 'Present' },
]

export const reportDefinitions = [
  { id: 'training-completion', title: 'Training Completion', description: 'View training enrollment, completion, and progress details.', route: '/reports/training-completion', group: 'Training' as const },
  { id: 'exam-results', title: 'Examination Results', description: 'View exam performance and results across programs.', route: '/exams', group: 'Examination' as const },
  { id: 'program-performance', title: 'Program Performance', description: 'Analyze program-wise performance and engagement.', route: '/programs', group: 'Training' as const },
  { id: 'skills-development', title: 'Skills Development', description: 'View skill progress and competency improvement reports.', route: '/training', group: 'Employees' as const },
  { id: 'employee-progress', title: 'Employee Progress', description: 'Track individual employee learning progress and performance.', route: '/employees', group: 'Employees' as const },
  { id: 'certificate-report', title: 'Certificate Report', description: 'Get details of issued certificates and completion status.', route: '/settings', group: 'Certificates' as const },
]

export const programContents: ProgramContentItem[] = [
  { id: 'm-001', moduleId: 'module-1', title: 'Java Basics', type: 'Module' as const, required: true },
  { id: 'l-001', moduleId: 'module-1', title: 'Object Oriented Programming', type: 'Video' as const, required: true },
  { id: 'l-002', moduleId: 'module-1', title: 'Java Fundamentals Guide', type: 'Document' as const, required: true },
  { id: 'm-002', moduleId: 'module-2', title: 'Data Structures', type: 'Module' as const, required: true },
  { id: 'l-003', moduleId: 'module-2', title: 'Collections and Generics', type: 'Video' as const, required: true },
  { id: 'l-004', moduleId: 'module-2', title: 'Module Assessment', type: 'Assessment' as const, required: true },
]

export const trainingCompletion = {
  totalEnrolled: 386,
  completed: 245,
  inProgress: 117,
  notStarted: 24,
  completionRate: 78,
  programs: [
    { program: 'Java Fundamentals', department: 'Engineering', enrolled: 80, completed: 62, inProgress: 12, completionRate: 78 },
    { program: 'Python Programming', department: 'Engineering', enrolled: 70, completed: 50, inProgress: 14, completionRate: 71 },
    { program: 'AWS Cloud Basics', department: 'IT', enrolled: 65, completed: 42, inProgress: 15, completionRate: 65 },
    { program: 'Leadership Skills', department: 'Human Resources', enrolled: 54, completed: 38, inProgress: 11, completionRate: 70 },
  ],
}

export const settingsConfiguration: SettingsResponse = {
  sections: {
    general: { title: 'General Settings', description: 'Configure organization information and common platform preferences.', fields: [
      { id: 'organizationName', label: 'Organization Name', type: 'text' as const, value: 'ABC Organization' },
      { id: 'organizationCode', label: 'Organization Code', type: 'text' as const, value: 'ABC-code' },
      { id: 'website', label: 'Organization Website', type: 'text' as const, value: 'www.company.com' },
      { id: 'contactEmail', label: 'Contact Email', type: 'text' as const, value: 'hr@company.com' },
      { id: 'contactPhone', label: 'Contact Phone', type: 'text' as const, value: '+91 1234567890' },
      { id: 'timezone', label: 'Time Zone', type: 'select' as const, value: 'Asia/Kolkata', options: ['Asia/Kolkata', 'UTC', 'America/New_York'] },
    ] },
    security: { title: 'Security Settings', description: 'Configure password policy, login protection, session timeout, and account security.', fields: [
      { id: 'minimumLength', label: 'Minimum Password Length', type: 'number' as const, value: 8, description: 'Allowed range: 5-15 characters.' },
      { id: 'maxLoginAttempts', label: 'Maximum Login Attempts', type: 'number' as const, value: 5 },
      { id: 'lockoutDuration', label: 'Lockout Duration (minutes)', type: 'number' as const, value: 15 },
      { id: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number' as const, value: 30 },
      { id: 'requireMfa', label: 'Require multi-factor authentication', type: 'toggle' as const, value: true, description: 'Require MFA for organization administrators.' },
      { id: 'requireStrongPassword', label: 'Require strong passwords', type: 'toggle' as const, value: true, description: 'Require upper and lowercase letters, numbers, and symbols.' },
    ] },
    notifications: { title: 'Notification Settings', description: 'Configure event notifications, channels, recipients, and timing.', fields: [
      { id: 'trainingAssigned', label: 'Training Assigned', type: 'toggle' as const, value: true, description: 'Notify employees when a training program is assigned.' },
      { id: 'trainingReminder', label: 'Training Reminder', type: 'toggle' as const, value: true, description: 'Send reminders before a training session.' },
      { id: 'trainingCompleted', label: 'Training Completed', type: 'toggle' as const, value: true, description: 'Notify the employee and HR after completion.' },
      { id: 'examScheduled', label: 'Exam Scheduled', type: 'toggle' as const, value: true, description: 'Notify candidates when an exam is scheduled.' },
      { id: 'emailNotifications', label: 'Email Notifications', type: 'toggle' as const, value: true, description: 'Send event notifications by email.' },
      { id: 'pushNotifications', label: 'Push Notifications', type: 'toggle' as const, value: false, description: 'Send in-app and browser push notifications.' },
    ] },
    training: { title: 'Training Settings', description: 'Define default training duration, approval, enrollment, completion, and expiry rules.', fields: [
      { id: 'defaultMode', label: 'Default Mode', type: 'select' as const, value: 'Online', options: ['Online', 'Classroom', 'Hybrid'] },
      { id: 'defaultDuration', label: 'Default Duration (days)', type: 'number' as const, value: 30 },
      { id: 'enrollmentMode', label: 'Enrollment', type: 'select' as const, value: 'Manual', options: ['Manual', 'Self Enrollment', 'Automatic'] },
      { id: 'trainerApproval', label: 'Require Trainer Approval', type: 'toggle' as const, value: true },
      { id: 'completionCriteria', label: 'Completion Criteria (%)', type: 'number' as const, value: 80 },
      { id: 'certificateExpiry', label: 'Certificate Expiry', type: 'select' as const, value: 'No Expiry', options: ['No Expiry', '1 year', '2 years'] },
    ] },
    examination: { title: 'Examination Settings', description: 'Configure examination schedules, evaluation criteria, grading, and result settings.', fields: [
      { id: 'defaultExamDuration', label: 'Duration (minutes)', type: 'number' as const, value: 60 },
      { id: 'defaultQuestions', label: 'Questions', type: 'number' as const, value: 50 },
      { id: 'passingPercentage', label: 'Passing Percentage', type: 'number' as const, value: 60 },
      { id: 'maxAttempts', label: 'Maximum Attempts', type: 'number' as const, value: 2 },
      { id: 'randomizeQuestions', label: 'Randomize Questions', type: 'toggle' as const, value: true },
      { id: 'allowRetake', label: 'Allow Retakes', type: 'toggle' as const, value: true },
    ] },
    certificates: { title: 'Certificate Configuration', description: 'Configure certificate templates, validity, assessment requirements, and numbering.', fields: [
      { id: 'template', label: 'Certificate Template', type: 'select' as const, value: 'Modern', options: ['Modern', 'Classic', 'Minimal'] },
      { id: 'prefix', label: 'Certificate Prefix', type: 'text' as const, value: 'CERT-' },
      { id: 'validity', label: 'Validity', type: 'select' as const, value: 'No Expiry', options: ['No Expiry', '1 year', '2 years'] },
      { id: 'assessmentRequired', label: 'Assessment Required', type: 'toggle' as const, value: true },
      { id: 'includeHours', label: 'Include Training Hours', type: 'toggle' as const, value: true },
    ] },
  },
  users: [
    { id: 'u-001', name: 'Arun kumar', email: 'arun@company.com', role: 'HR Admin', department: 'HR Admin', status: 'Active' as const },
    { id: 'u-002', name: 'HR Manager', email: 'manager@company.com', role: 'HR Manager', department: 'Human Resources', status: 'Active' as const },
    { id: 'u-003', name: 'Priya S', email: 'priya@company.com', role: 'Trainer', department: 'Engineering', status: 'Active' as const },
    { id: 'u-004', name: 'Vishnu P', email: 'vishnu@company.com', role: 'Employee', department: 'IT', status: 'Inactive' as const },
  ],
}

export const dashboardActivity = [
  { id: 'da-001', title: 'New employee enrolled', detail: 'Arun Kumar · Java Fundamentals', time: '28 Sep, 10:24 AM', type: 'employee' as const },
  { id: 'da-002', title: 'Program published', detail: 'Java Fundamentals', time: '25 Sep, 09:20 AM', type: 'program' as const },
  { id: 'da-003', title: 'Examination scheduled', detail: 'Python Assessment', time: '24 Sep, 03:15 PM', type: 'exam' as const },
]