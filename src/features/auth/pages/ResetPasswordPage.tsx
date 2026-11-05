import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/shared/ui'
import { AuthLayout } from '../components/AuthLayout'
import { resetPasswordSchema, type ResetPasswordValues } from '../schemas/auth-schema'
import { authApi } from '../services/auth-api'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const token = searchParams.get('token') ?? ''
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.error('This password reset link is invalid or has expired.')
      return
    }

    setSubmitting(true)
    try {
      await authApi.resetPassword({ token, password: values.password, confirmPassword: values.confirmPassword })
      toast.success('Your password has been reset successfully.')
      navigate('/login', { replace: true })
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? String((error as { message?: string }).message) : 'Could not reset the password.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      description={token ? 'Choose a strong password for your account.' : 'This reset link is missing or expired.'}
      footer={<span><Link to="/login">Back to sign in</Link></span>}
    >
      {!token ? (
        <div className="auth-success-box">
          <p>Please request a new password reset link to continue.</p>
          <Link to="/forgot-password"><Button variant="primary">Request new link</Button></Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <label className="field-wrap">
            <span>New password</span>
            <div className="password-input-wrap">
              <input type={showPassword ? 'text' : 'password'} {...form.register('password')} placeholder="Enter a new password" />
              <button type="button" className="password-visibility-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.formState.errors.password && <small>{form.formState.errors.password.message}</small>}
          </label>

          <label className="field-wrap">
            <span>Confirm password</span>
            <div className="password-input-wrap">
              <input type={showConfirmPassword ? 'text' : 'password'} {...form.register('confirmPassword')} placeholder="Re-enter password" />
              <button type="button" className="password-visibility-toggle" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirmPassword((value) => !value)}>
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && <small>{form.formState.errors.confirmPassword.message}</small>}
          </label>

          <Button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? <><Loader2 className="spinner" size={14} /> Resetting...</> : 'Reset password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
