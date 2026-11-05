import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarDays, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { DataTable, type DataColumn } from '../../../components/shared/DataTable'
import { useCreateExam, useExams } from '../hooks/use-exams'
import { examSchema, type ExamFormValues } from '../schemas/exam-schema'
import type { Exam } from '../types/exam'
import { Link } from 'react-router-dom'

export function ExamsPage() {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const exams = useExams(search || undefined)
    const createExam = useCreateExam()
    const form = useForm<ExamFormValues>({
        resolver: zodResolver(examSchema),
        defaultValues: { name: '', program: 'Java Fundamentals', date: '2026-10-25', duration: 60, questions: 50, passingScore: 60, attempts: 2 },
    })
    const rows = exams.data?.data.filter((exam) => !status || exam.status === status) ?? []
    const columns: DataColumn<Exam>[] = [
        { id: 'name', header: 'Exam Name', accessor: (exam) => exam.name },
        { id: 'program', header: 'Program', accessor: (exam) => exam.program },
        { id: 'date', header: 'Date', accessor: (exam) => exam.date },
        { id: 'candidates', header: 'Candidates', accessor: (exam) => exam.candidates },
        { id: 'averageScore', header: 'Avg Score', accessor: (exam) => exam.averageScore ?? -1, cell: (exam) => exam.averageScore === null ? '--' : `${exam.averageScore}%` },
        { id: 'status', header: 'Status', accessor: (exam) => exam.status, cell: (exam) => <StatusBadge>{exam.status}</StatusBadge> },
        { id: 'actions', header: 'Actions', accessor: (exam) => exam.name, cell: (exam) => <Link className="row-link" to={`/exams/${exam.id}/results`}>View results</Link>, sortable: false },
    ]

    async function submit(values: ExamFormValues) {
        try {
            await createExam.mutateAsync(values)
            toast.success('Examination scheduled.')
            setDialogOpen(false)
            form.reset()
        } catch {
            toast.error('The examination could not be scheduled.')
        }
    }

    return (
        <div className="page-content">
            <PageHeading eyebrow="Back to Dashboard" title="Examinations" description="Create, schedule, manage, monitor, and review employee examinations." action={<Button onClick={() => setDialogOpen(true)}><Plus size={15} /> Create Exam</Button>} />
            <Panel className="programs-panel">
                <div className="program-toolbar">
                    <label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search exam..." aria-label="Search exams" /></label>
                    <label className="filter-select"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option>Scheduled</option><option>Completed</option><option>Present</option></select></label>
                </div>
                {exams.isLoading ? <div className="table-state">Loading examinations...</div> : exams.isError ? <div className="table-state" role="alert">Examinations could not be loaded. <Button variant="outline" onClick={() => void exams.refetch()}>Retry</Button></div> : <div className="table-inset"><DataTable columns={columns} data={rows} pageSize={5} emptyMessage="No examinations match these filters." /></div>}
            </Panel>
            {dialogOpen && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false) }}>
                <section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="exam-dialog-title">
                    <header className="dialog-heading"><div><span className="eyebrow">Schedule an assessment</span><h2 id="exam-dialog-title">Create Examination</h2></div><button className="dialog-close" onClick={() => setDialogOpen(false)} aria-label="Close dialog">×</button></header>
                    <form onSubmit={form.handleSubmit(submit)} noValidate>
                        <div className="form-grid">
                            <Field label="Exam Name" error={form.formState.errors.name?.message}><input {...form.register('name')} placeholder="Enter exam name" /></Field>
                            <Field label="Training Program" error={form.formState.errors.program?.message}><select {...form.register('program')}><option>Java Fundamentals</option><option>Python Programming</option><option>AWS Cloud Basics</option></select></Field>
                            <Field label="Exam Date" error={form.formState.errors.date?.message}><input type="date" {...form.register('date')} /></Field>
                            <Field label="Duration (minutes)" error={form.formState.errors.duration?.message}><input type="number" min="1" {...form.register('duration', { valueAsNumber: true })} /></Field>
                            <Field label="Questions" error={form.formState.errors.questions?.message}><input type="number" min="1" {...form.register('questions', { valueAsNumber: true })} /></Field>
                            <Field label="Passing Score (%)" error={form.formState.errors.passingScore?.message}><input type="number" min="1" max="100" {...form.register('passingScore', { valueAsNumber: true })} /></Field>
                            <Field label="Attempts (Allowed)" error={form.formState.errors.attempts?.message}><input type="number" min="1" {...form.register('attempts', { valueAsNumber: true })} /></Field>
                        </div>
                        <footer className="dialog-actions"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={createExam.isPending}><CalendarDays size={14} />{createExam.isPending ? 'Scheduling...' : 'Schedule Examination'}</Button></footer>
                    </form>
                </section>
            </div>}
        </div>
    )
}

function Field({ children, label, error }: { children: React.ReactNode; label: string; error?: string }) {
    return <label className="form-field"><span>{label}<i aria-hidden="true">*</i></span>{children}{error && <small className="field-error">{error}</small>}</label>
}