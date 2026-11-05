import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft, BookOpen, FileText, Link2, Pencil, Play, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { useAddProgramContent, useProgramContent, usePrograms } from '../hooks/use-programs'
import { programContentSchema, type ProgramContentValues } from '../schemas/program-content-schema'
import type { ProgramContentItem } from '../types/program'

const contentTypes: ProgramContentValues['type'][] = ['Module', 'Video', 'Document', 'Link', 'Assessment']
const contentIcons = { Module: BookOpen, Video: Play, Document: FileText, Link: Link2, Assessment: Pencil }

export function ProgramContentPage() {
    const { programId = '' } = useParams()
    const [dialogType, setDialogType] = useState<ProgramContentValues['type'] | null>(null)
    const programs = usePrograms({})
    const content = useProgramContent(programId)
    const addContent = useAddProgramContent(programId)
    const form = useForm<ProgramContentValues>({ resolver: zodResolver(programContentSchema), defaultValues: { title: '', type: 'Module' } })
    const program = programs.data?.data.find((item) => item.id === programId)
    const modules = useMemo(() => (content.data ?? []).filter((item) => item.type === 'Module'), [content.data])
    const iconButtons = contentTypes.filter((type) => type !== 'Assessment')

    function openDialog(type: ProgramContentValues['type'], moduleId?: string) {
        setDialogType(type)
        form.reset({ title: '', type, moduleId })
    }

    async function submit(values: ProgramContentValues) {
        try {
            await addContent.mutateAsync(values)
            toast.success(`${values.type} added to program.`)
            setDialogType(null)
            form.reset()
        } catch {
            toast.error('Content could not be added.')
        }
    }

    if (programs.isLoading || content.isLoading) return <div className="page-content"><div className="table-state">Loading program content...</div></div>
    if (!program || programs.isError || content.isError) return <div className="page-content"><div className="table-state" role="alert">Program content could not be loaded. <Link to="/programs">Return to programs</Link></div></div>

    return <div className="page-content"><PageHeading eyebrow={<Link className="breadcrumb-link" to={`/programs/${programId}`}><ArrowLeft size={12} /> Back to Program</Link>} title={`Manage Content · ${program.name}`} description={`Program Code: ${program.code} · ${program.category} · ${program.department}`} action={<StatusBadge>{program.status}</StatusBadge>} />
        <div className="content-builder-toolbar"><span>Learning Content</span><div>{iconButtons.map((type) => { const Icon = contentIcons[type]; return <Button key={type} variant="outline" onClick={() => openDialog(type)}><Plus size={13} /><Icon size={13} /> Add {type}</Button> })}<Button onClick={() => openDialog('Assessment')}><Plus size={13} /> Add Assessment</Button></div></div>
        <Panel className="content-builder-panel"><div className="content-builder-summary"><div><span className="eyebrow">PROGRAM CONTENT</span><h2>{program.name}</h2><p>Organize modules and learning materials for enrolled employees.</p></div><span className="content-count">{modules.length} Modules · {(content.data ?? []).length - modules.length} Lessons</span></div>
            {modules.map((module, index) => <ModuleCard key={module.id} module={module} index={index} items={(content.data ?? []).filter((item) => item.moduleId === module.moduleId && item.id !== module.id)} onAdd={(type) => openDialog(type, module.moduleId)} />)}
            <Button variant="outline" onClick={() => openDialog('Module')}><Plus size={14} /> Add Module</Button>
        </Panel>
        {dialogType && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogType(null) }}><section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="content-dialog-title"><header className="dialog-heading"><div><span className="eyebrow">Program content</span><h2 id="content-dialog-title">Add {dialogType}</h2></div><button className="dialog-close" onClick={() => setDialogType(null)} aria-label="Close dialog">×</button></header><form onSubmit={form.handleSubmit(submit)} noValidate><div className="form-grid single-column"><Field label={`${dialogType} title`} error={form.formState.errors.title?.message}><input {...form.register('title')} placeholder={`Enter ${dialogType.toLowerCase()} title`} /></Field>{dialogType !== 'Module' && modules.length > 1 && <Field label="Module"><select {...form.register('moduleId')}>{modules.map((module, index) => <option key={module.moduleId} value={module.moduleId}>Module {index + 1} · {module.title}</option>)}</select></Field>}</div><footer className="dialog-actions"><Button type="button" variant="outline" onClick={() => setDialogType(null)}>Cancel</Button><Button type="submit" disabled={addContent.isPending}>{addContent.isPending ? 'Adding...' : `Add ${dialogType}`}</Button></footer></form></section></div>}
    </div>
}

function ModuleCard({ module, index, items, onAdd }: { module: ProgramContentItem; index: number; items: ProgramContentItem[]; onAdd: (type: ProgramContentValues['type']) => void }) {
    return <section className="module-card"><header><span className="module-index">{index + 1}</span><div><strong>Module {index + 1} · {module.title}</strong><small>{items.length} lessons · Required</small></div></header>{items.length ? items.map((item) => { const Icon = contentIcons[item.type]; return <div className="lesson-row" key={item.id}><Icon size={14} /><span>{item.title}</span><small>{item.type}</small><span className="required-tag">Required</span></div> }) : <div className="lesson-empty">No lessons yet. Add video, document, link, or assessment content.</div>}<div className="module-add-actions">{contentTypes.filter((type) => type !== 'Module').map((type) => { const Icon = contentIcons[type]; return <button key={type} onClick={() => onAdd(type)}><Plus size={12} /><Icon size={12} />{type}</button> })}</div></section>
}

function Field({ children, label, error }: { children: React.ReactNode; label: string; error?: string }) {
    return <label className="form-field"><span>{label}<i aria-hidden="true">*</i></span>{children}{error && <small className="field-error">{error}</small>}</label>
}