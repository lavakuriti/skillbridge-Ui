import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'

export function Button({
    variant = 'primary',
    className = '',
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
    return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

export function PageHeading({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow?: ReactNode
    title: string
    description?: string
    action?: ReactNode
}) {
    return (
        <header className="page-heading">
            <div>
                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                <h1>{title}</h1>
                {description && <p>{description}</p>}
            </div>
            {action && <div className="page-heading-action">{action}</div>}
        </header>
    )
}

export function Panel({
    title,
    action,
    children,
    className = '',
    id,
}: PropsWithChildren<{ id?: string; title?: string; action?: ReactNode; className?: string }>) {
    return (
        <section id={id} className={`panel ${className}`}>
            {(title || action) && <div className="panel-heading">{title && <h2>{title}</h2>}{action}</div>}
            {children}
        </section>
    )
}

export function StatusBadge({ children }: PropsWithChildren) {
    const value = typeof children === 'string' ? children.toLowerCase().replaceAll(' ', '-') : ''
    return <span className={`status-badge status-${value}`}>{children}</span>
}

export function StatCard({
    label,
    value,
    icon,
    detail,
    tone = 'blue',
}: {
    label: string
    value: string | number
    icon: ReactNode
    detail?: string
    tone?: 'blue' | 'green' | 'amber' | 'violet'
}) {
    return (
        <article className="stat-card">
            <span className={`stat-icon stat-icon-${tone}`}>{icon}</span>
            <div className="stat-copy">
                <span className="stat-label">{label}</span>
                <strong>{value}</strong>
                {detail && <span className="stat-detail">{detail}</span>}
            </div>
        </article>
    )
}