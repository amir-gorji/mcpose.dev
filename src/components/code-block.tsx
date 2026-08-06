import type { ReactNode } from 'react';

import styles from './code-block.module.css';

type CodeBlockFrameProps = {
  title: string;
  action?: ReactNode;
  lineHeight?: number;
  elevation?: 'sm' | 'md';
  children: ReactNode;
};

const CodeBlockFrame = ({
  title,
  action,
  lineHeight = 1.75,
  elevation = 'sm',
  children,
}: CodeBlockFrameProps) => (
  <div className={`${styles.frame} ${elevation === 'md' ? 'elev-md' : 'elev-sm'}`}>
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      {action}
    </div>
    <div className={styles.body} style={{ lineHeight }}>
      {children}
    </div>
  </div>
);

export default CodeBlockFrame;
