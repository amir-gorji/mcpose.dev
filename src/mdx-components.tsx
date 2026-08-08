import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import CodeBlockFrame from '@/components/code-block';
import CopyButton from '@/components/copy-button';
import LinkCard, { LinkCards } from '@/components/docs/link-card';
import Note from '@/components/docs/note-card';
import styles from '@/components/docs/docs-article.module.css';
import { withTrailingSlash } from '@/lib/docs-tree';

const cx = (...classes: ReadonlyArray<string | undefined>): string =>
  classes.filter(Boolean).join(' ');

type PreProps = ComponentPropsWithoutRef<'pre'> & {
  'data-title'?: string;
  'data-copy'?: string;
};

/* Fenced code — the shiki pipeline lands the fence meta on the <pre> as
   data-title / data-copy (src/lib/shiki-transformers.ts). Wrap it in the
   shared CodeBlockFrame; copy="none" fences get no button. A native title
   prop (fumadocs' own meta handling) is kept off the DOM node and used
   only as a fallback for the frame header. */
const Pre = ({ 'data-title': title, 'data-copy': copy, title: nativeTitle, ...rest }: PreProps) => (
  <div className={styles.codeFrame}>
    <CodeBlockFrame
      {...((title ?? nativeTitle) === undefined ? {} : { title: title ?? nativeTitle })}
      action={
        copy === undefined ? undefined : (
          <CopyButton
            text={copy}
            style={{ fontSize: 11, padding: 'var(--space-1) var(--space-3)' }}
          />
        )
      }
    >
      <pre {...rest} />
    </CodeBlockFrame>
  </div>
);

/* Prose anchors. LinkCard already routes through next/link; markdown-syntax
   links did not, so every in-prose hop between docs pages was a full document
   load. Three shapes, three behaviours:
     "#id"   in-page anchor, plain <a>, never normalised
     "http…" external, plain <a> with rel
     "/…"    internal, next/link, normalised to the trailing-slash canonical
             form that next.config's trailingSlash: true expects
   Path and fragment are normalised separately, or /docs/x/#y would become
   /docs/x/#y/ — two of the internal links are exactly that shape. */
const Anchor = ({ href, className, children, ...rest }: ComponentPropsWithoutRef<'a'>) => {
  const cls = cx(styles.link, className);

  if (href === undefined || href.startsWith('#')) {
    return (
      <a {...rest} href={href} className={cls}>
        {children}
      </a>
    );
  }
  if (!href.startsWith('/')) {
    return (
      <a {...rest} href={href} className={cls} rel="noreferrer">
        {children}
      </a>
    );
  }

  const hashAt = href.indexOf('#');
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : href.slice(hashAt);

  return (
    <Link {...rest} href={`${withTrailingSlash(path)}${hash}`} className={cls}>
      {children}
    </Link>
  );
};

export const getMDXComponents = (overrides: MDXComponents = {}): MDXComponents => ({
  pre: Pre,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 {...props} className={cx(styles.sectionHeading, props.className)} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p {...props} className={cx(styles.paragraph, props.className)} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul {...props} className={cx(styles.list, props.className)} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li {...props} className={cx(styles.listItem, props.className)} />
  ),
  a: Anchor,
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code {...props} className={cx(styles.inlineCode, props.className)} />
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <table {...props} className={cx('table', styles.docsTable, props.className)} />
  ),
  Note,
  LinkCards,
  LinkCard,
  ...overrides,
});
