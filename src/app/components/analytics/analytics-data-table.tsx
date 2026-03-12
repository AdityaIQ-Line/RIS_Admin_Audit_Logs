/**
 * Analytics Data Table Component
 * Reusable data table with sorting and drill-down support
 */

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../../lib/constants'
import { AnalyticsCategory, MetricDefinition } from '../../../lib/analytics-config'
import { AnalyticsDataPoint } from '../../../lib/analytics-data'
import { cn } from '../../../lib/utils'

interface AnalyticsDataTableProps {
  category: AnalyticsCategory
  data: AnalyticsDataPoint[]
  onDrillDown?: (item: AnalyticsDataPoint) => void
  title?: string
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

export function AnalyticsDataTable({
  category,
  data,
  onDrillDown,
  title,
  className
}: AnalyticsDataTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  
  // Get columns from CSV export config
  const columns = category.csvExport.columns
  
  // Format cell value
  const formatCellValue = (value: any, format?: 'number' | 'percentage' | 'duration' | 'date'): string => {
    if (value === null || value === undefined) return '-'
    
    switch (format) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value.toString()
      case 'percentage':
        return `${typeof value === 'number' ? value.toFixed(1) : value}%`
      case 'duration':
        return typeof value === 'number' ? `${value.toFixed(1)}` : value.toString()
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : value.toString()
      default:
        return value.toString()
    }
  }
  
  // Get metric threshold status
  const getMetricStatus = (columnId: string, value: any): 'normal' | 'warning' | 'critical' => {
    const metric = category.metrics.find(m => m.id === columnId)
    if (!metric || !metric.threshold || typeof value !== 'number') return 'normal'
    
    const { warning, critical, direction } = metric.threshold
    
    if (direction === 'above') {
      if (value >= critical) return 'critical'
      if (value >= warning) return 'warning'
    } else {
      if (value <= critical) return 'critical'
      if (value <= warning) return 'warning'
    }
    
    return 'normal'
  }
  
  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      
      if (aVal === bVal) return 0
      
      const comparison = aVal > bVal ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection])
  
  // Handle column sort
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc'
        if (prev === 'desc') return null
        return 'asc'
      })
      if (sortDirection === 'desc') {
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }
  
  const statusColors = {
    normal: '',
    warning: 'text-yellow-600 dark:text-yellow-400 font-medium',
    critical: 'text-red-600 dark:text-red-400 font-medium'
  }
  
  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.id}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(column.dataKey)}
                    className="-ml-3 h-8"
                  >
                    {column.header}
                    {sortColumn === column.dataKey ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                      ) : (
                        <ArrowDown className="ml-2 size-4" strokeWidth={ICON_STROKE_WIDTH} />
                      )
                    ) : (
                      <ArrowUpDown className="ml-2 size-4 opacity-50" strokeWidth={ICON_STROKE_WIDTH} />
                    )}
                  </Button>
                </TableHead>
              ))}
              {category.drillDown?.enabled && (
                <TableHead className="w-[80px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (category.drillDown?.enabled ? 1 : 0)} className="text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(column => {
                    const value = row[column.dataKey]
                    const status = getMetricStatus(column.id, value)
                    
                    return (
                      <TableCell 
                        key={column.id}
                        className={cn(statusColors[status])}
                      >
                        {formatCellValue(value, column.format)}
                      </TableCell>
                    )
                  })}
                  {category.drillDown?.enabled && onDrillDown && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDrillDown(row)}
                      >
                        <Eye className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}