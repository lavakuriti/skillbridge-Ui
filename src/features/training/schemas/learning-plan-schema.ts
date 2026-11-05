import { z } from 'zod'

export const learningPlanSchema = z.object({
  name: z.string().trim().min(2, 'Enter a learning plan name.'),
  description: z.string().trim().min(5, 'Enter a short description.'),
})

export type LearningPlanFormValues = z.infer<typeof learningPlanSchema>