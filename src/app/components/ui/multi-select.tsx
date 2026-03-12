import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "./utils"
import { Button } from "./button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Badge } from "./badge"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure selected is always an array
  const safeSelected = selected || []

  const handleSelect = (value: string) => {
    if (safeSelected.includes(value)) {
      onChange(safeSelected.filter((item) => item !== value))
    } else {
      onChange([...safeSelected, value])
    }
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(safeSelected.filter((item) => item !== value))
  }

  const selectedLabels = safeSelected.map(
    (value) => options.find((opt) => opt.value === value)?.label || value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between min-h-10 h-auto", className)}
        >
          <div className="flex gap-1 flex-wrap items-center flex-1 overflow-hidden">
            {safeSelected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : safeSelected.length <= 3 ? (
              selectedLabels.map((label, index) => (
                <Badge
                  key={safeSelected[index]}
                  variant="secondary"
                  className="mr-1"
                >
                  {label}
                  <span
                    role="button"
                    tabIndex={0}
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(safeSelected[index], e as any)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => handleRemove(safeSelected[index], e)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-sm">
                {safeSelected.length} time slots selected
              </span>
            )}
          </div>
          <ChevronsUpDown strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-64 overflow-auto p-1">
          {options.map((option) => {
            const isSelected = safeSelected.includes(option.value)
            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-accent"
                )}
              >
                <Check
                  strokeWidth={ICON_STROKE_WIDTH}
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}