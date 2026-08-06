import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import CodeBlockFrame from '@/components/code-block';
import CopyButton from '@/components/copy-button';
import LinkCard, { LinkCards } from '@/components/docs/link-card';
import Note from '@/components/docs/note-card';
import styles from '@/components/docs/docs-article.module.css';
import { SITE } from '@/lib/site';

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
      title={title ?? nativeTitle ?? ''}
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

const EditLink = () => (
  <div className={styles.editLinkWrap}>
    <a className={styles.editLink} href={SITE.github}>
      Edit this page on GitHub →
    </a>
  </div>
);

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
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a {...props} className={cx(styles.link, props.className)} />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code {...props} className={cx(styles.inlineCode, props.className)} />
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <table {...props} className={cx('table', styles.docsTable, props.className)} />
  ),
  Note,
  LinkCards,
  LinkCard,
  EditLink,
  ...overrides,
});
