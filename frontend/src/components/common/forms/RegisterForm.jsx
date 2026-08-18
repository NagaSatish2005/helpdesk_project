import React, { useId, useState } from 'react'
import { Link } from 'react-router-dom'

import Input from '../UI/Input'
import Select from '../UI/Select'
import Button from '../UI/Button'
import Alert from '../UI/Alert'

import styles from './RegisterForm.module.css'

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'staff', label: 'Staff' },
]

// Local placeholder departments; replaceable by backend data later
const DEPARTMENT_OPTIONS = [
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'facilities', label: 'Facilities' },
]

export default function RegisterForm({ onSubmit, loading = false, error, className = '' }) {
  const idBase = useId()
  const nameId = `${idBase}-name`
  const emailId = `${idBase}-email`
  const passwordId = `${idBase}-password`
  const confirmId = `${idBase}-confirm`
  const roleId = `${idBase}-role`
  const deptId = `${idBase}-dept`

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
  })

  const [validation, setValidation] = useState({})

  function validate() {
    const errs = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.name || form.name.trim().length < 2) errs.name = 'Full name is required (min 2 characters).'

    if (!form.email) errs.email = 'Email is required.'
    else if (!emailRegex.test(form.email)) errs.email = 'Enter a valid email address.'

    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.'
    else if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match.'

    if (!form.role) errs.role = 'Please select a role.'
    if (!form.department) errs.department = 'Please select a department.'

    setValidation(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    const ok = validate()
    if (!ok) return

    const { confirmPassword, ...submitData } = form
    if (onSubmit) onSubmit(submitData)
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
        id={nameId}
        name="name"
        label="Full name"
        value={form.name}
        onChange={handleChange}
        error={validation.name}
        required
        autoComplete="name"
      />

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
        autoComplete="new-password"
      />

      <Input
        id={confirmId}
        name="confirmPassword"
        type="password"
        label="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={validation.confirmPassword}
        required
        autoComplete="new-password"
      />

      <Select
        id={roleId}
        name="role"
        label="Role"
        value={form.role}
        onChange={handleChange}
        options={ROLE_OPTIONS}
        error={validation.role}
        required
      />

      <Select
        id={deptId}
        name="department"
        label="Department"
        value={form.department}
        onChange={handleChange}
        options={DEPARTMENT_OPTIONS}
        placeholder="Select a department"
        error={validation.department}
        required
      />

      <div className={styles.actions}>
        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          Register
        </Button>
      </div>

      <div className={styles.footer}>
        Already have an account? <Link to="/login" className={styles.loginLink}>Sign in</Link>
      </div>
    </form>
  )
}
