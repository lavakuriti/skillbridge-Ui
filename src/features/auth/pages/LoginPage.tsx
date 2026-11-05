import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/shared/ui'
import { AuthLayout } from '../components/AuthLayout'
import { loginSchema, type LoginValues } from '../schemas/auth-schema'
import { authApi, getDefaultDashboardPath, readStoredUser } from '../services/auth-api'

const defaultValues: LoginValues = {
  email: 'platform.admin@stackly.com',
  password: 'Password123!',
  rememberMe: true,
}

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const currentUser = readStoredUser()

  useEffect(() => {
    if (currentUser) {
      navigate(getDefaultDashboardPath(currentUser), { replace: true })
    }
  }, [currentUser, navigate])

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  })

  async function onSubmit(values: LoginValues) {
    setSubmitting(true)
    try {
      const session = await authApi.signIn(values)
      toast.success('Welcome back.')
      navigate(getDefaultDashboardPath(session.user), { replace: true })
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error ? String((error as { message?: string }).message) : 'Unable to sign in.'
      if (message.toLowerCase().includes('not verified')) {
        navigate(`/verify-email?email=${encodeURIComponent(form.getValues('email'))}`)
        return
      }
      toast.error(message || 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your organization, approvals, and workspace."
      footer={
        <span>
          Need an account? <Link to="/register">Create organization</Link>
        </span>
      }
    >
      <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <label className="field-wrap">
          <span>Email address</span>
          <input type="email" placeholder="you@company.com" {...form.register('email')} />
          {form.formState.errors.email && <small>{form.formState.errors.email.message}</small>}
        </label>

        <label className="field-wrap">
          <span>Password</span>
          <div className="password-input-wrap">
            <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...form.register('password')} />
            <button type="button" className="password-visibility-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.formState.errors.password && <small>{form.formState.errors.password.message}</small>}
        </label>

        <div className="auth-options-row">
          <label className="checkbox-row">
            <input type="checkbox" {...form.register('rememberMe')} />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <Button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? <><Loader2 className="spinner" size={14} /> Signing in...</> : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
