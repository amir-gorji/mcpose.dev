import styles from './capabilities.module.css';

const CAPABILITIES = [
  {
    title: 'Build a gateway',
    description:
      'Connect local and remote MCP servers through one endpoint, with distinct tool names and shared middleware.',
  },
  {
    title: 'Adapt your tools',
    description:
      'Filter the tool catalog, transform results, and add local tools without forking upstream servers.',
  },
  {
    title: 'Debug calls',
    description:
      'Inspect call timing, outcomes, and backend failures. Send events to your existing telemetry stack.',
  },
] as const;

export default function Capabilities() {
  return (
    <section aria-label="Capabilities" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          What will you build?
        </h2>
        <p className={styles.lede}>
          Start with a developer problem. Solve it in the space between client and server.
        </p>
      </div>

      <div className={styles.grid}>
        {CAPABILITIES.map((cap) => (
          <div key={cap.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{cap.title}</h3>
            <p className={styles.cardText}>{cap.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
