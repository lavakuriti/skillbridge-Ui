import { useParams } from 'react-router-dom'
import { ArrowLeft, BookOpenCheck, Award, ClipboardCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Panel, PageHeading, StatusBadge } from '../../../components/shared/ui'
import { useEmployee } from '../hooks/use-employees'

export function EmployeeProfilePage() {
    const { employeeId = '' } = useParams()
    const employee = useEmployee(employeeId)

    if (employee.isLoading) return <div className="page-content"><div className="table-state">Loading employee profile...</div></div>
    if (employee.isError || !employee.data) return <div className="page-content"><div className="table-state" role="alert">Employee profile could not be loaded. <Link to="/employees">Return to employees</Link></div></div>

    const record = employee.data
    return <div className="page-content"><PageHeading eyebrow={<Link className="breadcrumb-link" to="/employees"><ArrowLeft size={12} /> Back to Employees</Link>} title="Employee Profile" description="Review employee details, learning activity, and performance." /><Panel className="profile-overview"><span className="avatar profile-avatar">{record.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div className="profile-name"><h2>{record.name}</h2><span>{record.id} · {record.role}</span></div><StatusBadge>{record.status}</StatusBadge><div className="profile-fields"><div><small>Department</small><strong>{record.department}</strong></div><div><small>Email</small><strong>{record.email}</strong></div><div><small>Learning Programs</small><strong>{record.programs} enrolled</strong></div><div><small>Overall Completion</small><strong>{record.completion}%</strong></div></div></Panel><div className="profile-grid"><Panel title="Training History"><ProfileRow icon={<BookOpenCheck size={16} />} name="Java Fundamentals" meta="Technical · Ravi Kumar" progress={78} /><ProfileRow icon={<BookOpenCheck size={16} />} name="AWS Cloud Basics" meta="Cloud · Olivia" progress={65} /></Panel><Panel title="Examination Results"><ProfileRow icon={<ClipboardCheck size={16} />} name="Java Fundamentals Assessment" meta="Completed · 25 Sep 2026" status="Passed" /><ProfileRow icon={<ClipboardCheck size={16} />} name="AWS Cloud Basics Test" meta="Completed · 18 Sep 2026" status="Passed" /></Panel><Panel title="Certificates"><ProfileRow icon={<Award size={16} />} name="Java Fundamentals" meta="Issued 27 Sep 2026" status="View certificate" /></Panel></div></div>
}

function ProfileRow({ icon, name, meta, progress, status }: { icon: React.ReactNode; name: string; meta: string; progress?: number; status?: string }) {
    return <div className="profile-row"><span className="activity-icon">{icon}</span><span className="activity-copy"><strong>{name}</strong><small>{meta}</small></span>{progress !== undefined ? <span className="progress-cell"><span className="progress-track"><span style={{ width: `${progress}%` }} /></span><small>{progress}%</small></span> : status && <span className="profile-row-status">{status}</span>}</div>
}