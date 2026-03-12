# Quick Reference: Standardized Table Components

## 🚀 Quick Import

```tsx
import {
  WorklistTableShell,
  WorklistFilterBar,
  WorklistTable,
  WorklistTableHeader,
  WorklistTableRow,
  EmptyStateRow,
  PriorityBadge,
  ModalityBadge,
  UHIDCell,
  PatientNameCell,
  AgeCell,
  GenderCell,
  StudyDescriptionCell,
  ClinicalHistoryCell,
  DateTimeCell,
  TextCell,
  FilterConfig,
} from "../../app/components/tables"
import { TableBody, TableCell, TableHead, TableRow } from "../../app/components/ui/table"
```

---

## 📐 Component Sizes (From Figma)

| Component | Width | Height | Background | Border |
|-----------|-------|--------|------------|--------|
| Search Input | 192px | 36px | #f3f3f5 | #e5e5e5 |
| Filter Dropdown | 135-136px | 36px | #f3f3f5 | #e5e5e5 |
| Date Picker | 140px | 36px | default | default |

---

## 🎨 Component Cheat Sheet

### 1. Page Layout

```tsx
<WorklistTableShell
  title="Your Worklist Title"
  showDatePickers={true}
  fromDate={fromDate}
  toDate={toDate}
  onFromDateChange={setFromDate}
  onToDateChange={setToDate}
  filterBar={<WorklistFilterBar ... />}
>
  <WorklistTable>...</WorklistTable>
</WorklistTableShell>
```

### 2. Filter Configuration

```tsx
const filters: FilterConfig[] = [
  {
    id: "modality",
    label: "Modalities",
    placeholder: "Modalities",
    value: modalityFilter,
    onChange: setModalityFilter,
    width: "w-[135px]", // Optional
    options: [
      { value: "all", label: "Modalities" },
      { value: "CT", label: "CT" },
      // ...
    ],
  },
]

<WorklistFilterBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filters={filters}
  columnConfig={{ ... }} // Optional
/>
```

### 3. Table Structure

```tsx
<WorklistTable emptyColSpan={10}>
  <WorklistTableHeader>
    <TableRow>
      {isVisible("uhid") && <TableHead>UHID</TableHead>}
      {/* More headers */}
    </TableRow>
  </WorklistTableHeader>
  
  <TableBody>
    {data.length > 0 ? (
      data.map(item => (
        <WorklistTableRow key={item.id} isCritical={item.isCritical}>
          {/* Cells */}
        </WorklistTableRow>
      ))
    ) : (
      <EmptyStateRow message="No records found" colSpan={10} />
    )}
  </TableBody>
</WorklistTable>
```

### 4. Cell Components

```tsx
// UHID
<UHIDCell uhid={study.uhid} />

// Patient Name (with critical indicator)
<PatientNameCell name={study.patientName} isCritical={study.isCritical} />

// Age
<AgeCell age={study.age} />

// Gender
<GenderCell gender={study.gender} />

// Study Description (with accession number)
<StudyDescriptionCell 
  description={study.studyDescription} 
  accessionNumber={study.accessionNumber} 
/>

// Clinical History (truncated)
<ClinicalHistoryCell history={study.clinicalHistory} />

// Date/Time
<DateTimeCell date={study.studyDate} time={study.studyTime} />

// Generic Text (with fallback)
<TextCell text={study.someField} fallback="N/A" />
```

### 5. Badges

```tsx
// Priority Badge
<TableCell>
  <PriorityBadge priority={study.priority} /> 
  {/* Accepts: "STAT" | "Urgent" | "Routine" */}
</TableCell>

// Modality Badge
<TableCell>
  <ModalityBadge modality={study.modality} />
  {/* Any string: "CT", "MRI", "X-Ray", etc. */}
</TableCell>
```

---

## 🎯 Priority Badge Colors

| Priority | Background | Text | Hover |
|----------|------------|------|-------|
| STAT | Red (#dc2626) | White | Darker Red (#b91c1c) |
| Urgent | Destructive | White | Darker Destructive |
| Routine | Secondary/Gray | Default | Darker Gray |

---

## 📝 Common Patterns

### Pattern 1: Basic Worklist

```tsx
export function MyWorklist() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [modalityFilter, setModalityFilter] = React.useState("all")
  const [fromDate, setFromDate] = React.useState("")
  const [toDate, setToDate] = React.useState("")
  
  const filters: FilterConfig[] = [
    {
      id: "modality",
      label: "Modalities",
      placeholder: "Modalities",
      value: modalityFilter,
      onChange: setModalityFilter,
      options: [
        { value: "all", label: "Modalities" },
        { value: "CT", label: "CT" },
      ],
    },
  ]
  
  return (
    <WorklistTableShell
      title="My Worklist"
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      filterBar={
        <WorklistFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
        />
      }
    >
      <WorklistTable emptyColSpan={8}>
        {/* Table content */}
      </WorklistTable>
    </WorklistTableShell>
  )
}
```

### Pattern 2: With Column Configuration

```tsx
const columns: ColumnConfig[] = [
  { id: "uhid", label: "UHID", isFixed: true, defaultVisible: true },
  { id: "patientName", label: "Patient Name", isFixed: true, defaultVisible: true },
  { id: "age", label: "Age", isFixed: false, defaultVisible: true },
]

const { visibleColumns, toggleColumn, resetColumns, isVisible } = 
  useColumnVisibility("my-worklist-columns", columns)

<WorklistFilterBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filters={filters}
  columnConfig={{
    columns,
    visibleColumns,
    onToggleColumn: toggleColumn,
    onResetColumns: resetColumns,
    userRole: "radiologist",
  }}
/>
```

### Pattern 3: Conditional Columns

```tsx
<WorklistTableHeader>
  <TableRow>
    {isVisible("uhid") && <TableHead>UHID</TableHead>}
    {isVisible("patientName") && <TableHead>Patient Name</TableHead>}
    {isVisible("age") && <TableHead>Age</TableHead>}
  </TableRow>
</WorklistTableHeader>

<TableBody>
  {data.map(item => (
    <WorklistTableRow key={item.id}>
      {isVisible("uhid") && <UHIDCell uhid={item.uhid} />}
      {isVisible("patientName") && <PatientNameCell name={item.patientName} />}
      {isVisible("age") && <AgeCell age={item.age} />}
    </WorklistTableRow>
  ))}
</TableBody>
```

---

## ⚠️ Common Mistakes

### ❌ DON'T: Inline table without shell
```tsx
<PageShell>
  <div className="border-b px-6 py-3.5">...</div>
  <WorklistTable>...</WorklistTable>
</PageShell>
```

### ✅ DO: Use WorklistTableShell
```tsx
<WorklistTableShell title="..." filterBar={...}>
  <WorklistTable>...</WorklistTable>
</WorklistTableShell>
```

---

### ❌ DON'T: Manual cell styling
```tsx
<TableCell className="font-mono text-sm">{uhid}</TableCell>
```

### ✅ DO: Use specialized cells
```tsx
<UHIDCell uhid={uhid} />
```

---

### ❌ DON'T: Custom badge components
```tsx
<Badge className="bg-red-600 text-white">STAT</Badge>
```

### ✅ DO: Use PriorityBadge
```tsx
<PriorityBadge priority="STAT" />
```

---

## 🔗 Related Files

- Components: `/src/app/components/tables/`
- Migration Guide: `/STANDARDIZED_TABLE_MIGRATION_GUIDE.md`
- Status Document: `/STANDARDIZED_COMPONENTS_STATUS.md`
- Example: `/src/pages/quality-control/QualityControlWorklist.tsx`

---

## 💡 Pro Tips

1. **Always use the index export**: Import from `/tables` not individual files
2. **Measure twice, cut once**: Check column count for `emptyColSpan`
3. **Consistent widths**: Use `w-[135px]` or `w-[136px]` for filters
4. **Critical rows**: Pass `isCritical` to WorklistTableRow for red highlight
5. **Empty states**: Always provide EmptyStateRow for better UX
6. **Column visibility**: Use `isVisible()` consistently for headers AND cells

---

**Need Help?** Refer to `/STANDARDIZED_TABLE_MIGRATION_GUIDE.md` for detailed examples!
