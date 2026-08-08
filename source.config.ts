import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';
import { nocturneTheme } from './src/lib/shiki-theme';
import { transformerBashPackages, transformerCopyText } from './src/lib/shiki-transformers';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      /* Placeholder pages: rendered, linked, but noindex + unsearchable. */
      stub: z.boolean().default(false),
      /* Pager overrides (doc URLs); falls back to tree neighbours. */
      prev: z.string().optional(),
      next: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      /* fumadocs merges its own defaults over this object with a flat spread
         (fumadocs-core/dist/mdx-plugins/rehype-code.js:10-13), and those
         defaults carry `defaultColor: false`. Supplying `themes` replaces the
         theme map but leaves `defaultColor` alone, so Shiki took its dual-theme
         branch and emitted only `--shiki-light`/`--shiki-dark` custom
         properties. fumadocs-ui is not installed, nothing in this repo maps
         them, and every docs code block rendered in the inherited flat colour
         while the landing page (src/lib/shiki.ts, single `theme:`) highlighted
         correctly. Naming the one theme as the default is what makes Shiki
         write real `color:` declarations again.

         `theme:` singular is not an option here: `themes` always arrives from
         the defaults, Shiki checks `'themes' in options` first, and the build
         then dies loading the unreferenced `github-light`. */
      themes: { dark: nocturneTheme },
      defaultColor: 'dark',
      /* Both transformers are appended *after* this array
         (rehype-code.core:504-506), so a user transformer list cannot displace
         them. The icon one stamped 47 KB of escaped inline SVG onto 14 pages
         via a `<pre icon="...">` attribute that nothing ever rendered; the tab
         one is inert without `tab=` meta. */
      icon: false,
      tab: false,
      transformers: [transformerCopyText(), transformerBashPackages()],
    },
  },
});
