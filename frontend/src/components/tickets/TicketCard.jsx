import React from 'react'
import Card from '../common/UI/Card'
import Badge from '../common/UI/badge'

import styles from './TicketCard.module.css'

function formatDate(value) {
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return null
  }
}

function truncate(text, limit = 160) {
  if (!text) return ''
  const s = String(text)
  if (s.length <= limit) return s
  return s.slice(0, limit - 1).trimEnd() + '…'
}

export default function TicketCard({
  ticket,
  onClick,
  compact = false,
  showDescription = true,
  showDepartment = true,
  showCategory = true,
  showDate = true,
  className = '',
}) {
  if (!ticket) return null

  const id = ticket.id || ticket._id || ticket.ticketId || null
  const number = ticket.ticketNumber || ticket.number || id
  const title = ticket.title || 'No title'
  const description = ticket.description || ''
  const status = ticket.status || ''
  const priority = ticket.priority || ''
  const department = ticket.department || ''
  const category = ticket.category || ''
  const createdAt = ticket.createdAt || ticket.created || ticket.created_on || null

  const formattedDate = showDate ? formatDate(createdAt) : null

  const headerRight = (
    <div className={styles.badges}>
      {priority ? <Badge variant={mapPriorityVariant(priority)}>{priority}</Badge> : null}
      {status ? <Badge variant={mapStatusVariant(status)}>{status}</Badge> : null}
    </div>
  )

  function handleClick(e) {
    if (onClick) onClick(ticket)
  }

  return (
    <Card className={[styles.card, compact ? styles.compact : '', className].filter(Boolean).join(' ')} onClick={onClick ? handleClick : undefined}>
      <div className={styles.header}>
        <div className={styles.left}>
          {number ? <div className={styles.number}>#{number}</div> : null}
          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.right}>{headerRight}</div>
      </div>

      {!compact && showDescription && description ? (
        <div className={styles.description}>{truncate(description, 200)}</div>
      ) : null}

      <div className={styles.meta}>
        {showDepartment && department ? <div className={styles.metaItem}>{department}</div> : null}
        {showCategory && category ? <div className={styles.metaItem}>{category}</div> : null}
        {showDate && formattedDate ? <div className={styles.metaItem}>{formattedDate}</div> : null}
      </div>
    </Card>
  )
}

function mapStatusVariant(status) {
  const s = String(status).toLowerCase()
  if (s.includes('closed') || s.includes('resolved') || s.includes('done')) return 'success'
  if (s.includes('open') || s.includes('pending')) return 'warning'
  return 'default'
}

function mapPriorityVariant(priority) {
  const p = String(priority).toLowerCase()
  if (p.includes('critical') || p.includes('high')) return 'danger'
  if (p.includes('low')) return 'success'
  if (p.includes('medium') || p.includes('normal')) return 'warning'
  return 'default'
}
