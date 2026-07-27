import React, { useMemo, useState } from 'react'
import styles from './SettingsPage.module.css'

const TAB_KEYS = {
  profile: 'Profile',
  security: 'Security',
  notifications: 'Notifications',
  appearance: 'Appearance',
  ticket: 'Ticket Config',
  account: 'Account',
  admin: 'Admin',
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  // Demo-only flags / state. In a real app this would come from auth context.
  const [isAdmin, setIsAdmin] = useState(false)

  const [profile, setProfile] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '555-1234',
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    compactMode: false,
  })

  const [ticketConfig, setTicketConfig] = useState({
    defaultPriority: 'Medium',
    autoAssign: false,
    updateNotifications: true,
  })

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowSelfRegistration: true,
    defaultTicketType: 'General',
  })

  const tabs = useMemo(() => {
    const baseTabs = [
      { key: 'profile', label: TAB_KEYS.profile },
      { key: 'security', label: TAB_KEYS.security },
      { key: 'notifications', label: TAB_KEYS.notifications },
      { key: 'appearance', label: TAB_KEYS.appearance },
      { key: 'ticket', label: TAB_KEYS.ticket },
      { key: 'account', label: TAB_KEYS.account },
    ]
    if (isAdmin) {
      baseTabs.push({ key: 'admin', label: TAB_KEYS.admin })
    }
    return baseTabs
  }, [isAdmin])

  const handleSave = (section) => {
    alert(`Saved ${section} settings.`)
  }

  const handleReset = (section) => {
    if (!window.confirm('Reset settings in this section to defaults?')) return

    switch (section) {
      case 'profile':
        setProfile({ fullName: '', email: '', phone: '' })
        break
      case 'security':
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
        break
      case 'notifications':
        setNotifications({ email: true, sms: false, push: true })
        break
      case 'appearance':
        setAppearance({ theme: 'light', fontSize: 'medium', compactMode: false })
        break
      case 'ticket':
        setTicketConfig({ defaultPriority: 'Medium', autoAssign: false, updateNotifications: true })
        break
      case 'admin':
        setSystemSettings({ maintenanceMode: false, allowSelfRegistration: true, defaultTicketType: 'General' })
        break
      default:
        break
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Settings</h1>
          <p>
            Manage your helpdesk preferences. Admin features are available when the
            "Admin" toggle is enabled.
          </p>
        </div>
        <div className={styles.adminToggle}>
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            Admin mode
          </label>
        </div>
      </header>

      <div className={styles.content}>
        <nav className={styles.sidebar}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className={styles.main}>
          {activeTab === 'profile' && (
            <section className={styles.section}>
              <h2>Profile Settings</h2>
              <p>Update your name, email, and contact information.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('profile')
                }}
              >
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />

                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />

                <div className={styles.actions}>
                  <button type="button" className={styles.secondary} onClick={() => handleReset('profile')}>
                    Reset
                  </button>
                  <button type="submit">Save changes</button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'security' && (
            <section className={styles.section}>
              <h2>Security Settings</h2>
              <p>Update your password and review security-related preferences.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (security.newPassword !== security.confirmPassword) {
                    alert('New password and confirmation must match.')
                    return
                  }
                  handleSave('security')
                  setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
                }}
              >
                <label htmlFor="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                />

                <label htmlFor="newPassword">New password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                />

                <label htmlFor="confirmPassword">Confirm new password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                />

                <div className={styles.actions}>
                  <button type="button" className={styles.secondary} onClick={() => handleReset('security')}>
                    Reset
                  </button>
                  <button type="submit">Update password</button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className={styles.section}>
              <h2>Notification Preferences</h2>
              <p>Control which notifications you receive and how you receive them.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('notifications')
                }}
              >
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  />
                  Email notifications
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  />
                  SMS notifications
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  />
                  Push notifications
                </label>

                <div className={styles.actions}>
                  <button type="button" className={styles.secondary} onClick={() => handleReset('notifications')}>
                    Reset
                  </button>
                  <button type="submit">Save preferences</button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'appearance' && (
            <section className={styles.section}>
              <h2>Appearance & User Preferences</h2>
              <p>Customize your workspace appearance and layout preferences.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('appearance')
                }}
              >
                <label htmlFor="theme">Color theme</label>
                <select
                  id="theme"
                  value={appearance.theme}
                  onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>

                <label htmlFor="fontSize">Font size</label>
                <select
                  id="fontSize"
                  value={appearance.fontSize}
                  onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={appearance.compactMode}
                    onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
                  />
                  Compact (denser) layout
                </label>

                <div className={styles.actions}>
                  <button type="button" className={styles.secondary} onClick={() => handleReset('appearance')}>
                    Reset
                  </button>
                  <button type="submit">Save preferences</button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'ticket' && (
            <section className={styles.section}>
              <h2>Ticket Configuration</h2>
              <p>Configure defaults for ticket creation and notifications.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('ticket')
                }}
              >
                <label htmlFor="defaultPriority">Default ticket priority</label>
                <select
                  id="defaultPriority"
                  value={ticketConfig.defaultPriority}
                  onChange={(e) => setTicketConfig({ ...ticketConfig, defaultPriority: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={ticketConfig.autoAssign}
                    onChange={(e) => setTicketConfig({ ...ticketConfig, autoAssign: e.target.checked })}
                  />
                  Automatically assign new tickets to me
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={ticketConfig.updateNotifications}
                    onChange={(e) => setTicketConfig({ ...ticketConfig, updateNotifications: e.target.checked })}
                  />
                  Receive updates when ticket status changes
                </label>

                <div className={styles.actions}>
                  <button type="button" className={styles.secondary} onClick={() => handleReset('ticket')}>
                    Reset
                  </button>
                  <button type="submit">Save configuration</button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'account' && (
            <section className={styles.section}>
              <h2>Account Management</h2>
              <p>Manage your account lifecycle and security.</p>

              <div className={styles.card}>
                <h3>Deactivate account</h3>
                <p>Deactivating your account will prevent you from logging in until you reactivate it.</p>
                <button
                  className={styles.danger}
                  onClick={() => {
                    if (window.confirm('Deactivate your account?')) {
                      alert('Your account has been deactivated. (Demo only)')
                    }
                  }}
                >
                  Deactivate account
                </button>
              </div>

              <div className={styles.card}>
                <h3>Delete account</h3>
                <p>Deleting your account is permanent and cannot be undone.</p>
                <button
                  className={styles.danger}
                  onClick={() => {
                    if (window.confirm('Delete your account? This cannot be undone.')) {
                      alert('Your account has been deleted. (Demo only)')
                    }
                  }}
                >
                  Delete account
                </button>
              </div>
            </section>
          )}

          {activeTab === 'admin' && isAdmin && (
            <section className={styles.section}>
              <h2>Admin System Settings</h2>
              <p>Settings that affect the entire helpdesk system.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('admin')
                }}
              >
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                  />
                  Enable maintenance mode (read-only for non-admins)
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={systemSettings.allowSelfRegistration}
                    onChange={(e) => setSystemSettings({ ...systemSettings, allowSelfRegistration: e.target.checked })}
                  />
                  Allow users to self-register
                </label>

                <label htmlFor="defaultTicketType">Default ticket type</label>
                <input
                  id="defaultTicketType"
                  value={systemSettings.defaultTicketType}
                  onChange={(e) => setSystemSettings({ ...systemSettings, defaultTicketType: e.target.value })}
                />

                <div className={styles.actions}>
                  <button type="button" className={styles.secondary} onClick={() => handleReset('admin')}>
                    Reset
                  </button>
                  <button type="submit">Save system settings</button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
