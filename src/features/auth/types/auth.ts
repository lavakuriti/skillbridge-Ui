export type AuthRole =
  | 'PLATFORM_SUPER_ADMIN'
  | 'ORGANIZATION_ADMIN'
  | 'HR_ADMIN'
  | 'HR_EXECUTIVE'
  | 'DEPARTMENT_MANAGER'
  | 'EMPLOYEE'

export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'DISABLED'

export type OrganizationRegistrationStatus =
  | 'submitted'
  | 'pending_approval'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'additional_information_required'

export interface AppUser {
  id: string
  displayName: string
  email: string
  roles: AuthRole[]
  organizationId?: string | null
  organizationName?: string | null
  status: UserStatus
  isEmailVerified?: boolean
}

export interface AuthSession {
  token: string
  user: AppUser
}

export interface SignInPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyEmailPayload {
  token: string
  email?: string
}

export interface AccountActivationPayload {
  token: string
  password: string
  confirmPassword: string
}

export interface RegistrationResult {
  id?: string
  reference?: string
  organizationName?: string
  status: OrganizationRegistrationStatus
  submittedAt?: string
}

export interface OrganizationRegistrationPayload {
  name: string
  legalName: string
  code: string
  industry: string
  website?: string
  companySize: string
  description?: string
  officialEmail: string
  contactNumber: string
  contactPerson: string
  designation: string
  addressLine: string
  city: string
  state: string
  country: string
  postalCode: string
  initialAdminName: string
  initialAdminEmail: string
  initialAdminDesignation: string
  status?: string
  subscriptionPlan?: string
}
