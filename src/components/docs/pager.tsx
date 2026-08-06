import Link from 'next/link';

import { source } from '@/lib/source';

import styles from './pager.module.css';

type PagerProps = {
  prevUrl?: string;
  nextUrl?: string;
};

type PagerTarget = {
  readonly url: string;
  readonly title: string;
};

const slugFromUrl = (url: string): string[] =>
  url
    .replace(/^\/docs\/?/, '')
    .replace(/\/+$/, '')
    .split('/')
    .filter((part) => part.length > 0);

const resolveTarget = (url: string | undefined): PagerTarget | null => {
  if (url === undefined) return null;
  const page = source.getPage(slugFromUrl(url));
  return page !== undefined ? { url: `${page.url}/`, title: page.data.title } : null;
};

const Pager = ({ prevUrl, nextUrl }: PagerProps) => {
  const prev = resolveTarget(prevUrl);
  const next = resolveTarget(nextUrl);
  if (prev === null && next === null) return null;
  return (
    <>
      <div className="hr" style={{ margin: '0 0 var(--space-8)' }} />
      <div className={styles.row}>
        {prev !== null ? (
          <Link href={prev.url} className={styles.side}>
            <div className={styles.kicker}>← Previous</div>
            <div className={styles.label}>{prev.title}</div>
          </Link>
        ) : null}
        {next !== null ? (
          <Link href={next.url} className={`${styles.side} ${styles.sideNext}`}>
            <div className={styles.kicker}>Next →</div>
            <div className={styles.label}>{next.title}</div>
          </Link>
        ) : null}
      </div>
    </>
  );
};

export default Pager;
