import { format } from 'date-fns'

export interface ActivityTimelineItem {
    id: string
    description: string
    actor: string
    createdAt: string
    organizationName?: string
    type?: string
}

export function ActivityTimeline({ items, emptyMessage = 'No activity recorded yet.' }: { items: ActivityTimelineItem[]; emptyMessage?: string }) {
    if (!items.length) return <p className="timeline-empty">{emptyMessage}</p>
    return (
        <ol className="activity-timeline">
            {items.map((item) => (
                <li key={item.id}>
                    <span className={`timeline-marker timeline-marker-${item.type ?? 'default'}`} />
                    <div className="timeline-entry">
                        <strong>{item.description}</strong>
                        {item.organizationName && <span className="timeline-organization">{item.organizationName}</span>}
                        <span className="timeline-meta">{item.actor} · {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}</span>
                    </div>
                </li>
            ))}
        </ol>
    )
}