import { z } from 'zod'

export const adminUserSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  role: z.string().min(1, 'Choose a role.'),
  department: z.string().min(1, 'Choose a department.'),
})

export type AdminUserFormValues = z.infer<typeof adminUserSchema>