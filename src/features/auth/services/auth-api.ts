import { API_ENDPOINTS } from '../../../services/api/api-endpoints'
import { apiClient } from '../../../services/api/axios-instance'
import type { AccountActivationPayload, AppUser, AuthSession, ForgotPasswordPayload, OrganizationRegistrationPayload, ResetPasswordPayload, SignInPayload, VerifyEmailPayload } from '../types/auth'

const ACCESS_TOKEN_KEY = 'access-token'
const AUTH_USER_KEY = 'auth-user'

export function readStoredAuthToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? localStorage.getItem(ACCESS_TOKEN_KEY) ?? null
}

export function readStoredUser() {
  try {
    const rawValue = sessionStorage.getItem(AUTH_USER_KEY) ?? localStorage.getItem(AUTH_USER_KEY)
    return rawValue ? (JSON.parse(rawValue) as AppUser) : null
  } catch {
    return null
  }
}

export function persistAuthSession(session: AuthSession, rememberMe: boolean) {
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(ACCESS_TOKEN_KEY, session.token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(session.user))
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}

export function getDefaultDashboardPath(user: Pick<AppUser, 'roles'>) {
  return user.roles.includes('PLATFORM_SUPER_ADMIN') ? '/platform' : '/'
}

export const authApi = {
  async signIn(payload: SignInPayload): Promise<AuthSession> {
    const response = await apiClient.post<{ data: { user: AppUser; token: string } }>(API_ENDPOINTS.authLogin, payload)
    const session = { token: response.data.data.token, user: response.data.data.user }
    persistAuthSession(session, Boolean(payload.rememberMe))
    return session
  },

  async currentUser(): Promise<AppUser> {
    const response = await apiClient.get<{ data: AppUser }>(API_ENDPOINTS.authCurrentUser)
    return response.data.data
  },

  async signOut(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.authLogout)
    } finally {
      clearAuthSession()
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ data: { success: boolean } }>(API_ENDPOINTS.authForgotPassword, payload)
    return response.data.data
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ data: { success: boolean } }>(API_ENDPOINTS.authResetPassword, payload)
    return response.data.data
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ data: { success: boolean } }>(API_ENDPOINTS.authVerifyEmail, payload)
    return response.data.data
  },

  async resendVerificationEmail(email: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ data: { success: boolean } }>(API_ENDPOINTS.authResendVerification, { email })
    return response.data.data
  },

  async activateAccount(payload: AccountActivationPayload): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ data: { success: boolean } }>(API_ENDPOINTS.authActivate, payload)
    return response.data.data
  },

  async registerOrganization(payload: OrganizationRegistrationPayload): Promise<{ status: string; organizationName: string; reference?: string }> {
    const response = await apiClient.post<{ data: { status: string; organizationName: string; reference?: string } }>(API_ENDPOINTS.authRegisterOrganization, payload)
    return response.data.data
  },
}
