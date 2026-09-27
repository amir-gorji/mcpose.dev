import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import Sidebar from '@/components/docs/sidebar';
import SidebarDrawer from '@/components/docs/sidebar-drawer';
import Nav from '@/components/nav';
import { getVersionPage, getVersionPageTree } from '@/lib/source';
import type { DocsVersionId } from '@/lib/docs-versions';

import styles from '@/app/docs/docs-shell.module.css';

type DocsLayoutProps = {
  params: Promise<{ version: string; slug?: string[] }>;
  children: ReactNode;
};

export default async function DocsLayout({ params, children }: DocsLayoutProps) {
  const { version, slug } = await params;
  if (version !== 'v3' && version !== 'v2') {
    notFound();
  }

  const typedVersion = version as DocsVersionId;
  const pageTree = getVersionPageTree(typedVersion);
  const activeUrl = getVersionPage(version, slug)?.url ?? `/docs/${version}`;

  return (
    <div className={styles.page}>
      <Nav
        maxWidth={1360}
        current="docs"
        menuSlot={
          <SidebarDrawer>
            <Sidebar tree={pageTree} activeUrl={activeUrl} version={typedVersion} variant="drawer" />
          </SidebarDrawer>
        }
      />
      <div className={styles.shell}>
        <Sidebar tree={pageTree} activeUrl={activeUrl} version={typedVersion} />
        {children}
      </div>
    </div>
  );
}
