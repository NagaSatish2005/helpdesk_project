import React, { useState } from 'react'
import styles from './EditProfilePage.module.css'

const initialProfile = {
  id: 'U-001',
  fullName: 'Emma Wells',
  email: 'emma.wells@example.com',
  alternateEmail: 'emma.w@altmail.com',
  phone: '555-123-4567',
  department: 'Computer Science',
  role: 'Student',
  status: 'Active',
  address: '123 University Ave, Campus City',
  photoUrl: null,
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [preview, setPreview] = useState(initialProfile.photoUrl)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)

  const validate = () => {
    const newErrors = {}

    if (!profile.fullName.trim()) newErrors.fullName = 'Full name is required.'
    if (!profile.email.trim()) newErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      newErrors.email = 'Enter a valid email address.'

    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required.'
    else if (!/^\d[\d\s\-()+]*$/.test(profile.phone))
      newErrors.phone = 'Enter a valid phone number.'

    if (!profile.department.trim()) newErrors.department = 'Department is required.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhotoChange = (file) => {
    if (!file) {
      setPreview(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage(null)

    if (!validate()) {
      setMessage({ type: 'error', text: 'Please fix form errors before saving.' })
      return
    }

    setMessage({ type: 'success', text: 'Profile updated successfully (demo).' })
  }

  const handleCancel = () => {
    setProfile(initialProfile)
    setPreview(initialProfile.photoUrl)
    setErrors({})
    setMessage(null)
  }

  const hasError = (field) => Boolean(errors[field])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Edit Profile</h1>
          <p>Update your personal details, contact information, and profile photo.</p>
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
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={hasError('email') ? styles.invalid : ''}
              />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
            </div>
            <div className={styles.field}>
              <label>Phone number</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className={hasError('phone') ? styles.invalid : ''}
              />
              {errors.phone && <div className={styles.error}>{errors.phone}</div>}
            </div>
            <div className={styles.field}>
              <label>Alternate email</label>
              <input
                value={profile.alternateEmail}
                onChange={(e) => setProfile({ ...profile, alternateEmail: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Department</label>
              <input
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className={hasError('department') ? styles.invalid : ''}
              />
              {errors.department && <div className={styles.error}>{errors.department}</div>}
            </div>
            <div className={styles.field}>
              <label>Address (optional)</label>
              <input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Profile picture</h2>
          <div className={styles.photoRow}>
            <div className={styles.photoPreview}>
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <div className={styles.photoPlaceholder}>{profile.fullName[0]}</div>
              )}
            </div>
            <div className={styles.photoControls}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              />
              <button type="button" className={styles.secondary} onClick={() => handlePhotoChange(null)}>
                Remove
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
          </div>
        </section>

        <section className={styles.section}>
          <h2>Contact preferences</h2>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" />
              Receive email updates
            </label>
            <label>
              <input type="checkbox" />
              Receive SMS alerts
            </label>
          </div>
        </section>

        <section className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.primary}>
            Save changes
          </button>
        </section>
      </form>
    </div>
  )
}
