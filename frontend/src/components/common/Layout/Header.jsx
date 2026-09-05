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
				<input
					type="text"
					placeholder="Search ticket ID, subject, user..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</form>

			<div className={styles.actions}>
				<div className={styles.iconButton} onClick={() => setIsNotifOpen((v) => !v)}>
					🔔
					<span className={styles.badge}>{unreadCount}</span>
				</div>
				{isNotifOpen && (
					<div className={styles.dropdown}>
						{notifications.map((n) => (
							<div key={n.id} className={styles.dropdownItem}>
								<span>{n.text}</span>
								<span style={{ fontSize: 12, color: '#6b7280' }}>{n.time}</span>
							</div>
						))}
					</div>
				)}

				<div className={styles.profile} onClick={() => setIsProfileOpen((v) => !v)}>
					<div className={styles.avatar}>{avatar}</div>
					<div className={styles.profileInfo}>
						<div className={styles.profileName}>{profileName}</div>
						<div className={styles.profileRole}>{profileRole}</div>
					</div>
				</div>
				{isProfileOpen && (
					<div className={styles.dropdown}>
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
