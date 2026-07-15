import { useEffect, useState } from 'react';

/**
 * Real device location via the browser Geolocation API, reverse-geocoded
 * to a human-readable place name using BigDataCloud's free, key-less
 * reverse-geocode endpoint (client-side, no server round trip).
 */
export function useGeolocation() {
  const [state, setState] = useState({
    status: 'idle', // idle | loading | success | error | denied
    lat: null,
    lng: null,
    accuracy: null,
    place: null,
    error: null,
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, status: 'error', error: 'Geolocation not supported on this device' }));
      return;
    }

    setState((s) => ({ ...s, status: 'loading' }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setState((s) => ({ ...s, status: 'success', lat: latitude, lng: longitude, accuracy }));

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const place = [data.city || data.locality, data.principalSubdivision, data.countryName]
            .filter(Boolean)
            .join(', ');
          setState((s) => ({ ...s, place }));
        } catch {
          // reverse geocode is best-effort; coordinates already available
        }
      },
      (err) => {
        setState((s) => ({
          ...s,
          status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error',
          error: err.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return state;
}
