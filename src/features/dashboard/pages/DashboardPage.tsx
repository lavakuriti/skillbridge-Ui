import { useState } from 'react'
import {
    ArrowRight,
    BookOpenCheck,
    CalendarDays,
    CircleAlert,
    ClipboardCheck,
    Download,
    GraduationCap,
    Users,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Panel, PageHeading, StatCard, StatusBadge } from '../../../components/shared/ui'
import { useDashboardActivity, useDashboardSummary } from '../hooks/use-dashboard'
import { usePrograms } from '../../programs/hooks/use-programs'
import { useExams } from '../../exams/hooks/use-exams'

export function DashboardPage() {
    const [department, setDepartment] = useState('')
    const [programName, setProgramName] = useState('')
    const [dateRange, setDateRange] = useState('September 2026')
    const summary = useDashboardSummary()
    const activity = useDashboardActivity()
    const programQuery = usePrograms({ department: department || undefined, search: programName || undefined })
    const examQuery = useExams()
    const data = summary.data

    function exportDashboard() {
        const programs = programQuery.data?.data ?? []
        const rows = [['Program', 'Code', 'Department', 'Enrolled', 'Completion', 'Status'], ...programs.map((program) => [program.name, program.code, program.department, String(program.enrolled), `${program.completion}%`, program.status])]
        const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'learning-dashboard.csv'
        anchor.click()
        URL.revokeObjectURL(url)
        toast.success('Dashboard exported.')
    }

    return (
        <div className="page-content dashboard-page">
            <PageHeading
                title="HR Admin Dashboard"
                description="Welcome back. Here's what's happening across your learning programs."
                action={<Button variant="outline" onClick={exportDashboard} disabled={programQuery.isLoading}><Download size={15} /> Export</Button>}
            />
            <div className="filter-strip">
                <label><span>Date range</span><select value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option>September 2026</option><option>Last 30 days</option><option>This quarter</option></select></label>
                <label><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="">All departments</option><option>Engineering</option><option>Human Resources</option><option>IT</option><option>Finance</option></select></label>
                <label><span>Program</span><select value={programName} onChange={(event) => setProgramName(event.target.value)}><option value="">All programs</option>{programQuery.data?.data.map((program) => <option key={program.id}>{program.name}</option>)}</select></label>
            </div>
            {(summary.isError || programQuery.isError) && <p className="inline-error" role="alert">Dashboard data could not be loaded. <button className="row-link-button" onClick={() => { void summary.refetch(); void programQuery.refetch() }}>Retry</button></p>}
            <div className="stats-grid">
                <StatCard label="Active Programs" value={summary.isLoading ? '...' : data?.activePrograms ?? 0} icon={<BookOpenCheck size={18} />} detail="Across all departments" />
                <StatCard label="Pending Assignments" value={summary.isLoading ? '...' : data?.pendingAssignments ?? 0} icon={<ClipboardCheck size={18} />} tone="amber" detail="Awaiting review" />
                <StatCard label="Employees Training Today" value={summary.isLoading ? '...' : data?.employeesToday ?? 0} icon={<Users size={18} />} tone="green" detail="Scheduled for today" />
                <StatCard label="Skill Gap Alerts" value={summary.isLoading ? '...' : data?.skillGaps ?? 0} icon={<CircleAlert size={18} />} tone="violet" detail="Needs attention" />
            </div>
            <div className="dashboard-grid">
                <Panel title="Training programs" action={<Link className="panel-link" to="/programs">View all <ArrowRight size={14} /></Link>}>
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead><tr><th>Program</th><th>Enrolled</th><th>Completed</th><th>Progress</th><th>Status</th></tr></thead>
                            <tbody>{programQuery.isLoading ? <tr><td colSpan={5} className="table-empty">Loading programs...</td></tr> : programQuery.data?.data.slice(0, 3).map((program) => <tr key={program.id}><td><Link className="program-name-link" to={`/programs/${program.id}`}><span className="cell-title">{program.name}<small>{program.category}</small></span></Link></td><td>{program.enrolled}</td><td>{Math.round(program.enrolled * program.completion / 100)}</td><td><Progress value={program.completion} /></td><td><StatusBadge>{program.status}</StatusBadge></td></tr>)}</tbody>
                        </table>
                    </div>
                </Panel>
                <Panel title="Overall progress" className="progress-panel">
                    <div className="donut" style={{ '--progress': `${data?.completionRate ?? 0}%` } as CSSProperties}>
                        <div><strong>{summary.isLoading ? '...' : `${data?.completionRate ?? 0}%`}</strong><span>Complete</span></div>
                    </div>
                    <div className="legend-list"><span><i className="legend-dot legend-green" />Completed <b>{data?.completed ?? 0}</b></span><span><i className="legend-dot legend-blue" />In progress <b>{data?.inProgress ?? 0}</b></span><span><i className="legend-dot legend-muted" />Not started <b>{data?.notStarted ?? 0}</b></span></div>
                </Panel>
                <Panel title="Recent activity" className="activity-panel">
                    {activity.data?.map((item) => <Activity key={item.id} icon={item.type === 'employee' ? <Users size={15} /> : item.type === 'program' ? <GraduationCap size={15} /> : <ClipboardCheck size={15} />} title={item.title} detail={item.detail} time={item.time} />)}
                </Panel>
                <Panel title="Upcoming exams" className="exams-panel" action={<Link className="panel-link" to="/exams">View all <ArrowRight size={14} /></Link>}>
                    {examQuery.data?.data.slice(0, 3).map((exam) => <Activity key={exam.id} icon={<CalendarDays size={15} />} title={exam.name} detail={`${exam.candidates} candidates · ${exam.date}`} time={exam.status} />)}
                </Panel>
            </div>
        </div>
    )
}

function Progress({ value }: { value: number }) {
    return <span className="progress-cell"><span className="progress-track"><span style={{ width: `${value}%` }} /></span><small>{value}%</small></span>
}

function Activity({ icon, title, detail, time }: { icon: ReactNode; title: string; detail: string; time: string }) {
    return <div className="activity-row"><span className="activity-icon">{icon}</span><span className="activity-copy"><strong>{title}</strong><small>{detail}</small></span><time>{time}</time></div>
}