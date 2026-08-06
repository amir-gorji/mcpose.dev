import Link from 'next/link';
import type * as PageTree from 'fumadocs-core/page-tree';

import { nodeName, withTrailingSlash } from '@/lib/docs-tree';

import styles from './sidebar.module.css';

type SidebarProps = {
  tree: PageTree.Root;
  activeUrl: string;
  /* The drawer reuses the same tree without the sticky column's
     positioning or its fading right border. */
  variant?: 'aside' | 'drawer';
};

type SidebarItem = {
  readonly title: string;
  readonly url: string;
  readonly isMono: boolean;
};

type SidebarGroup = {
  readonly label: string;
  readonly items: readonly SidebarItem[];
};

const toGroups = (tree: PageTree.Root): readonly SidebarGroup[] =>
  tree.children.flatMap((node): readonly SidebarGroup[] => {
    if (node.type !== 'folder') return [];
    const label = nodeName(node.name);
    const isMono = label === 'Packages';
    const items = node.children.flatMap((child): readonly SidebarItem[] =>
      child.type === 'page' ? [{ title: nodeName(child.name), url: child.url, isMono }] : [],
    );
    return [{ label, items }];
  });

const itemClassName = (item: SidebarItem, active: boolean): string =>
  [styles.item, item.isMono ? styles.itemMono : undefined, active ? styles.itemActive : undefined]
    .filter(Boolean)
    .join(' ');

const Sidebar = ({ tree, activeUrl, variant = 'aside' }: SidebarProps) => (
  <aside className={variant === 'drawer' ? styles.sidebarDrawer : styles.sidebar}>
    <div className={styles.inner}>
      {toGroups(tree).map((group) => (
        <div key={group.label}>
          <div className={styles.groupLabel}>{group.label}</div>
          <div className={styles.items}>
            {group.items.map((item) => {
              const active = item.url === activeUrl;
              return (
                <Link
                  key={item.url}
                  href={withTrailingSlash(item.url)}
                  className={itemClassName(item, active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </aside>
);

export default Sidebar;
