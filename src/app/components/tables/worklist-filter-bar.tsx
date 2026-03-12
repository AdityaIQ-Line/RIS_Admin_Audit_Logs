import React from "react"
import { Search } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ColumnConfiguration } from "../blocks/column-configuration"
import { ColumnConfig } from "../../../hooks/useColumnVisibility"

/**
 * STANDARDIZED WORKLIST FILTER BAR
 * 
 * This is the single source of truth for ALL filter bars across the product.
 * Based on the QC Technician Worklist design (Figma screenshot).
 * 
 * DESIGN PRINCIPLES:
 * - Horizontal layout with consistent spacing (12px gap)
 * - Search input: 192px width, left-aligned
 * - Filter dropdowns: 135-136px width each
 * - All inputs same height: 36px (h-9)
 * - Background: #f3f3f5, Border: #e5e5e5
 * - Columns button: right-aligned with ml-auto
 * - Responsive: wraps gracefully on smaller screens
 */

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  id: string
  label: string
  placeholder: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  width?: string // Optional custom width, defaults to "w-[136px]"
}

export interface WorklistFilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters: FilterConfig[]
  columnConfig?: {
    columns: ColumnConfig[]
    visibleColumns: string[]
    onToggleColumn: (columnId: string) => void
    onResetColumns: () => void
    userRole: string
  }
}

export function WorklistFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search",
  filters,
  columnConfig,
}: WorklistFilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search Input - Fixed width, left-aligned */}
      <div className="relative w-[192px]">
        <Search 
          strokeWidth={ICON_STROKE_WIDTH} 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
        />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-[#f3f3f5] border-[#e5e5e5]"
        />
      </div>

      {/* Dynamic Filters */}
      {filters.map((filter) => (
        <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className={`${filter.width || 'w-[136px]'} h-9 bg-[#f3f3f5] border-[#e5e5e5]`}>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {/* Columns Configuration - Right-aligned */}
      {columnConfig && (
        <div className="ml-auto">
          <ColumnConfiguration
            columns={columnConfig.columns}
            visibleColumns={columnConfig.visibleColumns}
            onToggleColumn={columnConfig.onToggleColumn}
            onResetColumns={columnConfig.onResetColumns}
            userRole={columnConfig.userRole}
          />
        </div>
      )}
    </div>
  )
}