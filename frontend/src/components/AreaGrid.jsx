import React, { useState } from 'react'
import { shareOnWhatsApp, timeAgo } from '../utils/helpers'

export default function AreaGrid({ areaSummary }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? areaSummary : areaSummary.slice(0, 8)

  if (!areaSummary.length) return null

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <p style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#8a8478', letterSpacing: '0.08em' }}>
          AREA STATUS
        </p>
        <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#c4bfb5' }}>
          {areaSummary.length} areas active
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {displayed.map(a => {
          const isOn = a.status === 'on'
          return (
            <div key={a.area}
              className="flex items-center justify-between px-4 py-3 rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid #e8e4da' }}>

              <div className="flex items-center gap-3">
                {/* Status dot */}
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: isOn ? '#d4f000' : '#ff4d2e',
                    boxShadow: isOn ? '0 0 0 3px rgba(212,240,0,0.2)' : '0 0 0 3px rgba(255,77,46,0.15)',
                  }} />

                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0d0d0d' }}>{a.area}</p>
                  <p style={{ fontSize: 11, color: '#8a8478', fontFamily: 'DM Mono' }}>
                    {a.totalReports} report{a.totalReports !== 1 ? 's' : ''}
                    {a.totalReports >= 5 && ' 🔥'}
                    {a.lastReport && ` · ${timeAgo(a.lastReport)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="tag"
                  style={{
                    background: isOn ? '#d4f000' : '#ff4d2e',
                    color: isOn ? '#3a7000' : '#fff',
                    fontSize: 11,
                  }}>
                  {isOn ? '⚡ ON' : '❌ OFF'}
                </span>
                <button onClick={() => shareOnWhatsApp(a.area, a.status)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{ background: 'rgba(37,211,102,0.08)', color: '#25d366' }}
                  title="Share on WhatsApp">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.522 5.85L0 24l6.335-1.482A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.016-1.376l-.36-.214-3.727.872.938-3.63-.235-.374A9.77 9.77 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {areaSummary.length > 8 && (
        <button onClick={() => setShowAll(!showAll)}
          className="mt-2 w-full py-3 rounded-2xl text-sm font-medium transition-all"
          style={{ background: '#fff', border: '1.5px solid #e8e4da', color: '#8a8478' }}>
          {showAll ? 'Show less' : `Show ${areaSummary.length - 8} more areas`}
        </button>
      )}
    </div>
  )
}
