import * as React from "react"
import { PageShell } from "../../app/components/layouts/page-shell"
import { PageHeader } from "../../app/components/blocks/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card"
import { ColumnConfiguration } from "../../app/components/blocks/column-configuration"
import { useColumnVisibility, ColumnConfig } from "../../hooks/useColumnVisibility"
import { Badge } from "../../app/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../app/components/ui/table"

/**
 * Column Settings Demo Page
 * 
 * This page demonstrates the medical SaaS-style column configuration component
 * with role-specific defaults for Radiologist and Technician roles.
 */

// Sample column configuration for demonstration
const sampleColumns: ColumnConfig[] = [
  // Fixed columns (always visible, cannot be hidden)
  { id: "uhid", label: "UHID", isFixed: true, defaultVisible: true },
  { id: "patientName", label: "Patient Name", isFixed: true, defaultVisible: true },
  { id: "modality", label: "Modality", isFixed: true, defaultVisible: true },
  { id: "studyDescription", label: "Study Description", isFixed: true, defaultVisible: true },
  { id: "status", label: "Status", isFixed: true, defaultVisible: true },
  { id: "action", label: "Action", isFixed: true, defaultVisible: true },
  
  // Configurable columns (can be shown/hidden)
  { id: "ageGender", label: "Age/Gender", isFixed: false, defaultVisible: true },
  { id: "phoneNo", label: "Phone No", isFixed: false, defaultVisible: false },
  { id: "tests", label: "Tests", isFixed: false, defaultVisible: false },
  { id: "clinicalHistory", label: "Clinical History", isFixed: false, defaultVisible: false },
  { id: "priority", label: "Priority", isFixed: false, defaultVisible: true },
  { id: "studyDate", label: "Study Date/Time", isFixed: false, defaultVisible: true },
  { id: "reportGeneratedDate", label: "Report Generated Date", isFixed: false, defaultVisible: false },
  { id: "reportValidatedDate", label: "Report Validated Date", isFixed: false, defaultVisible: false },
]

// Sample data
const sampleData = [
  {
    id: "1",
    uhid: "UHID-45678",
    patientName: "Sarah Johnson",
    age: 45,
    gender: "F",
    phoneNo: "+1 (555) 123-4567",
    modality: "CT",
    studyDescription: "CT Chest with Contrast",
    tests: "Contrast Enhanced CT",
    priority: "STAT",
    status: "In Progress",
    studyDate: "2024-01-14 09:30",
    clinicalHistory: "Suspected pulmonary embolism",
  },
  {
    id: "2",
    uhid: "UHID-45679",
    patientName: "Robert Martinez",
    age: 62,
    gender: "M",
    phoneNo: "+1 (555) 234-5678",
    modality: "MRI",
    studyDescription: "MRI Brain without Contrast",
    tests: "MRI Brain",
    priority: "Routine",
    status: "Completed",
    studyDate: "2024-01-13 10:15",
    reportGeneratedDate: "2024-01-13 14:30",
    reportValidatedDate: "2024-01-13 16:45",
    clinicalHistory: "Chronic headaches, rule out mass",
  },
  {
    id: "3",
    uhid: "UHID-45680",
    patientName: "Linda Anderson",
    age: 38,
    gender: "F",
    phoneNo: "+1 (555) 345-6789",
    modality: "X-Ray",
    studyDescription: "Chest X-Ray PA & Lateral",
    tests: "X-Ray Chest",
    priority: "Routine",
    status: "Scheduled",
    studyDate: "2024-01-14 11:00",
    clinicalHistory: "Routine pre-operative clearance",
  },
]

export function ColumnSettingsDemo() {
  const [selectedRole, setSelectedRole] = React.useState<"radiologist" | "technician">("radiologist")
  
  const { visibleColumns, toggleColumn, resetColumns, isVisible } = useColumnVisibility(
    `demo-worklist-${selectedRole}`,
    sampleColumns
  )

  // Count visible columns
  const visibleCount = sampleColumns.filter(col => isVisible(col.id)).length
  const fixedCount = sampleColumns.filter(col => col.isFixed).length
  const configurableCount = sampleColumns.filter(col => !col.isFixed).length
  const visibleConfigurableCount = sampleColumns.filter(col => !col.isFixed && isVisible(col.id)).length

  return (
    <PageShell>
      <PageHeader 
        title="Column Settings Demo" 
        subtitle="Medical SaaS-style table customization for Radiology worklists"
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-8 space-y-6">
          
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This demo showcases the refined column configuration dropdown designed for RadiologyIQ reporting dashboards. 
                The component features:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>Right-aligned dropdown</strong> to prevent off-screen overflow</li>
                <li><strong>Fixed 400px height</strong> with vertical scrollbar for long lists</li>
                <li><strong>Section headers:</strong> "FIXED COLUMNS" and "CONFIGURABLE COLUMNS"</li>
                <li><strong>Fixed columns</strong> shown with grayed-out checkmarks (non-interactive)</li>
                <li><strong>Configurable columns</strong> with blue interactive checkboxes</li>
                <li><strong>Real-time table updates</strong> when toggling column visibility</li>
                <li><strong>Minimalist style</strong> matching "All Statuses" dropdown (14px typography, white background, subtle shadow)</li>
                <li><strong>Dense, clean layout</strong> optimized for high-efficiency workflows</li>
              </ul>
            </CardContent>
          </Card>

          {/* Role Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select User Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRole("radiologist")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRole === "radiologist"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Radiologist
                </button>
                <button
                  onClick={() => setSelectedRole("technician")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRole === "technician"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Technician
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Each role has different column visibility defaults. Try switching roles and clicking "Reset to Role Default" to see the differences.
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{visibleCount}</p>
                  <p className="text-sm text-muted-foreground mt-1">Visible Columns</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{fixedCount}</p>
                  <p className="text-sm text-muted-foreground mt-1">Fixed Columns</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{configurableCount}</p>
                  <p className="text-sm text-muted-foreground mt-1">Configurable Columns</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{visibleConfigurableCount}</p>
                  <p className="text-sm text-muted-foreground mt-1">Visible Configurable</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Table with Column Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sample Worklist Table</CardTitle>
                <ColumnConfiguration
                  columns={sampleColumns}
                  visibleColumns={visibleColumns}
                  onToggleColumn={toggleColumn}
                  onResetColumns={resetColumns}
                  userRole={selectedRole}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isVisible("uhid") && <TableHead>UHID</TableHead>}
                      {isVisible("patientName") && <TableHead>Patient Name</TableHead>}
                      {isVisible("ageGender") && <TableHead>Age/Gender</TableHead>}
                      {isVisible("phoneNo") && <TableHead>Phone No</TableHead>}
                      {isVisible("modality") && <TableHead>Modality</TableHead>}
                      {isVisible("studyDescription") && <TableHead>Study Description</TableHead>}
                      {isVisible("tests") && <TableHead>Tests</TableHead>}
                      {isVisible("clinicalHistory") && <TableHead>Clinical History</TableHead>}
                      {isVisible("priority") && <TableHead>Priority</TableHead>}
                      {isVisible("status") && <TableHead>Status</TableHead>}
                      {isVisible("studyDate") && <TableHead>Study Date & Time</TableHead>}
                      {isVisible("reportGeneratedDate") && <TableHead>Report Generated</TableHead>}
                      {isVisible("reportValidatedDate") && <TableHead>Report Validated</TableHead>}
                      {isVisible("action") && <TableHead>Action</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleData.map((row) => (
                      <TableRow key={row.id}>
                        {isVisible("uhid") && <TableCell className="font-mono text-sm">{row.uhid}</TableCell>}
                        {isVisible("patientName") && <TableCell className="font-medium">{row.patientName}</TableCell>}
                        {isVisible("ageGender") && <TableCell className="text-sm">{`${row.age}/${row.gender}`}</TableCell>}
                        {isVisible("phoneNo") && <TableCell className="text-sm">{row.phoneNo}</TableCell>}
                        {isVisible("modality") && <TableCell><Badge variant="outline">{row.modality}</Badge></TableCell>}
                        {isVisible("studyDescription") && <TableCell className="max-w-[200px] text-sm">{row.studyDescription}</TableCell>}
                        {isVisible("tests") && <TableCell className="text-sm">{row.tests}</TableCell>}
                        {isVisible("clinicalHistory") && <TableCell className="max-w-[200px] text-sm truncate">{row.clinicalHistory}</TableCell>}
                        {isVisible("priority") && <TableCell><Badge variant={row.priority === "STAT" ? "destructive" : "secondary"}>{row.priority}</Badge></TableCell>}
                        {isVisible("status") && <TableCell><Badge variant="outline">{row.status}</Badge></TableCell>}
                        {isVisible("studyDate") && <TableCell className="text-xs whitespace-nowrap">{row.studyDate}</TableCell>}
                        {isVisible("reportGeneratedDate") && <TableCell className="text-xs">{row.reportGeneratedDate || "N/A"}</TableCell>}
                        {isVisible("reportValidatedDate") && <TableCell className="text-xs">{row.reportValidatedDate || "N/A"}</TableCell>}
                        {isVisible("action") && <TableCell><Badge>View</Badge></TableCell>}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Design Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Design Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Typography</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Header title: 14px (font-semibold)</li>
                  <li>Header subtitle: 12px (text-xs)</li>
                  <li>Section labels: 11px uppercase (font-semibold, tracking-wide)</li>
                  <li>Column labels: 13px (leading-none)</li>
                  <li>Button text: 12px (text-xs)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Spacing & Layout</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Popover width: 320px</li>
                  <li>Max scrollable height: 400px</li>
                  <li>Popover offset from trigger: 8px</li>
                  <li>Checkbox size: 14px (3.5 × 3.5)</li>
                  <li>Icon sizes: 12-14px</li>
                  <li>Dense padding: 4-16px throughout</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Visual Elements</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Header background: muted/30</li>
                  <li>Footer background: muted/20</li>
                  <li>Hover state on configurable items: accent/50</li>
                  <li>Fixed columns opacity: 60%</li>
                  <li>Lock icon for fixed columns section</li>
                  <li>Smooth transitions on all interactive elements</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Functionality</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Click anywhere on configurable row to toggle</li>
                  <li>Fixed columns cannot be toggled (disabled state)</li>
                  <li>Role-specific reset button with dynamic label</li>
                  <li>localStorage persistence per role</li>
                  <li>Scrollable list for many columns</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

export default ColumnSettingsDemo