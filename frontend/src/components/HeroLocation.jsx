import React, { useState, useRef, useEffect } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { LAGOS_AREAS } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function HeroLocation({ area, state, areaStatus, onLocationChange, darkMode }) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)
  const { detect, loading: geoLoading } = useGeolocation()

  useEffect(() => {
    if (editing) setTimeout(() => inputRef.current?.focus(), 60)
  }, [editing])

  const handleInput = (val) => {
    setInput(val)
    const q = val.toLowerCase()
    setSuggestions(
      val.length === 0
        ? LAGOS_AREAS.slice(0, 6)
        : LAGOS_AREAS.filter(a => a.toLowerCase().includes(q)).slice(0, 6)
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
        toast.success(`📍 ${a}, ${s} (±${accuracy}m)`, {
          style: { background: '#111110', color: '#c8f135', fontFamily: 'DM Sans', borderRadius: 12 }
        })
      },
      (err) => toast.error(err, {
        style: { background: '#111110', color: '#ff4422', fontFamily: 'DM Sans', borderRadius: 12 }
      })
    )
  }

  const isOn = areaStatus?.status === 'on'
  const isOff = areaStatus?.status === 'off'
  const hasStatus = isOn || isOff

  const heroBg = isOn ? '#c8f135' : isOff ? '#ff4422' : (darkMode ? '#2a2a28' : '#111110')
  const heroText = isOn ? '#111110' : '#f4f1ea'
  const heroMuted = isOn ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.55)'

  return (
    <div className="mb-5">
      {/* Hero block */}
      <div className="rounded-3xl overflow-hidden mb-3 transition-all duration-500" style={{ background: heroBg }}>
        <div className="px-5 pt-5 pb-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p style={{ fontSize: 10, fontFamily: 'DM Mono', letterSpacing: '0.1em', color: heroMuted, marginBottom: 5 }}>
                YOUR AREA
              </p>
              <button onClick={() => { setEditing(true); handleInput('') }}
                className="flex items-center gap-2 group active:scale-95 transition-transform">
                <h1 style={{ fontSize: area ? 26 : 20, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.15, color: heroText }}>
                  {area || 'Set your area →'}
                </h1>
                {area && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={heroMuted} strokeWidth="2.5" style={{ marginTop: 2, flexShrink: 0 }}>
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                )}
              </button>
              {state && area && (
                <p style={{ fontSize: 13, color: heroMuted, marginTop: 3 }}>{state} State</p>
              )}
            </div>
            <div style={{ fontSize: 36, lineHeight: 1, marginTop: 2 }}>
              {!area ? '📍' : isOn ? '💡' : isOff ? '🌑' : '❓'}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1, color: heroText }}>
                {!area ? '—' : isOn ? 'Light On' : isOff ? 'No Light' : 'Unknown'}
              </p>
              {areaStatus && (
                <p style={{ fontSize: 11, fontFamily: 'DM Mono', color: heroMuted, marginTop: 4 }}>
                  {areaStatus.totalReports} reports · {areaStatus.confidence}% confident
                  {areaStatus.totalReports >= 5 && ' 🔥'}
                </p>
              )}
            </div>

            <button onClick={handleDetect} disabled={geoLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.15)', color: heroText, border: 'none', backdropFilter: 'blur(4px)' }}>
              {geoLoading ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
                </svg>
              )}
              {geoLoading ? 'Detecting…' : 'Detect'}
            </button>
          </div>
        </div>
      </div>

      {/* Search panel */}
      {editing && (
        <div className="rounded-2xl p-4 animate-slide-up"
          style={{ background: darkMode ? '#1e1e1c' : '#fff', border: `1.5px solid ${darkMode ? '#2e2e2a' : '#e5e0d5'}` }}>
          <p style={{ fontSize: 10, fontFamily: 'DM Mono', letterSpacing: '0.1em', color: '#9b9589', marginBottom: 10 }}>
            SEARCH AREA
          </p>
          <input ref={inputRef} value={input} onChange={e => handleInput(e.target.value)}
            placeholder="Type area name..."
            className="w-full px-4 py-3 rounded-2xl text-sm font-medium mb-2"
            style={{
              background: darkMode ? '#111110' : '#f4f1ea',
              border: `1.5px solid ${darkMode ? '#2e2e2a' : '#e5e0d5'}`,
              color: darkMode ? '#f4f1ea' : '#111110',
            }}
            onFocus={() => { if (!input) handleInput('') }}
          />
          {suggestions.length > 0 && (
            <div className="flex flex-col mb-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => select(s)}
                  className="text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ color: darkMode ? '#f4f1ea' : '#111110' }}
                  onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#2a2a28' : '#f4f1ea'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleDetect} disabled={geoLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: '#111110', color: '#c8f135', border: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
              </svg>
              {geoLoading ? 'Detecting…' : 'Use GPS'}
            </button>
            <button onClick={() => { setEditing(false); setInput(''); setSuggestions([]) }}
              className="px-5 py-2.5 rounded-2xl text-sm font-medium transition-all"
              style={{ background: 'transparent', border: `1.5px solid ${darkMode ? '#2e2e2a' : '#e5e0d5'}`, color: '#9b9589' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
