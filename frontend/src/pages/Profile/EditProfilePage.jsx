import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import api from '../../services/api'
import styles from './EditProfilePage.module.css'

const NOT_AVAILABLE = 'Not available'

const roleLabels = {
  STUDENT: 'Student',
  STAFF: 'Staff',
  ADMIN: 'Admin',
}

function mapProfile(user) {
  return {
    id: user?.id ?? NOT_AVAILABLE,
    fullName: user?.name || NOT_AVAILABLE,
    email: user?.email || NOT_AVAILABLE,
    role: roleLabels[String(user?.role || '').toUpperCase()] || user?.role || NOT_AVAILABLE,
    created: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : NOT_AVAILABLE,
    status: typeof user?.active === 'boolean' ? (user.active ? 'Active' : 'Inactive') : NOT_AVAILABLE,
  }
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback
}

export default function EditProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [savedProfile, setSavedProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setLoadingError('')

    api.get('/api/users/me')
      .then((response) => {
        if (!isMounted) return
        const loadedProfile = mapProfile(response.data?.data)
        setProfile(loadedProfile)
        setSavedProfile(loadedProfile)
      })
      .catch((error) => {
        if (isMounted) setLoadingError(getErrorMessage(error, 'Unable to load profile.'))
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [user?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const name = profile.fullName.trim()

    if (!name) {
      setErrors({ fullName: 'Full name is required.' })
      setMessage({ type: 'error', text: 'Please fix form errors before saving.' })
      return
    }

    setSaving(true)
    setErrors({})

    try {
      const response = await api.patch('/api/users/me', { name })
      const updatedProfile = mapProfile(response.data?.data)
      setProfile(updatedProfile)
      setSavedProfile(updatedProfile)
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Unable to update profile.') })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfile(savedProfile)
    setErrors({})
    setMessage(null)
  }

  const hasError = (field) => Boolean(errors[field])

  if (loading) {
    return <div className={styles.container}><p>Loading profile...</p></div>
  }

  if (!profile) {
    return <div className={styles.container}><p>{loadingError || 'Unable to load profile.'}</p></div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Edit Profile</h1>
          <p>Update your name and review your account details.</p>
        </div>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
        )}

        <section className={styles.section}>
          <h2>Personal information</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Full name</label>
              <input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className={hasError('fullName') ? styles.invalid : ''}
              />
              {errors.fullName && <div className={styles.error}>{errors.fullName}</div>}
            </div>
            <div className={styles.field}>
              <label>Email address</label>
              <input value={profile.email} disabled />
            </div>
            <div className={styles.field}>
              <label>Phone number</label>
              <input value={NOT_AVAILABLE} disabled />
            </div>
            <div className={styles.field}>
              <label>Alternate email</label>
              <input value={NOT_AVAILABLE} disabled />
            </div>
            <div className={styles.field}>
              <label>Department</label>
              <input value={NOT_AVAILABLE} disabled />
            </div>
            <div className={styles.field}>
              <label>Address (optional)</label>
              <input value={NOT_AVAILABLE} disabled />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Profile picture</h2>
          <div className={styles.photoRow}>
            <div className={styles.photoPreview}>
              <div className={styles.photoPlaceholder}>{profile.fullName[0] || '?'}</div>
            </div>
            <div className={styles.photoControls}>
              <input
                type="file"
                accept="image/*"
                disabled
              />
              <button type="button" className={styles.secondary} disabled>
                {NOT_AVAILABLE}
              </button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Account details</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>User ID</label>
              <input value={profile.id} disabled />
            </div>
            <div className={styles.field}>
              <label>Role</label>
              <input value={profile.role} disabled />
            </div>
            <div className={styles.field}>
              <label>Status</label>
              <input value={profile.status} disabled />
            </div>
            <div className={styles.field}>
              <label>Created</label>
              <input value={profile.created} disabled />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Contact preferences</h2>
          <p>{NOT_AVAILABLE}: preferences are not currently supported.</p>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" disabled />
              Receive email updates
            </label>
            <label>
              <input type="checkbox" disabled />
              Receive SMS alerts
            </label>
          </div>
        </section>

        <section className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.primary} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </section>
      </form>
    </div>
  )
}
