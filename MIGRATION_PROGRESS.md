# Standardized Table UI - Migration Progress

## ✅ COMPLETED MIGRATIONS

### 1. Quality Control Technician Worklist ✅
- **File**: `/src/pages/quality-control/QualityControlWorklist.tsx`
- **Status**: FULLY MIGRATED
- **Components Used**:
  - WorklistTableShell
  - WorklistFilterBar
  - WorklistTable, WorklistTableHeader, WorklistTableRow
  - PriorityBadge, ModalityBadge
  - All specialized cell components (UHIDCell, PatientNameCell, etc.)

### 2. Admin User Management ✅
- **File**: `/src/pages/admin/UserManagement.tsx`
- **Status**: FULLY MIGRATED
- **Components Used**:
  - WorklistFilterBar (with custom widths for role/status filters)
  - WorklistTable, WorklistTableHeader
- **Notes**: Filter bar now uses standardized #f3f3f5 background and consistent sizing

---

## ⏳ PENDING MIGRATIONS (6 Worklists Remaining)

These files still need to be migrated to use the standardized components:

### High Priority

1. **Radiologist Worklist** ⏳
   - File: `/src/pages/radiologist/ReportingWorklist.tsx`
   - Estimated Time: 2-3 hours
   - Impact: CRITICAL (highest traffic page)

2. **Admin Imaging Worklist** ⏳
   - File: `/src/pages/admin/AdminWorklist.tsx`
   - Estimated Time: 2-3 hours
   - Impact: HIGH

3. **Technician/Technologist Worklist** ⏳
   - File: `/src/pages/technologist/TechnologistWorklist.tsx`
   - Estimated Time: 2-3 hours
   - Impact: HIGH

4. **Senior Radiologist Worklist** ⏳
   - File: `/src/pages/senior-radiologist/Worklist.tsx`
   - Estimated Time: 2-3 hours
   - Impact: HIGH

5. **Senior Radiologist Authorization Worklist** ⏳
   - File: `/src/pages/senior-radiologist/AuthorizationWorklist.tsx`
   - Estimated Time: 2-3 hours
   - Impact: MEDIUM

6. **Super Admin Worklist** ⏳
   - File: `/src/pages/superadmin/SuperAdminWorklist.tsx`
   - Estimated Time: 2-3 hours
   - Impact: MEDIUM

### Medium/Low Priority

7. **Super Admin Facility Management** ⏳
   - File: `/src/pages/superadmin/FacilityManagement.tsx`
   - Estimated Time: 2 hours
   - Impact: MEDIUM

8. **Audit Logs Table** ⏳
   - File: `/src/pages/admin/AuditLogs.tsx`
   - Estimated Time: 1-2 hours
   - Impact: LOW

9. **Analytics Dashboard Tables** ⏳
   - File: `/src/pages/admin/AnalyticsDashboard.tsx`
   - Estimated Time: Variable
   - Impact: LOW

---

## 📊 Overall Progress

**Total Pages**: 9 pages with tables/worklists
**Completed**: 2 pages (22%)
**Remaining**: 7 pages (78%)

---

## 🎯 Migration Instructions

For each pending worklist, follow these steps:

### Step 1: Update Imports
```tsx
// Add these imports
import { WorklistTableShell } from "../../app/components/tables/worklist-table-shell"
import { WorklistFilterBar, FilterConfig } from "../../app/components/tables/worklist-filter-bar"
import { WorklistTable, WorklistTableHeader, WorklistTableRow, EmptyStateRow } from "../../app/components/tables/worklist-table"
import { PriorityBadge } from "../../app/components/badges/priority-badge"
import { ModalityBadge } from "../../app/components/badges/modality-badge"
import { 
  UHIDCell, 
  PatientNameCell, 
  AgeCell, 
  GenderCell, 
  StudyDescriptionCell, 
  ClinicalHistoryCell, 
  DateTimeCell, 
  TextCell 
} from "../../app/components/tables/table-cells"
```

### Step 2: Replace PageShell Structure
```tsx
// OLD
<PageShell>
  <div className="border-b bg-white px-6 py-3.5">
    <h1>Title</h1>
    <Input type="date" ... />
  </div>
  <div className="flex-1 overflow-auto">
    <div className="container mx-auto max-w-7xl px-6 py-6">
      {/* Filters */}
      {/* Table */}
    </div>
  </div>
</PageShell>

// NEW
<WorklistTableShell
  title="Worklist Title"
  fromDate={fromDate}
  toDate={toDate}
  onFromDateChange={setFromDate}
  onToDateChange={setToDate}
  filterBar={<WorklistFilterBar ... />}
>
  <WorklistTable>...</WorklistTable>
</WorklistTableShell>
```

### Step 3: Create Filter Configuration
```tsx
const filterConfigs: FilterConfig[] = [
  {
    id: "modality",
    label: "Modalities",
    placeholder: "Modalities",
    value: modalityFilter,
    onChange: setModalityFilter,
    width: "w-[135px]",
    options: [
      { value: "all", label: "Modalities" },
      { value: "CT", label: "CT" },
      // ...
    ],
  },
  // Add more filters...
]
```

### Step 4: Replace Table Cells
```tsx
// OLD
<TableCell className="font-mono text-sm">{study.uhid}</TableCell>

// NEW
<UHIDCell uhid={study.uhid} />
```

### Step 5: Replace Badges
```tsx
// OLD
<Badge className="bg-red-600">STAT</Badge>

// NEW
<PriorityBadge priority={study.priority} />
```

---

## 🔧 Standardized Components Available

- **WorklistTableShell** - Page layout wrapper
- **WorklistFilterBar** - Filter bar with search + dropdowns
- **WorklistTable** - Table container
- **WorklistTableHeader** - Table header with thick border
- **WorklistTableRow** - Table row with critical highlighting
- **EmptyStateRow** - Empty state display
- **PriorityBadge** - STAT/Urgent/Routine badges
- **ModalityBadge** - CT/MRI/X-Ray badges
- **UHIDCell** - Monospace UHID display
- **PatientNameCell** - Bold name with critical indicator
- **AgeCell** - "45Y" format
- **GenderCell** - Simple gender display
- **StudyDescriptionCell** - Description + accession number
- **ClinicalHistoryCell** - Truncated with tooltip
- **DateTimeCell** - Combined date/time
- **TextCell** - Generic text with fallback

---

## 📚 Documentation

- **Migration Guide**: `/STANDARDIZED_TABLE_MIGRATION_GUIDE.md`
- **Quick Reference**: `/QUICK_REFERENCE_STANDARDIZED_TABLES.md`
- **Component Status**: `/STANDARDIZED_COMPONENTS_STATUS.md`
- **Example**: `/src/pages/quality-control/QualityControlWorklist.tsx`

---

## ⚠️ Important Notes

1. **Consistency is Key**: All worklists MUST use the same components to maintain visual consistency
2. **Design System Compliance**: Components match Figma screenshot specifications exactly
3. **Column Visibility**: Use `isVisible()` for both headers AND cells
4. **Empty Col Span**: Count all visible columns for proper empty state display
5. **Critical Rows**: Pass `isCritical` prop to WorklistTableRow for red highlighting

---

Last Updated: February 6, 2026
Progress: 2/9 pages migrated (22%)
