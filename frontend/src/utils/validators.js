const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s().-]*$/
const MIN_PASSWORD_LENGTH = 6
const MIN_NAME_LENGTH = 2
const MIN_TICKET_TITLE_LENGTH = 5
const MAX_TICKET_TITLE_LENGTH = 100
const MIN_TICKET_DESCRIPTION_LENGTH = 10
const MAX_TICKET_DESCRIPTION_LENGTH = 2000
const MAX_COMMENT_LENGTH = 2000

function getTrimmedString(value) {
	return typeof value === 'string' ? value.trim() : ''
}

export function isRequired(value) {
	if (value == null) return false
	if (typeof value === 'string') return value.trim().length > 0
	if (Array.isArray(value)) return value.length > 0

	return true
}

export function isValidEmail(email) {
	return EMAIL_PATTERN.test(getTrimmedString(email))
}

export function isValidPassword(password) {
	return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH
}

export function isValidName(name) {
	return getTrimmedString(name).length >= MIN_NAME_LENGTH
}

export function isValidPhone(phone) {
	const normalizedPhone = getTrimmedString(phone)
	const digitCount = (normalizedPhone.match(/\d/g) || []).length

	return digitCount >= 7 && PHONE_PATTERN.test(normalizedPhone)
}

export function isValidTicketTitle(title) {
	const normalizedTitle = getTrimmedString(title)
	return normalizedTitle.length >= MIN_TICKET_TITLE_LENGTH && normalizedTitle.length <= MAX_TICKET_TITLE_LENGTH
}

export function isValidTicketDescription(description) {
	const normalizedDescription = getTrimmedString(description)
	return normalizedDescription.length >= MIN_TICKET_DESCRIPTION_LENGTH && normalizedDescription.length <= MAX_TICKET_DESCRIPTION_LENGTH
}

export function validateLoginForm(data) {
	const form = data && typeof data === 'object' ? data : {}
	const errors = {}

	if (!isRequired(form.email)) errors.email = 'Email is required.'
	else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'

	if (!isRequired(form.password)) errors.password = 'Password is required.'
	else if (!isValidPassword(form.password)) errors.password = 'Password must be at least 6 characters.'

	return errors
}

export function validateRegisterForm(data) {
	const form = data && typeof data === 'object' ? data : {}
	const errors = {}

	if (!isValidName(form.name)) errors.name = 'Full name is required (min 2 characters).'

	if (!isRequired(form.email)) errors.email = 'Email is required.'
	else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'

	if (!isRequired(form.password)) errors.password = 'Password is required.'
	else if (!isValidPassword(form.password)) errors.password = 'Password must be at least 6 characters.'

	if (!isRequired(form.confirmPassword)) errors.confirmPassword = 'Please confirm your password.'
	else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'

	if (!isRequired(form.role)) errors.role = 'Please select a role.'
	if (!isRequired(form.department)) errors.department = 'Please select a department.'

	return errors
}

export function validateTicketForm(data) {
	const form = data && typeof data === 'object' ? data : {}
	const errors = {}

	if (!isRequired(form.title)) errors.title = 'Title is required (5-100 chars).'
	else if (!isValidTicketTitle(form.title)) {
		errors.title = getTrimmedString(form.title).length > MAX_TICKET_TITLE_LENGTH
			? 'Title must be at most 100 characters.'
			: 'Title is required (5-100 chars).'
	}

	if (!isRequired(form.description)) errors.description = 'Description is required (10-2000 chars).'
	else if (!isValidTicketDescription(form.description)) {
		errors.description = getTrimmedString(form.description).length > MAX_TICKET_DESCRIPTION_LENGTH
			? 'Description must be at most 2000 characters.'
			: 'Description is required (10-2000 chars).'
	}

	if (!isRequired(form.department)) errors.department = 'Please select a department.'
	if (!isRequired(form.category)) errors.category = 'Please select a category.'
	if (!isRequired(form.priority)) errors.priority = 'Please select a priority.'

	return errors
}

export function validateCommentForm(data) {
	const form = data && typeof data === 'object' ? data : {}
	const comment = form.comment ?? form.text ?? ''
	const trimmedComment = getTrimmedString(comment)

	if (!trimmedComment) return { comment: 'Comment is required.' }
	if (typeof comment !== 'string' || comment.length > MAX_COMMENT_LENGTH) {
		return { comment: `Comment must be at most ${MAX_COMMENT_LENGTH} characters.` }
	}

	return {}
}

const validators = {
	isRequired,
	isValidEmail,
	isValidPassword,
	isValidName,
	isValidPhone,
	isValidTicketTitle,
	isValidTicketDescription,
	validateLoginForm,
	validateRegisterForm,
	validateTicketForm,
	validateCommentForm,
}

export default validators
