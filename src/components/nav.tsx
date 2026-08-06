import Link from 'next/link';
import type { ReactNode } from 'react';

import Logo from '@/components/logo';
import SearchTrigger from '@/components/search/search-trigger';
import { SITE } from '@/lib/site';

import styles from './nav.module.css';

type NavProps = {
  maxWidth: 1160 | 1360;
  current?: 'docs';
  /* Docs pages pass the drawer trigger; it only shows below 768px. */
  menuSlot?: ReactNode;
};

const Nav = ({ maxWidth, current, menuSlot }: NavProps) => (
  <nav className={styles.nav}>
    <div className={styles.inner} style={{ maxWidth }}>
      <div className={styles.brandGroup}>
        {menuSlot}
        <Logo size="nav" />
        <Link href="/" className={styles.brand}>
          mcpose
        </Link>
        <span className={`tag tag-neutral ${styles.versionTag}`}>{SITE.versions.coreTag}</span>
      </div>
      <div className={styles.linkGroup}>
        <SearchTrigger />
        <Link
          href="/docs/getting-started/quick-start/"
          className={current === 'docs' ? `${styles.link} ${styles.linkCurrent}` : styles.link}
          aria-current={current === 'docs' ? 'page' : undefined}
        >
          Docs
        </Link>
        <a href={SITE.github} rel="noreferrer" className={styles.link}>
          GitHub
        </a>
        <a href={SITE.npm.core} rel="noreferrer" className={styles.link}>
          npm
        </a>
      </div>
    </div>
  </nav>
);

export default Nav;
