import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';

export const withTrailingSlash = (url: string): string => (url.endsWith('/') ? url : `${url}/`);

export const nodeName = (name: ReactNode): string =>
  typeof name === 'string' ? name : String(name ?? '');

export const containsUrl = (node: PageTree.Node, url: string): boolean => {
  if (node.type === 'page') return node.url === url;
  if (node.type === 'folder') {
    return node.index?.url === url || node.children.some((child) => containsUrl(child, url));
  }
  return false;
};

export type Crumb = {
  readonly name: string;
  readonly url?: string;
};

const folderCrumb = (folder: PageTree.Folder): Crumb => {
  const firstChildPage = folder.children.find((child) => child.type === 'page');
  const url = folder.index?.url ?? (firstChildPage?.type === 'page' ? firstChildPage.url : undefined);
  return {
    name: nodeName(folder.name),
    ...(url !== undefined ? { url: withTrailingSlash(url) } : {}),
  };
};

export const breadcrumbTrail = (
  tree: PageTree.Root,
  pageUrl: string,
  pageTitle: string,
  version: 'v3' | 'v2' = 'v3',
): readonly Crumb[] => {
  const normalizedUrl = withTrailingSlash(pageUrl);
  const versionRootUrl = `/docs/${version}/`;
  const current: Crumb = { name: pageTitle, url: normalizedUrl };

  if (normalizedUrl === versionRootUrl) return [current];

  const folder = tree.children.find(
    (node): node is PageTree.Folder => node.type === 'folder' && containsUrl(node, pageUrl),
  );

  return [
    { name: `Docs (${version})`, url: versionRootUrl },
    ...(folder !== undefined ? [folderCrumb(folder)] : []),
    current,
  ];
};
