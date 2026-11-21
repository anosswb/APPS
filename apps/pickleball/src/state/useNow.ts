import { useEffect, useState } from 'react';

/** The current time, refreshed every `everyMs`, for "waited 9 min" and game clocks. */
export function useNow(everyMs = 20000): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
}

export const minutesSince = (from: number, now: number) => Math.max(0, Math.floor((now - from) / 60000));
