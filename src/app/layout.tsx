import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SITE } from '@/lib/site';
import '@/styles/nocturne.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#101814' },
  ],
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
  <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('mcpose.theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){}})()`,
        }}
      />
    </head>
    <body>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      {children}
    </body>
  </html>
);

export default RootLayout;
