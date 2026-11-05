import type { PropsWithChildren, ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AuthLayout({
  title,
  description,
  footer,
  children,
}: PropsWithChildren<{ title: string; description?: ReactNode; footer?: ReactNode }>) {
  return (
    <div className="auth-shell">
      <div className="auth-visual-panel">
        <div className="auth-brand">
          <span className="brand-mark">S</span>
          <span>STACKLY</span>
        </div>
        <div className="auth-copy">
          <span className="eyebrow">Multi-tenant HRMS</span>
          <h1>Future-ready workforce operations.</h1>
          <p>Streamline onboarding, approvals, access control, and HR workflows in one secure platform.</p>
        </div>
      </div>
      <div className="auth-form-panel">
        <Link className="auth-back-link" to="/login">
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
        <div className="auth-card">
          <header className="auth-card-header">
            <span className="eyebrow">Secure access</span>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </header>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
