import React from 'react'

import LoadingSpinner from '../common/UI/LoadingSpinner'
import Alert from '../common/UI/Alert'
import Button from '../common/UI/Button'
import TicketCard from './TicketCard'

import styles from './TicketList.module.css'

export default function TicketList({
  tickets = [],
  loading = false,
  error = null,
  emptyMessage = 'No tickets found.',
  onTicketClick,
  onRetry,
  view = 'grid',
  className = '',
}) {
  const items = Array.isArray(tickets) ? tickets : []

  if (loading) {
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <div className={styles.loading}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <div className={styles.errorWrap}>
          <Alert type="error" fullWidth>
            {error}
          </Alert>
          {onRetry ? (
            <div className={styles.retry}>
              <Button onClick={onRetry} variant="outline">
                Retry
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <div className={styles.empty} role="status">
          {emptyMessage}
        </div>
      </div>
    )
  }

  const isGrid = view === 'grid'

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {isGrid ? (
        <ul className={styles.grid} role="list">
          {items.map((ticket, idx) => {
            const key = ticket && (ticket.id || ticket._id || ticket.ticketId) ? (ticket.id || ticket._id || ticket.ticketId) : `ticket-${idx}`
            return (
              <li key={key} className={styles.item}>
                <TicketCard ticket={ticket} onClick={() => onTicketClick?.(ticket)} />
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className={styles.list} role="list">
          {items.map((ticket, idx) => {
            const key = ticket && (ticket.id || ticket._id || ticket.ticketId) ? (ticket.id || ticket._id || ticket.ticketId) : `ticket-${idx}`
            return (
              <li key={key} className={styles.listItem}>
                <TicketCard ticket={ticket} onClick={() => onTicketClick?.(ticket)} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
