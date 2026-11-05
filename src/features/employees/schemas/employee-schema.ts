import { z } from 'zod'

export const employeeSchema = z.object({
  name: z.string().trim().min(2, 'Enter the employee name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  department: z.string().min(1, 'Choose a department.'),
  role: z.string().min(1, 'Choose a role.'),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>