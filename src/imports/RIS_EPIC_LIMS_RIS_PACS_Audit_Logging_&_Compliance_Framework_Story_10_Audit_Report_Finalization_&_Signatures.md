---

---

---
## Primary Actor
- Facility Admin
- Compliance Officer
- Quality Head

## Secondary Actors
- Radiologist
- Senior Radiologist
- Medical Director
- IT Admin

# User Story Statement
As a **Compliance Officer / Facility Admin**,  
I want to **audit all report finalization events, digital signature applications, approvals, and signature invalidations in RIS**,  
So that I can **ensure legal authenticity, prevent unauthorized signing, maintain traceability, and comply with healthcare regulations.**

# Business Value
- Establishes medico-legal validity
- Prevents unauthorized report signing
- Tracks approval workflows
- Protects digital signature integrity
- Supports NABH / ISO / IT Act compliance

# Scope
This audit captures:
✔ Report Finalization  
✔ Digital Signature Application  
✔ Senior Radiologist Approval  
✔ Signature Rejection  
✔ Signature Invalidation (due to edit)  
✔ Re-sign after revision  
✔ Multi-level approval workflows

Excluded:
- Draft saves (separate story)
- Report delivery audit (separate story)

# High-Level Workflow
1. Radiologist completes draft
2. Clicks "Finalize Report"
3. Digital signature applied
4. If approval workflow enabled → sent to senior radiologist
5. Senior approves/rejects
6. Audit record generated for each event

# Audit Events Captured
- Report Finalized
- Digital Signature Applied
- Digital Signature Verified
- Approval Requested
- Approval Granted
- Approval Rejected
- Signature Invalidated
- Report Re-signed
- Multi-Level Approval Completed

# Relevant Fields

## Report Finalization Fields (Audited)

|Field|Description|
|---|---|
|Study Instance UID|DICOM UID|
|Accession Number|Order number|
|Patient ID|UHID|
|Report Version|Version at finalization|
|Finalization Timestamp|Server time|
|Approval Timestamp|If applicable|
|Report Status|Final / Approved / Rejected|
|Signature Type|Digital / e-Sign / DSC|
|Approval Level|L1 / L2 etc.|
|Approval Status|Pending / Approved / Rejected|

## Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique audit record|
|Event Type|Finalize / Sign / Approve|
|Version Number|Version at event|
|Signed By Role|Role at time|
|Signature Status Before|Valid / Invalid|
|Signature Status After|Valid / Invalid|
|Approval Workflow ID|Workflow reference|
|Approval Level|L1 / L2|
|Action Taken|Signed / Approved / Rejected|
|Rejection Reason|If rejected|
|Change Timestamp|Server time|
|IP Address|Client IP|
|Device Type|Web / Workstation|
|Status|Success / Failed|

# Validations

## Finalization Validation
- Report must not be empty
- Impression must not be blank
- All mandatory fields completed
- Radiologist must be assigned to case
- Report status must be Draft
- No pending peer review block (if configured)

## Approval Workflow Validation
- If “Report Approval Required = Yes”:
    - Senior radiologist approval mandatory
- Signing doctor cannot approve own report (if policy enabled)
- Approval must follow configured sequence

## Rejection Validation
- Rejection requires mandatory reason
- Report status set to Rejected
- Signature invalidated automatically

## Signature Invalidation Validation
- Any edit after finalization:
    - Invalidates digital signature
    - Logged as "Signature Invalidated"
- New signature required

## Version Control Validation
- Finalization increments version lock
- Cannot finalize already finalized report
- Re-sign must create new version (if reopened)

# Edge Cases & Exception Handling

## Signature Tampering Attempt
- Direct DB changes blocked
- Hash mismatch triggers alert
- Integrity failure logged

## Concurrent Finalization Attempt
- Only one finalization allowed
- Second attempt blocked
- Conflict logged

## Approval Delay
- Pending approval state maintained

## Reopen After Approval
- Signature invalidated
- Approval reset
- New workflow initiated

## Multi-Level Approval
- L1 approval logged
- L2 approval logged separately
- Workflow completed only after final level

## Network Failure During Signing
- If signature not confirmed:
    - No finalization
    - No signature hash saved
- Partial attempts logged as failed

# Data Integrity Controls
- Digital signature hash stored
- Hash generated from:
    - Report content
    - Version number
    - Timestamp
- Immutable audit storage
- Server-side timestamps only

# Non-Functional Requirements
- Signing latency ≤ 2 seconds
- Signature verification ≤ 1 second
- Audit retrieval ≤ 3 seconds
- Retention ≥ 7–10 years
- Exportable for legal proceedings

# Acceptance Criteria
- Every finalization event logged
- Every signature application logged
- Approval workflow events logged
- Signature invalidated on edit
- Rejection reason mandatory
- Unauthorized signing blocked
- All events read-only in audit view