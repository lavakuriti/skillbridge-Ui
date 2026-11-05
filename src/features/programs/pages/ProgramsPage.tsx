import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { BookOpenCheck, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { DataTable, type DataColumn } from '../../../components/shared/DataTable'
import { useCreateProgram, useDeleteProgram, usePrograms, useUpdateProgram } from '../hooks/use-programs'
import { programSchema, type ProgramFormValues } from '../schemas/program-schema'
import type { Program } from '../types/program'

export function ProgramsPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useState(() => searchParams.get('search') ?? '')
    const [status, setStatus] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Program | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Program | null>(null)
    const filters = { search: search || undefined, status: status || undefined }
    const programs = usePrograms(filters)
    const createProgram = useCreateProgram()
    const updateProgram = useUpdateProgram()
    const deleteProgram = useDeleteProgram()
    const form = useForm<ProgramFormValues>({
        resolver: zodResolver(programSchema),
        defaultValues: { name: '', code: '', category: 'Technical', department: 'Engineering', trainer: '', startDate: '2026-10-01' },
    })

    const rows = programs.data?.data ?? []
    const columns: DataColumn<Program>[] = [
        { id: 'name', header: 'Program Name', accessor: (program) => program.name, cell: (program) => <Link className="program-name-link" to={`/programs/${program.id}`}><span className="cell-title">{program.name}<small>{program.department}</small></span></Link> },
        { id: 'code', header: 'Code', accessor: (program) => program.code },
        { id: 'category', header: 'Category', accessor: (program) => program.category, cell: (program) => <span className="category-tag">{program.category}</span> },
        { id: 'trainer', header: 'Trainer', accessor: (program) => program.trainer },
        { id: 'enrolled', header: 'Enrolled', accessor: (program) => program.enrolled },
        { id: 'completion', header: 'Progress', accessor: (program) => program.completion, cell: (program) => <span className="progress-cell"><span className="progress-track"><span style={{ width: `${program.completion}%` }} /></span><small>{program.completion}%</small></span> },
        { id: 'status', header: 'Status', accessor: (program) => program.status, cell: (program) => <StatusBadge>{program.status}</StatusBadge> },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (program) => program.name,
            sortable: false,
            cell: (program) => (
                <span className="row-actions">
                    <button aria-label={`Edit ${program.name}`} title="Edit program" onClick={() => openEdit(program)}><Pencil size={14} /></button>
                    <button aria-label={`Delete ${program.name}`} title="Delete program" onClick={() => setDeleteTarget(program)}><Trash2 size={14} /></button>
                </span>
            ),
        },
    ]

    function openEdit(program: Program) {
        setEditing(program)
        form.reset({ name: program.name, code: program.code, category: program.category, department: program.department, trainer: program.trainer, startDate: '2026-10-01' })
        setDialogOpen(true)
    }

    async function submit(values: ProgramFormValues) {
        try {
            if (editing) {
                await updateProgram.mutateAsync({ id: editing.id, input: values })
                toast.success('Program updated.')
            } else {
                await createProgram.mutateAsync(values)
                toast.success('Program saved as draft.')
            }
            setDialogOpen(false)
        } catch {
            toast.error('The program could not be saved.')
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return
        try {
            await deleteProgram.mutateAsync(deleteTarget.id)
            toast.success(`${deleteTarget.name} was removed.`)
            setDeleteTarget(null)
        } catch {
            toast.error('The program could not be removed.')
        }
    }

    return (
        <div className="page-content">
            <PageHeading
                eyebrow="Back to Dashboard"
                title="Training Programs"
                description="Create, manage, approve, publish, assign, and track training programs."
                action={<Button onClick={() => navigate('/programs/create')}><Plus size={15} /> Create Training Program</Button>}
            />
            <Panel className="programs-panel">
                <div className="program-toolbar">
                    <label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search program name or code..." aria-label="Search programs" /></label>
                    <label className="filter-select"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option>Active</option><option>Draft</option></select></label>
                </div>
                {programs.isLoading ? <div className="table-state">Loading programs...</div> : programs.isError ? <div className="table-state" role="alert">Programs could not be loaded. <Button variant="outline" onClick={() => void programs.refetch()}>Retry</Button></div> : (
                    <DataTable columns={columns} data={rows} pageSize={5} emptyMessage="No programs match these filters." />
                )}
            </Panel>
            <div className="program-note"><BookOpenCheck size={15} /> Changes to published programs may require review before employees are notified.</div>

            {dialogOpen && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false) }}>
                <section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="program-dialog-title">
                    <header className="dialog-heading"><div><span className="eyebrow">Program details</span><h2 id="program-dialog-title">{editing ? 'Edit Training Program' : 'Create Training Program'}</h2></div><button className="dialog-close" onClick={() => setDialogOpen(false)} aria-label="Close dialog">×</button></header>
                    <form onSubmit={form.handleSubmit(submit)} noValidate>
                        <div className="form-grid">
                            <FormField label="Program Name" error={form.formState.errors.name?.message}><input {...form.register('name')} placeholder="e.g. Java Fundamentals" /></FormField>
                            <FormField label="Program Code" error={form.formState.errors.code?.message}><input {...form.register('code')} placeholder="e.g. TRN-005" /></FormField>
                            <FormField label="Category" error={form.formState.errors.category?.message}><select {...form.register('category')}><option>Technical</option><option>Soft Skill</option><option>Cloud</option></select></FormField>
                            <FormField label="Department" error={form.formState.errors.department?.message}><select {...form.register('department')}><option>Engineering</option><option>Human Resources</option><option>IT</option><option>Finance</option></select></FormField>
                            <FormField label="Trainer" error={form.formState.errors.trainer?.message}><input {...form.register('trainer')} placeholder="Select trainer" /></FormField>
                            <FormField label="Start Date" error={form.formState.errors.startDate?.message}><input type="date" {...form.register('startDate')} /></FormField>
                        </div>
                        <footer className="dialog-actions"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={createProgram.isPending || updateProgram.isPending}>{createProgram.isPending || updateProgram.isPending ? 'Saving...' : 'Save Draft'}</Button></footer>
                    </form>
                </section>
            </div>}

            {deleteTarget && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null) }}>
                <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
                    <span className="confirm-icon"><Trash2 size={19} /></span><h2 id="delete-title">Remove program?</h2><p>This will remove <strong>{deleteTarget.name}</strong> from the program list.</p>
                    <footer className="dialog-actions"><Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={() => void confirmDelete()} disabled={deleteProgram.isPending}>{deleteProgram.isPending ? 'Removing...' : 'Remove Program'}</Button></footer>
                </section>
            </div>}
        </div>
    )
}

function FormField({ children, label, error }: { children: React.ReactNode; label: string; error?: string }) {
    return <label className="form-field"><span>{label}<i aria-hidden="true">*</i></span>{children}{error && <small className="field-error">{error}</small>}</label>
}