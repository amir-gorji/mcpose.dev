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
      themes: { light: nocturneTheme, dark: nocturneTheme },
      transformers: [transformerCopyText(), transformerBashPackages()],
    },
  },
});
