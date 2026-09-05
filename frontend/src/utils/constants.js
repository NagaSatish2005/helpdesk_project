export const USER_ROLES = Object.freeze({
	STUDENT: 'Student',
	STAFF: 'Staff',
	ADMIN: 'Admin',
})

export const TICKET_STATUSES = Object.freeze({
	OPEN: 'Open',
	IN_PROGRESS: 'In Progress',
	RESOLVED: 'Resolved',
	CLOSED: 'Closed',
})

export const TICKET_PRIORITIES = Object.freeze({
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High',
	CRITICAL: 'Critical',
})

export const ROUTES = Object.freeze({
	login: '/login',
	register: '/register',
	forgotPassword: '/forgot-password',
	studentDashboard: '/student',
	staffDashboard: '/staff',
	adminDashboard: '/admin',
	tickets: '/tickets',
	createTicket: '/tickets/create',
	myTickets: '/my-tickets',
	profile: '/profile',
	editProfile: '/profile/edit',
	adminUsers: '/admin/users',
	adminDepartments: '/admin/departments',
	adminReports: '/admin/reports',
	adminSettings: '/admin/settings',
	unauthorized: '/unauthorized',
	serverError: '/server-error',
})

export const API_ENDPOINTS = Object.freeze({
	auth: Object.freeze({
		login: '/auth/login',
		register: '/auth/register',
		forgotPassword: '/auth/forgot-password',
		resetPassword: '/auth/reset-password',
	}),
	tickets: '/api/tickets',
	users: '/api/users',
	departments: '/api/departments',
	notifications: '/api/notifications',
	dashboard: '/api/dashboard',
})

export const PAGINATION = Object.freeze({
	departmentsPageSize: 4,
	usersPageSize: 5,
	ticketsPageSize: 5,
})

export const APP_NAME = 'Helpdesk System'

const constants = {
	USER_ROLES,
	TICKET_STATUSES,
	TICKET_PRIORITIES,
	ROUTES,
	API_ENDPOINTS,
	PAGINATION,
	APP_NAME,
}

export default constants
