import StatsCard from '../common/charts/StatsCard'
import Alert from '../common/UI/Alert'
import styles from './DashboardStats.module.css'

const STAT_DEFINITIONS = [
  { key: 'totalTickets', title: 'Total Tickets', variant: 'primary', icon: 'ticket' },
  { key: 'openTickets', title: 'Open Tickets', variant: 'warning', icon: 'open' },
  { key: 'inProgressTickets', title: 'In Progress', variant: 'info', icon: 'progress' },
  { key: 'resolvedTickets', title: 'Resolved Tickets', variant: 'success', icon: 'resolved' },
]

function StatIcon({ type }) {
  const paths = {
    ticket: <path d="M5 7.5h14v9H5zM8 7.5v2m8-2v2m-8 5v2m8-2v2" />,
    open: <path d="M12 5v8m0 0 3-3m-3 3-3-3M6 18h12" />,
    progress: <path d="M12 5v7l4 2m4-2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />,
    resolved: <path d="m6 12 4 4 8-8" />,
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[type]}
    </svg>
  )
}

function getTrend(stats, statKey) {
  return stats.trends?.[statKey] ?? stats[`${statKey}Trend`] ?? {}
}

export default function DashboardStats({
  stats = {},
  loading = false,
  error = null,
  className = '',
  onStatClick,
}) {
  const containerClassName = [styles.container, className].filter(Boolean).join(' ')
  const errorMessage = error?.message ?? String(error)

  return (
    <section className={containerClassName} aria-label="Dashboard statistics">
      {error ? (
        <Alert type="error" title="Unable to load dashboard statistics">
          {errorMessage}
        </Alert>
      ) : null}

      <div className={styles.grid}>
        {STAT_DEFINITIONS.map(({ key, title, variant, icon }) => {
          const trend = getTrend(stats, key)

          return (
            <StatsCard
              key={key}
              title={title}
              value={stats[key] ?? 0}
              icon={<StatIcon type={icon} />}
              trend={trend.trend}
              trendValue={trend.trendValue}
              trendLabel={trend.trendLabel}
              variant={variant}
              loading={loading}
              onClick={onStatClick ? () => onStatClick(key) : undefined}
            />
          )
        })}
      </div>
    </section>
  )
}