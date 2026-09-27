'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const emptySubscribe = () => () => {};

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light';
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'dark' ? 'dark' : 'light';
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handleMedia = () => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('mcpose.theme');
    } catch {}
    if (stored !== 'dark' && stored !== 'light') {
      document.documentElement.setAttribute('data-theme', media.matches ? 'dark' : 'light');
    }
    callback();
  };
  media.addEventListener('change', handleMedia);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  return () => {
    media.removeEventListener('change', handleMedia);
    observer.disconnect();
  };
}

export default function ThemeToggle({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => 'light');

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('mcpose.theme', next);
    } catch {}
  };

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      className={className ?? 'btn btn-ghost'}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 44,
        minHeight: 44,
        padding: '8px 12px',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 16 }}>
        {mounted ? (isDark ? '☼' : '☾') : '☼'}
      </span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>
        {mounted ? (isDark ? 'Light' : 'Dark') : 'Theme'}
      </span>
    </button>
  );
}
