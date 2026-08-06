import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

const withTrailingSlash = (url: string): string => (url.endsWith('/') ? url : `${url}/`);

/* Quick Start is the canonical entry into the docs; other doc pages sit below it. */
const docPriority = (url: string): number => (url.endsWith('/quick-start') ? 0.8 : 0.6);

/* lastModified is omitted deliberately: the static export has no git-derived
   dates, and a fabricated build date would be worse than none. */
const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE.url}/`, priority: 1.0 },
  ...source
    .getPages()
    .filter((page) => !page.data.stub)
    .map((page) => ({
      url: SITE.url + withTrailingSlash(page.url),
      priority: docPriority(page.url),
    })),
];

export default sitemap;
