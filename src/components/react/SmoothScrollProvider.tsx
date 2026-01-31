import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

interface Props {
  children: ReactNode;
}

/**
 * SmoothScrollProvider - Wraps children with Lenis smooth scrolling
 *
 * Lenis provides buttery-smooth scroll experience for parallax effects.
 * Initializes on mount and cleans up on unmount.
 */
export default function SmoothScrollProvider({ children }: Props) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
