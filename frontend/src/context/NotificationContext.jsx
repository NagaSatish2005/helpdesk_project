/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react'

const INITIAL_NOTIFICATIONS = [
	{ id: 1, text: 'New ticket created: TCK-045', time: '2m ago', read: false },
	{ id: 2, text: 'Ticket assigned to you: TCK-038', time: '1h ago', read: false },
	{ id: 3, text: 'Ticket TCK-020 marked resolved', time: 'Yesterday', read: false },
]

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
	const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

	const unreadCount = notifications.reduce(
		(count, notification) => count + (notification.read ? 0 : 1),
		0
	)

	const addNotification = (notification) => {
		const nextNotification = {
			...notification,
			id: notification.id ?? `notification-${Date.now()}`,
			read: notification.read ?? false,
		}
		setNotifications((current) => [nextNotification, ...current])
		return nextNotification
	}

	const markAsRead = (notificationId) => {
		setNotifications((current) => current.map((notification) => (
			notification.id === notificationId ? { ...notification, read: true } : notification
		)))
	}

	const markAllAsRead = () => {
		setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
	}

	const removeNotification = (notificationId) => {
		setNotifications((current) => current.filter((notification) => notification.id !== notificationId))
	}

	const clearNotifications = () => {
		setNotifications([])
	}

	const value = useMemo(() => ({
		notifications,
		unreadCount,
		addNotification,
		markAsRead,
		markAllAsRead,
		removeNotification,
		clearNotifications,
	}), [notifications, unreadCount])

	return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotificationContext() {
	const context = useContext(NotificationContext)
	if (!context) throw new Error('useNotificationContext must be used within a NotificationProvider')
	return context
}
