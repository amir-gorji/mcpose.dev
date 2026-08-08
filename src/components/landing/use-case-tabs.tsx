'use client';

import { useId, useRef, useState, type ReactNode } from 'react';

import CodeBlockFrame from '@/components/code-block';

import styles from './use-case-tabs.module.css';

export type UseCase = {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
  readonly href: string;
  /* Pre-highlighted at build time by the server component that renders this. */
  readonly html: string;
};

type UseCaseTabsProps = {
  cases: readonly UseCase[];
  footer?: ReactNode;
};

/* Roving tabindex: only the active tab is reachable by Tab, and the arrow keys
   move between them. No timer and no autoplay, so there is nothing here that
   needs a reduced-motion guard. */
const UseCaseTabs = ({ cases, footer }: UseCaseTabsProps) => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const focusTab = (index: number) => {
    const next = (index + cases.length) % cases.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTab(cases.length - 1);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="What mcpose is used for" className={styles.tablist}>
        {cases.map((useCase, index) => (
          <button
            key={useCase.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${useCase.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${useCase.id}`}
            tabIndex={index === active ? 0 : -1}
            className={index === active ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {useCase.label}
          </button>
        ))}
      </div>

      {cases.map((useCase, index) => (
        <div
          key={useCase.id}
          role="tabpanel"
          id={`${baseId}-panel-${useCase.id}`}
          aria-labelledby={`${baseId}-tab-${useCase.id}`}
          /* Plain boolean hidden. hidden="until-found" would keep the
             inactive panels findable by in-page search, but React coerces
             `hidden` to a boolean attribute and emits hidden="", so asking
             for it would document behaviour the DOM never gets. */
          hidden={index !== active}
          className={styles.panel}
        >
          <p className={styles.caption}>{useCase.caption}</p>
          <div className={styles.code}>
            <CodeBlockFrame title="proxy.ts" lang="TypeScript" lineHeight={1.7}>
              <div dangerouslySetInnerHTML={{ __html: useCase.html }} />
            </CodeBlockFrame>
          </div>
          <a className={styles.link} href={useCase.href}>
            Read the recipe →
          </a>
        </div>
      ))}
      {footer}
    </div>
  );
};

export default UseCaseTabs;
