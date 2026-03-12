# Standardized Table + Filter UI Migration Guide

## Overview
This guide explains how to migrate ALL existing worklists and tables in RadiologyIQ to use the new standardized components based on the Figma design system.

## New Standardized Components

### Core Components Location
- `/src/app/components/tables/worklist-table-shell.tsx` - Page layout wrapper
- `/src/app/components/tables/worklist-filter-bar.tsx` - Filter bar with search and dropdowns
- `/src/app/components/tables/worklist-table.tsx` - Table structure
- `/src/app/components/badges/priority-badge.tsx` - Priority badges (STAT, Urgent, Routine)
- `/src/app/components/badges/modality-badge.tsx` - Modality badges (CT, MRI, etc.)
- `/src/app/components/tables/table-cells.tsx` - Specialized table cells

---

## Migration Steps

### Step 1: Update Imports

**REMOVE these old imports:**
```tsx
import { PageShell } from "../../app/components/layouts/page-shell"
import { PageHeader } from "../../app/components/blocks/page-header"
import { Card, CardContent } from "../../app/components/ui/card"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../app/components/ui/select"
```

**ADD these new imports:**
```tsx
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
import { Badge } from "../../app/components/ui/badge"
import { TableBody, TableCell, TableHead, TableRow } from "../../app/components/ui/table"
```

---

### Step 2: Configure Filters

Replace individual filter dropdowns with a `FilterConfig` array:

**OLD WAY:**
```tsx
<Select value={modalityFilter} onValueChange={setModalityFilter}>
  <SelectTrigger className="w-[135px] h-9">
    <SelectValue placeholder="Modalities" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Modalities</SelectItem>
    <SelectItem value="CT">CT</SelectItem>
  </SelectContent>
</Select>
```

**NEW WAY:**
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
      { value: "MRI", label: "MRI" },
      { value: "X-Ray", label: "X-Ray" },
      { value: "Ultrasound", label: "Ultrasound" },
    ],
  },
  // Add more filters...
]
```

---

### Step 3: Replace Page Structure

**OLD WAY:**
```tsx
return (
  <PageShell>
    <div className="border-b bg-white px-6 py-3.5">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold">Worklist Title</h1>
        <Input type="date" value={fromDate} onChange={...} />
        <Input type="date" value={toDate} onChange={...} />
      </div>
    </div>
    
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">
        {/* Filter bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-[192px]">
            <Search className="..." />
            <Input placeholder="Search" ... />
          </div>
          {/* More filters */}
        </div>
        
        {/* Table */}
        <div className="rounded-md border overflow-x-auto bg-white">
          <Table>...</Table>
        </div>
      </div>
    </div>
  </PageShell>
)
```

**NEW WAY:**
```tsx
return (
  <WorklistTableShell
    title="Worklist Title"
    showDatePickers={true}
    fromDate={fromDate}
    toDate={toDate}
    onFromDateChange={setFromDate}
    onToDateChange={setToDate}
    filterBar={
      <WorklistFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search"
        filters={filterConfigs}
        columnConfig={{
          columns: yourColumns,
          visibleColumns: visibleColumns,
          onToggleColumn: toggleColumn,
          onResetColumns: resetColumns,
          userRole: "radiologist",
        }}
      />
    }
  >
    <WorklistTable emptyMessage="No studies found" emptyColSpan={10}>
      {/* Table content */}
    </WorklistTable>
  </WorklistTableShell>
)
```

---

### Step 4: Update Table Structure

**OLD WAY:**
```tsx
<div className="rounded-md border overflow-x-auto bg-white">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>UHID</TableHead>
        {/* More headers */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.uhid}</TableCell>
          {/* More cells */}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

**NEW WAY:**
```tsx
<WorklistTable emptyMessage="No records found" emptyColSpan={columnCount}>
  <WorklistTableHeader>
    <TableRow>
      {isVisible("uhid") && <TableHead>UHID</TableHead>}
      {isVisible("patientName") && <TableHead>Patient Name</TableHead>}
      {/* More conditional headers */}
    </TableRow>
  </WorklistTableHeader>
  <TableBody>
    {filteredData.length > 0 ? (
      filteredData.map(item => (
        <WorklistTableRow key={item.id} isCritical={item.isCritical}>
          {isVisible("uhid") && <UHIDCell uhid={item.uhid} />}
          {isVisible("patientName") && (
            <PatientNameCell name={item.patientName} isCritical={item.isCritical} />
          )}
          {/* More conditional cells */}
        </WorklistTableRow>
      ))
    ) : (
      <EmptyStateRow message="No records found" colSpan={columnCount} />
    )}
  </TableBody>
</WorklistTable>
```

---

### Step 5: Use Specialized Cell Components

Replace manual cell rendering with standardized cell components:

#### UHID Cell
```tsx
// OLD
<TableCell className="font-mono text-sm">{study.uhid}</TableCell>

// NEW
<UHIDCell uhid={study.uhid} />
```

#### Patient Name Cell
```tsx
// OLD
<TableCell>
  <div className="flex items-center gap-2">
    {study.isCritical && <AlertCircle className="h-4 w-4 text-red-500" />}
    <span className="font-medium">{study.patientName}</span>
  </div>
</TableCell>

// NEW
<PatientNameCell name={study.patientName} isCritical={study.isCritical} />
```

#### Age Cell
```tsx
// OLD
<TableCell className="text-sm">{study.age}Y</TableCell>

// NEW
<AgeCell age={study.age} />
```

#### Study Description Cell
```tsx
// OLD
<TableCell className="max-w-[250px]">
  <div className="text-sm font-medium">{study.studyDescription}</div>
  <div className="text-xs text-muted-foreground">{study.accessionNumber}</div>
</TableCell>

// NEW
<StudyDescriptionCell 
  description={study.studyDescription} 
  accessionNumber={study.accessionNumber} 
/>
```

#### Clinical History Cell
```tsx
// OLD
<TableCell className="max-w-[200px]">
  <div className="text-xs text-muted-foreground truncate" title={study.clinicalHistory}>
    {study.clinicalHistory}
  </div>
</TableCell>

// NEW
<ClinicalHistoryCell history={study.clinicalHistory} />
```

#### Date/Time Cell
```tsx
// OLD
<TableCell className="text-sm">
  {study.studyDate} {study.studyTime}
</TableCell>

// NEW
<DateTimeCell date={study.studyDate} time={study.studyTime} />
```

---

### Step 6: Use Badge Components

#### Priority Badge
```tsx
// OLD
<TableCell>
  <Badge className={study.priority === "STAT" ? "bg-red-600 text-white" : "..."}>
    {study.priority}
  </Badge>
</TableCell>

// NEW
<TableCell>
  <PriorityBadge priority={study.priority} />
</TableCell>
```

#### Modality Badge
```tsx
// OLD
<TableCell>
  <Badge variant="outline">{study.modality}</Badge>
</TableCell>

// NEW
<TableCell>
  <ModalityBadge modality={study.modality} />
</TableCell>
```

---

## Files to Migrate

### High Priority (Worklists)
1. ✅ `/src/pages/quality-control/QualityControlWorklist.tsx` - **COMPLETED**
2. ⏳ `/src/pages/radiologist/ReportingWorklist.tsx` - Radiologist Worklist
3. ⏳ `/src/pages/admin/AdminWorklist.tsx` - Admin Imaging Worklist
4. ⏳ `/src/pages/superadmin/SuperAdminWorklist.tsx` - Super Admin Worklist
5. ⏳ `/src/pages/technologist/TechnologistWorklist.tsx` - Technician Worklist
6. ⏳ `/src/pages/senior-radiologist/Worklist.tsx` - Senior Radiologist Worklist
7. ⏳ `/src/pages/senior-radiologist/AuthorizationWorklist.tsx` - Authorization Worklist

### Medium Priority (Admin Tables)
8. ⏳ `/src/pages/admin/UserManagement.tsx` - User Management Table
9. ⏳ `/src/pages/superadmin/FacilityManagement.tsx` - Facility Management Table
10. ⏳ `/src/pages/admin/AnalyticsDashboard.tsx` - Analytics Tables (if applicable)
11. ⏳ `/src/pages/admin/AuditLogs.tsx` - Audit Log Table

---

## Design System Specifications

### Filter Bar
- **Search Input**: 192px width, 36px height
- **Dropdown Filters**: 135-136px width, 36px height
- **Gap**: 12px between elements
- **Background**: #f3f3f5
- **Border**: #e5e5e5
- **Columns Button**: Right-aligned with `ml-auto`

### Table
- **Border**: Rounded corners, 1px solid
- **Header**: Thick bottom border (`border-b-4`)
- **Row Height**: Consistent with proper padding
- **Hover**: Subtle background change
- **Critical Rows**: Light red background (`bg-red-50`)

### Badges
- **Priority STAT**: Red background (#dc2626), white text
- **Priority Urgent**: Destructive variant
- **Priority Routine**: Secondary/gray variant
- **Modality**: Outline variant

### Typography
- **UHID**: Monospace font
- **Patient Name**: Bold font-medium
- **Study Description**: Bold primary, light secondary
- **Clinical History**: Small text, truncated

---

## Benefits

1. ✅ **Consistency**: All tables look identical across the app
2. ✅ **Maintainability**: Update once, changes everywhere
3. ✅ **Accessibility**: Built-in ARIA labels and keyboard navigation
4. ✅ **Responsiveness**: Graceful wrapping and horizontal scroll
5. ✅ **Developer Experience**: Less code, clearer intent
6. ✅ **Design System Compliance**: Matches Figma screenshot exactly

---

## Testing Checklist

After migration, verify:
- [ ] Filters work correctly
- [ ] Search functionality intact
- [ ] Column visibility toggle works
- [ ] Date pickers function properly
- [ ] Table sorting (if implemented)
- [ ] Row click navigation
- [ ] Critical indicators display
- [ ] Empty states show correctly
- [ ] Responsive behavior on mobile
- [ ] Badge colors are correct
- [ ] All text truncates properly

---

## Example: Complete Migration

See `/src/pages/quality-control/QualityControlWorklist.tsx` for a fully migrated worklist example.
