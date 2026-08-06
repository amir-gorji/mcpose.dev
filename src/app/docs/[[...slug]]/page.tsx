import { findNeighbour } from 'fumadocs-core/page-tree';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/docs/breadcrumb';
import Pager from '@/components/docs/pager';
import Toc from '@/components/docs/toc';
import JsonLd, { type JsonLdObject } from '@/components/seo/json-ld';
import { DOCS_ROOT_URL, breadcrumbTrail, withTrailingSlash } from '@/lib/docs-tree';
import { SITE } from '@/lib/site';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

import styles from '../docs-shell.module.css';

export const dynamicParams = false;

export const generateStaticParams = () => source.generateParams();

type PageProps = { params: Promise<{ slug?: string[] }> };
type DocsPageData = NonNullable<ReturnType<typeof source.getPage>>;

const canonicalUrl = (page: DocsPageData): string => SITE.url + withTrailingSlash(page.url);

const isDocsRoot = (page: DocsPageData): boolean => withTrailingSlash(page.url) === DOCS_ROOT_URL;

/* The docs root is a hub of section entry points, not an article. */
const articleFor = (page: DocsPageData): JsonLdObject =>
  isDocsRoot(page)
    ? {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: page.data.title,
        ...(page.data.description !== undefined ? { description: page.data.description } : {}),
        url: canonicalUrl(page),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: page.data.title,
        ...(page.data.description !== undefined ? { description: page.data.description } : {}),
        url: canonicalUrl(page),
      };

const breadcrumbListFor = (page: DocsPageData): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbTrail(source.pageTree, page.url, page.data.title).map(
    (crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url !== undefined ? { item: SITE.url + crumb.url } : {}),
    }),
  ),
});

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
          <JsonLd data={articleFor(page)} />
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
