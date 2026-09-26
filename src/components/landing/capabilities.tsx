import styles from './capabilities.module.css';

const CAPABILITIES = [
  {
    pillar: 'Adapt',
    title: 'Transform, shape, serve',
    description:
      'Transform results, shape discovery, and serve local tools alongside upstream tools.',
  },
  {
    pillar: 'Operate',
    title: 'Identity, observe, persist',
    description:
      'Resolve identity, observe calls, and persist transport events with Redis or Postgres.',
  },
  {
    pillar: 'Govern',
    title: 'Policy, consent, audit',
    description:
      'Apply policy and consent, then preserve tamper-evident evidence with audit.',
  },
] as const;

export default function Capabilities() {
  return (
    <section aria-label="Capabilities" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Useful in a side project. Ready for serious work.
        </h2>
        <p className={styles.lede}>
          Keep the core small. Compose the capabilities your application needs.
        </p>
      </div>

      <div className={styles.grid}>
        {CAPABILITIES.map((cap) => (
          <div key={cap.pillar} className={styles.card}>
            <span className={styles.pillar}>{cap.pillar}</span>
            <h3 className={styles.cardTitle}>{cap.title}</h3>
            <p className={styles.cardText}>{cap.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
