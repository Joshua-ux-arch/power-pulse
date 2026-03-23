import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import HeroLocation from './components/HeroLocation'
import ReportButtons from './components/ReportButtons'
import AreaGrid from './components/AreaGrid'
import LiveFeed from './components/LiveFeed'
import FloatingShare from './components/FloatingShare'
import { usePowerPulse } from './hooks/usePowerPulse'

export default function App() {
  const [location, setLocation] = useState({ area: '', state: 'Lagos' })
  const [lastReport, setLastReport] = useState(null)

  const {
    reports, areaSummary, stats, loading,
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

  return (
    <div style={{ background: '#f5f2eb', minHeight: '100vh' }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'DM Sans', fontSize: 14, borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }
        }}
      />

      <Header onRefresh={refresh} loading={loading} />

      <main className="max-w-lg mx-auto px-4 pt-4 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-24 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent"
              style={{ borderColor: '#e0dbd0', borderTopColor: '#0d0d0d', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 14, color: '#8a8478' }}>Loading…</p>
          </div>
        ) : (
          <>
            <HeroLocation
              area={location.area}
              state={location.state}
              areaStatus={areaStatus}
              onLocationChange={setLocation}
            />

            <StatsBar stats={stats} />

            <ReportButtons
              area={location.area}
              state={location.state}
              onSubmit={handleSubmit}
            />

            <AreaGrid areaSummary={areaSummary} />

            <LiveFeed
              reports={reports}
              filterArea={filterArea}
              onFilterChange={setFilterArea}
              onUpvote={upvoteReport}
              votedIds={votedIds}
            />
          </>
        )}
      </main>

      <footer className="text-center py-5" style={{ borderTop: '1.5px solid #e0dbd0' }}>
        <p style={{ fontSize: 12, color: '#c4bfb5', fontFamily: 'DM Mono' }}>
          POWERPULSE · BUILT FOR NIGERIA 🇳🇬
        </p>
      </footer>

      <FloatingShare area={lastReport?.area} status={lastReport?.status} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
