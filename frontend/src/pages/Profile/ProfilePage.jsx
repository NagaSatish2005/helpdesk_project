import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useTickets from '../../hooks/useTickets'
import api from '../../services/api'
import styles from './ProfilePage.module.css'

const NOT_AVAILABLE = 'Not available'

const roleLabels = {
  STUDENT: 'Student',
  STAFF: 'Staff',
  ADMIN: 'Admin',
}

function mapRole(role) {
  return roleLabels[String(role || '').toUpperCase()] || role || NOT_AVAILABLE
}

function mapProfile(user) {
  return {
    id: user?.id ?? NOT_AVAILABLE,
    fullName: user?.name || NOT_AVAILABLE,
    email: user?.email || NOT_AVAILABLE,
    role: mapRole(user?.role),
    created: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : NOT_AVAILABLE,
  }
}

function getTicketId(ticket) {
  return ticket?.id ?? ticket?._id ?? ticket?.ticketId
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback
}

export default function ProfilePage() {
  const { logout } = useAuth()
  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets()
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    ticketUpdates: true,
  })

  useEffect(() => {
    let isMounted = true

    api.get('/api/users/me')
      .then((response) => {
        if (!isMounted) return
        const loadedProfile = mapProfile(response.data?.data)
        setProfile(loadedProfile)
        setEditName(loadedProfile.fullName === NOT_AVAILABLE ? '' : loadedProfile.fullName)
        setProfileError('')
      })
      .catch((error) => {
        if (isMounted) setProfileError(getErrorMessage(error, 'Unable to load profile.'))
      })
      .finally(() => {
        if (isMounted) setProfileLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const ticketActivity = useMemo(() => {
    const resolvedTickets = tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status))
    const recent = tickets.slice(0, 3)

    return {
      total: tickets.length,
      open: tickets.length - resolvedTickets.length,
      resolved: resolvedTickets.length,
      recent,
    }
  }, [tickets])

  const handleSaveProfile = async () => {
    const name = editName.trim()
    if (!name) {
      setSaveError('Name is required.')
      setSaveMessage('')
      return
    }

    setSavingProfile(true)
    setSaveError('')
    setSaveMessage('')

    try {
      const response = await api.patch('/api/users/me', { name })
      const updatedProfile = mapProfile(response.data?.data)
      setProfile(updatedProfile)
      setEditName(updatedProfile.fullName === NOT_AVAILABLE ? '' : updatedProfile.fullName)
      setEditMode(false)
      setSaveMessage('Profile updated successfully.')
    } catch (error) {
      setSaveError(getErrorMessage(error, 'Unable to update profile.'))
    } finally {
      setSavingProfile(false)
    }
  }

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (profileLoading) {
    return <div className={styles.container}><p>Loading profile...</p></div>
  }

  if (!profile) {
    return <div className={styles.container}><p>{profileError || 'Unable to load profile.'}</p></div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>My Profile</h1>
          <p>Review and update your account details, security settings, and notification preferences.</p>
        </div>
        <button className={styles.secondary} onClick={logout}>
          Logout
        </button>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarPlaceholder}>{profile.fullName[0] || '?'}</div>
            </div>
            <div className={styles.profileMeta}>
              <div className={styles.profileName}>{profile.fullName}</div>
              <div className={styles.profileRole}>{profile.role}</div>
              <div className={styles.profileSub}>{NOT_AVAILABLE}</div>
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
                <div>{NOT_AVAILABLE}</div>
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
            {ticketsLoading ? <p>Loading ticket activity...</p> : null}
            {ticketsError ? <p role="alert">{ticketsError}</p> : null}
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
                  <li key={getTicketId(ticket)}>
                    <strong>{getTicketId(ticket) ?? NOT_AVAILABLE}</strong> — {ticket.title || NOT_AVAILABLE}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2>Profile details</h2>
            <button
              className={styles.secondary}
              onClick={() => {
                setEditMode((value) => !value)
                setEditName(profile.fullName === NOT_AVAILABLE ? '' : profile.fullName)
                setSaveError('')
                setSaveMessage('')
              }}
              disabled={savingProfile}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {saveMessage ? <p role="status">{saveMessage}</p> : null}
          {saveError ? <p role="alert">{saveError}</p> : null}

          <div className={styles.formGroup}>
            <label>Full name</label>
            <input
              value={editMode ? editName : profile.fullName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email address</label>
            <input value={profile.email} disabled />
          </div>

          <div className={styles.formGroup}>
            <label>Phone</label>
            <input value={NOT_AVAILABLE} disabled />
          </div>

          <div className={styles.formGroup}>
            <label>Department</label>
            <input value={NOT_AVAILABLE} disabled />
          </div>

          <div className={styles.formGroup}>
            <label>Profile photo</label>
            <input value={NOT_AVAILABLE} disabled />
          </div>

          {editMode && (
            <button className={styles.primary} onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save changes'}
            </button>
          )}

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <h2>Change password</h2>
          </div>

          <p>{NOT_AVAILABLE}: password changes are not implemented yet.</p>

          <div className={styles.formGroup}>
            <label>Current password</label>
            <input
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label>New password</label>
            <input
              type="password"
              value={passwordForm.next}
              onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label>Confirm new password</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
              disabled
            />
          </div>

          <button className={styles.primary} disabled>
            Update password ({NOT_AVAILABLE})
          </button>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <h2>Notification preferences</h2>
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => toggleNotification('email')}
              />
              Email notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifications.inApp}
                onChange={() => toggleNotification('inApp')}
              />
              In-app notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifications.ticketUpdates}
                onChange={() => toggleNotification('ticketUpdates')}
              />
              Ticket update alerts
            </label>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <h2>Security &amp; sessions</h2>
          </div>

          <p>{NOT_AVAILABLE}: security session management is not implemented yet.</p>
          <button className={styles.secondary} disabled>
            Logout from all devices ({NOT_AVAILABLE})
          </button>
          <button className={styles.secondary} disabled>
            View login activity ({NOT_AVAILABLE})
          </button>
          <button className={styles.secondary} disabled>
            Enable two-factor authentication ({NOT_AVAILABLE})
          </button>
        </section>
      </div>
    </div>
  )
}
