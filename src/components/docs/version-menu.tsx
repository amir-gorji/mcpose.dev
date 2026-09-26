'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOCS_VERSIONS, type DocsVersionId, getCounterpartUrl } from '@/lib/docs-versions';

type VersionMenuProps = {
  currentVersion: DocsVersionId;
};

export default function VersionMenu({ currentVersion }: VersionMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const currentInfo = DOCS_VERSIONS[currentVersion];
  const versions: DocsVersionId[] = ['v3', 'v2'];

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: 16 }}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="version-menu-popup"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: 44,
          padding: '8px 12px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text)',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'border-color 150ms cubic-bezier(0.2,0,0,1)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>{currentInfo.label}</span>
          <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>· {currentInfo.status}</span>
        </span>
        <span aria-hidden="true" style={{ fontSize: 11, color: 'var(--color-muted)' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div
          id="version-menu-popup"
          ref={menuRef}
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: 'min(360px, calc(100vw - 32px))',
            padding: 8,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 30,
            animation: 'menuOpen 150ms cubic-bezier(0.2,0,0,1)',
          }}
        >
          {versions.map((ver) => {
            const info = DOCS_VERSIONS[ver];
            const isCurrent = ver === currentVersion;
            const targetUrl = isCurrent ? '#' : getCounterpartUrl(currentVersion, pathname);

            return isCurrent ? (
              <div
                key={ver}
                role="menuitem"
                aria-current="page"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-tint)',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  fontSize: 14,
                  minHeight: 44,
                }}
              >
                <span>
                  {info.label} <span style={{ fontWeight: 400, fontSize: 13 }}>({info.status})</span>
                </span>
                <span aria-hidden="true">✓</span>
              </div>
            ) : (
              <Link
                key={ver}
                href={targetUrl}
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  fontSize: 14,
                  minHeight: 44,
                  transition: 'background-color 150ms cubic-bezier(0.2,0,0,1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-tint)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>
                  {info.label} <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>({info.status})</span>
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>Switch →</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
