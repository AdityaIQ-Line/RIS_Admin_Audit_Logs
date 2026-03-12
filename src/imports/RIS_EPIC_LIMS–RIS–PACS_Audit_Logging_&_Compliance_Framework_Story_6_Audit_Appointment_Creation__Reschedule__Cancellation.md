## Primary Actor
- Facility Admin
- Operations Manager
- Compliance Officer

## Secondary Actors
- Front Desk Executive
- Radiology Coordinator
- Call Center Agent
- IT Admin

# User Story Statement
As a **Facility Admin / Operations Manager**,  
I want to **audit all appointment creation, rescheduling, and cancellation activities**,  
So that I can **ensure operational transparency, prevent misuse, track slot utilization changes, and meet audit and compliance requirements.**

# Business Value
- Prevents unauthorized appointment manipulation
- Tracks revenue-impacting changes
- Supports patient dispute resolution
- Maintains medico-legal traceability
- Enables performance analytics
# Scope

This audit module captures:

✔ Appointment creation  
✔ Appointment update (date/time)  
✔ Reschedule  
✔ Cancellation

Excluded:
- Patient demographic changes (separate audit)
- Report edits (separate audit)

# High-Level Workflow
1. User creates or modifies appointment
2. System validates slot availability
3. Change is committed
4. Before & after values captured
5. Audit record generated
6. Admin reviews audit logs
# Audit Events Captured
- Appointment Created
- Appointment Updated
- Appointment Rescheduled
- Appointment Cancelled

# Relevant Fields

## Appointment Core Fields (Audited)

|Field|Description|
|---|---|
|Patient ID (UHID)|Linked patient|
|Visit ID|Linked visit|
|Modality|CT / MRI / X-Ray / USG|
|Test Name|Specific study|
|Appointment Date|Scheduled date|
|Appointment Time|Scheduled time|
|Slot Duration|In minutes|
|Radiologist Assigned|Reporting radiologist|
|Priority|Routine / Urgent/ VIP|
|Booking Source|Walk-in / Online / Referral|
|Payment Status|Paid / Pending|
|Appointment Status|Scheduled / Completed / Cancelled|
|Cancellation Reason|Mandatory if cancelled|
|Reschedule Reason|Optional|

## Audit Log Fields (System-Captured)

|Field|Description|
|---|---|
|Audit ID|Unique audit record|
|Event Type|Create / Update / Cancel / Reschedule|
|Appointment ID|Unique appointment ID|
|Patient ID|UHID|
|Before Value|JSON snapshot before change|
|After Value|JSON snapshot after change|
|Changed Fields|Fields modified|
|Changed By User ID|Actor|
|Changed By Role|Role|
|Change Timestamp|Server time|
|IP Address|Client IP|
|Change Reason|Mandatory for cancel/reschedule|
|System Triggered|Yes/No (for auto-updates)|
|Status|Success / Failed|

# Validations

## Access Control
- Only authorized roles can:
    - Create appointment
    - Reschedule
    - Cancel

- Facility users restricted to own facility
- Admin required for bulk modifications
## Appointment Creation Validation
- Patient must exist
- Slot must be available
- No overlapping appointment for same patient & modality
- Emergency appointments may override slots (with log entry)

## Reschedule Validation
- New slot must be available
- Cannot reschedule completed appointment
- Cannot reschedule cancelled appointment
- Reschedule reason required (configurable)
- If payment already done → flag for billing reconciliation

## Cancellation Validation
- Cancellation reason mandatory
- Cannot cancel completed appointment
- Cancellation after study started → requires admin approval
- Refund flag captured (if applicable)

## No-Show Validation
- Only allowed after scheduled time passed
- No-show must be logged with timestamp
- Automatic no-show marking (optional)

## Data Integrity
- Audit logs immutable
- Server-side timestamps only
- Before & after snapshot mandatory
- Bulk updates → separate audit entry per appointment

# Edge Cases & Exception Handling

## Slot Conflict
- Two users try to book same slot → first success, second rejected
- Rejected attempt optionally logged

## MWL Sync Scenario
- Appointment rescheduled → MWL update event logged
- Cancellation → MWL cancellation event logged
- Sync failure → logged separately

## Payment Linked Scenario

- Cancellation after payment:
    - Refund status captured
    - Billing audit triggered

- Reschedule with price difference:
    - Adjustment recorded

## Timezone Issues
- Appointment time stored in facility timezone
- Daylight saving adjustments handled server-side

## Bulk Reschedule

- Partial success:
    - Each success logged
    - Each failure logged with reason
## System Auto-Cancellation
- If no confirmation within X hours → system auto-cancel
- Event type marked as "System Triggered"

# Non-Functional Requirements
- Audit retrieval ≤ 3 seconds
- Retention configurable (5–7 years)
- Exportable (CSV / PDF)
- Searchable by Appointment ID / Patient / Date

# Acceptance Criteria
- Every appointment lifecycle event generates audit record
- Before & after values captured for updates
- Cancel/reschedule requires reason
- Audit logs are read-only
- Unauthorized changes blocked
- Bulk actions logged per appointment
# Compliance Alignment
- NABH scheduling traceability
- Revenue integrity tracking
- ISO 27001 change logging
- Medico-legal defensibility