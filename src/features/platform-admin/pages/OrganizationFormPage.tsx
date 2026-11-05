import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeading } from '../../../components/shared/ui'
import { useCreateOrganization, useOrganization, useUpdateOrganization } from '../hooks/use-platform-data'
import { OrganizationForm } from '../components/OrganizationForm'
import type { OrganizationFormValues } from '../schemas/organization-schema'

export function OrganizationFormPage() {
    const { organizationId } = useParams()
    const navigate = useNavigate()
    const organizationQuery = useOrganization(organizationId ?? '')
    const createOrganization = useCreateOrganization()
    const updateOrganization = useUpdateOrganization()
    const organization = organizationQuery.data
    const isEditing = Boolean(organizationId)

    async function submit(values: OrganizationFormValues) {
        try {
            if (organizationId) {
                const updated = await updateOrganization.mutateAsync({ id: organizationId, input: values })
                toast.success('Organization information updated.')
                navigate(`/platform/organizations/${updated.id}`)
            } else {
                const created = await createOrganization.mutateAsync(values)
                toast.success('Organization registered and awaiting approval.')
                navigate(`/platform/organizations/${created.id}`)
            }
        } catch {
            toast.error(isEditing ? 'Organization could not be updated.' : 'Organization could not be registered.')
        }
    }

    if (isEditing && organizationQuery.isLoading) return <div className="page-content"><div className="table-state">Loading organization...</div></div>
    if (isEditing && (organizationQuery.isError || !organization)) {
        return <div className="page-content"><div className="table-state" role="alert">Organization could not be loaded. <Link to="/platform/organizations">Return to organizations</Link></div></div>
    }

    return (
        <div className="page-content">
            <PageHeading
                eyebrow={<Link className="breadcrumb-link" to={organization ? `/platform/organizations/${organization.id}` : '/platform/organizations'}>Back to Organizations</Link>}
                title={organization ? `Edit ${organization.name}` : 'Register Organization'}
                description={organization ? 'Update organization information without changing its lifecycle status.' : 'Register a new enterprise on the Stackly HRMS platform.'}
            />
            <OrganizationForm
                organization={organization}
                submitting={createOrganization.isPending || updateOrganization.isPending}
                onSubmit={submit}
            />
        </div>
    )
}