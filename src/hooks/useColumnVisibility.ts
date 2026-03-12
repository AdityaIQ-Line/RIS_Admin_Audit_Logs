import * as React from "react"

export interface ColumnConfig {
  id: string
  label: string
  isFixed: boolean
  defaultVisible: boolean
}

/**
 * Hook to manage column visibility with localStorage persistence
 * @param storageKey - Unique key for localStorage (e.g., "technician-worklist-columns")
 * @param columns - Array of column configurations
 * @returns visibleColumns, toggleColumn, resetColumns, and isVisible helper
 */
export function useColumnVisibility(storageKey: string, columns: ColumnConfig[]) {
  // Initialize visible columns from localStorage or defaults
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return new Set(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading column visibility from localStorage:", error)
    }
    
    // Default: show all columns that are defaultVisible
    return new Set(columns.filter(col => col.defaultVisible).map(col => col.id))
  })

  // Save to localStorage whenever visibleColumns changes
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(visibleColumns)))
    } catch (error) {
      console.error("Error saving column visibility to localStorage:", error)
    }
  }, [visibleColumns, storageKey])

  const toggleColumn = React.useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column || column.isFixed) {
      // Don't toggle fixed columns
      return
    }

    setVisibleColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(columnId)) {
        newSet.delete(columnId)
      } else {
        newSet.add(columnId)
      }
      return newSet
    })
  }, [columns])

  const resetColumns = React.useCallback(() => {
    const defaultColumns = new Set(columns.filter(col => col.defaultVisible).map(col => col.id))
    setVisibleColumns(defaultColumns)
  }, [columns])

  const isVisible = React.useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    // Fixed columns are always visible
    if (column?.isFixed) return true
    return visibleColumns.has(columnId)
  }, [visibleColumns, columns])

  return {
    visibleColumns,
    toggleColumn,
    resetColumns,
    isVisible,
  }
}
