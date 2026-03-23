import React from 'react'

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      {[
        { value: stats.areasOn ?? 0, label: 'Areas ON', color: '#3a7000', bg: '#d4f000' },
        { value: stats.areasOff ?? 0, label: 'Areas OFF', color: '#fff', bg: '#ff4d2e' },
        { value: stats.last24h ?? 0, label: 'Reports today', color: '#0d0d0d', bg: '#fff', border: '1.5px solid #e8e4da' },
      ].map(item => (
        <div key={item.label}
          className="rounded-2xl px-3 py-3 flex flex-col gap-0.5"
          style={{ background: item.bg, border: item.border || 'none' }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px', color: item.color, lineHeight: 1 }}>
            {item.value.toLocaleString()}
          </span>
          <span style={{ fontSize: 10, fontFamily: 'DM Mono', color: item.color, opacity: 0.7, letterSpacing: '0.04em' }}>
            {item.label.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  )
}
