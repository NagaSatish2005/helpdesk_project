import React, { useId } from 'react'
import styles from './Select.module.css'

export default function Select({
  label,
  name,
  id,
  value,
  options = [],
  placeholder = 'Select an option',
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const selectId = id || generatedId

  const selectClasses = [
    styles.select,
    error ? styles.selectError : '',
    disabled ? styles.selectDisabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={[styles.wrapper, fullWidth ? styles.fullWidth : ''].filter(Boolean).join(' ')}>
      {label ? (
        <label className={styles.label} htmlFor={selectId}>
          {label}
          {required ? <span className={styles.required}>*</span> : null}
        </label>
      ) : null}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-required={required}
        className={selectClasses}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <span className={[styles.message, styles.errorMessage].join(' ')}>{error}</span> : null}
      {!error && helperText ? <span className={styles.message}>{helperText}</span> : null}
    </div>
  )
}
