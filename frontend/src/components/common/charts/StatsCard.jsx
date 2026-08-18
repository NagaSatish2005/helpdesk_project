import React from 'react'
import Card from '../UI/Card'
import styles from './StatsCard.module.css'

function TrendIcon({ trend, className }) {
  if (trend === 'up') {
    return (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12l5-5 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 7v6H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (trend === 'down') {
    return (
      <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19 12l-5 5-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 17v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default function StatsCard({
  title,
  value,
  icon,
  trend = 'neutral',
  trendValue,
  trendLabel,
  variant = 'primary',
  loading = false,
  className = '',
  onClick,
}) {
  const variantClass = styles[`variant_${variant}`] || styles.variant_primary

  return (
    <Card
      className={[styles.card, variantClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {loading ? (
        <div className={styles.skeleton}>
          <div className={styles.skelHeader}>
            <div className={styles.skelIcon} />
            <div className={styles.skelTrend} />
          </div>
          <div className={styles.skelTitle} />
          <div className={styles.skelValue} />
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.header}>
            <div className={styles.iconWrap} aria-hidden={icon ? 'true' : 'true'}>
              {icon ? <div className={styles.iconContent}>{icon}</div> : <div className={styles.iconPlaceholder} />}
            </div>

            <div className={styles.trendWrap}>
              {trendValue ? (
                <div className={[styles.trendValue, styles[`trend_${trend}`]].filter(Boolean).join(' ')}>
                  <TrendIcon trend={trend} className={styles.trendIcon} />
                  <span className={styles.trendText}>{trendValue}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.title} aria-level={3} role="heading">
            {title}
          </div>

          <div className={styles.value}>
            {value}
          </div>

          {trendLabel ? <div className={styles.trendLabel}>{trendLabel}</div> : null}
        </div>
      )}
    </Card>
  )
}
