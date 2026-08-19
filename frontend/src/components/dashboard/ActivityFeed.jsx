import Card from '../common/UI/Card'
import Badge from '../common/UI/badge'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import Alert from '../common/UI/Alert'

import styles from './ActivityFeed.module.css'

const DEFAULT_LIMIT = 5

const ACTIVITY_TYPES = {
  ticket_created: { label: 'Ticket created', icon: 'ticket' },
  ticket_updated: { label: 'Ticket updated', icon: 'update' },
  ticket_assigned: { label: 'Ticket assigned', icon: 'assign' },
  ticket_resolved: { label: 'Ticket resolved', icon: 'resolved' },
  comment_added: { label: 'Comment added', icon: 'comment' },
  user_registered: { label: 'User registered', icon: 'user' },
}

function getSafeLimit(limit) {
  return Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT
}

function getActivityKey(activity, index) {
  return activity && activity.id ? activity.id : `activity-${index}`
}

function getUserLabel(user) {
  if (!user) return ''
  if (typeof user === 'string') return user
  return user.name || user.fullName || user.email || ''
}

function formatTimestamp(timestamp) {
  if (!timestamp) return ''

  try {
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) return String(timestamp)
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return String(timestamp)
  }
}

function formatActivityType(type) {
  if (!type) return 'Activity'
  return String(type)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function ActivityIcon({ type }) {
  const paths = {
    ticket: <path d="M5 7.5h14v9H5zM8 7.5v2m8-2v2m-8 5v2m8-2v2" />,
    update: <path d="M4 12a8 8 0 0 1 13.7-5.6L20 9m0-5v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15m0 5v-5h5" />,
    assign: <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m6.5-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 8l2 2 4-4" />,
    resolved: <path d="m5 12 4 4L19 6" />,
    comment: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3-.5L4 20l1.5-4A7.5 7.5 0 1 1 20 11.5Z" />,
    user: <path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[type] || paths.update}
    </svg>
  )
}

export default function ActivityFeed({
  activities = [],
  loading = false,
  error = null,
  limit = DEFAULT_LIMIT,
  title = 'Recent Activity',
  emptyMessage = 'No recent activity.',
  onActivityClick,
  className = '',
}) {
  const items = Array.isArray(activities) ? activities : []
  const visibleActivities = items.slice(0, getSafeLimit(limit))
  const errorMessage = error?.message ?? String(error)

  return (
    <Card className={[styles.feed, className].filter(Boolean).join(' ')} title={title}>
      {loading ? (
        <div className={styles.loading}>
          <LoadingSpinner size="medium" />
        </div>
      ) : error ? (
        <Alert type="error">{errorMessage}</Alert>
      ) : visibleActivities.length ? (
        <ul className={styles.list} role="list">
          {visibleActivities.map((activity, index) => {
            const metadata = ACTIVITY_TYPES[activity?.type] || {}
            const activityMessage = activity?.message || 'Activity update'
            const userLabel = getUserLabel(activity?.user)
            const timestamp = formatTimestamp(activity?.timestamp)
            const categoryLabel = metadata.label || formatActivityType(activity?.type)
            const activityIcon = activity?.icon || <ActivityIcon type={metadata.icon} />
            const itemClassName = [styles.item, onActivityClick ? styles.clickable : '']
              .filter(Boolean)
              .join(' ')

            return (
              <li
                key={getActivityKey(activity, index)}
                className={itemClassName}
                onClick={onActivityClick ? () => onActivityClick(activity) : undefined}
                onKeyDown={onActivityClick ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onActivityClick(activity)
                  }
                } : undefined}
                role={onActivityClick ? 'button' : undefined}
                tabIndex={onActivityClick ? 0 : undefined}
                aria-label={onActivityClick ? `${categoryLabel}: ${activityMessage}` : undefined}
              >
                <div className={styles.icon} aria-hidden="true">{activityIcon}</div>
                <div className={styles.content}>
                  <p className={styles.message}>{activityMessage}</p>
                  <div className={styles.meta}>
                    {userLabel ? <span>{userLabel}</span> : null}
                    {timestamp ? <time dateTime={activity?.timestamp}>{timestamp}</time> : null}
                  </div>
                </div>
                {activity?.status || categoryLabel ? (
                  <div className={styles.status}>
                    <Badge variant={activity?.status ? 'info' : 'default'} size="small">
                      {activity?.status || categoryLabel}
                    </Badge>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className={styles.empty} role="status">{emptyMessage}</p>
      )}
    </Card>
  )
}