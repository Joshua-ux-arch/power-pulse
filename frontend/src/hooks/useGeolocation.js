import { useState, useCallback } from 'react'

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const detect = useCallback(async (onSuccess, onError) => {
    if (!navigator.geolocation) {
      const msg = 'GPS not supported on this device'
      setError(msg); onError?.(msg); return
    }
    setLoading(true); setError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude, accuracy } = pos.coords
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=16&addressdetails=1`
          const res = await fetch(url, { headers: { 'Accept-Language': 'en-US,en' } })
          if (!res.ok) throw new Error('Reverse geocoding failed')
          const data = await res.json()
          const addr = data.address || {}
          const area =
            addr.suburb || addr.neighbourhood || addr.quarter ||
            addr.city_district || addr.residential || addr.town ||
            addr.village || addr.county || null
          if (!area) throw new Error('Could not identify your area. Try typing it manually.')
          const state = (addr.state || 'Lagos').replace(' State', '').trim()
          onSuccess({ area, state, accuracy: Math.round(accuracy) })
        } catch (err) {
          setError(err.message); onError?.(err.message)
        } finally { setLoading(false) }
      },
      (err) => {
        setLoading(false)
        const msgs = { 1: 'Location denied. Please type your area.', 2: 'GPS unavailable. Try outdoors.', 3: 'Location timed out.' }
        const msg = msgs[err.code] || 'Location error'
        setError(msg); onError?.(msg)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  }, [])

  return { detect, loading, error, setError }
}
