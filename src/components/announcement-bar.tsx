import Link from 'next/link';

import { SITE } from '@/lib/site';

import styles from './announcement-bar.module.css';

const AnnouncementBar = () => (
  <div className={styles.bar}>
    {/* This bar used to announce "@mcpose/audit 3.0", a version that has never
        been published. The 2.0.2 subkey fix is real, shipped, and a stronger
        signal to the reader this site is written for. */}
    <span className={`tag tag-accent ${styles.newTag}`}>SECURITY</span>
    <span>
      <span className={styles.package}>@mcpose/audit {SITE.published.audit}</span> — audit subkeys
      now derive from the signing secret, not the public key id
    </span>
    <Link href="/docs/project/changelog/" className={styles.link}>
      Changelog →
    </Link>
  </div>
);

export default AnnouncementBar;
