import type { ReactNode } from 'react';

import styles from './code-block.module.css';

type CodeBlockFrameProps = {
  /** Filename chip on the left of the header. Omit for an unlabelled snippet. */
  title?: string;
  /** Language label on the right of the header. */
  lang?: string;
  action?: ReactNode;
  /** Force the header off even when there is something that could fill it. */
  bare?: boolean;
  lineHeight?: number;
  elevation?: 'sm' | 'md';
  children: ReactNode;
};

const CodeBlockFrame = ({
  title,
  lang,
  action,
  bare = false,
  lineHeight = 1.75,
  elevation = 'sm',
  children,
}: CodeBlockFrameProps) => {
  /* Header presence is derived rather than assumed. `title` used to be
     required, so a fence with no title= rendered a bordered bar holding an
     empty span and a right-floated copy button, which reads as an accident
     rather than as a design. */
  const hasHeader = !bare && (title !== undefined || lang !== undefined || action !== undefined);

  return (
    <div className={`${styles.frame} ${elevation === 'md' ? 'elev-md' : 'elev-sm'}`}>
      {hasHeader ? (
        <div className={styles.header}>
          {/* Placeholder keeps the action right-aligned when there is no title,
              without the header needing a second layout mode. */}
          {title === undefined ? <span /> : <span className={styles.title}>{title}</span>}
          {lang === undefined ? null : <span className={styles.lang}>{lang}</span>}
          {action}
        </div>
      ) : null}
      <div className={styles.body} style={{ lineHeight }}>
        {children}
      </div>
    </div>
  );
};

export default CodeBlockFrame;
