import { USER_ROLES } from './constants'

export const PERMISSIONS = Object.freeze({
	VIEW_DASHBOARD: 'viewDashboard',
	VIEW_TICKETS: 'viewTickets',
	CREATE_TICKETS: 'createTickets',
	VIEW_OWN_TICKETS: 'viewOwnTickets',
	VIEW_ALL_TICKETS: 'viewAllTickets',
	MANAGE_USERS: 'manageUsers',
	MANAGE_DEPARTMENTS: 'manageDepartments',
	VIEW_REPORTS: 'viewReports',
	MANAGE_SETTINGS: 'manageSettings',
	VIEW_PROFILE: 'viewProfile',
	EDIT_PROFILE: 'editProfile',
})

export const ROLE_PERMISSIONS = Object.freeze({
	[USER_ROLES.STUDENT]: Object.freeze([
		PERMISSIONS.VIEW_DASHBOARD,
		PERMISSIONS.VIEW_TICKETS,
		PERMISSIONS.CREATE_TICKETS,
		PERMISSIONS.VIEW_OWN_TICKETS,
		PERMISSIONS.VIEW_PROFILE,
		PERMISSIONS.EDIT_PROFILE,
	]),
	[USER_ROLES.STAFF]: Object.freeze([
		PERMISSIONS.VIEW_DASHBOARD,
		PERMISSIONS.VIEW_TICKETS,
		PERMISSIONS.VIEW_ALL_TICKETS,
		PERMISSIONS.VIEW_REPORTS,
		PERMISSIONS.VIEW_PROFILE,
		PERMISSIONS.EDIT_PROFILE,
	]),
	[USER_ROLES.ADMIN]: Object.freeze([
		PERMISSIONS.VIEW_DASHBOARD,
		PERMISSIONS.VIEW_TICKETS,
		PERMISSIONS.VIEW_ALL_TICKETS,
		PERMISSIONS.MANAGE_USERS,
		PERMISSIONS.MANAGE_DEPARTMENTS,
		PERMISSIONS.VIEW_REPORTS,
		PERMISSIONS.MANAGE_SETTINGS,
		PERMISSIONS.VIEW_PROFILE,
		PERMISSIONS.EDIT_PROFILE,
	]),
})

function getUserRole(user) {
	return user && typeof user === 'object' ? user.role : null
}

export function hasPermission(user, permission) {
	if (!permission) return false

	return getRolePermissions(getUserRole(user)).includes(permission)
}

export function hasAnyPermission(user, permissions) {
	if (!Array.isArray(permissions) || permissions.length === 0) return false

	return permissions.some((permission) => hasPermission(user, permission))
}

export function hasAllPermissions(user, permissions) {
	if (!Array.isArray(permissions) || permissions.length === 0) return false

	return permissions.every((permission) => hasPermission(user, permission))
}

export function getRolePermissions(role) {
	return ROLE_PERMISSIONS[role] || []
}

export function canAccessRoute(user, routePermission) {
	return hasPermission(user, routePermission)
}

const rolePermissions = {
	PERMISSIONS,
	ROLE_PERMISSIONS,
	hasPermission,
	hasAnyPermission,
	hasAllPermissions,
	getRolePermissions,
	canAccessRoute,
}

export default rolePermissions
