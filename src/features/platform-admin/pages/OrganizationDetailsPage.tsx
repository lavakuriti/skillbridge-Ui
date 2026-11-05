import { useState } from 'react'
import { ArrowLeft, Check, Pencil, Play, RotateCw, ShieldAlert } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ActivityTimeline } from '../../../components/shared/ActivityTimeline'
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { useOrganization, useOrganizationActivity, useOrganizationLifecycle } from '../hooks/use-platform-data'
import { getAvailableOrganizationActions, OrganizationLifecycleAction, type OrganizationLifecycleAction as LifecycleAction } from '../types/organization'

const actionLabels: Record<LifecycleAction, string> = {
    [OrganizationLifecycleAction.Approve]: 'Approve',
    [OrganizationLifecycleAction.Activate]: 'Activate',
    [OrganizationLifecycleAction.Suspend]: 'Suspend',
    [OrganizationLifecycleAction.Reactivate]: 'Reactivate',
}

const actionDescriptions: Record<LifecycleAction, string> = {
    [OrganizationLifecycleAction.Approve]: 'Approve this registration. The organization will then be ready for activation.',
    [OrganizationLifecycleAction.Activate]: 'Activate this approved organization and enable platform access.',
    [OrganizationLifecycleAction.Suspend]: 'Suspend this organization. Its platform access will be paused.',
    [OrganizationLifecycleAction.Reactivate]: 'Restore platform access for this suspended organization.',
}

export function OrganizationDetailsPage() {
    const { organizationId = '' } = useParams()
    const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview')
    const [pendingAction, setPendingAction] = useState<LifecycleAction | null>(null)
    const organizationQuery = useOrganization(organizationId)
    const activityQuery = useOrganizationActivity(organizationId)
    const transition = useOrganizationLifecycle()
    const organization = organizationQuery.data

    async function confirmAction() {
        if (!organization || !pendingAction) return
        try {
            await transition.mutateAsync({ id: organization.id, action: pendingAction })
            toast.success(`Organization ${pendingAction === OrganizationLifecycleAction.Suspend ? 'suspended' : pendingAction === OrganizationLifecycleAction.Approve ? 'approved' : pendingAction === OrganizationLifecycleAction.Activate ? 'activated' : 'reactivated'}.`)
            setPendingAction(null)
        } catch {
            toast.error('The organization status could not be changed.')
        }
    }

    if (organizationQuery.isLoading) return <div className="page-content"><div className="table-state">Loading organization...</div></div>
    if (organizationQuery.isError || !organization) return <div className="page-content"><div className="table-state" role="alert">Organization could not be loaded. <Link to="/platform/organizations">Return to organizations</Link></div></div>

    const actions = getAvailableOrganizationActions(organization.status)

    return (
        <div className="page-content">
            <PageHeading
                eyebrow={<Link className="breadcrumb-link" to="/platform/organizations"><ArrowLeft size={12} /> Back to Organizations</Link>}
                title={organization.name}
                description={`${organization.industry} · ${organization.code}`}
                action={<div className="organization-detail-actions"><StatusBadge>{organization.status}</StatusBadge><Link className="button button-outline" to={`/platform/organizations/${organization.id}/edit`}><Pencil size={14} /> Edit Organization</Link>{actions.map((action) => <Button key={action} variant={action === OrganizationLifecycleAction.Suspend ? 'danger' : action === OrganizationLifecycleAction.Approve ? 'primary' : 'outline'} onClick={() => setPendingAction(action)}>{action === OrganizationLifecycleAction.Approve ? <Check size={14} /> : action === OrganizationLifecycleAction.Suspend ? <ShieldAlert size={14} /> : action === OrganizationLifecycleAction.Reactivate ? <RotateCw size={14} /> : <Play size={14} />}{actionLabels[action]}</Button>)}</div>}
            />
            <div className="organization-tabs" role="tablist" aria-label="Organization detail sections">
                <button role="tab" aria-selected={activeTab === 'overview'} className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                <button role="tab" aria-selected={activeTab === 'activity'} className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>Activity & Audit</button>
                <Link to={`/platform/organizations/${organization.id}/activity`}>Open activity history</Link>
            </div>
            {activeTab === 'overview' ? (
                <div className="organization-detail-grid">
                    <Panel title="Organization Profile" className="organization-profile-panel">
                        <div className="organization-profile-heading"><OrganizationAvatar name={organization.name} logoUrl={organization.logoUrl} /><div><h2>{organization.name}</h2><span>{organization.legalName}</span></div></div>
                        <dl className="organization-definition-grid"><Definition label="Organization Code" value={organization.code} /><Definition label="Industry" value={organization.industry} /><Definition label="Company Size" value={organization.companySize} /><Definition label="Website" value={organization.website || 'Not provided'} /><Definition label="Business Email" value={organization.officialEmail} /><Definition label="Contact Number" value={organization.contactNumber} /><Definition label="Contact Person" value={`${organization.contactPerson} · ${organization.designation}`} /><Definition label="Subscription Plan" value={organization.subscriptionPlan} /></dl>
                        <div className="organization-description"><small>Description</small><p>{organization.description || 'No description provided.'}</p></div>
                    </Panel>
                    <Panel title="Registered Address"><dl className="organization-definition-grid address-grid"><Definition label="Address" value={organization.address.addressLine} /><Definition label="City" value={organization.address.city} /><Definition label="State / Province" value={organization.address.state} /><Definition label="Country" value={organization.address.country} /><Definition label="Postal Code" value={organization.address.postalCode} /></dl></Panel>
                    <Panel title="Initial Administrator"><dl className="organization-definition-grid"><Definition label="Name" value={organization.initialAdmin.name} /><Definition label="Email" value={organization.initialAdmin.email} /><Definition label="Designation" value={organization.initialAdmin.designation} /></dl><p className="provisioning-note"><Check size={14} /> Initial administrator provisioning is recorded in the platform audit history.</p></Panel>
                    <Panel title="Platform Audit Information"><dl className="organization-definition-grid"><Definition label="Registered" value={format(new Date(organization.createdAt), 'dd MMM yyyy, HH:mm')} /><Definition label="Last Modified" value={format(new Date(organization.updatedAt), 'dd MMM yyyy, HH:mm')} /><Definition label="Created By" value={organization.createdBy} /><Definition label="Last Updated By" value={organization.updatedBy} /></dl></Panel>
                </div>
            ) : (
                <Panel title="Organization Activity & Audit"><ActivityContent organizationId={organization.id} /></Panel>
            )}
            <ConfirmDialog
                open={Boolean(pendingAction)}
                title={pendingAction ? `${actionLabels[pendingAction]} organization?` : ''}
                description={pendingAction ? actionDescriptions[pendingAction] : ''}
                confirmLabel={pendingAction ? actionLabels[pendingAction] : 'Confirm'}
                pending={transition.isPending}
                onCancel={() => setPendingAction(null)}
                onConfirm={() => void confirmAction()}
            />
            {activeTab === 'activity' && activityQuery.isError && <p className="inline-error" role="alert">Activity history could not be loaded. <button className="row-link-button" onClick={() => void activityQuery.refetch()}>Retry</button></p>}
        </div>
    )
}

function ActivityContent({ organizationId }: { organizationId: string }) {
    const activity = useOrganizationActivity(organizationId)
    if (activity.isLoading) return <div className="table-state">Loading activity history...</div>
    if (activity.isError) return <div className="table-state" role="alert">Activity history could not be loaded. <Button variant="outline" onClick={() => void activity.refetch()}>Retry</Button></div>
    return <ActivityTimeline items={activity.data ?? []} />
}

function Definition({ label, value }: { label: string; value: string }) {
    return <div><dt>{label}</dt><dd>{value}</dd></div>
}

function OrganizationAvatar({ name, logoUrl }: { name: string; logoUrl: string | null }) {
    return logoUrl ? <img className="organization-profile-logo" src={logoUrl} alt={`${name} logo`} /> : <span className="organization-profile-logo organization-logo-fallback" aria-hidden="true">{name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>
}