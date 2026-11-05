import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeading, Panel } from '../../../components/shared/ui'

export function OrganizationNotFoundPage() {
    return (
        <div className="page-content">
            <PageHeading eyebrow="Platform Administration" title="Platform page not found" description="The requested platform administration page does not exist." />
            <Panel className="platform-empty-panel">
                <Building2 size={22} />
                <p>Return to the organization directory to continue managing platform accounts.</p>
                <Link className="button button-outline" to="/platform/organizations">Open Organizations</Link>
            </Panel>
        </div>
    )
}