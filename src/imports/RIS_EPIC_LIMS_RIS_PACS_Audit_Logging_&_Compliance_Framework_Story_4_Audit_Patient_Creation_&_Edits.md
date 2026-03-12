## Primary Actor
- Facility Admin
- Compliance Officer
- Quality Manager

## Secondary Actors
- Radiology Front Desk
- Radiology Coordinator
- IT Admin

## User Story Statement

As a **Facility Admin / Compliance Officer**,  
I want to **track and audit all patient creation and modification activities in Radiology LIMS**,  
So that I can **ensure data integrity, prevent unauthorized edits, meet compliance requirements, and investigate discrepancies.**

## Business Value
- Protects patient demographic integrity
- Prevents identity manipulation / duplication
- Supports NABH / ABDM / healthcare audit compliance
- Enables forensic traceability

## Scope

This audit module captures:

✔ New patient registration  
✔ Edits to patient demographic details  
✔ Edits to identifiers (UHID, ABHA, MRN)

Excluded:

- Appointment edits (separate audit)

## High-Level Workflow

1. User creates or edits patient record
2. System validates data
3. Changes are saved
4. System captures **before and after values**
5. Immutable audit record generated
6. Admin views audit log

# Audit Events Captured
- Patient Created
- Patient Details Updated
- Patient Identifier Updated

# Relevant Fields

## Patient Core Fields (Audited)

|Field|Description|
|---|---|
|Patient ID (UHID)|Unique patient identifier|
|First Name|Patient first name|
|Last Name|Patient last name|
|Gender|Male / Female / Other|
|Date of Birth|DOB|
|Age|Auto-calculated|
|Mobile Number|Patient contact|
|Email|Optional|
|Address|Full address|
|Pincode|6-digit code|
|City|City|
|State|State|
|Country|Country|
|ABHA ID|Health ID (if available)|
|Aadhaar (Masked)|Masked identifier if stored|
|Guardian Name|For minor patients|
|Patient Status|Active / Inactive|

## Audit Log Fields (System Captured)

|Field|Description|
|---|---|
|Audit ID|Unique audit record|
|Event Type|Create / Update|
|Patient ID|UHID|
|Before Value|JSON of old data|
|After Value|JSON of new data|
|Changed Field(s)|List of fields modified|
|Changed By User ID|User performing action|
|Changed By Role|Role of user|
|Facility ID|Facility|
|Change Timestamp|Server time|
|IP Address|Client IP|
|Change Reason|Optional comment|
|Status|Success / Failed|

# Validations

## Access Control
- Only authorized roles can:
    - Create patient
    - Edit patient
    
- Facility users can access only their facility patients
- Super admin can access cross-facility data
## Data Integrity
- Audit logs must be **immutable**
- No edit/delete allowed
- Server-side timestamp only
- Before & After snapshot mandatory for updates

## Patient Creation Validations
- Mandatory fields:
    - Name
    - Gender
    - Mobile Number
    
- Duplicate check:
    - Same Mobile + DOB → trigger duplicate warning
    
- UHID auto-generated and unique

## Patient Edit Validations
- If ABHA linked → demographic edits restricted
- DOB change requires confirmation
- Gender change logged with reason
- Mobile change triggers OTP verification (if enabled)

# Edge Cases & Exception Handling

## Duplicate Registration
- Same name + mobile + DOB → system warns
- If override → override reason logged
## Minor Patient
- If age < 18 → Guardian name to be noted
- Guardian edits also audited
## Identifier Change
- UHID cannot be edited manually
- ABHA unlink event logged separately
- Aadhaar stored masked (never full visible)

## System Failures
- If save fails → no audit record created
- If partial update → rollback + audit failure logged

## Bulk Upload
- Each patient creation logged separately
- Failed records logged with reason

## Data Protection
- Sensitive identifiers masked in audit view
- Audit accessible only to compliance/admin roles

# Non-Functional Requirements
- Audit retrieval ≤ 3 seconds
- Retention configurable (e.g., 7–10 years)
- Export available (CSV / PDF)
- Searchable by patient ID, user, date
# Acceptance Criteria
- Every patient creation generates audit entry
- Every edit logs before and after values
- Audit log is read-only
- Unauthorized edits blocked
- Sensitive data masked in logs

# Compliance Alignment
- Supports NABH record traceability
- Aligns with ABDM data governance
- Meets healthcare audit requirements
- Enables medico-legal investigation