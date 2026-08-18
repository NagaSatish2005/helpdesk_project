import React from 'react'
import styles from './Alert.module.css'

const DEFAULT_ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

export default function Alert({
  type = 'info',
  title,
  children,
  closable = false,
  onClose,
  icon,
  fullWidth = true,
  className = '',
  ...props
}) {
  const alertClasses = [
    styles.alert,
    styles[type] || styles.info,
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const resolvedIcon = icon ?? DEFAULT_ICONS[type] ?? DEFAULT_ICONS.info

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className={styles.icon} aria-hidden="true">
        {resolvedIcon}
      </div>

      <div className={styles.content}>
        {title ? <div className={styles.title}>{title}</div> : null}
        <div className={styles.message}>{children}</div>
      </div>

      {closable ? (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      ) : null}
    </div>
  )
}
