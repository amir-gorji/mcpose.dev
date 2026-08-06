import type { ReactNode } from 'react';
import styles from './docs-article.module.css';

/* Article note callout — a surface card with an accent kicker line.
   Accepts either `kicker`/`title` for the eyebrow and either `body`/
   `children` for the copy, so MDX can pass formatted inline content. */

type NoteProps = {
  kicker?: string;
  title?: string;
  body?: ReactNode;
  children?: ReactNode;
};

const Note = ({ kicker, title, body, children }: NoteProps) => (
  <div className={`card ${styles.note}`}>
    <div className="card-kicker">{kicker ?? title}</div>
    <p className="card-body" style={{ opacity: 1, color: 'var(--color-neutral-400)' }}>
      {body ?? children}
    </p>
  </div>
);

export default Note;
