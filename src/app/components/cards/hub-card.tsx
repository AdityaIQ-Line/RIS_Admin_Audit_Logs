import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { cn } from '../../../lib/utils'
import { ICON_STROKE_WIDTH } from '../../../lib/constants'

interface HubCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick?: () => void
  className?: string
}

export function HubCard({
  title,
  description,
  icon: Icon,
  onClick,
  className,
}: HubCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer shadow-sm transition-colors hover:border-primary/50',
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col gap-4">
        {/* Icon pill */}
        <div className="w-fit rounded-md bg-primary/10 p-2.5">
          <Icon
            strokeWidth={ICON_STROKE_WIDTH}
            className="size-5 text-primary"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5">
          <p
            className="paragraph-bold text-foreground"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}
          >
            {title}
          </p>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-normal)', lineHeight: '1.5' }}
          >
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
