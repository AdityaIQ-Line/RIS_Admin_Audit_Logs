import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

/**
 * STANDARDIZED WORKLIST TABLE
 * 
 * This is the single source of truth for ALL data tables across the product.
 * Based on the QC Technician Worklist design (Figma screenshot).
 * 
 * DESIGN PRINCIPLES:
 * - Full-width responsive table
 * - Sticky header when scrolling vertically
 * - Light divider lines between rows (no heavy borders)
 * - Consistent row height and padding
 * - Horizontal scroll enabled for overflow
 * - Clean, minimal styling
 * 
 * TABLE STYLING:
 * - Rounded border on container
 * - White background
 * - Border thickness: 1px
 * - Header: slightly thicker bottom border for definition
 * - Row hover state for interactivity
 * 
 * CONTENT ALIGNMENT:
 * - IDs and codes: left-aligned
 * - Numeric values: center-aligned (handled by cell content)
 * - Status/priority badges: center-aligned (handled by cell content)
 */

export interface WorklistTableProps {
  children: React.ReactNode
  emptyMessage?: string
  emptyColSpan?: number
}

export function WorklistTable({ 
  children,
  emptyMessage = "No records found",
  emptyColSpan = 10,
}: WorklistTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto bg-white">
      <Table>
        {children}
      </Table>
    </div>
  )
}

/**
 * Standardized Table Header
 * - Uses thicker bottom border (border-b-4) for visual separation
 */
export function WorklistTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <TableHeader className="[&_tr]:border-b-4">
      {children}
    </TableHeader>
  )
}

/**
 * Standardized Table Row
 * - Supports optional highlight for critical items
 * - Hover state for interactivity
 */
export interface WorklistTableRowProps {
  children: React.ReactNode
  isCritical?: boolean
  onClick?: () => void
}

export function WorklistTableRow({ children, isCritical, onClick }: WorklistTableRowProps) {
  return (
    <TableRow 
      className={`${isCritical ? 'bg-red-50 dark:bg-red-950/10' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </TableRow>
  )
}

/**
 * Empty State Row
 * - Displayed when no data matches filters
 */
export interface EmptyStateRowProps {
  message?: string
  colSpan: number
}

export function EmptyStateRow({ message = "No records found", colSpan }: EmptyStateRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  )
}