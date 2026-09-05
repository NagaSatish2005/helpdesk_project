const STATUS_LABELS = {
	open: 'Open',
	'in-progress': 'In Progress',
	resolved: 'Resolved',
	closed: 'Closed',
}

const PRIORITY_LABELS = {
	low: 'Low',
	medium: 'Medium',
	high: 'High',
	critical: 'Critical',
}

function normalizeValue(value) {
	if (value == null) return ''

	return String(value).trim().toLowerCase().replace(/[_\s]+/g, '-')
}

function getOriginalOrUnknown(value, labels) {
	const normalizedValue = normalizeValue(value)
	if (labels[normalizedValue]) return labels[normalizedValue]
	if (value == null || String(value).trim() === '') return 'Unknown'
	return value
}

export function getTicketStatusLabel(status) {
	return getOriginalOrUnknown(status, STATUS_LABELS)
}

export function getTicketPriorityLabel(priority) {
	return getOriginalOrUnknown(priority, PRIORITY_LABELS)
}

export function getTicketStatusClass(status) {
	return normalizeValue(status)
}

export function getTicketPriorityClass(priority) {
	return normalizeValue(priority)
}

export function isTicketOpen(status) {
	return ['open', 'in-progress'].includes(normalizeValue(status))
}

export function isTicketClosed(status) {
	return ['resolved', 'closed'].includes(normalizeValue(status))
}

export function filterTicketsByStatus(tickets, status) {
	if (!Array.isArray(tickets)) return []
	if (status == null || String(status).trim() === '') return tickets

	const normalizedStatus = normalizeValue(status)
	return tickets.filter((ticket) => normalizeValue(ticket?.status) === normalizedStatus)
}

export function filterTicketsByPriority(tickets, priority) {
	if (!Array.isArray(tickets)) return []
	if (priority == null || String(priority).trim() === '') return tickets

	const normalizedPriority = normalizeValue(priority)
	return tickets.filter((ticket) => normalizeValue(ticket?.priority) === normalizedPriority)
}

export function getTicketCountsByStatus(tickets) {
	if (!Array.isArray(tickets)) return {}

	return tickets.reduce((counts, ticket) => {
		const status = ticket?.status == null || String(ticket.status).trim() === ''
			? 'Unknown'
			: ticket.status
		counts[status] = (counts[status] || 0) + 1
		return counts
	}, {})
}

const ticketUtils = {
	getTicketStatusLabel,
	getTicketPriorityLabel,
	getTicketStatusClass,
	getTicketPriorityClass,
	isTicketOpen,
	isTicketClosed,
	filterTicketsByStatus,
	filterTicketsByPriority,
	getTicketCountsByStatus,
}

export default ticketUtils
