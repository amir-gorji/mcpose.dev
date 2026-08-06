'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './search-trigger.module.css';

// Loaded on first open, so no dialog/pagefind JS ships until the user shows intent.
const SearchDialog = dynamic(() => import('./search-dialog'), { ssr: false });

const SearchTrigger = () => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 16 16"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="4.25" />
          <path d="M10.2 10.2 14 14" strokeLinecap="round" />
        </svg>
        <span className={styles.label}>Search docs…</span>
        <span className={styles.keycap}>⌘K</span>
      </button>
      {open ? <SearchDialog onClose={handleClose} /> : null}
    </>
  );
};

export default SearchTrigger;
