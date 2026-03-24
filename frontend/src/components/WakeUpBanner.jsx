import React, { useState, useEffect } from 'react'

export default function WakeUpBanner({ error, onRetry, darkMode }) {
  const [countdown, setCountdown] = useState(30)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    if (!error) return
    setCountdown(30)
    const t = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(t)
          handleRetry()
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [error])

  const handleRetry = async () => {
    setRetrying(true)
    await onRetry()
    setRetrying(false)
  }

  if (!error) return null

  const isWaking = error.includes('waking')

  return (
    <div className="mx-4 mb-4 rounded-2xl p-4 flex items-start gap-3 animate-slide-up"
      style={{
        background: darkMode ? '#2a2520' : '#fff9ee',
        border: `1.5px solid ${darkMode ? '#4a3a20' : '#f0d896'}`,
      }}>
      <span className="text-xl flex-shrink-0">{isWaking ? '😴' : '📡'}</span>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#f4d060' : '#8a6200', marginBottom: 2 }}>
          {isWaking ? 'Backend waking up…' : 'Connection issue'}
        </p>
        <p style={{ fontSize: 12, color: darkMode ? '#b09050' : '#a07800' }}>
          {isWaking
            ? `Free server needs ~30s to start. Auto-retrying in ${countdown}s`
            : 'Check your internet connection'}
        </p>
      </div>
      <button onClick={handleRetry} disabled={retrying}
        className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
        style={{ background: '#c8f135', color: '#111110', border: 'none' }}>
        {retrying ? '…' : 'Retry'}
      </button>
    </div>
  )
}
