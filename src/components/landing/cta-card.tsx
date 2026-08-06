import InstallRow from '@/components/install-row';
import styles from './cta-card.module.css';

const CtaCard = () => (
  <div className={`elev-sm ${styles.card}`}>
    <h3 className={styles.heading}>Drop it in front of any MCP server.</h3>
    <p className={styles.subline}>Ten lines of glue. Nothing upstream changes.</p>
    <div className={styles.installRow}>
      <InstallRow variant="cta" />
    </div>
    <a className="btn btn-primary" href="/docs/getting-started/quick-start/">
      Read the docs →
    </a>
  </div>
);

export default CtaCard;
