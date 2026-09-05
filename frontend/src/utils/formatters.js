import { getTicketPriorityLabel, getTicketStatusLabel } from './ticketUtils'

function normalizeText(value) {
	if (value == null) return ''

	return String(value).trim().replace(/\s+/g, ' ')
}

export function formatName(name) {
	const normalizedName = normalizeText(name)
	if (!normalizedName) return ''

	return normalizedName
		.toLowerCase()
		.replace(/(?:^|\s)\S/g, (character) => character.toUpperCase())
}

export function formatTicketId(id) {
	return normalizeText(id).toUpperCase()
}

export function formatRole(role) {
	const normalizedRole = normalizeText(role)
	if (!normalizedRole) return ''

	return normalizedRole
		.toLowerCase()
		.replace(/(?:^|[-_\s])\S/g, (character) => character.toUpperCase())
}

export function formatStatus(status) {
	return getTicketStatusLabel(status)
}

export function formatPriority(priority) {
	return getTicketPriorityLabel(priority)
}

export function formatNumber(value) {
	if (value == null || (typeof value === 'string' && value.trim() === '')) return ''

	const number = Number(value)
	if (!Number.isFinite(number)) return ''

	return new Intl.NumberFormat().format(number)
}

export function capitalize(value) {
	const normalizedValue = normalizeText(value)
	if (!normalizedValue) return ''

	return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)
}

export function truncateText(value, maxLength) {
	const text = normalizeText(value)
	if (!text) return ''

	const limit = Number(maxLength)
	if (!Number.isFinite(limit) || limit < 1) return text
	if (text.length <= limit) return text
	if (limit === 1) return '…'

	return `${text.slice(0, Math.floor(limit) - 1).trimEnd()}…`
}

const formatters = {
	formatName,
	formatTicketId,
	formatRole,
	formatStatus,
	formatPriority,
	formatNumber,
	capitalize,
	truncateText,
}

export default formatters
