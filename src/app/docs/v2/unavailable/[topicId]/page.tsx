import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Nav from '@/components/nav';
import { UNAVAILABLE_TOPICS_V2 } from '@/lib/docs-versions';
import styles from '@/app/docs/docs-shell.module.css';

export const dynamicParams = false;

export const generateStaticParams = () =>
  Object.keys(UNAVAILABLE_TOPICS_V2).map((topicId) => ({ topicId }));

type PageProps = {
  params: Promise<{ topicId: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { topicId } = await params;
  const info = UNAVAILABLE_TOPICS_V2[topicId];
  if (!info) return { title: 'Not Found' };

  return {
    title: `${info.title} | mcpose v2 docs`,
    description: info.description,
    robots: {
      index: false,
      follow: false,
    },
  };
};

export default async function UnavailableTopicPage({ params }: PageProps) {
  const { topicId } = await params;
  const info = UNAVAILABLE_TOPICS_V2[topicId];
  if (!info) notFound();

  return (
    <div className={styles.page}>
      <Nav maxWidth={1360} current="docs" />
      <main id="main-content" className={styles.shell} style={{ display: 'block', maxWidth: 800, margin: '64px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <span className="tag" style={{ marginBottom: 12 }}>v2 Previous</span>
          <h1 style={{ fontSize: 36, lineHeight: '42px', fontWeight: 500, margin: '16px 0 8px' }}>
            {info.title}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 18, lineHeight: '28px' }}>
            {info.message}
          </p>
        </div>

        <div
          style={{
            padding: 24,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 40,
          }}
        >
          <p style={{ fontSize: 16, lineHeight: '26px', margin: '0 0 16px' }}>
            {info.description}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500 }}>Available destinations:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href={info.v3Url} className="btn btnPrimary">
              Read this topic in v3
            </Link>
            <Link href={info.fallbackUrl} className="btn btnSecondary">
              Related v2 documentation
            </Link>
            <Link href="/docs/v2/" className="btn btnGhost">
              Browse v2 home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
