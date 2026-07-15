import { useEffect, useState } from 'react';

/** Real on-device storage usage/quota via the Storage Manager API. */
export function useStorageEstimate() {
  const [state, setState] = useState({ status: 'loading', usedGB: null, quotaGB: null });

  useEffect(() => {
    if (!navigator.storage?.estimate) {
      setState({ status: 'unsupported', usedGB: null, quotaGB: null });
      return;
    }
    navigator.storage.estimate().then(({ usage, quota }) => {
      setState({
        status: 'success',
        usedGB: +(usage / 1e9).toFixed(2),
        quotaGB: +(quota / 1e9).toFixed(1),
      });
    });
  }, []);

  return state;
}
