import React from 'react'

import Input from '../common/UI/Input'
import Select from '../common/UI/Select'
import Button from '../common/UI/Button'

import styles from './TicketFilters.module.css'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export default function TicketFilters({
  filters = {},
  onFilterChange,
  onClear,
  departments = [],
  categories = [],
  showSearch = true,
  className = '',
}) {
  const safeFilters = filters || {}

  const change = (key, value) => {
    const updated = { ...safeFilters, [key]: value }
    onFilterChange?.(updated)
  }

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <div className={styles.row}>
        {showSearch ? (
          <div className={styles.searchWrap}>
            <Input
              label="Search"
              name="search"
              placeholder="Search tickets..."
              value={safeFilters.search || ''}
              onChange={(e) => change('search', e.target.value)}
              fullWidth
            />
          </div>
        ) : null}

        <div className={styles.controls}>
          <Select
            label="Status"
            name="status"
            value={safeFilters.status ?? ''}
            options={STATUS_OPTIONS}
            onChange={(e) => change('status', e.target.value)}
            placeholder="Status"
          />

          <Select
            label="Priority"
            name="priority"
            value={safeFilters.priority ?? ''}
            options={PRIORITY_OPTIONS}
            onChange={(e) => change('priority', e.target.value)}
            placeholder="Priority"
          />

          <Select
            label="Department"
            name="department"
            value={safeFilters.department ?? ''}
            options={departments || []}
            onChange={(e) => change('department', e.target.value)}
            placeholder="Department"
          />

          <Select
            label="Category"
            name="category"
            value={safeFilters.category ?? ''}
            options={categories || []}
            onChange={(e) => change('category', e.target.value)}
            placeholder="Category"
          />
        </div>
      </div>

      {onClear ? (
        <div className={styles.clearWrap}>
          <Button type="button" variant="outline" onClick={onClear}>
            Clear Filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}
