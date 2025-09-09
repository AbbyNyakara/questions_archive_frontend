import React, { useState, useCallback } from 'react'

// Types
interface Column {
  key: string
  label: string
  defaultVisible: boolean
}

interface ControlsProps {
  selectedCount?: number
  onSelectAll?: () => void
  onDeselectAll?: () => void
  onDownload?: () => void
  onColumnToggle?: (columnKey: string, visible: boolean) => void
}

// Constants
const COLUMNS: Column[] = [
  { key: 'select', label: 'Select', defaultVisible: true },
  { key: 'id', label: 'Question ID', defaultVisible: true },
  { key: 'title', label: 'Question Title', defaultVisible: true },
  { key: 'text', label: 'Question Text', defaultVisible: true },
  { key: 'choices', label: 'Choices', defaultVisible: false },
  { key: 'r1', label: 'Round 1', defaultVisible: false },
  { key: 'r2', label: 'Round 2', defaultVisible: false },
  { key: 'r3', label: 'Round 3', defaultVisible: false },
  { key: 'r4', label: 'Round 4', defaultVisible: false },
  { key: 'r5', label: 'Round 5', defaultVisible: false },
  { key: 'r6', label: 'Round 6', defaultVisible: false },
  { key: 'r7', label: 'Round 7', defaultVisible: false },
  { key: 'r8', label: 'Round 8', defaultVisible: false },
  { key: 'r9', label: 'Round 9', defaultVisible: false },
  { key: 'r10', label: 'Round 10', defaultVisible: false },
]

const Controls: React.FC<ControlsProps> = ({
  selectedCount = 0,
  onSelectAll,
  onDeselectAll,
  onDownload,
  onColumnToggle,
}) => {
  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    COLUMNS.reduce(
      (acc, col) => ({ ...acc, [col.key]: col.defaultVisible }),
      {}
    )
  )

  // Event handlers
  const handleSelectAll = useCallback(() => {
    onSelectAll?.()
  }, [onSelectAll])

  const handleDeselectAll = useCallback(() => {
    onDeselectAll?.()
  }, [onDeselectAll])

  const handleDownload = useCallback(() => {
    onDownload?.()
  }, [onDownload])

  const handleColumnToggle = useCallback(
    (columnKey: string) => {
      const newVisibility = !visibleColumns[columnKey]
      setVisibleColumns((prev) => ({ ...prev, [columnKey]: newVisibility }))
      onColumnToggle?.(columnKey, newVisibility)
    },
    [visibleColumns, onColumnToggle]
  )

  // Render helpers
  const renderActionButton = (
    id: string,
    className: string,
    iconClass: string,
    text: string,
    onClick: () => void,
    disabled?: boolean
  ) => (
    <button
      id={id}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      type='button'
    >
      <i className={iconClass} aria-hidden='true' />
      <span className='ml-2'>{text}</span>
    </button>
  )

  const renderColumnCheckbox = (column: Column) => (
    <label key={column.key} className='column-checkbox'>
      <input
        type='checkbox'
        data-column={column.key}
        checked={visibleColumns[column.key]}
        onChange={() => handleColumnToggle(column.key)}
        aria-label={`Toggle ${column.label} column visibility`}
      />
      <span className='ml-1'>{column.label}</span>
    </label>
  )

  return (
    <div className='controls'>
      {/* Action Buttons */}
      <div
        className='button-group'
        role='group'
        aria-label='Data selection actions'
      >
        {renderActionButton(
          'select-all-btn',
          'btn-primary',
          'fas fa-check-square',
          'Select All',
          handleSelectAll
        )}
        {renderActionButton(
          'deselect-all-btn',
          'btn-danger',
          'fas fa-times-circle',
          'Deselect All',
          handleDeselectAll
        )}
        {renderActionButton(
          'download-btn',
          'btn-success',
          'fas fa-download',
          'Download Selected',
          handleDownload,
          selectedCount === 0
        )}
      </div>

      {/* Selected Count Display */}
      <div
        className='selected-count'
        id='selected-count'
        aria-live='polite'
        aria-atomic='true'
      >
        {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
      </div>

      {/* Column Visibility Controls */}
      <div
        className='column-selector'
        role='group'
        aria-label='Column visibility controls'
      >
        <div className='column-selector-title'>
          <strong>Visible Columns:</strong>
        </div>
        <div className='column-checkboxes'>
          {COLUMNS.map(renderColumnCheckbox)}
        </div>
      </div>
    </div>
  )
}

export default Controls
