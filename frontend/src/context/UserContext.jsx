/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
import { mockUsers } from '../assets/data/mockUsers'

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

export function UserProvider({ children }) {
	const [users, setUsers] = useState(() => [...mockUsers])

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

	const deleteUser = (id) => {
		setUsers((current) => current.filter((user) => getUserId(user) !== id))
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
	}

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserContext() {
	const context = useContext(UserContext)
	if (!context) throw new Error('useUserContext must be used within a UserProvider')
	return context
}
