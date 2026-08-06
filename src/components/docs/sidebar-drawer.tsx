'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import styles from './sidebar-drawer.module.css';

/* Narrow-viewport docs navigation: a hamburger in the nav that opens the
   same sidebar tree in a fixed left panel. Hidden above 768px. */
const SidebarDrawer = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const { style } = document.documentElement;
    const previousOverflow = style.overflow;
    style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label="Open docs navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>
      {open ? (
        <div
          className={`dialog-backdrop ${styles.scrim}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <nav className={styles.panel} aria-label="Docs navigation">
            {children}
          </nav>
        </div>
      ) : null}
    </>
  );
};

export default SidebarDrawer;
