import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../../../components/shared/ui'
import { AuthLayout } from '../components/AuthLayout'

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  pending_approval: 'Pending approval',
  under_review: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected',
  additional_information_required: 'Additional information required',
}

const statusCopy: Record<string, string> = {
  submitted: 'Your organization registration has been received and is waiting to be reviewed.',
  pending_approval: 'Your tenant registration is pending approval. Our team will review the details shortly.',
  under_review: 'The platform team is currently reviewing your registration details.',
  approved: 'Your registration has been approved. The initial administrator can now activate the account and continue onboarding.',
  rejected: 'This registration was not approved. Review the feedback and resubmit with the required updates.',
  additional_information_required: 'We need a few more details before the registration can be approved.',
}

export function RegistrationStatusPage() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') ?? 'pending_approval'
  const organizationName = searchParams.get('organization') ?? 'Your organization'
  const reference = searchParams.get('reference') ?? 'REG-0001'

  return (
    <AuthLayout
      title="Registration status"
      description={`Status for ${organizationName}`}
      footer={<span><Link to="/login">Return to sign in</Link></span>}
    >
      <div className="auth-status-card">
        <div className="auth-status-header">
          <span className="status-badge status-pending">{statusLabels[status] ?? statusLabels.pending_approval}</span>
          <h3>{organizationName}</h3>
        </div>
        <dl className="auth-status-list">
          <div><dt>Reference</dt><dd>{reference}</dd></div>
          <div><dt>Status</dt><dd>{statusLabels[status] ?? statusLabels.pending_approval}</dd></div>
          <div><dt>Next steps</dt><dd>{statusCopy[status] ?? statusCopy.pending_approval}</dd></div>
        </dl>
        <div className="auth-status-actions">
          <Link to="/login"><Button variant="primary">Continue to login</Button></Link>
          <Link to="/register"><Button variant="outline">Submit another registration</Button></Link>
        </div>
      </div>
    </AuthLayout>
  )
}
