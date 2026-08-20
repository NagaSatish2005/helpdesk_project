import React, { useMemo, useState } from 'react'
import Alert from '../../components/common/UI/Alert'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import Input from '../../components/common/UI/Input'
import Modal from '../../components/common/UI/Modal'
import Select from '../../components/common/UI/Select'
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

const DEFAULT_PROFILE = { fullName: 'Jane Doe', email: 'jane.doe@example.com', phone: '555-1234' }
const DEFAULT_SECURITY = { currentPassword: '', newPassword: '', confirmPassword: '' }
const DEFAULT_NOTIFICATIONS = { email: true, sms: false, push: true }
const DEFAULT_APPEARANCE = { theme: 'light', fontSize: 'medium', compactMode: false }
const DEFAULT_TICKET_CONFIG = { defaultPriority: 'Medium', autoAssign: false, updateNotifications: true }
const DEFAULT_SYSTEM_SETTINGS = { maintenanceMode: false, allowSelfRegistration: true, defaultTicketType: 'General' }
const themeOptions = ['light', 'dark', 'system'].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))
const fontSizeOptions = ['small', 'medium', 'large'].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))
const priorityOptions = ['Low', 'Medium', 'High'].map((value) => ({ value, label: value }))

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  // Demo-only flags / state. In a real app this would come from auth context.
  const [isAdmin, setIsAdmin] = useState(false)

  const [profile, setProfile] = useState(DEFAULT_PROFILE)

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

  const [savedSettings, setSavedSettings] = useState({
    profile: DEFAULT_PROFILE,
    security: DEFAULT_SECURITY,
    notifications: DEFAULT_NOTIFICATIONS,
    appearance: DEFAULT_APPEARANCE,
    ticket: DEFAULT_TICKET_CONFIG,
    admin: DEFAULT_SYSTEM_SETTINGS,
  })
  const [savingSection, setSavingSection] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [accountAction, setAccountAction] = useState(null)

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

  const handleSave = async (section) => {
    if (savingSection) return

    let validationError = null
    if (section === 'profile') {
      if (!profile.fullName.trim()) validationError = 'Full name is required.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) validationError = 'Enter a valid email address.'
    }
    if (section === 'security') {
      if (!security.currentPassword || !security.newPassword || !security.confirmPassword) validationError = 'Complete all password fields before updating your password.'
      else if (security.newPassword.length < 8) validationError = 'New password must be at least 8 characters.'
      else if (security.newPassword !== security.confirmPassword) validationError = 'New password and confirmation must match.'
    }
    if (section === 'admin' && !systemSettings.defaultTicketType.trim()) validationError = 'Default ticket type is required.'
    if (validationError) {
      setFeedback({ type: 'error', title: 'Unable to save settings', message: validationError })
      return
    }

    setSavingSection(section)
    setFeedback(null)
    await Promise.resolve()
    const values = { profile, notifications, appearance, ticket: ticketConfig, admin: systemSettings }
    if (section === 'security') {
      setSavedSettings((current) => ({ ...current, security: DEFAULT_SECURITY }))
      setSecurity(DEFAULT_SECURITY)
    } else {
      setSavedSettings((current) => ({ ...current, [section]: values[section] }))
    }
    setSavingSection(null)
    setFeedback({ type: 'success', title: 'Settings saved', message: `${TAB_KEYS[section]} settings were updated locally.` })
  }

  const handleReset = (section) => {
    const savedValue = savedSettings[section]
    if (section === 'profile') setProfile(savedValue)
    if (section === 'security') setSecurity(savedValue)
    if (section === 'notifications') setNotifications(savedValue)
    if (section === 'appearance') setAppearance(savedValue)
    if (section === 'ticket') setTicketConfig(savedValue)
    if (section === 'admin') setSystemSettings(savedValue)
    setFeedback({ type: 'success', title: 'Settings reset', message: `${TAB_KEYS[section]} restored to its last saved values.` })
  }

  const confirmAccountAction = () => {
    setAccountAction(null)
    setFeedback({ type: 'success', title: 'Account action completed', message: 'The account action was simulated locally.' })
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
        <Input
          type="checkbox"
          label="Admin mode"
          fullWidth={false}
          checked={isAdmin}
          onChange={(e) => {
            setIsAdmin(e.target.checked)
            if (!e.target.checked && activeTab === 'admin') setActiveTab('profile')
          }}
        />
      </header>

      {feedback ? (
        <Alert type={feedback.type} title={feedback.title} closable onClose={() => setFeedback(null)} className={styles.feedback}>
          {feedback.message}
        </Alert>
      ) : null}

      <div className={styles.content}>
        <nav className={styles.sidebar} aria-label="Settings sections">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
              aria-current={activeTab === tab.key ? 'page' : undefined}
            >
              {tab.label}
            </Button>
          ))}
        </nav>

        <main className={styles.main}>
          {activeTab === 'profile' && (
            <Card className={styles.section} title="Profile Settings" subtitle="Update your name, email, and contact information.">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('profile')
                }}
              >
                <Input
                  label="Full name"
                  id="fullName"
                  value={profile.fullName}
                  required
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />

                <Input
                  label="Email"
                  id="email"
                  type="email"
                  value={profile.email}
                  required
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />

                <Input
                  label="Phone"
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />

                <div className={styles.actions}>
                  <Button type="button" variant="secondary" onClick={() => handleReset('profile')}>Reset</Button>
                  <Button type="submit" loading={savingSection === 'profile'}>Save changes</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className={styles.section} title="Security Settings" subtitle="Update your password and review security-related preferences.">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('security')
                }}
              >
                <Input
                  label="Current password"
                  id="currentPassword"
                  type="password"
                  value={security.currentPassword}
                  required
                  autoComplete="current-password"
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                />

                <Input
                  label="New password"
                  id="newPassword"
                  type="password"
                  value={security.newPassword}
                  required
                  autoComplete="new-password"
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                />

                <Input
                  label="Confirm new password"
                  id="confirmPassword"
                  type="password"
                  value={security.confirmPassword}
                  required
                  autoComplete="new-password"
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                />

                <div className={styles.actions}>
                  <Button type="button" variant="secondary" onClick={() => handleReset('security')}>Reset</Button>
                  <Button type="submit" loading={savingSection === 'security'}>Update password</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className={styles.section} title="Notification Preferences" subtitle="Control which notifications you receive and how you receive them.">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('notifications')
                }}
              >
                <Input type="checkbox" label="Email notifications" fullWidth={false} checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} />
                <Input type="checkbox" label="SMS notifications" fullWidth={false} checked={notifications.sms} onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })} />
                <Input type="checkbox" label="Push notifications" fullWidth={false} checked={notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} />

                <div className={styles.actions}>
                  <Button type="button" variant="secondary" onClick={() => handleReset('notifications')}>Reset</Button>
                  <Button type="submit" loading={savingSection === 'notifications'}>Save preferences</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className={styles.section} title="Appearance & User Preferences" subtitle="Customize your workspace appearance and layout preferences.">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('appearance')
                }}
              >
                <Select
                  label="Color theme"
                  id="theme"
                  value={appearance.theme}
                  options={themeOptions}
                  onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                >
                </Select>

                <Select
                  label="Font size"
                  id="fontSize"
                  value={appearance.fontSize}
                  options={fontSizeOptions}
                  onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                />

                <Input type="checkbox" label="Compact (denser) layout" fullWidth={false} checked={appearance.compactMode} onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })} />

                <div className={styles.actions}>
                  <Button type="button" variant="secondary" onClick={() => handleReset('appearance')}>Reset</Button>
                  <Button type="submit" loading={savingSection === 'appearance'}>Save preferences</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'ticket' && (
            <Card className={styles.section} title="Ticket Configuration" subtitle="Configure defaults for ticket creation and notifications.">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('ticket')
                }}
              >
                <Select
                  label="Default ticket priority"
                  id="defaultPriority"
                  value={ticketConfig.defaultPriority}
                  options={priorityOptions}
                  onChange={(e) => setTicketConfig({ ...ticketConfig, defaultPriority: e.target.value })}
                />

                <Input type="checkbox" label="Automatically assign new tickets to me" fullWidth={false} checked={ticketConfig.autoAssign} onChange={(e) => setTicketConfig({ ...ticketConfig, autoAssign: e.target.checked })} />
                <Input type="checkbox" label="Receive updates when ticket status changes" fullWidth={false} checked={ticketConfig.updateNotifications} onChange={(e) => setTicketConfig({ ...ticketConfig, updateNotifications: e.target.checked })} />

                <div className={styles.actions}>
                  <Button type="button" variant="secondary" onClick={() => handleReset('ticket')}>Reset</Button>
                  <Button type="submit" loading={savingSection === 'ticket'}>Save configuration</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'account' && (
            <Card className={styles.section} title="Account Management" subtitle="Manage your account lifecycle and security.">

              <Card className={styles.card} padding="small" shadow="none">
                <h3>Deactivate account</h3>
                <p>Deactivating your account will prevent you from logging in until you reactivate it.</p>
                <Button variant="danger" onClick={() => setAccountAction('deactivate')}>Deactivate account</Button>
              </Card>

              <Card className={styles.card} padding="small" shadow="none">
                <h3>Delete account</h3>
                <p>Deleting your account is permanent and cannot be undone.</p>
                <Button variant="danger" onClick={() => setAccountAction('delete')}>Delete account</Button>
              </Card>
            </Card>
          )}

          {activeTab === 'admin' && isAdmin && (
            <Card className={styles.section} title="Admin System Settings" subtitle="Settings that affect the entire helpdesk system.">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave('admin')
                }}
              >
                <Input type="checkbox" label="Enable maintenance mode (read-only for non-admins)" fullWidth={false} checked={systemSettings.maintenanceMode} onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })} />
                <Input type="checkbox" label="Allow users to self-register" fullWidth={false} checked={systemSettings.allowSelfRegistration} onChange={(e) => setSystemSettings({ ...systemSettings, allowSelfRegistration: e.target.checked })} />

                <Input
                  label="Default ticket type"
                  id="defaultTicketType"
                  value={systemSettings.defaultTicketType}
                  required
                  onChange={(e) => setSystemSettings({ ...systemSettings, defaultTicketType: e.target.value })}
                />

                <div className={styles.actions}>
                  <Button type="button" variant="secondary" onClick={() => handleReset('admin')}>Reset</Button>
                  <Button type="submit" loading={savingSection === 'admin'}>Save system settings</Button>
                </div>
              </form>
            </Card>
          )}
        </main>
      </div>

      <Modal
        isOpen={Boolean(accountAction)}
        onClose={() => setAccountAction(null)}
        title={accountAction === 'delete' ? 'Delete account' : 'Deactivate account'}
        footer={(
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setAccountAction(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmAccountAction}>
              {accountAction === 'delete' ? 'Delete account' : 'Deactivate account'}
            </Button>
          </div>
        )}
      >
        <p>{accountAction === 'delete' ? 'Delete your account? This cannot be undone.' : 'Deactivate your account? You will not be able to log in until it is reactivated.'}</p>
      </Modal>
    </div>
  )
}
