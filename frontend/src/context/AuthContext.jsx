/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

const AUTH_STORAGE_KEY = 'helpdesk.auth'
const AUTH_SESSION_KEY = 'helpdesk.auth.session'
const AUTH_API_URL = 'http://localhost:8081/api/auth'

const AuthContext = createContext(null)

function readStoredSession() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY) || window.sessionStorage.getItem(AUTH_SESSION_KEY)
    if (!stored) return null

    const session = JSON.parse(stored)
    return session?.token && session?.user ? session : null
  } catch {
    return null
  }
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}.`)
  }
  return payload
}

function mapRole(role) {
  const roles = {
    STUDENT: 'Student',
    STAFF: 'Staff',
    ADMIN: 'Admin',
  }

  return roles[role] || role
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession)

  const login = async ({ email, password, rememberMe = false }) => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const payload = await parseResponse(response)
    const authenticatedUser = {
      id: payload?.data?.id,
      name: payload?.data?.name,
      email: payload?.data?.email,
      role: mapRole(payload?.data?.role),
    }
    const authenticatedSession = { user: authenticatedUser, token: payload?.data?.token }

    if (!authenticatedSession.token) throw new Error('Login response did not include an authentication token.')

    setSession(authenticatedSession)

    if (rememberMe) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedSession))
      window.sessionStorage.removeItem(AUTH_SESSION_KEY)
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authenticatedSession))
    }

    return authenticatedUser
  }

  const register = async ({ name, email, password }) => {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const payload = await parseResponse(response)
    return payload?.data ?? payload
  }

  const logout = () => {
    setSession(null)
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.sessionStorage.removeItem(AUTH_SESSION_KEY)
  }

  const value = {
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.user),
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
