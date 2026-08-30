import React, { useEffect, useRef } from 'react';
import './GlobalCursor.scss';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor="grow"]';

export const GlobalCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => ring.classList.add('gc-ring--grow');
    const onLeave = () => ring.classList.remove('gc-ring--grow');
    const onDown = () => ring.classList.add('gc-ring--press');
    const onUp = () => ring.classList.remove('gc-ring--press');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    tick();

    const attach = () => {
      document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR).forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();

    let debounce: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(attach, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR).forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="gc-dot" ref={dotRef} aria-hidden="true" />
      <div className="gc-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
};
