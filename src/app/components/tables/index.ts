/**
 * STANDARDIZED TABLE + FILTER UI COMPONENTS
 * 
 * Central export point for all standardized table and filter components.
 * Import from here to ensure consistency across the application.
 * 
 * Example usage:
 * ```tsx
 * import {
 *   WorklistTableShell,
 *   WorklistFilterBar,
 *   WorklistTable,
 *   WorklistTableHeader,
 *   WorklistTableRow,
 *   EmptyStateRow,
 *   PriorityBadge,
 *   ModalityBadge,
 *   UHIDCell,
 *   PatientNameCell,
 *   // ... other components
 * } from "../../app/components/tables"
 * ```
 */

// Layout Components
export { WorklistTableShell } from "./worklist-table-shell"
export type { WorklistTableShellProps } from "./worklist-table-shell"

// Filter Components
export { WorklistFilterBar } from "./worklist-filter-bar"
export type { 
  FilterOption, 
  FilterConfig, 
  WorklistFilterBarProps 
} from "./worklist-filter-bar"

// Table Structure Components
export { 
  WorklistTable,
  WorklistTableHeader,
  WorklistTableRow,
  EmptyStateRow 
} from "./worklist-table"
export type {
  WorklistTableProps,
  WorklistTableRowProps,
  EmptyStateRowProps
} from "./worklist-table"

// Specialized Cell Components
export {
  UHIDCell,
  PatientNameCell,
  AgeCell,
  GenderCell,
  StudyDescriptionCell,
  ClinicalHistoryCell,
  DateTimeCell,
  TextCell
} from "./table-cells"

// Badge Components
export { PriorityBadge } from "../badges/priority-badge"
export { ModalityBadge } from "../badges/modality-badge"
