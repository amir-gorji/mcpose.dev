import Link from 'next/link';

import { SITE } from '@/lib/site';

import styles from './announcement-bar.module.css';

const AnnouncementBar = () => (
  <div className={styles.bar}>
    <span className={`tag tag-accent ${styles.newTag}`}>NEW</span>
    <span>
      <span className={styles.package}>{SITE.versions.auditAnnouncement}</span> — audit format v2:
      canonical serialization, full-manifest signatures
    </span>
    <Link href="/docs/project/adrs/" className={styles.link}>
      ADR-0004 →
    </Link>
  </div>
);

export default AnnouncementBar;
