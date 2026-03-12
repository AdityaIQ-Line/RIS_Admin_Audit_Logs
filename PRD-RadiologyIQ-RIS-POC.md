# Product Requirements Document (PRD)
# RadiologyIQ - Radiology Information System (RIS) POC

**Document Version:** 2.0  
**Last Updated:** January 14, 2026  
**Status:** Active Development - POC Phase

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Core Workflows](#core-workflows)
   - [Radiologist Workflows](#radiologist-workflows)
   - [Senior Radiologist – Report Authorization Workflow](#senior-radiologist--report-authorization-workflow)
   - [Admin Workflows](#admin-workflows)
   - [Technician Workflows](#technician-workflows)
   - [Front Desk Workflows](#front-desk-workflows)
   - [Referring Physician Workflows](#referring-physician-workflows)
4. [Report Status Model](#report-status-model)
5. [Data Models & Fields](#data-models--fields)
6. [Validations & Edge Cases](#validations--edge-cases)
7. [RBAC Rules](#rbac-rules)
8. [User Interface Requirements](#user-interface-requirements)
9. [Technical Notes](#technical-notes)

---

## Overview

RadiologyIQ is a web-based Radiology Information System (RIS) designed to streamline radiological workflows from patient registration through report finalization and authorization. This POC demonstrates role-based access control (RBAC), multi-level report authorization, DICOM/PACS integration placeholders, and HIPAA-compliant messaging.

### Key Features
- Multi-role support (Radiologist, Senior Radiologist, Admin, Technician, Front Desk, Referring Physician)
- **Two-tier reporting workflow**: Junior Radiologist reporting + Senior Radiologist authorization
- Case review and DICOM viewer integration (mockup)
- Template management for standardized reporting
- Comprehensive audit trail
- Read-only finalized reports with facility letterhead formatting

### POC Scope
- Frontend-only implementation with mock data
- Placeholder integrations for PACS/DICOM
- No real backend persistence (simulated)
- Focus on workflow clarity and UI/UX feasibility

---

## User Roles & Permissions

### 1. Radiologist (Junior/General)
**Primary Responsibilities:**
- Review imaging studies from worklist
- Create diagnostic reports using templates
- Submit reports for Senior Radiologist authorization
- Rework rejected reports

**Access Permissions:**
- Read/Write: Own draft reports
- Read: Assigned cases, templates, prior reports
- Submit: Reports for authorization
- Cannot: Authorize own reports, view reports pending authorization by others

---

### 2. Senior Radiologist
**Primary Responsibilities:**
- Authorize reports submitted by junior radiologists
- Provide clinical oversight and quality control
- Add comments, corrections, or guidance
- Approve or reject reports for finalization

**Access Permissions:**
- Read/Write: Reports pending authorization
- Approve/Reject: Reports
- Comment: On any report under review
- Read: All finalized reports
- Cannot: Bypass mandatory authorization workflow

---

### 3. Admin
**Primary Responsibilities:**
- Manage user accounts and permissions
- View audit logs and system activity
- Configure system settings
- Monitor workflow compliance

**Access Permissions:**
- Full CRUD: Users, roles, permissions
- Read: All audit logs, reports (view-only)
- Cannot: Authorize clinical reports, edit finalized reports

---

### 4. Technician (Technologist)
**Primary Responsibilities:**
- Upload imaging studies to PACS
- Assign studies to radiologists
- View finalized reports for patient follow-up
- Update study metadata

**Access Permissions:**
- Read: Assigned studies, finalized reports
- Write: Study metadata, assignments
- Cannot: Create, edit, or authorize reports

---

### 5. Front Desk
**Primary Responsibilities:**
- Register patients and schedule appointments
- Manage patient demographics
- Track appointment status
- Coordinate with technicians for study scheduling

**Access Permissions:**
- Full CRUD: Patient registration, appointments
- Read: Study schedule, basic patient info
- Cannot: Access clinical reports or imaging

---

### 6. Referring Physician
**Primary Responsibilities:**
- Request imaging studies
- View finalized and authorized reports
- Download/print reports for patient care

**Access Permissions:**
- Read: Finalized reports (authorized only)
- Request: New studies
- Cannot: Access draft reports, edit any data

---

## Core Workflows

---

## Radiologist Workflows

### A. Reporting Worklist
**Purpose:** Central hub for radiologists to view and manage assigned cases

**Features:**
- List view of all assigned studies
- Filters: Modality, priority, date range, status
- Sorting: By priority, study date, patient name
- Quick actions: Open case, start reporting
- Status indicators: Not Started, In Progress, Pending Authorization, Finalized

**User Flow:**
1. Radiologist logs in and lands on Reporting Worklist
2. Reviews assigned cases with priority indicators
3. Selects a case to begin review
4. System navigates to Case Review screen

---

### B. Case Review
**Purpose:** Review patient history, prior reports, and imaging studies before reporting

**Features:**
- Patient demographics panel
- Study information (modality, date, ordering physician)
- Prior reports comparison view
- PACS viewer integration (mockup/placeholder)
- Navigation to Reporting screen

**User Flow:**
1. Radiologist reviews patient information
2. Compares with prior studies if available
3. Opens PACS viewer to examine images
4. Clicks "Start Report" to proceed to Reporting screen

---

### C. Reporting
**Purpose:** Create structured diagnostic reports using templates

**Features:**
- Template selector (modality-specific)
- Rich text editor with structured sections:
  - Clinical History
  - Technique
  - Findings
  - Impression
  - Recommendations
- Auto-save drafts
- Macro/snippet insertion
- Voice-to-text placeholder
- **Submit for Authorization button** (new)

**User Flow:**
1. Select appropriate template based on modality
2. Populate report sections with findings
3. Review and edit content
4. **Choose action:**
   - **Save as Draft** → Status: Draft
   - **Submit for Authorization** → Status: Pending Authorization
5. If submitted, report is locked for editing
6. System notifies assigned Senior Radiologist

**Status Transitions:**
- Draft → Pending Authorization (on submit)
- Pending Authorization → Draft (Rework Required) (if rejected)

---

### D. Templates Management
**Purpose:** Maintain library of report templates for standardization

**Features:**
- Grid/List view toggle
- Template categories (by modality, body part)
- CRUD operations: Create, Edit, Duplicate, Delete
- Favorite templates
- Template activation/deactivation toggle
- Usage statistics
- Search and filter

**User Flow:**
1. Navigate to Templates page
2. Browse templates by category or search
3. Preview template content
4. Create new template or edit existing
5. Mark frequently used templates as favorites

---

## Senior Radiologist – Report Authorization Workflow

### Overview
Senior Radiologists review and authorize reports created by junior radiologists or residents. Authorization is mandatory before reports are released externally to referring physicians or made available for final distribution.

---

### User Story
**As a** Senior Radiologist  
**I want to** review and authorize reports created by junior radiologists  
**So that** I can ensure clinical accuracy, quality control, and compliance before external release

---

### Functional Capabilities

#### 1. Authorization Worklist
**Purpose:** Dedicated dashboard for reports awaiting authorization

**Features:**
- List of all reports with status "Pending Authorization"
- Filters:
  - Date range
  - Modality
  - Junior radiologist name
  - Priority level
- Sorting: By submission date, priority, patient name
- Indicators:
  - Time since submission
  - Report complexity flags
  - Prior rejection count (if reworked)

**User Flow:**
1. Senior Radiologist logs in
2. Navigates to "Pending Authorization" worklist
3. Reviews list of reports awaiting authorization
4. Selects a report to review

---

#### 2. Report Review & Authorization
**Purpose:** Detailed review interface for authorization decision

**Features:**
- **Report Details Panel:**
  - Patient demographics
  - Study information (modality, date, body part)
  - Junior radiologist name and credentials
  - Submission timestamp
  
- **Clinical Content:**
  - Full report text (read-only)
  - Structured sections clearly labeled
  - PACS study link (placeholder for image review)
  
- **Historical Context:**
  - Prior report versions (if reworked)
  - Previous authorization comments
  - Rejection history with reasons
  
- **Authorization Actions:**
  - **Add Comments/Corrections** (text field)
    - Guidance for improvement
    - Required changes
    - Educational notes
  - **Approve (Authorize)** button
  - **Reject (Request Rework)** button

**User Flow:**
1. Senior Radiologist opens report from worklist
2. Reviews patient and study information
3. Opens PACS viewer to verify findings (if needed)
4. Reads report content thoroughly
5. Compares with prior reports
6. **Decision point:**
   - **If report is accurate and complete:**
     - Optionally adds commendation or minor notes
     - Clicks "Approve (Authorize)"
     - Confirms authorization in dialog
     - Status changes to "Finalized and Authorized"
   - **If report requires changes:**
     - Adds detailed comments explaining required corrections
     - Clicks "Reject (Request Rework)"
     - Confirms rejection in dialog
     - Status changes to "Draft (Rework Required)"
7. System sends notifications to junior radiologist and technician

---

### Authorization Status Transitions

```
Draft
  ↓ (Junior Radiologist submits)
Pending Authorization
  ↓ (Senior Radiologist reviews)
  ├─→ Approved → Finalized and Authorized (released)
  └─→ Rejected → Draft (Rework Required) (back to Junior Radiologist)
```

---

### Post-Authorization Rules

#### On Approval (Authorize):
1. **Status Update:**
   - Report status changes to "Finalized and Authorized"
   
2. **Report Lock:**
   - Report becomes **read-only** for all users except Super Admin
   - No further edits permitted
   
3. **Facility Letterhead Application:**
   - Report is formatted with facility branding:
     - Facility name and logo
     - Facility address and contact
     - Radiologist credentials and signature
     - Senior Radiologist authorization signature
     - Timestamps and report ID
   
4. **Release and Distribution:**
   - Report becomes available to:
     - Technician (read-only, for patient coordination)
     - Referring Physician (read-only, view/download/print)
     - Patient portal (if configured)
   
5. **Notifications Sent:**
   - Junior Radiologist: "Your report has been authorized"
   - Technician: "Finalized report available for Study #[ID]"
   - Referring Physician: "New imaging report available"
   
6. **Audit Trail:**
   - Authorization action logged with:
     - Senior Radiologist ID and name
     - Authorization timestamp
     - Authorization comments (if any)
     - Report version number
     - Facility ID

#### On Rejection (Request Rework):
1. **Status Update:**
   - Report status changes to "Draft (Rework Required)"
   
2. **Report Unlock:**
   - Report editing re-enabled for original Junior Radiologist
   
3. **Feedback Delivery:**
   - Rejection comments displayed prominently in report editor
   - Previous version saved in history
   
4. **Notification Sent:**
   - Junior Radiologist: "Report rejected - rework required"
   - Email/system notification with comments
   
5. **Resubmission Workflow:**
   - Junior Radiologist addresses feedback
   - Makes required corrections
   - Re-submits for authorization
   - Status returns to "Pending Authorization"
   
6. **Audit Trail:**
   - Rejection action logged with:
     - Senior Radiologist ID and name
     - Rejection timestamp
     - Rejection comments
     - Report version number

---

### Authorization UI Components

#### Authorization Actions Bar
Located at top-right of report review screen:

```
[ 📝 Add Comments ] [ ✅ Approve (Authorize) ] [ ❌ Reject ]
```

#### Comments/Corrections Panel
- Rich text editor for authorization notes
- Visible to junior radiologist after action
- Supports formatting, bullet points, highlights
- Character limit: 2000 characters
- Placeholder: "Add comments, corrections, or guidance for the radiologist..."

#### Confirmation Dialogs

**On Approve:**
```
⚠️ Authorize Report?

You are about to authorize this report for final release.
Once authorized:
- Report cannot be edited
- Report will be released to referring physician
- Action is permanent and audited

Junior Radiologist: Dr. Sarah Johnson
Patient: John Doe (MRN: 12345)
Study: Chest X-Ray (2026-01-14)

[ Cancel ] [ Confirm Authorization ]
```

**On Reject:**
```
⚠️ Reject Report?

You are about to reject this report and send it back for rework.
Please ensure you have provided clear guidance in comments.

Junior Radiologist: Dr. Sarah Johnson
Patient: John Doe (MRN: 12345)
Study: Chest X-Ray (2026-01-14)

Comments: [Shows entered comments]

[ Cancel ] [ Confirm Rejection ]
```

---

### Integration with Existing Workflows

#### Junior Radiologist Workflow Updates
- **Reporting screen:**
  - "Submit for Authorization" button added
  - Replaces direct "Sign Off" option
  - Shows assigned Senior Radiologist
  
- **Worklist updates:**
  - New status column: "Pending Authorization"
  - Rejected reports highlighted with "Rework Required" badge
  
- **Rework flow:**
  - Opens report with authorization comments visible
  - Banner: "This report requires rework. Review comments below."
  - Edit and re-submit cycle

#### Technician Workflow Updates
- **Worklist:**
  - Only shows studies with "Finalized and Authorized" reports
  - Cannot view draft or pending reports
  
- **Report access:**
  - Read-only view with facility letterhead
  - Download/print options enabled

#### Referring Physician Workflow Updates
- **Reports list:**
  - Only displays "Finalized and Authorized" reports
  - Status indicator: "Authorized on [date]"
  
- **Report view:**
  - Read-only with full facility letterhead
  - Download PDF with embedded signatures
  - Print option with letterhead formatting

---

## Admin Workflows

### A. User Management
**Purpose:** Manage system users and role assignments

**Features:**
- User list with role badges
- Add/Edit/Deactivate users
- Role assignment: Radiologist, Senior Radiologist, Admin, Technician, Front Desk, Referring Physician
- Permission matrix view
- Bulk actions

**User Flow:**
1. Admin navigates to User Management
2. Views list of all users
3. Creates new user or edits existing
4. Assigns appropriate role and permissions
5. Saves changes (audit logged)

---

### B. Audit Logs
**Purpose:** Monitor system activity and compliance

**Features:**
- Chronological log of all system actions
- Filters: User, action type, date range, entity
- Search by patient ID, report ID, user ID
- Export logs for compliance reporting
- Key events logged:
  - Report status changes
  - Authorization actions (approve/reject)
  - User login/logout
  - Data access (view/edit)
  - Configuration changes

**User Flow:**
1. Admin navigates to Audit Logs
2. Applies filters to narrow results
3. Reviews relevant activities
4. Exports logs if needed for compliance

---

### C. System Settings
**Purpose:** Configure system parameters and preferences

**Features:**
- Facility information (name, logo, address)
- Default report templates per modality
- Notification preferences
- Workflow configuration:
  - Authorization required: Yes/No toggle
  - Assign default Senior Radiologist
- PACS connection settings (placeholder)

**User Flow:**
1. Admin navigates to System Settings
2. Updates configuration values
3. Saves changes
4. System applies new settings (audit logged)

---

## Technician Workflows

### A. Technologist Worklist
**Purpose:** Manage imaging studies and assignments

**Features:**
- List of scheduled and completed studies
- Study status: Scheduled, In Progress, Completed, Report Pending, Report Available
- Assign studies to radiologists
- Update study metadata
- View finalized reports (read-only)

**User Flow:**
1. Technician logs in and views worklist
2. Verifies study completion
3. Assigns study to appropriate radiologist
4. Monitors report status
5. Once "Finalized and Authorized", views/downloads report

---

## Front Desk Workflows

### A. Patient Registration
**Purpose:** Register new patients and update demographics

**Features:**
- Patient information form (name, DOB, contact, insurance)
- MRN generation
- Search existing patients
- Update patient records

**User Flow:**
1. Front desk receives patient
2. Searches for existing record
3. If new, creates patient profile
4. Verifies insurance information
5. Schedules appointment

---

### B. Appointment Scheduling
**Purpose:** Schedule imaging appointments

**Features:**
- Calendar view
- Appointment slots by modality
- Patient selection
- Referring physician assignment
- Priority flags (stat, urgent, routine)
- Appointment confirmation

**User Flow:**
1. Front desk opens scheduler
2. Selects date, time, and modality
3. Assigns patient
4. Confirms appointment
5. Sends confirmation to patient (placeholder)

---

## Referring Physician Workflows

### A. Reports List
**Purpose:** View finalized reports for referred patients

**Features:**
- List of all reports for physician's patients
- Filters: Date range, modality, patient name
- Status: Authorized reports only
- Quick actions: View, Download, Print

**User Flow:**
1. Physician logs in
2. Views list of available reports
3. Selects report to review
4. Downloads or prints for patient records

---

## Report Status Model

### Status Definitions

| Status | Description | Visible To | Actions Allowed |
|--------|-------------|------------|-----------------|
| **Draft** | Report in progress, not yet submitted | Junior Radiologist (author), Admin | Edit, Delete, Submit for Authorization |
| **Pending Authorization** | Report submitted, awaiting Senior Radiologist review | Junior Radiologist (read-only), Senior Radiologist, Admin | Senior: Approve/Reject; Others: View only |
| **Draft (Rework Required)** | Report rejected, requires corrections | Junior Radiologist (author), Admin | Edit, Re-submit for Authorization |
| **Finalized and Authorized** | Report approved and released | All authorized users | View, Download, Print (no edits) |

### Status Workflow Diagram

```
┌─────────────┐
│   Draft     │ (Junior Radiologist creates report)
└──────┬──────┘
       │ Submit for Authorization
       ↓
┌──────────────────────┐
│ Pending Authorization│ (Awaiting Senior Radiologist review)
└──────┬───────────────┘
       │
       ├─→ Approve → ┌───────────────────────────┐
       │             │ Finalized and Authorized  │ (Released)
       │             └───────────────────────────┘
       │
       └─→ Reject → ┌────────────────────┐
                     │ Draft (Rework Req) │ (Back to Junior Radiologist)
                     └─────────┬──────────┘
                               │ Corrections made
                               ↓ Re-submit
                         (Returns to Pending Authorization)
```

---

## Data Models & Fields

### Report Data Model

```typescript
interface Report {
  // Identifiers
  reportId: string
  studyId: string
  patientId: string
  facilityId: string
  
  // Patient Information
  patientName: string
  patientMRN: string
  patientDOB: string
  patientGender: string
  
  // Study Information
  studyDate: string
  modality: string // "X-Ray", "CT", "MRI", "Ultrasound", etc.
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
  
  // Authorization Fields (NEW)
  assignedSeniorRadiologistId: string
  assignedSeniorRadiologistName: string
  authorizationStatus: "pending" | "approved" | "rejected" | null
  authorizationDate: string | null
  authorizationComments: string | null
  authorizedByRadiologistId: string | null
  authorizedByRadiologistName: string | null
  authorizedReportVersion: number | null
  
  // Status & Workflow
  status: "Draft" | "Pending Authorization" | "Draft (Rework Required)" | "Finalized and Authorized"
  priority: "stat" | "urgent" | "routine"
  
  // Version Control & Audit
  reportVersion: number
  versionHistory: ReportVersion[]
  auditTrail: AuditEntry[]
  
  // Facility & Branding
  facilityName: string
  facilityLogo: string
  facilityAddress: string
  facilityContact: string
  
  // Metadata
  templateId: string | null
  tags: string[]
}
```

### ReportVersion Data Model (NEW)

```typescript
interface ReportVersion {
  versionNumber: number
  content: {
    technique: string
    findings: string
    impression: string
    recommendations: string
  }
  status: string
  modifiedDate: string
  modifiedBy: string
  modifiedByName: string
  changeReason: string // "Initial draft", "Rework after rejection", "Correction", etc.
  authorizationComments: string | null
}
```

### AuditEntry Data Model

```typescript
interface AuditEntry {
  entryId: string
  timestamp: string
  userId: string
  userName: string
  userRole: string
  action: string // "created", "edited", "submitted", "authorized", "rejected", "viewed", "downloaded"
  entityType: "report" | "study" | "patient" | "user"
  entityId: string
  changes: Record<string, any> | null
  comments: string | null
  ipAddress: string
}
```

### User Data Model

```typescript
interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: "radiologist" | "senior_radiologist" | "admin" | "technician" | "frontdesk" | "physician"
  credentials: string // "MD", "DO", "MBBS", etc.
  licenseNumber: string | null
  specialty: string | null
  facilityId: string
  isActive: boolean
  createdDate: string
  lastLoginDate: string | null
}
```

### Facility Data Model (NEW)

```typescript
interface Facility {
  facilityId: string
  facilityName: string
  facilityLogo: string // URL or base64
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contactPhone: string
  contactEmail: string
  website: string | null
  letterheadTemplate: string // HTML template for report formatting
}
```

---

## Validations & Edge Cases

### Report Submission Validations

#### Before Submission for Authorization:
1. **Assigned Senior Radiologist Required:**
   - Error: "Cannot submit report. No Senior Radiologist assigned to this case."
   - Action: Admin must assign Senior Radiologist before submission
   
2. **Mandatory Sections Complete:**
   - All required fields must be filled:
     - Clinical History
     - Technique
     - Findings
     - Impression
   - Error: "Cannot submit report. Required sections are incomplete."
   
3. **Patient & Study Validation:**
   - Verify patient MRN and study ID are valid
   - Error: "Invalid patient or study information. Please verify."

#### During Authorization Review:
1. **Concurrent Edit Prevention:**
   - If another Senior Radiologist is reviewing, show warning
   - Action: Lock report for review by first Senior Radiologist
   
2. **Stale Report Detection:**
   - If report was modified since loading review screen
   - Warning: "This report was updated. Please refresh to see latest version."

---

### Authorization Action Validations

#### Before Approval:
1. **Authorization Permission Check:**
   - Only users with "senior_radiologist" role can approve
   - Error: "Insufficient permissions to authorize reports."
   
2. **Self-Authorization Block:**
   - Senior Radiologist cannot authorize own reports
   - Error: "You cannot authorize your own report. Please assign to another Senior Radiologist."
   
3. **Report Already Authorized:**
   - Prevent duplicate authorization
   - Error: "This report is already authorized."

#### Before Rejection:
1. **Comments Required:**
   - Rejection must include comments explaining required changes
   - Error: "Rejection comments are required. Please provide guidance for corrections."
   - Minimum character count: 20 characters
   
2. **Report Already Finalized:**
   - Cannot reject finalized reports
   - Error: "Cannot reject. This report is already finalized."

---

### Post-Authorization Validations

#### Edit Prevention:
1. **Finalized Report Lock:**
   - All edit buttons disabled
   - Banner: "This report is finalized and authorized. Editing is not permitted."
   - Exception: Super Admin can create addendum (future feature)
   
2. **Status Change Block:**
   - Finalized reports cannot be reverted to draft
   - Error: "Finalized reports cannot be modified. Contact administrator for addendum."

#### Unauthorized Access Prevention:
1. **Report Visibility:**
   - Draft reports visible only to author and Admin
   - Pending Authorization reports visible to author (read-only), assigned Senior Radiologist, Admin
   - Finalized reports visible to authorized roles only
   
2. **Authorization Attempt by Non-Senior:**
   - If non-Senior Radiologist attempts to access authorization worklist
   - Error: "Access denied. Authorization privileges required."

---

### Reassignment Edge Cases

#### Senior Radiologist Reassignment:
1. **Original Senior Unavailable:**
   - Admin can reassign report to different Senior Radiologist
   - Action: Update `assignedSeniorRadiologistId`
   - Notification sent to new Senior Radiologist
   - Audit entry created: "Report reassigned from Dr. X to Dr. Y"
   
2. **Multiple Reassignments:**
   - Audit trail maintains history of all assignments
   - Current assigned Senior highlighted in UI
   
3. **Reassignment After Rejection:**
   - If Junior Radiologist cannot address feedback, Admin can reassign to different Junior Radiologist
   - Previous rejection comments remain visible
   - New radiologist notified of rework requirement

#### Auto-Assignment Rules:
1. **No Senior Assigned:**
   - System attempts to assign based on:
     - Specialty match (if configured)
     - Workload balancing
     - Availability
   - Fallback: Assigns to default Senior Radiologist (configured in settings)

---

### Notification Failures:
1. **Email Delivery Failure:**
   - Log failure in audit trail
   - Display in-app notification as fallback
   - Retry email after 5 minutes (max 3 retries)
   
2. **User Offline:**
   - Queue notification for next login
   - Display notification count badge on login

---

### Report Versioning Edge Cases:
1. **Multiple Rejection Cycles:**
   - Track number of rejections (max 3 recommended)
   - After 3 rejections, flag for Admin review
   - Admin can:
     - Reassign to different Junior Radiologist
     - Assign to different Senior Radiologist
     - Escalate to Chief Radiologist (if configured)
   
2. **Version History Display:**
   - Show all versions with:
     - Version number
     - Status at that version
     - Date and author
     - Authorization comments
   - Allow side-by-side comparison of versions

---

## RBAC Rules

### Permission Matrix

| Action | Radiologist (Junior) | Senior Radiologist | Admin | Technician | Front Desk | Referring Physician |
|--------|---------------------|-------------------|-------|------------|-----------|-------------------|
| **Create Report** | ✅ Own cases | ✅ Any case | ❌ | ❌ | ❌ | ❌ |
| **Edit Draft Report** | ✅ Own only | ✅ Any | ❌ | ❌ | ❌ | ❌ |
| **Submit for Authorization** | ✅ Own only | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Pending Authorization** | ✅ Own (read-only) | ✅ All | ✅ All | ❌ | ❌ | ❌ |
| **Authorize Report** | ❌ | ✅ (not own) | ❌ | ❌ | ❌ | ❌ |
| **Reject Report** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Finalized Report** | ✅ All | ✅ All | ✅ All | ✅ Assigned | ❌ | ✅ Own patients |
| **Download Report** | ✅ All | ✅ All | ✅ All | ✅ Assigned | ❌ | ✅ Own patients |
| **Edit Finalized Report** | ❌ | ❌ | ❌* | ❌ | ❌ | ❌ |
| **Create/Edit Templates** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Manage Users** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **View Audit Logs** | ❌ | ✅ Limited | ✅ All | ❌ | ❌ | ❌ |
| **Assign Senior Radiologist** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Reassign Report** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

\* Super Admin only, via addendum feature (future)

---

### Authorization-Specific RBAC

#### Senior Radiologist Authorization Rules:
1. ✅ **Can authorize:**
   - Any report with status "Pending Authorization"
   - Reports created by any Junior Radiologist
   
2. ❌ **Cannot authorize:**
   - Own reports (self-authorization blocked)
   - Reports already finalized
   - Reports in Draft status (must be submitted first)

3. ✅ **Can reject:**
   - Any report with status "Pending Authorization"
   - Must provide rejection comments
   
4. ✅ **Can view:**
   - All reports in "Pending Authorization" worklist
   - Authorization history for all reports
   - Own authorization actions in audit log

#### Junior Radiologist Post-Submission Rules:
1. ✅ **Can view (read-only):**
   - Own reports with status "Pending Authorization"
   - Authorization comments after approval/rejection
   
2. ❌ **Cannot edit:**
   - Reports with status "Pending Authorization"
   
3. ✅ **Can edit:**
   - Reports with status "Draft (Rework Required)"
   
4. ✅ **Can re-submit:**
   - Reworked reports back to "Pending Authorization"

#### Admin Override Capabilities:
1. ✅ **Can reassign:**
   - Change assigned Senior Radiologist
   - Change assigned Junior Radiologist (for rework)
   
2. ✅ **Can view:**
   - All reports at all stages
   - All authorization actions and comments
   
3. ❌ **Cannot authorize:**
   - Clinical authorization restricted to Senior Radiologists only
   
4. ✅ **Can create:**
   - Addendum to finalized reports (future feature, logged in audit)

---

## User Interface Requirements

### General UI Principles
- Clean, medical-grade interface with high contrast
- WCAG 2.1 AA accessibility compliance
- Responsive design (desktop primary, mobile-friendly)
- Consistent color coding for statuses
- Clear visual hierarchy
- Minimal clicks to complete actions

### Status Color Coding

| Status | Color | Badge Style |
|--------|-------|-------------|
| Draft | Gray | `badge-secondary` |
| Pending Authorization | Amber | `badge-warning` |
| Draft (Rework Required) | Red | `badge-destructive` |
| Finalized and Authorized | Green | `badge-success` |

### Key UI Components

#### 1. Authorization Worklist (Senior Radiologist)
- **Layout:** Data table with columns:
  - Patient Name
  - MRN
  - Study Date
  - Modality
  - Submitted By (Junior Radiologist)
  - Submission Date
  - Time Pending
  - Priority
  - Actions (View/Authorize)
- **Filters:** Dropdown for modality, date picker, search by patient
- **Sorting:** Clickable column headers
- **Empty State:** "No reports pending authorization" with icon

#### 2. Report Review Screen (Senior Radiologist)
- **Left Panel (30%):** Patient & study info, history
- **Center Panel (50%):** Report content with structured sections
- **Right Panel (20%):** PACS viewer integration (placeholder)
- **Top Bar:** Authorization actions (Add Comments, Approve, Reject)
- **Bottom:** Comments/Corrections text area (expandable)

#### 3. Confirmation Modals
- **Approve Modal:**
  - Icon: Green checkmark
  - Title: "Authorize Report?"
  - Summary: Patient, study, junior radiologist
  - Warning text about permanence
  - Buttons: Cancel (secondary), Confirm Authorization (primary green)
  
- **Reject Modal:**
  - Icon: Red X
  - Title: "Reject Report?"
  - Summary: Patient, study, junior radiologist
  - Display entered comments
  - Warning about providing clear guidance
  - Buttons: Cancel (secondary), Confirm Rejection (destructive red)

#### 4. Radiologist Worklist Status Updates
- **Status Column:** Badge with color coding
- **Actions Column:**
  - Draft: "Continue Editing"
  - Pending Authorization: "View" (read-only)
  - Rework Required: "Rework Report" (with alert icon)
  - Finalized: "View Report"

#### 5. Rework Banner (Junior Radiologist)
- Displayed at top of report editor when status is "Draft (Rework Required)"
- Design:
  ```
  ⚠️ Rework Required
  This report was rejected by [Senior Radiologist Name] on [Date].
  Please review the comments below and make necessary corrections.
  
  [View Authorization Comments]
  ```
- Color: Amber/orange warning background
- Dismissible: No (always visible until re-submitted)

#### 6. Authorization Comments Display
- **Location:** Below rework banner or in side panel
- **Design:**
  - Icon: 💬 Comment bubble
  - Header: "Authorization Feedback from [Senior Radiologist Name]"
  - Timestamp: [Date and time]
  - Content: Full comments in read-only text box
  - Style: Light background, bordered, with avatar of Senior Radiologist

#### 7. Version History Panel
- **Accordion or expandable section**
- Each version shows:
  - Version number and date
  - Status at that version
  - Author
  - Authorization comments (if any)
  - "View Diff" button to compare versions

#### 8. Finalized Report View (All Users)
- **Header:** Facility letterhead with logo
- **Report Sections:** Clean, print-friendly layout
- **Footer:**
  - Radiologist signature (digital)
  - Senior Radiologist authorization signature
  - Timestamps: Report created, authorized
  - Report ID and version
- **Actions Bar:**
  - Download PDF button
  - Print button
  - Share button (future feature)
- **Watermark (optional):** "Authorized" or facility branding

#### 9. Notification Badge
- **Location:** Header navigation, user avatar dropdown
- **Design:** Red dot or numbered badge
- **Triggers:**
  - Junior Radiologist: Report authorized, report rejected
  - Senior Radiologist: New report pending authorization
  - Technician: Report finalized for assigned study
  - Referring Physician: New report available

---

## Technical Notes

### POC Implementation Notes
1. **Mock Data:**
   - Use realistic but fictional patient data
   - Generate sample reports for various modalities
   - Include reports at different stages (draft, pending, finalized)
   
2. **Local Storage (Frontend State):**
   - Store report state in React state + localStorage
   - Simulate authorization workflow with state transitions
   - Audit trail stored as JSON array
   
3. **PACS Integration Placeholder:**
   - Display "PACS Viewer" iframe or image placeholder
   - Link text: "Open in PACS" (non-functional)
   - Note: "PACS integration requires backend API"
   
4. **Letterhead Formatting:**
   - Use CSS print styles for PDF-friendly output
   - Facility logo as base64 or SVG
   - HTML template for letterhead layout
   
5. **Notifications:**
   - In-app notifications using toast/banner
   - Mock email sending (log to console)
   - Badge count tracked in global state

### Future Backend Considerations
- Database schema for reports, users, audit logs
- Authentication & session management
- Real PACS API integration (DICOM viewer)
- Email/SMS notification service
- PDF generation service with digital signatures
- Advanced audit logging with tamper-proof logs

---

## Appendix: Sample Mock Data

### Sample Report (Pending Authorization)

```json
{
  "reportId": "RPT-2026-001234",
  "studyId": "STU-2026-005678",
  "patientId": "PAT-12345",
  "facilityId": "FAC-001",
  
  "patientName": "John Doe",
  "patientMRN": "MRN-12345",
  "patientDOB": "1975-06-15",
  "patientGender": "Male",
  
  "studyDate": "2026-01-14",
  "modality": "CT",
  "bodyPart": "Chest",
  "studyDescription": "CT Chest without contrast",
  "accessionNumber": "ACC-2026-7890",
  
  "orderingPhysician": "Dr. Emily Chen",
  "orderingPhysicianId": "PHY-456",
  "clinicalHistory": "Persistent cough for 3 weeks, rule out pneumonia",
  
  "technique": "Helical CT scan of the chest was performed without intravenous contrast. Images reconstructed in axial, coronal, and sagittal planes.",
  "findings": "The lungs are clear without evidence of consolidation, mass, or nodules. No pleural effusion or pneumothorax. The mediastinum is unremarkable. Heart size is normal. No significant lymphadenopathy.",
  "impression": "1. No acute cardiopulmonary abnormality.\n2. Normal chest CT.",
  "recommendations": "Clinical correlation recommended. Follow-up as clinically indicated.",
  
  "radiologistId": "RAD-789",
  "radiologistName": "Dr. Sarah Johnson",
  "createdDate": "2026-01-14T09:30:00Z",
  "lastModifiedDate": "2026-01-14T10:15:00Z",
  
  "assignedSeniorRadiologistId": "SRAD-101",
  "assignedSeniorRadiologistName": "Dr. Michael Roberts",
  "authorizationStatus": "pending",
  "authorizationDate": null,
  "authorizationComments": null,
  "authorizedByRadiologistId": null,
  "authorizedByRadiologistName": null,
  "authorizedReportVersion": null,
  
  "status": "Pending Authorization",
  "priority": "routine",
  
  "reportVersion": 1,
  "versionHistory": [
    {
      "versionNumber": 1,
      "content": { "technique": "...", "findings": "...", "impression": "...", "recommendations": "..." },
      "status": "Draft",
      "modifiedDate": "2026-01-14T09:30:00Z",
      "modifiedBy": "RAD-789",
      "modifiedByName": "Dr. Sarah Johnson",
      "changeReason": "Initial draft",
      "authorizationComments": null
    }
  ],
  "auditTrail": [
    {
      "entryId": "AUD-001",
      "timestamp": "2026-01-14T09:30:00Z",
      "userId": "RAD-789",
      "userName": "Dr. Sarah Johnson",
      "userRole": "radiologist",
      "action": "created",
      "entityType": "report",
      "entityId": "RPT-2026-001234",
      "changes": null,
      "comments": "Report created from template CT-Chest-001",
      "ipAddress": "192.168.1.100"
    },
    {
      "entryId": "AUD-002",
      "timestamp": "2026-01-14T10:15:00Z",
      "userId": "RAD-789",
      "userName": "Dr. Sarah Johnson",
      "userRole": "radiologist",
      "action": "submitted",
      "entityType": "report",
      "entityId": "RPT-2026-001234",
      "changes": { "status": "Pending Authorization" },
      "comments": "Submitted for authorization to Dr. Michael Roberts",
      "ipAddress": "192.168.1.100"
    }
  ],
  
  "facilityName": "Metropolitan Imaging Center",
  "facilityLogo": "data:image/svg+xml;base64,...",
  "facilityAddress": "123 Medical Plaza, Suite 400, New York, NY 10001",
  "facilityContact": "Phone: (555) 123-4567 | Fax: (555) 123-4568",
  
  "templateId": "TPL-CT-CHEST-001",
  "tags": ["chest", "ct", "routine", "no_contrast"]
}
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-15 | Product Team | Initial PRD with Radiologist, Admin, Technician, Front Desk, Physician workflows |
| 2.0 | 2026-01-14 | Product Team | **Added Senior Radiologist Report Authorization Workflow**, updated status model, added authorization data fields, RBAC rules, and UI requirements |

---

**End of Document**
