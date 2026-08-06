'use client';

import { usePathname } from 'next/navigation';
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

  /* Client-side navigations through a sidebar link change the page
     underneath while the drawer, scrim, and scroll-lock stay active.
     The lint rule flags `close()` inside an effect only because close is
     a useCallback (which itself calls setState) — lifting the underlying
     action directly satisfies it. */
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (open && pathname !== previousPathname.current) {
      setOpen(false);
      triggerRef.current?.focus();
    }
    previousPathname.current = pathname;
  }, [pathname, open]);

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
