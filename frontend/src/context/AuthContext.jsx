/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'helpdesk.auth'

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = async ({ email, password, rememberMe = false }) => {
    const matchedUser = MOCK_USERS.find(
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

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
