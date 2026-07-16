import { useEffect, useState } from 'react';

/**
 * Real battery status via the Battery Status API. Supported in
 * Chromium-based browsers; falls back to 'unsupported' elsewhere (notably
 * Firefox and Safari, which removed the API for fingerprinting reasons).
 */
export function useBattery() {
  const [state, setState] = useState({ status: 'loading', level: null, charging: null });

  useEffect(() => {
    if (!('getBattery' in navigator)) {
      setState({ status: 'unsupported', level: null, charging: null });
      return;
    }

    let battery;
    const update = () => {
      setState({
        status: 'success',
        level: Math.round(battery.level * 100),
        charging: battery.charging,
      });
    };

    navigator.getBattery().then((b) => {
      battery = b;
      update();
      battery.addEventListener('levelchange', update);
      battery.addEventListener('chargingchange', update);
    });

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', update);
        battery.removeEventListener('chargingchange', update);
      }
    };
  }, []);

  return state;
}
