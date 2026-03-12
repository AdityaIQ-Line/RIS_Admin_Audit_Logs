/**
 * Report Revision Analytics
 * Screen 1 – Revision Performance List (grouped by radiologist)
 * Screen 2 – Radiologist Revision Detail
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
  RefreshCw,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Home,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../lib/constants'
import {
  generateRevisionRadiologistData,
  generateRevisionHistoryData,
  generateRevisionTrendData,
  RevisionRadiologistRow,
  RevisionHistoryEntry,
  RevisionTrendPoint,
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
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ─── Constants ────────────────────────────────────────────────────────────────

const POST_FINAL_THRESHOLD = 5 // % above which post-final is flagged red
const ITEMS_PER_PAGE = 10

const FACILITIES = ['City Medical Center', 'Northside Clinic', 'East Wing Hospital', 'South Campus']
const MODALITIES = ['CT', 'MRI', 'X-Ray', 'Ultrasound']
const RADIOLOGISTS_FILTER = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Williams',
  'Dr. James Anderson',
  'Dr. Maria Garcia',
  'Dr. Robert Thompson',
  'Dr. Linda Martinez',
  'Dr. David Kim',
]
const REVISION_TYPES = ['Minor', 'Major', 'Post-Final']
const REVISION_REASONS = [
  'Measurement Error',
  'Clinical Correlation Needed',
  'Critical Finding Missed',
  'Technique Description Update',
  'Comparison Study Added',
  'Typographical Correction',
  'Impression Clarification',
  'Referring Physician Request',
  'Incidental Finding Added',
  'Protocol Deviation Noted',
]

// ─── Quick-range helper ────────────────────────────────────────────────────────
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
}: {
  label: string
  value: string
  icon: React.ComponentType<any>
  iconColor: string
  valueColor?: string
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[11.2px] p-1">
      <div className="flex items-center justify-between px-6 h-[43px]">
        <p className="text-sm text-[#0a0a0a]">{label}</p>
        <Icon className={`size-4 ${iconColor}`} strokeWidth={ICON_STROKE_WIDTH} />
      </div>
      <div className="px-6 pb-4">
        <p className={`text-base font-bold ${valueColor ?? 'text-[#0a0a0a]'}`}>{value}</p>
      </div>
    </div>
  )
}

// ─── Sort icon helper ─────────────────────────────────────────────────────────
function SortIcon({ column, sortColumn, sortDir }: { column: string; sortColumn: string | null; sortDir: 'asc' | 'desc' }) {
  if (sortColumn !== column) return <ArrowUpDown className="size-4 opacity-40" strokeWidth={ICON_STROKE_WIDTH} />
  return sortDir === 'asc'
    ? <ArrowUp className="size-4 opacity-60" strokeWidth={ICON_STROKE_WIDTH} />
    : <ArrowDown className="size-4 opacity-60" strokeWidth={ICON_STROKE_WIDTH} />
}

// ─── Revision-type badge ──────────────────────────────────────────────────────
function RevisionTypeBadge({ type }: { type: RevisionHistoryEntry['revisionType'] }) {
  const styles: Record<string, string> = {
    Minor: 'bg-blue-50 text-blue-700 border-blue-200',
    Major: 'bg-amber-50 text-amber-700 border-amber-200',
    'Post-Final': 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${styles[type]}`}>
      {type}
    </span>
  )
}

// ─── Tooltip for chart ────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-white p-2 shadow-lg">
      <p className="text-xs font-medium mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  )
}

// ─── Screen 1 ─────────────────────────────────────────────────────────────────
function RevisionPerformanceList({
  onViewDetail,
}: {
  onViewDetail: (row: RevisionRadiologistRow) => void
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
  const [selFacility, setSelFacility] = React.useState('all')
  const [selModality, setSelModality] = React.useState('all')
  const [selRadiologist, setSelRadiologist] = React.useState('all')
  const [selRevisionType, setSelRevisionType] = React.useState('all')
  const [selReason, setSelReason] = React.useState('all')

  // Sort
  const [sortColumn, setSortColumn] = React.useState<string>('totalReports')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  // Pagination
  const [page, setPage] = React.useState(1)

  // Data
  const allData = React.useMemo(() => generateRevisionRadiologistData(), [])

  // KPIs from raw data
  const kpis = React.useMemo(() => {
    const total = allData.reduce((s, r) => s + r.totalReports, 0)
    const revised = allData.reduce((s, r) => s + r.revisedReports, 0)
    const revRate = total ? ((revised / total) * 100).toFixed(1) : '0.0'
    const avgPostFinal = (allData.reduce((s, r) => s + r.postFinalPct, 0) / allData.length).toFixed(1)
    const avgTime = Math.round(allData.reduce((s) => s + (Math.random() * 200 + 60), 0) / allData.length)
    return { total, revRate, avgPostFinal, avgTime }
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
        r.radiologistName.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (selRadiologist !== 'all') {
      rows = rows.filter((r) => r.radiologistName === selRadiologist)
    }
    rows.sort((a, b) => {
      const av = a[sortColumn] as number
      const bv = b[sortColumn] as number
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return rows
  }, [allData, search, selRadiologist, sortColumn, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleExport = () => {
    const header = 'Radiologist,Total Reports,Revised,Revision Rate %,Post-Final %,Avg Revisions/Report'
    const rows = filtered.map(
      (r) =>
        `"${r.radiologistName}",${r.totalReports},${r.revisedReports},${r.revisionRate},${r.postFinalPct},${r.avgRevisionsPerReport}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_revision_analytics_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export complete')
  }

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
              Report Revision Analytics
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

          {/* Breadcrumb */}
          

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Reports"
              value={kpis.total.toLocaleString()}
              icon={FileText}
              iconColor="text-gray-500"
            />
            <KpiCard
              label="Revision Rate"
              value={`${kpis.revRate}%`}
              icon={RefreshCw}
              iconColor="text-blue-500"
            />
            <KpiCard
              label="Post-Final Revision %"
              value={`${kpis.avgPostFinal}%`}
              icon={AlertTriangle}
              iconColor={parseFloat(kpis.avgPostFinal) > POST_FINAL_THRESHOLD ? 'text-red-500' : 'text-gray-500'}
              valueColor={parseFloat(kpis.avgPostFinal) > POST_FINAL_THRESHOLD ? 'text-red-600' : undefined}
            />
            <KpiCard
              label="Avg Time to Revision"
              value={`${kpis.avgTime} mins`}
              icon={Clock}
              iconColor="text-gray-500"
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
                placeholder="UHID ID / Visit ID"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
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
                {MODALITIES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Radiologist */}
            <Select value={selRadiologist} onValueChange={(v) => { setSelRadiologist(v); setPage(1) }}>
              <SelectTrigger className="w-48 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="All Radiologists" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Radiologists</SelectItem>
                {RADIOLOGISTS_FILTER.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Revision Type */}
            <Select value={selRevisionType} onValueChange={(v) => { setSelRevisionType(v); setPage(1) }}>
              <SelectTrigger className="w-40 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="Revision Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {REVISION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Revision Reason */}
            <Select value={selReason} onValueChange={(v) => { setSelReason(v); setPage(1) }}>
              <SelectTrigger className="w-52 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                <SelectValue placeholder="Revision Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {REVISION_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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
                      { key: 'radiologistName', label: 'Radiologist' },
                      { key: 'totalReports', label: 'Total Reports' },
                      { key: 'revisedReports', label: 'Revised Reports' },
                      { key: 'revisionRate', label: 'Revision Rate %' },
                      { key: 'postFinalPct', label: 'Post-Final %' },
                      { key: 'avgRevisionsPerReport', label: 'Avg Revisions / Report' },
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
                    paged.map((row, idx) => (
                      <tr key={row.radiologistId} className="border-b border-[#e5e5e5] last:border-0 hover:bg-[#fafafa] transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-[#0a0a0a]">{row.radiologistName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#0a0a0a]">{row.totalReports.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#0a0a0a]">{row.revisedReports}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm ${row.revisionRate > 10 ? 'text-amber-600' : 'text-[#0a0a0a]'}`}>
                            {row.revisionRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${row.postFinalPct > POST_FINAL_THRESHOLD ? 'text-red-600' : 'text-[#0a0a0a]'}`}>
                            {row.postFinalPct.toFixed(1)}%
                            {row.postFinalPct > POST_FINAL_THRESHOLD && (
                              <AlertCircle className="inline ml-1 size-3.5 text-red-500" strokeWidth={ICON_STROKE_WIDTH} />
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#0a0a0a]">{row.avgRevisionsPerReport.toFixed(2)}</span>
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
                    ))
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

// ─── Screen 2 ─────────────────────────────────────────────────────────────────
function RevisionDetail({
  radiologist,
  onBack,
}: {
  radiologist: RevisionRadiologistRow
  onBack: () => void
}) {
  const navigate = useNavigate()

  // Pagination for history table
  const [histPage, setHistPage] = React.useState(1)
  const [histSearch, setHistSearch] = React.useState('')
  const [histRevType, setHistRevType] = React.useState('all')
  const [histModality, setHistModality] = React.useState('all')

  const history: RevisionHistoryEntry[] = React.useMemo(
    () => generateRevisionHistoryData(radiologist.radiologistId),
    [radiologist.radiologistId]
  )

  const trendData: RevisionTrendPoint[] = React.useMemo(() => generateRevisionTrendData(30), [])

  // KPIs for detail
  const totalRevisions = history.length
  const postFinalCorrections = history.filter((h) => h.revisionType === 'Post-Final').length
  const avgTime = Math.round(history.reduce((s, h) => s + h.timeToRevision, 0) / history.length)
  const reasonCounts: Record<string, number> = {}
  history.forEach((h) => {
    reasonCounts[h.reason] = (reasonCounts[h.reason] || 0) + 1
  })
  const mostCommonReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // Filtered history
  const filteredHistory = React.useMemo(() => {
    let rows = [...history]
    if (histSearch) {
      rows = rows.filter(
        (r) =>
          r.patientId.toLowerCase().includes(histSearch.toLowerCase()) ||
          r.visitId.toLowerCase().includes(histSearch.toLowerCase())
      )
    }
    if (histRevType !== 'all') rows = rows.filter((r) => r.revisionType === histRevType)
    if (histModality !== 'all') rows = rows.filter((r) => r.modality === histModality)
    return rows
  }, [history, histSearch, histRevType, histModality])

  const histTotalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE))
  const pagedHistory = filteredHistory.slice(
    (histPage - 1) * ITEMS_PER_PAGE,
    histPage * ITEMS_PER_PAGE
  )

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
              {radiologist.radiologistName}
            </h1>
            <Badge variant="outline" className="text-xs">Revision Detail</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">

          {/* Breadcrumb */}
          

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Revisions"
              value={totalRevisions.toString()}
              icon={RefreshCw}
              iconColor="text-blue-500"
            />
            <KpiCard
              label="Post-Final Corrections"
              value={postFinalCorrections.toString()}
              icon={AlertTriangle}
              iconColor={postFinalCorrections > 3 ? 'text-red-500' : 'text-gray-500'}
              valueColor={postFinalCorrections > 3 ? 'text-red-600' : undefined}
            />
            <KpiCard
              label="Avg Time to Revision"
              value={`${avgTime} mins`}
              icon={Clock}
              iconColor="text-gray-500"
            />
            <div className="bg-white border border-[#e5e5e5] rounded-[11.2px] p-1">
              <div className="flex items-center justify-between px-6 h-[43px]">
                <p className="text-sm text-[#0a0a0a]">Most Common Reason</p>
                <TrendingUp className="size-4 text-gray-500" strokeWidth={ICON_STROKE_WIDTH} />
              </div>
              <div className="px-6 pb-4">
                <p className="text-sm font-bold text-[#0a0a0a] truncate" title={mostCommonReason}>
                  {mostCommonReason}
                </p>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg">
            <div className="px-6 py-4 border-b border-[#e5e5e5]">
              <h2 className="text-sm font-semibold text-[#0a0a0a]">Revision Rate Trend (Last 30 Days)</h2>
              <p className="text-xs text-[#737373] mt-0.5">Revision Rate % vs Post-Final Rate %</p>
            </div>
            <div className="p-6">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: 10, bottom: 36 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#737373' }}
                      interval={4}
                      tickLine={false}
                      label={{ value: 'Date', position: 'insideBottom', offset: -18, style: { fontSize: 11, fill: '#737373' } }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#737373' }}
                      tickLine={false}
                      axisLine={false}
                      unit="%"
                      width={60}
                      label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', dx: 14, style: { textAnchor: 'middle', fontSize: 11, fill: '#737373' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      wrapperStyle={{ paddingBottom: 16 }}
                      content={() => (
                        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', fontSize: 12, color: '#555' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ display: 'inline-block', width: 20, height: 2, background: '#3b82f6', borderRadius: 1 }} />
                            <span>Revision Rate</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="20" height="2" style={{ display: 'inline-block' }}>
                              <line x1="0" y1="1" x2="20" y2="1" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3" />
                            </svg>
                            <span>Post-Final Rate</span>
                          </div>
                        </div>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="revisionRate"
                      name="Revision Rate"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="postFinalRate"
                      name="Post-Final Rate"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Revision History Table */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-sm font-semibold text-[#0a0a0a]">Revision History</h2>
                <p className="text-xs text-[#737373] mt-0.5">{filteredHistory.length} entries</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative w-[192px]">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#737373]"
                    strokeWidth={ICON_STROKE_WIDTH}
                  />
                  <Input
                    placeholder="Patient / Visit ID"
                    value={histSearch}
                    onChange={(e) => { setHistSearch(e.target.value); setHistPage(1) }}
                    className="pl-9 h-9 bg-[#f3f3f5] border-[#e5e5e5] text-sm"
                  />
                </div>
                {/* Revision Type */}
                <Select value={histRevType} onValueChange={(v) => { setHistRevType(v); setHistPage(1) }}>
                  <SelectTrigger className="w-36 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {REVISION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {/* Modality */}
                <Select value={histModality} onValueChange={(v) => { setHistModality(v); setHistPage(1) }}>
                  <SelectTrigger className="w-32 h-9 bg-[#f3f3f5] border-[#e5e5e5]">
                    <SelectValue placeholder="Modality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {MODALITIES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    {[
                      'UHID ID',
                      'Patient Name',
                      'Modality',
                      'Rev #',
                      'Revision Type',
                      'Reason',
                      'Revised By',
                      'Time to Revision',
                      'Critical Flag Changed',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-sm font-normal text-[#0a0a0a] whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedHistory.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-muted-foreground text-sm">
                        No revision records found
                      </td>
                    </tr>
                  ) : (
                    pagedHistory.map((entry) => {
                      const isPostFinal = entry.revisionType === 'Post-Final'
                      const rowCls = isPostFinal ? 'bg-red-50/40' : ''

                      return (
                        <tr
                          key={entry.id}
                          className={`border-b border-[#e5e5e5] last:border-0 hover:bg-[#fafafa] transition-colors ${rowCls}`}
                        >
                          <td className="px-4 py-2.5">
                            <div className="text-sm font-medium text-[#0a0a0a]">{entry.patientId}</div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-[#0a0a0a] whitespace-nowrap">{entry.patientName}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-[#0a0a0a]">{entry.modality}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-sm text-[#0a0a0a]">{entry.revisionNumber}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <RevisionTypeBadge type={entry.revisionType} />
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-[#0a0a0a]">{entry.reason}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-[#0a0a0a] whitespace-nowrap">{entry.revisedBy}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-[#0a0a0a] whitespace-nowrap">
                              {entry.timeToRevision >= 60
                                ? `${Math.floor(entry.timeToRevision / 60)}h ${entry.timeToRevision % 60}m`
                                : `${entry.timeToRevision}m`}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            {entry.criticalFlagChanged ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                <AlertCircle className="size-3" strokeWidth={ICON_STROKE_WIDTH} />
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                                No
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={histPage}
              totalPages={histTotalPages}
              totalItems={filteredHistory.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setHistPage}
            />
          </div>

        </div>
      </div>
    </PageShell>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────
export function ReportRevisionAnalytics() {
  const [selectedRadiologist, setSelectedRadiologist] =
    React.useState<RevisionRadiologistRow | null>(null)

  if (selectedRadiologist) {
    return (
      <RevisionDetail
        radiologist={selectedRadiologist}
        onBack={() => setSelectedRadiologist(null)}
      />
    )
  }

  return <RevisionPerformanceList onViewDetail={setSelectedRadiologist} />
}