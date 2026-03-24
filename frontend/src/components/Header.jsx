import React from 'react'

export default function Header({ onRefresh, loading, darkMode, onToggleDark }) {
  const bg = darkMode ? '#1a1a18' : '#f4f1ea'
  const border = darkMode ? '#2e2e2a' : '#e5e0d5'
  const text = darkMode ? '#f4f1ea' : '#111110'
  const btn = darkMode ? '#2e2e2a' : '#fff'
  const btnBorder = darkMode ? '#3e3e3a' : '#e5e0d5'

  return (
    <header className="sticky top-0 z-50" style={{ background: bg, borderBottom: `1.5px solid ${border}` }}>
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: '#c8f135', color: '#111110' }}>
            ⚡
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.4px', color: text }}>
            PowerPulse
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: darkMode ? '#2a2a28' : '#111110' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: '#c8f135', display: 'inline-block' }} />
            <span style={{ fontSize: 10, fontFamily: 'DM Mono', fontWeight: 500, letterSpacing: '0.08em', color: '#c8f135' }}>LIVE</span>
          </div>

          <button onClick={onToggleDark}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
            style={{ background: btn, border: `1.5px solid ${btnBorder}` }}
            title="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button onClick={() => onRefresh(true)} disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: btn, border: `1.5px solid ${btnBorder}`, color: loading ? '#9b9589' : text }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
              <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
