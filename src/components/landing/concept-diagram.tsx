import styles from './concept-diagram.module.css'

const Connector = ({ transport }: { transport: string }) => (
  <div className={styles.connector}>
    <div className={styles.connectorLabel}>MCP</div>
    <div className={styles.connectorLine}>
      <div className={styles.diamond} />
      <div className={styles.connectorRule} />
      <div className={styles.diamond} />
    </div>
    <div className={styles.connectorTransport}>{transport}</div>
  </div>
)

const CENTER_ROWS = [
  'identity resolution',
  'visibility filters',
  'middleware pipelines',
  'audit trail',
] as const

const ConceptDiagram = () => (
  <>
    <div className="kicker" style={{ marginBottom: 'var(--space-4)' }}>
      Concept
    </div>
    <h2 style={{ margin: '0 0 var(--space-3)' }}>One proxy in the middle.</h2>
    <p className={styles.lede}>
      mcpose mirrors the upstream MCP surface and routes supported calls through
      middleware. Capabilities, abort signals, progress, and list-changed
      notifications pass through intact.
    </p>
    <div className={styles.flowRow}>
      <div className={`card ${styles.edgeCard}`}>
        <div className={styles.edgeTitle}>LLM client</div>
        <div className={styles.edgeSub}>Claude · Cursor · any MCP client</div>
      </div>
      <Connector transport="http · sse · stdio" />
      <div className={styles.centerBox}>
        <div className={styles.centerHeader}>
          <span className={styles.centerName}>mcpose</span>
          <span className={styles.centerAddress}>:3000/mcp</span>
        </div>
        <div className={styles.centerBody}>
          {CENTER_ROWS.map((label) => (
            <div key={label} className={styles.centerRow}>
              <div className={styles.diamondAccent} />
              <span className={styles.centerRowLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <Connector transport="stdio · http" />
      <div className={`card ${styles.edgeCard}`}>
        <div className={styles.edgeTitle}>Upstream server</div>
        <div className={styles.edgeSub}>any MCP server — unmodified</div>
      </div>
    </div>
    <div className={styles.routing}>
      <div className={styles.routingHeading}>
        Three routing paths per tool or resource
      </div>
      <div className={styles.routingGrid}>
        <div className="card">
          <div className="card-kicker">Hidden</div>
          <div className={styles.routingOption}>
            hiddenTools · hiddenResources
          </div>
          <p className="card-body">
            Omitted from list responses; rejected with{' '}
            <span className={styles.inlineCode}>TOOL_HIDDEN</span> at call time.
            The rejection still hits the audit trail.
          </p>
        </div>
        <div className="card">
          <div className="card-kicker">Pass-through</div>
          <div className={styles.routingOption}>
            passThroughTools · passThroughResources
          </div>
          <p className="card-body">
            Forwarded raw. Transformers are skipped; observers wrapped in{' '}
            <span className={styles.inlineCode}>markPassThroughObserver()</span>{' '}
            still run.
          </p>
        </div>
        <div className="card">
          <div className="card-kicker">Middleware</div>
          <div className={styles.routingOption}>everything else</div>
          <p className="card-body">
            Routed through the full{' '}
            <span className={styles.inlineCode}>toolMiddleware</span> /{' '}
            <span className={styles.inlineCode}>resourceMiddleware</span>{' '}
            pipeline.
          </p>
        </div>
      </div>
    </div>
  </>
)

export default ConceptDiagram
