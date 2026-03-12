## Primary Actor

- Facility Admin
    
- Compliance Officer
    
- Quality Head
    

## Secondary Actors

- Reporting Radiologist
    
- Senior Radiologist
    

## User Story Statement

As a **Compliance Officer / Quality Head**,  
I want to **audit all critical result flagging activities in RIS**,  
So that I can **ensure traceability of high-risk findings, prevent unauthorized flag manipulation, and maintain medico-legal defensibility.**

## Business Value

- Ensures transparency in identifying critical findings
    
- Prevents improper addition or removal of critical flags
    
- Maintains defensible diagnostic records
    
- Supports NABH and hospital safety policies
    

# Scope

This audit captures:

✔ Critical flag creation  
✔ Adding flag remarks  
✔ Removal (override) of critical flag

# High-Level Workflow

1. Radiologist reviews report
    
2. Identifies critical finding
    
3. Selects “Mark as Critical”
    
4. Enters remarks
    
5. Audit record generated
    
6. Any modification or removal also logged
    

# Audit Events Captured

- Critical Flag Added
    
- Remarks added
    
- Critical Flag Removed
    

# Relevant Fields

## Critical Flag Core Fields (Audited)

|Field|Description|
|---|---|
|Study Instance UID|DICOM UID|
|Accession Number|Order number|
|Patient ID|UHID|
|Radiologist ID|Reporting doctor|
|Report Version|Version at time of flag|
|Critical Flag Status|Yes / No|
|Flag Timestamp|Server time|
|Removal Timestamp|If removed|
|Override Reason|Mandatory if removed|

## Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique audit record|
|Event Type|Add / Modify / Remove|
|Critical Status Before|Yes / No|
|Critical Status After|Yes / No|
|Changed By User ID|Actor|
|Changed By Role|Role at time|
|Timestamp|Server time|
|IP Address|Client IP|
|Device Type|Web / Workstation|
|Change Reason|Mandatory if removal or downgrade|
|Status|Success / Failed|

# Validations

## Critical Flag Creation Validation

- Only reporting or senior radiologist can mark critical
    
- Flag timestamp auto-generated (server-side)
    

## Critical Flag Modification Validation

- Only authorized roles can modify
    
- Modification must generate new audit entry
    
- Version reference must be captured
    

## Critical Flag Removal Validation

- Mandatory override reason
    
- Removal timestamp auto generated
    
- Removal must not delete historical record
    
- Previous critical history must remain visible
    

## Data Integrity Validation

- Audit logs are immutable
    
- No edit/delete of audit entries
    
- All timestamps server-generated
    
- Before & after values mandatory for modification
    

# Edge Cases & Exception Handling

## Critical Flag Added After Finalization

- Allowed (if policy permits)
    
- Logged as post-final critical update
    
- Version reference preserved
    

## Report Edited After Critical Flag

- Critical flag persists unless manually removed
    
- Modification of report content does not auto-remove flag
    

## Duplicate Flag Attempt

- If report already marked critical:
    
    - Prevent duplicate flag
        
    - Allow modification only
        

## Unauthorized Attempt

- Attempt blocked
    
- Failed attempt optionally logged
    

# Non-Functional Requirements

- Flagging action response time ≤ 1 second
    
- Audit retrieval ≤ 3 seconds
    
- Retention ≥ 7–10 years
    
- Exportable audit logs
    
- Searchable by:
    
    - Radiologist
        
    - Date
        

# Acceptance Criteria

- Every critical flag addition generates audit record
    
- Every modification generates audit record
    
- Removal requires reason
    
- Before & after values captured
    
- Audit logs read-only
    
- Unauthorized users cannot flag or remove
    

# Compliance Alignment

- NABH Critical Finding Documentation Policy
    
- Medico-legal defensibility
    
- ISO 27001 change tracking
    
- Clinical governance requirements