/**
 * KPI Card Component
 * Displays key performance indicator with trend and threshold indicators
 */

import { TrendingUp, TrendingDown, Minus, AlertTriangle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ICON_STROKE_WIDTH } from '../../../lib/constants'
import { cn } from '../../../lib/utils'
import { MetricDefinition } from '../../../lib/analytics-config'

interface KPICardProps {
  metric: MetricDefinition
  value: number
  previousValue?: number
  trend?: 'up' | 'down' | 'stable'
  className?: string
}

export function KPICard({ metric, value, previousValue, trend, className }: KPICardProps) {
  // Determine status based on threshold
  const getStatus = (): 'normal' | 'warning' | 'critical' => {
    if (!metric.threshold) return 'normal'
    
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
  
  const status = getStatus()
  
  // Format value based on metric type
  const formatValue = (val: number): string => {
    switch (metric.format) {
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'duration':
        return `${val.toFixed(1)}${metric.unit ? ` ${metric.unit}` : ''}`
      case 'decimal':
        return val.toFixed(1)
      case 'number':
      default:
        return val.toLocaleString()
    }
  }
  
  // Calculate trend percentage
  const trendPercentage = previousValue 
    ? ((value - previousValue) / previousValue * 100).toFixed(1)
    : null
  
  const statusColors = {
    normal: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-red-600 dark:text-red-400'
  }
  
  const statusBgColors = {
    normal: 'bg-green-50 dark:bg-green-950/30',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30',
    critical: 'bg-red-50 dark:bg-red-950/30'
  }
  
  return (
    <Card className={cn(statusBgColors[status], className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {metric.name}
          </CardTitle>
          {status !== 'normal' && (
            <div className={cn('p-1 rounded', statusColors[status])}>
              {status === 'warning' ? (
                <AlertTriangle className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
              ) : (
                <AlertCircle className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className={cn('text-2xl font-bold', statusColors[status])}>
            {formatValue(value)}
          </div>
          
          {trendPercentage && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {trend === 'up' && (
                <TrendingUp className="size-3" strokeWidth={ICON_STROKE_WIDTH} />
              )}
              {trend === 'down' && (
                <TrendingDown className="size-3" strokeWidth={ICON_STROKE_WIDTH} />
              )}
              {trend === 'stable' && (
                <Minus className="size-3" strokeWidth={ICON_STROKE_WIDTH} />
              )}
              <span>{trendPercentage}% vs previous period</span>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground pt-1">
            {metric.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
