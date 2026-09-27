import Link from 'next/link';
import Logo from '@/components/logo';
import { SITE } from '@/lib/site';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr className="hr" />
      <div className={styles.row}>
        <div className={styles.brandGroup}>
          <Logo size="footer" />
          <span className={styles.wordmark}>mcpose</span>
          <span className={styles.tagline}>· Open source. Yours to compose.</span>
        </div>
        <div className={styles.links}>
          <Link href="/docs/v3/" className={styles.link}>
            Documentation
          </Link>
          <a href={SITE.github} target="_blank" rel="noreferrer" className={styles.link}>
            GitHub
          </a>
          <a
            href="https://opensource.org/license/mit/"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            MIT license
          </a>
        </div>
      </div>
    </footer>
  );
}
