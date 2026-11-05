export type SettingValue = string | number | boolean

export interface SettingField {
  id: string
  label: string
  type: 'text' | 'number' | 'select' | 'toggle'
  value: SettingValue
  options?: string[]
  description?: string
}

export interface SettingsSection {
  title: string
  description: string
  fields: SettingField[]
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'Active' | 'Inactive'
}

export interface SettingsResponse {
  sections: Record<string, SettingsSection>
  users: AdminUser[]
}