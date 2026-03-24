import React from 'react'

export default function StatsBar({ stats, darkMode }) {
  const card = darkMode ? '#1e1e1c' : '#fff'
  const border = darkMode ? '#2e2e2a' : '#e5e0d5'
  const text = darkMode ? '#f4f1ea' : '#111110'
  const muted = darkMode ? '#6b6b65' : '#9b9589'

  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      <div className="rounded-2xl p-3" style={{ background: '#c8f135' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px', color: '#111110', lineHeight: 1 }}>
          {(stats.areasOn ?? 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 9, fontFamily: 'DM Mono', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.06em', marginTop: 3 }}>
          AREAS ON
        </div>
      </div>

      <div className="rounded-2xl p-3" style={{ background: '#ff4422' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px', color: '#fff', lineHeight: 1 }}>
          {(stats.areasOff ?? 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 9, fontFamily: 'DM Mono', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', marginTop: 3 }}>
          AREAS OFF
        </div>
      </div>

      <div className="rounded-2xl p-3" style={{ background: card, border: `1.5px solid ${border}` }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px', color: text, lineHeight: 1 }}>
          {(stats.last24h ?? 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 9, fontFamily: 'DM Mono', color: muted, letterSpacing: '0.06em', marginTop: 3 }}>
          TODAY
        </div>
      </div>
    </div>
  )
}
