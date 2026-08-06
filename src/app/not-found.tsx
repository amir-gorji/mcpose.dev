import type { Metadata } from 'next';
import Link from 'next/link';

import Logo from '@/components/logo';

export const metadata: Metadata = {
  title: 'Page not found',
  /* A 404 is neither indexable nor its own canonical; both would otherwise
     be inherited from the root layout. */
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

/* Standalone 404 on the nocturne ground: no nav, just the mark, the message,
   and the two ways back in. Inline styles keep it a single self-contained file. */
const NotFound = () => (
  <main
    style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 24,
      textAlign: 'center',
    }}
  >
    <Logo />
    <h1 style={{ margin: 0 }}>Page not found</h1>
    <p style={{ margin: 0, fontSize: 14, color: 'var(--color-neutral-400)', maxWidth: 420 }}>
      The page you are looking for does not exist or has moved.
    </p>
    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
      <Link href="/" className="btn btn-primary">
        Back to home
      </Link>
      <Link href="/docs/getting-started/quick-start/" className="btn btn-secondary">
        Read the docs
      </Link>
    </div>
  </main>
);

export default NotFound;
