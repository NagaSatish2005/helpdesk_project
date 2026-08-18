import React, { useEffect, useRef, useState } from 'react'

import Button from '../UI/Button'
import Alert from '../UI/Alert'

import styles from './CommentForm.module.css'

export default function CommentForm({
  onSubmit,
  loading = false,
  error,
  placeholder = 'Write a comment...',
  submitText = 'Post Comment',
  initialValue = '',
  maxLength = 2000,
  disabled = false,
  className = '',
}) {
  const [text, setText] = useState(initialValue || '')
  const [validationError, setValidationError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const statusRef = useRef(null)

  useEffect(() => {
    setText(initialValue || '')
  }, [initialValue])

  const trimmed = text.trim()
  const length = text.length

  function validateComment(value) {
    const trimmedValue = value.trim()
    if (!trimmedValue) return 'Comment is required.'
    if (trimmedValue.length > maxLength) return `Comment must be at most ${maxLength} characters.`
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading || disabled || submitting) return

    const err = validateComment(text)
    if (err) {
      setValidationError(err)
      // move focus to status for screen readers
      if (statusRef.current) statusRef.current.focus()
      return
    }

    setValidationError('')
    let result
    try {
      setSubmitting(true)
      result = onSubmit ? onSubmit(trimmed) : undefined
      // support promise and sync
      if (result && typeof result.then === 'function') {
        await result
      }
      // success: clear textarea
      setText('')
    } catch (submitErr) {
      // do not clear text on failure; parent can pass `error` to show message
      // ensure validationError is cleared so Alert prop is primary
      setValidationError('')
    } finally {
      setSubmitting(false)
    }
  }

  const isDisabled = loading || disabled || submitting || trimmed.length === 0

  return (
    <form className={[styles.wrapper, className].filter(Boolean).join(' ')} onSubmit={handleSubmit} noValidate>
      {error ? (
        <div className={styles.alertWrap}>
          <Alert type="error" fullWidth>
            {error}
          </Alert>
        </div>
      ) : null}

      <label htmlFor="comment-textarea" className={styles.srOnly}>
        Comment
      </label>

      <textarea
        id="comment-textarea"
        className={[styles.textarea, validationError ? styles.inputError : ''].filter(Boolean).join(' ')}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={Boolean(validationError)}
        aria-describedby="comment-status comment-counter"
        rows={4}
      />

      <div className={styles.footer}>
        <div className={styles.left}>
          <div id="comment-counter" className={styles.counter} aria-live="polite">
            {length} / {maxLength}
          </div>
        </div>

        <div className={styles.right}>
          <Button type="submit" fullWidth={false} loading={loading} disabled={isDisabled}>
            {submitText}
          </Button>
        </div>
      </div>

      <div
        id="comment-status"
        className={styles.status}
        role="alert"
        aria-live="assertive"
        tabIndex={-1}
        ref={statusRef}
      >
        {validationError ? <div className={styles.errorMessage}>{validationError}</div> : null}
      </div>
    </form>
  )
}
