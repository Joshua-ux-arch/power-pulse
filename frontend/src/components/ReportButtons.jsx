import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { shareOnWhatsApp } from '../utils/helpers'

export default function ReportButtons({ area, state, onSubmit }) {
  const [submitting, setSubmitting] = useState(null)
  const [lastReport, setLastReport] = useState(null)

  const handle = async (status) => {
    if (!area) {
      toast('Set your area first', {
        icon: '📍',
        style: { background: '#0d0d0d', color: '#f5f2eb', fontFamily: 'DM Sans', borderRadius: 12 }
      })
      return
    }
    setSubmitting(status)
    const result = await onSubmit(area, state || 'Lagos', status)
    setSubmitting(null)

    if (result.success) {
      setLastReport({ area, status })
      toast(status === 'on' ? `💡 Light On reported for ${area}` : `🌑 No Light reported for ${area}`, {
        style: {
          background: status === 'on' ? '#d4f000' : '#ff4d2e',
          color: status === 'on' ? '#0d0d0d' : '#fff',
          fontFamily: 'DM Sans', fontWeight: 600, borderRadius: 12,
        }
      })
    } else {
      toast.error(result.error || 'Failed. Try again.', {
        style: { background: '#0d0d0d', color: '#f5f2eb', fontFamily: 'DM Sans', borderRadius: 12 }
      })
    }
  }

  return (
    <div className="mb-5">
      <p style={{ fontSize: 11, fontFamily: 'DM Mono', color: '#8a8478', letterSpacing: '0.08em', marginBottom: 10 }}>
        REPORT YOUR STATUS
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Light On */}
        <button
          onClick={() => handle('on')}
          disabled={!!submitting}
          className="relative flex flex-col items-start justify-between p-4 rounded-2xl transition-all duration-150 active:scale-95"
          style={{
            background: submitting === 'on' ? '#d4f000' : '#fff',
            border: '1.5px solid',
            borderColor: submitting === 'on' ? '#d4f000' : '#e8e4da',
            minHeight: 110,
            opacity: submitting && submitting !== 'on' ? 0.4 : 1,
          }}
          onMouseEnter={e => { if (!submitting) { e.currentTarget.style.borderColor = '#d4f000'; e.currentTarget.style.background = '#fafff0' }}}
          onMouseLeave={e => { if (!submitting) { e.currentTarget.style.borderColor = '#e8e4da'; e.currentTarget.style.background = '#fff' }}}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>💡</span>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0d0d0d', marginBottom: 1 }}>
              {submitting === 'on' ? 'Reporting…' : 'Light On'}
            </p>
            <p style={{ fontSize: 11, color: '#8a8478', fontFamily: 'DM Mono' }}>Power available</p>
          </div>
        </button>

        {/* No Light */}
        <button
          onClick={() => handle('off')}
          disabled={!!submitting}
          className="relative flex flex-col items-start justify-between p-4 rounded-2xl transition-all duration-150 active:scale-95"
          style={{
            background: submitting === 'off' ? '#ff4d2e' : '#fff',
            border: '1.5px solid',
            borderColor: submitting === 'off' ? '#ff4d2e' : '#e8e4da',
            minHeight: 110,
            opacity: submitting && submitting !== 'off' ? 0.4 : 1,
          }}
          onMouseEnter={e => { if (!submitting) { e.currentTarget.style.borderColor = '#ff4d2e'; e.currentTarget.style.background = '#fff8f7' }}}
          onMouseLeave={e => { if (!submitting) { e.currentTarget.style.borderColor = '#e8e4da'; e.currentTarget.style.background = '#fff' }}}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>🌑</span>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: submitting === 'off' ? '#fff' : '#0d0d0d', marginBottom: 1 }}>
              {submitting === 'off' ? 'Reporting…' : 'No Light'}
            </p>
            <p style={{ fontSize: 11, color: submitting === 'off' ? 'rgba(255,255,255,0.7)' : '#8a8478', fontFamily: 'DM Mono' }}>
              NEPA took light
            </p>
          </div>
        </button>
      </div>

      {/* Update hint */}
      <p style={{ fontSize: 12, color: '#8a8478', textAlign: 'center' }}>
        Already reported? Submit again to update your area's status.
      </p>

      {/* WhatsApp share */}
      {lastReport && (
        <button
          onClick={() => shareOnWhatsApp(lastReport.area, lastReport.status)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
          style={{ background: '#25d366', color: '#fff', border: 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.522 5.85L0 24l6.335-1.482A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.016-1.376l-.36-.214-3.727.872.938-3.63-.235-.374A9.77 9.77 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
          Share Update on WhatsApp
        </button>
      )}
    </div>
  )
}
