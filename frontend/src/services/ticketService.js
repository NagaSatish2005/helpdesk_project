import api from './api'

const TICKETS_ENDPOINT = '/api/tickets'

export async function getTickets() {
	const response = await api.get(TICKETS_ENDPOINT)
	return response.data
}

export async function getTicketById(id) {
	const response = await api.get(`${TICKETS_ENDPOINT}/${id}`)
	return response.data
}

export async function createTicket(ticketData) {
	const response = await api.post(TICKETS_ENDPOINT, ticketData)
	return response.data
}

export async function updateTicket(id, ticketData) {
	const response = await api.put(`${TICKETS_ENDPOINT}/${id}`, ticketData)
	return response.data
}

export async function deleteTicket(id) {
	const response = await api.delete(`${TICKETS_ENDPOINT}/${id}`)
	return response.data
}
