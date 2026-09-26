'use client';

import styles from './mesh-section.module.css';

const MESH_ROWS = [
  { tool: 'docs__search', target: 'Docs server / search' },
  { tool: 'crm__lookup', target: 'CRM server / lookup' },
  { tool: 'files__read', target: 'Files server / read' },
] as const;

export default function MeshSection() {
  const handleExploreMesh = (e: React.MouseEvent) => {
    e.preventDefault();
    const meshTab = document.getElementById('tab-mesh');
    if (meshTab) {
      meshTab.click();
    }
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#explore';
    }
  };

  return (
    <section aria-label="Multi-server mesh" className={styles.section}>
      <div className={styles.card}>
        <div className={styles.copyCol}>
          <h2 className={styles.heading}>Bring your servers together.</h2>
          <p className={styles.subheading}>
            One endpoint. Distinct tools. The same middleware model.
          </p>
          <p className={styles.description}>
            Connect named upstreams and expose their tools through a shared proxy. Add a transformation once and reuse it across your integrations.
          </p>
          <div className={styles.actionRow}>
            <a
              href="#explore"
              className="btn btn-secondary"
              onClick={handleExploreMesh}
            >
              Explore multi-server composition
            </a>
          </div>
        </div>

        <div className={styles.tableCol}>
          {MESH_ROWS.map((row) => (
            <div key={row.tool} className={styles.meshRow}>
              <span className={styles.toolName}>{row.tool}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <span className={styles.upstreamTarget}>{row.target}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
