import axios from 'axios'

const AUTH_STORAGE_KEY = 'helpdesk.auth'
const AUTH_SESSION_KEY = 'helpdesk.auth.session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const parseSession = (storedSession) => {
    if (!storedSession) return null

    try {
      const session = JSON.parse(storedSession)
      return session?.token ? session : null
    } catch {
      return null
    }
  }

  const session = parseSession(window.localStorage.getItem(AUTH_STORAGE_KEY))
    || parseSession(window.sessionStorage.getItem(AUTH_SESSION_KEY))
  const token = session?.token || null

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
