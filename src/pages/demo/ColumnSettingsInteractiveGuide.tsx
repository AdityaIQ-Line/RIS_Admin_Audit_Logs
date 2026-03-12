import * as React from "react"
import { PageShell } from "../../app/components/layouts/page-shell"
import { PageHeader } from "../../app/components/blocks/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "../../app/components/ui/card"
import { Badge } from "../../app/components/ui/badge"
import { Check, Lock, Star } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../lib/constants"

/**
 * Column Settings Interactive Guide
 * 
 * Comprehensive documentation for the high-fidelity interactive prototype
 * of the Column Customization feature in RadiologyIQ.
 */

export function ColumnSettingsInteractiveGuide() {
  return (
    <PageShell>
      <PageHeader 
        title="Column Customization - Interactive Guide" 
        subtitle="High-fidelity prototype specifications for Radiology Worklist"
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-5xl px-6 py-8 space-y-8">
          
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Requirements Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="default">1</Badge>
                  Variable Mapping
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Each configurable column is mapped to a Boolean variable stored in React state and localStorage:
                </p>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <code className="text-xs block">show_Phone: visibleColumns.has("phoneNo")</code>
                  <code className="text-xs block">show_History: visibleColumns.has("clinicalHistory")</code>
                  <code className="text-xs block">show_Priority: visibleColumns.has("priority")</code>
                  <code className="text-xs block">show_Tests: visibleColumns.has("tests")</code>
                  <code className="text-xs block">show_AgeGender: visibleColumns.has("ageGender")</code>
                  <code className="text-xs block">show_StudyDate: visibleColumns.has("studyDate")</code>
                  <code className="text-xs block">show_ReportGeneratedDate: visibleColumns.has("reportGeneratedDate")</code>
                  <code className="text-xs block">show_ReportValidatedDate: visibleColumns.has("reportValidatedDate")</code>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="default">2</Badge>
                  Toggle Logic
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  When a user clicks on a configurable column checkbox, the toggle logic executes:
                </p>
                <div className="bg-muted/30 rounded-lg p-4">
                  <code className="text-xs block mb-2">onClick → toggleColumn(columnId)</code>
                  <code className="text-xs block mb-2">↓</code>
                  <code className="text-xs block mb-2">if (visibleColumns.has(columnId)) {'{'}</code>
                  <code className="text-xs block ml-4 mb-2">  visibleColumns.delete(columnId)  // Hide column</code>
                  <code className="text-xs block mb-2">{'}'} else {'{'}</code>
                  <code className="text-xs block ml-4 mb-2">  visibleColumns.add(columnId)     // Show column</code>
                  <code className="text-xs block">{'}'}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  <strong>Result:</strong> Set variable to !variable (instant toggle)
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="default">3</Badge>
                  Auto-Layout Table Behavior
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  The table uses conditional rendering with the <code className="text-xs bg-muted px-1 py-0.5 rounded">isVisible()</code> helper:
                </p>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <code className="text-xs block">{'{'} isVisible("phoneNo") && <TableHead>Phone No</TableHead> {'}'}</code>
                  <code className="text-xs block">{'{'} isVisible("clinicalHistory") && <TableHead>Clinical History</TableHead> {'}'}</code>
                  <code className="text-xs block">{'{'} isVisible("priority") && <TableHead>Priority</TableHead> {'}'}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  <strong>Behavior:</strong> When a variable becomes <code className="bg-muted px-1 py-0.5 rounded">false</code>, 
                  the column immediately disappears and remaining columns automatically shift to fill the space (auto-layout).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visual Refinement */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Refinement Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Scrolling</Badge>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Fixed height:</strong> 400px dropdown body</li>
                  <li><strong>Overflow:</strong> Vertical scrolling enabled with <code className="text-xs">overflow-y-auto</code></li>
                  <li><strong>Scrollbar visibility:</strong> Custom styled scrollbar (8px width, muted color)</li>
                  <li><strong>Scroll behavior:</strong> Smooth scrolling with <code className="text-xs">scrollbar-thin</code> class</li>
                  <li><strong>Cross-browser:</strong> Works on Chrome, Safari, Firefox, and Edge</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Sticky Headers</Badge>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Position:</strong> <code className="text-xs">sticky top-0</code> for both section headers</li>
                  <li><strong>"FIXED COLUMNS" header:</strong> Lock icon + uppercase text, sticky during scroll</li>
                  <li><strong>"CONFIGURABLE COLUMNS" header:</strong> Uppercase text, sticky during scroll</li>
                  <li><strong>Background:</strong> <code className="text-xs">bg-background</code> with <code className="text-xs">z-10</code> to stay on top</li>
                  <li><strong>Visual separation:</strong> Border bottom on headers for clear demarcation</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Fixed Column States</Badge>
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg opacity-60">
                    <Check className="h-4 w-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                    <span className="text-sm">UHID</span>
                    <Badge variant="outline" className="ml-auto">Fixed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg opacity-60">
                    <Check className="h-4 w-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                    <span className="text-sm">Patient Name</span>
                    <Badge variant="outline" className="ml-auto">Fixed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg opacity-60">
                    <Check className="h-4 w-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                    <span className="text-sm">Modality</span>
                    <Badge variant="outline" className="ml-auto">Fixed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg opacity-60">
                    <Check className="h-4 w-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                    <span className="text-sm">Study Description</span>
                    <Badge variant="outline" className="ml-auto">Fixed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg opacity-60">
                    <Check className="h-4 w-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                    <span className="text-sm">Status</span>
                    <Badge variant="outline" className="ml-auto">Fixed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg opacity-60">
                    <Check className="h-4 w-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                    <span className="text-sm">Action</span>
                    <Badge variant="outline" className="ml-auto">Fixed</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  <strong>Visual treatment:</strong> 60% opacity, checkmark icon, cursor-not-allowed, non-interactive
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Role-Specific Context */}
          <Card>
            <CardHeader>
              <CardTitle>Role-Specific Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge>Radiologist</Badge>
                </h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE_WIDTH} fill="currentColor" />
                    <span className="text-sm font-medium">Clinical History</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    Highlighted with star icon, primary color ring, and bold font weight. 
                    Essential for radiologists to make informed diagnostic decisions.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Badge>Technician</Badge>
                </h4>
                <div className="space-y-3">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE_WIDTH} fill="currentColor" />
                      <span className="text-sm font-medium">Phone No</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Quick access for patient communication and appointment coordination.
                    </p>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE_WIDTH} fill="currentColor" />
                      <span className="text-sm font-medium">Tests</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Critical for technicians to know which tests to perform and assign.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h5 className="text-xs font-semibold mb-2">Implementation Details:</h5>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Role-specific columns have <code className="bg-muted px-1 py-0.5 rounded">ring-1 ring-primary/20</code></li>
                  <li>Hover state: <code className="bg-muted px-1 py-0.5 rounded">hover:bg-primary/10</code> (instead of accent)</li>
                  <li>Star icon (★) appears next to label in primary color</li>
                  <li>Font weight increased to <code className="bg-muted px-1 py-0.5 rounded">font-medium</code></li>
                  <li>Tooltip shows: "Recommended for [role]s"</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="text-sm font-semibold mb-2">✅ Interactive Features</h5>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Boolean variable mapping for all configurable columns</li>
                    <li>Toggle logic with instant feedback (Set variable to !variable)</li>
                    <li>Auto-layout table with conditional rendering</li>
                    <li>LocalStorage persistence across sessions</li>
                    <li>Real-time state updates</li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-semibold mb-2">✅ Visual Refinements</h5>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>400px fixed height with vertical scrolling</li>
                    <li>Visible custom scrollbar (8px, muted styling)</li>
                    <li>Sticky section headers during scroll</li>
                    <li>Fixed columns with locked state (60% opacity)</li>
                    <li>Role-specific highlighting with star icons</li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-semibold mb-2">✅ Role-Specific Context</h5>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Radiologist: Clinical History highlighted</li>
                    <li>Technician: Phone No and Tests highlighted</li>
                    <li>Visual indicators (★, ring, bold font)</li>
                    <li>Contextual tooltips</li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-semibold mb-2">✅ Fixed Column States</h5>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>UHID, Patient Name (always visible)</li>
                    <li>Modality, Study Description (always visible)</li>
                    <li>Status, Action (always visible)</li>
                    <li>Lock icon in header</li>
                    <li>Non-interactive with disabled cursor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Architecture */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold mb-2">File Structure:</h5>
                <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                  <code className="text-xs block">/src/app/components/blocks/column-configuration.tsx</code>
                  <code className="text-xs block text-muted-foreground ml-4">↳ Main dropdown component with role-specific highlighting</code>
                  <code className="text-xs block mt-2">/src/hooks/useColumnVisibility.ts</code>
                  <code className="text-xs block text-muted-foreground ml-4">↳ Custom hook for state management and localStorage</code>
                  <code className="text-xs block mt-2">/src/styles/index.css</code>
                  <code className="text-xs block text-muted-foreground ml-4">↳ Custom scrollbar utilities</code>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold mb-2">Key Functions:</h5>
                <div className="space-y-3">
                  <div className="bg-muted/20 rounded-lg p-3">
                    <code className="text-xs font-semibold block mb-1">toggleColumn(columnId: string)</code>
                    <p className="text-xs text-muted-foreground">
                      Implements toggle logic - sets variable to !variable and updates localStorage
                    </p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <code className="text-xs font-semibold block mb-1">isVisible(columnId: string)</code>
                    <p className="text-xs text-muted-foreground">
                      Returns boolean for conditional rendering in table (always true for fixed columns)
                    </p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <code className="text-xs font-semibold block mb-1">getColumnVariable(columnId: string)</code>
                    <p className="text-xs text-muted-foreground">
                      Returns the boolean variable state (e.g., show_Phone, show_History)
                    </p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <code className="text-xs font-semibold block mb-1">resetColumns()</code>
                    <p className="text-xs text-muted-foreground">
                      Resets to role-specific defaults from column configuration
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageShell>
  )
}

export default ColumnSettingsInteractiveGuide
