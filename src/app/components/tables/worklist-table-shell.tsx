import React from "react"
import { PageShell } from "../layouts/page-shell"
import { Input } from "../ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Button } from "../ui/button"
import { DayPicker } from 'react-day-picker'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { toast } from 'sonner'
import svgPaths from '../../../imports/svg-y9b43qti1k'
import 'react-day-picker/dist/style.css'

/**
 * STANDARDIZED WORKLIST TABLE SHELL
 * 
 * This is the single source of truth for ALL worklist page layouts across the product.
 * Based on the QC Technician Worklist design (Figma screenshot).
 * 
 * LAYOUT STRUCTURE:
 * 1. Sticky header with title and date pickers (optional)
 * 2. Main content area with filters and table
 * 3. Consistent spacing and padding throughout
 * 
 * DESIGN PRINCIPLES:
 * - Header: border-b, white background, px-6 py-3.5
 * - Title: text-lg font-bold
 * - Date pickers: 140px width, 36px height
 * - Content: container max-w-7xl, px-6 py-6
 * - Spacing: 24px gap between filter bar and table
 */

export interface WorklistTableShellProps {
  title: string
  showDatePickers?: boolean
  fromDate?: string
  toDate?: string
  onFromDateChange?: (date: string) => void
  onToDateChange?: (date: string) => void
  filterBar: React.ReactNode
  children: React.ReactNode
}

export function WorklistTableShell({
  title,
  showDatePickers = true,
  fromDate = "",
  toDate = "",
  onFromDateChange,
  onToDateChange,
  filterBar,
  children,
}: WorklistTableShellProps) {
  // Date range picker state
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: fromDate ? new Date(fromDate) : subDays(new Date(), 30),
    to: toDate ? new Date(toDate) : new Date()
  })
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({})
  
  // Quick select date ranges
  const quickRanges = [
    { label: 'Today', getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
    { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: 'Last 90 days', getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
    { label: 'Last 365 days', getValue: () => ({ from: subDays(new Date(), 365), to: new Date() }) },
  ]
  
  const handleQuickRange = (range: { from: Date; to: Date }) => {
    setTempDateRange(range)
  }
  
  const handleApplyDateRange = () => {
    if (tempDateRange.from && tempDateRange.to) {
      setDateRange({ from: tempDateRange.from, to: tempDateRange.to })
      // Convert to YYYY-MM-DD format for the parent component
      onFromDateChange?.(format(tempDateRange.from, 'yyyy-MM-dd'))
      onToDateChange?.(format(tempDateRange.to, 'yyyy-MM-dd'))
      setDatePickerOpen(false)
      toast.success('Date range updated')
    }
  }
  
  const handleCancelDateRange = () => {
    setTempDateRange({})
    setDatePickerOpen(false)
  }
  
  return (
    <PageShell>
      {/* Sticky Header with Title and Date Pickers */}
      <div className="border-b bg-white px-6 py-3.5">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">{title}</h1>
          {showDatePickers && (
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-0 hover:opacity-80 transition-opacity">
                  {/* From Date */}
                  <div className="w-[131px]">
                    <div className="bg-[#f3f3f5] h-9 rounded-md border border-[#e5e5e5]">
                      <div className="flex items-center px-3 py-2 size-full">
                        <div className="relative shrink-0 size-5 mr-2">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                            <path clipRule="evenodd" d={svgPaths.pdd62e30} fill="#737373" fillRule="evenodd" />
                          </svg>
                        </div>
                        <span className="flex-1 font-['Inter'] text-sm text-[#0a0a0a]">
                          {format(dateRange.from, 'MMM dd')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Separator Line */}
                  <div className="w-[9px] h-0 relative mx-0">
                    <svg className="block w-full h-px" fill="none" preserveAspectRatio="none" viewBox="0 0 9 1">
                      <path d="M0 0.5H9" stroke="#e5e5e5" />
                    </svg>
                  </div>
                  
                  {/* To Date */}
                  <div className="w-[131px]">
                    <div className="bg-[#f3f3f5] h-9 rounded-md border border-[#e5e5e5]">
                      <div className="flex items-center px-3 py-2 size-full">
                        <div className="relative shrink-0 size-5 mr-2">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                            <path clipRule="evenodd" d={svgPaths.pdd62e30} fill="#737373" fillRule="evenodd" />
                          </svg>
                        </div>
                        <span className="flex-1 font-['Inter'] text-sm text-[#0a0a0a]">
                          {format(dateRange.to, 'MMM dd')}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                  {/* Quick Select Sidebar */}
                  <div className="w-40 border-r border-gray-200 p-3">
                    <div className="space-y-1">
                      {quickRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => handleQuickRange(range.getValue())}
                          className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors"
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Calendar */}
                  <div className="p-3">
                    <DayPicker
                      mode="range"
                      selected={tempDateRange.from && tempDateRange.to ? { from: tempDateRange.from, to: tempDateRange.to } : undefined}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setTempDateRange({ from: range.from, to: range.to })
                        }
                      }}
                      numberOfMonths={2}
                      className="date-range-picker"
                    />
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end pt-3 border-t mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelDateRange}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleApplyDateRange}
                        disabled={!tempDateRange.from || !tempDateRange.to}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">
          {/* Filter Bar */}
          {filterBar}
          
          {/* Table Content */}
          {children}
        </div>
      </div>
    </PageShell>
  )
}