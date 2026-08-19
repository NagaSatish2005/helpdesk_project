import Card from '../common/UI/Card'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import Alert from '../common/UI/Alert'
import Button from '../common/UI/Button'
import TicketCard from '../tickets/TicketCard'

import styles from './RecentTickets.module.css'

const DEFAULT_LIMIT = 5

function getSafeLimit(limit) {
  return Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT
}

function getTicketKey(ticket, index) {
  return ticket && (ticket.id || ticket._id || ticket.ticketId)
    ? ticket.id || ticket._id || ticket.ticketId
    : `ticket-${index}`
}

export default function RecentTickets({
  tickets = [],
  loading = false,
  error = null,
  limit = DEFAULT_LIMIT,
  onTicketClick,
  onViewAll,
  className = '',
}) {
  const items = Array.isArray(tickets) ? tickets : []
  const visibleTickets = items.slice(0, getSafeLimit(limit))
  const errorMessage = error?.message ?? String(error)

  return (
    <Card
      className={[styles.section, className].filter(Boolean).join(' ')}
      header={
        <div className={styles.header}>
          <h2 className={styles.title}>Recent Tickets</h2>
          {onViewAll ? (
            <Button variant="outline" size="small" onClick={onViewAll}>
              View All
            </Button>
          ) : null}
        </div>
      }
    >
      {loading ? (
        <div className={styles.loading}>
          <LoadingSpinner size="medium" />
        </div>
      ) : error ? (
        <Alert type="error">{errorMessage}</Alert>
      ) : visibleTickets.length ? (
        <ul className={styles.ticketList} role="list">
          {visibleTickets.map((ticket, index) => (
            <li key={getTicketKey(ticket, index)} className={styles.ticketItem}>
              <TicketCard
                ticket={ticket}
                compact
                onClick={onTicketClick ? () => onTicketClick(ticket) : undefined}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty} role="status">No recent tickets.</p>
      )}
    </Card>
  )
}