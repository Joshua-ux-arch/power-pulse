import React from 'react'

export default function Header({ onRefresh, loading }) {
  return (
    <header style={{ background: '#f5f2eb', borderBottom: '1.5px solid #e0dbd0' }}
      className="sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: '#d4f000', fontWeight: 800 }}>
            ⚡
          </div>
          <span style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px', color: '#0d0d0d' }}>
            PowerPulse
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Live pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: '#0d0d0d', color: '#d4f000' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: '#d4f000' }} />
            <span style={{ fontSize: 11, fontFamily: 'DM Mono', fontWeight: 500, letterSpacing: '0.05em' }}>LIVE</span>
          </div>

          {/* Refresh */}
          <button onClick={() => onRefresh(true)} disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: '#fff', border: '1.5px solid #e0dbd0', color: loading ? '#c4bfb5' : '#8a8478' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
