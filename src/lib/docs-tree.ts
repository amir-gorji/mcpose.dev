import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';

export const DOCS_ROOT_URL = '/docs/';

/* Canonical URLs carry the trailing slash (next.config trailingSlash: true);
   fumadocs page.url does not, so normalize at the boundary. */
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

/* The visible breadcrumb and the JSON-LD BreadcrumbList both derive their
   trail from here, so the two can never drift apart. */
export const breadcrumbTrail = (
  tree: PageTree.Root,
  pageUrl: string,
  pageTitle: string,
): readonly Crumb[] => {
  const current: Crumb = { name: pageTitle, url: withTrailingSlash(pageUrl) };
  if (current.url === DOCS_ROOT_URL) return [current];
  const folder = tree.children.find(
    (node): node is PageTree.Folder => node.type === 'folder' && containsUrl(node, pageUrl),
  );
  return [
    { name: 'Docs', url: DOCS_ROOT_URL },
    ...(folder !== undefined ? [folderCrumb(folder)] : []),
    current,
  ];
};
