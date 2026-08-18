import React from 'react'
import Badge from '../common/UI/badge'

const PRIORITY_MAP = {
  low: { variant: 'secondary', label: 'Low' },
  medium: { variant: 'primary', label: 'Medium' },
  high: { variant: 'warning', label: 'High' },
  critical: { variant: 'danger', label: 'Critical' },
}

function normalizePriority(value) {
  if (value == null) return ''
  return String(value).trim().toLowerCase()
}

export default function TicketPriority({ priority, size = 'medium', outlined = false, className = '' }) {
  const key = normalizePriority(priority)
  const cfg = PRIORITY_MAP[key] || { variant: 'default', label: 'Unknown' }

  return (
    <Badge variant={cfg.variant} size={size} outlined={outlined} className={className} aria-label={`Priority: ${cfg.label}`}>
      {cfg.label}
    </Badge>
  )
}
