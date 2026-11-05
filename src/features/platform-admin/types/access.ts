export const PLATFORM_SUPER_ADMIN_ROLE = 'PLATFORM_SUPER_ADMIN' as const

export interface PlatformUser {
  id: string
  displayName: string
  email: string
  roles: string[]
}