import Link from 'next/link';
import styles from './pager.module.css';

type PagerTarget = {
  readonly url: string;
  readonly title: string;
};

type PagerProps = {
  prev?: PagerTarget;
  next?: PagerTarget;
};

const Pager = ({ prev, next }: PagerProps) => {
  if (!prev && !next) return null;

  return (
    <>
      <div className="hr" style={{ margin: 'var(--space-8) 0' }} />
      <div className={styles.row}>
        {prev ? (
          <Link href={prev.url} className={styles.side}>
            <div className={styles.kicker}>← Previous</div>
            <div className={styles.label}>{prev.title}</div>
          </Link>
        ) : <div />}
        {next ? (
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
