import { useEffect, useRef } from 'react';
import { setupScrollReveal } from '../lib/animations';

export function useScrollReveal(options?: { threshold?: number; rootMargin?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-reveal]')
    );

    const cleanup = setupScrollReveal(elements, options);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [options?.threshold, options?.rootMargin]);

  return containerRef;
}
