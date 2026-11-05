import { useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, PageHeading, Panel, StatCard, StatusBadge } from '../../../components/shared/ui'
import { DataTable, type DataColumn } from '../../../components/shared/DataTable'
import { useExamResults } from '../hooks/use-exams'
import type { ExamResult } from '../types/exam'

export function ExamResultsPage() {
    const { examId = '' } = useParams()
    const results = useExamResults(examId)
    if (results.isLoading) return <div className="page-content"><div className="table-state">Loading results...</div></div>
    if (results.isError || !results.data) return <div className="page-content"><div className="table-state" role="alert">Examination results could not be loaded. <Link to="/exams">Return to examinations</Link></div></div>
    const report = results.data
    const columns: DataColumn<ExamResult>[] = [
        { id: 'name', header: 'Employee', accessor: (row) => row.name, cell: (row) => <span className="cell-title">{row.name}<small>{row.email}</small></span> },
        { id: 'score', header: 'Score', accessor: (row) => row.score, cell: (row) => `${row.score}%` },
        { id: 'status', header: 'Status', accessor: (row) => row.status, cell: (row) => <StatusBadge>{row.status}</StatusBadge> },
    ]
    return <div className="page-content"><PageHeading eyebrow={<Link to="/exams"><ArrowLeft size={12} /> Back to Examinations</Link>} title="Examination Results" description={report.exam} action={<Button variant="outline"><Download size={14} /> Export Results</Button>} /><div className="stats-grid results-stats"><StatCard label="Total Candidates" value={report.totalCandidates} icon={<span>80</span>} /><StatCard label="Completed" value={report.completed} icon={<span>✓</span>} tone="green" /><StatCard label="Passed" value={report.passed} icon={<span>✓</span>} tone="blue" /><StatCard label="Failed" value={report.failed} icon={<span>!</span>} tone="amber" /></div><Panel title="Candidate results"><div className="table-inset"><DataTable columns={columns} data={report.results} pageSize={5} emptyMessage="No candidates have completed this examination." /></div></Panel></div>
}