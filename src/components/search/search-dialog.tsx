'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DocsVersionId } from '@/lib/docs-versions';
import styles from './search-dialog.module.css';

type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    version?: string;
  };
};

type PagefindResult = {
  id: string;
  data: () => Promise<PagefindResultData>;
};

type PagefindSearchOptions = {
  filters?: {
    version?: string;
  };
};

type PagefindResponse = {
  results: PagefindResult[];
};

type Pagefind = {
  init: () => Promise<void>;
  search: (query: string, options?: PagefindSearchOptions) => Promise<PagefindResponse | null>;
};

const PAGEFIND_BUNDLE = '/pagefind/pagefind.js';
let pagefindPromise: Promise<Pagefind> | null = null;

const loadPagefind = (): Promise<Pagefind> => {
  pagefindPromise ??= (async () => {
    const pagefind = (await import(/* webpackIgnore: true */ PAGEFIND_BUNDLE)) as Pagefind;
    await pagefind.init();
    return pagefind;
  })().catch((error: unknown) => {
    pagefindPromise = null; // allow retry
    throw error;
  });
  return pagefindPromise;
};

interface SearchRow {
  url: string;
  title: string;
  excerpt: string;
  version: DocsVersionId;
}

interface SearchDialogProps {
  onClose: () => void;
}

const MAX_DISPLAY_RESULTS = 8;
const LISTBOX_ID = 'search-dialog-listbox';
const optionId = (index: number) => `search-option-${index}`;

// Sanitize excerpt to allow only text and safe <mark> tags
function sanitizeExcerpt(raw: string): string {
  return raw.replace(/<(?!\/?mark\b)[^>]*>/gi, '');
}

export default function SearchDialog({ onClose }: SearchDialogProps) {
  const pathname = usePathname();
  const initialVersion: DocsVersionId = pathname?.startsWith('/docs/v2') ? 'v2' : 'v3';

  const [activeVersion] = useState<DocsVersionId>(initialVersion);
  const [includeOtherVersion, setIncludeOtherVersion] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<
    'loading-index' | 'idle' | 'searching' | 'results' | 'empty' | 'error'
  >('idle');
  const [items, setItems] = useState<SearchRow[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const generationRef = useRef(0);
  const debounceTimerRef = useRef<number | null>(null);

  const otherVersion: DocsVersionId = activeVersion === 'v3' ? 'v2' : 'v3';

  // Mount setup: lock scroll, show modal, load pagefind
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    inputRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    loadPagefind().catch(() => setStatus('error'));

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleClose = useCallback(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onClose();
      return;
    }

    setIsClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 120);
  }, [onClose]);

  // Execute search with generation guard
  const executeSearch = useCallback(
    async (searchTerm: string, includeOther: boolean) => {
      const trimmed = searchTerm.trim();
      if (trimmed === '') {
        setItems([]);
        setStatus('idle');
        setSelectedIndex(0);
        return;
      }

      const currentGen = ++generationRef.current;
      setStatus('searching');

      try {
        const pagefind = await loadPagefind();
        if (currentGen !== generationRef.current) return;

        const options: PagefindSearchOptions = includeOther
          ? {}
          : { filters: { version: activeVersion } };

        const res = await pagefind.search(trimmed, options);
        if (currentGen !== generationRef.current) return;

        if (!res || res.results.length === 0) {
          setItems([]);
          setStatus('empty');
          setSelectedIndex(0);
          setLiveAnnouncement(`0 results for ${trimmed}`);
          return;
        }

        const dataEntries = await Promise.all(
          res.results.slice(0, MAX_DISPLAY_RESULTS).map((r) => r.data()),
        );
        if (currentGen !== generationRef.current) return;

        const rows: SearchRow[] = dataEntries.map((data) => {
          let rowVersion: DocsVersionId = activeVersion;
          if (data.url.includes('/docs/v2/')) rowVersion = 'v2';
          else if (data.url.includes('/docs/v3/')) rowVersion = 'v3';
          else if (data.meta.version === 'v2' || data.meta.version === 'v3') {
            rowVersion = data.meta.version;
          }

          return {
            url: data.url,
            title: data.meta.title || 'Documentation',
            excerpt: sanitizeExcerpt(data.excerpt || ''),
            version: rowVersion,
          };
        });

        setItems(rows);
        setStatus('results');
        setSelectedIndex(0);

        if (includeOther) {
          setLiveAnnouncement(`${rows.length} results across v2 and v3`);
        } else {
          setLiveAnnouncement(`${rows.length} results in ${activeVersion}`);
        }
      } catch {
        if (currentGen === generationRef.current) {
          setStatus('error');
        }
      }
    },
    [activeVersion],
  );

  // Debounce query changes (150ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    if (query.trim() === '') {
      return;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      executeSearch(query, includeOtherVersion);
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [executeSearch, includeOtherVersion, query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === '') {
      generationRef.current++;
      setItems([]);
      setStatus('idle');
      setSelectedIndex(0);
    }
  };

  // Handle version toggle immediately
  const handleToggleIncludeOther = () => {
    const nextVal = !includeOtherVersion;
    setIncludeOtherVersion(nextVal);
    if (query.trim() !== '') {
      executeSearch(query, nextVal);
    }
  };

  const handleRetry = () => {
    pagefindPromise = null;
    executeSearch(query, includeOtherVersion);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
      return;
    }

    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (selectedIndex + 1) % items.length;
      setSelectedIndex(next);
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (selectedIndex - 1 + items.length) % items.length;
      setSelectedIndex(next);
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = items[selectedIndex];
      if (selectedItem) {
        window.location.assign(selectedItem.url);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const isDev = process.env.NODE_ENV === 'development';
  const versionLabel = activeVersion === 'v3' ? 'v3 Current' : 'v2 Previous';

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.root} ${isClosing ? styles.closing : ''}`}
      onClose={handleClose}
      aria-label="Search documentation"
    >
      <div className={styles.backdrop} onClick={handleBackdropClick}>
        <div className={styles.panel} role="dialog" aria-modal="true">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>Search documentation</h2>
              <span className={styles.currentVersionTag}>{versionLabel}</span>
            </div>

            <label className={styles.versionControl}>
              <input
                type="checkbox"
                checked={includeOtherVersion}
                onChange={handleToggleIncludeOther}
              />
              <span>Include {otherVersion} results</span>
            </label>

            <button
              type="button"
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close search"
            >
              ✕
            </button>
          </div>

          {/* Input field */}
          <div className={styles.inputWrap}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              placeholder="Search documentation…"
              aria-label="Search documentation"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={items.length > 0}
              aria-controls={LISTBOX_ID}
              aria-activedescendant={
                items.length > 0 ? optionId(selectedIndex) : undefined
              }
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Status row (reserved 22px) */}
          <div className={styles.statusRow}>
            {status === 'idle' && (
              <span>Search by topic, package, or API</span>
            )}
            {status === 'searching' && <span>Searching…</span>}
            {status === 'empty' && (
              <span>No results for “{query.trim()}”</span>
            )}
            {status === 'error' && (
              <div className={styles.errorState}>
                <span>
                  Search is unavailable. Try again.
                  {isDev &&
                    ' (Search is built with the static export. Run pnpm build and pnpm serve.)'}
                </span>
                <button
                  type="button"
                  className={styles.retryBtn}
                  onClick={handleRetry}
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Results listbox */}
          {items.length > 0 && (
            <div
              id={LISTBOX_ID}
              role="listbox"
              aria-label="Search results"
              className={styles.resultsList}
            >
              {items.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <a
                    key={`${item.url}-${item.version}`}
                    id={optionId(idx)}
                    role="option"
                    aria-selected={isSelected}
                    href={item.url}
                    className={`${styles.resultRow} ${
                      isSelected ? styles.resultRowActive : ''
                    }`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className={styles.rowHeader}>
                      <span className={styles.rowTitle}>{item.title}</span>
                      <span
                        className={`${styles.versionBadge} ${
                          item.version === 'v3'
                            ? styles.badgeV3
                            : styles.badgeV2
                        }`}
                      >
                        {item.version}
                      </span>
                    </div>
                    {item.excerpt && (
                      <span
                        className={styles.rowExcerpt}
                        dangerouslySetInnerHTML={{ __html: item.excerpt }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          )}

          {/* Live region for screen readers */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {liveAnnouncement}
          </div>
        </div>
      </div>
    </dialog>
  );
}
