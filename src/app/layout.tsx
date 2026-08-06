import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { SITE } from '@/lib/site';
import '@/styles/nocturne.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
});

/* Viewport is a separate export in Next.js 16: it controls the meta viewport tag,
   theme-color, and color scheme. Values mirror the nocturne palette. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#161826',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  creator: SITE.creator,
  category: 'developer tools',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  /* './' resolves against each route's own path, self-canonicalizing every page. */
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={inter.variable}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
