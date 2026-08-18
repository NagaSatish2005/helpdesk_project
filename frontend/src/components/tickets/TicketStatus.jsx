import React from 'react'
import Badge from '../common/UI/badge'

const STATUS_MAP = {
  open: { variant: 'info', label: 'Open' },
  'in-progress': { variant: 'warning', label: 'In Progress' },
  resolved: { variant: 'success', label: 'Resolved' },
  closed: { variant: 'secondary', label: 'Closed' },
}

function normalizeStatus(value) {
  if (value == null) return ''
  return String(value).trim().toLowerCase()
}

export default function TicketStatus({ status, size = 'medium', outlined = false, className = '' }) {
  const key = normalizeStatus(status)
  const cfg = STATUS_MAP[key] || { variant: 'default', label: 'Unknown' }

  return (
    <Badge variant={cfg.variant} size={size} outlined={outlined} className={className} aria-label={`Status: ${cfg.label}`}>
      {cfg.label}
    </Badge>
  )
}
