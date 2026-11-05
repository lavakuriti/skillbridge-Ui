import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/shared/ui'
import { AuthLayout } from '../components/AuthLayout'
import { organizationRegistrationSchema, type OrganizationRegistrationValues } from '../schemas/auth-schema'
import { authApi } from '../services/auth-api'

const defaultValues: OrganizationRegistrationValues = {
  name: 'Northstar Labs',
  legalName: 'Northstar Labs Pty Ltd',
  code: 'NSL-001',
  industry: 'Technology',
  website: 'https://northstarlabs.example',
  companySize: '51-200',
  description: 'A growing SaaS and HR operations company.',
  officialEmail: 'hello@northstarlabs.example',
  contactNumber: '+1 415 555 0141',
  contactPerson: 'Alicia Morgan',
  designation: 'HR Director',
  addressLine: '100 Market Street',
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  postalCode: '94103',
  initialAdminName: 'Alicia Morgan',
  initialAdminEmail: 'alicia@northstarlabs.example',
  initialAdminDesignation: 'HR Administrator',
  status: 'pending_approval',
  subscriptionPlan: 'Growth',
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<OrganizationRegistrationValues>({
    resolver: zodResolver(organizationRegistrationSchema),
    defaultValues,
  })

  async function onSubmit(values: OrganizationRegistrationValues) {
    setSubmitting(true)
    try {
      const result = await authApi.registerOrganization(values)
      toast.success('Your registration has been submitted for review.')
      navigate(`/registration-status?status=${encodeURIComponent(result.status || 'pending_approval')}&organization=${encodeURIComponent(values.name)}&reference=${encodeURIComponent(result.reference ?? 'REG-0001')}`)
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? String((error as { message?: string }).message) : 'Organization registration could not be completed.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Register your organization"
      description="Create a new Stackly tenant and submit your information for approval."
      footer={<span>Already have an account? <Link to="/login">Sign in</Link></span>}
    >
      <form className="auth-form auth-form-wide" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="auth-form-grid">
          <label className="field-wrap">
            <span>Organization name</span>
            <input {...form.register('name')} placeholder="Northstar Labs" />
            {form.formState.errors.name && <small>{form.formState.errors.name.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Legal business name</span>
            <input {...form.register('legalName')} placeholder="Northstar Labs Pty Ltd" />
            {form.formState.errors.legalName && <small>{form.formState.errors.legalName.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Organization code</span>
            <input {...form.register('code')} placeholder="NSL-001" />
            {form.formState.errors.code && <small>{form.formState.errors.code.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Industry</span>
            <select {...form.register('industry')}>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
            {form.formState.errors.industry && <small>{form.formState.errors.industry.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Company website</span>
            <input type="url" {...form.register('website')} placeholder="https://example.com" />
            {form.formState.errors.website && <small>{form.formState.errors.website.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Company size</span>
            <select {...form.register('companySize')}>
              <option value="1-50">1-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
            {form.formState.errors.companySize && <small>{form.formState.errors.companySize.message}</small>}
          </label>
          <label className="field-wrap field-span">
            <span>Organization description</span>
            <textarea rows={3} {...form.register('description')} placeholder="Short overview and mission" />
            {form.formState.errors.description && <small>{form.formState.errors.description.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Official business email</span>
            <input type="email" {...form.register('officialEmail')} placeholder="hello@example.com" />
            {form.formState.errors.officialEmail && <small>{form.formState.errors.officialEmail.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Contact number</span>
            <input {...form.register('contactNumber')} placeholder="+1 415 555 0141" />
            {form.formState.errors.contactNumber && <small>{form.formState.errors.contactNumber.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Contact person</span>
            <input {...form.register('contactPerson')} placeholder="Alicia Morgan" />
            {form.formState.errors.contactPerson && <small>{form.formState.errors.contactPerson.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Designation</span>
            <input {...form.register('designation')} placeholder="HR Director" />
            {form.formState.errors.designation && <small>{form.formState.errors.designation.message}</small>}
          </label>
          <label className="field-wrap field-span">
            <span>Address</span>
            <input {...form.register('addressLine')} placeholder="100 Market Street" />
            {form.formState.errors.addressLine && <small>{form.formState.errors.addressLine.message}</small>}
          </label>
          <label className="field-wrap">
            <span>City</span>
            <input {...form.register('city')} placeholder="San Francisco" />
            {form.formState.errors.city && <small>{form.formState.errors.city.message}</small>}
          </label>
          <label className="field-wrap">
            <span>State</span>
            <input {...form.register('state')} placeholder="California" />
            {form.formState.errors.state && <small>{form.formState.errors.state.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Country</span>
            <input {...form.register('country')} placeholder="United States" />
            {form.formState.errors.country && <small>{form.formState.errors.country.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Postal code</span>
            <input {...form.register('postalCode')} placeholder="94103" />
            {form.formState.errors.postalCode && <small>{form.formState.errors.postalCode.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Initial administrator name</span>
            <input {...form.register('initialAdminName')} placeholder="Alicia Morgan" />
            {form.formState.errors.initialAdminName && <small>{form.formState.errors.initialAdminName.message}</small>}
          </label>
          <label className="field-wrap">
            <span>Admin email</span>
            <input type="email" {...form.register('initialAdminEmail')} placeholder="alicia@example.com" />
            {form.formState.errors.initialAdminEmail && <small>{form.formState.errors.initialAdminEmail.message}</small>}
          </label>
          <label className="field-wrap field-span">
            <span>Administrator designation</span>
            <input {...form.register('initialAdminDesignation')} placeholder="HR Administrator" />
            {form.formState.errors.initialAdminDesignation && <small>{form.formState.errors.initialAdminDesignation.message}</small>}
          </label>
        </div>

        <Button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Register organization'}
        </Button>
      </form>
    </AuthLayout>
  )
}
