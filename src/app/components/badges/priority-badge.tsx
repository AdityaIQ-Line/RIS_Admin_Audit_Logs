import React from "react"
import { Badge } from "../ui/badge"

/**
 * STANDARDIZED PRIORITY BADGE
 * 
 * Single source of truth for priority display across all worklists.
 * Based on the QC Technician Worklist design (Figma screenshot).
 * 
 * PRIORITY TYPES & COLORS:
 * - STAT: Red background (#dc2626), white text - Most urgent
 * - Urgent: Red variant (destructive)
 * - Routine: Gray/neutral variant (secondary)
 * 
 * USAGE:
 * <PriorityBadge priority="STAT" />
 * <PriorityBadge priority="Urgent" />
 * <PriorityBadge priority="Routine" />
 */

type PriorityType = "STAT" | "Urgent" | "Routine"

interface PriorityBadgeProps {
  priority: PriorityType
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  switch (priority) {
    case "STAT":
      return (
        <Badge className={`bg-red-600 text-white hover:bg-red-700 ${className || ''}`}>
          STAT
        </Badge>
      )
    case "Urgent":
      return (
        <Badge variant="destructive" className={className}>
          Urgent
        </Badge>
      )
    case "Routine":
      return (
        <Badge variant="secondary" className={className}>
          Routine
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={className}>
          {priority}
        </Badge>
      )
  }
}
