import { findNeighbour } from 'fumadocs-core/page-tree';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/docs/breadcrumb';
import Pager from '@/components/docs/pager';
import Toc, { MobileToc } from '@/components/docs/toc';
import JsonLd, { type JsonLdObject } from '@/components/seo/json-ld';
import { breadcrumbTrail, withTrailingSlash } from '@/lib/docs-tree';
import { SITE } from '@/lib/site';
import { generateVersionParams, getVersionPage, getVersionPageTree, source } from '@/lib/source';
import type { DocsVersionId } from '@/lib/docs-versions';
import { getMDXComponents } from '@/mdx-components';

import styles from '@/app/docs/docs-shell.module.css';

export const dynamicParams = false;

export const generateStaticParams = () => generateVersionParams();

type PageProps = {
  params: Promise<{ version: string; slug?: string[] }>;
};

type DocsPageData = NonNullable<ReturnType<typeof getVersionPage>>;

const canonicalUrl = (page: DocsPageData): string => SITE.url + withTrailingSlash(page.url);

const isVersionRoot = (page: DocsPageData, version: string): boolean =>
  withTrailingSlash(page.url) === `/docs/${version}/`;

const articleFor = (page: DocsPageData, version: string): JsonLdObject =>
  isVersionRoot(page, version)
    ? {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${page.data.title} (${version})`,
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

const breadcrumbListFor = (page: DocsPageData, version: DocsVersionId): JsonLdObject => {
  const tree = getVersionPageTree(version);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbTrail(tree, page.url, page.data.title, version).map(
      (crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        ...(crumb.url !== undefined ? { item: SITE.url + crumb.url } : {}),
      }),
    ),
  };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { version, slug } = await params;
  if (version !== 'v3' && version !== 'v2') return { title: 'Not Found' };

  const page = getVersionPage(version, slug);
  if (!page) return { title: 'Not Found' };

  const canonical = canonicalUrl(page);
  const title = `${page.data.title} | mcpose ${version} docs`;
  const isStub = page.data.stub === true;

  return {
    title,
    description: page.data.description ?? SITE.description,
    alternates: {
      canonical: isStub ? undefined : canonical,
    },
    robots: isStub ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: page.data.description ?? SITE.description,
      url: canonical,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.data.description ?? SITE.description,
      images: ['/opengraph-image'],
    },
  };
};

export default async function DocsPage({ params }: PageProps) {
  const { version, slug } = await params;
  if (version !== 'v3' && version !== 'v2') notFound();

  const typedVersion = version as DocsVersionId;
  const page = getVersionPage(version, slug);
  if (!page) notFound();

  const pageTree = getVersionPageTree(typedVersion);
  const neighbour = findNeighbour(pageTree, page.url);
  const prevPage = page.data.prev ? source.getPage([page.data.prev]) : neighbour.previous;
  const nextPage = page.data.next ? source.getPage([page.data.next]) : neighbour.next;

  const prevTarget = prevPage
    ? {
        title: 'name' in prevPage ? String(prevPage.name) : prevPage.data.title,
        url: withTrailingSlash(prevPage.url),
      }
    : undefined;

  const nextTarget = nextPage
    ? {
        title: 'name' in nextPage ? String(nextPage.name) : nextPage.data.title,
        url: withTrailingSlash(nextPage.url),
      }
    : undefined;

  const MDX = page.data.body;
  const isStub = page.data.stub === true;

  return (
    <>
      <JsonLd data={articleFor(page, version)} />
      <JsonLd data={breadcrumbListFor(page, typedVersion)} />
      <main id="main-content" className={styles.main}>
        <article
          className={styles.article}
          {...(isStub
            ? {}
            : {
                'data-pagefind-body': true,
                'data-pagefind-filter': `version:${version}`,
                'data-pagefind-meta': `version:${version}`,
              })}
        >
          <Breadcrumb trail={breadcrumbTrail(pageTree, page.url, page.data.title, typedVersion)} />
          <h1 className={styles.title}>{page.data.title}</h1>
          <MobileToc items={page.data.toc} />
          <MDX components={getMDXComponents({ h1: () => null })} />
          <Pager prev={prevTarget} next={nextTarget} />
        </article>
      </main>
      <Toc items={page.data.toc} />
    </>
  );
}
