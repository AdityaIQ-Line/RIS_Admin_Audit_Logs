/**
 * CSV Export Utility for Analytics Module
 * NABH-compliant data export with audit trail
 */

import { AnalyticsCategory } from './analytics-config'
import { AnalyticsDataPoint } from './analytics-data'

/**
 * Format value based on specified format type
 */
function formatValue(value: any, format?: 'number' | 'percentage' | 'duration' | 'date'): string {
  if (value === null || value === undefined) return ''
  
  switch (format) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value.toString()
    case 'percentage':
      return typeof value === 'number' ? `${value.toFixed(2)}%` : `${value}%`
    case 'duration':
      return typeof value === 'number' ? `${value.toFixed(2)}` : value.toString()
    case 'date':
      return value instanceof Date ? value.toLocaleDateString() : value.toString()
    default:
      return value.toString()
  }
}

/**
 * Generate CSV content from analytics data
 */
export function generateCSV(
  category: AnalyticsCategory,
  data: AnalyticsDataPoint[],
  filters?: Record<string, any>
): string {
  const lines: string[] = []
  
  // Add metadata header (NABH compliance - audit trail)
  lines.push('# Analytics Export')
  lines.push(`# Category: ${category.name}`)
  lines.push(`# Generated: ${new Date().toISOString()}`)
  lines.push(`# Module Version: 1.0.0`)
  
  if (filters) {
    lines.push(`# Filters Applied:`)
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        lines.push(`#   ${key}: ${JSON.stringify(value)}`)
      }
    })
  }
  
  lines.push('') // Empty line separator
  
  // Add column headers
  const headers = category.csvExport.columns.map(col => col.header)
  lines.push(headers.join(','))
  
  // Add data rows
  data.forEach(row => {
    const values = category.csvExport.columns.map(col => {
      const value = row[col.dataKey]
      const formatted = formatValue(value, col.format)
      
      // Escape values containing commas or quotes
      if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')) {
        return `"${formatted.replace(/"/g, '""')}"`
      }
      
      return formatted
    })
    
    lines.push(values.join(','))
  })
  
  return lines.join('\n')
}

/**
 * Download CSV file to user's device
 */
export function downloadCSV(
  category: AnalyticsCategory,
  data: AnalyticsDataPoint[],
  filters?: Record<string, any>
): void {
  const csvContent = generateCSV(category, data, filters)
  
  // Create blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `${category.csvExport.filename}_${timestamp}.csv`
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Validate data before export
 */
export function validateExportData(data: AnalyticsDataPoint[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!data || data.length === 0) {
    errors.push('No data available for export')
  }
  
  if (data.length > 10000) {
    errors.push('Export exceeds maximum row limit (10,000). Please apply filters to reduce data size.')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Generate summary statistics for export
 */
export function generateExportSummary(
  category: AnalyticsCategory,
  data: AnalyticsDataPoint[]
): string {
  const summary: string[] = []
  
  summary.push('Export Summary')
  summary.push('='.repeat(50))
  summary.push(`Category: ${category.name}`)
  summary.push(`Total Records: ${data.length}`)
  summary.push(`Generated: ${new Date().toLocaleString()}`)
  summary.push(`Columns: ${category.csvExport.columns.length}`)
  summary.push('='.repeat(50))
  
  return summary.join('\n')
}
