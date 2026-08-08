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
  readonly external: boolean;
};

type SidebarGroup = {
  /* React key. A loose group has no label, so the label cannot serve as one. */
  readonly key: string;
  readonly label: string | undefined;
  readonly items: readonly SidebarItem[];
};

const pageItem = (node: PageTree.Item, isMono: boolean): SidebarItem => ({
  title: nodeName(node.name),
  url: node.url,
  isMono,
  external: node.external ?? /^https?:/.test(node.url),
});

/* A page tree root holds three node kinds, and the previous reduction dropped
   two of them on the floor: anything that was not a folder returned []. That
   silently hid content/docs/index.mdx — the very page the nav bar's "Docs" link
   points at — from every sidebar, reachable only through the breadcrumb.

     folder    a labelled group; its own index page, if any, leads
     page      a loose entry (the docs hub, or an external link from meta.json)
     separator starts a new loose group and names it

   Loose entries appearing before any separator form one unlabelled group. */
const toGroups = (tree: PageTree.Root): readonly SidebarGroup[] => {
  const groups: SidebarGroup[] = [];
  let loose: SidebarItem[] = [];
  let looseLabel: string | undefined;

  const flushLoose = () => {
    if (loose.length === 0) return;
    groups.push({ key: looseLabel ?? loose[0].url, label: looseLabel, items: loose });
    loose = [];
  };

  for (const node of tree.children) {
    if (node.type === 'page') {
      loose.push(pageItem(node, false));
      continue;
    }
    if (node.type === 'separator') {
      flushLoose();
      looseLabel = node.name === undefined ? undefined : nodeName(node.name);
      continue;
    }
    flushLoose();
    looseLabel = undefined;
    const label = nodeName(node.name);
    const isMono = label === 'Packages';
    groups.push({
      key: label,
      label,
      items: [
        ...(node.index === undefined ? [] : [pageItem(node.index, isMono)]),
        ...node.children.flatMap((child): readonly SidebarItem[] =>
          child.type === 'page' ? [pageItem(child, isMono)] : [],
        ),
      ],
    });
  }
  flushLoose();
  return groups;
};

const itemClassName = (item: SidebarItem, active: boolean): string =>
  [styles.item, item.isMono ? styles.itemMono : undefined, active ? styles.itemActive : undefined]
    .filter(Boolean)
    .join(' ');

const Sidebar = ({ tree, activeUrl, variant = 'aside' }: SidebarProps) => (
  <aside className={variant === 'drawer' ? styles.sidebarDrawer : styles.sidebar}>
    <div className={styles.inner}>
      {toGroups(tree).map((group) => (
        <div key={group.key}>
          {group.label === undefined ? null : (
            <div className={styles.groupLabel}>{group.label}</div>
          )}
          <div className={styles.items}>
            {group.items.map((item) => {
              const active = item.url === activeUrl;
              /* External entries are absolute URLs; they must not be routed
                 through next/link or normalised to a trailing slash. */
              return item.external ? (
                <a
                  key={item.url}
                  href={item.url}
                  className={itemClassName(item, false)}
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              ) : (
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
