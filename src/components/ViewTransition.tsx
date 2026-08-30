import React, { useEffect, useRef, useState } from 'react';
import './ViewTransition.scss';

type TransitionVariant = 'swift' | 'cinematic';

interface ViewTransitionProps {
  /** Changing this value triggers the curtain-wipe transition. */
  viewKey: string;
  children: React.ReactNode;
  /** 'swift' = in-app navigation, 'cinematic' = rare full-stage boot transitions. */
  variant?: TransitionVariant;
}

interface Slot {
  key: string;
  children: React.ReactNode;
}

const EnterCurtain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`vt__enter${open ? ' vt__enter--open' : ''}`}>
      <div className="vt__slot vt__slot--current">{children}</div>
    </div>
  );
};

export const ViewTransition: React.FC<ViewTransitionProps> = ({ viewKey, children, variant = 'swift' }) => {
  const [display, setDisplay] = useState<Slot>({ key: viewKey, children });
  const [exiting, setExiting] = useState<Slot | null>(null);
  const prevKeyRef = useRef(viewKey);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (viewKey === prevKeyRef.current) {
      setDisplay({ key: viewKey, children });
      return;
    }
    setExiting(display);
    setDisplay({ key: viewKey, children });
    prevKeyRef.current = viewKey;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const duration = variant === 'cinematic' ? 920 : 560;
    timeoutRef.current = setTimeout(() => setExiting(null), duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewKey, children, variant]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className={`vt vt--${variant}${exiting ? ' vt--active' : ''}`}>
      {exiting && (
        <div key={`exit-${exiting.key}`} className="vt__slot vt__slot--exiting">
          {exiting.children}
        </div>
      )}
      <EnterCurtain key={`enter-${display.key}`}>{display.children}</EnterCurtain>
      <div className="vt__sweep" aria-hidden="true" />
    </div>
  );
};
