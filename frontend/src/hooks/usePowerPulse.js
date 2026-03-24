import { useState, useEffect, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import { fetchReports, fetchAreaSummary, fetchStats, submitReport as apiSubmit, upvoteReport as apiUpvote } from '../utils/api'

export function usePowerPulse() {
  const [reports, setReports] = useState([])
  const [areaSummary, setAreaSummary] = useState([])
  const [stats, setStats] = useState({ totalReports: 0, areasOn: 0, areasOff: 0, last24h: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterArea, setFilterArea] = useState('')
  const [votedIds, setVotedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pp_voted') || '[]') } catch { return [] }
  })
  const retryCount = useRef(0)

  const loadAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const [rRes, sRes, stRes] = await Promise.all([
        fetchReports(filterArea),
        fetchAreaSummary(),
        fetchStats(),
      ])
      setReports(rRes.data.reports || [])
      setAreaSummary(sRes.data.areas || [])
      setStats(stRes.data.stats || {})
      retryCount.current = 0
    } catch (err) {
      console.error('Load error:', err)
      const msg = err.code === 'ERR_NETWORK'
        ? 'Backend is waking up... please wait 30 seconds and refresh.'
        : 'Could not load data. Check your connection.'
      setError(msg)
      if (!silent) toast.error(msg, { duration: 5000 })
      // Auto retry up to 3 times with delay
      if (retryCount.current < 3) {
        retryCount.current++
        setTimeout(() => loadAll(true), 8000)
      }
    } finally {
      setLoading(false)
    }
  }, [filterArea])

  useEffect(() => {
    loadAll()
    const interval = setInterval(() => loadAll(true), 20000)
    return () => clearInterval(interval)
  }, [loadAll])

  const submitReport = async (area, state, status) => {
    try {
      const res = await apiSubmit(area, state, status)
      const newReport = res.data.report
      const wasUpdated = res.data.updated
      if (wasUpdated) {
        setReports(prev => prev.map(r => r._id === newReport._id ? newReport : r))
      } else {
        setReports(prev => [newReport, ...prev])
      }
      setAreaSummary(prev => {
        const exists = prev.find(a => a.area.toLowerCase() === area.toLowerCase())
        if (exists) return prev.map(a => a.area.toLowerCase() === area.toLowerCase() ? { ...a, status, lastReport: new Date() } : a)
        return [{ area, state, status, totalReports: 1, lastReport: new Date(), confidence: 100 }, ...prev]
      })
      setStats(prev => ({ ...prev, totalReports: prev.totalReports + (wasUpdated ? 0 : 1), last24h: prev.last24h + (wasUpdated ? 0 : 1) }))
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit. Try again.'
      return { success: false, error: msg }
    }
  }

  const upvoteReport = async (id) => {
    try {
      const res = await apiUpvote(id)
      setReports(prev => prev.map(r => r._id === id ? { ...r, votes: res.data.votes } : r))
      const newVoted = votedIds.includes(id) ? votedIds.filter(v => v !== id) : [...votedIds, id]
      setVotedIds(newVoted)
      localStorage.setItem('pp_voted', JSON.stringify(newVoted))
    } catch { toast.error('Could not confirm report') }
  }

  return { reports, areaSummary, stats, loading, error, filterArea, setFilterArea, votedIds, submitReport, upvoteReport, refresh: loadAll }
}
