import React, { useState, useRef, useEffect } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { LAGOS_AREAS } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function HeroLocation({ area, state, areaStatus, onLocationChange }) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)
  const { detect, loading: geoLoading } = useGeolocation()

  useEffect(() => {
    if (editing) setTimeout(() => inputRef.current?.focus(), 50)
  }, [editing])

  const handleInput = (val) => {
    setInput(val)
    setSuggestions(
      val.length > 0
        ? LAGOS_AREAS.filter(a => a.toLowerCase().includes(val.toLowerCase())).slice(0, 5)
        : LAGOS_AREAS.slice(0, 5)
    )
  }

  const select = (a) => {
    onLocationChange({ area: a, state: state || 'Lagos' })
    setEditing(false); setInput(''); setSuggestions([])
  }

  const handleDetect = () => {
    detect(
      ({ area: a, state: s, accuracy }) => {
        onLocationChange({ area: a, state: s })
        setEditing(false)
        toast.success(`📍 Detected: ${a}, ${s} (±${accuracy}m)`, { duration: 3000 })
      },
      (err) => toast.error(err, { duration: 4000 })
    )
  }

  const currentStatus = areaStatus?.status || null

  return (
    <div className="mb-5">
      {/* Area status hero block */}
      <div className="rounded-3xl overflow-hidden mb-3" style={{
        background: currentStatus === 'on' ? '#d4f000' : currentStatus === 'off' ? '#ff4d2e' : '#0d0d0d',
        transition: 'background 0.4s ease',
      }}>
        <div className="px-5 pt-5 pb-4">
          {/* Area name */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p style={{
                fontSize: 11, fontFamily: 'DM Mono', fontWeight: 500, letterSpacing: '0.08em',
                color: currentStatus === 'on' ? '#5a6600' : currentStatus === 'off' ? 'rgba(255,255,255,0.7)' : 'rgba(245,242,235,0.5)',
                marginBottom: 4,
              }}>YOUR AREA</p>
              <button onClick={() => { setEditing(true); handleInput('') }}
                className="flex items-center gap-2 group">
                <h1 style={{
                  fontSize: area ? 28 : 22, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.1,
                  color: currentStatus === 'on' ? '#0d0d0d' : '#f5f2eb',
                }}>
                  {area || 'Set your area'}
                </h1>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ color: currentStatus === 'on' ? '#5a6600' : 'rgba(245,242,235,0.5)', marginTop: 2 }}>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              {state && area && (
                <p style={{ fontSize: 13, color: currentStatus === 'on' ? '#5a6600' : 'rgba(245,242,235,0.6)', marginTop: 2 }}>
                  {state} State
                </p>
              )}
            </div>

            {/* Status icon */}
            <div className="text-4xl" style={{ lineHeight: 1, marginTop: 4 }}>
              {currentStatus === 'on' ? '💡' : currentStatus === 'off' ? '🌑' : '❓'}
            </div>
          </div>

          {/* Status text */}
          <div className="flex items-center justify-between">
            <div>
              <p style={{
                fontSize: 32, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1,
                color: currentStatus === 'on' ? '#0d0d0d' : '#f5f2eb',
              }}>
                {!area ? '—' : currentStatus === 'on' ? 'Light On' : currentStatus === 'off' ? 'No Light' : 'Unknown'}
              </p>
              {areaStatus && (
                <p style={{ fontSize: 12, marginTop: 4, color: currentStatus === 'on' ? '#5a6600' : 'rgba(245,242,235,0.6)' }}>
                  {areaStatus.totalReports} report{areaStatus.totalReports !== 1 ? 's' : ''} · {areaStatus.confidence}% confidence
                </p>
              )}
            </div>

            {/* Detect location btn */}
            <button onClick={handleDetect} disabled={geoLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{
                background: currentStatus === 'on' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)',
                color: currentStatus === 'on' ? '#0d0d0d' : '#f5f2eb',
                border: 'none',
              }}>
              {geoLoading ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
                </svg>
              )}
              {geoLoading ? 'Detecting...' : 'Detect'}
            </button>
          </div>
        </div>
      </div>

      {/* Location search dropdown */}
      {editing && (
        <div className="card-surface p-4 animate-slide-up">
          <p style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#8a8478', marginBottom: 10, letterSpacing: '0.06em' }}>
            SEARCH AREA
          </p>
          <div className="relative">
            <input ref={inputRef} value={input} onChange={e => handleInput(e.target.value)}
              placeholder="Type area name..."
              className="w-full px-4 py-3 rounded-2xl text-sm font-medium"
              style={{ background: '#f5f2eb', border: '1.5px solid #e0dbd0', color: '#0d0d0d' }}
              onFocus={() => { if (!input) handleInput('') }}
            />
            {input && (
              <button onClick={() => { setInput(''); setSuggestions(LAGOS_AREAS.slice(0, 5)) }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#c4bfb5' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-col gap-0.5">
              {suggestions.map(s => (
                <button key={s} onClick={() => select(s)}
                  className="text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ color: '#0d0d0d' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f2eb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button onClick={handleDetect} disabled={geoLoading}
              className="btn-ink flex-1 py-2.5 text-sm gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
              </svg>
              {geoLoading ? 'Detecting...' : 'Use GPS'}
            </button>
            <button onClick={() => { setEditing(false); setInput(''); setSuggestions([]) }}
              className="btn-ghost px-5 py-2.5 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
