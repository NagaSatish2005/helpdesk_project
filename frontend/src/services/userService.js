import api from './api'

const USERS_ENDPOINT = '/api/users'

export async function getUsers() {
	const response = await api.get(USERS_ENDPOINT)
	return response.data
}

export async function getUserById(id) {
	const response = await api.get(`${USERS_ENDPOINT}/${id}`)
	return response.data
}

export async function createUser(userData) {
	const response = await api.post(USERS_ENDPOINT, userData)
	return response.data
}

export async function updateUser(id, userData) {
	const response = await api.put(`${USERS_ENDPOINT}/${id}`, userData)
	return response.data
}

export async function deleteUser(id) {
	const response = await api.delete(`${USERS_ENDPOINT}/${id}`)
	return response.data
}
