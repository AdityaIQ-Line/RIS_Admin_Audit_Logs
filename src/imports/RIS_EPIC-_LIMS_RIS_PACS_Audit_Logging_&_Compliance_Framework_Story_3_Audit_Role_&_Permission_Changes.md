### Primary Actor
- Facility Admin
- Super Admin
- Compliance / Security Officer

### Secondary Actors
- IT Admin
- Audit Team

## User Story Statement

As a **Facility Admin / Compliance Officer**,  
I want to **audit all role and permission changes in RIS**,  
So that I can **ensure proper access control, trace administrative actions, investigate unauthorized changes, and meet regulatory audit requirements**.

## Business Value
- Prevents unauthorized privilege escalation
- Ensures accountability for access changes
- Supports NABH / ISO 27001 / healthcare IT audits
- Strengthens internal governance and security posture

## Scope
This feature maintains a **tamper-proof, read-only audit log** for:

✔ Role assignment  
✔ Role change  
✔ Permission add/remove  
✔ Permission override  
✔ Role activation / deactivation  
✔ Bulk role updates

## High-Level Workflow
1. Admin modifies a user’s role or permissions
2. System validates authorization
3. Change is committed
4. Pre-change and post-change states captured
5. Audit record stored immutably
6. Admin / Auditor reviews audit log

## Audit Events Captured
- User Role Assigned
- User Role Changed
- Role Removed
- Permission Added
- Permission Removed
- Role Status Changed (Active / Inactive)
- Bulk Role / Permission Update

## Relevant Fields

### Filters (Audit Viewer)

|Field|Description|
|---|---|
|Date & Time Range|Change window|
|Facility|Facility where change occurred|
|Target User|User whose role/permission changed|
|Changed By|Admin who performed change|
|Role Name|Role involved|
|Permission Name|Permission affected|
|Change Type|Add / Remove / Modify|
|Module|RIS module (Reporting, PACS, Admin)|
|Status|Success / Failed|

### Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique audit record ID|
|Target User ID|User affected|
|Target Username|Username of affected user|
|Target Role (Before)|Role prior to change|
|Target Role (After)|Role after change|
|Permission Before|Permission set (JSON / list)|
|Permission After|Permission set (JSON / list)|
|Change Type|Role / Permission|
|Action Performed|Assign / Update / Remove|
|Module|RIS module impacted|
|Changed By User ID|Admin user|
|Changed By Role|Role of admin|
|Change Timestamp|Server timestamp|
|IP Address|Admin’s IP|
|Change Reason|Optional comment|
|Change Status|Success / Failed|
|Failure Reason|If applicable|

## Validations

### Access Control
- Only **authorized admin roles** can change roles/permissions
- Facility Admin limited to **own facility users**
- Super Admin can manage cross-facility roles

### Data Integrity
- Audit logs are **immutable**
- No edit / delete / overwrite allowed
- Timestamps generated server-side only

### Change Validation
- Role must exist and be active
- Permission must belong to selected role
- Duplicate permission assignment blocked
- User must always have **at least one active role**

### Consistency Rules
- Pre-change and post-change states must be captured
- Bulk updates generate **one audit entry per user**
- Failed updates still logged

## Edge Cases & Exception Handling

### Role Scenarios
- Removing last admin role → blocked
- Downgrading own role → requires confirmation / blocked
- Assigning higher privilege than own role → blocked

### Permission Scenarios
- Removing mandatory permission → blocked
- Permission inherited via role → cannot be manually removed
- Conflicting permissions → system resolves by priority rules

### System & Audit
- Partial bulk update → log success & failure per user
- System failure after change → rollback + audit
- Timezone normalized to facility timezone

## Non-Functional Requirements
- Role changes reflected immediately (no cache lag)
- Audit log retrieval ≤ 3 seconds
- Retention configurable (e.g., 5–7 years)
- Export available (CSV / PDF)

## Acceptance Criteria
- All role & permission changes are logged
- Before and after states are visible
- Audit logs are read-only and tamper-proof
- Unauthorized changes are blocked
- Filters work across user, role, and date

## Compliance & Security
- Aligns with NABH access governance requirements
- Supports ISO 27001 control A.9 (Access Control)
- Enables forensic investigation and compliance audits