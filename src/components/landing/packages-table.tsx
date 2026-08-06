import { SITE } from '@/lib/site';
import styles from './packages-table.module.css';

type PackageRow = {
  readonly name: string;
  readonly href: string;
  readonly description: string;
  readonly version: string;
};

const ROWS: readonly PackageRow[] = [
  {
    name: 'mcpose',
    href: SITE.npm.core,
    description: 'Proxy core — pipeline, transports, identity, governance.',
    version: SITE.versions.core,
  },
  {
    name: '@mcpose/audit',
    href: SITE.npm.audit,
    description: 'Tamper-evident HMAC audit chain + Merkle replay manifest.',
    version: SITE.versions.audit,
  },
  {
    name: '@mcpose/testing',
    href: SITE.npm.testing,
    description: 'Runner-agnostic compliance assertions for the audit chain.',
    version: SITE.versions.testing,
  },
];

const PackagesTable = () => (
  <>
    <div className={`kicker ${styles.kicker}`}>Packages</div>
    <h2 className={styles.heading}>Three packages, one surface.</h2>
    <table className="table">
      <thead>
        <tr>
          <th className={styles.thPackage}>Package</th>
          <th>What it does</th>
          <th className={styles.thVersion}>Version</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row.name}>
            <td>
              <a href={row.href} className={styles.packageLink}>
                {row.name}
              </a>
            </td>
            <td className={styles.description}>{row.description}</td>
            <td className={styles.versionCell}>
              <span className={`tag tag-neutral ${styles.versionTag}`}>{row.version}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className={styles.footnote}>
      Peer dependency: <code className={styles.footnoteCode}>@modelcontextprotocol/sdk ≥ 1.0</code>{' '}
      — installed separately.
    </div>
  </>
);

export default PackagesTable;
