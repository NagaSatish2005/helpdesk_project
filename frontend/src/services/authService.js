import api from './api'

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
}

export async function login(credentials) {
  const response = await api.post(AUTH_ENDPOINTS.login, credentials)
  return response.data
}

export async function register(userData) {
  const response = await api.post(AUTH_ENDPOINTS.register, userData)
  return response.data
}

export async function requestPasswordReset(payload) {
  const response = await api.post(AUTH_ENDPOINTS.forgotPassword, payload)
  return response.data
}

export async function resetPassword(payload) {
  const response = await api.post(AUTH_ENDPOINTS.resetPassword, payload)
  return response.data
}
