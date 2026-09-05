const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toDate(value) {
	if (value instanceof Date) {
		return new Date(value.getTime())
	}

	if (typeof value === 'string') {
		const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
		if (dateOnly) {
			return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
		}
	}

	return new Date(value)
}

function getValidDate(value) {
	if (value == null) return null

	const date = toDate(value)
	return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(date) {
	const validDate = getValidDate(date)
	if (!validDate) return null

	const day = String(validDate.getDate()).padStart(2, '0')
	return `${day} ${MONTH_NAMES[validDate.getMonth()]} ${validDate.getFullYear()}`
}

export function formatDateTime(date) {
	const validDate = getValidDate(date)
	if (!validDate) return null

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(validDate)
}

export function formatRelativeTime(date) {
	const validDate = getValidDate(date)
	if (!validDate) return null

	const differenceInSeconds = (Date.now() - validDate.getTime()) / 1000
	const absoluteSeconds = Math.abs(differenceInSeconds)
	if (absoluteSeconds < 60) return 'Just now'

	const units = [
		['minute', 60, 60 * 60],
		['hour', 60 * 60, 24 * 60 * 60],
		['day', 24 * 60 * 60, Number.POSITIVE_INFINITY],
	]
	const unit = units.find(([, , maximumSeconds]) => absoluteSeconds < maximumSeconds) || units[2]
	const amount = Math.floor(absoluteSeconds / unit[1])
	const label = `${amount} ${unit[0]}${amount === 1 ? '' : 's'}`

	return differenceInSeconds >= 0 ? `${label} ago` : `in ${label}`
}

export function isOverdue(date) {
	const validDate = getValidDate(date)
	return validDate !== null && validDate.getTime() < Date.now()
}

export function getDaysDifference(startDate, endDate) {
	const start = getValidDate(startDate)
	const end = getValidDate(endDate)
	if (!start || !end) return null

	return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
}

export function getTimeDifferenceInHours(startDate, endDate) {
	const start = getValidDate(startDate)
	const end = getValidDate(endDate)
	if (!start || !end) return null

	return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60)
}

export function toISOString(date) {
	const validDate = getValidDate(date)
	return validDate ? validDate.toISOString() : null
}

const dateUtils = {
	formatDate,
	formatDateTime,
	formatRelativeTime,
	isOverdue,
	getDaysDifference,
	getTimeDifferenceInHours,
	toISOString,
}

export default dateUtils
