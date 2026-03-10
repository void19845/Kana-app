import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  seconds:   number;
  enabled:   boolean;
  onExpire:  () => void;
}

interface UseTimerReturn {
  remaining:   number;       // secondes restantes
  fraction:    number;       // 0 → 1 (pour l'anneau SVG)
  colorVar:    string;       // variable CSS selon urgence
  reset:       () => void;
  stop:        () => void;
}

export function useTimer({ seconds, enabled, onExpire }: UseTimerOptions): UseTimerReturn {
  const [remaining, setRemaining] = useState(seconds);
  const tickRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const stop = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const reset = useCallback(() => {
    stop();
    expiredRef.current = false;
    setRemaining(seconds);
    if (!enabled) return;
    tickRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(tickRef.current!);
          tickRef.current = null;
          if (!expiredRef.current) {
            expiredRef.current = true;
            // Defer callback to avoid setState-in-render
            setTimeout(() => onExpireRef.current(), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds, enabled, stop]);

  // Reset automatique quand les options changent
  useEffect(() => { reset(); return stop; }, [reset, stop]);

  const fraction  = remaining / seconds;
  const colorVar  = fraction > 0.5 ? 'var(--timer-ok)' : fraction > 0.25 ? 'var(--timer-warn)' : 'var(--timer-danger)';

  return { remaining, fraction, colorVar, reset, stop };
}
