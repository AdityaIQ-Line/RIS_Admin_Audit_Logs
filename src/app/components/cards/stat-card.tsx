import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { cn } from "../../../lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconStrokeWidth?: number
  iconColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconStrokeWidth = 1.5,
  iconColor = "text-primary",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xs font-normal text-muted-foreground">{title}</h3>
          <Icon strokeWidth={iconStrokeWidth} className={cn("h-5 w-5", iconColor)} />
        </div>
        <div className="space-y-0.5">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}