import { useEffect, useState } from 'react';

const WEATHER_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
};

/**
 * Real current-weather data from Open-Meteo — a free, key-less API — for
 * the given coordinates.
 */
export function useWeather(lat, lng) {
  const [state, setState] = useState({ status: 'idle', temp: null, condition: null, error: null });

  useEffect(() => {
    if (lat == null || lng == null) return;
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const c = data.current;
        setState({
          status: 'success',
          temp: Math.round(c.temperature_2m),
          condition: WEATHER_CODES[c.weather_code] || 'Unknown',
          humidity: c.relative_humidity_2m,
          wind: c.wind_speed_10m,
          error: null,
        });
      })
      .catch((err) => {
        if (!cancelled) setState((s) => ({ ...s, status: 'error', error: err.message }));
      });

    return () => { cancelled = true; };
  }, [lat, lng]);

  return state;
}
