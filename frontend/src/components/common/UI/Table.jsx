import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import styles from './Table.module.css'

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  striped = true,
  bordered = false,
  hover = true,
  compact = false,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onRowClick,
  className = '',
}) {
  const isSelected = (row) => {
    const rowKey = row?.id ?? JSON.stringify(row)
    return selectedRows.includes(rowKey)
  }

  const handleRowSelect = (row) => {
    if (!onRowSelect) return
    const rowKey = row?.id ?? JSON.stringify(row)
    onRowSelect(rowKey)
  }

  const renderCellValue = (column, row) => {
    if (column.render) {
      return column.render(row)
    }

    const value = row?.[column.key]
    return value ?? ''
  }

  const wrapperClasses = [styles.tableWrapper, bordered ? styles.bordered : '', className].filter(Boolean).join(' ')
  const tableClasses = [styles.table, striped ? styles.striped : '', hover ? styles.hoverable : '', compact ? styles.compact : ''].filter(Boolean).join(' ')

  if (loading) {
    return (
      <div className={wrapperClasses}>
        <div className={styles.loadingState}>
          <LoadingSpinner size="medium" text="Loading data..." />
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className={wrapperClasses}>
        <div className={styles.emptyState}>{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={wrapperClasses}>
      <table className={tableClasses}>
        <thead>
          <tr>
            {selectable ? <th className={styles.selectCell} aria-label="Select row" /> : null}
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = row?.id ?? `${rowIndex}`
            const selected = isSelected(row)

            return (
              <tr key={rowKey}>
                {selectable ? (
                  <td className={styles.selectCell}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selected}
                      onChange={() => handleRowSelect(row)}
                      aria-label={`Select row ${rowIndex + 1}`}
                    />
                  </td>
                ) : null}
                {columns.map((column) => (
                  <td key={`${rowKey}-${column.key}`}>
                    {onRowClick ? (
                      <button type="button" className={styles.rowButton} onClick={() => onRowClick(row)}>
                        {renderCellValue(column, row)}
                      </button>
                    ) : (
                      renderCellValue(column, row)
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
