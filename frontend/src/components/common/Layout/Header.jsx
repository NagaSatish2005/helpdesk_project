import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useNotifications from '../../../hooks/useNotifications'
import styles from './Header.module.css'

export default function Header({ onToggleSidebar }) {
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const { notifications, unreadCount } = useNotifications()
	const [search, setSearch] = useState('')
	const [isNotifOpen, setIsNotifOpen] = useState(false)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const containerRef = useRef(null)

	useEffect(() => {
		const onClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsNotifOpen(false)
				setIsProfileOpen(false)
			}
		}

		document.addEventListener('click', onClickOutside)
		return () => document.removeEventListener('click', onClickOutside)
	}, [])

	const handleSearch = (e) => {
		e.preventDefault()
		if (!search.trim()) return
		alert(`Searching for: ${search}`)
		setSearch('')
	}

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	const profileName = user?.name || user?.fullName || 'User'
	const profileRole = user?.role || 'User'
	const avatar = profileName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
	const roleDashboard = {
		Student: '/student',
		Staff: '/staff',
		Admin: '/admin',
	}[user?.role] || '/dashboard'

	return (
		<header className={styles.header} ref={containerRef}>
			<div className={styles.left}>
				<button className={styles.menuToggle} onClick={onToggleSidebar} aria-label="Toggle sidebar">
					☰
				</button>
				<div className={styles.logo} onClick={() => navigate(roleDashboard)}>
					<div className={styles.logoIcon}>H</div>
					<div className={styles.title}>Helpdesk System</div>
				</div>
			</div>

			<form className={styles.search} onSubmit={handleSearch}>
				<svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
				<input
					type="text"
					placeholder="Search ticket ID, subject, user..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</form>

			<div className={styles.actions}>
				<button type="button" className={styles.iconButton} onClick={() => setIsNotifOpen((v) => !v)} aria-label="Notifications">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
					<span className={styles.badge}>{unreadCount}</span>
				</button>
				{isNotifOpen && (
					<div className={`${styles.dropdown} ${styles.notificationDropdown}`}>
						<div className={styles.dropdownHeader}>Notifications</div>
						{notifications.map((n) => (
							<div key={n.id} className={styles.dropdownItem}>
								<span>{n.text}</span>
								<span style={{ fontSize: 12, color: '#6b7280' }}>{n.time}</span>
							</div>
						))}
					</div>
				)}

				<button type="button" className={styles.profile} onClick={() => setIsProfileOpen((v) => !v)} aria-label="Open user menu">
					<div className={styles.avatar}>{avatar}</div>
					<div className={styles.profileInfo}>
						<div className={styles.profileName}>{profileName}</div>
						<div className={styles.profileRole}>{profileRole}</div>
					</div>
					<svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
				</button>
				{isProfileOpen && (
					<div className={`${styles.dropdown} ${styles.profileDropdown}`}>
						<div className={styles.dropdownItem} onClick={() => alert('View profile')}>
							<span>View Profile</span>
						</div>
						<div className={styles.dropdownItem} onClick={() => alert('Settings')}>
							<span>Settings</span>
						</div>
						<div className={styles.dropdownItem} onClick={handleLogout}>
							<span>Logout</span>
						</div>
					</div>
				)}
			</div>
		</header>
	)
}
