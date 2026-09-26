'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

import Logo from '@/components/logo';
import SearchTrigger from '@/components/search/search-trigger';
import ThemeToggle from '@/components/theme-toggle';
import { SITE } from '@/lib/site';

import styles from './nav.module.css';

type NavProps = {
  maxWidth?: number;
  current?: 'docs' | 'examples';
  menuSlot?: ReactNode;
};

export default function Nav({ maxWidth = 1248, current, menuSlot }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={styles.nav}>
      <div className={styles.inner} style={{ maxWidth }}>
        <div className={styles.brandGroup}>
          {menuSlot}
          <Link href="/" className={styles.brand} aria-label="mcpose home">
            <Logo size="nav" />
            <span>mcpose</span>
          </Link>
        </div>

        <nav aria-label="Primary" className={styles.linkGroup}>
          <SearchTrigger />
          <Link
            href="/docs/v3/"
            className={`${styles.link} ${styles.desktopOnly} ${current === 'docs' ? styles.linkCurrent : ''}`}
            aria-current={current === 'docs' ? 'page' : undefined}
          >
            Documentation
          </Link>
          <Link
            href="/#explore"
            className={`${styles.link} ${styles.desktopOnly} ${current === 'examples' ? styles.linkCurrent : ''}`}
          >
            Examples
          </Link>
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className={`${styles.link} ${styles.desktopOnly}`}
          >
            GitHub
          </a>
          <div className={styles.desktopOnly}>
            <ThemeToggle />
          </div>
          <Link
            href="/docs/v3/getting-started/quick-start/"
            className={`btn btnPrimary ${styles.desktopOnly}`}
          >
            Get started
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            className={`btn btnGhost ${styles.mobileMenuBtn}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className={styles.mobileDrawer}
        >
          <Link
            href="/docs/v3/"
            className={styles.link}
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: 18, padding: '8px 0' }}
          >
            Documentation
          </Link>
          <Link
            href="/#explore"
            className={styles.link}
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: 18, padding: '8px 0' }}
          >
            Examples
          </Link>
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
            style={{ fontSize: 18, padding: '8px 0' }}
          >
            GitHub
          </a>
          <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>Theme</span>
            <ThemeToggle />
          </div>
          <Link
            href="/docs/v3/getting-started/quick-start/"
            className="btn btnPrimary"
            onClick={() => setMobileMenuOpen(false)}
            style={{ width: '100%', marginTop: 8 }}
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}
