/**
 * Analytics Chart Component
 * Reusable chart component supporting multiple visualization types
 */

import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { VisualizationDefinition } from '../../../lib/analytics-config'
import { AnalyticsDataPoint } from '../../../lib/analytics-data'

interface AnalyticsChartProps {
  visualization: VisualizationDefinition
  data: AnalyticsDataPoint[]
  className?: string
}

// Color palette for charts
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

export function AnalyticsChart({ visualization, data, className }: AnalyticsChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null

    return (
      <div className="rounded-lg border bg-background p-2 shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }

  const renderChart = () => {
    switch (visualization.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {visualization.metrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  name={metric}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey={Object.keys(data[0] || {})[0]} 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {visualization.metrics.map((metric, index) => (
                <Bar
                  key={metric}
                  dataKey={Object.keys(data[0] || {})[index + 1]}
                  fill={COLORS[index % COLORS.length]}
                  name={metric}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {visualization.metrics.map((metric, index) => (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={Object.keys(data[0] || {})[index + 1]}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.6}
                  name={metric}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'pie':
        // Prepare pie chart data
        const pieData = data.map((item, index) => ({
          name: item[Object.keys(item)[0]],
          value: item[Object.keys(item)[1]],
          color: COLORS[index % COLORS.length]
        }))

        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Chart type not supported
          </div>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{visualization.title}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[320px]">
        {data.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available for visualization
          </div>
        )}
      </CardContent>
    </Card>
  )
}