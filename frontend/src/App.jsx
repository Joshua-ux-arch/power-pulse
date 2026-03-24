import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import WakeUpBanner from './components/WakeUpBanner'
import StatsBar from './components/StatsBar'
import HeroLocation from './components/HeroLocation'
import ReportButtons from './components/ReportButtons'
import AreaGrid from './components/AreaGrid'
import LiveFeed from './components/LiveFeed'
import { usePowerPulse } from './hooks/usePowerPulse'

export default function App() {
  const [location, setLocation] = useState({ area: '', state: 'Lagos' })
  const [lastReport, setLastReport] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('pp_dark') === 'true' } catch { return false }
  })

  const toggleDark = () => {
    setDarkMode(d => {
      localStorage.setItem('pp_dark', String(!d))
      return !d
    })
  }

  // Apply dark mode to body background
  useEffect(() => {
    document.body.style.background = darkMode ? '#111110' : '#f4f1ea'
    document.documentElement.style.background = darkMode ? '#111110' : '#f4f1ea'
  }, [darkMode])

  const {
    reports, areaSummary, stats, loading, error,
    filterArea, setFilterArea,
    votedIds, submitReport, upvoteReport, refresh,
  } = usePowerPulse()

  const areaStatus = location.area
    ? areaSummary.find(a => a.area.toLowerCase() === location.area.toLowerCase())
    : null

  const handleSubmit = async (area, state, status) => {
    const result = await submitReport(area, state, status)
    if (result.success) setLastReport({ area, status })
    return result
  }

  const bg = darkMode ? '#111110' : '#f4f1ea'
  const text = darkMode ? '#f4f1ea' : '#111110'
  const muted = darkMode ? '#6b6b65' : '#9b9589'
  const borderColor = darkMode ? '#2e2e2a' : '#e5e0d5'

  return (
    <div style={{ background: bg, minHeight: '100vh', transition: 'background 0.3s ease' }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'DM Sans', fontSize: 13, borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }
        }}
      />

      <Header
        onRefresh={refresh}
        loading={loading}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />

      <main className="max-w-lg mx-auto px-4 pt-4 pb-10">
        {/* Wake-up / error banner */}
        <WakeUpBanner error={error} onRetry={() => refresh()} darkMode={darkMode} />

        {loading && !error ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-4">
            <div className="w-8 h-8 rounded-full border-2"
              style={{
                borderColor: darkMode ? '#2e2e2a' : '#e5e0d5',
                borderTopColor: '#c8f135',
                animation: 'spin 0.8s linear infinite',
              }} />
            <p style={{ fontSize: 13, color: muted }}>Loading PowerPulse…</p>
          </div>
        ) : (
          <>
            <HeroLocation
              area={location.area}
              state={location.state}
              areaStatus={areaStatus}
              onLocationChange={setLocation}
              darkMode={darkMode}
            />

            <StatsBar stats={stats} darkMode={darkMode} />

            <ReportButtons
              area={location.area}
              state={location.state}
              onSubmit={handleSubmit}
              darkMode={darkMode}
            />

            <AreaGrid areaSummary={areaSummary} darkMode={darkMode} />

            <LiveFeed
              reports={reports}
              filterArea={filterArea}
              onFilterChange={setFilterArea}
              onUpvote={upvoteReport}
              votedIds={votedIds}
              darkMode={darkMode}
            />
          </>
        )}
      </main>

      <footer className="text-center py-5" style={{ borderTop: `1.5px solid ${borderColor}` }}>
        <p style={{ fontSize: 11, fontFamily: 'DM Mono', color: muted, letterSpacing: '0.06em' }}>
          POWERPULSE · NIGERIA 🇳🇬 · V4
        </p>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
