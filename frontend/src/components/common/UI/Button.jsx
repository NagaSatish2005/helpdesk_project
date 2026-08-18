import React from 'react'
import styles from './Button.module.css'

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading

  const classes = [
    styles.button,
    styles[variant] || styles.primary,
    styles[size] || styles.medium,
    fullWidth ? styles.fullWidth : '',
    isDisabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = loading ? (
    <>
      <span className={styles.spinner} aria-hidden="true" />
      <span>Loading...</span>
    </>
  ) : (
    <>
      {icon && iconPosition === 'left' ? <span className={styles.icon}>{icon}</span> : null}
      {children}
      {icon && iconPosition === 'right' ? <span className={styles.icon}>{icon}</span> : null}
    </>
  )

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...props}
    >
      {content}
    </button>
  )
}
