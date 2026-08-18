import React, { useId, useState } from 'react'
import { Link } from 'react-router-dom'

import Input from '../UI/Input'
import Button from '../UI/Button'
import Alert from '../UI/Alert'

import styles from './LoginForm.module.css'

export default function LoginForm({ onSubmit, loading = false, error, className = '' }) {
  const idBase = useId()
  const emailId = `${idBase}-email`
  const passwordId = `${idBase}-password`
  const rememberId = `${idBase}-remember`

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [validation, setValidation] = useState({})

  function validate() {
    const errs = {}
    // simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.email) errs.email = 'Email is required.'
    else if (!emailRegex.test(form.email)) errs.email = 'Enter a valid email address.'

    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'

    setValidation(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    const ok = validate()
    if (!ok) return
    if (onSubmit) onSubmit(form)
  }

  return (
    <form className={[styles.wrapper, className].filter(Boolean).join(' ')} onSubmit={handleSubmit} noValidate>
      {error ? (
        <div className={styles.alertWrap}>
          <Alert type="error" fullWidth>
            {error}
          </Alert>
        </div>
      ) : null}

      <Input
        id={emailId}
        name="email"
        type="email"
        label="Email"
        value={form.email}
        onChange={handleChange}
        error={validation.email}
        required
        autoComplete="email"
      />

      <Input
        id={passwordId}
        name="password"
        type="password"
        label="Password"
        value={form.password}
        onChange={handleChange}
        error={validation.password}
        required
        autoComplete="current-password"
      />

      <div className={styles.row}>
        <div className={styles.rememberWrap}>
          <input
            id={rememberId}
            name="rememberMe"
            type="checkbox"
            checked={form.rememberMe}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <label htmlFor={rememberId} className={styles.rememberLabel}>
            Remember me
          </label>
        </div>

        <div className={styles.forgotWrap}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          Sign in
        </Button>
      </div>
    </form>
  )
}
