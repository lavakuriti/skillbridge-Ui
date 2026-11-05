import { useState } from 'react'
import { ArrowRight, Award, BarChart3, BookOpenCheck, ClipboardCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeading, Panel } from '../../../components/shared/ui'
import { useReports } from '../hooks/use-reports'

const icons = { Training: BookOpenCheck, Examination: ClipboardCheck, Employees: Users, Certificates: Award }

export function ReportsPage() {
    const [reportType, setReportType] = useState('All')
    const [department, setDepartment] = useState('')
    const [appliedFilters, setAppliedFilters] = useState({ reportType: 'All', department: '' })
    const reports = useReports()
    const definitions = reports.data?.filter((report) => appliedFilters.reportType === 'All' || report.group === appliedFilters.reportType) ?? []
    return <div className="page-content"><PageHeading eyebrow="Reports" title="Reports" description="Access detailed reports on training, employees, examinations, skills, and certificates." />
        <Panel className="report-filters"><label><span>Report type</span><select value={reportType} onChange={(event) => setReportType(event.target.value)}><option>All</option><option>Training</option><option>Examination</option><option>Employees</option><option>Certificates</option></select></label><label><span>Date range</span><select defaultValue="Last 30 days"><option>Last 30 days</option><option>This quarter</option><option>This year</option></select></label><label><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="">All departments</option><option>Engineering</option><option>Human Resources</option><option>IT</option></select></label><button className="button button-primary" onClick={() => setAppliedFilters({ reportType, department })}>Apply Filter</button></Panel>
        {reports.isLoading ? <div className="table-state">Loading reports...</div> : reports.isError ? <div className="table-state" role="alert">Reports could not be loaded.</div> : <div className="report-grid">{definitions.map((report) => { const Icon = icons[report.group]; const target = appliedFilters.department ? `${report.route}?department=${encodeURIComponent(appliedFilters.department)}` : report.route; return <Link key={report.id} className="report-card" to={target}><span className="report-icon"><Icon size={18} /></span><span className="report-copy"><strong>{report.title}</strong><small>{report.description}</small></span><span className="report-link">View report <ArrowRight size={14} /></span></Link> })}</div>}
        <Panel title="Training overview" className="report-overview"><div className="report-overview-row"><span className="report-icon report-icon-soft"><BarChart3 size={17} /></span><span><strong>Employee Progress</strong><small>Track individual employee learning progress and performance.</small></span><Link className="panel-link" to="/employees">View report <ArrowRight size={14} /></Link></div></Panel>
    </div>
}