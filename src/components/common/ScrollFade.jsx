import { useEffect, useRef } from 'react';

/** Observe once. CSS owns the GPU-composited opacity + transform reveal. */
export default function ScrollFade({ as: Element = 'div', children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('is-in-view');
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add('is-in-view');
      observer.unobserve(element);
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <Element {...props} ref={ref} data-scroll-fade>{children}</Element>;
}
