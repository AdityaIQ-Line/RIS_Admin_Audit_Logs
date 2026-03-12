/**
 * Design System Constants
 * 
 * Centralized constants for consistent design system values
 */

/**
 * Icon stroke width/thickness
 * Used across all icons in the application for consistent visual weight
 * Default Lucide icon stroke width is 2
 */
export const ICON_STROKE_WIDTH = 2

/**
 * Report Status Constants
 * 
 * Standardized report status workflow across all roles:
 * 1. Images captured → Pending
 * 2. Draft created by radiologist → Drafted
 * 3. Junior radiologist submits (if junior-senior flow enabled) → Awaiting Review
 * 4. Senior radiologist rejects → Rejected
 * 5. Senior radiologist approves → Approved
 * 6. Junior corrects and resubmits → Awaiting Review
 */
export const REPORT_STATUS = {
  PENDING: "Pending",
  DRAFTED: "Drafted",
  AWAITING_REVIEW: "Awaiting Review",
  REJECTED: "Rejected",
  APPROVED: "Approved",
} as const

export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS]

/**
 * Get badge styling for report status
 */
export function getReportStatusBadge(status: ReportStatus) {
  switch (status) {
    case REPORT_STATUS.PENDING:
      return {
        variant: "secondary" as const,
        className: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30",
        label: "Pending"
      }
    case REPORT_STATUS.DRAFTED:
      return {
        variant: "secondary" as const,
        className: "bg-orange-600/20 text-orange-700 dark:text-orange-400 border-orange-500/30",
        label: "Drafted"
      }
    case REPORT_STATUS.AWAITING_REVIEW:
      return {
        variant: "secondary" as const,
        className: "bg-blue-600/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
        label: "Awaiting Review"
      }
    case REPORT_STATUS.REJECTED:
      return {
        variant: "destructive" as const,
        className: "bg-red-600/20 text-red-700 dark:text-red-400 border-red-500/30",
        label: "Rejected"
      }
    case REPORT_STATUS.APPROVED:
      return {
        variant: "secondary" as const,
        className: "bg-green-600/20 text-green-700 dark:text-green-400 border-green-500/30",
        label: "Approved"
      }
    default:
      return {
        variant: "outline" as const,
        className: "",
        label: status
      }
  }
}