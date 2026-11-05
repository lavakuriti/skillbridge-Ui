import { AlertTriangle } from 'lucide-react'
import { Button } from './ui'

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    pending = false,
    onConfirm,
    onCancel,
}: {
    open: boolean
    title: string
    description: string
    confirmLabel: string
    pending?: boolean
    onConfirm: () => void
    onCancel: () => void
}) {
    if (!open) return null
    return (
        <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !pending) onCancel() }}>
            <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                <span className="confirm-icon"><AlertTriangle size={19} /></span>
                <h2 id="confirm-dialog-title">{title}</h2>
                <p id="confirm-dialog-description">{description}</p>
                <footer className="dialog-actions">
                    <Button variant="outline" onClick={onCancel} disabled={pending}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm} disabled={pending}>{pending ? 'Working...' : confirmLabel}</Button>
                </footer>
            </section>
        </div>
    )
}