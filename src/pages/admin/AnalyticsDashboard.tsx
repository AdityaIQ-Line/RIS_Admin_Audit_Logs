/**
 * Analytics & Monitoring Dashboard
 * Main landing page for analytics module - Admin only
 */

import React from 'react'
import { useNavigate } from 'react-router'
import { PageShell } from '../../app/components/layouts/page-shell'
import { PageHeader } from '../../app/components/blocks/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../app/components/ui/card'
import { Button } from '../../app/components/ui/button'
import { Badge } from '../../app/components/ui/badge'
import { 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  FileText,
  Users,
  Cpu,
  Shield,
  GitCompare,
  AlertTriangle,
  UserCheck,
  ChevronRight
} from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../lib/constants'
import { ANALYTICS_CATEGORIES } from '../../lib/analytics-config'
import { generateTimeSeriesData } from '../../lib/analytics-data'
import { AnalyticsChart } from '../../app/components/analytics/analytics-chart'

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  UserCheck,
  Activity,
  FileText,
  Users,
  Cpu,
  Clock,
  CheckCircle,
  Shield,
  GitCompare,
  TrendingUp,
  AlertTriangle
}

export function AnalyticsDashboard() {
  const navigate = useNavigate()

  // Mock high-level KPIs
  const kpis = [
    {
      label: 'Total Reports (30d)',
      value: '2,847',
      change: '+12.5%',
      trend: 'up' as const,
      status: 'normal' as const
    },
    {
      label: 'Avg TAT',
      value: '32.4 hrs',
      change: '-8.2%',
      trend: 'down' as const,
      status: 'normal' as const
    },
    {
      label: 'AI Acceptance',
      value: '78.5%',
      change: '+15.3%',
      trend: 'up' as const,
      status: 'normal' as const
    },
    {
      label: 'Current Backlog',
      value: '142',
      change: '+23',
      trend: 'up' as const,
      status: 'warning' as const
    },
    {
      label: 'TAT Compliance',
      value: '92.1%',
      change: '-3.2%',
      trend: 'down' as const,
      status: 'warning' as const
    }
  ]

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/admin/analytics/${categoryId}`)
  }

  return (
    <PageShell>
      <PageHeader 
        title="Analyzing & Monitoring"
      />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">
          
          {/* Page Description */}
          

          {/* High-Level KPIs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {kpis.map((kpi, index) => {
                const iconColors = {
                  0: 'text-blue-600',
                  1: 'text-green-600',
                  2: 'text-purple-600',
                  3: 'text-orange-600',
                  4: 'text-red-600',
                  5: 'text-blue-600'
                }

                const icons = [Users, Clock, CheckCircle, Cpu, AlertTriangle, TrendingUp]
                const Icon = icons[index]

                return (
                  <Card key={index} className="border">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardDescription className="text-xs text-muted-foreground">{kpi.label}</CardDescription>
                        <Icon strokeWidth={ICON_STROKE_WIDTH} className={`h-5 w-5 ${iconColors[index as keyof typeof iconColors]}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {kpi.change} vs last period
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Analytics Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Analytics Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ANALYTICS_CATEGORIES.map(category => {
                const IconComponent = ICON_MAP[category.icon] || Activity

                return (
                  <Card 
                    key={category.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent 
                              className="size-5 text-primary" 
                              strokeWidth={ICON_STROKE_WIDTH} 
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base">{category.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{category.metrics.length} metrics tracked</span>
                        <span>{category.filters.length} filters available</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common analytics and reporting tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button variant="outline" className="justify-start">
                  <FileText className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                  Generate Monthly Report
                </Button>
                <Button variant="outline" className="justify-start">
                  <TrendingUp className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                  View Performance Trends
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                  QA Compliance Check
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertTriangle className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                  Identify Bottlenecks
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageShell>
  )
}