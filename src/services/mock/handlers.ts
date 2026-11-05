import { http, HttpResponse } from 'msw'
import { z } from 'zod'
import { dashboardActivity, employees, exams, learningPlans, pendingAssignments, programContents, programs, reportDefinitions, settingsConfiguration, skillGaps, trainingActivities, trainingCompletion, type ProgramRecord } from './data'
import { employeeSchema } from '../../features/employees/schemas/employee-schema'
import { examSchema } from '../../features/exams/schemas/exam-schema'
import { programSchema } from '../../features/programs/schemas/program-schema'
import { programContentSchema } from '../../features/programs/schemas/program-content-schema'
import { adminUserSchema } from '../../features/settings/schemas/admin-user-schema'
import { PLATFORM_SUPER_ADMIN_ROLE } from '../../features/platform-admin/types/access'
import { organizationSchema, type OrganizationFormValues } from '../../features/platform-admin/schemas/organization-schema'
import {
  ORGANIZATION_TRANSITIONS,
  OrganizationStatus,
  ORGANIZATION_SORT_FIELDS,
  type Organization,
  type OrganizationActivity,
  type OrganizationListItem,
} from '../../features/platform-admin/types/organization'
import { ORGANIZATION_ACTION_ACTIVITY, PLATFORM_ACTOR, platformOrganizationActivity, platformOrganizations } from './organization-data'

function filterRecords<T extends { name: string; status: string }>(
  records: T[],
  request: Request,
): T[] {
  const params = new URL(request.url).searchParams
  const search = params.get('search')?.toLowerCase() ?? ''
  const status = params.get('status') ?? ''
  return records.filter((record) =>
    Object.values(record).join(' ').toLowerCase().includes(search) && (!status || record.status === status),
  )
}

function toOrganizationListItem(organization: Organization): OrganizationListItem {
  return {
    id: organization.id,
    name: organization.name,
    logoUrl: organization.logoUrl,
    code: organization.code,
    industry: organization.industry,
    officialEmail: organization.officialEmail,
    contactPerson: organization.contactPerson,
    contactNumber: organization.contactNumber,
    companySize: organization.companySize,
    registeredAt: organization.registeredAt,
    subscriptionPlan: organization.subscriptionPlan,
    status: organization.status,
  }
}

function appendOrganizationActivity(organizationId: string, type: OrganizationActivity['type'], description: string, actor = PLATFORM_ACTOR) {
  platformOrganizationActivity.unshift({
    id: `oa-${Date.now()}-${platformOrganizationActivity.length}`,
    organizationId,
    organizationName: platformOrganizations.find((organization) => organization.id === organizationId)?.name,
    type,
    description,
    actor,
    createdAt: new Date().toISOString(),
  })
}

function makeOrganization(id: string, values: OrganizationFormValues, previous?: Organization): Organization {
  const now = new Date().toISOString()
  return {
    id,
    name: values.name,
    legalName: values.legalName,
    logoUrl: values.logoUrl || previous?.logoUrl || null,
    code: values.code,
    industry: values.industry,
    website: values.website,
    description: values.description,
    officialEmail: values.officialEmail,
    contactPerson: values.contactPerson,
    designation: values.designation,
    contactNumber: values.contactNumber,
    companySize: values.companySize,
    registeredAt: previous?.registeredAt ?? now,
    subscriptionPlan: values.subscriptionPlan,
    status: previous?.status ?? values.status,
    address: {
      addressLine: values.addressLine,
      city: values.city,
      state: values.state,
      country: values.country,
      postalCode: values.postalCode,
    },
    initialAdmin: {
      name: values.initialAdminName,
      email: values.initialAdminEmail,
      designation: values.initialAdminDesignation,
    },
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
    createdBy: previous?.createdBy ?? PLATFORM_ACTOR,
    updatedBy: PLATFORM_ACTOR,
  }
}

function filterOrganizations(request: Request) {
  const params = new URL(request.url).searchParams
  const search = params.get('search')?.trim().toLowerCase() ?? ''
  const status = params.get('status') ?? ''
  const industry = params.get('industry') ?? ''
  const registeredFrom = params.get('registeredFrom') ?? ''
  const registeredTo = params.get('registeredTo') ?? ''
  const sortBy = ORGANIZATION_SORT_FIELDS.find((field) => field === params.get('sortBy')) ?? 'registeredAt'
  const sortDirection = params.get('sortDirection') === 'asc' ? 1 : -1
  const filtered = platformOrganizations.filter((organization) => {
    const matchesSearch = !search || [organization.name, organization.code, organization.officialEmail].some((value) => value.toLowerCase().includes(search))
    const registeredDate = organization.registeredAt.slice(0, 10)
    return matchesSearch
      && (!status || organization.status === status)
      && (!industry || organization.industry === industry)
      && (!registeredFrom || registeredDate >= registeredFrom)
      && (!registeredTo || registeredDate <= registeredTo)
  })
  filtered.sort((left, right) => String(left[sortBy] ?? '').localeCompare(String(right[sortBy] ?? ''), undefined, { numeric: true, sensitivity: 'base' }) * sortDirection)
  const total = filtered.length
  const pageSize = Math.min(50, Math.max(1, Number(params.get('pageSize')) || 10))
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(pageCount, Math.max(1, Number(params.get('page')) || 1))
  return { data: filtered.slice((page - 1) * pageSize, page * pageSize).map(toOrganizationListItem), total, page, pageSize }
}

function makePlatformDashboard() {
  const statusDistribution = Object.values(OrganizationStatus).map((status) => ({
    status,
    count: platformOrganizations.filter((organization) => organization.status === status).length,
  }))
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 4 + index, 1))
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    const key = date.toISOString().slice(0, 7)
    return { month, organizations: platformOrganizations.filter((organization) => organization.registeredAt.startsWith(key)).length }
  })
  return {
    totalOrganizations: platformOrganizations.length,
    activeOrganizations: statusDistribution.find((entry) => entry.status === OrganizationStatus.Active)?.count ?? 0,
    pendingOrganizations: statusDistribution.find((entry) => entry.status === OrganizationStatus.Pending)?.count ?? 0,
    suspendedOrganizations: statusDistribution.find((entry) => entry.status === OrganizationStatus.Suspended)?.count ?? 0,
    approvedOrganizations: statusDistribution.find((entry) => entry.status === OrganizationStatus.Approved)?.count ?? 0,
    monthlyGrowth: months,
    statusDistribution,
    recentlyRegistered: [...platformOrganizations].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt)).slice(0, 6).map(toOrganizationListItem),
    recentActivity: [...platformOrganizationActivity].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
  }
}

function getTokenFromRequest(request: Request) {
  return request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? null
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const payload = await request.json() as { email?: string; password?: string }
    const email = String(payload.email ?? '').trim().toLowerCase()
    const password = String(payload.password ?? '')
    if (email === 'platform.admin@stackly.com' && password === 'Password123!') {
      return HttpResponse.json({ data: { token: 'mock-token', user: { id: 'platform-admin-001', displayName: 'Platform Super Admin', email, roles: [PLATFORM_SUPER_ADMIN_ROLE], status: 'ACTIVE', isEmailVerified: true } } }, { status: 200 })
    }
    if (email === 'demo@stackly.com' && password === 'Password123!') {
      return HttpResponse.json({ data: { token: 'mock-org-token', user: { id: 'org-admin-001', displayName: 'HR Administrator', email, roles: ['ORGANIZATION_ADMIN'], organizationId: 'org-1001', organizationName: 'Stackly Labs', status: 'ACTIVE', isEmailVerified: true } } }, { status: 200 })
    }
    return HttpResponse.json({ message: 'Your email or password is incorrect.' }, { status: 401 })
  }),
  http.post('/api/auth/logout', () => HttpResponse.json({ data: { success: true } })),
  http.get('/api/auth/me', ({ request }) => {
    const token = getTokenFromRequest(request)
    if (token === 'mock-token' || token === 'mock-org-token') {
      return HttpResponse.json({ data: token === 'mock-token'
        ? { id: 'platform-admin-001', displayName: 'Platform Super Admin', email: 'platform.admin@stackly.com', roles: [PLATFORM_SUPER_ADMIN_ROLE], status: 'ACTIVE', isEmailVerified: true }
        : { id: 'org-admin-001', displayName: 'HR Administrator', email: 'demo@stackly.com', roles: ['ORGANIZATION_ADMIN'], organizationId: 'org-1001', organizationName: 'Stackly Labs', status: 'ACTIVE', isEmailVerified: true } })
    }
    return HttpResponse.json({ message: 'Authentication required.' }, { status: 401 })
  }),
  http.post('/api/auth/forgot-password', async ({ request }) => {
    const payload = await request.json() as { email?: string }
    if (!payload.email) {
      return HttpResponse.json({ message: 'Enter a valid email address.' }, { status: 422 })
    }
    return HttpResponse.json({ data: { success: true } })
  }),
  http.post('/api/auth/reset-password', async ({ request }) => {
    const payload = await request.json() as { token?: string; password?: string; confirmPassword?: string }
    if (!payload.token || !payload.password || payload.password.length < 8 || payload.password !== payload.confirmPassword) {
      return HttpResponse.json({ message: 'The reset link is invalid or the password does not match.' }, { status: 422 })
    }
    return HttpResponse.json({ data: { success: true } })
  }),
  http.post('/api/auth/verify-email', async ({ request }) => {
    const payload = await request.json() as { token?: string }
    if (!payload.token) {
      return HttpResponse.json({ message: 'Verification token is invalid or expired.' }, { status: 401 })
    }
    return HttpResponse.json({ data: { success: true } })
  }),
  http.post('/api/auth/resend-verification', async ({ request }) => {
    const payload = await request.json() as { email?: string }
    if (!payload.email) {
      return HttpResponse.json({ message: 'Enter a valid email address.' }, { status: 422 })
    }
    return HttpResponse.json({ data: { success: true } })
  }),
  http.post('/api/auth/activate', async ({ request }) => {
    const payload = await request.json() as { token?: string; password?: string; confirmPassword?: string }
    if (!payload.token || !payload.password || payload.password.length < 8 || payload.password !== payload.confirmPassword) {
      return HttpResponse.json({ message: 'The activation link is invalid or the passwords do not match.' }, { status: 422 })
    }
    return HttpResponse.json({ data: { success: true } })
  }),
  http.post('/api/auth/register', async ({ request }) => {
    const payload = await request.json() as { name?: string; initialAdminEmail?: string; code?: string }
    if (!payload.name || !payload.initialAdminEmail || !payload.code) {
      return HttpResponse.json({ message: 'Complete the registration details to continue.' }, { status: 422 })
    }
    return HttpResponse.json({ data: { status: 'pending_approval', organizationName: payload.name, reference: `REG-${Date.now()}` } })
  }),
  http.get('/api/platform/dashboard', () => HttpResponse.json({ data: makePlatformDashboard() })),
  http.get('/api/platform/organizations', ({ request }) => HttpResponse.json(filterOrganizations(request))),
  http.post('/api/platform/organizations', async ({ request }) => {
    const parsed = organizationSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the organization details.' }, { status: 422 })
    if (platformOrganizations.some((organization) => organization.code.toLowerCase() === parsed.data.code.toLowerCase())) {
      return HttpResponse.json({ message: 'Organization code is already registered.' }, { status: 409 })
    }
    const organization = makeOrganization(`org-${Date.now()}`, parsed.data)
    platformOrganizations.unshift(organization)
    appendOrganizationActivity(organization.id, 'registered', 'Organization registered on the Stackly platform.', organization.initialAdmin.name)
    appendOrganizationActivity(organization.id, 'admin-provisioned', 'Initial organization administrator provisioned.')
    return HttpResponse.json({ data: organization }, { status: 201 })
  }),
  http.post('/api/platform/organizations/bulk-approve', async ({ request }) => {
    const parsed = z.object({ ids: z.array(z.string()).min(1).max(50) }).safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Select at least one organization.' }, { status: 422 })
    const targets = parsed.data.ids.map((id) => platformOrganizations.find((organization) => organization.id === id))
    if (targets.some((organization) => !organization || organization.status !== OrganizationStatus.Pending)) {
      return HttpResponse.json({ message: 'All selected organizations must be pending approval.' }, { status: 409 })
    }
    const approved = targets.filter((organization): organization is Organization => organization !== undefined)
    for (const organization of approved) {
      organization.status = OrganizationStatus.Approved
      organization.updatedAt = new Date().toISOString()
      organization.updatedBy = PLATFORM_ACTOR
      appendOrganizationActivity(organization.id, ORGANIZATION_ACTION_ACTIVITY.approve, 'Organization approved by platform administrator.')
    }
    return HttpResponse.json({ data: approved })
  }),
  http.get('/api/platform/organizations/:id/activity', ({ params }) => {
    if (!platformOrganizations.some((organization) => organization.id === params.id)) {
      return HttpResponse.json({ message: 'Organization not found.' }, { status: 404 })
    }
    const activity = platformOrganizationActivity.filter((entry) => entry.organizationId === params.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return HttpResponse.json({ data: activity })
  }),
  http.get('/api/platform/organizations/:id', ({ params }) => {
    const organization = platformOrganizations.find((item) => item.id === params.id)
    return organization
      ? HttpResponse.json({ data: organization })
      : HttpResponse.json({ message: 'Organization not found.' }, { status: 404 })
  }),
  http.put('/api/platform/organizations/:id', async ({ params, request }) => {
    const parsed = organizationSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the organization details.' }, { status: 422 })
    const organization = platformOrganizations.find((item) => item.id === params.id)
    if (!organization) return HttpResponse.json({ message: 'Organization not found.' }, { status: 404 })
    if (platformOrganizations.some((item) => item.id !== organization.id && item.code.toLowerCase() === parsed.data.code.toLowerCase())) {
      return HttpResponse.json({ message: 'Organization code is already registered.' }, { status: 409 })
    }
    if (parsed.data.status !== organization.status) {
      return HttpResponse.json({ message: 'Use an organization lifecycle action to change status.' }, { status: 409 })
    }
    Object.assign(organization, makeOrganization(organization.id, parsed.data, organization))
    appendOrganizationActivity(organization.id, 'updated', 'Organization information updated.')
    return HttpResponse.json({ data: organization })
  }),
  http.post('/api/platform/organizations/:id/lifecycle', async ({ params, request }) => {
    const actionSchema = z.enum(['approve', 'activate', 'suspend', 'reactivate'])
    const parsed = z.object({ action: actionSchema }).safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Choose a valid lifecycle action.' }, { status: 422 })
    const organization = platformOrganizations.find((item) => item.id === params.id)
    if (!organization) return HttpResponse.json({ message: 'Organization not found.' }, { status: 404 })
    const nextStatus = ORGANIZATION_TRANSITIONS[organization.status][parsed.data.action]
    if (!nextStatus) return HttpResponse.json({ message: `Cannot ${parsed.data.action} an organization in ${organization.status} status.` }, { status: 409 })
    organization.status = nextStatus
    organization.updatedAt = new Date().toISOString()
    organization.updatedBy = PLATFORM_ACTOR
    const activityType = ORGANIZATION_ACTION_ACTIVITY[parsed.data.action]
    appendOrganizationActivity(organization.id, activityType, `Organization ${activityType} by platform administrator.`)
    return HttpResponse.json({ data: organization })
  }),
  http.post('/api/settings/users', async ({ request }) => {
    const parsed = adminUserSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the user details.' }, { status: 422 })
    const user = { ...parsed.data, id: `u-${Date.now()}`, status: 'Active' as const }
    settingsConfiguration.users.unshift(user)
    return HttpResponse.json({ data: user }, { status: 201 })
  }),
  http.patch('/api/settings/users/:id', async ({ params, request }) => {
    const parsed = adminUserSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the user details.' }, { status: 422 })
    const user = settingsConfiguration.users.find((item) => item.id === params.id)
    if (!user) return HttpResponse.json({ message: 'User not found.' }, { status: 404 })
    Object.assign(user, parsed.data)
    return HttpResponse.json({ data: user })
  }),
  http.get('/api/settings', () => HttpResponse.json({ data: settingsConfiguration })),
  http.patch('/api/settings/:section', async ({ params, request }) => {
    const scalar = z.union([z.string(), z.number(), z.boolean()])
    const parsed = z.object({ values: z.record(z.string(), scalar) }).safeParse(await request.json())
    const section = settingsConfiguration.sections[params.section as keyof typeof settingsConfiguration.sections]
    if (!parsed.success || !section) return HttpResponse.json({ message: 'Settings section is invalid.' }, { status: 422 })
    section.fields = section.fields.map((field) => ({ ...field, value: parsed.data.values[field.id] ?? field.value }))
    return HttpResponse.json({ data: section })
  }),
  http.get('/api/reports', () => HttpResponse.json({ data: reportDefinitions })),
  http.get('/api/reports/training-completion', ({ request }) => {
    const params = new URL(request.url).searchParams
    const program = params.get('program')
    const department = params.get('department')
    const rows = trainingCompletion.programs.filter((item) => (!program || item.program === program) && (!department || item.department === department))
    return HttpResponse.json({ data: { ...trainingCompletion, programs: rows } })
  }),
  http.get('/api/training/workspace', () => HttpResponse.json({ data: {
    assignments: pendingAssignments,
    activities: trainingActivities,
    skillGaps,
    learningPlans,
  } })),
  http.patch('/api/training/workspace/:kind/:id', async ({ params, request }) => {
    const parsed = z.object({ status: z.string().min(1) }).safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'A valid status is required.' }, { status: 422 })
    const collections = {
      assignment: pendingAssignments,
      activity: trainingActivities,
      'skill-gap': skillGaps,
    }
    const collection = collections[params.kind as keyof typeof collections]
    const item = collection?.find((record) => record.id === params.id)
    if (!item) return HttpResponse.json({ message: 'Training item not found.' }, { status: 404 })
    Object.assign(item, parsed.data)
    return HttpResponse.json({ data: item })
  }),
  http.post('/api/learning-plans', async ({ request }) => {
    const parsed = z.object({ name: z.string().trim().min(2), description: z.string().trim().min(5) }).safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the learning plan details.' }, { status: 422 })
    const plan = { ...parsed.data, id: `lp-${Date.now()}`, programs: 0, employees: 0, status: 'Draft' as const }
    learningPlans.unshift(plan)
    return HttpResponse.json({ data: plan }, { status: 201 })
  }),
  http.get('/api/training/programs', ({ request }) =>
    HttpResponse.json({ data: filterRecords(programs, request).filter((program) => !new URL(request.url).searchParams.get('department') || program.department === new URL(request.url).searchParams.get('department')), total: programs.length }),
  ),
  http.post('/api/training/programs', async ({ request }) => {
    const parsed = programSchema.safeParse(await request.json())
    if (!parsed.success) {
      return HttpResponse.json({ message: 'Program name and code are required.' }, { status: 422 })
    }
    const body = parsed.data
    const created: ProgramRecord = {
      id: `p-${Date.now()}`,
      name: body.name,
      code: body.code,
      category: body.category ?? 'Technical',
      trainer: body.trainer ?? 'Unassigned',
      enrolled: 0,
      completion: 0,
      status: 'Draft',
      department: body.department ?? 'Engineering',
      startDate: body.startDate ?? '01 Oct 2026',
      description: body.description,
      skillLevel: body.skillLevel,
      duration: body.duration,
      mode: body.mode,
      prerequisites: body.prerequisites,
    }
    programs.unshift(created)
    return HttpResponse.json({ data: created }, { status: 201 })
  }),
  http.get('/api/training/programs/:id/content', ({ params }) => {
    const program = programs.find((item) => item.id === params.id)
    if (!program) return HttpResponse.json({ message: 'Program not found.' }, { status: 404 })
    return HttpResponse.json({ data: programContents })
  }),
  http.post('/api/training/programs/:id/content', async ({ params, request }) => {
    const parsed = programContentSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the content details.' }, { status: 422 })
    if (!programs.some((item) => item.id === params.id)) return HttpResponse.json({ message: 'Program not found.' }, { status: 404 })
    const modules = programContents.filter((item) => item.type === 'Module')
    const moduleId = parsed.data.type === 'Module' ? `module-${Date.now()}` : parsed.data.moduleId ?? modules[0]?.moduleId ?? 'module-1'
    const created = { id: `c-${Date.now()}`, moduleId, required: true, ...parsed.data }
    programContents.push(created)
    return HttpResponse.json({ data: created }, { status: 201 })
  }),
  http.patch('/api/training/programs/:id', async ({ params, request }) => {
    const program = programs.find((item) => item.id === params.id)
    if (!program) return HttpResponse.json({ message: 'Program not found.' }, { status: 404 })
    Object.assign(program, await request.json())
    return HttpResponse.json({ data: program })
  }),
  http.delete('/api/training/programs/:id', ({ params }) => {
    const index = programs.findIndex((item) => item.id === params.id)
    if (index < 0) return HttpResponse.json({ message: 'Program not found.' }, { status: 404 })
    programs.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
  http.get('/api/employees', ({ request }) =>
    HttpResponse.json({ data: filterRecords(employees, request), total: employees.length }),
  ),
  http.get('/api/employees/:id', ({ params }) => {
    const employee = employees.find((item) => item.id === params.id)
    return employee
      ? HttpResponse.json({ data: employee })
      : HttpResponse.json({ message: 'Employee not found.' }, { status: 404 })
  }),
  http.post('/api/employees', async ({ request }) => {
    const parsed = employeeSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the employee details.' }, { status: 422 })
    const employee = { ...parsed.data, id: `EMP${String(employees.length + 1).padStart(3, '0')}`, programs: 0, completion: 0, status: 'Active' as const }
    employees.unshift(employee)
    return HttpResponse.json({ data: employee }, { status: 201 })
  }),
  http.get('/api/exams', ({ request }) =>
    HttpResponse.json({ data: filterRecords(exams, request), total: exams.length }),
  ),
  http.post('/api/exams', async ({ request }) => {
    const parsed = examSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Check the examination details.' }, { status: 422 })
    const exam = { ...parsed.data, id: `e-${Date.now()}`, candidates: 0, averageScore: null, status: 'Scheduled' as const }
    exams.unshift(exam)
    return HttpResponse.json({ data: exam }, { status: 201 })
  }),
  http.get('/api/exams/:id/results', ({ params }) => {
    const exam = exams.find((item) => item.id === params.id)
    if (!exam) return HttpResponse.json({ message: 'Examination not found.' }, { status: 404 })
    return HttpResponse.json({ data: {
      exam: exam.name,
      totalCandidates: 80,
      completed: 72,
      passed: 62,
      failed: 12,
      averageScore: 82,
      results: [
        { id: 'EMP001', name: 'Arun Kumar', email: 'arun@company.com', score: 82, status: 'Passed' },
        { id: 'EMP002', name: 'Priya S', email: 'priya@company.com', score: 98, status: 'Passed' },
        { id: 'EMP003', name: 'Kumar R', email: 'kumar@company.com', score: 48, status: 'Failed' },
        { id: 'EMP004', name: 'Sneha V', email: 'sneha@company.com', score: 76, status: 'Passed' },
        { id: 'EMP005', name: 'Vishnu P', email: 'vishnu@company.com', score: 64, status: 'Passed' },
      ],
    } })
  }),
  http.get('/api/dashboard/summary', () =>
    HttpResponse.json({ data: { activePrograms: 32, pendingAssignments: 24, employeesToday: 86, skillGaps: 8, totalEnrolled: 2480, completionRate: 76, completed: 245, inProgress: 117, notStarted: 24 } }),
  ),
  http.get('/api/dashboard/activity', () => HttpResponse.json({ data: dashboardActivity })),
]