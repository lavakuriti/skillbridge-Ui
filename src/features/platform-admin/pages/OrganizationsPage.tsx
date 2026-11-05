import { useState } from 'react'
import { Building2, Columns3, Plus, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button, PageHeading, Panel, StatusBadge } from '../../../components/shared/ui'
import { DataTable, type DataColumn, type RemotePagination, type RemoteSorting } from '../../../components/shared/DataTable'
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog'
import { useBulkApproveOrganizations, useOrganizations } from '../hooks/use-platform-data'
import { ORGANIZATION_INDUSTRIES, ORGANIZATION_SORT_FIELDS, OrganizationStatus, type OrganizationFilters, type OrganizationListItem, type OrganizationSortField } from '../types/organization'

const getOrganizationRowId = (organization: OrganizationListItem) => organization.id

const allColumns: DataColumn<OrganizationListItem>[] = [
    { id: 'name', header: 'Organization', accessor: (organization) => organization.name, cell: (organization) => <Link className="organization-name-cell" to={`/platform/organizations/${organization.id}`}><OrganizationAvatar organization={organization} /><span><strong>{organization.name}</strong><small>{organization.code}</small></span></Link> },
    { id: 'industry', header: 'Industry', accessor: (organization) => organization.industry },
    { id: 'officialEmail', header: 'Business Email', accessor: (organization) => organization.officialEmail },
    { id: 'contactPerson', header: 'Contact Person', accessor: (organization) => organization.contactPerson },
    { id: 'contactNumber', header: 'Contact Number', accessor: (organization) => organization.contactNumber },
    { id: 'companySize', header: 'Organization Size', accessor: (organization) => organization.companySize },
    { id: 'registeredAt', header: 'Registered', accessor: (organization) => organization.registeredAt, cell: (organization) => format(new Date(organization.registeredAt), 'dd MMM yyyy') },
    { id: 'subscriptionPlan', header: 'Plan', accessor: (organization) => organization.subscriptionPlan },
    { id: 'status', header: 'Status', accessor: (organization) => organization.status, cell: (organization) => <StatusBadge>{organization.status}</StatusBadge> },
    { id: 'actions', header: 'Actions', accessor: (organization) => organization.name, sortable: false, cell: (organization) => <Link className="row-link" to={`/platform/organizations/${organization.id}`}>View details</Link> },
]

export function OrganizationsPage() {
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') ?? '')
    const [status, setStatus] = useState<OrganizationFilters['status']>(() => Object.values(OrganizationStatus).find((value) => value === searchParams.get('status')) ?? '')
    const [industry, setIndustry] = useState(() => ORGANIZATION_INDUSTRIES.find((value) => value === searchParams.get('industry')) ?? '')
    const [registeredFrom, setRegisteredFrom] = useState('')
    const [registeredTo, setRegisteredTo] = useState('')
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState<OrganizationSortField>('registeredAt')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const [selectedOrganizations, setSelectedOrganizations] = useState<OrganizationListItem[]>([])
    const [columnMenuOpen, setColumnMenuOpen] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(() => new Set(allColumns.map((column) => column.id)))
    const [confirmBulkApprove, setConfirmBulkApprove] = useState(false)
    const bulkApprove = useBulkApproveOrganizations()
    const filters: OrganizationFilters = { page, pageSize: 10, search, status, industry, registeredFrom, registeredTo, sortBy, sortDirection }
    const organizations = useOrganizations(filters)
    const rows = organizations.data?.data ?? []
    const columns = allColumns.filter((column) => visibleColumns.has(column.id))
    const pendingSelection = selectedOrganizations.length > 0 && selectedOrganizations.every((organization) => organization.status === OrganizationStatus.Pending)
    const remotePagination: RemotePagination = {
        pageIndex: page - 1,
        pageSize: organizations.data?.pageSize ?? 10,
        totalRows: organizations.data?.total ?? 0,
        onPageChange: (pageIndex) => setPage(pageIndex + 1),
    }
    const remoteSorting: RemoteSorting = {
        columnId: sortBy,
        descending: sortDirection === 'desc',
        onSortChange: (columnId, descending) => {
            const field = ORGANIZATION_SORT_FIELDS.find((candidate) => candidate === columnId)
            if (!field) return
            setSortBy(field)
            setSortDirection(descending ? 'desc' : 'asc')
            setPage(1)
        },
    }

    async function approveSelected() {
        try {
            await bulkApprove.mutateAsync(selectedOrganizations.map((organization) => organization.id))
            toast.success(`${selectedOrganizations.length} organizations approved.`)
            setSelectedOrganizations([])
            setConfirmBulkApprove(false)
        } catch {
            toast.error('Selected organizations could not be approved.')
        }
    }

    function updateVisibleColumn(id: string) {
        setVisibleColumns((current) => {
            const next = new Set(current)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <div className="page-content">
            <PageHeading eyebrow="Platform Administration" title="Organizations" description="Search, review, and manage enterprises registered on the Stackly platform." action={<Link className="button button-primary" to="/platform/organizations/new"><Plus size={15} /> Register Organization</Link>} />
            <Panel className="organization-list-panel">
                <div className="organization-toolbar">
                    <label className="table-search"><Search size={15} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search name, code, or business email..." aria-label="Search organizations" /></label>
                    <label className="filter-select"><span className="sr-only">Filter status</span><select value={status} onChange={(event) => { setStatus(event.target.value as OrganizationFilters['status']); setPage(1) }}><option value="">All statuses</option><option value={OrganizationStatus.Pending}>Pending</option><option value={OrganizationStatus.Approved}>Approved</option><option value={OrganizationStatus.Active}>Active</option><option value={OrganizationStatus.Suspended}>Suspended</option></select></label>
                    <label className="filter-select"><span className="sr-only">Filter industry</span><select value={industry} onChange={(event) => { setIndustry(event.target.value); setPage(1) }}><option value="">All industries</option>{ORGANIZATION_INDUSTRIES.map((option) => <option key={option}>{option}</option>)}</select></label>
                    <label className="date-filter"><span>Registered from</span><input type="date" value={registeredFrom} onChange={(event) => { setRegisteredFrom(event.target.value); setPage(1) }} /></label>
                    <label className="date-filter"><span>To</span><input type="date" value={registeredTo} onChange={(event) => { setRegisteredTo(event.target.value); setPage(1) }} /></label>
                    <div className="column-control-wrap"><Button variant="outline" onClick={() => setColumnMenuOpen(!columnMenuOpen)} aria-expanded={columnMenuOpen}><Columns3 size={14} /> Columns</Button>{columnMenuOpen && <div className="column-menu" role="group" aria-label="Visible organization columns">{allColumns.filter((column) => column.id !== 'actions').map((column) => <label key={column.id}><input type="checkbox" checked={visibleColumns.has(column.id)} onChange={() => updateVisibleColumn(column.id)} />{column.header}</label>)}</div>}</div>
                </div>
                <div className="bulk-toolbar">{pendingSelection ? <Button variant="outline" onClick={() => setConfirmBulkApprove(true)} disabled={bulkApprove.isPending}><Building2 size={14} /> Approve {selectedOrganizations.length} selected</Button> : <span>{organizations.data?.total ?? 0} organizations</span>}</div>
                {organizations.isLoading ? <div className="table-state">Loading organizations...</div> : organizations.isError ? <div className="table-state" role="alert">Organizations could not be loaded. <Button variant="outline" onClick={() => void organizations.refetch()}>Retry</Button></div> : (
                    <div className="table-inset"><DataTable columns={columns} data={rows} pageSize={10} selectable getRowId={getOrganizationRowId} onSelectionChange={setSelectedOrganizations} remotePagination={remotePagination} remoteSorting={remoteSorting} emptyMessage="No organizations match these filters." /></div>
                )}
            </Panel>
            <ConfirmDialog open={confirmBulkApprove} title="Approve selected organizations?" description={`This will approve ${selectedOrganizations.length} pending organizations. They can then be activated separately.`} confirmLabel="Approve Organizations" pending={bulkApprove.isPending} onCancel={() => setConfirmBulkApprove(false)} onConfirm={() => void approveSelected()} />
        </div>
    )
}

function OrganizationAvatar({ organization }: { organization: OrganizationListItem }) {
    if (organization.logoUrl) return <img className="organization-avatar" src={organization.logoUrl} alt={`${organization.name} logo`} />
    return <span className="organization-avatar" aria-hidden="true">{organization.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>
}