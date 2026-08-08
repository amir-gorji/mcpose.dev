import styles from './audit-section.module.css';

const AuditSection = () => (
  <>
    <div className={`kicker ${styles.sectionKicker}`}>@mcpose/audit</div>
    <h2 className={styles.heading}>Audit trails an examiner can verify.</h2>
    <p className={styles.lede}>
      Built for DORA Art. 17 and SR 11-7. Every event chains to the last; every
      session closes with a signed Merkle manifest. Extracted from a production
      financial deployment.
    </p>
    <div className={styles.grid}>
      <div className={styles.items}>
        <div>
          <div className={`kicker-sm ${styles.itemKicker}`}>
            HMAC-chained events
          </div>
          <div className={styles.itemBody}>
            <span className={styles.code}>
              chainHash = HMAC(entry || prevChainHash)
            </span>{' '}
            — truncation, reordering, and rewrites are detectable.
          </div>
        </div>
        <div>
          <div className={`kicker-sm ${styles.itemKicker}`}>Replay manifest</div>
          <div className={styles.itemBody}>
            A signed Merkle-proof document per session. A third party can verify
            a single event without access to the full log.
          </div>
        </div>
        <div>
          <div className={`kicker-sm ${styles.itemKicker}`}>
            Sensitivity tiers
          </div>
          <div className={styles.itemBody}>
            Classify every tool call; high-tier payloads are encrypted with
            AES-256-GCM and a per-event key.
          </div>
        </div>
        <div>
          <div className={`kicker-sm ${styles.itemKicker}`}>
            Never in the hot path
          </div>
          <div className={styles.itemBody}>
            Audit failures go to <span className={styles.code}>onAuditError</span>{' '}
            — a tool call never fails because logging did.
          </div>
        </div>
      </div>
      <div>
        <div className={styles.chain}>
          <span className={styles.chip}>e₀</span>
          <div className={styles.link}>
            <span className={styles.linkLabel}>hmac</span>
            <div className={styles.linkLine} />
          </div>
          <span className={styles.chip}>e₁</span>
          <div className={styles.link}>
            <span className={styles.linkLabel}>hmac</span>
            <div className={styles.linkLine} />
          </div>
          <span className={styles.chip}>e₂</span>
          <div className={styles.link}>
            <span className={styles.linkLabel}>hmac</span>
            <div className={styles.linkLine} />
          </div>
          <span className={styles.ellipsis}>…</span>
          <div className={styles.tailLine} />
          <span className={`tag tag-outline ${styles.manifestTag}`}>
            manifest ✓
          </span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className={styles.tierCol}>Tier</th>
              <th>Stored fields</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className={`tag tag-tier-low ${styles.tierTag}`}>low</span>
              </td>
              <td className={styles.fieldsCell}>
                inputRaw, outputRaw{' '}
                <span className={styles.fieldsNote}>(plaintext)</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className={`tag tag-tier-medium ${styles.tierTag}`}>
                  medium
                </span>
              </td>
              <td className={styles.fieldsCell}>
                inputRaw, outputRaw{' '}
                <span className={styles.fieldsNote}>(PII redacted upstream)</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className={`tag tag-tier-high ${styles.tierTag}`}>high</span>
              </td>
              <td className={styles.fieldsCell}>
                inputEncrypted, outputEncrypted{' '}
                <span className={styles.fieldsNote}>(AES-256-GCM)</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.footnote}>
          Unknown tools always resolve to{' '}
          <span className={styles.footnoteCode}>&apos;high&apos;</span>.
        </div>
      </div>
    </div>
  </>
);

export default AuditSection;
