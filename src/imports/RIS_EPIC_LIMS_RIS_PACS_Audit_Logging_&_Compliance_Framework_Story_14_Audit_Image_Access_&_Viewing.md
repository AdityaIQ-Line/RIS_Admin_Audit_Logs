## User Story Statement

As a **Compliance Officer / Facility Admin**,  
I want to **audit all access and viewing of radiology images in RIS**,  
So that I can **ensure patient data privacy, detect unauthorized access, and maintain medico-legal traceability.**

## Scope

This audit captures:
- Image/Study opened in viewer
- Series accessed
- Image download/export
- Image print
- Screen capture (if detectable)
- Access via external link (if enabled)

Excluded:
- DICOM storage audit
- Report viewing audit

## Audit Events Captured
- Study Accessed
- Series Opened
- Image Viewed
- Image Downloaded
- Image Printed
- External Viewer Access
- Access Denied

## Relevant Fields

### Image / Study Details
- Study Instance UID
- Series Instance UID
- SOP Instance UID (Image ID)
- Accession Number
- Patient ID (UHID)
- Modality
- Study Date

### User & Access Details
- User Role
- Access Type (View / Download / Print)
- Access Source (RIS / PACS / External Link)
- Access Timestamp (Server Time)
- Session ID
- IP Address
- Device / Browser Info

### System Fields
- Audit ID
- Event Type
- Access Status (Success / Denied)
- Reason for Denial (if applicable)

## Validations
- Only authorized roles can view images
- Access must be role-based (Radiologist, Technician, Admin)
- Cross-facility access restricted (unless super admin)
- Study must belong to assigned case (configurable rule)
- External link access must be token-protected
- All timestamps server-generated
- Every access attempt (success/failure) logged

## Edge Cases
- Unauthorized access attempt → logged as Access Denied
- Same user reopens study in same session → configurable (log once or per open)
- Bulk image download → log per study or per file (configurable)
- Emergency access override → flagged in audit
- Session timeout during viewing → logged
- PACS downtime → failed access logged
- Shared workstation usage → IP & session ID captured

## Acceptance Criteria
- Every image/study access generates audit entry
- Download/print events logged separately
- Unauthorized access attempts logged
- Audit log immutable and read-only
- Searchable by Patient / Study / User / Date

## Compliance Alignment
- NABH patient privacy controls
- HIPAA-like access traceability
- ISO 27001 access logging
- Medico-legal defensibility