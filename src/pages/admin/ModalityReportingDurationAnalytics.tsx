/**
 * Modality-wise Reporting Duration Analytics
 * Screen 1 – Modality Reporting Performance List
 * Screen 2 – Modality Reporting Detail
 */

import React from 'react'
import { useNavigate } from 'react-router'
import { PageShell } from '../../app/components/layouts/page-shell'
import { Button } from '../../app/components/ui/button'
import { Input } from '../../app/components/ui/input'
import { Badge } from '../../app/components/ui/badge'
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
import { Pagination } from '../../app/components/ui/pagination'
import {
  ArrowLeft,
  Download,
  Search,
  FileText,
  AlertTriangle,
  Clock,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Home,
  TrendingDown,
  BarChart2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../lib/constants'
import {
  generateModalityDurationData,
  generateModalityDurationCaseData,
  generateModalityDurationTrendData,
  ModalityDurationRow,
  ModalityDurationCaseEntry,
} from '../../lib/analytics-data'
import { toast } from 'sonner'
import { DayPicker } from 'react-day-picker'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import 'react-day-picker/dist/style.css'
import svgPaths from '../../imports/svg-y9b43qti1k'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ─── Constants ────────────────────────────────────────────────────────────────

const SLA_BREACH_THRESHOLD = 15 // % above which SLA breach is flagged red
const ITEMS_PER_PAGE = 10

const FACILITIES = ['City Medical Center', 'Northside Clinic', 'East Wing Hospital', 'South Campus']
const MODALITIES = ['CT', 'MRI', 'X-Ray', 'Ultrasound']
const PRIORITIES = ['Routine', 'Urgent', 'VIP']
const RADIOLOGISTS_FILTER = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Williams',
  'Dr. James Anderson',
  'Dr. Maria Garcia',
  'Dr. Robert Thompson',
]

const quickRanges = [
  { label: 'Today', getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: 'Last 90 days', getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
  { label: 'Last 365 days', getValue: () => ({ from: subDays(new Date(), 365), to: new Date() }) },
]

// ─── Shared date-range button ─────────────────────────────────────────────────
function DateRangeButton({
  dateRange,
  datePickerOpen,
  setDatePickerOpen,
  tempDateRange,
  setTempDateRange,
  onApply,
}: {
  dateRange: { from: Date; to: Date }
  datePickerOpen: boolean
  setDatePickerOpen: (v: boolean) => void
  tempDateRange: { from?: Date; to?: Date }
  setTempDateRange: (v: { from?: Date; to?: Date }) => void
  onApply: () => void
}) {
  return (
    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-0 hover:opacity-80 transition-opacity">
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
          <div className="w-40 border-r border-gray-200 p-3">
            <div className="space-y-1">
              {quickRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setTempDateRange(range.getValue())}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3">
            <DayPicker
              mode="range"
              selected={
                tempDateRange.from && tempDateRange.to
                  ? { from: tempDateRange.from, to: tempDateRange.to }
                  : undefined
              }
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
            <div className="flex gap-2 justify-end pt-3 border-t mt-3">
              <Button variant="outline" size="sm" onClick={() => setDatePickerOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onApply}
                disabled={!tempDateRange.from || !tempDateRange.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
  valueColor,
  sub,
}: {
  label: string
  value: string
  icon: React.ComponentType<any>
  iconColor: string
  valueColor?: string
  sub?: string
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[11.2px] p-1">
      <div className="flex items-center justify-between px-6 h-[43px]">
        <p className="text-sm text-[#0a0a0a]">{label}</p>
        <Icon className={`size-4 ${iconColor}`} strokeWidth={ICON_STROKE_WIDTH} />
      </div>
      <div className="px-6 pb-4">
        <p className={`text-base font-bold ${valueColor ?? 'text-[#0a0a0a]'}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Sort icon helper ─────────────────────────────────────────────────────────
function SortIcon({
  column,
  sortColumn,
  sortDir,
}: {
  column: string
  sortColumn: string | null
  sortDir: 'asc' | 'desc'
}) {
  if (sortColumn !== column)
    return <ArrowUpDown className="size-4 opacity-40" strokeWidth={ICON_STROKE_WIDTH} />
  return sortDir === 'asc' ? (
    <ArrowUp className="size-4 opacity-60" strokeWidth={ICON_STROKE_WIDTH} />
  ) : (
    <ArrowDown className="size-4 opacity-60" strokeWidth={ICON_STROKE_WIDTH} />
  )
}

// ─── Priority badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Routine: 'bg-blue-50 text-blue-700 border-blue-200',
    Urgent: 'bg-amber-50 text-amber-700 border-amber-200',
    VIP: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${styles[priority] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}
    >
      {priority}
    </span>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'On Time' | 'Delayed' }) {
  return status === 'Delayed' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-medium bg-red-50 text-red-700 border-red-200">
      <AlertTriangle className="size-3" strokeWidth={ICON_STROKE_WIDTH} />
      Delayed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-medium bg-green-50 text-green-700 border-green-200">
      <CheckCircle2 className="size-3" strokeWidth={ICON_STROKE_WIDTH} />
      On Time
    </span>
  )
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-white p-2.5 shadow-lg text-xs">
      <p className="font-medium mb-1 text-[#0a0a0a]">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value} hrs</span>
        </p>
      ))}
    </div>
  )
}

// ─── Format datetime ──────────────────────────────────────────────────────────
function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 – Modality Reporting Performance List
// ═══════════════════════════════════════════════════════════════════════════════
function ModalityReportingList({
  onViewDetail,
}: {
  onViewDetail: (row: ModalityDurationRow) => void
}) {
  const navigate = useNavigate()

  // Date range
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({})

  // Filters
  const [search, setSearch] = React.useState('')
  const [selModality, setSelModality] = React.useState('all')
  const [selFacility, setSelFacility] = React.useState('all')
  const [selPriority, setSelPriority] = React.useState('all')
  const [selRadiologist, setSelRadiologist] = React.useState('all')

  // Sort
  const [sortColumn, setSortColumn] = React.useState<string>('totalReports')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  // Pagination
  const [page, setPage] = React.useState(1)

  // Data
  const allData = React.useMemo(() => generateModalityDurationData(), [])

  // KPIs
  const kpis = React.useMemo(() => {
    const totalReports = allData.reduce((s, r) => s + r.totalReports, 0)
    const avgTAT =
      allData.reduce((s, r) => s + r.avgReportingTAT, 0) / allData.length
    const medianTAT =
      allData.reduce((s, r) => s + r.medianTAT, 0) / allData.length
    const avgSLABreach =
      allData.reduce((s, r) => s + r.slaBreachPct, 0) / allData.length
    return {
      totalReports,
      avgTAT: avgTAT.toFixed(1),
      medianTAT: medianTAT.toFixed(1),
      avgSLABreach: avgSLABreach.toFixed(1),
    }
  }, [allData])

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(col)
      setSortDir('desc')
    }
    setPage(1)
  }

  // Filter + sort
  const filtered = React.useMemo(() => {
    let rows = [...allData]

    if (search) {
      rows = rows.filter((r) =>
        r.modality.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (selModality !== 'all') {
      rows = rows.filter((r) => r.modality === selModality)
    }

    rows.sort((a, b) => {
      const av = a[sortColumn as keyof ModalityDurationRow] as number
      const bv = b[sortColumn as keyof ModalityDurationRow] as number
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return rows
  }, [allData, search, selModality, sortColumn, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleExport = () => {
    const header =
      'Modality,Total Reports,Avg Reporting TAT (hrs),Median TAT (hrs),SLA Breach %,Delayed Reports'
    const rows = filtered.map(
      (r) =>
        `${r.modality},${r.totalReports},${r.avgReportingTAT},${r.medianTAT},${r.slaBreachPct},${r.delayedReports}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `modality_reporting_duration_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export complete')
  }

  const slaBreached = parseFloat(kpis.avgSLABreach) > SLA_BREACH_THRESHOLD

  return (
    <PageShell>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/analytics')}
              className="size-9"
            >
              <ArrowLeft className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
            </Button>
            <h1 className="font-['Arial'] font-bold text-[18px] leading-[28px] text-[#0a0a0a]">
              Modality Reporting Performance
            </h1>
            <DateRangeButton
              dateRange={dateRange}
              datePickerOpen={datePickerOpen}
              setDatePickerOpen={setDatePickerOpen}
              tempDateRange={tempDateRange}
              setTempDateRange={setTempDateRange}
              onApply={() => {
                if (tempDateRange.from && tempDateRange.to) {
                  setDateRange({ from: tempDateRange.from, to: tempDateRange.to })
                  setDatePickerOpen(false)
                  toast.success('Date range updated')
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              label="Total Reports"
              value={kpis.totalReports.toLocaleString()}
              icon={FileText}
              iconColor="text-gray-500"
            />
            <KpiCard
              label="Average Reporting TAT"
              value={`${kpis.avgTAT} hrs`}
              icon={Clock}
              iconColor="text-blue-500"
            />
            <KpiCard
              label="Median Reporting TAT"
              value={`${kpis.medianTAT} hrs`}
              icon={BarChart2}
              iconColor="text-indigo-500"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative w-[192px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#737373]"
                strokeWidth={ICON_STROKE_WIDTH}
              />
              <Input
                placeholder="Body Part / Modality"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 h-9 bg-[#f3f3f5] border-[#e5e5e5] text-sm"
              />
            </div>

            {/* Modality */}
            <Select value={selModality} onValueChange={(v) => { setSelModality(v); setPage(1) }}>
              <SelectTrigger className="w-40 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Modalities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modalities</SelectItem>
                {MODALITIES.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority */}
            <Select value={selPriority} onValueChange={(v) => { setSelPriority(v); setPage(1) }}>
              <SelectTrigger className="w-36 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Radiologist */}
            <Select value={selRadiologist} onValueChange={(v) => { setSelRadiologist(v); setPage(1) }}>
              <SelectTrigger className="w-48 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Radiologists" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Radiologists</SelectItem>
                {RADIOLOGISTS_FILTER.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Export – right-aligned */}
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={handleExport} className="h-9 gap-2">
                <Download className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    {[
                      { key: 'modality', label: 'Modality' },
                      { key: 'totalReports', label: 'Total Reports' },
                      { key: 'avgReportingTAT', label: 'Avg Reporting TAT (hrs)' },
                      { key: 'medianTAT', label: 'Median TAT' },
                      { key: 'delayedReports', label: 'Delayed Reports' },
                    ].map(({ key, label }) => (
                      <th key={key} className="text-left p-0 h-10">
                        <button
                          onClick={() => handleSort(key)}
                          className="flex items-center gap-1.5 text-sm font-normal text-[#0a0a0a] hover:bg-gray-100 px-4 py-2 h-10 w-full"
                        >
                          {label}
                          <SortIcon column={key} sortColumn={sortColumn} sortDir={sortDir} />
                        </button>
                      </th>
                    ))}
                    <th className="text-left px-4 h-10">
                      <span className="text-sm text-[#0a0a0a]">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    paged.map((row) => {
                      const slaBreach = row.slaBreachPct > SLA_BREACH_THRESHOLD
                      return (
                        <tr
                          key={row.modalityId}
                          className="border-b border-[#e5e5e5] last:border-0 hover:bg-[#fafafa] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-[#0a0a0a]">{row.modality}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#0a0a0a]">
                              {row.totalReports.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#0a0a0a]">
                              {row.avgReportingTAT.toFixed(1)} hrs
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#0a0a0a]">
                              {row.medianTAT.toFixed(1)} hrs
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm ${slaBreach ? 'text-red-600' : 'text-[#0a0a0a]'}`}>
                              {row.delayedReports.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => onViewDetail(row)}
                            >
                              <Eye className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          </div>

        </div>
      </div>
    </PageShell>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 – Modality Reporting Detail
// ═══════════════════════════════════════════════════════════════════════════════
function ModalityReportingDetail({
  modality,
  onBack,
}: {
  modality: ModalityDurationRow
  onBack: () => void
}) {
  const navigate = useNavigate()

  // Case table state
  const [casePage, setCasePage] = React.useState(1)
  const [caseSearch, setCaseSearch] = React.useState('')
  const [casePriority, setCasePriority] = React.useState('all')
  const [caseStatus, setCaseStatus] = React.useState('all')
  const [caseRadiologist, setCaseRadiologist] = React.useState('all')

  // Sort for case table
  const [sortCol, setSortCol] = React.useState<string>('reportCreatedTime')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const cases: ModalityDurationCaseEntry[] = React.useMemo(
    () => generateModalityDurationCaseData(modality.modalityId),
    [modality.modalityId]
  )

  const trendData = React.useMemo(() => generateModalityDurationTrendData(30), [])

  // KPIs for detail
  const detailKpis = React.useMemo(() => {
    const total = cases.length
    const avgTAT = cases.reduce((s, c) => s + c.actualTAT, 0) / cases.length
    const longestTAT = Math.max(...cases.map((c) => c.actualTAT))
    const delayed = cases.filter((c) => c.status === 'Delayed').length
    const slaBreachPct = ((delayed / total) * 100).toFixed(1)
    return {
      total,
      avgTAT: avgTAT.toFixed(1),
      longestTAT: longestTAT.toFixed(1),
      slaBreachPct,
    }
  }, [cases])

  const handleSortCase = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
    setCasePage(1)
  }

  // Filtered cases
  const filteredCases = React.useMemo(() => {
    let rows = [...cases]
    if (caseSearch) {
      rows = rows.filter(
        (r) =>
          r.uhid.toLowerCase().includes(caseSearch.toLowerCase()) ||
          r.bodyPart.toLowerCase().includes(caseSearch.toLowerCase()) ||
          r.radiologist.toLowerCase().includes(caseSearch.toLowerCase())
      )
    }
    if (casePriority !== 'all') rows = rows.filter((r) => r.priority === casePriority)
    if (caseStatus !== 'all') rows = rows.filter((r) => r.status === caseStatus)
    if (caseRadiologist !== 'all') rows = rows.filter((r) => r.radiologist === caseRadiologist)

    rows.sort((a, b) => {
      const av = (a as any)[sortCol]
      const bv = (b as any)[sortCol]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

    return rows
  }, [cases, caseSearch, casePriority, caseStatus, caseRadiologist, sortCol, sortDir])

  const caseTotalPages = Math.max(1, Math.ceil(filteredCases.length / ITEMS_PER_PAGE))
  const pagedCases = filteredCases.slice(
    (casePage - 1) * ITEMS_PER_PAGE,
    casePage * ITEMS_PER_PAGE
  )

  const handleExport = () => {
    const header =
      'UHID,Body Part,Radiologist,Report Created,Report Released,Expected TAT (hrs),Actual TAT (hrs),Priority,Status'
    const rows = filteredCases.map(
      (c) =>
        `${c.uhid},${c.bodyPart},"${c.radiologist}","${fmtDateTime(c.reportCreatedTime)}","${fmtDateTime(c.reportReleasedTime)}",${c.expectedTAT},${c.actualTAT},${c.priority},${c.status}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${modality.modality}_reporting_detail.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export complete')
  }

  const slaBreached = parseFloat(detailKpis.slaBreachPct) > SLA_BREACH_THRESHOLD

  // tick reducer for chart
  const tickInterval = Math.floor(trendData.length / 6)

  return (
    <PageShell>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="size-9">
              <ArrowLeft className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
            </Button>
            <h1 className="font-['Arial'] font-bold text-[18px] leading-[28px] text-[#0a0a0a]">
              {modality.modality} — Reporting Duration Detail
            </h1>
            <Badge variant="outline" className="text-xs">Detail View</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="h-9 gap-2">
            <Download className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">

          {/* Breadcrumb */}
          

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Reports"
              value={detailKpis.total.toLocaleString()}
              icon={FileText}
              iconColor="text-gray-500"
            />
            <KpiCard
              label="Avg Reporting TAT"
              value={`${detailKpis.avgTAT} hrs`}
              icon={Clock}
              iconColor="text-blue-500"
            />
            <KpiCard
              label="Longest Reporting TAT"
              value={`${detailKpis.longestTAT} hrs`}
              icon={TrendingDown}
              iconColor="text-orange-500"
            />
          </div>

          {/* Trend Chart */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#0a0a0a]">
                Avg Reporting TAT Trend — Last 30 Days
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Average reporting turnaround time (hours) per day
              </p>
            </div>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 8, right: 48, left: 16, bottom: 36 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#737373' }}
                    interval={tickInterval}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Date', position: 'insideBottom', offset: -18, style: { fontSize: 11, fill: '#737373' } }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#737373' }}
                    tickLine={false}
                    axisLine={false}
                    unit=" hrs"
                    width={84}
                    label={{ value: 'Turnaround Time (hrs)', angle: -90, position: 'insideLeft', dx: 14, style: { textAnchor: 'middle', fontSize: 11, fill: '#737373' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgReportingTAT"
                    name="Avg Reporting TAT"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ paddingBottom: 16 }}
                    content={() => (
                      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', fontSize: 12, color: '#555' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ display: 'inline-block', width: 20, height: 2, background: '#3b82f6', borderRadius: 1 }} />
                          <span>Avg Reporting TAT</span>
                        </div>
                      </div>
                    )}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Case Table filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-[192px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#737373]"
                strokeWidth={ICON_STROKE_WIDTH}
              />
              <Input
                placeholder="UHID / Test Name / Radiologist"
                value={caseSearch}
                onChange={(e) => {
                  setCaseSearch(e.target.value)
                  setCasePage(1)
                }}
                className="pl-9 h-9 bg-[#f3f3f5] border-[#e5e5e5] text-sm"
              />
            </div>

            <Select value={casePriority} onValueChange={(v) => { setCasePriority(v); setCasePage(1) }}>
              <SelectTrigger className="w-36 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={caseStatus} onValueChange={(v) => { setCaseStatus(v); setCasePage(1) }}>
              <SelectTrigger className="w-36 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="On Time">On Time</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={caseRadiologist} onValueChange={(v) => { setCaseRadiologist(v); setCasePage(1) }}>
              <SelectTrigger className="w-48 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Radiologists" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Radiologists</SelectItem>
                {RADIOLOGISTS_FILTER.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Case Table */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    {[
                      { key: 'uhid', label: 'UHID' },
                      { key: 'patientName', label: 'Patient Name' },
                      { key: 'bodyPart', label: 'Test Name' },
                      { key: 'radiologist', label: 'Radiologist' },
                      { key: 'reportCreatedTime', label: 'Report Created' },
                      { key: 'reportReleasedTime', label: 'Report Released' },
                      { key: 'expectedTAT', label: 'Expected TAT' },
                      { key: 'actualTAT', label: 'Actual TAT' },
                      { key: 'priority', label: 'Priority' },
                      { key: 'status', label: 'Status' },
                    ].map(({ key, label }) => (
                      <th key={key} className="text-left p-0 h-10">
                        <button
                          onClick={() => handleSortCase(key)}
                          className="flex items-center gap-1.5 text-sm font-normal text-[#0a0a0a] hover:bg-gray-100 px-4 py-2 h-10 w-full whitespace-nowrap"
                        >
                          {label}
                          <SortIcon column={key} sortColumn={sortCol} sortDir={sortDir} />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedCases.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-muted-foreground text-sm">
                        No cases found
                      </td>
                    </tr>
                  ) : (
                    pagedCases.map((row) => (
                      <tr
                        key={row.id}
                        className={`border-b border-[#e5e5e5] last:border-0 transition-colors ${row.status === 'Delayed' ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-[#fafafa]'}`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-[#0a0a0a]">{row.uhid}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#0a0a0a] whitespace-nowrap">{row.patientName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#0a0a0a]">{row.bodyPart}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#0a0a0a] whitespace-nowrap">{row.radiologist}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#737373] whitespace-nowrap">
                            {fmtDateTime(row.reportCreatedTime)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#737373] whitespace-nowrap">
                            {fmtDateTime(row.reportReleasedTime)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#0a0a0a]">{row.expectedTAT} hrs</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-medium ${row.status === 'Delayed' ? 'text-red-600' : 'text-[#0a0a0a]'}`}
                          >
                            {row.actualTAT.toFixed(1)} hrs
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={row.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={casePage}
              totalPages={caseTotalPages}
              totalItems={filteredCases.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCasePage}
            />
          </div>

        </div>
      </div>
    </PageShell>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT – controller
// ═══════════════════════════════════════════════════════════════════════════════
export function ModalityReportingDurationAnalytics() {
  const [selectedModality, setSelectedModality] = React.useState<ModalityDurationRow | null>(null)

  if (selectedModality) {
    return (
      <ModalityReportingDetail
        modality={selectedModality}
        onBack={() => setSelectedModality(null)}
      />
    )
  }

  return (
    <ModalityReportingList onViewDetail={(row) => setSelectedModality(row)} />
  )
}