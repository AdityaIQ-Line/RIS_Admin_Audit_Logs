---

---
This is one of the **most medico-legally sensitive audit controls** in RIS because report edits and revisions directly affect diagnosis traceability, liability exposure, and peer review integrity.

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
I want to **audit all report edits, revisions, reopen actions, and post-finalization changes in RIS**,  
So that I can **maintain complete diagnostic traceability, prevent unauthorized tampering, ensure medico-legal defensibility, and meet regulatory requirements.**

# Business Value
- Prevents unauthorized post-report modifications
- Tracks evolution of diagnostic findings
- Enables dispute investigation
- Supports peer review and quality programs
- Strengthens legal defensibility

# Scope

This audit captures:
✔ Report content edits (Findings / Impression)  
✔ Revisions before finalization  
✔ Reopen after finalization  
✔ Addendum creation  
✔ Template changes  
✔ Correction edits  
✔ Revision reason capture  
✔ Digital signature invalidation & regeneration

Excluded:
- Initial report creation (covered separately)
- Report delivery audit (separate story)

# High-Level Workflow
1. Radiologist finalizes report
2. Report becomes locked
3. Reopen request initiated (if needed)
4. Changes made
5. Version incremented
6. Addendum or revised report generated
7. Audit entry captured

# Audit Events Captured
- Report Edited (Pre-Final)
- Report Finalized
- Report Reopened
- Report Revised
- Impression Modified
- Addendum Added
- Template Switched
- Digital Signature Invalidated
- Digital Signature Reapplied

# Relevant Fields

## Report Core Fields (Audited)

|Field|Description|
|---|---|
|Report ID|Unique identifier|
|Study Instance UID|DICOM Study UID|
|Accession Number|Order number|
|Patient ID (UHID)|Linked patient|
|Radiologist ID|Author|
|Reviewer ID|If applicable|
|Report Status|Draft / Final / Reopened / Revised|
|Version Number|Auto-incremented|
|Findings|Main content|
|Impression|Diagnostic conclusion|
|Addendum Text|Additional notes|
|Template ID|Template used|
|Revision Reason|Mandatory (if reopened)|
|Finalization Timestamp|Locked time|
|Reopen Timestamp|If reopened|
|Digital Signature Hash|Integrity verification|
|Signature Status|Valid / Invalidated|

## Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique record|
|Event Type|Edit / Reopen / Revision / Addendum|
|Report ID|Linked report|
|Version Before|Previous version number|
|Version After|Updated version number|
|Before Snapshot|JSON snapshot|
|After Snapshot|JSON snapshot|
|Changed Sections|Findings / Impression / Template|
|Changed By User ID|Actor|
|Changed By Role|Role at time|
|Change Timestamp|Server time|
|IP Address|Client IP|
|Device|Web / Workstation|
|Revision Reason|Mandatory (post-final)|
|Signature Status Before|Valid / Invalid|
|Signature Status After|Valid / Invalid|
|Change Impact Level|Minor / Major (optional classification)|

# Validations

## Access Control Validation
- Only report author or authorized senior radiologist can:
    - Edit draft
    - Reopen finalized report
- Admin cannot modify clinical content
- Peer reviewer cannot directly edit final report (must request revision)

## Edit Validation (Pre-Final)
- Version auto-increment required
- Before & After snapshot mandatory
- Impression cannot be empty
- Template must exist

## Reopen Validation (Post-Final)
- Mandatory revision reason
- Reopen timestamp recorded
- Digital signature automatically invalidated
- New version created
- Cannot reopen if report already superseded (configurable)

## Addendum Validation
- Addendum must not overwrite original text
- Addendum timestamp immutable
- Addendum author recorded
- Original finalized content remains unchanged

## Digital Signature Validation
- Any edit after finalization:
    - Invalidates signature
    - Requires re-signing
- Signature hash recalculated
- Old signature preserved in audit

## Version Control Validation
- No overwrite allowed
- Every revision must:
    - Increment version number
    - Preserve historical versions
- Version history must be chronological

# Edge Cases & Exception Handling

## Multiple Radiologists Editing
- If concurrent editing:
    - Conflict detection triggered
    - Last-save-wins (if configured)
    - Conflict logged

## Correction of Minor Typo
- Minor correction still logged
- Change impact classification optional

## Reopen After Delivery
- If report already delivered:
    - Alert displayed
    - Audit flagged as "Post-Delivery Revision"

## Addendum After Final
- Addendum allowed without reopening
- Addendum does not modify original version

## Template Change Mid-Revision
- Old template preserved in snapshot
- Template ID change logged

## System Crash During Revision
- No version increment unless saved
- Last saved version retained

## Signature Tampering Attempt
- Direct DB modification blocked
- All signature changes server-controlled

# Data Integrity Controls
- Snapshots stored as structured JSON
- Server-side timestamps only
- Optional SHA256 content hash stored per version
- Immutable audit storage

# Non-Functional Requirements
- Revision save latency ≤ 1 second
- Version history retrieval ≤ 3 seconds
- Supports high-volume radiology centers
- Retention ≥ 7–10 years
- Exportable revision history

# Acceptance Criteria
- Every edit generates audit entry
- Reopen requires reason
- Digital signature invalidated on change
- All versions retrievable
- Addendum stored separately
- Audit logs read-only
- Unauthorized edits blocked

# Compliance Alignment
- NABH documentation traceability
- Medico-legal defensibility
- ISO 27001 change management
- Peer review audit compliance
- Healthcare digital signature standards