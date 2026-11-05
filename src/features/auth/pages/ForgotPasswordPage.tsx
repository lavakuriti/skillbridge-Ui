import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/shared/ui'
import { AuthLayout } from '../components/AuthLayout'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas/auth-schema'
import { authApi } from '../services/auth-api'

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setSubmitting(true)
    try {
      await authApi.forgotPassword(values)
      setSubmitted(true)
      toast.success('If that account exists, a password reset link has been sent.')
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? String((error as { message?: string }).message) : 'We could not process that request.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title={submitted ? 'Check your email' : 'Forgot your password?'}
      description={submitted ? 'We sent a password reset link if an account matches this email address.' : 'Enter the email used for your Stackly account.'}
      footer={<span><Link to="/login">Return to sign in</Link></span>}
    >
      {submitted ? (
        <div className="auth-success-box">
          <p>Your request is in progress. Use the secure link in the email to update your password.</p>
          <Link to="/login"><Button variant="primary">Back to login</Button></Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <label className="field-wrap">
            <span>Email address</span>
            <input type="email" placeholder="you@company.com" {...form.register('email')} />
            {form.formState.errors.email && <small>{form.formState.errors.email.message}</small>}
          </label>
          <Button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
