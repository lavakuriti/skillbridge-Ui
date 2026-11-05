import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Use at least 8 characters for your password.'),
  confirmPassword: z.string().min(8, 'Please confirm the new password.'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})

export const activateAccountSchema = z.object({
  password: z.string().min(8, 'Use at least 8 characters for your password.'),
  confirmPassword: z.string().min(8, 'Please confirm the new password.'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})

export const organizationRegistrationSchema = z.object({
  name: z.string().trim().min(2, 'Enter the organization name.'),
  legalName: z.string().trim().min(2, 'Enter the legal business name.'),
  code: z.string().trim().min(3, 'Enter an organization code.'),
  industry: z.string().trim().min(2, 'Select an industry.'),
  website: z.string().trim().url('Enter a valid website URL.').or(z.literal('')),
  companySize: z.string().trim().min(1, 'Select the company size.'),
  description: z.string().trim().max(500, 'Description must be 500 characters or fewer.').optional().or(z.literal('')),
  officialEmail: z.string().trim().email('Enter a valid business email.'),
  contactNumber: z.string().trim().min(7, 'Enter a valid contact number.'),
  contactPerson: z.string().trim().min(2, 'Enter a primary contact name.'),
  designation: z.string().trim().min(2, 'Enter a designation.'),
  addressLine: z.string().trim().min(2, 'Enter a registered address.'),
  city: z.string().trim().min(2, 'Enter a city.'),
  state: z.string().trim().min(2, 'Enter a state or province.'),
  country: z.string().trim().min(2, 'Enter a country.'),
  postalCode: z.string().trim().min(3, 'Enter a postal code.'),
  initialAdminName: z.string().trim().min(2, 'Enter the initial administrator name.'),
  initialAdminEmail: z.string().trim().email('Enter a valid administrator email.'),
  initialAdminDesignation: z.string().trim().min(2, 'Enter the administrator designation.'),
  status: z.string().optional(),
  subscriptionPlan: z.string().optional(),
})

export type LoginValues = z.infer<typeof loginSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
export type ActivateAccountValues = z.infer<typeof activateAccountSchema>
export type OrganizationRegistrationValues = z.infer<typeof organizationRegistrationSchema>
