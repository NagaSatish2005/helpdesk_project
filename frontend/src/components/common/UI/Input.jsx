import React, { useId, useMemo, useState } from 'react'
import styles from './Input.module.css'

const PASSWORD_TOGGLE_LABELS = {
  show: 'Show',
  hide: 'Hide',
}

export default function Input({
  label,
  type = 'text',
  name,
  id,
  value,
  placeholder,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  readOnly = false,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  maxLength,
  autoComplete,
  ...props
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const [showPassword, setShowPassword] = useState(false)

  const resolvedType = useMemo(() => {
    if (type !== 'password') return type
    return showPassword ? 'text' : 'password'
  }, [showPassword, type])

  const showToggle = type === 'password'
  const hasLeftIcon = Boolean(icon && iconPosition === 'left')
  const hasRightIcon = Boolean(icon && iconPosition === 'right')

  const inputClasses = [
    styles.input,
    hasLeftIcon ? styles.inputWithLeftIcon : '',
    hasRightIcon ? styles.inputWithRightIcon : '',
    error ? styles.inputError : '',
    disabled ? styles.inputDisabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={[styles.wrapper, fullWidth ? styles.fullWidth : ''].filter(Boolean).join(' ')}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required ? <span className={styles.required}>*</span> : null}
        </label>
      ) : null}

      <div className={styles.inputGroup}>
        {hasLeftIcon ? <span className={[styles.icon, styles.iconLeft].join(' ')}>{icon}</span> : null}

        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={inputClasses}
          {...props}
        />

        {showToggle ? (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? PASSWORD_TOGGLE_LABELS.hide : PASSWORD_TOGGLE_LABELS.show}
            disabled={disabled}
          >
            {showPassword ? PASSWORD_TOGGLE_LABELS.hide : PASSWORD_TOGGLE_LABELS.show}
          </button>
        ) : null}

        {hasRightIcon && !showToggle ? (
          <span className={[styles.icon, styles.iconRight].join(' ')}>{icon}</span>
        ) : null}
      </div>

      {error ? <span className={[styles.message, styles.errorMessage].join(' ')}>{error}</span> : null}
      {!error && helperText ? <span className={styles.message}>{helperText}</span> : null}
    </div>
  )
}
