import { z } from 'zod'

export const programWizardSchema = z.object({
  name: z.string().trim().min(2, 'Enter a program name.'),
  code: z.string().trim().min(4, 'Enter a program code.'),
  category: z.string().min(1, 'Choose a category.'),
  department: z.string().min(1, 'Choose a department.'),
  description: z.string().trim().min(10, 'Enter at least 10 characters.'),
  skillLevel: z.string().min(1, 'Choose a skill level.'),
  duration: z.number().int().min(1, 'Duration must be at least one day.'),
  trainer: z.string().trim().min(2, 'Choose a trainer.'),
  mode: z.string().min(1, 'Choose a training mode.'),
  startDate: z.string().min(1, 'Choose a start date.'),
  prerequisites: z.string(),
})

export type ProgramWizardValues = z.infer<typeof programWizardSchema>