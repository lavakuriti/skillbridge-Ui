import { ArrowRight, Building2, CircleCheck, Clock3, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeading, Panel, StatCard, StatusBadge } from '../../../components/shared/ui'
import { ActivityTimeline } from '../../../components/shared/ActivityTimeline'
import { usePlatformDashboard } from '../hooks/use-platform-data'

export function PlatformDashboardPage() {
    const dashboard = usePlatformDashboard()
    const data = dashboard.data
    const maxGrowth = Math.max(1, ...(data?.monthlyGrowth.map((item) => item.organizations) ?? []))
    const maxStatus = Math.max(1, ...(data?.statusDistribution.map((item) => item.count) ?? []))

    return (
        <div className="page-content platform-dashboard-page">
            <PageHeading
                eyebrow="Platform Administration"
                title="Platform Dashboard"
                description="Monitor organizations registered across the Stackly HRMS platform."
                action={<Link className="button button-primary" to="/platform/organizations/new"><Building2 size={15} /> Register Organization</Link>}
            />
            {dashboard.isError && <p className="inline-error" role="alert">Platform summary could not be loaded. <button className="row-link-button" onClick={() => void dashboard.refetch()}>Retry</button></p>}
            <div className="stats-grid platform-stats-grid">
                <StatCard label="Total Organizations" value={dashboard.isLoading ? '...' : data?.totalOrganizations ?? 0} icon={<Building2 size={18} />} detail="All registrations" />
                <StatCard label="Active Organizations" value={dashboard.isLoading ? '...' : data?.activeOrganizations ?? 0} icon={<CircleCheck size={18} />} tone="green" detail="Currently provisioned" />
                <StatCard label="Pending Approval" value={dashboard.isLoading ? '...' : data?.pendingOrganizations ?? 0} icon={<Clock3 size={18} />} tone="amber" detail="Review required" />
                <StatCard label="Suspended Organizations" value={dashboard.isLoading ? '...' : data?.suspendedOrganizations ?? 0} icon={<ShieldAlert size={18} />} tone="violet" detail="Access suspended" />
            </div>
            <div className="platform-dashboard-grid">
                <Panel title="Organization growth" className="platform-growth-panel">
                    {dashboard.isLoading ? <div className="table-state">Loading growth data...</div> : <div className="growth-chart" role="img" aria-label="Organization registrations by month">
                        {data?.monthlyGrowth.map((item) => <div className="growth-column" key={item.month}><span className="growth-count">{item.organizations}</span><div className="growth-track"><span style={{ height: `${Math.max(7, item.organizations / maxGrowth * 100)}%` }} /></div><span className="growth-month">{item.month}</span></div>)}
                    </div>}
                </Panel>
                <Panel title="Organization status distribution" className="platform-status-panel">
                    {dashboard.isLoading ? <div className="table-state">Loading status data...</div> : <div className="status-distribution" role="img" aria-label="Organization counts by status">
                        {data?.statusDistribution.map((item) => <div className="status-distribution-row" key={item.status}><div><StatusBadge>{item.status}</StatusBadge><strong>{item.count}</strong></div><span className="distribution-track"><i className={`distribution-fill distribution-${item.status.toLowerCase()}`} style={{ width: `${item.count / maxStatus * 100}%` }} /></span></div>)}
                    </div>}
                </Panel>
                <Panel title="Recently registered" className="platform-recent-panel" action={<Link className="panel-link" to="/platform/organizations">All organizations <ArrowRight size={14} /></Link>}>
                    {dashboard.isLoading ? <div className="table-state">Loading organizations...</div> : <div className="recent-organization-list">{data?.recentlyRegistered.map((organization) => <Link className="recent-organization-row" key={organization.id} to={`/platform/organizations/${organization.id}`}><span className="organization-avatar">{organization.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="recent-org-copy"><strong>{organization.name}</strong><small>{organization.industry} · {organization.code}</small></span><StatusBadge>{organization.status}</StatusBadge></Link>)}</div>}
                </Panel>
                <Panel title="Recent platform activity" className="platform-activity-panel" action={<Link className="panel-link" to="/platform/organizations">View organizations <ArrowRight size={14} /></Link>}>
                    {dashboard.isLoading ? <div className="table-state">Loading activity...</div> : <ActivityTimeline items={data?.recentActivity ?? []} />}
                </Panel>
            </div>
        </div>
    )
}