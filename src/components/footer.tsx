import Link from 'next/link';

import Logo from '@/components/logo';
import { SITE } from '@/lib/site';

import styles from './footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="hr" style={{ margin: '0 0 var(--space-8)' }} />
    <div className={styles.row}>
      <div className={styles.brandGroup}>
        <Logo size="footer" />
        <span className={styles.wordmark}>mcpose</span>
        <span className={styles.license}>· MIT license</span>
      </div>
      <div className={styles.links}>
        <a href={SITE.github} rel="noreferrer" className={styles.link}>
          GitHub
        </a>
        <a href={SITE.npm.core} rel="noreferrer" className={styles.link}>
          npm
        </a>
        <Link href="/docs/getting-started/quick-start/" className={styles.link}>
          Docs
        </Link>
        <a href={SITE.githubSecurity} rel="noreferrer" className={styles.link}>
          Security
        </a>
      </div>
    </div>
    <div className={styles.provenance}>
      Extracted from a production financial Elasticsearch MCP deployment · Node 20+ · ESM ·
      TypeScript-first
    </div>
  </footer>
);

export default Footer;
