import React from "react"
import { Badge } from "../ui/badge"

/**
 * STANDARDIZED MODALITY BADGE
 * 
 * Single source of truth for modality display across all worklists.
 * Based on the QC Technician Worklist design (Figma screenshot).
 * 
 * STYLING:
 * - Compact pill/badge design
 * - Outline variant for neutral appearance
 * - Consistent sizing and padding
 * 
 * COMMON MODALITIES:
 * - CT, MRI, X-Ray, Ultrasound, PET, Mammography, etc.
 * 
 * USAGE:
 * <ModalityBadge modality="CT" />
 * <ModalityBadge modality="MRI" />
 */

interface ModalityBadgeProps {
  modality: string
  className?: string
}

export function ModalityBadge({ modality, className }: ModalityBadgeProps) {
  return (
    <Badge variant="outline" className={className}>
      {modality}
    </Badge>
  )
}
