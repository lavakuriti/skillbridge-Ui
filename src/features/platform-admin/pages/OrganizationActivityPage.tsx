import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ActivityTimeline } from '../../../components/shared/ActivityTimeline'
import { Button, PageHeading, Panel } from '../../../components/shared/ui'
import { useOrganization, useOrganizationActivity } from '../hooks/use-platform-data'

export function OrganizationActivityPage() {
    const { organizationId = '' } = useParams()
    const organization = useOrganization(organizationId)
    const activity = useOrganizationActivity(organizationId)

    if (organization.isLoading) return <div className="page-content"><div className="table-state">Loading organization...</div></div>
    if (organization.isError || !organization.data) return <div className="page-content"><div className="table-state" role="alert">Organization could not be loaded. <Link to="/platform/organizations">Return to organizations</Link></div></div>

    return (
        <div className="page-content">
            <PageHeading eyebrow={<Link className="breadcrumb-link" to={`/platform/organizations/${organizationId}`}><ArrowLeft size={12} /> Back to Organization</Link>} title="Organization Activity" description={`Platform-level registration and lifecycle history for ${organization.data.name}.`} />
            <Panel title="Audit History">
                {activity.isLoading ? <div className="table-state">Loading audit history...</div> : activity.isError ? <div className="table-state" role="alert">Audit history could not be loaded. <Button variant="outline" onClick={() => void activity.refetch()}>Retry</Button></div> : <ActivityTimeline items={activity.data ?? []} />}
            </Panel>
        </div>
    )
}