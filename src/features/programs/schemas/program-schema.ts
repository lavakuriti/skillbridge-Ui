import { z } from 'zod'

export const programSchema = z.object({
  name: z.string().trim().min(2, 'Enter a program name.'),
  code: z.string().trim().min(4, 'Enter a program code.'),
  category: z.string().min(1, 'Choose a category.'),
  department: z.string().min(1, 'Choose a department.'),
  trainer: z.string().trim().min(2, 'Enter a trainer name.'),
  startDate: z.string().min(1, 'Choose a start date.'),
  description: z.string().optional(),
  skillLevel: z.string().optional(),
  duration: z.number().optional(),
  mode: z.string().optional(),
  prerequisites: z.string().optional(),
})

export type ProgramFormValues = z.infer<typeof programSchema>