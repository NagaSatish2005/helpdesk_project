import React, { useEffect, useId, useState } from 'react'

import Input from '../UI/Input'
import Select from '../UI/Select'
import Button from '../UI/Button'
import Alert from '../UI/Alert'

import styles from './TicketForm.module.css'

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export default function TicketForm({
  onSubmit,
  onCancel,
  loading = false,
  error,
  initialData = null,
  departments = [],
  categories = [],
  className = '',
}) {
  const idBase = useId()
  const titleId = `${idBase}-title`
  const descId = `${idBase}-description`
  const deptId = `${idBase}-department`
  const catId = `${idBase}-category`
  const prioId = `${idBase}-priority`

  const emptyState = {
    title: '',
    description: '',
    department: '',
    category: '',
    priority: 'medium',
  }

  const [form, setForm] = useState(initialData ? { ...emptyState, ...initialData } : emptyState)
  const [validation, setValidation] = useState({})

  useEffect(() => {
    if (initialData) setForm((prev) => ({ ...emptyState, ...initialData }))
    else setForm(emptyState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const errs = {}
    const { title, description, department, category, priority } = form

    if (!title || title.trim().length < 5) errs.title = 'Title is required (5-100 chars).'
    else if (title.length > 100) errs.title = 'Title must be at most 100 characters.'

    if (!description || description.trim().length < 10) errs.description = 'Description is required (10-2000 chars).'
    else if (description.length > 2000) errs.description = 'Description must be at most 2000 characters.'

    if (!department) errs.department = 'Please select a department.'
    if (!category) errs.category = 'Please select a category.'
    if (!priority) errs.priority = 'Please select a priority.'

    setValidation(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    const ok = validate()
    if (!ok) return
    const submitData = {
      title: form.title.trim(),
      description: form.description.trim(),
      department: form.department,
      category: form.category,
      priority: form.priority,
    }
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

      <Input id={titleId} name="title" label="Ticket title" value={form.title} onChange={handleChange} error={validation.title} required maxLength={100} />

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor={descId}>
          Description
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id={descId}
          name="description"
          value={form.description}
          onChange={handleChange}
          className={[styles.textarea, validation.description ? styles.inputError : ''].filter(Boolean).join(' ')}
          rows={6}
          aria-invalid={Boolean(validation.description)}
          aria-required="true"
        />
        {validation.description ? <div className={styles.errorMessage}>{validation.description}</div> : null}
      </div>

      <div className={styles.grid}>
        <Select id={deptId} name="department" label="Department" value={form.department} options={departments} onChange={handleChange} error={validation.department} required />
        <Select id={catId} name="category" label="Category" value={form.category} options={categories} onChange={handleChange} error={validation.category} required />
        <Select id={prioId} name="priority" label="Priority" value={form.priority} options={PRIORITY_OPTIONS} onChange={handleChange} error={validation.priority} required />
      </div>

      <div className={styles.actions}>
        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          {initialData ? 'Update Ticket' : 'Create Ticket'}
        </Button>

        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className={styles.cancelButton}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
