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
  const text = `${emoji} Power Update — ${area}\n${status === 'on' ? 'Light is ON right now' : 'No light currently'}\n\nCheck your area 👉 https://power-pulse-nine.vercel.app`
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
  'Sangotedo', 'Awoyaya', 'Igbo Efon', 'Abule Egba',
  'Ipaja', 'Alimosho', 'Egbeda', 'Dopemu', 'Pen Cinema',
  'Iju', 'Ifako', 'Agboville', 'Berger', 'Oregun',
]
