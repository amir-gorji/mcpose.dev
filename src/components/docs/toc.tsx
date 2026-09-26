'use client';

import { useState } from 'react';
import { AnchorProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';
import styles from './toc.module.css';

type TocProps = {
  items: TOCItemType[];
};

export const MobileToc = ({ items }: TocProps) => {
  const [open, setOpen] = useState(false);
  const h2Count = items.filter((item) => item.depth === 2).length;
  if (h2Count < 3) return null;

  return (
    <div style={{ margin: '16px 0 24px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12 }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--color-text)',
          cursor: 'pointer',
        }}
      >
        <span>On this page</span>
        <span aria-hidden="true" style={{ fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 14,
                color: 'var(--color-muted)',
                textDecoration: 'none',
                paddingLeft: (item.depth - 2) * 16,
              }}
            >
              {item.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const Toc = ({ items }: TocProps) => {
  if (!items || items.length === 0) return null;

  return (
    <aside className={styles.toc}>
      <div className={styles.label}>On this page</div>
      <AnchorProvider toc={items} single>
        <div className={styles.list}>
          {items.map((item) => (
            <TOCItem
              key={item.url}
              href={item.url}
              className={styles.item}
              data-depth={item.depth}
            >
              {item.title}
            </TOCItem>
          ))}
        </div>
      </AnchorProvider>
    </aside>
  );
};

export default Toc;
