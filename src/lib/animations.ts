import anime from 'animejs';

// Check for reduced motion preference
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ─── Page Transitions ───

export const pageEnter = (container: HTMLElement | null) => {
  if (!container || prefersReducedMotion()) return;
  anime({
    targets: container,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 400,
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
};

// ─── Component Entrance ───

export const revealElement = (el: HTMLElement | null) => {
  if (!el || prefersReducedMotion()) {
    if (el) el.style.opacity = '1';
    return;
  }
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 500,
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
};

// ─── Staggered List Animation ───

export const staggerReveal = (elements: HTMLElement[]) => {
  if (!elements.length || prefersReducedMotion()) {
    elements.forEach((el) => (el.style.opacity = '1'));
    return;
  }
  anime({
    targets: elements,
    opacity: [0, 1],
    translateY: [30, 0],
    delay: anime.stagger(80, { start: 0 }),
    duration: 500,
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
};

// ─── Card Hover ───

export const cardHoverIn = (el: HTMLElement) => {
  if (prefersReducedMotion()) return;
  anime({
    targets: el,
    translateY: -4,
    boxShadow: '8px 8px 0px 0px #0f172a',
    duration: 200,
    easing: 'easeOutQuad',
  });
};

export const cardHoverOut = (el: HTMLElement) => {
  if (prefersReducedMotion()) return;
  anime({
    targets: el,
    translateY: 0,
    boxShadow: '4px 4px 0px 0px #0f172a',
    duration: 200,
    easing: 'easeOutQuad',
  });
};

// ─── Button Press ───

export const buttonPress = (el: HTMLElement) => {
  if (prefersReducedMotion()) return;
  anime({
    targets: el,
    translateX: 2,
    translateY: 2,
    boxShadow: '2px 2px 0px 0px #0f172a',
    duration: 80,
    easing: 'easeOutQuad',
    direction: 'alternate',
  });
};

// ─── Modal ───

export const modalEnter = (overlay: HTMLElement | null, content: HTMLElement | null) => {
  if (prefersReducedMotion()) return;
  if (overlay) {
    anime({
      targets: overlay,
      opacity: [0, 1],
      duration: 250,
      easing: 'easeOutQuad',
    });
  }
  if (content) {
    anime({
      targets: content,
      opacity: [0, 1],
      scale: [0.92, 1],
      translateY: [20, 0],
      duration: 350,
      easing: 'cubicBezier(0.16, 1, 0.3, 1)',
    });
  }
};

export const modalExit = (overlay: HTMLElement | null, content: HTMLElement | null): Promise<void> => {
  return new Promise((resolve) => {
    if (prefersReducedMotion() || (!overlay && !content)) {
      resolve();
      return;
    }
    const tl = anime.timeline({ complete: () => resolve() });
    if (content) {
      tl.add({
        targets: content,
        opacity: [1, 0],
        scale: [1, 0.95],
        duration: 200,
        easing: 'easeInQuad',
      }, 0);
    }
    if (overlay) {
      tl.add({
        targets: overlay,
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad',
      }, 0);
    }
  });
};

// ─── Counter Animation ───

export const animateCounter = (el: HTMLElement | null, target: number) => {
  if (!el || prefersReducedMotion()) {
    if (el) el.textContent = String(target);
    return;
  }
  const obj = { value: 0 };
  anime({
    targets: obj,
    value: target,
    duration: 1200,
    easing: 'easeOutExpo',
    update: () => {
      el.textContent = Math.round(obj.value).toLocaleString();
    },
  });
};

// ─── Scroll Reveal (IntersectionObserver based) ───

export const setupScrollReveal = (
  elements: HTMLElement[],
  options?: { threshold?: number; rootMargin?: string }
) => {
  if (prefersReducedMotion()) {
    elements.forEach((el) => (el.style.opacity = '1'));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 600,
            easing: 'cubicBezier(0.16, 1, 0.3, 1)',
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: options?.threshold ?? 0.1,
      rootMargin: options?.rootMargin ?? '0px 0px -50px 0px',
    }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  return () => observer.disconnect();
};

// ─── Navigation Menu ───

export const navSlideIn = (el: HTMLElement | null) => {
  if (!el || prefersReducedMotion()) return;
  anime({
    targets: el,
    translateX: ['100%', '0%'],
    duration: 350,
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
};

export const navSlideOut = (el: HTMLElement | null): Promise<void> => {
  return new Promise((resolve) => {
    if (!el || prefersReducedMotion()) {
      resolve();
      return;
    }
    anime({
      targets: el,
      translateX: ['0%', '100%'],
      duration: 250,
      easing: 'easeInQuad',
      complete: () => resolve(),
    });
  });
};

// ─── Tab Indicator ───

export const tabIndicator = (el: HTMLElement | null, x: number, width: number) => {
  if (!el || prefersReducedMotion()) return;
  anime({
    targets: el,
    translateX: x,
    width: width,
    duration: 300,
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
};

// ─── Loading Skeleton Pulse ───

export const skeletonPulse = (elements: HTMLElement[]) => {
  if (!elements.length || prefersReducedMotion()) return;
  anime({
    targets: elements,
    opacity: [0.4, 0.8, 0.4],
    duration: 1500,
    loop: true,
    easing: 'easeInOutSine',
  });
};

// ─── Export anime for direct use ───
export { anime };
