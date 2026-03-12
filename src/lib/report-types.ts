/**
 * Report Status Types and Data Models
 * 
 * This file defines the report authorization workflow statuses and data structures
 * used across the RadiologyIQ application.
 */

// Import standardized report status constants
import { REPORT_STATUS, ReportStatus as StandardReportStatus } from './constants'

// Report Status Type - Using standardized statuses
export type ReportStatus = StandardReportStatus

// Study Status (used in worklist) - aligned with standardized workflow
export type StudyStatus = 
  | "Pending"              // Images captured, pending radiologist review
  | "Drafted"              // Draft created by radiologist
  | "Awaiting Review"      // Submitted by junior radiologist for senior review
  | "Rejected"             // Rejected by senior radiologist
  | "Approved"             // Approved by senior radiologist

// Priority levels
export type Priority = "STAT" | "Urgent" | "Routine"

// Modality types
export type Modality = "CT" | "MRI" | "X-Ray" | "Ultrasound" | "PET" | "Mammography"

// Report Version for tracking changes
export interface ReportVersion {
  versionNumber: number
  content: {
    technique: string
    findings: string
    impression: string
    recommendations: string
  }
  status: ReportStatus
  modifiedDate: string
  modifiedBy: string
  modifiedByName: string
  changeReason: string
  authorizationComments: string | null
}

// Audit Entry
export interface AuditEntry {
  entryId: string
  timestamp: string
  userId: string
  userName: string
  userRole: string
  action: "created" | "edited" | "submitted" | "authorized" | "rejected" | "viewed" | "downloaded"
  entityType: "report" | "study" | "patient" | "user"
  entityId: string
  changes: Record<string, any> | null
  comments: string | null
  ipAddress: string
}

// Full Report Data Model
export interface Report {
  // Identifiers
  reportId: string
  studyId: string
  patientId: string
  facilityId: string
  
  // Patient Information
  patientName: string
  patientMRN: string
  patientDOB: string
  patientGender: "M" | "F" | "Other"
  patientAge?: number
  
  // Study Information
  studyDate: string
  studyTime?: string
  modality: Modality
  bodyPart: string
  studyDescription: string
  accessionNumber: string
  
  // Ordering Information
  orderingPhysician: string
  orderingPhysicianId: string
  clinicalHistory: string
  
  // Report Content
  technique: string
  findings: string
  impression: string
  recommendations: string
  
  // Authorship
  radiologistId: string
  radiologistName: string
  createdDate: string
  lastModifiedDate: string
  
  // Authorization Fields
  assignedSeniorRadiologistId: string | null
  assignedSeniorRadiologistName: string | null
  authorizationStatus: "pending" | "approved" | "rejected" | null
  authorizationDate: string | null
  authorizationComments: string | null
  authorizedByRadiologistId: string | null
  authorizedByRadiologistName: string | null
  authorizedReportVersion: number | null
  
  // Status & Workflow
  status: ReportStatus
  priority: Priority
  
  // Version Control & Audit
  reportVersion: number
  versionHistory: ReportVersion[]
  auditTrail: AuditEntry[]
  
  // Facility & Branding
  facilityName: string
  facilityLogo?: string
  facilityAddress?: string
  facilityContact?: string
  
  // Metadata
  templateId: string | null
  tags: string[]
}

// Worklist Item (simplified for worklist view)
export interface WorklistItem {
  id: string
  uhid: string
  patientName: string
  age: number
  gender: "M" | "F" | "Other"
  modality: Modality
  studyDescription: string
  tests: string
  priority: Priority
  status: StudyStatus
  studyDate: string
  studyTime: string
  reportGeneratedDate: string | null
  reportGeneratedTime: string | null
  reportValidatedDate: string | null
  reportValidatedTime: string | null
  allottedTechnician: string
  referringPhysician: string
  clinicalHistory: string
  accessionNumber: string
  
  // Authorization fields (added)
  assignedSeniorRadiologist?: string
  authorizationComments?: string
  rejectionCount?: number
  
  // Critical case fields
  isCritical?: boolean
  criticalComment?: string
}

// Status badge configuration - Updated to use standardized statuses
export const statusConfig = {
  "Pending": {
    variant: "secondary" as const,
    color: "gray",
    label: "Pending",
  },
  "Drafted": {
    variant: "secondary" as const,
    color: "orange",
    label: "Drafted",
  },
  "Awaiting Review": {
    variant: "default" as const,
    color: "blue",
    label: "Awaiting Review",
  },
  "Rejected": {
    variant: "destructive" as const,
    color: "red",
    label: "Rejected",
  },
  "Approved": {
    variant: "default" as const,
    color: "green",
    label: "Approved",
  },
} as const

// Priority badge configuration
export const priorityConfig = {
  "STAT": {
    variant: "destructive" as const,
    label: "STAT",
  },
  "Urgent": {
    variant: "default" as const,
    label: "Urgent",
  },
  "Routine": {
    variant: "secondary" as const,
    label: "Routine",
  },
} as const

// Helper functions - Updated to match soft pastel badge design
export function getStatusBadgeClass(status: StudyStatus | ReportStatus): string {
  const config = statusConfig[status]
  if (!config) return ""
  
  switch (config.color) {
    case "green":
      // Approved - Light green background with green text
      return "bg-[#d4f4dd] text-[#16a34a] hover:bg-[#d4f4dd] border-[#d4f4dd]"
    case "orange":
      // Drafted - Light orange/peach background with orange/brown text
      return "bg-[#fed7aa] text-[#c2410c] hover:bg-[#fed7aa] border-[#fed7aa]"
    case "red":
      // Rejected - Light pink/red background with red text
      return "bg-[#fecdd3] text-[#dc2626] hover:bg-[#fecdd3] border-[#fecdd3]"
    case "blue":
      // Awaiting Review - Light blue background with blue text
      return "bg-[#dbeafe] text-[#2563eb] hover:bg-[#dbeafe] border-[#dbeafe]"
    case "gray":
      // Pending - Light pink/rose background with rose/pink text
      return "bg-[#fce7f3] text-[#db2777] hover:bg-[#fce7f3] border-[#fce7f3]"
    default:
      return ""
  }
}

export function canEditReport(status: ReportStatus, userRole: string, isAuthor: boolean): boolean {
  // Only author can edit drafted or rejected reports
  if (status === "Drafted" || status === "Rejected") {
    return isAuthor
  }
  // No one can edit reports awaiting review or approved reports
  return false
}

export function canSubmitForAuthorization(status: ReportStatus, isAuthor: boolean): boolean {
  return (status === "Drafted" || status === "Rejected") && isAuthor
}

export function canAuthorizeReport(status: ReportStatus, userRole: string, isAuthor: boolean): boolean {
  // Only senior radiologists can authorize, and not their own reports
  return status === "Awaiting Review" && userRole === "senior_radiologist" && !isAuthor
}