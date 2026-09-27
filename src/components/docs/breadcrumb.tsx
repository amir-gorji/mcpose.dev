import Link from 'next/link';
import { Fragment } from 'react';
import type { Crumb } from '@/lib/docs-tree';
import styles from './breadcrumb.module.css';

type BreadcrumbProps = {
  trail: readonly Crumb[];
};

const Breadcrumb = ({ trail }: BreadcrumbProps) => {
  if (trail.length === 0) return null;
  const leading = trail.slice(0, -1);
  const current = trail[trail.length - 1];

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      {leading.map((crumb) => (
        <Fragment key={crumb.name}>
          {crumb.url ? (
            <Link href={crumb.url} className={styles.docsLink}>
              {crumb.name}
            </Link>
          ) : (
            <span>{crumb.name}</span>
          )}
          {' / '}
        </Fragment>
      ))}
      <span className={styles.current}>{current.name}</span>
    </nav>
  );
};

export default Breadcrumb;
