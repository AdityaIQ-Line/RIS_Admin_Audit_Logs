# Dual Approval Configuration Feature

## Overview

The **Dual Approval Configuration** feature allows Admins to enable a flexible verification workflow where radiologists can choose between two verification routes when finalizing reports:

1. **QC Technician** - Quality control review
2. **Senior Radiologist** - Senior review and authorization

## Feature Components

### 1. Admin Configuration (System Settings)

**Location:** Admin > System Settings > Workflow Tab

**What it does:**
- Admins can toggle "Dual Approval Workflow" ON/OFF
- When enabled, radiologists see an additional dropdown when finalizing reports
- Setting is saved to localStorage and accessible across the application

**File:** `/src/pages/admin/SystemSettings.tsx`

**Implementation Details:**
- Added new "Workflow" tab (7th tab in System Settings)
- Added `dualApprovalEnabled` state variable
- Settings persist in localStorage with key: `dualApprovalEnabled`
- Visual indicator shows "Dual Approval Enabled" badge when active

### 2. Radiologist Report Workflow

**Location:** PACS Viewer > Report Panel > Verification Route Section

**What it does:**
- When dual approval is **disabled**: Shows only "Senior Radiologist Assignment" dropdown
- When dual approval is **enabled**: Shows "Verification Route" dropdown with two options:
  - **QC Technician** - Routes report to QC Technician for quality control review
  - **Senior Radiologist** - Routes report to Senior Radiologist for authorization

**File:** `/src/pages/radiologist/PACSViewerFinal.tsx`

**Implementation Details:**
- Checks localStorage for `dualApprovalEnabled` setting on component mount
- Conditionally renders verification route dropdown based on setting
- When "Senior Radiologist" route is selected, also shows radiologist assignment dropdown
- When "QC Technician" route is selected, hides radiologist assignment dropdown

### 3. Report Submission Logic

**What changes:**
- Confirmation message adapts based on selected route
- Toast notifications reflect the chosen verification path
- Backend API call includes `approvalRoute` parameter

**Example API Payload:**
```javascript
{
  studyId: caseData.id,
  findings: findingsText,
  impression: impressionText,
  isCritical: false,
  approvalRoute: "qc_technician", // or "senior_radiologist"
  seniorRadiologistId: "SRAD-101" // only when route is senior_radiologist
}
```

## User Workflows

### Workflow 1: Dual Approval Disabled (Default)

```
Radiologist finalizes report
    ↓
Selects Senior Radiologist from dropdown
    ↓
Clicks "Finalize & Sign"
    ↓
Report sent to Senior Radiologist for authorization
```

### Workflow 2: Dual Approval Enabled - QC Route

```
Radiologist finalizes report
    ↓
Selects "QC Technician" from Verification Route dropdown
    ↓
Clicks "Finalize & Sign"
    ↓
Report sent to QC Technician for quality control review
    ↓
QC Technician reviews and approves
    ↓
Report sent to Senior Radiologist for final authorization
```

### Workflow 3: Dual Approval Enabled - Senior Route

```
Radiologist finalizes report
    ↓
Selects "Senior Radiologist" from Verification Route dropdown
    ↓
Selects specific Senior Radiologist from assignment dropdown
    ↓
Clicks "Finalize & Sign"
    ↓
Report sent directly to Senior Radiologist for authorization
```

## UI/UX Details

### System Settings - Workflow Tab

**Visual Elements:**
- Toggle switch for "Dual Approval Workflow"
- Descriptive text explaining the feature
- Blue info box appears when enabled showing:
  - "Dual Approval Enabled" heading
  - Explanation of two available routes
  - Icons for each route (GitBranch icon)

### PACS Viewer - Report Panel

**Visual Elements:**
- Section title changes from "Senior Radiologist Assignment" to "Verification Route" when enabled
- "Dual Approval Enabled" badge appears in header
- Dropdown shows two options with icons and descriptions:
  - **QC Technician** option:
    - CheckCircle icon
    - "QC Technician" label
    - "Quality control review" description
  - **Senior Radiologist** option:
    - UserCog icon
    - "Senior Radiologist" label
    - "Senior review and authorization" description
- Help text below dropdown explains the selected route
- Senior Radiologist assignment dropdown only shows when route is "Senior Radiologist"

## Technical Implementation

### State Management

**System Settings:**
```typescript
const [dualApprovalEnabled, setDualApprovalEnabled] = React.useState(false)

// Load on mount
React.useEffect(() => {
  const stored = localStorage.getItem('dualApprovalEnabled')
  if (stored) {
    setDualApprovalEnabled(JSON.parse(stored))
  }
}, [])

// Save on change
const handleSave = () => {
  localStorage.setItem('dualApprovalEnabled', JSON.stringify(dualApprovalEnabled))
}
```

**PACS Viewer:**
```typescript
const [approvalRoute, setApprovalRoute] = React.useState<"qc_technician" | "senior_radiologist">("senior_radiologist")
const [dualApprovalEnabled, setDualApprovalEnabled] = React.useState(false)

// Load on mount
React.useEffect(() => {
  const stored = localStorage.getItem('dualApprovalEnabled')
  if (stored) {
    setDualApprovalEnabled(JSON.parse(stored))
  }
}, [])
```

### Conditional Rendering

```typescript
{/* Only show when dual approval is enabled */}
{dualApprovalEnabled && (
  <div>
    <Select
      value={approvalRoute}
      onValueChange={(value) => setApprovalRoute(value as "qc_technician" | "senior_radiologist")}
    >
      <SelectItem value="qc_technician">QC Technician</SelectItem>
      <SelectItem value="senior_radiologist">Senior Radiologist</SelectItem>
    </Select>
  </div>
)}

{/* Only show when route is senior_radiologist or dual approval is disabled */}
{(!dualApprovalEnabled || approvalRoute === "senior_radiologist") && (
  <div>
    <Select value={selectedSeniorRadiologist} ...>
      {/* Senior radiologist options */}
    </Select>
  </div>
)}
```

## Backend Integration Notes

When implementing the backend, the API should:

1. **Accept the `approvalRoute` parameter** in report submission
2. **Route reports to appropriate queues:**
   - `qc_technician` → QC Technician Worklist
   - `senior_radiologist` → Senior Radiologist Authorization Worklist
3. **Handle workflow state transitions:**
   - Draft → QC Review (if QC route)
   - QC Review → Senior Authorization (after QC approval)
   - Draft → Senior Authorization (if senior route)
4. **Send appropriate notifications** to QC Technicians or Senior Radiologists
5. **Log the approval route** in audit trail

## Testing Checklist

- [ ] Admin can enable/disable dual approval in System Settings
- [ ] Setting persists across page refreshes
- [ ] Radiologist sees verification route dropdown when enabled
- [ ] Radiologist sees only senior radiologist dropdown when disabled
- [ ] Verification route dropdown has both options (QC Technician, Senior Radiologist)
- [ ] Senior radiologist dropdown shows when "Senior Radiologist" route is selected
- [ ] Senior radiologist dropdown hides when "QC Technician" route is selected
- [ ] Confirmation message changes based on selected route
- [ ] Toast notification reflects the chosen verification path
- [ ] Report can be finalized via QC Technician route
- [ ] Report can be finalized via Senior Radiologist route
- [ ] Critical cases work correctly with both routes

## Future Enhancements

1. **Default Route Configuration**: Allow admins to set a system-wide default route
2. **Role-Based Route Restrictions**: Restrict certain routes based on radiologist role/experience
3. **Route Analytics**: Track which routes are used most frequently
4. **Automatic Route Selection**: Auto-select QC route for junior radiologists
5. **Multi-Stage Approval**: Allow both QC and Senior review for high-complexity cases
6. **Route History**: Show approval route history in report audit trail

## Summary

The Dual Approval Configuration feature provides flexible workflow management, allowing healthcare facilities to implement quality gates while maintaining efficiency. It's fully backward compatible (disabled by default) and requires minimal configuration to activate.

**Key Benefits:**
- ✅ Flexible quality control workflow
- ✅ Admin-controlled configuration
- ✅ User-friendly dropdown selection
- ✅ Clear visual indicators
- ✅ Backward compatible
- ✅ Ready for backend integration
