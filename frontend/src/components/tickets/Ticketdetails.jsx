import React from 'react'

import LoadingSpinner from '../common/UI/LoadingSpinner'
import Alert from '../common/UI/Alert'
import Button from '../common/UI/Button'
import Card from '../common/UI/Card'
import Badge from '../common/UI/badge'

import styles from './TicketDetails.module.css'

function formatDate(value) {
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return null
  }
}

export default function TicketDetails({
  ticket,
  onEdit,
  onDelete,
  onStatusChange,
  onBack,
  showActions = true,
  loading = false,
  error = null,
  className = '',
}) {
  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <Alert type="error">{error}</Alert>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <Card>
          <div className={styles.notFound} role="status">Ticket not found.</div>
          {onBack ? (
            <div className={styles.backAction}>
              <Button onClick={onBack} variant="outline">Back</Button>
            </div>
          ) : null}
        </Card>
      </div>
    )
  }

  const number = ticket.ticketNumber || ticket.number || ticket.id || ''
  const title = ticket.title || 'Untitled ticket'
  const status = ticket.status || ''
  const priority = ticket.priority || ''
  const description = ticket.description || ''
  const department = ticket.department || ''
  const category = ticket.category || ''
  const createdAt = formatDate(ticket.createdAt || ticket.created)
  const updatedAt = formatDate(ticket.updatedAt || ticket.updated)
  const createdBy = ticket.createdBy ? (ticket.createdBy.name || ticket.createdBy) : ''
  const assignedTo = ticket.assignedTo ? (ticket.assignedTo.name || ticket.assignedTo) : ''

  return (
    <article className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack ? (
            <Button variant="outline" onClick={onBack} className={styles.backButton}>
              Back
            </Button>
          ) : null}
          <div className={styles.ident}>
            {number ? <div className={styles.number}>#{number}</div> : null}
            <h1 className={styles.title}>{title}</h1>
          </div>
        </div>

        <div className={styles.headerRight}>
          {priority ? <Badge variant={(priority || '').toLowerCase()}>{priority}</Badge> : null}
          {status ? <Badge variant={(status || '').toLowerCase()}>{status}</Badge> : null}
        </div>
      </header>

      <section className={styles.contentArea}>
        <main className={styles.main}>
          {description ? (
            <Card>
              <div className={styles.sectionTitle}>Description</div>
              <div className={styles.description}>{description}</div>
            </Card>
          ) : null}

          <div className={styles.metaRow}>
            {department ? (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Department</div>
                <div className={styles.metaValue}>{department}</div>
              </div>
            ) : null}

            {category ? (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Category</div>
                <div className={styles.metaValue}>{category}</div>
              </div>
            ) : null}
          </div>
        </main>

        <aside className={styles.sidebar} aria-labelledby="metadata-heading">
          <Card>
            <h2 id="metadata-heading" className={styles.sectionTitle}>Details</h2>
            <div className={styles.metaList}>
              {createdAt ? (
                <div className={styles.metaRowItem}>
                  <div className={styles.metaLabel}>Created</div>
                  <div className={styles.metaValue}>{createdAt}</div>
                </div>
              ) : null}

              {updatedAt ? (
                <div className={styles.metaRowItem}>
                  <div className={styles.metaLabel}>Last updated</div>
                  <div className={styles.metaValue}>{updatedAt}</div>
                </div>
              ) : null}

              {createdBy ? (
                <div className={styles.metaRowItem}>
                  <div className={styles.metaLabel}>Created by</div>
                  <div className={styles.metaValue}>{createdBy}</div>
                </div>
              ) : null}

              {assignedTo ? (
                <div className={styles.metaRowItem}>
                  <div className={styles.metaLabel}>Assigned to</div>
                  <div className={styles.metaValue}>{assignedTo}</div>
                </div>
              ) : null}
            </div>
          </Card>

          {showActions ? (
            <div className={styles.actions}>
              {onStatusChange ? (
                <Button onClick={() => onStatusChange(ticket)} variant="outline">Change status</Button>
              ) : null}

              {onEdit ? <Button onClick={() => onEdit(ticket)}>Edit</Button> : null}

              {onDelete ? <Button onClick={() => onDelete(ticket)} variant="danger">Delete</Button> : null}
            </div>
          ) : null}
        </aside>
      </section>
    </article>
  )
}
