import { z } from 'zod'

export const programContentSchema = z.object({
  title: z.string().trim().min(2, 'Enter a title.'),
  type: z.enum(['Module', 'Video', 'Document', 'Link', 'Assessment']),
  moduleId: z.string().optional(),
})

export type ProgramContentValues = z.infer<typeof programContentSchema>