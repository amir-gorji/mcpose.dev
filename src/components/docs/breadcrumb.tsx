import Link from 'next/link';
import { Fragment } from 'react';

import { DOCS_ROOT_URL, breadcrumbTrail } from '@/lib/docs-tree';
import { source } from '@/lib/source';

import styles from './breadcrumb.module.css';

type DocsPage = NonNullable<ReturnType<typeof source.getPage>>;

type BreadcrumbProps = {
  page: DocsPage;
};

const Breadcrumb = ({ page }: BreadcrumbProps) => {
  const trail = breadcrumbTrail(source.pageTree, page.url, page.data.title);
  const leading = trail.slice(0, -1);
  const current = trail[trail.length - 1];
  return (
    <div className={styles.breadcrumb}>
      {leading.map((crumb) => (
        <Fragment key={crumb.name}>
          {crumb.url === DOCS_ROOT_URL ? (
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
    </div>
  );
};

export default Breadcrumb;
