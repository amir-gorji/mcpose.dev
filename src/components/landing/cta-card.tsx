import Link from 'next/link';
import styles from './cta-card.module.css';

export default function CtaCard() {
  return (
    <section aria-label="Get started" className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.heading}>The next layer is yours.</h2>
        <p className={styles.lede}>
          Start with one proxy and one function. See where it takes you.
        </p>
        <div className={styles.action}>
          <Link
            href="/docs/v3/getting-started/quick-start/"
            className="btn btn-primary"
          >
            Build your first proxy
          </Link>
        </div>
      </div>
    </section>
  );
}
