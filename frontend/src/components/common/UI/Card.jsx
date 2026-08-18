import React from 'react'
import styles from './Card.module.css'

export default function Card({
  children,
  title,
  subtitle,
  header,
  footer,
  hover = false,
  bordered = true,
  shadow = 'medium',
  padding = 'medium',
  fullWidth = true,
  className = '',
  onClick,
  ...props
}) {
  const cardClasses = [
    styles.card,
    fullWidth ? styles.fullWidth : '',
    styles[`shadow${shadow.charAt(0).toUpperCase()}${shadow.slice(1)}`] || styles.shadowMedium,
    hover ? styles.hoverable : '',
    bordered ? '' : styles.borderedFalse,
    styles[`padding${padding.charAt(0).toUpperCase()}${padding.slice(1)}`] || styles.paddingMedium,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {(header || title || subtitle) ? (
        <div className={styles.header}>
          {header}
          {title ? <div className={styles.title}>{title}</div> : null}
          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
        </div>
      ) : null}

      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </>
  )

  if (onClick) {
    return (
      <div
        className={cardClasses}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick(event)
          }
        }}
        {...props}
      >
        {content}
      </div>
    )
  }

  return (
    <section className={cardClasses} {...props}>
      {content}
    </section>
  )
}
