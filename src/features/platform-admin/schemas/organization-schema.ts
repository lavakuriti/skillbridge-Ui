import { z } from 'zod'
import { ORGANIZATION_INDUSTRIES, ORGANIZATION_PLANS, ORGANIZATION_SIZES, OrganizationStatus } from '../types/organization'

const requiredText = (message: string) => z.string().trim().min(2, message)

export const organizationSchema = z.object({
    name: requiredText('Enter the organization name.'),
    legalName: requiredText('Enter the legal business name.'),
    code: z.string().trim().min(3, 'Enter an organization code.').regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers, or hyphens.'),
    logoUrl: z.string().trim().url('Enter a valid logo URL.').or(z.literal('')),
    industry: z.enum(ORGANIZATION_INDUSTRIES),
    website: z.string().trim().url('Enter a valid website URL.').or(z.literal('')),
    companySize: z.enum(ORGANIZATION_SIZES),
    description: z.string().trim().max(500, 'Description must be 500 characters or fewer.'),
    officialEmail: z.string().trim().email('Enter a valid business email.'),
    contactNumber: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid contact number.'),
    contactPerson: requiredText('Enter a contact person.'),
    designation: requiredText('Enter a designation.'),
    addressLine: requiredText('Enter a registered address.'),
    city: requiredText('Enter a city.'),
    state: requiredText('Enter a state or province.'),
    country: requiredText('Enter a country.'),
    postalCode: z.string().trim().min(3, 'Enter a postal code.'),
        status: z.enum([OrganizationStatus.Pending, OrganizationStatus.Approved, OrganizationStatus.Active, OrganizationStatus.Suspended]),
    subscriptionPlan: z.enum(ORGANIZATION_PLANS),
    initialAdminName: requiredText('Enter the initial administrator name.'),
    initialAdminEmail: z.string().trim().email('Enter a valid administrator email.'),
    initialAdminDesignation: requiredText('Enter the administrator designation.'),
})

export type OrganizationFormValues = z.infer<typeof organizationSchema>