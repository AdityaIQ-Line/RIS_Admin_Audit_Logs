## User Story Statement

As a **Compliance Officer / Quality Head**,  
I want to **audit template selection, application, and template changes in radiology reports**,  
So that I can **ensure reporting consistency, trace content origin, and maintain medico-legal defensibility.**

## Scope

This audit captures:

- Template applied to report
    
- Template changed (switched)
    
- Template modified after application
    
- Template removed / replaced
    

## Audit Events Captured

- Template Applied
    
- Template Changed
    
- Template Removed
    
- Template Version Updated in Report
    

## Relevant Fields

### Template Details

- Study Instance UID
    
- Patient ID
    
- Template Name
    
- Template Version
    
- Template Type (Modality-specific / Body Part)
    
- Template application
    

### Change Tracking

- Template Before
    
- Template After
    
- Version Before
    
- Version After
    
- Changed By User ID
    
- Changed By Role
    
- Change Timestamp
    

### System Fields

- Audit ID
    
- Event Type
    
- IP Address
    
- Device Type
    
- Server Timestamp
    
- Status (Success / Failed)
    

## Validations

- Template must exist and be active
    
- Template must match modality (configurable rule)
    
- Template change after finalization requires reopen
    
- Template version stored at time of application
    
- Changing template must generate new report version
    
- Before & After snapshot mandatory
    
- Only authorized roles can change template
    

## Edge Cases

- Template updated centrally after report creation → report retains original template version
    
- Switching template overwrites existing structured fields → previous content snapshot preserved
    
- Multiple template changes → each logged separately
    
- Attempt to change template on finalized & signed report → blocked unless reopened
    
- Deleted template (inactive) cannot be applied
    

## Acceptance Criteria

- Every template application generates audit entry
    
- Every template change generates audit entry
    
- Template version traceable historically
    
- Unauthorized changes blocked
    
- Audit log read-only and immutable
    

## Compliance Alignment

- Reporting standardization governance
    
- Medico-legal documentation traceability
    
- ISO 27001 change logging
    
- Clinical quality assurance compliance