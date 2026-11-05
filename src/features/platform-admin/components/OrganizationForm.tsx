import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Building2, Contact, MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Panel, StatusBadge } from '../../../components/shared/ui'
import { organizationSchema, type OrganizationFormValues } from '../schemas/organization-schema'
import {
    ORGANIZATION_INDUSTRIES,
    ORGANIZATION_PLANS,
    ORGANIZATION_SIZES,
    OrganizationStatus,
    type Organization,
} from '../types/organization'

const emptyValues: OrganizationFormValues = {
    name: '',
    legalName: '',
    code: '',
    logoUrl: '',
    industry: ORGANIZATION_INDUSTRIES[0],
    website: '',
    companySize: ORGANIZATION_SIZES[1],
    description: '',
    officialEmail: '',
    contactNumber: '',
    contactPerson: '',
    designation: '',
    addressLine: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    status: OrganizationStatus.Pending,
    subscriptionPlan: ORGANIZATION_PLANS[0],
    initialAdminName: '',
    initialAdminEmail: '',
    initialAdminDesignation: 'HR Administrator',
}

function organizationValues(organization: Organization): OrganizationFormValues {
    return {
        ...emptyValues,
        name: organization.name,
        legalName: organization.legalName,
        code: organization.code,
        logoUrl: organization.logoUrl ?? '',
        industry: ORGANIZATION_INDUSTRIES.find((item) => item === organization.industry) ?? ORGANIZATION_INDUSTRIES[0],
        website: organization.website,
        companySize: ORGANIZATION_SIZES.find((item) => item === organization.companySize) ?? ORGANIZATION_SIZES[0],
        description: organization.description,
        officialEmail: organization.officialEmail,
        contactNumber: organization.contactNumber,
        contactPerson: organization.contactPerson,
        designation: organization.designation,
        addressLine: organization.address.addressLine,
        city: organization.address.city,
        state: organization.address.state,
        country: organization.address.country,
        postalCode: organization.address.postalCode,
        status: organization.status,
        subscriptionPlan: ORGANIZATION_PLANS.find((item) => item === organization.subscriptionPlan) ?? ORGANIZATION_PLANS[0],
        initialAdminName: organization.initialAdmin.name,
        initialAdminEmail: organization.initialAdmin.email,
        initialAdminDesignation: organization.initialAdmin.designation,
    }
}

export function OrganizationForm({
    organization,
    submitting,
    onSubmit,
}: {
    organization?: Organization
    submitting: boolean
    onSubmit: (values: OrganizationFormValues) => void
}) {
    const form = useForm<OrganizationFormValues>({
        resolver: zodResolver(organizationSchema),
        defaultValues: organization ? organizationValues(organization) : emptyValues,
    })

    return (
        <form className="organization-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <Panel title="Organization Information" className="organization-form-section">
                <FormIcon icon={<Building2 size={16} />} copy="Legal and public organization details." />
                <div className="form-grid">
                    <Field label="Organization Name" error={form.formState.errors.name?.message}><input {...form.register('name')} placeholder="Organization display name" /></Field>
                    <Field label="Legal Business Name" error={form.formState.errors.legalName?.message}><input {...form.register('legalName')} placeholder="Registered legal entity" /></Field>
                    <Field label="Organization Code" error={form.formState.errors.code?.message}><input {...form.register('code')} placeholder="e.g. ACME-001" /></Field>
                    <Field label="Logo URL" required={false} error={form.formState.errors.logoUrl?.message}><input type="url" {...form.register('logoUrl')} placeholder="https://example.com/logo.png" /></Field>
                    <Field label="Industry" error={form.formState.errors.industry?.message}><select {...form.register('industry')}>{ORGANIZATION_INDUSTRIES.map((industry) => <option key={industry}>{industry}</option>)}</select></Field>
                    <Field label="Company Size" error={form.formState.errors.companySize?.message}><select {...form.register('companySize')}>{ORGANIZATION_SIZES.map((size) => <option key={size}>{size}</option>)}</select></Field>
                    <Field label="Company Website" required={false} error={form.formState.errors.website?.message}><input type="url" {...form.register('website')} placeholder="https://example.com" /></Field>
                    <Field className="field-span" label="Organization Description" required={false} error={form.formState.errors.description?.message}><textarea rows={3} {...form.register('description')} placeholder="Short company overview" /></Field>
                </div>
            </Panel>
            <Panel title="Business Contact Information" className="organization-form-section">
                <FormIcon icon={<Contact size={16} />} copy="Primary business and platform contacts." />
                <div className="form-grid">
                    <Field label="Official Business Email" error={form.formState.errors.officialEmail?.message}><input type="email" {...form.register('officialEmail')} placeholder="people@example.com" /></Field>
                    <Field label="Contact Number" error={form.formState.errors.contactNumber?.message}><input type="tel" {...form.register('contactNumber')} placeholder="+1 415 555 0123" /></Field>
                    <Field label="Contact Person" error={form.formState.errors.contactPerson?.message}><input {...form.register('contactPerson')} placeholder="Full name" /></Field>
                    <Field label="Designation" error={form.formState.errors.designation?.message}><input {...form.register('designation')} placeholder="e.g. HR Director" /></Field>
                </div>
            </Panel>
            <Panel title="Registered Address" className="organization-form-section">
                <FormIcon icon={<MapPin size={16} />} copy="The organization's registered business address." />
                <div className="form-grid">
                    <Field className="field-span" label="Address Line" error={form.formState.errors.addressLine?.message}><input {...form.register('addressLine')} placeholder="Street address" /></Field>
                    <Field label="City" error={form.formState.errors.city?.message}><input {...form.register('city')} /></Field>
                    <Field label="State / Province" error={form.formState.errors.state?.message}><input {...form.register('state')} /></Field>
                    <Field label="Country" error={form.formState.errors.country?.message}><input {...form.register('country')} /></Field>
                    <Field label="Postal Code" error={form.formState.errors.postalCode?.message}><input {...form.register('postalCode')} /></Field>
                </div>
            </Panel>
            <Panel title="Platform Configuration" className="organization-form-section">
                <FormIcon icon={<ShieldCheck size={16} />} copy="Subscription, lifecycle, and initial administrator setup." />
                <div className="form-grid">
                    <Field label="Organization Status" error={form.formState.errors.status?.message}>{organization ? <><input type="hidden" {...form.register('status')} /><StatusBadge>{organization.status}</StatusBadge></> : <select {...form.register('status')}><option value={OrganizationStatus.Pending}>Pending approval</option><option value={OrganizationStatus.Approved}>Approved</option><option value={OrganizationStatus.Active}>Active</option><option value={OrganizationStatus.Suspended}>Suspended</option></select>}</Field>
                    <Field label="Subscription Plan" error={form.formState.errors.subscriptionPlan?.message}><select {...form.register('subscriptionPlan')}>{ORGANIZATION_PLANS.map((plan) => <option key={plan}>{plan}</option>)}</select></Field>
                    <Field label="Initial Administrator Name" error={form.formState.errors.initialAdminName?.message}><input {...form.register('initialAdminName')} /></Field>
                    <Field label="Initial Administrator Email" error={form.formState.errors.initialAdminEmail?.message}><input type="email" {...form.register('initialAdminEmail')} /></Field>
                    <Field label="Administrator Designation" error={form.formState.errors.initialAdminDesignation?.message}><input {...form.register('initialAdminDesignation')} /></Field>
                </div>
            </Panel>
            <div className="organization-form-actions"><Link className="button button-outline" to={organization ? `/platform/organizations/${organization.id}` : '/platform/organizations'}>Cancel</Link><Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : organization ? 'Save Organization' : 'Register Organization'}</Button></div>
        </form>
    )
}

function FormIcon({ icon, copy }: { icon: React.ReactNode; copy: string }) {
    return <div className="organization-form-intro"><span>{icon}</span><small>{copy}</small></div>
}

function Field({ children, label, error, className = '', required = true }: { children: React.ReactNode; label: string; error?: string; className?: string; required?: boolean }) {
    return <label className={`form-field ${className}`}><span>{label}{required && <i aria-hidden="true">*</i>}</span>{children}{error && <small className="field-error">{error}</small>}</label>
}