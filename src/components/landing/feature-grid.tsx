import type { ReactNode } from 'react';
import styles from './feature-grid.module.css';

type Feature = {
  readonly title: string;
  readonly body: ReactNode;
};

const FEATURES: readonly Feature[] = [
  {
    title: 'Transparent proxy',
    body: (
      <>
        Wrap any upstream MCP server without modifying it. The client sees a
        normal server; the upstream sees a normal client.
      </>
    ),
  },
  {
    title: 'Onion middleware',
    body: (
      <>
        Each layer runs before <em>and</em> after the inner pipeline.
        Predictable ordering, fully typed, composable.
      </>
    ),
  },
  {
    title: 'Governance',
    body: (
      <>
        Hide or gate tools and resources per caller. Every blocked call carries
        a structured <code className={styles.code}>RejectionReason</code>.
      </>
    ),
  },
  {
    title: 'Identity',
    body: (
      <>
        Resolve a caller once per session — JWT, mTLS, API key — then stamp the{' '}
        <code className={styles.code}>Identity</code> on every request.
      </>
    ),
  },
  {
    title: 'Tamper-evident audit',
    body: (
      <>
        HMAC-chained events and a signed Merkle replay manifest per session,
        via <code className={styles.code}>@mcpose/audit</code>.
      </>
    ),
  },
  {
    title: 'Production transport',
    body: (
      <>
        HTTP/SSE with mTLS, session limits, and reconnect replay — or plain
        stdio. Abort signals and progress relay through.
      </>
    ),
  },
];

const FeatureGrid = () => (
  <>
    <div className={`kicker ${styles.kicker}`}>Why mcpose</div>
    <h2 className={styles.heading}>Cross-cutting concerns, composed.</h2>
    <div className={styles.grid}>
      {FEATURES.map((feature) => (
        <div key={feature.title}>
          <div className={`kicker-sm ${styles.itemTitle}`}>{feature.title}</div>
          <div className={styles.itemBody}>{feature.body}</div>
        </div>
      ))}
    </div>
  </>
);

export default FeatureGrid;
