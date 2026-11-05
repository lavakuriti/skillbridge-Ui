import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/shared/ui'
import { AuthLayout } from '../components/AuthLayout'
import { forgotPasswordSchema } from '../schemas/auth-schema'
import { authApi } from '../services/auth-api'

const emailSchema = forgotPasswordSchema

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const form = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  })

  async function verifyEmail() {
    if (!token) {
      toast.error('The verification token is missing or has expired.')
      return
    }

    setSubmitting(true)
    try {
      await authApi.verifyEmail({ token, email: email || form.getValues('email') })
      toast.success('Your email has been verified successfully.')
      navigate('/login', { replace: true })
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? String((error as { message?: string }).message) : 'Email verification failed.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function resendVerification() {
    const nextEmail = form.getValues('email')
    if (!nextEmail) {
      toast.error('Enter your email address to resend the verification link.')
      return
    }

    setResending(true)
    try {
      await authApi.resendVerificationEmail(nextEmail)
      toast.success('A new verification link has been sent.')
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? String((error as { message?: string }).message) : 'Unable to resend the verification email.'
      toast.error(message)
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      title={token ? 'Verify your email' : 'Verify email'}
      description={token ? 'Complete the secure verification flow to activate your account.' : 'Check your inbox for a verification message or request a new one.'}
      footer={<span><Link to="/login">Return to sign in</Link></span>}
    >
      <form className="auth-form" onSubmit={(event) => { event.preventDefault(); void verifyEmail() }} noValidate>
        <label className="field-wrap">
          <span>Email address</span>
          <input type="email" placeholder="you@company.com" {...form.register('email')} />
          {form.formState.errors.email && <small>{form.formState.errors.email.message}</small>}
        </label>

        {token ? (
          <Button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? <><Loader2 className="spinner" size={14} /> Verifying...</> : 'Verify email'}
          </Button>
        ) : (
          <Button type="button" variant="outline" className="auth-submit" disabled={resending} onClick={() => void resendVerification()}>
            {resending ? <><Loader2 className="spinner" size={14} /> Sending...</> : 'Resend verification email'}
          </Button>
        )}
      </form>
    </AuthLayout>
  )
}
