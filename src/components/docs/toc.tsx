'use client';

import { AnchorProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';

import styles from './toc.module.css';

type TocProps = {
  items: TOCItemType[];
};

const Toc = ({ items }: TocProps) => {
  if (items.length === 0) return null;
  return (
    <aside className={styles.toc}>
      <div className={styles.label}>On this page</div>
      {/* single: the mock accents exactly one item, not every heading in view. */}
      <AnchorProvider toc={items} single>
        <div className={styles.list}>
          {items.map((item) => (
            <TOCItem key={item.url} href={item.url} className={styles.item}>
              {item.title}
            </TOCItem>
          ))}
        </div>
      </AnchorProvider>
    </aside>
  );
};

export default Toc;
