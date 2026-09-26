import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './link-card.module.css';

/* "Next steps" cards — a 2-up grid of surface cards that link onward.
   Paint comes from the global .card: accent title, muted body. */

export const LinkCards = ({ children }: { children: ReactNode }) => (
  <div className={styles.cards}>{children}</div>
);

type LinkCardProps = {
  href: string;
  title: string;
  body: string;
};

const LinkCard = ({ href, title, body }: LinkCardProps) => (
  <Link className={`card ${styles.cardLink}`} href={href}>
    <div className={styles.title}>{title}</div>
    <p className="card-body">{body}</p>
  </Link>
);

export default LinkCard;
