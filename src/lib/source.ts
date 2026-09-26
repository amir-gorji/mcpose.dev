import { docs } from '@/.source/server';
import { loader } from 'fumadocs-core/source';
import type * as PageTree from 'fumadocs-core/page-tree';
import type { DocsVersionId } from './docs-versions';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
});

export const getVersionPage = (version: string, slug?: string[]) => {
  const fullSlug = slug && slug.length > 0 ? [version, ...slug] : [version];
  return source.getPage(fullSlug);
};

export const getVersionPageTree = (version: DocsVersionId): PageTree.Root => {
  const root = source.pageTree;
  const versionFolder = root.children.find(
    (node) =>
      node.type === 'folder' &&
      (node.name === version ||
        String(node.name).toLowerCase() === version ||
        node.index?.url === `/docs/${version}`),
  );

  if (versionFolder && versionFolder.type === 'folder') {
    return {
      name: versionFolder.name,
      children: versionFolder.children,
    };
  }

  return root;
};

export const generateVersionParams = () => {
  return source.getPages().map((page) => ({
    version: page.slugs[0],
    slug: page.slugs.length > 1 ? page.slugs.slice(1) : undefined,
  }));
};
