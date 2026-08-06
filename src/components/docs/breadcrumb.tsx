import Link from 'next/link';
import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';

import { source } from '@/lib/source';

import styles from './breadcrumb.module.css';

type DocsPage = NonNullable<ReturnType<typeof source.getPage>>;

type BreadcrumbProps = {
  page: DocsPage;
};

const nodeName = (name: ReactNode): string => (typeof name === 'string' ? name : String(name ?? ''));

const containsUrl = (node: PageTree.Node, url: string): boolean => {
  if (node.type === 'page') return node.url === url;
  if (node.type === 'folder') {
    return node.index?.url === url || node.children.some((child) => containsUrl(child, url));
  }
  return false;
};

const folderNameFor = (tree: PageTree.Root, url: string): string | null => {
  const folder = tree.children.find((node) => node.type === 'folder' && containsUrl(node, url));
  return folder !== undefined && folder.type === 'folder' ? nodeName(folder.name) : null;
};

const Breadcrumb = ({ page }: BreadcrumbProps) => {
  const folderName = folderNameFor(source.pageTree, page.url);
  return (
    <div className={styles.breadcrumb}>
      <Link href="/docs/getting-started/quick-start/" className={styles.docsLink}>
        Docs
      </Link>
      {' / '}
      {folderName !== null ? (
        <>
          <span>{folderName}</span>
          {' / '}
        </>
      ) : null}
      <span className={styles.current}>{page.data.title}</span>
    </div>
  );
};

export default Breadcrumb;
