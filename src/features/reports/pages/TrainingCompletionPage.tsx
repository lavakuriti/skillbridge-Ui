import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { Button, PageHeading, Panel, StatCard } from '../../../components/shared/ui'
import { DataTable, type DataColumn } from '../../../components/shared/DataTable'
import { useTrainingCompletionReport } from '../hooks/use-reports'
import type { CompletionRow } from '../types/report'

export function TrainingCompletionPage() {
    const [searchParams] = useSearchParams()
    const [department, setDepartment] = useState(() => searchParams.get('department') ?? '')
    const [program, setProgram] = useState('')
    const [applied, setApplied] = useState(() => ({ department: searchParams.get('department') ?? '', program: '' }))
    const report = useTrainingCompletionReport({ department: applied.department || undefined, program: applied.program || undefined })
    const columns: DataColumn<CompletionRow>[] = [
        { id: 'program', header: 'Program Name', accessor: (row) => row.program },
        { id: 'enrolled', header: 'Enrolled', accessor: (row) => row.enrolled },
        { id: 'completed', header: 'Completed', accessor: (row) => row.completed },
        { id: 'inProgress', header: 'In Progress', accessor: (row) => row.inProgress },
        { id: 'completionRate', header: 'Completion Rate', accessor: (row) => row.completionRate, cell: (row) => <span className="progress-cell"><span className="progress-track"><span style={{ width: `${row.completionRate}%` }} /></span><small>{row.completionRate}%</small></span> },
    ]

    function exportFile(format: 'csv' | 'pdf') {
        if (!report.data) return
        if (format === 'pdf') {
            window.print()
            return
        }
        const rows = [['Program', 'Enrolled', 'Completed', 'In Progress', 'Completion Rate'], ...report.data.programs.map((row) => [row.program, String(row.enrolled), String(row.completed), String(row.inProgress), `${row.completionRate}%`])]
        const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'training-completion.csv'
        anchor.click()
        URL.revokeObjectURL(url)
        toast.success('CSV report exported.')
    }

    return <div className="page-content"><PageHeading eyebrow="Reports" title="Training Completion Report" description="View training enrollment, completion, and progress details." action={<span className="export-actions"><Button variant="outline" onClick={() => exportFile('pdf')}><FileText size={14} /> Export PDF</Button><Button variant="outline" onClick={() => exportFile('csv')}><FileSpreadsheet size={14} /> Export Excel</Button></span>} />
        <div className="report-filter-bar"><label><span>Date</span><select defaultValue="Sep 01 - Sep 24, 2026"><option>Sep 01 - Sep 24, 2026</option><option>Last 30 days</option><option>This quarter</option></select></label><label><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="">All departments</option><option>Engineering</option><option>Human Resources</option><option>IT</option></select></label><label><span>Program</span><select value={program} onChange={(event) => setProgram(event.target.value)}><option value="">All programs</option><option>Java Fundamentals</option><option>Python Programming</option><option>AWS Cloud Basics</option></select></label><Button onClick={() => setApplied({ department, program })}>Apply Filter</Button></div>
        {report.isLoading ? <div className="table-state">Loading report...</div> : report.isError ? <div className="table-state" role="alert">Report could not be loaded. <Button variant="outline" onClick={() => void report.refetch()}>Retry</Button></div> : report.data && <><div className="stats-grid report-stats"><StatCard label="Total Enrolled" value={report.data.totalEnrolled} icon={<Users size={17} />} /><StatCard label="Completed" value={report.data.completed} icon={<span>✓</span>} tone="green" /><StatCard label="In Progress" value={report.data.inProgress} icon={<span>◷</span>} tone="blue" /><StatCard label="Not Started" value={report.data.notStarted} icon={<span>—</span>} tone="amber" /><StatCard label="Completion Rate" value={`${report.data.completionRate}%`} icon={<Download size={16} />} tone="violet" /></div><Panel title="Program-wise training completion"><div className="table-inset"><DataTable columns={columns} data={report.data.programs} pageSize={5} emptyMessage="No program completion data for these filters." /></div></Panel></>}
    </div>
}