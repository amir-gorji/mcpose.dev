import Link from 'next/link';
import styles from './packages-table.module.css';

interface PackageItem {
  readonly name: string;
  readonly path: string;
  readonly description: string;
}

const PACKAGES: readonly PackageItem[] = [
  {
    name: 'mcpose',
    path: '/docs/v3/packages/mcpose/',
    description: 'Proxy, transport, middleware.',
  },
  {
    name: '@mcpose/otel',
    path: '/docs/v3/packages/otel/',
    description: 'Connect telemetry to OpenTelemetry.',
  },
  {
    name: '@mcpose/store-redis',
    path: '/docs/v3/packages/store-redis/',
    description: 'Persistent SSE events.',
  },
  {
    name: '@mcpose/store-postgres',
    path: '/docs/v3/packages/store-postgres/',
    description: 'Persistent SSE events.',
  },
  {
    name: '@mcpose/policy',
    path: '/docs/v3/packages/policy/',
    description: 'Role rules and per-session call budgets.',
  },
  {
    name: '@mcpose/consent',
    path: '/docs/v3/packages/consent/',
    description: 'Consent resolved by the application.',
  },
  {
    name: '@mcpose/audit',
    path: '/docs/v3/packages/audit/',
    description: 'Chained events and signed session manifests.',
  },
  {
    name: '@mcpose/testing',
    path: '/docs/v3/packages/testing/',
    description: 'Audit consistency assertions.',
  },
] as const;

export default function PackagesTable() {
  return (
    <section aria-label="Packages" className={styles.section}>
      <h2 className={styles.heading}>Add capabilities as you need them.</h2>

      <p className={styles.lede}>
        Telemetry and persistence for operations. Optional policy, consent, redaction, and audit for sensitive workflows.
      </p>

      {/* Desktop table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Package</th>
              <th className={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody>
            {PACKAGES.map((pkg) => (
              <tr key={pkg.name} className={styles.tr}>
                <td className={styles.tdName}>
                  <Link href={pkg.path} className={styles.packageLink}>
                    {pkg.name}
                  </Link>
                </td>
                <td className={styles.tdDesc}>{pkg.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className={styles.mobileList}>
        {PACKAGES.map((pkg) => (
          <div key={pkg.name} className={styles.mobileCard}>
            <Link href={pkg.path} className={styles.packageLink}>
              {pkg.name}
            </Link>
            <p className={styles.mobileDesc}>{pkg.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
