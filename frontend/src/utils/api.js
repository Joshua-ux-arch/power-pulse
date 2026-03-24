import axios from 'axios'

// CRITICAL: This ensures the API URL works even if env var isn't set
const getBaseURL = () => {
  // If env var is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // If running locally, use proxy
  if (window.location.hostname === 'localhost') {
    return '/api'
  }
  // Production fallback - your actual Render URL
  return 'https://power-pulse-fj16.onrender.com/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Log the base URL on startup so we can debug
console.log('🔗 API Base URL:', getBaseURL())

export const fetchReports = (area = '') =>
  api.get('/reports', { params: { area, limit: 60 } })

export const submitReport = (area, state, status) =>
  api.post('/reports', { area, state, status })

export const upvoteReport = (id) =>
  api.patch(`/reports/${id}/upvote`)

export const fetchAreaSummary = () =>
  api.get('/areas/summary')

export const fetchStats = () =>
  api.get('/areas/stats')

export default api
