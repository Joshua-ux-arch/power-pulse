import { useState, useCallback } from 'react'
import { normalizeArea } from '../utils/helpers'

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const detect = useCallback(async (onSuccess, onError) => {
    if (!navigator.geolocation) {
      const msg = 'Geolocation not supported on this device'
      setError(msg)
      onError?.(msg)
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords

          // Use Nominatim with zoom level 16 for street-level detail
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=16&addressdetails=1`
          const res = await fetch(url, {
            headers: {
              'Accept-Language': 'en-US,en',
              'User-Agent': 'PowerPulse-Nigeria/3.0',
            }
          })

          if (!res.ok) throw new Error('Geocoding failed')
          const data = await res.json()
          const addr = data.address || {}

          // Priority: suburb > neighbourhood > quarter > city_district > town > village
          const rawArea =
            addr.suburb ||
            addr.neighbourhood ||
            addr.quarter ||
            addr.city_district ||
            addr.residential ||
            addr.hamlet ||
            addr.town ||
            addr.village ||
            addr.county ||
            null

          const state =
            (addr.state || '').replace(' State', '').trim() || 'Lagos'

          if (!rawArea) throw new Error('Could not identify your area from GPS')

          const area = normalizeArea(rawArea)
          onSuccess({ area, state, accuracy: Math.round(accuracy) })
        } catch (err) {
          const msg = err.message || 'Could not identify location'
          setError(msg)
          onError?.(msg)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setLoading(false)
        let msg = 'Location error'
        if (err.code === 1) msg = 'Location access denied. Please allow location or search manually.'
        else if (err.code === 2) msg = 'GPS signal unavailable. Try moving outdoors.'
        else if (err.code === 3) msg = 'Location request timed out.'
        setError(msg)
        onError?.(msg)
      },
      {
        enableHighAccuracy: true,  // uses GPS not IP
        timeout: 12000,
        maximumAge: 60000,         // cache for 1 min only
      }
    )
  }, [])

  return { detect, loading, error, setError }
}
