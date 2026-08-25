/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
import { mockTickets } from '../assets/data/mockTickets'

const TicketContext = createContext(null)

function getTicketId(ticket) {
	return ticket?.id ?? ticket?._id ?? ticket?.ticketId
}

function createTemporaryId() {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return `frontend-${crypto.randomUUID()}`
	}

	return `frontend-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function TicketProvider({ children }) {
	const [tickets, setTickets] = useState(() => [...mockTickets])

	const addTicket = (ticket) => {
		const ticketWithId = getTicketId(ticket) == null
			? { ...ticket, id: createTemporaryId() }
			: ticket

		setTickets((current) => [...current, ticketWithId])
		return ticketWithId
	}

	const updateTicket = (id, updates) => {
		let updatedTicket = null
		setTickets((current) => current.map((ticket) => {
			if (getTicketId(ticket) !== id) return ticket
			updatedTicket = { ...ticket, ...updates }
			return updatedTicket
		}))
		return updatedTicket
	}

	const deleteTicket = (id) => {
		setTickets((current) => current.filter((ticket) => getTicketId(ticket) !== id))
	}

	const getTicketById = (id) => {
		return tickets.find((ticket) => getTicketId(ticket) === id) ?? null
	}

	const value = {
		tickets,
		addTicket,
		updateTicket,
		deleteTicket,
		getTicketById,
	}

	return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
}

export function useTicketContext() {
	const context = useContext(TicketContext)
	if (!context) throw new Error('useTicketContext must be used within a TicketProvider')
	return context
}
