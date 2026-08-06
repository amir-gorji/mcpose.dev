import type * as PageTree from 'fumadocs-core/page-tree';
import { findNeighbour } from 'fumadocs-core/page-tree';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import Breadcrumb from '@/components/docs/breadcrumb';
import Pager from '@/components/docs/pager';
import Toc from '@/components/docs/toc';
import JsonLd, { type JsonLdObject } from '@/components/seo/json-ld';
import { SITE } from '@/lib/site';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

import styles from '../docs-shell.module.css';

export const dynamicParams = false;

export const generateStaticParams = () => source.generateParams();

type PageProps = { params: Promise<{ slug?: string[] }> };
type DocsPageData = NonNullable<ReturnType<typeof source.getPage>>;

/* Canonical URLs carry the trailing slash (next.config trailingSlash: true);
   fumadocs page.url does not, so normalize at the boundary. */
const withTrailingSlash = (url: string): string => (url.endsWith('/') ? url : `${url}/`);

const canonicalUrl = (page: DocsPageData): string => SITE.url + withTrailingSlash(page.url);

/* Tree walk mirroring components/docs/breadcrumb.tsx, so the structured data
   matches the visible trail. */
const nodeName = (name: ReactNode): string => (typeof name === 'string' ? name : String(name ?? ''));

const containsUrl = (node: PageTree.Node, url: string): boolean => {
  if (node.type === 'page') return node.url === url;
  if (node.type === 'folder') {
    return node.index?.url === url || node.children.some((child) => containsUrl(child, url));
  }
  return false;
};

const folderCrumb = (folder: PageTree.Folder): { name: string; item?: string } => {
  const firstChildPage = folder.children.find((child) => child.type === 'page');
  const url = folder.index?.url ?? (firstChildPage?.type === 'page' ? firstChildPage.url : undefined);
  return {
    name: nodeName(folder.name),
    ...(url !== undefined ? { item: SITE.url + withTrailingSlash(url) } : {}),
  };
};

const techArticleFor = (page: DocsPageData): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: page.data.title,
  ...(page.data.description !== undefined ? { description: page.data.description } : {}),
  url: canonicalUrl(page),
});

const breadcrumbListFor = (page: DocsPageData): JsonLdObject => {
  const folder = source.pageTree.children.find(
    (node): node is PageTree.Folder => node.type === 'folder' && containsUrl(node, page.url),
  );
  const crumbs: readonly { name: string; item?: string }[] = [
    /* "Docs" links to Quick Start, same as the visual breadcrumb (no /docs/ index). */
    { name: 'Docs', item: `${SITE.url}/docs/getting-started/quick-start/` },
    ...(folder !== undefined ? [folderCrumb(folder)] : []),
    { name: page.data.title, item: canonicalUrl(page) },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.item !== undefined ? { item: crumb.item } : {}),
    })),
  };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: canonicalUrl(page) },
    /* Page-level openGraph replaces the root layout's, so restate site fields. */
    openGraph: {
      type: 'article',
      siteName: SITE.name,
      title: page.data.title,
      description: page.data.description,
      url: canonicalUrl(page),
    },
    ...(page.data.stub ? { robots: { index: false } } : {}),
  };
};

const DocsPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const Mdx = page.data.body;
  const neighbours = findNeighbour(source.pageTree, page.url);
  const prevUrl = page.data.prev ?? neighbours.previous?.url;
  const nextUrl = page.data.next ?? neighbours.next?.url;
  const tocItems = page.data.toc.filter((item) => item.depth <= 2);

  return (
    <>
      {page.data.stub ? null : (
        <>
          <JsonLd data={techArticleFor(page)} />
          <JsonLd data={breadcrumbListFor(page)} />
        </>
      )}
      <main className={styles.main} {...(page.data.stub ? {} : { 'data-pagefind-body': '' })}>
        <Breadcrumb page={page} />
        <h1 className={styles.title}>{page.data.title}</h1>
        <Mdx components={getMDXComponents()} />
        <Pager prevUrl={prevUrl} nextUrl={nextUrl} />
      </main>
      <Toc items={tocItems} />
    </>
  );
};

export default DocsPage;
