/**
 * Analytics Category Detail Page
 * Displays detailed analytics for a specific category with filters and visualizations
 */

import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { PageShell } from '../../app/components/layouts/page-shell'
import { PageHeader } from '../../app/components/blocks/page-header'
import { Button } from '../../app/components/ui/button'
import { Input } from '../../app/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../app/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../app/components/ui/popover'
import { 
  ArrowLeft, 
  Download, 
  Search, 
  ChevronDown, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  CheckCircle,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../lib/constants'
import { getAnalyticsCategoryById } from '../../lib/analytics-config'
import { generateAnalyticsData, AnalyticsDataPoint } from '../../lib/analytics-data'
import { downloadCSV } from '../../lib/csv-export'
import { toast } from 'sonner'
import svgPaths from '../../imports/svg-y9b43qti1k'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../app/components/ui/dialog'
import { DayPicker } from 'react-day-picker'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import 'react-day-picker/dist/style.css'
import { ModalityCaseTable } from '../../app/components/analytics/modality-case-table'
import { ModalityCaseDetail } from './ModalityCaseDetail'

export function AnalyticsCategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  
  const category = categoryId ? getAnalyticsCategoryById(categoryId) : undefined
  
  // State
  const [searchTerm, setSearchTerm] = React.useState('')
  const [sortColumn, setSortColumn] = React.useState<string | null>(
    categoryId === 'modality-case-analytics' ? 'totalCases' : 'totalReports'
  )
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc')
  const [selectedItem, setSelectedItem] = React.useState<AnalyticsDataPoint | null>(null)
  const [drillDownOpen, setDrillDownOpen] = React.useState(false)
  const [drillDownModality, setDrillDownModality] = React.useState<AnalyticsDataPoint | null>(null)
  const [selectedModality, setSelectedModality] = React.useState<string>('all')
  const [selectedPriority, setSelectedPriority] = React.useState<string>('all')
  const [selectedRadiologist, setSelectedRadiologist] = React.useState<string>('all')
  const [selectedTest, setSelectedTest] = React.useState<string>('all')
  const [testSearchTerm, setTestSearchTerm] = React.useState('')
  const [testDropdownOpen, setTestDropdownOpen] = React.useState(false)
  
  // Date range picker state
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
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
      setDatePickerOpen(false)
      toast.success('Date range updated')
    }
  }
  
  const handleCancelDateRange = () => {
    setTempDateRange({})
    setDatePickerOpen(false)
  }
  
  if (!category) {
    return (
      <PageShell>
        <PageHeader title="Analytics Category Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">The requested analytics category does not exist.</p>
            <Button onClick={() => navigate('/admin/analytics')}>
              <ArrowLeft className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
              Back to Analytics Dashboard
            </Button>
          </div>
        </div>
      </PageShell>
    )
  }
  
  // Drill-down detail view for modality-case-analytics
  // NOTE: This must NOT be an early return — all hooks below must always run.
  // Conditional rendering is handled in the return statement instead.

  // Generate data based on category
  const data = generateAnalyticsData(category.id)
  
  // Get unique filter options from data
  const modalities = React.useMemo(() => {
    const unique = new Set<string>()
    data.forEach(item => {
      if (item.modality) unique.add(item.modality as string)
    })
    return Array.from(unique).sort()
  }, [data])
  
  const radiologists = React.useMemo(() => {
    const unique = new Set<string>()
    data.forEach(item => {
      if (item.radiologistName) unique.add(item.radiologistName as string)
    })
    return Array.from(unique).sort()
  }, [data])
  
  const priorities = ['Routine', 'Urgent', 'VIP']
  
  // Test/Procedure options
  const tests = [
    'Brain',
    'Brain with Contrast',
    'Angiography (CTA)',
    'Head',
    'Cervical Spine',
    'Thorax/chest',
    'Thorax/chest with Contrast',
    'Abdomen/whole abdomen',
    'Abdomen/whole abdomen with Contrast',
    'Abdomen and Pelvis',
    'Pelvis',
    'Face',
    'Orbit',
    'Temporal Bone',
    'Shoulder',
    'Coronary Angiography',
    'Spine (Whole)',
    'Soft Tissue Neck',
    'Enterography',
    'Urogram',
    'Perfusion',
    'Biopsy Guidance',
    'Drainage Guidance',
    'KUB',
    'Brain/head',
    'Brain/head with Contrast',
    'Thoracic Spine',
    'Lumbar Spine',
    'Whole Spine',
    'Knee',
    'Wrist',
    'Ankle',
    'Hip',
    'Liver',
    'Prostate',
    'Breast',
    'Facial Bones/face',
    'MRCP/MRI Whole abdomen',
    'Whole spine screening',
    'Angiography (MRA)',
    'Functional MRI (fMRI)',
    'Diffusion MRI',
    'Chest/thorax',
    'Skull',
    'Spine Cervical',
    'Spine Thoracic',
    'Spine Lumbar',
    'Arm',
    'Hand',
    'Foot',
    'Sinus',
    'Facial Bones',
    'Clavicle',
    'Ribs',
  ].sort()
  
  // Filter tests based on search term
  const filteredTests = React.useMemo(() => {
    if (!testSearchTerm) return tests
    return tests.filter(test => 
      test.toLowerCase().includes(testSearchTerm.toLowerCase())
    )
  }, [testSearchTerm, tests])
  
  // Calculate summary stats
  const stats = React.useMemo(() => {
    if (category.id === 'radiologist-performance') {
      const totalReports = data.reduce((sum, item) => sum + (parseFloat(item.totalReports as string) || 0), 0)
      const avgTAT = data.reduce((sum, item) => sum + (parseFloat(item.avgTAT as string) || 0), 0) / data.length
      const avgReportsPerDay = data.reduce((sum, item) => sum + (parseFloat(item.reportsPerDay as string) || 0), 0) / data.length
      
      return [
        { label: 'Total Reports', value: totalReports.toString(), icon: FileText, iconColor: 'text-gray-600' },
        { label: 'Average TAT', value: `${avgTAT.toFixed(1)} hours`, icon: AlertTriangle, iconColor: 'text-red-600', isWarning: true },
        { label: 'Reports per Day', value: avgReportsPerDay.toFixed(1), icon: Calendar, iconColor: 'text-gray-600' },
      ]
    }
    
    if (category.id === 'modality-case-analytics') {
      const totalCases = data.reduce((sum, item) => sum + (item.totalCases || 0), 0)
      const avgTAT = data.reduce((sum, item) => sum + (item.avgTAT || 0), 0) / data.length
      const medianTAT = data.reduce((sum, item) => sum + (item.medianTAT || 0), 0) / data.length
      
      return [
        { label: 'Total Cases', value: totalCases.toString(), icon: FileText, iconColor: 'text-gray-600' },
        { label: 'Average TAT', value: `${avgTAT.toFixed(1)} hrs`, icon: AlertTriangle, iconColor: avgTAT > 24 ? 'text-red-600' : 'text-gray-600', isWarning: avgTAT > 24 },
        { label: 'Median TAT', value: `${medianTAT.toFixed(1)} hrs`, icon: Calendar, iconColor: 'text-gray-600' },
      ]
    }
    
    return []
  }, [data, category.id])
  
  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }
  
  // Filter and sort data
  const filteredData = React.useMemo(() => {
    let filtered = [...data]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
    
    // Apply modality filter
    if (selectedModality !== 'all') {
      filtered = filtered.filter(item => item.modality === selectedModality)
    }
    
    // Apply radiologist filter
    if (selectedRadiologist !== 'all') {
      filtered = filtered.filter(item => item.radiologistName === selectedRadiologist)
    }
    
    // Apply priority filter (if priority field exists in data)
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === selectedPriority)
    }
    
    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = parseFloat(a[sortColumn] as string) || a[sortColumn]
        const bVal = parseFloat(b[sortColumn] as string) || b[sortColumn]
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        return sortDirection === 'asc' 
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      })
    }
    
    return filtered
  }, [data, searchTerm, selectedModality, selectedRadiologist, selectedPriority, sortColumn, sortDirection])
  
  // Export to CSV
  const handleExport = () => {
    try {
      downloadCSV(category, data, {})
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
      console.error(error)
    }
  }
  
  // Handle drill-down
  const handleDrillDown = (item: AnalyticsDataPoint) => {
    if (category?.id === 'modality-case-analytics') {
      setDrillDownModality(item)
    } else {
      setSelectedItem(item)
      setDrillDownOpen(true)
    }
  }

  // If a modality is selected for drill-down, render the detail view
  if (drillDownModality && category.id === 'modality-case-analytics') {
    return (
      <ModalityCaseDetail
        modality={drillDownModality}
        dateRange={dateRange}
        onBack={() => setDrillDownModality(null)}
      />
    )
  }

  return (
    <PageShell>
      <div className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex gap-4 items-center">
            <div className="relative shrink-0 size-9 flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin/analytics')}
                className="size-9"
              >
                <ArrowLeft className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
              </Button>
            </div>
            <h1 className="font-['Arial'] font-bold text-[18px] leading-[28px] text-[#0a0a0a]">{category.name}</h1>
            
            {/* Date Range Picker - Only for Radiologist Performance Analytics */}
            {category.id === 'radiologist-performance' && (
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
                        captionLayout="dropdown-buttons"
                        fromYear={2020}
                        toYear={2030}
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
            
            {/* Date Range Picker - For Modality Case Analytics */}
            {category.id === 'modality-case-analytics' && (
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
                        captionLayout="dropdown-buttons"
                        fromYear={2020}
                        toYear={2030}
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
      </div>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-[#e5e5e5] rounded-[11.2px] p-1">
                <div className="flex items-center justify-between px-6 h-[43px]">
                  <p className="text-sm text-[#0a0a0a]">{stat.label}</p>
                  <stat.icon className={`size-4 ${stat.iconColor}`} strokeWidth={ICON_STROKE_WIDTH} />
                </div>
                <div className="px-6 pb-4">
                  <p className={`text-base font-bold ${stat.isWarning ? 'text-red-600' : 'text-[#0a0a0a]'}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative w-[192px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#737373]" strokeWidth={ICON_STROKE_WIDTH} />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 bg-[#f3f3f5] border-[#e5e5e5] text-sm"
              />
            </div>
            
            {/* Modality Filter */}
            <Select value={selectedModality} onValueChange={setSelectedModality}>
              <SelectTrigger className="w-40 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="Modalities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modalities</SelectItem>
                {modalities.map((modality) => (
                  <SelectItem key={modality} value={modality}>
                    {modality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Priority Filter */}
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-40 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Radiologist Filter - Hidden for now */}
            <Select value={selectedRadiologist} onValueChange={setSelectedRadiologist}>
              <SelectContent>
                <SelectItem value="all">All Radiologists</SelectItem>
                {radiologists.map((radiologist) => (
                  <SelectItem key={radiologist} value={radiologist}>
                    {radiologist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Test Filter with Search */}
            <Popover open={testDropdownOpen} onOpenChange={setTestDropdownOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-between w-40 bg-[#f3f3f5] border border-[#e5e5e5] h-9 rounded-md px-3 text-sm">
                  <span className={selectedTest === 'all' ? 'text-[#0a0a0a] truncate' : 'text-[#0a0a0a] truncate'}>
                    {selectedTest === 'all' ? 'Tests' : tests.find(t => t === selectedTest)}
                  </span>
                  <ChevronDown className="size-4 text-[#737373]" strokeWidth={ICON_STROKE_WIDTH} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0" align="start">
                <div className="p-2 border-b border-[#e5e5e5]">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-[#737373]" strokeWidth={ICON_STROKE_WIDTH} />
                    <Input
                      placeholder="Search tests..."
                      value={testSearchTerm}
                      onChange={(e) => setTestSearchTerm(e.target.value)}
                      className="pl-8 h-8 border-[#e5e5e5]"
                    />
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  <div
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b border-[#e5e5e5]"
                    onClick={() => {
                      setSelectedTest('all')
                      setTestDropdownOpen(false)
                      setTestSearchTerm('')
                    }}
                  >
                    All Tests
                  </div>
                  {filteredTests.length === 0 ? (
                    <div className="px-3 py-6 text-sm text-center text-muted-foreground">
                      No tests found
                    </div>
                  ) : (
                    filteredTests.map((test) => (
                      <div
                        key={test}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b border-[#e5e5e5] last:border-0"
                        onClick={() => {
                          setSelectedTest(test)
                          setTestDropdownOpen(false)
                          setTestSearchTerm('')
                        }}
                      >
                        {test}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Export Button */}
            <div className="ml-auto">
              <Button 
                variant="outline" 
                className="bg-white border-[#e5e5e5] h-9 rounded-[5.2px] px-4"
                onClick={handleExport}
              >
                <Download className="size-4 mr-2 text-[#334155]" strokeWidth={ICON_STROKE_WIDTH} />
                <span className="text-xs text-[#0a0a0a]">Export</span>
              </Button>
            </div>
          </div>
          
          {/* Data Table */}
          {category.id === 'modality-case-analytics' ? (
            <ModalityCaseTable
              data={filteredData}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onView={handleDrillDown}
            />
          ) : (
            <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5e5]">
                      <th className="text-left p-2 h-9">
                        <button
                          onClick={() => handleSort('radiologistName')}
                          className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                        >
                          Radiologist Name
                          {sortColumn === 'radiologistName' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            ) : (
                              <ArrowDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            )
                          ) : (
                            <ArrowUpDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-2 h-9">
                        <button
                          onClick={() => handleSort('totalReports')}
                          className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                        >
                          Total Reports
                          {sortColumn === 'totalReports' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            ) : (
                              <ArrowDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            )
                          ) : (
                            <ArrowUpDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-2 h-9">
                        <button
                          onClick={() => handleSort('avgTAT')}
                          className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                        >
                          Avg TAT (hours)
                          {sortColumn === 'avgTAT' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            ) : (
                              <ArrowDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            )
                          ) : (
                            <ArrowUpDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-2 h-9">
                        <button
                          onClick={() => handleSort('reportsPerDay')}
                          className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                        >
                          Reports/Day
                          {sortColumn === 'reportsPerDay' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            ) : (
                              <ArrowDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            )
                          ) : (
                            <ArrowUpDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-2 h-9">
                        <span className="text-sm font-normal text-[#0a0a0a] px-2">Modality</span>
                      </th>
                      <th className="text-left p-2 h-9">
                        <button
                          onClick={() => handleSort('revisionRate')}
                          className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                        >
                          Revision Rate (%)
                          {sortColumn === 'revisionRate' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            ) : (
                              <ArrowDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                            )
                          ) : (
                            <ArrowUpDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-2 h-9">
                        <span className="text-sm font-bold text-[#0a0a0a] px-2">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, index) => (
                        <tr key={index} className="border-b border-[#e5e5e5] last:border-0">
                          <td className="p-2 h-10">
                            <span className="text-sm text-[#0a0a0a] px-2">{row.radiologistName}</span>
                          </td>
                          <td className="p-2 h-10">
                            <span className="text-sm text-[#0a0a0a] px-2">{row.totalReports}</span>
                          </td>
                          <td className="p-2 h-10">
                            <span className="text-sm text-[#0a0a0a] px-2">{row.avgTAT}</span>
                          </td>
                          <td className="p-2 h-10">
                            <span className="text-sm text-[#0a0a0a] px-2">{row.reportsPerDay}</span>
                          </td>
                          <td className="p-2 h-10">
                            <span className="text-sm text-[#0a0a0a] px-2">{row.modality}</span>
                          </td>
                          <td className="p-2 h-10">
                            <span className="text-sm text-[#0a0a0a] px-2">{row.revisionRate}%</span>
                          </td>
                          <td className="p-2 h-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDrillDown(row)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Drill-down Dialog */}
      <Dialog open={drillDownOpen} onOpenChange={setDrillDownOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detailed View</DialogTitle>
            <DialogDescription>
              Complete information for the selected {category.entityType}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedItem).filter(([key]) => key !== 'qualityScore').map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm font-semibold">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setDrillDownOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}