import api from './api'

const DEPARTMENTS_ENDPOINT = '/api/departments'

function validateId(id) {
	if (id === undefined || id === null || id === '') {
		throw new TypeError('Department id is required')
	}
}

export async function getDepartments() {
	const response = await api.get(DEPARTMENTS_ENDPOINT)
	return response.data
}

export async function getDepartmentById(id) {
	validateId(id)
	const response = await api.get(`${DEPARTMENTS_ENDPOINT}/${id}`)
	return response.data
}

export async function createDepartment(departmentData) {
	const response = await api.post(DEPARTMENTS_ENDPOINT, departmentData)
	return response.data
}

export async function updateDepartment(id, departmentData) {
	validateId(id)
	const response = await api.put(`${DEPARTMENTS_ENDPOINT}/${id}`, departmentData)
	return response.data
}

export async function deleteDepartment(id) {
	validateId(id)
	const response = await api.delete(`${DEPARTMENTS_ENDPOINT}/${id}`)
	return response.data
}

const departmentService = {
	getDepartments,
	getDepartmentById,
	createDepartment,
	updateDepartment,
	deleteDepartment,
}

export default departmentService
