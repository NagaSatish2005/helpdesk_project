/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

const AUTH_STORAGE_KEY = 'helpdesk.auth'
const USERS_STORAGE_KEY = 'helpdesk.mockUsers'

const MOCK_USERS = [
  { email: 'student@example.com', password: 'password', name: 'Student User', role: 'Student' },
  { email: 'staff@example.com', password: 'password', name: 'Staff User', role: 'Staff' },
  { email: 'admin@example.com', password: 'password', name: 'Admin User', role: 'Admin' },
]

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function readStoredUsers() {
  try {
    const stored = window.localStorage.getItem(USERS_STORAGE_KEY)
    return stored ? [...MOCK_USERS, ...JSON.parse(stored)] : MOCK_USERS
  } catch {
    return MOCK_USERS
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [users, setUsers] = useState(readStoredUsers)

  const login = async ({ email, password, rememberMe = false }) => {
    const matchedUser = users.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.password === password
    )

    if (!matchedUser) {
      throw new Error('Invalid email or password.')
    }

    const authenticatedUser = {
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
    }
    setUser(authenticatedUser)

    if (rememberMe) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser))
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }

    return authenticatedUser
  }

  const register = async ({ name, email, password, role = 'student', department }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const alreadyRegistered = users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)

    if (alreadyRegistered) throw new Error('An account with this email already exists.')

    const normalizedRole = role.toLowerCase() === 'staff' ? 'Staff' : 'Student'
    const newUser = {
      email: normalizedEmail,
      password,
      name: name.trim(),
      role: normalizedRole,
      department,
    }
    const registeredUsers = [...users, newUser]
    setUsers(registeredUsers)
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers.slice(MOCK_USERS.length)))
    return { email: newUser.email, name: newUser.name, role: newUser.role }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
