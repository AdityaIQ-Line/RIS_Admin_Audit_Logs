---

---
This is a **critical integration audit control** because Modality Worklist (MWL) directly impacts imaging accuracy, patient mapping, and medico-legal integrity.

---
## Primary Actor
- Facility Admin
- IT / Integration Admin
- Compliance Officer

## Secondary Actors
- Radiology Coordinator
- Modality Technician
- PACS Administrator

# User Story Statement
As a **Facility Admin / IT Admin**,  
I want to **audit all Modality Worklist (MWL) events between LIMS, RIS, and PACS**,  
So that I can **ensure data synchronization accuracy, detect mapping failures, investigate integration issues, and maintain medico-legal traceability of imaging orders.**

# Business Value
- Prevents patient-study mismatches
- Detects MWL sync failures
- Enables troubleshooting of DICOM issues
- Protects against wrong-patient imaging
- Supports NABH & DICOM audit compliance

# Scope

This feature audits:
✔ MWL entry creation  
✔ MWL update (reschedule / modification)  
✔ MWL cancellation  
✔ MWL query by modality  
✔ MWL fetch confirmation  
✔ MWL transmission failures  
✔ Study association with MWL

Excluded:
- DICOM image storage audit
- Report generation audit (separate)

# High-Level Workflow
1. Appointment created in LIMS
2. Order pushed to RIS
3. RIS generates MWL entry
4. PACS exposes MWL
5. Modality queries MWL
6. Study acquired & linked
7. Audit event generated at each stage
# Audit Events Captured
- MWL Entry Created
- MWL Entry Updated
- MWL Entry Cancelled
- MWL Query Received (from modality)
- MWL Entry Retrieved by Modality
- MWL Transmission Failed
- Study Linked to MWL
- Orphan Study Detected
- Duplicate MWL Entry

# Relevant Fields

## MWL Core Fields (Audited)

|Field|Description|
|---|---|
|Appointment ID|Linked appointment|
|Patient ID (UHID)|Unique patient ID|
|Accession Number|Order identifier|
|Study Instance UID|DICOM Study UID|
|Modality|CT / MRI / USG / X-ray|
|Scheduled Date|MWL date|
|Scheduled Time|MWL time|
|AE Title|Modality AE Title|
|Referring Physician|Name|
|Procedure Code|RIS study code|
|Body Part|Study region|
|MWL Status|Created / Updated / Cancelled / Fetched|
|Sync Status|Success / Failed|
|Error Code|Integration error|
|Error Message|Detailed failure message|

## Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique record|
|Event Type|Create / Update / Query / Cancel|
|Integration Direction|LIMS→RIS / RIS→PACS / Modality→RIS|
|Accession Number|Order ID|
|Before Snapshot|JSON before change|
|After Snapshot|JSON after change|
|Triggered By|System / User|
|Triggered By User ID|If manual|
|Modality AE Title|Device|
|Modality IP|Device IP|
|Timestamp|Server time|
|Response Time|ms|
|Transmission Status|Success / Failed|
|Retry Count|Number of attempts|

# Validations

## Data Integrity Validation
- Accession Number must be unique
- Study Instance UID must follow DICOM format
- Patient ID must match appointment
- Scheduled time must match appointment time
- AE Title must be registered

## MWL Creation Validation
- Appointment must exist
- Appointment status must be Scheduled
- Payment validation (if required before MWL generation)
- Duplicate MWL entries blocked

## MWL Update Validation
- Only allowed before study acquisition
- Reschedule updates must reflect correct timestamp
- Cancelled appointment → MWL cancelled automatically

## MWL Query Validation
- Only registered AE Titles allowed
- Unauthorized AE Title → log security alert
- Invalid DICOM query format → log error
## Study Link Validation
- Study Instance UID must match MWL entry
- Accession number must match
- Mismatch → flag as orphan study
## Transmission Validation
- All integration messages logged
- Failure triggers retry (configurable)
- Maximum retry threshold enforced
# Edge Cases & Exception Handling

## Modality Fetches Wrong Patient
- Accession mismatch detected
- Flag critical alert
- Log IP & AE Title

## Orphan Study
- Study received without MWL entry
- Flag for manual reconciliation
- Create audit entry

## Duplicate Accession
- System blocks creation
- Logs duplicate attempt

## Network Failure
- Transmission failure logged
- Retry count incremented
- After max retries → mark as Failed

## Appointment Cancelled After MWL Fetch
- MWL cancellation sent
- If study already started → mark discrepancy

## Timezone Issues
- All timestamps normalized to facility timezone
- DICOM UTC offsets logged

## Bulk Sync Scenario
- Each MWL entry logged individually
- Partial failures recorded separately

# Non-Functional Requirements
- MWL event logging must not impact imaging workflow
- Logging latency ≤ 200 ms
- Audit retention ≥ 7 years
- Searchable by Accession / Patient / Date
- Exportable logs (CSV / PDF)

# Acceptance Criteria
- Every MWL lifecycle event generates audit entry
- Transmission failures logged with error codes
- Before & after values captured for updates
- Orphan studies flagged
- Audit logs read-only
- Unauthorized AE Title access blocked and logged

# Compliance Alignment
- DICOM MWL traceability
- NABH radiology audit compliance
- ISO 27001 integration monitoring
- Medico-legal defensibility for wrong-patient cases- Medico-legal defensibility for wrong-patient cases
