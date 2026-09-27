import Link from 'next/link';
import styles from './announcement-bar.module.css';

export default function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <span className={styles.kicker}>Meet mcpose v3</span>
      <span className={styles.textDesktop}>
        More ways to compose. One familiar MCP endpoint.
      </span>
      <span className={styles.textMobile}>
        mcpose v3 is here.
      </span>
      <Link href="/docs/v3/migration/from-v2/" className={styles.link}>
        <span className={styles.textDesktop}>Explore what’s new →</span>
        <span className={styles.textMobile}>What’s new →</span>
      </Link>
    </div>
  );
}
