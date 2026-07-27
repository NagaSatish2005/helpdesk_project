import React, { useMemo, useState } from 'react'
import styles from './ProfilePage.module.css'

const sampleProfile = {
  id: 'U-001',
  fullName: 'Emma Wells',
  email: 'emma.wells@example.com',
  phone: '555-123-4567',
  role: 'Student',
  department: 'Computer Science',
  status: 'Active',
  created: '2025-09-12',
  photoUrl: null,
  ticketActivity: {
    total: 18,
    open: 3,
    resolved: 13,
    recent: [
      { id: 'T-017', title: 'Campus Wi-Fi issue' },
      { id: 'T-015', title: 'Password reset not working' },
      { id: 'T-011', title: 'Classroom projector request' },
    ],
  },
  notifications: {
    email: true,
    inApp: true,
    ticketUpdates: true,
  },
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(sampleProfile)
  const [editMode, setEditMode] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  })

  const [photoPreview, setPhotoPreview] = useState(profile.photoUrl)

  const ticketActivity = useMemo(() => profile.ticketActivity, [profile])

  const handlePhotoChange = (file) => {
    if (!file) {
      setPhotoPreview(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    setEditMode(false)
    alert('Profile saved (demo).')
  }

  const handleChangePassword = () => {
    if (passwordForm.next !== passwordForm.confirm) {
      alert('New password and confirmation must match.')
      return
    }
    setPasswordForm({ current: '', next: '', confirm: '' })
    alert('Password updated (demo).')
  }

  const toggleNotification = (key) => {
    setProfile((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }))
  }

  const handleLogout = () => {
    alert('Logged out (demo).')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>My Profile</h1>
          <p>Review and update your account details, security settings, and notification preferences.</p>
        </div>
        <button className={styles.secondary} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>{profile.fullName[0]}</div>
              )}
            </div>
            <div className={styles.profileMeta}>
              <div className={styles.profileName}>{profile.fullName}</div>
              <div className={styles.profileRole}>{profile.role}</div>
              <div className={styles.profileSub}>{profile.department}</div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Account information</h2>
            <div className={styles.infoGrid}>
              <div>
                <span className={styles.label}>User ID</span>
                <div>{profile.id}</div>
              </div>
              <div>
                <span className={styles.label}>Status</span>
                <div>{profile.status}</div>
              </div>
              <div>
                <span className={styles.label}>Created</span>
                <div>{profile.created}</div>
              </div>
              <div>
                <span className={styles.label}>Role</span>
                <div>{profile.role}</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Ticket activity</h2>
            <div className={styles.statsGrid}>
              <div>
                <div className={styles.statValue}>{ticketActivity.total}</div>
                <div className={styles.statLabel}>Total tickets</div>
              </div>
              <div>
                <div className={styles.statValue}>{ticketActivity.open}</div>
                <div className={styles.statLabel}>Open tickets</div>
              </div>
              <div>
                <div className={styles.statValue}>{ticketActivity.resolved}</div>
                <div className={styles.statLabel}>Resolved tickets</div>
              </div>
            </div>

            <div className={styles.recentTickets}>
              <h3>Recent tickets</h3>
              <ul>
                {ticketActivity.recent.map((ticket) => (
                  <li key={ticket.id}>
                    <strong>{ticket.id}</strong> — {ticket.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2>Profile details</h2>
            <button className={styles.secondary} onClick={() => setEditMode((v) => !v)}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Full name</label>
            <input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              disabled={!editMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email address</label>
            <input value={profile.email} disabled />
          </div>

          <div className={styles.formGroup}>
            <label>Phone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!editMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Department</label>
            <input
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              disabled={!editMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Profile photo</label>
            <div className={styles.photoActions}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                disabled={!editMode}
              />
              {photoPreview && (
                <button
                  className={styles.secondary}
                  onClick={() => handlePhotoChange(null)}
                  disabled={!editMode}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {editMode && (
            <button className={styles.primary} onClick={handleSaveProfile}>
              Save changes
            </button>
          )}

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <h2>Change password</h2>
          </div>

          <div className={styles.formGroup}>
            <label>Current password</label>
            <input
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
            />
          </div>

          <div className={styles.formGroup}>
            <label>New password</label>
            <input
              type="password"
              value={passwordForm.next}
              onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Confirm new password</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>

          <button className={styles.primary} onClick={handleChangePassword}>
            Update password
          </button>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <h2>Notification preferences</h2>
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={profile.notifications.email}
                onChange={() => toggleNotification('email')}
              />
              Email notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={profile.notifications.inApp}
                onChange={() => toggleNotification('inApp')}
              />
              In-app notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={profile.notifications.ticketUpdates}
                onChange={() => toggleNotification('ticketUpdates')}
              />
              Ticket update alerts
            </label>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <h2>Security &amp; sessions</h2>
          </div>

          <button className={styles.secondary} onClick={() => alert('Logout from all devices (demo).')}>
            Logout from all devices
          </button>
          <button className={styles.secondary} onClick={() => alert('View login activity (demo).')}>
            View login activity
          </button>
          <button className={styles.secondary} onClick={() => alert('Enable two-factor authentication (demo).')}>
            Enable two-factor authentication
          </button>
        </section>
      </div>
    </div>
  )
}
