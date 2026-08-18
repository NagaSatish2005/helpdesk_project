import React, { useEffect, useId, useRef } from 'react'
import styles from './Modal.module.css'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className = '',
}) {
  const dialogRef = useRef(null)
  const previouslyFocusedElementRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedElementRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstFocusable = focusableElements?.[0]
    firstFocusable?.focus()

    const handleKeyDown = (event) => {
      if (closeOnEscape && event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key === 'Tab') {
        const elements = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || []
        ).filter((element) => !element.hasAttribute('disabled'))

        if (elements.length === 0) {
          event.preventDefault()
          return
        }

        const first = elements[0]
        const last = elements[elements.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isOpen, closeOnEscape, onClose])

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={[styles.modal, styles[size] || styles.medium, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || showCloseButton) ? (
          <div className={styles.header}>
            {title ? <div id={titleId} className={styles.title}>{title}</div> : <div />}
            {showCloseButton ? (
              <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                ×
              </button>
            ) : null}
          </div>
        ) : null}

        <div className={styles.body}>{children}</div>

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  )
}
