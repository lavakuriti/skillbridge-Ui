import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowUpRight, BookOpenCheck, CalendarDays, Check, CircleAlert, ClipboardCheck, Plus, Search, Users, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { DataTable, type DataColumn } from '../../../components/shared/DataTable'
import { useCreateLearningPlan, useTrainingWorkspace, useUpdateTrainingItem } from '../hooks/use-training-workspace'
import { learningPlanSchema, type LearningPlanFormValues } from '../schemas/learning-plan-schema'
import type { LearningPlan, PendingAssignment, SkillGap, TrainingActivity } from '../types/training'

type WorkspaceTab = 'assignments' | 'today' | 'gaps' | 'plans'

const tabs: { id: WorkspaceTab; label: string; icon: typeof Users }[] = [
    { id: 'assignments', label: 'Pending Assignments', icon: ClipboardCheck },
    { id: 'today', label: 'Training Today', icon: BookOpenCheck },
    { id: 'gaps', label: 'Skill Gap Alerts', icon: CircleAlert },
    { id: 'plans', label: 'Learning Plans', icon: Users },
]

export function TrainingPage() {
    const [activeTab, setActiveTab] = useState<WorkspaceTab>('assignments')
    const [search, setSearch] = useState('')
    const [department, setDepartment] = useState('')
    const [planDialog, setPlanDialog] = useState(false)
    const workspace = useTrainingWorkspace()
    const updateItem = useUpdateTrainingItem()
    const createPlan = useCreateLearningPlan()
    const form = useForm<LearningPlanFormValues>({
        resolver: zodResolver(learningPlanSchema),
        defaultValues: { name: '', description: '' },
    })

    const data = workspace.data
    const assignments = (data?.assignments ?? []).filter((item) => item.status === 'Pending' && (!department || item.department === department) && matches(`${item.employee} ${item.program} ${item.employeeId}`, search))
    const activities = (data?.activities ?? []).filter((item) => matches(`${item.employee} ${item.program} ${item.employeeId}`, search))
    const gaps = (data?.skillGaps ?? []).filter((item) => item.status === 'Open' && (!department || item.department === department) && matches(`${item.employee} ${item.skill} ${item.employeeId}`, search))
    const plans = (data?.learningPlans ?? []).filter((item) => matches(`${item.name} ${item.description}`, search))

    const assignmentColumns: DataColumn<PendingAssignment>[] = [
        { id: 'employee', header: 'Employee', accessor: (row) => row.employee, cell: (row) => <span className="cell-title">{row.employee}<small>{row.employeeId} · {row.department}</small></span> },
        { id: 'program', header: 'Program', accessor: (row) => row.program },
        { id: 'type', header: 'Assignment Type', accessor: (row) => row.assignmentType },
        { id: 'pending', header: 'Pending Since', accessor: (row) => row.pendingSince },
        { id: 'actions', header: 'Actions', accessor: (row) => row.employee, sortable: false, cell: (row) => <span className="row-actions"><button title="Approve and assign" aria-label={`Approve ${row.employee}`} onClick={() => void update('assignment', row.id, 'Approved', 'Assignment approved and assigned.')}><Check size={14} /></button><button title="Reject request" aria-label={`Reject ${row.employee}`} onClick={() => void update('assignment', row.id, 'Rejected', 'Assignment request rejected.')}><X size={14} /></button></span> },
    ]
    const activityColumns: DataColumn<TrainingActivity>[] = [
        { id: 'employee', header: 'Employee', accessor: (row) => row.employee, cell: (row) => <span className="cell-title">{row.employee}<small>{row.employeeId}</small></span> },
        { id: 'program', header: 'Program', accessor: (row) => row.program },
        { id: 'category', header: 'Category', accessor: (row) => row.category },
        { id: 'type', header: 'Training Type', accessor: (row) => row.type },
        { id: 'session', header: 'Session', accessor: (row) => row.session },
        { id: 'status', header: 'Status', accessor: (row) => row.status, cell: (row) => <StatusBadge>{row.status}</StatusBadge> },
        { id: 'actions', header: 'Actions', accessor: (row) => row.employee, sortable: false, cell: (row) => row.status === 'Present' ? <StatusBadge>Present</StatusBadge> : <Button className="table-action-button" onClick={() => void update('activity', row.id, 'Present', 'Attendance marked present.')}>Mark Attendance</Button> },
    ]
    const gapColumns: DataColumn<SkillGap>[] = [
        { id: 'employee', header: 'Employee', accessor: (row) => row.employee, cell: (row) => <span className="cell-title">{row.employee}<small>{row.employeeId} · {row.department}</small></span> },
        { id: 'skill', header: 'Skill', accessor: (row) => row.skill, cell: (row) => <span className="cell-title">{row.skill}<small>{row.currentLevel} → {row.requestedLevel}</small></span> },
        { id: 'severity', header: 'Severity', accessor: (row) => row.severity, cell: (row) => <span className={`severity severity-${row.severity.toLowerCase()}`}>{row.severity}</span> },
        { id: 'detected', header: 'Detected On', accessor: (row) => row.detectedOn },
        { id: 'recommendation', header: 'Recommended Training', accessor: (row) => row.recommendation },
        { id: 'actions', header: 'Actions', accessor: (row) => row.employee, sortable: false, cell: (row) => <Button className="table-action-button" variant="outline" onClick={() => void update('skill-gap', row.id, 'Reviewed', 'Skill gap marked reviewed.')}>Mark Reviewed</Button> },
    ]
    const planColumns: DataColumn<LearningPlan>[] = [
        { id: 'name', header: 'Learning Plan', accessor: (row) => row.name, cell: (row) => <span className="cell-title">{row.name}<small>{row.description}</small></span> },
        { id: 'programs', header: 'Programs', accessor: (row) => row.programs },
        { id: 'employees', header: 'Employees', accessor: (row) => row.employees },
        { id: 'status', header: 'Status', accessor: (row) => row.status, cell: (row) => <StatusBadge>{row.status}</StatusBadge> },
        { id: 'actions', header: 'Actions', accessor: (row) => row.name, sortable: false, cell: () => <button className="row-link-button">View plan <ArrowUpRight size={13} /></button> },
    ]

    async function update(kind: string, id: string, status: string, message: string) {
        try {
            await updateItem.mutateAsync({ kind, id, status })
            toast.success(message)
        } catch {
            toast.error('The training record could not be updated.')
        }
    }

    async function submitPlan(values: LearningPlanFormValues) {
        try {
            await createPlan.mutateAsync(values)
            toast.success('Learning plan saved as draft.')
            setPlanDialog(false)
            form.reset()
        } catch {
            toast.error('The learning plan could not be saved.')
        }
    }

    const currentRows = activeTab === 'assignments' ? assignments.length : activeTab === 'today' ? activities.length : activeTab === 'gaps' ? gaps.length : plans.length

    return <div className="page-content"><PageHeading eyebrow="Back to Dashboard" title="Training" description="Review assignments, daily training activity, and employee skill development." action={activeTab === 'plans' ? <Button onClick={() => setPlanDialog(true)}><Plus size={15} /> Create Learning Plan</Button> : undefined} />
        <div className="training-workspace-tabs" role="tablist" aria-label="Training workspace">{tabs.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'workspace-tab active' : 'workspace-tab'} onClick={() => { setActiveTab(id); setSearch(''); setDepartment('') }}><Icon size={15} />{label}{id === 'assignments' && data && <span>{data.assignments.length}</span>}</button>)}</div>
        <Panel className="programs-panel"><div className="program-toolbar"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee or program..." aria-label="Search training records" /></label>{activeTab !== 'today' && activeTab !== 'plans' && <label className="filter-select"><span className="sr-only">Filter department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="">All departments</option><option>IT</option><option>Engineering</option><option>Human Resources</option><option>Finance</option></select></label>}{activeTab === 'today' && <Button variant="outline"><CalendarDays size={14} /> 28-Sep-2026</Button>}</div>
            {workspace.isLoading ? <div className="table-state">Loading training activity...</div> : workspace.isError ? <div className="table-state" role="alert">Training data could not be loaded. <Button variant="outline" onClick={() => void workspace.refetch()}>Retry</Button></div> : <div className="table-inset">{activeTab === 'assignments' ? <DataTable columns={assignmentColumns} data={assignments} pageSize={5} emptyMessage="No assignments are waiting for review." /> : activeTab === 'today' ? <DataTable columns={activityColumns} data={activities} pageSize={5} emptyMessage="No training sessions are scheduled today." /> : activeTab === 'gaps' ? <DataTable columns={gapColumns} data={gaps} pageSize={5} emptyMessage="No skill gaps match these filters." /> : <DataTable columns={planColumns} data={plans} pageSize={5} emptyMessage="Create a learning plan to get started." />}</div>}
        </Panel>
        <p className="workspace-count">{currentRows} records · Updates are saved automatically</p>
        {planDialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPlanDialog(false) }}><section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="plan-dialog-title"><header className="dialog-heading"><div><span className="eyebrow">Learning plan</span><h2 id="plan-dialog-title">Create Learning Plan</h2></div><button className="dialog-close" onClick={() => setPlanDialog(false)} aria-label="Close dialog">×</button></header><form onSubmit={form.handleSubmit(submitPlan)} noValidate><div className="form-grid single-column"><Field label="Plan Name" error={form.formState.errors.name?.message}><input {...form.register('name')} placeholder="Enter learning plan name" /></Field><Field label="Description" error={form.formState.errors.description?.message}><textarea rows={3} {...form.register('description')} placeholder="Describe the learning objectives..." /></Field></div><footer className="dialog-actions"><Button type="button" variant="outline" onClick={() => setPlanDialog(false)}>Cancel</Button><Button type="submit" disabled={createPlan.isPending}>{createPlan.isPending ? 'Saving...' : 'Save Draft'}</Button></footer></form></section></div>}
    </div>
}

function matches(value: string, search: string) {
    return value.toLowerCase().includes(search.trim().toLowerCase())
}

function Field({ children, label, error }: { children: React.ReactNode; label: string; error?: string }) {
    return <label className="form-field"><span>{label}<i aria-hidden="true">*</i></span>{children}{error && <small className="field-error">{error}</small>}</label>
}