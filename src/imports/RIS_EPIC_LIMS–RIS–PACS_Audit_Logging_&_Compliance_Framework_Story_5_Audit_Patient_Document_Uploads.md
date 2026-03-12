## Primary Actor
- Facility Admin
- Compliance Officer
- Quality Manager

## Secondary Actors
- Radiology Front Desk
- Technician
- Radiologist
- IT Admin

## User Story Statement

As a **Facility Admin / Compliance Officer**,  
I want to **audit all patient document uploads, updates, replacements**,  
So that I can **ensure document authenticity, prevent tampering, maintain legal traceability, and meet healthcare compliance standards**.

## Business Value
- Prevents document manipulation
- Protects medico-legal integrity
- Ensures consent & identity proof traceability
- Supports NABH / ABDM / ISO audit requirements
- Enables forensic tracking

# Scope

This audit captures:

✔ Document upload  
✔ Document re-upload (replacement)  
✔ Document metadata edit  
✔ Document view

Excluded:
- Report uploads
- PACS image storage (handled at DICOM level)

# High-Level Workflow
1. User uploads document for patient
2. System validates file
3. Document stored securely
4. Metadata captured
5. Audit record generated
6. Admin reviews audit logs

# Types of Documents (Configurable)
- Consent Form
- Previous Reports
- Insurance Document
- Prescription
- Other Attachments

# Relevant Fields

## Document Fields (Audited)

|Field|Description|
|---|---|
|Patient ID (UHID)|Unique patient ID|
|Visit ID|Linked visit (if applicable)|
|File Name|Stored filename|
|File Size|In MB|
|File Format|PDF / JPG / PNG|
|Upload Timestamp|Server time|
|Uploaded By|User ID|

## Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique audit record|
|Event Type|Upload / View|
|Patient ID|UHID|
|Visit ID|If applicable|
|Changed By User ID|Actor|
|Changed By Role|Role|
|Change Timestamp|Server time|
|IP Address|Client IP|
|Status|Success / Failed|

# Validations

## File Upload Validations
- Allowed formats:  
    `PDF, JPG, JPEG, PNG`
- Max file size:  
    10 MB (configurable)
- Virus/malware scan mandatory
- File name sanitized (no special characters)

## Metadata Validation
- Document Type → Mandatory
- Patient ID → Must exist
- Visit ID → Must belong to patient
- File hash generated automatically
## Access Control Validation
- Only authorized roles can:
    - Upload
    - View

- Facility admin restricted to own facility patients
# Edge Cases & Exception Handling

## Duplicate Upload
- Same file hash → show warning
- Allow override → log override reason

## Large File Upload Failure
- Partial upload → auto rollback
- No audit entry if file not stored
- Failed attempt logged separately (optional)

## Network Drop During Upload
- Upload status: Failed
- No version increment
- Retry allowed

## Bulk Upload
- Each file logged individually
- Failed files logged separately

## Sensitive Documents
- Aadhaar/ID documents:
    - Masked preview
    - Full access logged separately

# Non-Functional Requirements
- Upload performance optimized (≤ 5 sec for 5MB)
- Hash generation mandatory
- Storage encrypted at rest
- Audit logs immutable
- Retention: 7–10 years (configurable)

# Acceptance Criteria
- Every upload generates audit record
- Audit log read-only
- File hash stored and retrievable
- Only authorized roles can modify

# Compliance Alignment
- NABH document traceability
- ABDM document governance compliance
- ISO 27001 change management
- Medico-legal integrity protection