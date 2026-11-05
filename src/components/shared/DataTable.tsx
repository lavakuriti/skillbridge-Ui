import { flexRender, type RowData } from '@tanstack/react-table'
import {
    getPaginationRowModel,
    getSortedRowModel,
    useLegacyTable,
    type LegacyColumnDef,
} from '@tanstack/react-table/legacy'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'

export type TableValue = string | number

export interface DataColumn<TData extends RowData> {
    id: string
    header: string
    accessor: (row: TData) => TableValue
    cell?: (row: TData) => ReactNode
    sortable?: boolean
}

export interface RemotePagination {
    pageIndex: number
    pageSize: number
    totalRows: number
    onPageChange: (pageIndex: number) => void
}

export interface RemoteSorting {
    columnId: string
    descending: boolean
    onSortChange: (columnId: string, descending: boolean) => void
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    pageSize = 10,
    emptyMessage = 'No results found.',
    selectable = false,
    remotePagination,
    remoteSorting,
    onSelectionChange,
    getRowId,
}: {
    columns: DataColumn<TData>[]
    data: TData[]
    pageSize?: number
    emptyMessage?: string
    selectable?: boolean
    remotePagination?: RemotePagination
    remoteSorting?: RemoteSorting
    onSelectionChange?: (rows: TData[]) => void
    getRowId?: (row: TData) => string
}) {
    const tableColumns: LegacyColumnDef<TData, unknown>[] = columns.map((column) => ({
        id: column.id,
        header: column.header,
        accessorFn: (row: TData): unknown => column.accessor(row),
        enableSorting: column.sortable !== false,
        cell: (context) => column.cell?.(context.row.original) ?? String(context.getValue() ?? ''),
    }))
    const table = useLegacyTable({
        data,
        columns: tableColumns,
        getRowId,
        enableRowSelection: selectable,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: Boolean(remotePagination),
        manualSorting: Boolean(remoteSorting),
        pageCount: remotePagination ? Math.ceil(remotePagination.totalRows / remotePagination.pageSize) : undefined,
        initialState: { sorting: [], rowSelection: {}, pagination: { pageIndex: remotePagination?.pageIndex ?? 0, pageSize: remotePagination?.pageSize ?? pageSize } },
    })
    const tablePagination = table.getState().pagination
    const pageIndex = remotePagination?.pageIndex ?? tablePagination.pageIndex
    const currentPageSize = remotePagination?.pageSize ?? tablePagination.pageSize
    const rowTotal = remotePagination?.totalRows ?? data.length
    const rowSelection = table.getState().rowSelection
    const start = rowTotal ? pageIndex * currentPageSize + 1 : 0
    const end = Math.min((pageIndex + 1) * currentPageSize, rowTotal)
    const selectedRows = useMemo(
        () => data.filter((row, index) => Boolean(rowSelection[getRowId?.(row) ?? String(index)])),
        [data, getRowId, rowSelection],
    )
    const pageSelectionKey = `${data.map((row, index) => getRowId?.(row) ?? String(index)).join(',')}|${selectedRows.map((row, index) => getRowId?.(row) ?? String(index)).join(',')}`
    const lastSelectionKey = useRef<string | null>(null)

    useEffect(() => {
        if (lastSelectionKey.current === pageSelectionKey) return
        lastSelectionKey.current = pageSelectionKey
        onSelectionChange?.(selectedRows)
    }, [onSelectionChange, pageSelectionKey, selectedRows])

    return (
        <div className="data-table-component">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        {table.getHeaderGroups().map((group) => (
                            <tr key={group.id}>
                                {selectable && <th><input type="checkbox" aria-label="Select all rows on this page" checked={table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} /></th>}
                                {group.headers.map((header) => (
                                    <th key={header.id} aria-sort={remoteSorting?.columnId === header.column.id ? remoteSorting.descending ? 'descending' : 'ascending' : header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}>
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <button className="table-sort" onClick={remoteSorting
                                                ? () => remoteSorting.onSortChange(header.column.id, remoteSorting.columnId === header.column.id ? !remoteSorting.descending : false)
                                                : header.column.getToggleSortingHandler()}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <span aria-hidden="true">{remoteSorting?.columnId === header.column.id ? remoteSorting.descending ? ' ↓' : ' ↑' : header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}</span>
                                            </button>
                                        ) : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                            <tr key={row.id} data-selected={row.getIsSelected() || undefined}>
                                {selectable && <td><input type="checkbox" aria-label={`Select row ${row.id}`} checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} /></td>}
                                {row.getVisibleCells().map((cell) => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                            </tr>
                        )) : <tr><td className="table-empty" colSpan={columns.length + (selectable ? 1 : 0)}>{emptyMessage}</td></tr>}
                    </tbody>
                </table>
            </div>
            <div className="table-pagination">
                <span>Showing {start}-{end} of {rowTotal}</span>
                <div>
                    <button onClick={() => remotePagination ? remotePagination.onPageChange(pageIndex - 1) : table.previousPage()} disabled={remotePagination ? pageIndex === 0 : !table.getCanPreviousPage()}>Previous</button>
                    <span className="page-number">{pageIndex + 1}</span>
                    <button onClick={() => remotePagination ? remotePagination.onPageChange(pageIndex + 1) : table.nextPage()} disabled={remotePagination ? end >= rowTotal : !table.getCanNextPage()}>Next</button>
                </div>
            </div>
        </div>
    )
}