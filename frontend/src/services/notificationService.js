import api from './api'

const NOTIFICATIONS_ENDPOINT = '/api/notifications'

function validateId(id, name) {
	if (id === undefined || id === null || id === '') {
		throw new TypeError(`${name} is required`)
	}
}

export async function getNotifications(userId) {
	validateId(userId, 'User id')
	const response = await api.get(`${NOTIFICATIONS_ENDPOINT}/user/${userId}`)
	return response.data
}

export async function getNotificationById(id) {
	validateId(id, 'Notification id')
	const response = await api.get(`${NOTIFICATIONS_ENDPOINT}/${id}`)
	return response.data
}

export async function markAsRead(id) {
	validateId(id, 'Notification id')
	const response = await api.patch(`${NOTIFICATIONS_ENDPOINT}/${id}/read`)
	return response.data
}

export async function markAllAsRead(userId) {
	validateId(userId, 'User id')
	const response = await api.patch(`${NOTIFICATIONS_ENDPOINT}/user/${userId}/read-all`)
	return response.data
}

export async function deleteNotification(id) {
	validateId(id, 'Notification id')
	const response = await api.delete(`${NOTIFICATIONS_ENDPOINT}/${id}`)
	return response.data
}

const notificationService = {
	getNotifications,
	getNotificationById,
	markAsRead,
	markAllAsRead,
	deleteNotification,
}

export default notificationService
