/**
 * Modality Case Detail Screen
 * Drill-down view opened when user clicks "View" on a modality row
 * in the Modality-wise Case Analytics list.
 */

import React from 'react'
import { useNavigate } from 'react-router'
import { PageShell } from '../../app/components/layouts/page-shell'
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
import { Pagination } from '../../app/components/ui/pagination'
import {
  ArrowLeft,
  Download,
  Search,
  Home,
  ChevronRight,
  Clock,
  Activity,
  Gauge,
  Zap,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
} from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../lib/constants'
import {
  AnalyticsDataPoint,
  generateModalityCaseEntries,
  generateModalityCaseTrendData,
  ModalityCaseEntry,
  ModalityCaseTrendPoint,
} from '../../lib/analytics-data'
import { toast } from 'sonner'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import svgPaths from '../../imports/svg-y9b43qti1k'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10

const quickRanges = [
  { label: 'Today', getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: 'Last 90 days', getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
  { label: 'Last 365 days', getValue: () => ({ from: subDays(new Date(), 365), to: new Date() }) },
]

const RADIOLOGISTS = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Williams',
  'Dr. James Anderson',
  'Dr. Maria Garcia',
  'Dr. Robert Thompson',
]

const PRIORITIES = ['Routine', 'Urgent', 'VIP']

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModalityCaseDetailProps {
  modality: AnalyticsDataPoint
  dateRange: { from: Date; to: Date }
  onBack: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string
  value: string
  icon: React.ComponentType<any>
  iconColor: string
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[11.2px] p-1">
      <div className="flex items-center justify-between px-6 h-[43px]">
        <p className="text-sm text-[#0a0a0a]">{label}</p>
        <Icon className={`size-4 ${iconColor}`} strokeWidth={ICON_STROKE_WIDTH} />
      </div>
      <div className="px-6 pb-4">
        <p className="text-base font-bold text-[#0a0a0a]">{value}</p>
      </div>
    </div>
  )
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({
  col,
  sortCol,
  sortDir,
}: {
  col: string
  sortCol: string | null
  sortDir: 'asc' | 'desc'
}) {
  if (sortCol !== col)
    return <ArrowUpDown className="size-4 opacity-40" strokeWidth={ICON_STROKE_WIDTH} />
  return sortDir === 'asc' ? (
    <ArrowUp className="size-4 opacity-60" strokeWidth={ICON_STROKE_WIDTH} />
  ) : (
    <ArrowDown className="size-4 opacity-60" strokeWidth={ICON_STROKE_WIDTH} />
  )
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Routine: 'bg-blue-50 text-blue-700 border-blue-200',
    Urgent: 'bg-amber-50 text-amber-700 border-amber-200',
    VIP: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${
        styles[priority] ?? 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {priority}
    </span>
  )
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-white p-2.5 shadow-lg text-xs">
      <p className="font-medium mb-1 text-[#0a0a0a]">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}:{' '}
          <span className="font-semibold">
            {metric === 'avgCaseTAT' ? `${entry.value} hrs` : entry.value}
          </span>
        </p>
      ))}
    </div>
  )
}

// ─── Date Range Button ────────────────────────────────────────────────────────

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
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.pdd62e30}
                      fill="#737373"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="flex-1 font-['Inter'] text-sm text-[#0a0a0a]">
                  {format(dateRange.from, 'MMM dd')}
                </span>
              </div>
            </div>
          </div>
          <div className="w-[9px] h-0 relative mx-0">
            <svg
              className="block w-full h-px"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 9 1"
            >
              <path d="M0 0.5H9" stroke="#e5e5e5" />
            </svg>
          </div>
          <div className="w-[131px]">
            <div className="bg-[#f3f3f5] h-9 rounded-md border border-[#e5e5e5]">
              <div className="flex items-center px-3 py-2 size-full">
                <div className="relative shrink-0 size-5 mr-2">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.pdd62e30}
                      fill="#737373"
                      fillRule="evenodd"
                    />
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDatePickerOpen(false)}
              >
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function ModalityCaseDetail({
  modality,
  dateRange: initialDateRange,
  onBack,
}: ModalityCaseDetailProps) {
  const navigate = useNavigate()

  // Date range (persisted from parent, editable here)
  const [dateRange, setDateRange] = React.useState(initialDateRange)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({})

  // Filters
  const [search, setSearch] = React.useState('')
  const [selPriority, setSelPriority] = React.useState('all')
  const [selRadiologist, setSelRadiologist] = React.useState('all')

  // Sort
  const [sortCol, setSortCol] = React.useState<string>('scanCompletedTime')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  // Pagination
  const [page, setPage] = React.useState(1)

  // Chart metric toggle
  const [chartMetric, setChartMetric] = React.useState<'avgCaseTAT' | 'caseCount'>('avgCaseTAT')

  // Data
  const cases: ModalityCaseEntry[] = React.useMemo(
    () => generateModalityCaseEntries(modality.modalityId),
    [modality.modalityId]
  )

  const trendData: ModalityCaseTrendPoint[] = React.useMemo(
    () => generateModalityCaseTrendData(30),
    []
  )

  // KPIs
  const kpis = React.useMemo(() => {
    if (cases.length === 0)
      return { total: 0, avg: '0.0', median: '0.0', longest: '0.0', fastest: '0.0' }
    const tats = [...cases].map((c) => c.actualCaseTAT).sort((a, b) => a - b)
    const total = tats.length
    const avg = tats.reduce((s, t) => s + t, 0) / total
    const mid = Math.floor(total / 2)
    const median = total % 2 === 0 ? (tats[mid - 1] + tats[mid]) / 2 : tats[mid]
    return {
      total,
      avg: avg.toFixed(1),
      median: median.toFixed(1),
      longest: tats[total - 1].toFixed(1),
      fastest: tats[0].toFixed(1),
    }
  }, [cases])

  // 75th-percentile threshold for subtle high-TAT highlight
  const tatThreshold = React.useMemo(() => {
    const sorted = [...cases].map((c) => c.actualCaseTAT).sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length * 0.75)] ?? 99999
  }, [cases])

  // Sort handler
  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
    setPage(1)
  }

  // Filtered + sorted rows
  const filtered = React.useMemo(() => {
    let rows = [...cases]
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.uhid.toLowerCase().includes(q) ||
          r.bodyPart.toLowerCase().includes(q) ||
          r.radiologist.toLowerCase().includes(q)
      )
    }
    if (selPriority !== 'all') rows = rows.filter((r) => r.priority === selPriority)
    if (selRadiologist !== 'all') rows = rows.filter((r) => r.radiologist === selRadiologist)

    rows.sort((a, b) => {
      const av = (a as any)[sortCol]
      const bv = (b as any)[sortCol]
      if (typeof av === 'number' && typeof bv === 'number')
        return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return rows
  }, [cases, search, selPriority, selRadiologist, sortCol, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Export
  const handleExport = () => {
    const header =
      'UHID,Body Part,Radiologist,Scan Completed,Report Released,Actual Case TAT (hrs),Priority'
    const rows = filtered.map(
      (c) =>
        `${c.uhid},${c.bodyPart},"${c.radiologist}","${fmtDateTime(c.scanCompletedTime)}","${fmtDateTime(c.reportReleasedTime)}",${c.actualCaseTAT},${c.priority}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${modality.modality}_case_detail.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export complete')
  }

  const tickInterval = Math.floor(trendData.length / 6)
  const yLabel = chartMetric === 'avgCaseTAT' ? 'Avg Case TAT (hrs)' : 'No. of Cases'
  const yUnit = chartMetric === 'avgCaseTAT' ? ' hrs' : ''
  const lineName = chartMetric === 'avgCaseTAT' ? 'Avg Case TAT' : 'No. of Cases'

  return (
    <PageShell>
      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="size-9">
              <ArrowLeft className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
            </Button>
            <h1 className="font-['Arial'] font-bold text-[18px] leading-[28px] text-[#0a0a0a]">
              {modality.modality} – Case Performance Details
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
          <Button variant="outline" size="sm" onClick={handleExport} className="h-9 gap-2">
            <Download className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">

          {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
          

          {/* ── KPI Cards ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard
              label="Total Cases"
              value={kpis.total.toLocaleString()}
              icon={FileText}
              iconColor="text-gray-500"
            />
            <KpiCard
              label="Average Case TAT"
              value={`${kpis.avg} hrs`}
              icon={Clock}
              iconColor="text-blue-500"
            />
            <KpiCard
              label="Median Case TAT"
              value={`${kpis.median} hrs`}
              icon={Activity}
              iconColor="text-indigo-500"
            />
            <KpiCard
              label="Longest Case TAT"
              value={`${kpis.longest} hrs`}
              icon={Gauge}
              iconColor="text-orange-500"
            />
            <KpiCard
              label="Fastest Case TAT"
              value={`${kpis.fastest} hrs`}
              icon={Zap}
              iconColor="text-green-500"
            />
          </div>

          {/* ── Trend Chart ─────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[#0a0a0a]">
                  Case TAT Trend — Last 30 Days
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {chartMetric === 'avgCaseTAT'
                    ? 'Average turnaround time (hrs) from scan completion to report release'
                    : 'Number of cases completed per day'}
                </p>
              </div>

              {/* Metric toggle */}
              <div className="flex items-center gap-1 bg-[#f3f3f5] rounded-md p-1 shrink-0">
                <button
                  onClick={() => setChartMetric('avgCaseTAT')}
                  className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                    chartMetric === 'avgCaseTAT'
                      ? 'bg-white shadow-sm text-[#0a0a0a] font-medium'
                      : 'text-[#737373] hover:text-[#0a0a0a]'
                  }`}
                >
                  Avg Case TAT
                </button>
                <button
                  onClick={() => setChartMetric('caseCount')}
                  className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                    chartMetric === 'caseCount'
                      ? 'bg-white shadow-sm text-[#0a0a0a] font-medium'
                      : 'text-[#737373] hover:text-[#0a0a0a]'
                  }`}
                >
                  No. of Cases
                </button>
              </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 8, right: 24, left: 16, bottom: 36 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#737373' }}
                    interval={tickInterval}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: 'Date',
                      position: 'insideBottom',
                      offset: -18,
                      style: { fontSize: 11, fill: '#737373' },
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#737373' }}
                    tickLine={false}
                    axisLine={false}
                    unit={yUnit}
                    width={72}
                    label={{
                      value: yLabel,
                      angle: -90,
                      position: 'insideLeft',
                      dx: 14,
                      style: { textAnchor: 'middle', fontSize: 11, fill: '#737373' },
                    }}
                  />
                  <RechartsTooltip content={<ChartTooltip metric={chartMetric} />} />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ paddingBottom: 16 }}
                    content={() => (
                      <div
                        style={{
                          display: 'flex',
                          gap: 20,
                          justifyContent: 'center',
                          fontSize: 12,
                          color: '#555',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 20,
                              height: 2,
                              background: '#3b82f6',
                              borderRadius: 1,
                            }}
                          />
                          <span>{lineName}</span>
                        </div>
                      </div>
                    )}
                  />
                  <Line
                    key={chartMetric}
                    type="monotone"
                    dataKey={chartMetric}
                    name={lineName}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Case Table Filters ──────────────────────────────────────────── */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-[192px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#737373]"
                strokeWidth={ICON_STROKE_WIDTH}
              />
              <Input
                placeholder="UHID / Test Name / Radiologist"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 h-9 bg-[#f3f3f5] border-[#e5e5e5] text-sm"
              />
            </div>

            <Select
              value={selPriority}
              onValueChange={(v) => {
                setSelPriority(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-36 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selRadiologist}
              onValueChange={(v) => {
                setSelRadiologist(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-48 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Radiologists" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Radiologists</SelectItem>
                {RADIOLOGISTS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Case Table ──────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    {/* Standard sortable columns */}
                    {[
                      { key: 'uhid', label: 'UHID' },
                      { key: 'patientName', label: 'Patient Name' },
                      { key: 'bodyPart', label: 'Test Name' },
                      { key: 'radiologist', label: 'Radiologist' },
                      { key: 'scanCompletedTime', label: 'Scan Completed' },
                      { key: 'reportReleasedTime', label: 'Report Released' },
                      { key: 'priority', label: 'Priority' },
                    ].map(({ key, label }) => (
                      <th key={key} className="text-left p-0 h-10">
                        <button
                          onClick={() => handleSort(key)}
                          className="flex items-center gap-1.5 text-sm font-normal text-[#0a0a0a] hover:bg-gray-100 px-4 py-2 h-10 w-full whitespace-nowrap"
                        >
                          {label}
                          <SortIcon col={key} sortCol={sortCol} sortDir={sortDir} />
                        </button>
                      </th>
                    ))}

                    {/* Actual Case TAT — sortable + info tooltip */}
                    <th className="text-left p-0 h-10">
                      <div className="flex items-center gap-1 px-4 h-10">
                        <button
                          onClick={() => handleSort('actualCaseTAT')}
                          className="flex items-center gap-1.5 text-sm font-normal text-[#0a0a0a] hover:bg-gray-100 py-2 h-full whitespace-nowrap"
                        >
                          Actual Case TAT
                          <SortIcon col="actualCaseTAT" sortCol={sortCol} sortDir={sortDir} />
                        </button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="ml-0.5 text-[#737373] hover:text-[#0a0a0a] transition-colors flex items-center">
                              <Info className="size-3.5" strokeWidth={ICON_STROKE_WIDTH} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3" align="start" side="bottom">
                            <p className="text-xs font-medium text-[#0a0a0a] mb-1">
                              Case TAT Definition
                            </p>
                            <p className="text-xs text-[#737373] leading-relaxed">
                              Case TAT = Report Released Time – Scan Completed Time
                            </p>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-12 text-muted-foreground text-sm"
                      >
                        No cases found
                      </td>
                    </tr>
                  ) : (
                    paged.map((row) => {
                      const isHighTAT = row.actualCaseTAT >= tatThreshold
                      return (
                        <tr
                          key={row.id}
                          className={`border-b border-[#e5e5e5] last:border-0 transition-colors ${
                            isHighTAT
                              ? 'bg-amber-50/30 hover:bg-amber-50/50'
                              : 'hover:bg-[#fafafa]'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <span className="text-sm font-mono text-[#0a0a0a]">
                              {row.uhid}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#0a0a0a] whitespace-nowrap">
                              {row.patientName}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#0a0a0a]">{row.bodyPart}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#0a0a0a] whitespace-nowrap">
                              {row.radiologist}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#737373] whitespace-nowrap">
                              {fmtDateTime(row.scanCompletedTime)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#737373] whitespace-nowrap">
                              {fmtDateTime(row.reportReleasedTime)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <PriorityBadge priority={row.priority} />
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-sm font-medium ${
                                isHighTAT ? 'text-amber-600' : 'text-[#0a0a0a]'
                              }`}
                            >
                              {row.actualCaseTAT.toFixed(1)} hrs
                            </span>
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