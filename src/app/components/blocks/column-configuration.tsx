import * as React from "react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Settings2, Check } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import { ColumnConfig } from "../../../hooks/useColumnVisibility"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"

interface ColumnConfigurationProps {
  columns: ColumnConfig[]
  visibleColumns: Set<string>
  onToggleColumn: (columnId: string) => void
  onResetColumns: () => void
  userRole?: "radiologist" | "technician" | "senior-radiologist" | "admin" | "referring-physician"
}

/**
 * ColumnConfiguration Component
 * 
 * Medical dashboard column visibility configuration dropdown.
 * Features section headers, fixed height with scrolling, and real-time table updates.
 * 
 * Usage:
 * ```tsx
 * <ColumnConfiguration
 *   columns={columnConfigs}
 *   visibleColumns={visibleColumns}
 *   onToggleColumn={toggleColumn}
 *   onResetColumns={resetColumns}
 *   userRole="radiologist"
 * />
 * ```
 */
export function ColumnConfiguration({
  columns,
  visibleColumns,
  onToggleColumn,
  onResetColumns,
  userRole = "radiologist",
}: ColumnConfigurationProps) {
  const fixedColumns = columns.filter(col => col.isFixed)
  const configurableColumns = columns.filter(col => !col.isFixed)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
          <Settings2 className="h-3.5 w-3.5" strokeWidth={ICON_STROKE_WIDTH} />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end" sideOffset={4}>
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {/* CONFIGURABLE COLUMNS Section */}
            {configurableColumns.length > 0 && (
              <div>
                <div className="space-y-0.5">
                  {configurableColumns.map(column => {
                    const isVisible = visibleColumns.has(column.id)
                    return (
                      <div
                        key={column.id}
                        className="flex items-center gap-2.5 px-2 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm transition-colors"
                        onClick={() => onToggleColumn(column.id)}
                      >
                        <Checkbox
                          id={`config-${column.id}`}
                          checked={isVisible}
                          onCheckedChange={() => onToggleColumn(column.id)}
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor={`config-${column.id}`}
                          className="text-sm font-normal cursor-pointer flex-1 leading-none"
                        >
                          {column.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}