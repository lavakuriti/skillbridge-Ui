import {
    OrganizationLifecycleAction,
    OrganizationStatus,
    type Organization,
    type OrganizationActivity,
} from '../../features/platform-admin/types/organization'

const organizationNames = [
    'Northstar Digital', 'Evergreen Health Group', 'Meridian Financial', 'Brightpath Learning',
    'Redwood Manufacturing', 'Bluebird Retail Co', 'Summit Professional Services', 'Cedarline Systems',
    'Harborview Medical', 'Pioneer Capital', 'Westbridge Academy', 'Ironclad Industries',
    'Juniper Commerce', 'Atlas Consulting', 'Clearwater Technologies', 'Oakwell Clinics',
    'Silverline Banking', 'Horizon Skills Institute', 'Granite Works', 'Cloudberry Stores',
    'Maple Leaf Software', 'Beacon Health Partners', 'Stonegate Finance', 'Aspire Education',
    'Copperfield Manufacturing', 'Willow Creek Retail', 'Vantage Legal Group', 'Lighthouse Analytics',
]

const statusSequence = [
    OrganizationStatus.Active,
    OrganizationStatus.Pending,
    OrganizationStatus.Active,
    OrganizationStatus.Suspended,
    OrganizationStatus.Approved,
    OrganizationStatus.Active,
    OrganizationStatus.Active,
] as const

const planNames = ['Starter', 'Growth', 'Enterprise'] as const
const industryNames = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Professional Services'] as const

function dateOffset(daysAgo: number) {
    return new Date(Date.UTC(2026, 9, 1 - daysAgo, 10)).toISOString()
}

export const platformOrganizations: Organization[] = organizationNames.map((name, index) => {
    const id = `org-${String(index + 1).padStart(4, '0')}`
    const registeredAt = dateOffset(index * 9)
    const contactPerson = ['Avery Chen', 'Morgan Patel', 'Jordan Rivera', 'Taylor Brooks'][index % 4]
    return {
        id,
        name,
        legalName: `${name} ${index % 2 ? 'Limited' : 'Inc.'}`,
        logoUrl: null,
        code: `ORG-${String(index + 1).padStart(4, '0')}`,
        industry: industryNames[index % industryNames.length],
        website: `https://${name.toLowerCase().replaceAll(' ', '')}.example.com`,
        description: `${name} uses Stackly to manage workforce learning and development.`,
        officialEmail: `people@${name.toLowerCase().replaceAll(' ', '')}.example.com`,
        contactPerson,
        designation: ['Chief People Officer', 'HR Director', 'Operations Lead', 'Talent Manager'][index % 4],
        contactNumber: `+1 415 555 ${String(1200 + index).slice(-4)}`,
        companySize: ['51-200', '201-500', '501-1000', '1000+'][index % 4],
        registeredAt,
        subscriptionPlan: planNames[index % planNames.length],
        status: statusSequence[index % statusSequence.length],
        address: {
            addressLine: `${100 + index * 7} Market Street`,
            city: ['San Francisco', 'Austin', 'Toronto', 'London'][index % 4],
            state: ['California', 'Texas', 'Ontario', 'Greater London'][index % 4],
            country: ['United States', 'United States', 'Canada', 'United Kingdom'][index % 4],
            postalCode: `941${String(index).padStart(2, '0')}`,
        },
        initialAdmin: {
            name: contactPerson,
            email: `admin@${name.toLowerCase().replaceAll(' ', '')}.example.com`,
            designation: 'HR Administrator',
        },
        createdAt: registeredAt,
        updatedAt: registeredAt,
        createdBy: 'Platform Super Admin',
        updatedBy: 'Platform Super Admin',
    }
})

export const platformOrganizationActivity: OrganizationActivity[] = platformOrganizations.flatMap((organization, index) => {
    const registration: OrganizationActivity = {
        id: `${organization.id}-registered`,
        organizationId: organization.id,
        organizationName: organization.name,
        type: 'registered',
        description: 'Organization registered on the Stackly platform.',
        actor: organization.initialAdmin.name,
        createdAt: organization.registeredAt,
    }
    const provisioning: OrganizationActivity = {
        id: `${organization.id}-admin`,
        organizationId: organization.id,
        organizationName: organization.name,
        type: 'admin-provisioned',
        description: 'Initial organization administrator provisioned.',
        actor: 'Platform Super Admin',
        createdAt: dateOffset(Math.max(0, index * 9 - 1)),
    }
    return [registration, provisioning]
})

export const PLATFORM_ACTOR = 'Platform Super Admin'

export const ORGANIZATION_ACTION_ACTIVITY: Record<OrganizationLifecycleAction, OrganizationActivity['type']> = {
    [OrganizationLifecycleAction.Approve]: 'approved',
    [OrganizationLifecycleAction.Activate]: 'activated',
    [OrganizationLifecycleAction.Suspend]: 'suspended',
    [OrganizationLifecycleAction.Reactivate]: 'reactivated',
}