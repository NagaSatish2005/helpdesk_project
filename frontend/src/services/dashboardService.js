import api from './api'

const DASHBOARD_ENDPOINTS = {
	stats: '/api/dashboard/stats',
	recentTickets: '/api/dashboard/recent-tickets',
	activityFeed: '/api/dashboard/activity',
	departmentPerformance: '/api/dashboard/department-performance',
}

export async function getDashboardStats() {
	const response = await api.get(DASHBOARD_ENDPOINTS.stats)
	return response.data
}

export async function getRecentTickets() {
	const response = await api.get(DASHBOARD_ENDPOINTS.recentTickets)
	return response.data
}

export async function getActivityFeed() {
	const response = await api.get(DASHBOARD_ENDPOINTS.activityFeed)
	return response.data
}

export async function getDepartmentPerformance() {
	const response = await api.get(DASHBOARD_ENDPOINTS.departmentPerformance)
	return response.data
}

const dashboardService = {
	getDashboardStats,
	getRecentTickets,
	getActivityFeed,
	getDepartmentPerformance,
}

export default dashboardService
