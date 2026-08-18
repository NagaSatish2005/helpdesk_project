import React from 'react'
import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({
  size = 'medium',
  variant = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  centered = true,
  className = '',
}) {
  const containerClasses = [
    styles.container,
    centered ? styles.centered : '',
    fullScreen ? styles.fullScreen : '',
    overlay ? styles.overlay : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <span className={[styles.spinner, styles[size] || styles.medium, styles[variant] || styles.primary].join(' ')} aria-hidden="true" />
      {text ? <span className={styles.text}>{text}</span> : null}
      <span className={styles.srOnly}>Loading...</span>
    </div>
  )
}
