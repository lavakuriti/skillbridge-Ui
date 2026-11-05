import { z } from 'zod'

export const examSchema = z.object({
  name: z.string().trim().min(2, 'Enter an examination name.'),
  program: z.string().min(1, 'Choose a training program.'),
  date: z.string().min(1, 'Choose an examination date.'),
  duration: z.number().int().min(1, 'Duration must be at least one minute.'),
  questions: z.number().int().min(1, 'Enter at least one question.'),
  passingScore: z.number().min(1).max(100, 'Passing score must be 100% or less.'),
  attempts: z.number().int().min(1, 'Allow at least one attempt.'),
})

export type ExamFormValues = z.infer<typeof examSchema>