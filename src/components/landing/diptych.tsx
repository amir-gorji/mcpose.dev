import type { ReactNode } from 'react';

import CodeBlockFrame from '@/components/code-block';
import { highlight } from '@/lib/shiki';
import { DIPTYCH_WITH, DIPTYCH_WITHOUT } from '@/lib/snippets';

import styles from './diptych.module.css';

type Claim = {
  readonly title: string;
  readonly body: ReactNode;
};

/* The four claims that the diptych does not make on its own. The feature grid
   this replaced also carried "Tamper-evident audit", which is redundant with
   the section immediately below that exists to explain it. */
const CLAIMS: readonly Claim[] = [
  {
    title: 'Onion middleware',
    body: (
      <>
        Each layer runs before <em>and</em> after the inner pipeline. Array order is the contract.
      </>
    ),
  },
  {
    title: 'Governance',
    body: (
      <>
        Hide or gate tools per caller. Every blocked call carries a structured{' '}
        <code className={styles.code}>RejectionReason</code>.
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
    title: 'Production transport',
    body: (
      <>
        HTTP/SSE with mTLS, session limits, and reconnect replay — or plain stdio. Abort signals and
        progress relay through.
      </>
    ),
  },
];

const Diptych = async () => {
  const [without, with_] = await Promise.all([
    highlight(DIPTYCH_WITHOUT, 'typescript'),
    highlight(DIPTYCH_WITH, 'typescript'),
  ]);

  return (
    <>
      <div className={`kicker ${styles.kicker}`}>Why mcpose</div>
      <h2 className={styles.heading}>The same three concerns, lifted out.</h2>
      <p className={styles.lede}>
        Nothing here is a competitor comparison, because there is no competitor to name. The
        alternative is the code you already have: auth, redaction, and logging written into the
        handlers of a server you control.
      </p>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelLabel}>
            <span className={styles.panelTitle}>Hand-rolled in one server</span>
            <span className={styles.panelNote}>where mcpose came from</span>
          </div>
          <CodeBlockFrame title="server.ts" lang="TypeScript" lineHeight={1.7}>
            <div dangerouslySetInnerHTML={{ __html: without }} />
          </CodeBlockFrame>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelLabel}>
            <span className={styles.panelTitle}>Wrapped with mcpose</span>
            <span className={styles.panelNote}>upstream unmodified</span>
          </div>
          <CodeBlockFrame title="proxy.ts" lang="TypeScript" lineHeight={1.7} elevation="md">
            <div dangerouslySetInnerHTML={{ __html: with_ }} />
          </CodeBlockFrame>
        </div>
      </div>

      <div className={styles.claims}>
        {CLAIMS.map((claim) => (
          <div key={claim.title}>
            <div className={styles.claimTitle}>{claim.title}</div>
            <div className={styles.claimBody}>{claim.body}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Diptych;
