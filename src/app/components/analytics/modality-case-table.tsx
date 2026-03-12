import React from 'react'
import { Button } from '../ui/button'
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../../lib/constants'
import { AnalyticsDataPoint } from '../../../lib/analytics-data'

interface ModalityCaseTableProps {
  data: AnalyticsDataPoint[]
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  onView: (item: AnalyticsDataPoint) => void
}

export function ModalityCaseTable({
  data,
  sortColumn,
  sortDirection,
  onSort,
  onView
}: ModalityCaseTableProps) {
  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
      ) : (
        <ArrowDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
      )
    }
    return <ArrowUpDown className="size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
  }

  return (
    <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e5e5]">
              <th className="text-left p-2 h-9">
                <button
                  onClick={() => onSort('modality')}
                  className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Modality
                  {getSortIcon('modality')}
                </button>
              </th>
              <th className="text-left p-2 h-9">
                <button
                  onClick={() => onSort('totalCases')}
                  className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Total Cases
                  {getSortIcon('totalCases')}
                </button>
              </th>
              <th className="text-left p-2 h-9">
                <button
                  onClick={() => onSort('avgTAT')}
                  className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Avg TAT (hrs)
                  {getSortIcon('avgTAT')}
                </button>
              </th>
              <th className="text-left p-2 h-9">
                <button
                  onClick={() => onSort('medianTAT')}
                  className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Median TAT
                  {getSortIcon('medianTAT')}
                </button>
              </th>
              <th className="text-left p-2 h-9">
                <span className="text-sm font-bold text-[#0a0a0a] px-2">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-b border-[#e5e5e5] last:border-0">
                  <td className="p-2 h-10">
                    <span className="text-sm font-medium text-[#0a0a0a] px-2">{row.modality}</span>
                  </td>
                  <td className="p-2 h-10">
                    <span className="text-sm text-[#0a0a0a] px-2">{row.totalCases}</span>
                  </td>
                  <td className="p-2 h-10">
                    <span className="text-sm text-[#0a0a0a] px-2">{row.avgTAT?.toFixed(1)}</span>
                  </td>
                  <td className="p-2 h-10">
                    <span className="text-sm text-[#0a0a0a] px-2">{row.medianTAT?.toFixed(1)}</span>
                  </td>
                  <td className="p-2 h-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(row)}
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
  )
}