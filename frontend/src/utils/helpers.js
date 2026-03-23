export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function shareOnWhatsApp(area, status) {
  const emoji = status === 'on' ? '⚡' : '❌'
  const text = `${emoji} Power Update — ${area}\n${status === 'on' ? 'Light is ON right now' : 'No light currently'}\n\nCheck your area: https://powerpulse.ng`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

export const LAGOS_AREAS = [
  'Lekki Phase 1', 'Lekki Phase 2', 'Lekki', 'Ajah', 'Chevron',
  'Yaba', 'Surulere', 'Ikeja', 'Victoria Island', 'Ikoyi',
  'Gbagada', 'Ojodu', 'Festac', 'Maryland', 'Agege',
  'Magodo', 'Ikorodu', 'Apapa', 'Shomolu', 'Mushin',
  'Oshodi', 'Ogba', 'Ketu', 'Alapere', 'Ogudu',
  'Mile 2', 'Satellite Town', 'Ajegunle', 'Palmgroove',
  'Anthony Village', 'Ojota', 'Isale Eko', 'Badagry',
  'Sangotedo', 'Awoyaya', 'Igbo Efon', 'Eti Osa',
  'Abule Egba', 'Ipaja', 'Alimosho', 'Egbeda',
]

// Nigerian LGAs + common area names for better matching
export const AREA_ALIASES = {
  'lekki 1': 'Lekki Phase 1',
  'lekki 2': 'Lekki Phase 2',
  'vi': 'Victoria Island',
  'v.i': 'Victoria Island',
  'v.i.': 'Victoria Island',
}

export function normalizeArea(raw) {
  if (!raw) return raw
  const lower = raw.toLowerCase().trim()
  return AREA_ALIASES[lower] || raw.trim()
}
