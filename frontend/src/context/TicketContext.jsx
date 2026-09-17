/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

const TicketContext = createContext(null)

function getTicketId(ticket) {
	return ticket?.id ?? ticket?._id ?? ticket?.ticketId
}

function normalizeTicket(ticket) {
	if (!ticket) return ticket

	const statuses = {
		OPEN: 'Open',
		IN_PROGRESS: 'In Progress',
		RESOLVED: 'Resolved',
		CLOSED: 'Closed',
	}

	return {
		...ticket,
		status: statuses[ticket.status] || ticket.status,
	}
}

export function TicketProvider({ children }) {
	const { user } = useAuth()
	const [tickets, setTickets] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		let isMounted = true

		if (!user?.id) {
			Promise.resolve().then(() => {
				if (!isMounted) return
				setTickets([])
				setLoading(false)
				setError(null)
			})
			return () => {
				isMounted = false
			}
		}

		const endpoint = user.role === 'Student'
			? `/api/tickets/user/${user.id}`
			: user.role === 'Staff' || user.role === 'Admin'
				? '/api/tickets'
				: null

		if (!endpoint) {
			Promise.resolve().then(() => {
				if (!isMounted) return
				setTickets([])
				setLoading(false)
				setError(null)
			})
			return () => {
				isMounted = false
			}
		}

		Promise.resolve().then(() => {
			if (!isMounted) return
			setLoading(true)
			setError(null)
			return api.get(endpoint)
				.then((response) => {
					if (!isMounted) return
					const data = response.data?.data
					setTickets(Array.isArray(data) ? data.map(normalizeTicket) : [])
				})
				.catch(() => {
					if (!isMounted) return
					setTickets([])
					setError('Unable to load tickets.')
				})
				.finally(() => {
					if (isMounted) setLoading(false)
				})
		})

		return () => {
			isMounted = false
		}
	}, [user?.id, user?.role])

	const addTicket = async (ticket) => {
		const response = await api.post('/api/tickets', {
			title: ticket.title,
			description: ticket.description,
			priority: ticket.priority,
			category: ticket.category,
		})
		const createdTicket = normalizeTicket(response.data?.data)

		setTickets((current) => [...current, createdTicket])
		return createdTicket
	}

	const updateTicket = async (id, updates) => {
		const statuses = {
			Open: 'OPEN',
			'In Progress': 'IN_PROGRESS',
			Resolved: 'RESOLVED',
			Closed: 'CLOSED',
		}
		const supportedUpdates = ['status', 'priority', 'category', 'assignedToId']
		const payload = supportedUpdates.reduce((result, field) => {
			if (updates[field] !== undefined) {
				result[field] = field === 'status' ? statuses[updates[field]] || updates[field] : updates[field]
			}
			return result
		}, {})
		const response = await api.patch(`/api/tickets/${id}`, payload)
		const updatedTicket = normalizeTicket(response.data?.data)

		setTickets((current) => current.map((ticket) => (
			String(getTicketId(ticket)) === String(id) ? updatedTicket : ticket
		)))
		return updatedTicket
	}

	const deleteTicket = (id) => {
		// TODO: Add backend deletion when a DELETE ticket endpoint is implemented.
		setTickets((current) => current.filter((ticket) => String(getTicketId(ticket)) !== String(id)))
	}

	const getTicketById = (id) => {
		return tickets.find((ticket) => String(getTicketId(ticket)) === String(id)) ?? null
	}

	const value = {
		tickets,
		addTicket,
		updateTicket,
		deleteTicket,
		getTicketById,
		loading,
		error,
	}

	return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
}

export function useTicketContext() {
	const context = useContext(TicketContext)
	if (!context) throw new Error('useTicketContext must be used within a TicketProvider')
	return context
}
