export function isAuthenticated(user) {
	return user !== null && typeof user === 'object' && !Array.isArray(user)
}

export function getUserRole(user) {
	return isAuthenticated(user) && user.role ? user.role : null
}

export function hasRole(user, role) {
	return getUserRole(user) === role
}

export function hasAnyRole(user, roles) {
	if (!Array.isArray(roles) || roles.length === 0) return false

	return roles.includes(getUserRole(user))
}

export function canAccessRole(user, allowedRoles) {
	return hasAnyRole(user, allowedRoles)
}

export function getRoleDashboard(role) {
	const dashboards = {
		Student: '/student',
		Staff: '/staff',
		Admin: '/admin',
	}

	return dashboards[role] || '/dashboard'
}

const authUtils = {
	isAuthenticated,
	getUserRole,
	hasRole,
	hasAnyRole,
	canAccessRole,
	getRoleDashboard,
}

export default authUtils
