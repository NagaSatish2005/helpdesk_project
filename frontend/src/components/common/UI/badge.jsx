import React from 'react'
import styles from './Badge.module.css'

export default function Badge({
  children,
  variant = 'default',
  size = 'medium',
  rounded = true,
  outlined = false,
  icon,
  className = '',
  ...props
}) {
  const badgeClasses = [
    styles.badge,
    styles[variant] || styles.default,
    styles[size] || styles.medium,
    rounded ? styles.rounded : styles.square,
    outlined ? styles.outlined : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={badgeClasses} {...props}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {children}
    </span>
  )
}
