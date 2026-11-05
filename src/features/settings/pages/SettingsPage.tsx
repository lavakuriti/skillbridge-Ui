import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check, LockKeyhole, Mail, Settings2, ShieldCheck, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { DataTable, type DataColumn } from '../../../components/shared/DataTable'
import { useSaveAdminUser, useSaveSettings, useSettings } from '../hooks/use-settings'
import { adminUserSchema, type AdminUserFormValues } from '../schemas/admin-user-schema'
import type { AdminUser, SettingField, SettingValue } from '../types/settings'

type SettingsTab = 'general' | 'users' | 'security' | 'notifications' | 'training' | 'examination' | 'certificates'

const tabs: { id: SettingsTab; label: string; icon: typeof Users }[] = [
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'security', label: 'Security', icon: LockKeyhole },
    { id: 'notifications', label: 'Notifications', icon: Mail },
    { id: 'training', label: 'Training', icon: Settings2 },
    { id: 'examination', label: 'Examination', icon: ShieldCheck },
    { id: 'certificates', label: 'Certificates', icon: Check },
]

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general')
    const [values, setValues] = useState<Record<string, SettingValue>>({})
    const [userDialogOpen, setUserDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
    const settings = useSettings()
    const saveSettings = useSaveSettings()
    const saveUser = useSaveAdminUser()
    const userForm = useForm<AdminUserFormValues>({
        resolver: zodResolver(adminUserSchema),
        defaultValues: { name: '', email: '', role: 'Employee', department: 'Engineering' },
    })
    const section = settings.data?.sections[activeTab]
    const userColumns: DataColumn<AdminUser>[] = [
        { id: 'name', header: 'Name', accessor: (user) => user.name, cell: (user) => <span className="cell-title">{user.name}<small>{user.email}</small></span> },
        { id: 'role', header: 'Role', accessor: (user) => user.role },
        { id: 'department', header: 'Department', accessor: (user) => user.department },
        { id: 'status', header: 'Status', accessor: (user) => user.status, cell: (user) => <StatusBadge>{user.status}</StatusBadge> },
        { id: 'actions', header: 'Actions', accessor: (user) => user.name, sortable: false, cell: (user) => <button className="row-link-button" onClick={() => openUser(user)}>Edit role</button> },
    ]

    function openUser(user: AdminUser | null = null) {
        setEditingUser(user)
        userForm.reset(user ? { name: user.name, email: user.email, role: user.role, department: user.department } : { name: '', email: '', role: 'Employee', department: 'Engineering' })
        setUserDialogOpen(true)
    }

    async function submitUser(values: AdminUserFormValues) {
        try {
            await saveUser.mutateAsync({ id: editingUser?.id, input: values })
            toast.success(editingUser ? 'User role updated.' : 'User added.')
            setUserDialogOpen(false)
        } catch {
            toast.error('User details could not be saved.')
        }
    }

    function updateValue(id: string, value: SettingValue) {
        setValues((current) => ({ ...current, [id]: value }))
    }

    async function save() {
        if (!section) return
        const sectionValues = Object.fromEntries(section.fields.map((field) => [field.id, values[field.id] ?? field.value]))
        try {
            await saveSettings.mutateAsync({ section: activeTab, values: sectionValues })
            toast.success(`${section.title} saved.`)
        } catch {
            toast.error('Settings could not be saved.')
        }
    }

    return (
        <div className="page-content">
            <PageHeading eyebrow="Administration" title={activeTab === 'users' ? 'Users & Roles' : `${tabs.find((tab) => tab.id === activeTab)?.label} Settings`} description={section?.description ?? 'Configure platform-level HR administration, access, security, notifications, examinations, and certification.'} />
            <div className="settings-layout">
                <nav className="settings-nav" aria-label="Settings sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={activeTab === id ? 'settings-nav-link active' : 'settings-nav-link'} onClick={() => setActiveTab(id)}><Icon size={15} />{label}</button>)}</nav>
                <div className="settings-content">
                    {settings.isLoading ? <Panel><div className="table-state">Loading settings...</div></Panel> : settings.isError ? <Panel><div className="table-state" role="alert">Settings could not be loaded. <Button variant="outline" onClick={() => void settings.refetch()}>Retry</Button></div></Panel> : activeTab === 'users' ? (
                        <Panel className="programs-panel"><div className="settings-panel-heading"><div><h2>Users & Roles</h2><p>Manage users, roles, permissions, status, and access.</p></div><Button onClick={() => openUser()}><Users size={14} /> Add User</Button></div><DataTable columns={userColumns} data={settings.data?.users ?? []} pageSize={6} /></Panel>
                    ) : section && (
                        <Panel className="settings-form-panel"><div className="settings-panel-heading"><div><h2>{section.title}</h2><p>{section.description}</p></div></div><form onSubmit={(event) => { event.preventDefault(); void save() }}><div className="settings-fields">{section.fields.map((field) => <SettingControl key={field.id} field={field} value={values[field.id] ?? field.value} onChange={(value) => updateValue(field.id, value)} />)}</div><footer className="settings-save"><span>Changes are saved to the organization configuration.</span><Button type="submit" disabled={saveSettings.isPending}>{saveSettings.isPending ? 'Saving...' : 'Save Configuration'}</Button></footer></form></Panel>
                    )}
                </div>
            </div>
            {userDialogOpen && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setUserDialogOpen(false) }}><section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="user-dialog-title"><header className="dialog-heading"><div><span className="eyebrow">Organization access</span><h2 id="user-dialog-title">{editingUser ? 'Edit User & Role' : 'Add User'}</h2></div><button className="dialog-close" onClick={() => setUserDialogOpen(false)} aria-label="Close dialog">×</button></header><form onSubmit={userForm.handleSubmit(submitUser)} noValidate><div className="form-grid"><Field label="Name" error={userForm.formState.errors.name?.message}><input {...userForm.register('name')} placeholder="Enter name" /></Field><Field label="Email" error={userForm.formState.errors.email?.message}><input type="email" {...userForm.register('email')} placeholder="name@company.com" /></Field><Field label="Role" error={userForm.formState.errors.role?.message}><select {...userForm.register('role')}><option>HR Admin</option><option>HR Manager</option><option>Trainer</option><option>Employee</option></select></Field><Field label="Department" error={userForm.formState.errors.department?.message}><select {...userForm.register('department')}><option>Human Resources</option><option>Engineering</option><option>IT</option><option>Finance</option></select></Field></div><footer className="dialog-actions"><Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saveUser.isPending}>{saveUser.isPending ? 'Saving...' : 'Save User'}</Button></footer></form></section></div>}
        </div>
    )
}

function SettingControl({ field, value, onChange }: { field: SettingField; value: SettingValue; onChange: (value: SettingValue) => void }) {
    if (field.type === 'toggle') return <label className="setting-toggle"><span><strong>{field.label}</strong>{field.description && <small>{field.description}</small>}</span><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>
    return <label className="setting-field"><span>{field.label}</span>{field.type === 'select' ? <select value={String(value)} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input type={field.type} value={String(value)} onChange={(event) => onChange(field.type === 'number' ? Number(event.target.value) : event.target.value)} />}{field.description && <small>{field.description}</small>}</label>
}

function Field({ children, label, error }: { children: React.ReactNode; label: string; error?: string }) {
    return <label className="form-field"><span>{label}<i aria-hidden="true">*</i></span>{children}{error && <small className="field-error">{error}</small>}</label>
}