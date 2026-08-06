import type { ReactNode } from 'react';

import Sidebar from '@/components/docs/sidebar';
import SidebarDrawer from '@/components/docs/sidebar-drawer';
import Nav from '@/components/nav';
import { source } from '@/lib/source';

import styles from '../docs-shell.module.css';

type DocsLayoutProps = {
  params: Promise<{ slug?: string[] }>;
  children: ReactNode;
};

const DocsLayout = async ({ params, children }: DocsLayoutProps) => {
  const { slug } = await params;
  const activeUrl = source.getPage(slug)?.url ?? '';
  return (
    <div className={styles.page}>
      <Nav
        maxWidth={1360}
        current="docs"
        menuSlot={
          <SidebarDrawer>
            <Sidebar tree={source.pageTree} activeUrl={activeUrl} variant="drawer" />
          </SidebarDrawer>
        }
      />
      <div className={styles.shell}>
        <Sidebar tree={source.pageTree} activeUrl={activeUrl} />
        {children}
      </div>
    </div>
  );
};

export default DocsLayout;
