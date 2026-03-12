import * as React from "react"
import { Link } from "react-router"
import { PageShell } from "../../app/components/layouts/page-shell"
import { PageHeader } from "../../app/components/blocks/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../app/components/ui/card"
import { Button } from "../../app/components/ui/button"
import { Avatar, AvatarFallback } from "../../app/components/ui/avatar"
import { StatCard } from "../../app/components/cards/stat-card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { 
  Users, 
  Settings, 
  BarChart3, 
  UserCog,
  ChevronRight,
} from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../lib/constants"

/**
 * ADMIN DASHBOARD (Facility / Centre Level)
 * 
 * Purpose: Day-to-day operational and business management
 */

// Circular Progress Component
function CircularProgress({ percentage, color, size = 120 }: { percentage: number; color: string; size?: number }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth="10"
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      {/* Percentage text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.3em"
        className="text-2xl font-bold fill-current transform rotate-90"
        style={{ transformOrigin: 'center' }}
      >
        {percentage}%
      </text>
    </svg>
  )
}

// Sparkline data generator
const generateSparklineData = (trend: 'up' | 'down' | 'wave') => {
  const points = 10
  const data = []
  for (let i = 0; i < points; i++) {
    if (trend === 'up') {
      data.push({ value: 20 + i * 8 + Math.random() * 10 })
    } else if (trend === 'down') {
      data.push({ value: 100 - i * 8 + Math.random() * 10 })
    } else {
      data.push({ value: 50 + Math.sin(i * 0.8) * 20 + Math.random() * 10 })
    }
  }
  return data
}

export function AdminDashboard() {
  const modalityWorkload = [
    { name: "CT Scan", percentage: 70, completed: 24, total: 35, color: "#3b82f6" },
    { name: "MRI", percentage: 50, completed: 18, total: 36, color: "#10b981" },
    { name: "X-Ray", percentage: 88, completed: 48, total: 55, color: "#f97316" },
    { name: "Ultrasound", percentage: 28, completed: 10, total: 36, color: "#8b5cf6" },
  ]

  const financialData = [
    { 
      label: "DAILY REVENUE",
      value: "₹2,45,680",
      trend: 'up' as const,
      color: "#10b981"
    },
    { 
      label: "PENDING PAYMENTS",
      value: "₹45,200",
      trend: 'down' as const,
      color: "#f97316"
    },
    { 
      label: "DISCOUNTS GIVEN",
      value: "₹12,450",
      trend: 'wave' as const,
      color: "#3b82f6"
    },
  ]

  const staffStatus = [
    { role: "Radiologists On-duty", count: 8, total: 12, color: "#3b82f6" },
    { role: "Technicians On-duty", count: 12, total: 18, color: "#10b981" },
    { role: "On Leave Today", count: 5, total: 30, color: "#f97316" },
  ]

  const productivityMetrics = [
    {
      title: "Avg TAT (CT)",
      value: "2.5h",
      subtitle: "Goal: < 3h",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Avg TAT (MRI)",
      value: "3.2h",
      subtitle: "Goal: < 4h",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Radiologist",
      value: "28",
      subtitle: "cases/day avg",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      title: "Technician",
      value: "16",
      subtitle: "scans/day avg",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ]

  const quickActions = [
    {
      title: "User Management",
      description: "Manage facility roles",
      icon: UserCog,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      href: "/admin/users",
    },
    {
      title: "Financial Reports",
      description: "View revenue data",
      icon: BarChart3,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      href: "/admin/reports",
    },
    {
      title: "System Settings",
      description: "Configure parameters",
      icon: Settings,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      href: "/admin/settings",
    },
  ]

  return (
    <PageShell>
      <PageHeader 
        title="Admin Dashboard" 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
          
          {/* Patient & Order Summary */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Registrations Today"
                value="147"
                description="+23 from yesterday"
                icon={Users}
                iconStrokeWidth={ICON_STROKE_WIDTH}
                iconColor="text-blue-600"
              />
              <StatCard
                title="Emergency Cases"
                value="8"
                description="Requires immediate attention"
                icon={Users}
                iconStrokeWidth={ICON_STROKE_WIDTH}
                iconColor="text-red-600"
                className="border-amber-500/30"
              />
              <StatCard
                title="Pending Registrations"
                value="12"
                description="Awaiting completion"
                icon={Users}
                iconStrokeWidth={ICON_STROKE_WIDTH}
                iconColor="text-orange-600"
              />
            </div>
          </div>

          {/* Main Grid - Modality Workload and Financial Summary */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Modality Workload */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Modality Workload</CardTitle>
                  <Button variant="link" className="text-primary p-0 h-auto">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  {modalityWorkload.map((modality) => (
                    <div key={modality.name} className="flex flex-col items-center">
                      <CircularProgress percentage={modality.percentage} color={modality.color} />
                      <p className="font-semibold mt-3">{modality.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {modality.completed}/{modality.total} Studies
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {financialData.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{item.value}</p>
                      <div className="w-24 h-12">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                          <LineChart data={generateSparklineData(item.trend)}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={item.color} 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Staff Status and Productivity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Staff Status */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {staffStatus.map((staff) => (
                  <div key={staff.role} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{staff.role}</span>
                      <span className="font-semibold">
                        {staff.count} / {staff.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${(staff.count / staff.total) * 100}%`,
                          backgroundColor: staff.color
                        }} 
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="bg-green-500 text-white text-xs">SM</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="bg-purple-500 text-white text-xs">AK</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">+7</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-sm text-muted-foreground">Total 20 Present</span>
                </div>
              </CardContent>
            </Card>

            {/* Productivity */}
            <Card>
              <CardHeader>
                <CardTitle>Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {productivityMetrics.map((metric) => (
                    <div 
                      key={metric.title} 
                      className={`${metric.bgColor} rounded-lg p-4 space-y-1`}
                    >
                      <p className={`text-xs font-medium ${metric.textColor}`}>
                        {metric.title}
                      </p>
                      <p className={`text-3xl font-bold ${metric.textColor}`}>
                        {metric.value}
                      </p>
                      <p className={`text-xs ${metric.textColor} opacity-75`}>
                        {metric.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className="w-full justify-between h-auto p-4"
                    asChild
                  >
                    <Link to={action.href}>
                      <div className="flex items-center gap-3">
                        <div className={`${action.iconBg} ${action.iconColor} p-2 rounded-lg`}>
                          <Icon strokeWidth={ICON_STROKE_WIDTH} className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight strokeWidth={ICON_STROKE_WIDTH} className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

export default AdminDashboard