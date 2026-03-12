/**
 * Analytics Filter Panel Component
 * Reusable filter panel for analytics categories
 */

import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Filter, X, Download } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '../../../lib/constants'
import { FilterDefinition } from '../../../lib/analytics-config'

interface AnalyticsFilterPanelProps {
  filters: FilterDefinition[]
  values: Record<string, any>
  onChange: (filterId: string, value: any) => void
  onReset: () => void
  onExport?: () => void
  className?: string
}

export function AnalyticsFilterPanel({
  filters,
  values,
  onChange,
  onReset,
  onExport,
  className
}: AnalyticsFilterPanelProps) {
  // Mock data for select options (in real app, fetch from API)
  const getSelectOptions = (filterId: string): { value: string; label: string }[] => {
    switch (filterId) {
      case 'radiologist':
        return [
          { value: 'RAD-1', label: 'Dr. Sarah Johnson' },
          { value: 'RAD-2', label: 'Dr. Michael Chen' },
          { value: 'RAD-3', label: 'Dr. Emily Williams' },
          { value: 'RAD-4', label: 'Dr. James Anderson' },
          { value: 'RAD-5', label: 'Dr. Maria Garcia' }
        ]
      case 'modality':
        return [
          { value: 'CT', label: 'CT Scan' },
          { value: 'MRI', label: 'MRI' },
          { value: 'XRAY', label: 'X-Ray' },
          { value: 'US', label: 'Ultrasound' },
          { value: 'MAMMO', label: 'Mammography' },
          { value: 'PET', label: 'PET-CT' }
        ]
      case 'referrer':
        return [
          { value: 'REF-1', label: 'Dr. Robert Miller' },
          { value: 'REF-2', label: 'Dr. Patricia Davis' },
          { value: 'REF-3', label: 'Dr. David Wilson' },
          { value: 'REF-4', label: 'Dr. Linda Martinez' },
          { value: 'REF-5', label: 'Dr. Christopher Taylor' }
        ]
      case 'priority':
        return [
          { value: 'STAT', label: 'STAT' },
          { value: 'URGENT', label: 'Urgent' },
          { value: 'ROUTINE', label: 'Routine' }
        ]
      case 'status':
        return [
          { value: 'PENDING', label: 'Pending' },
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'FINALIZED', label: 'Finalized' }
        ]
      case 'facility':
        return [
          { value: 'FAC-1', label: 'Main Hospital' },
          { value: 'FAC-2', label: 'East Wing Clinic' },
          { value: 'FAC-3', label: 'Outpatient Center' }
        ]
      case 'aiModel':
        return [
          { value: 'AI-V1', label: 'RadiologyAI v1.0' },
          { value: 'AI-V2', label: 'RadiologyAI v2.0' },
          { value: 'AI-LUNG', label: 'Lung Detection AI' },
          { value: 'AI-BRAIN', label: 'Brain Analysis AI' }
        ]
      default:
        return []
    }
  }
  
  const renderFilter = (filter: FilterDefinition) => {
    const value = values[filter.id] || ''
    
    switch (filter.type) {
      case 'dateRange':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.name}</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={value.from || ''}
                onChange={(e) => onChange(filter.id, { ...value, from: e.target.value })}
                className="flex-1"
              />
              <span className="flex items-center text-muted-foreground">to</span>
              <Input
                type="date"
                value={value.to || ''}
                onChange={(e) => onChange(filter.id, { ...value, to: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        )
      
      case 'select':
        const options = getSelectOptions(filter.id)
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.name}</Label>
            <Select value={value} onValueChange={(val) => onChange(filter.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${filter.name}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      
      case 'multiSelect':
        // Simplified multiselect - in production, use a proper multiselect component
        const multiOptions = getSelectOptions(filter.id)
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.name}</Label>
            <Select 
              value={Array.isArray(value) ? value[0] : value} 
              onValueChange={(val) => onChange(filter.id, [val])}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${filter.name}`} />
              </SelectTrigger>
              <SelectContent>
                {multiOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      
      case 'text':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium">{filter.name}</Label>
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(filter.id, e.target.value)}
              placeholder={`Enter ${filter.name}`}
            />
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                  Export CSV
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onReset}>
                <X className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                Reset
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map(renderFilter)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
