import React from "react"
import { TableCell } from "../ui/table"
import { AlertCircle } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"

/**
 * STANDARDIZED TABLE CELL COMPONENTS
 * 
 * Reusable cell components with consistent styling for common data types.
 * Based on the QC Technician Worklist design (Figma screenshot).
 * 
 * CELL TYPES:
 * - UHID Cell: Monospace font for IDs
 * - Patient Name Cell: Bold font, supports critical indicator
 * - Age Cell: Compact format (e.g., "45Y")
 * - Study Description Cell: Primary + secondary text (accession number)
 * - Clinical History Cell: Truncated with ellipsis, tooltip on hover
 * - DateTime Cell: Consistent date/time formatting
 */

/**
 * UHID / ID Cell
 * - Left-aligned
 * - Monospace font for readability
 */
interface UHIDCellProps {
  uhid: string
}

export function UHIDCell({ uhid }: UHIDCellProps) {
  return (
    <TableCell className="font-mono text-sm">
      {uhid}
    </TableCell>
  )
}

/**
 * Patient Name Cell
 * - Bold font weight
 * - Optional critical indicator icon
 */
interface PatientNameCellProps {
  name: string
  isCritical?: boolean
}

export function PatientNameCell({ name, isCritical }: PatientNameCellProps) {
  return (
    <TableCell>
      <div className="flex items-center gap-2">
        {isCritical && (
          <AlertCircle 
            className="h-4 w-4 text-red-500 flex-shrink-0" 
            strokeWidth={ICON_STROKE_WIDTH} 
          />
        )}
        <span className="font-medium">{name}</span>
      </div>
    </TableCell>
  )
}

/**
 * Age Cell
 * - Compact format with "Y" suffix
 */
interface AgeCellProps {
  age: number
}

export function AgeCell({ age }: AgeCellProps) {
  return (
    <TableCell className="text-sm">
      {age}Y
    </TableCell>
  )
}

/**
 * Gender Cell
 * - Simple text display
 */
interface GenderCellProps {
  gender: string
}

export function GenderCell({ gender }: GenderCellProps) {
  return (
    <TableCell className="text-sm">
      {gender}
    </TableCell>
  )
}

/**
 * Study Description Cell
 * - Primary text: Study description (bold)
 * - Secondary text: Accession number (lighter)
 */
interface StudyDescriptionCellProps {
  description: string
  accessionNumber: string
}

export function StudyDescriptionCell({ description, accessionNumber }: StudyDescriptionCellProps) {
  return (
    <TableCell className="max-w-[250px]">
      <div className="text-sm font-medium">{description}</div>
      <div className="text-xs text-muted-foreground">{accessionNumber}</div>
    </TableCell>
  )
}

/**
 * Clinical History Cell
 * - Truncated with ellipsis
 * - Full text on hover via title attribute
 */
interface ClinicalHistoryCellProps {
  history: string
}

export function ClinicalHistoryCell({ history }: ClinicalHistoryCellProps) {
  return (
    <TableCell className="max-w-[200px]">
      <div className="text-xs text-muted-foreground truncate" title={history}>
        {history}
      </div>
    </TableCell>
  )
}

/**
 * DateTime Cell
 * - Displays date and time together
 */
interface DateTimeCellProps {
  date?: string
  time?: string
}

export function DateTimeCell({ date, time }: DateTimeCellProps) {
  return (
    <TableCell className="text-sm">
      {date && time ? `${date} ${time}` : date || "N/A"}
    </TableCell>
  )
}

/**
 * Generic Text Cell
 * - For any simple text display
 */
interface TextCellProps {
  text: string | null | undefined
  fallback?: string
}

export function TextCell({ text, fallback = "N/A" }: TextCellProps) {
  return (
    <TableCell className="text-sm">
      {text || fallback}
    </TableCell>
  )
}
