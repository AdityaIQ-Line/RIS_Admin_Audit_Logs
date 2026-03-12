---

---
This is a **high medico-legal sensitivity area** in RIS because draft edits and report changes directly impact diagnosis traceability.

---
## Primary Actor
- Facility Admin
- Compliance Officer
- Quality Head

## Secondary Actors
- Radiologist
- Senior Radiologist
- IT Admin

# User Story Statement
As a **Facility Admin / Compliance Officer**,  
I want to **audit all report creation, draft saves, and content modifications in RIS**,  
So that I can **ensure diagnostic traceability, prevent unauthorized edits, maintain medico-legal defensibility, and comply with healthcare audit requirements.**

# Business Value
- Protects against report tampering
- Tracks diagnostic evolution
- Enables discrepancy investigations
- Supports peer review processes
- Ensures compliance with NABH / medico-legal standards

# Scope
This audit module captures:
✔ Report creation  
✔ Draft save (auto/manual)  
✔ Report content edits  
✔ Template changes  
✔ Impression changes  
✔ Addendum creation  
✔ Report re-opening after finalization

Excluded:
- Final approval audit (separate story)
- Report delivery audit (separate)

# High-Level Workflow
1. Study linked to radiologist
2. Radiologist opens report
3. Draft saved (manual or auto-save)
4. Report edited multiple times
5. Report finalized
6. Audit trail captures all intermediate states

# Audit Events Captured
- Report Created
- Draft Saved (Manual)
- Draft Auto-Saved
- Report Edited
- Impression Updated
- Template Changed
- Addendum Added
- Report Reopened
- Report Deleted (Soft Delete Only)

# Relevant Fields

## Report Core Fields (Audited)

|Field|Description|
|---|---|
|Study Instance UID|DICOM study UID|
|Accession Number|Order number|
|Patient ID (UHID)|Linked patient|
|Clinical History|Clinical details|
|Findings|Main body|
|Impression|Conclusion|
|Addendum Text|Additional notes|
|Report Status|Draft / Final / Reopened|
|Version Number|v1, v2, v3|
|Save Type|Manual / Auto|
|Word Count|Optional integrity metric|
|Finalization Timestamp|If applicable|

## Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique audit record|
|Event Type|Create / Draft Save / Edit|
|Before Snapshot|JSON of previous content|
|After Snapshot|JSON of updated content|
|Changed Sections|Findings / Impression / Template|
|Version Number|Auto-incremented|
|Changed By User ID|Radiologist|
|Changed By Role|Role at time|
|Change Timestamp|Server time|
|IP Address|Client IP|
|Device Type|Web / Workstation|
|Change Reason|Optional / mandatory for reopen|
|Status|Success / Failed|

# Validations

## Access Control Validation
- Only assigned radiologist can create/edit draft
- Senior radiologist can review but not modify draft unless role permits
- Admin cannot modify clinical content

## Draft Save Validation
- Auto-save interval configurable (e.g., every 60 sec)
- Manual save logs separate event
- Version must increment on each save

## Content Validation
- Report cannot be empty
- Impression cannot be blank if status = Final
- Clinical history required for certain modalities (configurable)

## Edit Validation
- All edits must capture:
    - Before snapshot
    - After snapshot
- No overwrite allowed without version increment
- Editing finalized report requires:
    - Reopen action
    - Mandatory reason

## Addendum Validation
- Addendum cannot modify original text
- Addendum timestamp immutable
- Addendum author recorded

## Deletion Validation
- Hard delete ❌ Not allowed
- Only soft delete (admin role only)
- Mandatory reason
- Deleted reports remain in audit trail

# Edge Cases & Exception Handling

## Auto-Save Failure
- If network fails → save locally (optional)
- If save fails → no version increment
- Failure logged separately

## Multiple Tabs Editing
- Last save wins (configurable)
- Conflict detection recommended
- Conflict event logged

## Reopen After Finalization
- Reopen action logged
- Version increment required
- Reason mandatory
- Previous final version preserved

## Template Change
- Template switch logged
- Old content snapshot retained

## Radiologist Role Change Mid-Draft
- Role at time of save recorded
- Editing rights recalculated

## System Crash
- Unsaved changes lost
- Last successful save remains in audit

# Non-Functional Requirements
- Save latency ≤ 1 second
- Version history retrieval ≤ 3 seconds
- Storage optimized for multiple versions
- Retention ≥ 7–10 years
- Exportable audit logs

# Acceptance Criteria
- Every draft save generates audit entry
- Version history visible chronologically
- Reopen requires reason
- Addendum logged separately
- Audit logs read-only
- Unauthorized edits blocked

# Compliance Alignment
- NABH radiology documentation standards
- Medico-legal defensibility
- ISO 27001 change logging
- Peer review traceability