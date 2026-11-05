import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Plus, Search, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { DataTable, type DataColumn } from '../../../components/shared/DataTable'
import { useCreateEmployee, useEmployees } from '../hooks/use-employees'
import { employeeSchema, type EmployeeFormValues } from '../schemas/employee-schema'
import type { Employee } from '../types/employee'
import { Link } from 'react-router-dom'

export function EmployeesPage() {
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useState(() => searchParams.get('search') ?? '')
    const [dialogOpen, setDialogOpen] = useState(false)
    const employees = useEmployees(search || undefined)
    const createEmployee = useCreateEmployee()
    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: { name: '', email: '', department: 'Engineering', role: 'Employee' },
    })
    const columns: DataColumn<Employee>[] = [
        { id: 'employee', header: 'Employee', accessor: (employee) => employee.name, cell: (employee) => <Link className="employee-link" to={`/employees/${employee.id}`}><span className="avatar employee-avatar">{employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="cell-title">{employee.name}<small>{employee.email}</small></span></Link> },
        { id: 'id', header: 'Employee ID', accessor: (employee) => employee.id },
        { id: 'department', header: 'Department', accessor: (employee) => employee.department },
        { id: 'programs', header: 'Programs', accessor: (employee) => employee.programs },
        { id: 'completion', header: 'Completion', accessor: (employee) => employee.completion, cell: (employee) => <span className="progress-cell"><span className="progress-track"><span style={{ width: `${employee.completion}%` }} /></span><small>{employee.completion}%</small></span> },
        { id: 'status', header: 'Status', accessor: (employee) => employee.status, cell: (employee) => <StatusBadge>{employee.status}</StatusBadge> },
    ]

    async function submit(values: EmployeeFormValues) {
        try {
            await createEmployee.mutateAsync(values)
            toast.success('Employee added.')
            setDialogOpen(false)
            form.reset()
        } catch {
            toast.error('The employee could not be added.')
        }
    }

    return (
        <div className="page-content">
            <PageHeading eyebrow="Back to Dashboard" title="Employees" description="View all employees, search, filter, and access individual profiles." action={<Button onClick={() => setDialogOpen(true)}><Plus size={15} /> Add Employee</Button>} />
            <div className="employee-summary"><span className="stat-icon stat-icon-blue"><Users size={18} /></span><span><strong>{employees.data?.total ?? 0}</strong><small>Active employees</small></span><span className="employee-summary-meta">Across all departments</span></div>
            <Panel className="programs-panel">
                <div className="program-toolbar"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee name, ID, or email..." aria-label="Search employees" /></label></div>
                {employees.isLoading ? <div className="table-state">Loading employees...</div> : employees.isError ? <div className="table-state" role="alert">Employees could not be loaded. <Button variant="outline" onClick={() => void employees.refetch()}>Retry</Button></div> : <DataTable columns={columns} data={employees.data?.data ?? []} pageSize={5} emptyMessage="No employees match this search." />}
            </Panel>
            {dialogOpen && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false) }}><section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="employee-dialog-title"><header className="dialog-heading"><div><span className="eyebrow">Employee details</span><h2 id="employee-dialog-title">Add Employee</h2></div><button className="dialog-close" onClick={() => setDialogOpen(false)} aria-label="Close dialog">×</button></header><form onSubmit={form.handleSubmit(submit)} noValidate><div className="form-grid"><Field label="Full Name" error={form.formState.errors.name?.message}><input {...form.register('name')} placeholder="Enter employee name" /></Field><Field label="Email" error={form.formState.errors.email?.message}><input type="email" {...form.register('email')} placeholder="name@company.com" /></Field><Field label="Department" error={form.formState.errors.department?.message}><select {...form.register('department')}><option>Engineering</option><option>IT</option><option>Human Resources</option><option>Finance</option></select></Field><Field label="Role" error={form.formState.errors.role?.message}><select {...form.register('role')}><option>Employee</option><option>Trainer</option><option>HR Manager</option><option>HR Admin</option></select></Field></div><footer className="dialog-actions"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={createEmployee.isPending}>{createEmployee.isPending ? 'Saving...' : 'Add Employee'}</Button></footer></form></section></div>}
        </div>
    )
}

function Field({ children, label, error }: { children: React.ReactNode; label: string; error?: string }) {
    return <label className="form-field"><span>{label}<i aria-hidden="true">*</i></span>{children}{error && <small className="field-error">{error}</small>}</label>
}