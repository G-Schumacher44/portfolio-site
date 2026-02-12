import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useCountUp(
  target: number,
  duration = 2000,
  startOnView = true
): { value: number; ref: React.RefObject<HTMLElement | null> } {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const hasStarted = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }

    if (!startOnView) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();

    function animate() {
      const start = performance.now();

      function step(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }
  }, [target, duration, startOnView, reduced]);

  return { value, ref };
}
