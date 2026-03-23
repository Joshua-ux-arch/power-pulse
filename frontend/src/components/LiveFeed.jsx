import React from 'react'
import { timeAgo, shareOnWhatsApp } from '../utils/helpers'

export default function LiveFeed({ reports, filterArea, onFilterChange, onUpvote, votedIds }) {
  const areas = [...new Set(reports.map(r => r.area))].slice(0, 8)
  const filtered = filterArea
    ? reports.filter(r => r.area.toLowerCase() === filterArea.toLowerCase())
    : reports

  return (
    <div className="mb-24">
      <div className="flex items-center justify-between mb-3">
        <p style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#8a8478', letterSpacing: '0.08em' }}>
          LIVE FEED
        </p>
        <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#c4bfb5' }}>
          {filtered.length} reports
        </span>
      </div>

      {/* Filter chips */}
      {areas.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
          {['All', ...areas].map(a => {
            const active = a === 'All' ? !filterArea : filterArea === a
            return (
              <button key={a}
                onClick={() => onFilterChange(a === 'All' ? '' : (filterArea === a ? '' : a))}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: active ? '#0d0d0d' : '#fff',
                  color: active ? '#f5f2eb' : '#8a8478',
                  border: `1.5px solid ${active ? '#0d0d0d' : '#e0dbd0'}`,
                }}>
                {a}
              </button>
            )
          })}
        </div>
      )}

      {/* Feed items */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center rounded-2xl" style={{ background: '#fff', border: '1.5px solid #e8e4da' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
            <p style={{ fontSize: 14, color: '#8a8478' }}>No reports yet.</p>
            <p style={{ fontSize: 13, color: '#c4bfb5' }}>Be the first to report your area.</p>
          </div>
        ) : (
          filtered.slice(0, 40).map(report => {
            const isOn = report.status === 'on'
            const voted = votedIds.includes(report._id)
            return (
              <div key={report._id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl animate-slide-up"
                style={{ background: '#fff', border: '1.5px solid #e8e4da' }}>

                {/* Status indicator */}
                <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: isOn ? '#d4f000' : '#fff0ee' }}>
                  <span style={{ fontSize: 15 }}>{isOn ? '💡' : '🌑'}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0d0d0d' }} className="truncate">
                    {report.area}
                    {report.state && report.state !== 'Lagos' && (
                      <span style={{ fontSize: 12, color: '#8a8478', fontWeight: 400 }}>, {report.state}</span>
                    )}
                  </p>
                  <p style={{ fontSize: 11, color: '#8a8478', fontFamily: 'DM Mono' }}>
                    {isOn ? 'Light On' : 'No Light'} · {timeAgo(report.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Upvote */}
                  <button onClick={() => onUpvote(report._id)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-mono font-medium transition-all active:scale-95"
                    style={{
                      background: voted ? '#0d0d0d' : '#f5f2eb',
                      color: voted ? '#d4f000' : '#8a8478',
                      border: `1px solid ${voted ? '#0d0d0d' : '#e0dbd0'}`,
                    }}
                    title="Confirm this report">
                    <svg width="10" height="10" viewBox="0 0 24 24"
                      fill={voted ? 'currentColor' : 'none'}
                      stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 19V6M5 13l7-7 7 7"/>
                    </svg>
                    {report.votes}
                  </button>

                  {/* Share */}
                  <button onClick={() => shareOnWhatsApp(report.area, report.status)}
                    className="w-7 h-7 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(37,211,102,0.08)', color: '#25d366' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.522 5.85L0 24l6.335-1.482A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.016-1.376l-.36-.214-3.727.872.938-3.63-.235-.374A9.77 9.77 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
