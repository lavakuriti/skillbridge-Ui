import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Check, CircleCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, PageHeading, Panel } from '../../../components/shared/ui'
import { useCreateProgram, useUpdateProgram } from '../hooks/use-programs'
import { programWizardSchema, type ProgramWizardValues } from '../schemas/program-wizard-schema'

const steps = [
    { title: 'Basic Details', detail: 'Capture the program identity and target audience.', fields: ['name', 'code', 'category', 'department', 'description', 'skillLevel'] as const },
    { title: 'Learning Details', detail: 'Define the learning outcomes and prerequisites.', fields: ['duration', 'trainer', 'prerequisites'] as const },
    { title: 'Schedule & Trainers', detail: 'Set delivery mode and program dates.', fields: ['mode', 'startDate'] as const },
    { title: 'Review & Publish', detail: 'Review the program before publishing.', fields: [] as const },
]

export function ProgramWizardPage() {
    const [step, setStep] = useState(0)
    const navigate = useNavigate()
    const createProgram = useCreateProgram()
    const updateProgram = useUpdateProgram()
    const form = useForm<ProgramWizardValues>({
        resolver: zodResolver(programWizardSchema),
        defaultValues: { name: '', code: '', category: 'Technical', department: 'Engineering', description: '', skillLevel: 'Beginner', duration: 30, trainer: '', mode: 'Online', startDate: '2026-10-01', prerequisites: '' },
    })
    const active = steps[step]

    async function next() {
        const valid = await form.trigger([...active.fields])
        if (valid) setStep((current) => Math.min(current + 1, steps.length - 1))
    }

    async function save(values: ProgramWizardValues, publish: boolean) {
        try {
            const created = await createProgram.mutateAsync(values)
            if (publish) await updateProgram.mutateAsync({ id: created.id, input: { status: 'Active' } })
            toast.success(publish ? 'Training program published.' : 'Training program saved as draft.')
            navigate('/programs')
        } catch {
            toast.error('The training program could not be saved.')
        }
    }

    return <div className="page-content"><PageHeading eyebrow={<Link className="breadcrumb-link" to="/programs"><ArrowLeft size={12} /> Back to Programs</Link>} title="Create Training Program" description="Build a complete learning program in a few guided steps." />
        <div className="wizard-steps" aria-label="Program creation steps">{steps.map((item, index) => <div key={item.title} className={index === step ? 'wizard-step active' : index < step ? 'wizard-step complete' : 'wizard-step'}><span>{index < step ? <Check size={14} /> : index + 1}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div></div>)}</div>
        <Panel className="wizard-panel"><div className="wizard-panel-heading"><span className="eyebrow">Step {step + 1} of {steps.length}</span><h2>{active.title}</h2><p>{active.detail}</p></div>
            {step < 3 ? <form onSubmit={(event) => { event.preventDefault(); void next() }} noValidate><div className="form-grid">{step === 0 && <><Field label="Program Name" error={form.formState.errors.name?.message}><input {...form.register('name')} placeholder="e.g. Java Fundamentals" /></Field><Field label="Program Code" error={form.formState.errors.code?.message}><input {...form.register('code')} placeholder="e.g. TRN-005" /></Field><Field label="Category" error={form.formState.errors.category?.message}><select {...form.register('category')}><option>Technical</option><option>Soft Skill</option><option>Cloud</option></select></Field><Field label="Department" error={form.formState.errors.department?.message}><select {...form.register('department')}><option>Engineering</option><option>Human Resources</option><option>IT</option><option>Finance</option></select></Field><Field className="field-span" label="Description" error={form.formState.errors.description?.message}><textarea rows={4} {...form.register('description')} placeholder="Describe the goals and audience for this program..." /></Field><Field label="Skill Level" error={form.formState.errors.skillLevel?.message}><select {...form.register('skillLevel')}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field></>}{step === 1 && <><Field label="Duration (days)" error={form.formState.errors.duration?.message}><input type="number" min="1" {...form.register('duration', { valueAsNumber: true })} /></Field><Field label="Trainer / Instructor" error={form.formState.errors.trainer?.message}><input {...form.register('trainer')} placeholder="Select trainer" /></Field><Field className="field-span" label="Prerequisites" error={form.formState.errors.prerequisites?.message}><textarea rows={4} {...form.register('prerequisites')} placeholder="Enter prerequisites for the program..." /></Field><div className="field-span learning-content-box"><span className="content-box-title">Learning content</span><p>Add modules, video, documents, links, and assessments after saving the program draft.</p><span className="content-chips"><i>Modules</i><i>Video</i><i>Documents</i><i>Assessment</i></span></div></>}{step === 2 && <><Field label="Training Mode" error={form.formState.errors.mode?.message}><select {...form.register('mode')}><option>Online</option><option>Classroom</option><option>Hybrid</option></select></Field><Field label="Start Date" error={form.formState.errors.startDate?.message}><input type="date" {...form.register('startDate')} /></Field><div className="field-span schedule-note"><CircleCheck size={16} /><span><strong>Schedule and trainer confirmed later</strong><small>Before publishing, you can review the content and candidate assignment settings.</small></span></div></>}</div><footer className="wizard-actions"><Button type="button" variant="outline" onClick={() => navigate('/programs')}>Cancel</Button><span>{step > 0 && <Button type="button" variant="ghost" onClick={() => setStep((current) => current - 1)}>Back</Button>}<Button type="submit">Continue <ArrowRight size={14} /></Button></span></footer></form> : <form onSubmit={form.handleSubmit((values) => save(values, true))}><div className="program-review"><div className="review-success"><CircleCheck size={20} /><span><strong>Ready to publish</strong><small>Review the program summary before publishing.</small></span></div><div className="review-grid"><Review label="Program Name" value={form.getValues('name')} /><Review label="Program Code" value={form.getValues('code')} /><Review label="Category" value={form.getValues('category')} /><Review label="Department" value={form.getValues('department')} /><Review label="Trainer" value={form.getValues('trainer')} /><Review label="Duration" value={`${form.getValues('duration')} days`} /><Review label="Training Mode" value={form.getValues('mode')} /><Review label="Start Date" value={form.getValues('startDate')} /></div></div><footer className="wizard-actions"><Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button><span><Button type="button" variant="ghost" onClick={() => void form.handleSubmit((values) => save(values, false))()}>Save Draft</Button><Button type="submit" disabled={createProgram.isPending || updateProgram.isPending}>{createProgram.isPending || updateProgram.isPending ? 'Saving...' : 'Save & Publish'} <Check size={14} /></Button></span></footer></form>}
        </Panel>
    </div>
}

function Field({ children, label, error, className = '' }: { children: React.ReactNode; label: string; error?: string; className?: string }) {
    return <label className={`form-field ${className}`}><span>{label}<i aria-hidden="true">*</i></span>{children}{error && <small className="field-error">{error}</small>}</label>
}

function Review({ label, value }: { label: string; value: string }) {
    return <div><small>{label}</small><strong>{value || 'Not set'}</strong></div>
}