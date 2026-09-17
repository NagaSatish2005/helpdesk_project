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
  const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY) || window.sessionStorage.getItem(AUTH_SESSION_KEY)
  const token = storedSession ? JSON.parse(storedSession).token : null

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
