import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 12000,
})

export const fetchReports = (area = '') => api.get('/reports', { params: { area, limit: 60 } })
export const submitReport = (area, state, status) => api.post('/reports', { area, state, status })
export const upvoteReport = (id) => api.patch(`/reports/${id}/upvote`)
export const fetchAreaSummary = () => api.get('/areas/summary')
export const fetchStats = () => api.get('/areas/stats')

export default api
