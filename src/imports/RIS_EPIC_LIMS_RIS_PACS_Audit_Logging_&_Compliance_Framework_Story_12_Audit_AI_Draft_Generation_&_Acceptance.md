## User Story Statement

As a **Compliance Officer / Quality Head**,  
I want to **audit AI-generated draft reports and radiologist acceptance/modification actions**,  
So that I can **ensure transparency, maintain medico-legal traceability, and monitor responsible AI usage in reporting.**

## Scope

This audit captures:

- AI draft generation
    
- AI draft regeneration
    
- Radiologist acceptance (as-is)
    
- Radiologist modification before acceptance
    
- AI draft rejection
    
- AI draft override after acceptance
    

## Audit Events Captured

- AI Draft Generated
    
- AI Draft Regenerated
    
- AI Draft Accepted
    
- AI Draft Modified
    
- AI Draft Rejected
    
- AI Content Overridden
    

## Relevant Fields

### AI Draft Fields

- Study Instance UID
    
- Patient ID
    
- AI Model Name & Version
    
- AI Confidence Score (if available)
    
- Draft Generation Timestamp
    
- AI Prompt Version (if applicable)
    

### Acceptance / Action Fields

- Action Type (Accepted / Modified / Rejected)
    
- Accepted As-Is (Yes/No)
    
- Modified Sections (Findings / Impression)
    
- Radiologist Role
    
- Action Timestamp
    
- Report Version Number
    
- Before Snapshot (AI Draft)
    
- After Snapshot (Final Content)
    

### System Audit Fields

- Audit ID
    
- Event Type
    
- IP Address
    
- Device Type
    
- Server Timestamp
    
- Status (Success / Failed)
    

## Validations

- AI draft must be linked to valid Study & patient ID
    
- AI model version must be stored
    
- Acceptance must be performed only by assigned radiologist
    
- Every acceptance/modification must increment report version
    
- Before & After snapshot mandatory if modified
    
- AI draft cannot be finalized without radiologist action
    
- AI draft cannot overwrite finalized report without reopen
    

## Edge Cases

- AI draft regenerated → previous AI draft preserved in audit
    
- Radiologist edits AI draft before saving → logged as Modified
    
- AI draft accepted after report already finalized → blocked
    
- AI model failure → failed generation logged
    
- Multiple AI generations → each logged separately
    
- Manual report without AI → no AI audit event created
    

## Acceptance Criteria

- Every AI draft generation logged
    
- Every acceptance/modification logged
    
- AI model version traceable
    
- AI content history preserved
    
- Audit logs immutable and read-only
    

## Compliance Alignment

- Responsible AI governance
    
- Medico-legal traceability
    
- Clinical accountability
    
- ISO 27001 audit logging compliance