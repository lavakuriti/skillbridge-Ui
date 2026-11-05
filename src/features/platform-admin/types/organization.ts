export const OrganizationStatus = {
    Pending: 'Pending',
    Approved: 'Approved',
    Active: 'Active',
    Suspended: 'Suspended',
} as const

export type OrganizationStatus = typeof OrganizationStatus[keyof typeof OrganizationStatus]

export const OrganizationLifecycleAction = {
    Approve: 'approve',
    Activate: 'activate',
    Suspend: 'suspend',
    Reactivate: 'reactivate',
} as const

export type OrganizationLifecycleAction = typeof OrganizationLifecycleAction[keyof typeof OrganizationLifecycleAction]

export const ORGANIZATION_INDUSTRIES = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Professional Services',
] as const

export const ORGANIZATION_SIZES = ['1-50', '51-200', '201-500', '501-1000', '1000+'] as const
export const ORGANIZATION_PLANS = ['Starter', 'Growth', 'Enterprise'] as const

export interface OrganizationAddress {
    addressLine: string
    city: string
    state: string
    country: string
    postalCode: string
}

export interface InitialOrganizationAdmin {
    name: string
    email: string
    designation: string
}

export interface OrganizationListItem {
    id: string
    name: string
    logoUrl: string | null
    code: string
    industry: string
    officialEmail: string
    contactPerson: string
    contactNumber: string
    companySize: string
    registeredAt: string
    subscriptionPlan: string
    status: OrganizationStatus
}

export const ORGANIZATION_SORT_FIELDS = [
    'name', 'code', 'industry', 'officialEmail', 'contactPerson', 'contactNumber', 'companySize', 'registeredAt', 'subscriptionPlan', 'status',
] as const satisfies readonly (keyof OrganizationListItem)[]

export type OrganizationSortField = typeof ORGANIZATION_SORT_FIELDS[number]

export interface Organization extends OrganizationListItem {
    legalName: string
    website: string
    description: string
    designation: string
    address: OrganizationAddress
    initialAdmin: InitialOrganizationAdmin
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
}

export interface OrganizationActivity {
    id: string
    organizationId: string
    organizationName?: string
    type: 'registered' | 'approved' | 'updated' | 'activated' | 'suspended' | 'reactivated' | 'admin-provisioned'
    description: string
    actor: string
    createdAt: string
}

export interface OrganizationFilters {
    page: number
    pageSize: number
    search: string
    status: OrganizationStatus | ''
    industry: string
    registeredFrom: string
    registeredTo: string
    sortBy: OrganizationSortField
    sortDirection: 'asc' | 'desc'
}

export interface OrganizationPageResult {
    data: OrganizationListItem[]
    total: number
    page: number
    pageSize: number
}

export interface OrganizationDashboard {
    totalOrganizations: number
    activeOrganizations: number
    pendingOrganizations: number
    suspendedOrganizations: number
    approvedOrganizations: number
    monthlyGrowth: { month: string; organizations: number }[]
    statusDistribution: { status: OrganizationStatus; count: number }[]
    recentlyRegistered: OrganizationListItem[]
    recentActivity: OrganizationActivity[]
}

export type OrganizationTransitionMap = {
    [Status in OrganizationStatus]: Partial<Record<OrganizationLifecycleAction, OrganizationStatus>>
}

export const ORGANIZATION_TRANSITIONS: OrganizationTransitionMap = {
    [OrganizationStatus.Pending]: { [OrganizationLifecycleAction.Approve]: OrganizationStatus.Approved },
    [OrganizationStatus.Approved]: { [OrganizationLifecycleAction.Activate]: OrganizationStatus.Active },
    [OrganizationStatus.Active]: { [OrganizationLifecycleAction.Suspend]: OrganizationStatus.Suspended },
    [OrganizationStatus.Suspended]: { [OrganizationLifecycleAction.Reactivate]: OrganizationStatus.Active },
}

export const ORGANIZATION_ACTIONS = Object.values(OrganizationLifecycleAction)

export function getAvailableOrganizationActions(status: OrganizationStatus): OrganizationLifecycleAction[] {
    return ORGANIZATION_ACTIONS.filter((action) => ORGANIZATION_TRANSITIONS[status][action] !== undefined)
}