/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

const UserContext = createContext(null)

function getUserId(user) {
	return user?.id ?? user?._id ?? user?.userId
}

function createTemporaryId() {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return `frontend-${crypto.randomUUID()}`
	}

	return `frontend-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function normalizeRole(role) {
	return {
		STUDENT: 'Student',
		STAFF: 'Staff',
		ADMIN: 'Admin',
	}[String(role || '').toUpperCase()] || role
}

function formatCreatedDate(createdAt) {
	if (!createdAt) return undefined

	const date = new Date(createdAt)
	if (Number.isNaN(date.getTime())) return undefined

	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

export function UserProvider({ children }) {
	const { user } = useAuth()
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		const role = String(user?.role || '').toUpperCase()
		let isMounted = true

		if (role === 'STUDENT' || !user?.id) {
			setUsers([])
			setLoading(false)
			setError(null)
			return () => {
				isMounted = false
			}
		}

		if (role !== 'STAFF' && role !== 'ADMIN') {
			setUsers([])
			setLoading(false)
			setError(null)
			return () => {
				isMounted = false
			}
		}

		setLoading(true)
		setError(null)

		api.get('/api/users')
			.then((response) => {
				if (!isMounted) return
				const backendUsers = Array.isArray(response.data?.data) ? response.data.data : []
				setUsers(backendUsers.map((backendUser) => ({
					...backendUser,
					role: normalizeRole(backendUser.role),
					created: formatCreatedDate(backendUser.createdAt),
					status: undefined,
				})))
			})
			.catch((requestError) => {
				if (!isMounted) return
				setUsers([])
				setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load users.')
			})
			.finally(() => {
				if (isMounted) setLoading(false)
			})

		return () => {
			isMounted = false
		}
	}, [user?.id, user?.role])

	const addUser = (user) => {
		const userWithId = getUserId(user) == null
			? { ...user, id: createTemporaryId() }
			: user

		setUsers((current) => [...current, userWithId])
		return userWithId
	}

	const updateUser = (id, updates) => {
		setUsers((current) => current.map((user) => (
			getUserId(user) === id ? { ...user, ...updates } : user
		)))
	}

	const deleteUser = async (id) => {
		try {
			await api.delete(`/api/users/${id}`)
			setUsers((current) => current.filter((user) => String(getUserId(user)) !== String(id)))
		} catch (requestError) {
			throw new Error(requestError?.response?.data?.message || requestError?.message || 'Unable to delete user.')
		}
	}

	const getUserById = (id) => {
		return users.find((user) => getUserId(user) === id) ?? null
	}

	const value = {
		users,
		addUser,
		updateUser,
		deleteUser,
		getUserById,
		loading,
		error,
	}

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserContext() {
	const context = useContext(UserContext)
	if (!context) throw new Error('useUserContext must be used within a UserProvider')
	return context
}