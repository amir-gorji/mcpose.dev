'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './search-dialog.module.css';

// Minimal typing of the Pagefind browser runtime (loaded from the static
// export at /pagefind/pagefind.js, emitted by the postbuild step).
type PagefindAnchor = {
  element: string;
  id: string;
  text: string;
  location: number;
};

/* Pagefind derives these from the heading anchors it already indexes — 153 of
   them across the 19 docs pages. Only sections that actually matched appear.
   The first entry, when present, is the region before the first heading: it
   carries the page title, the page URL with no fragment, and no `anchor`. */
type PagefindSubResult = {
  title: string;
  url: string;
  excerpt: string;
  anchor?: PagefindAnchor;
};

type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: { title: string };
  anchors: PagefindAnchor[];
  sub_results: PagefindSubResult[];
};

type PagefindResult = {
  data: () => Promise<PagefindResultData>;
};

type Pagefind = {
  init: () => Promise<void>;
  debouncedSearch: (query: string) => Promise<{ results: PagefindResult[] } | null>;
};

// The bundle lives outside the app bundle; keep the specifier opaque so the
// bundler leaves the import to the browser at runtime.
const PAGEFIND_BUNDLE: string = '/pagefind/pagefind.js';

let pagefindPromise: Promise<Pagefind> | null = null;

const loadPagefind = (): Promise<Pagefind> => {
  pagefindPromise ??= (async () => {
    const pagefind = (await import(/* webpackIgnore: true */ PAGEFIND_BUNDLE)) as Pagefind;
    await pagefind.init();
    return pagefind;
  })().catch((error: unknown) => {
    pagefindPromise = null; // allow a retry on the next open
    throw error;
  });
  return pagefindPromise;
};

/* Pages and the sections inside them are flattened into one list so the
   keyboard model stays a single integer index: arrow keys walk section rows
   exactly like page rows, and Enter needs no special case. `pageIndex` only
   groups rows for rendering. */
type ResultRow = {
  kind: 'page' | 'section';
  pageIndex: number;
  pageTitle: string;
  url: string;
  title: string;
  excerpt: string;
};

type ResultGroup = {
  pageIndex: number;
  pageTitle: string;
  rows: readonly (ResultRow & { flatIndex: number })[];
};

type SearchResult = {
  query: string;
  items: readonly ResultRow[];
};

type SearchDialogProps = {
  onClose: () => void;
};

/* 5 pages x (1 page row + up to 3 sections) = at most 20 rows. The results
   pane scrolls and moveSelection already scrolls the active row into view. */
const MAX_PAGES = 5;
const MAX_SECTIONS_PER_PAGE = 3;

const toRows = (data: readonly PagefindResultData[]): ResultRow[] => {
  const rows: ResultRow[] = [];
  data.forEach((entry, pageIndex) => {
    /* The lead sub-result is the pre-heading region: same URL as the page, no
       anchor. Rendering it alongside the page row would repeat the same href
       twice, so absorb its excerpt (which is the more precise one) instead. */
    const lead = entry.sub_results.find((sub) => sub.anchor === undefined);
    rows.push({
      kind: 'page',
      pageIndex,
      pageTitle: entry.meta.title,
      url: entry.url,
      title: entry.meta.title,
      excerpt: lead?.excerpt ?? entry.excerpt,
    });
    for (const sub of entry.sub_results
      .filter((candidate) => candidate.anchor !== undefined)
      .slice(0, MAX_SECTIONS_PER_PAGE)) {
      rows.push({
        kind: 'section',
        pageIndex,
        pageTitle: entry.meta.title,
        url: sub.url,
        title: sub.title,
        excerpt: sub.excerpt,
      });
    }
  });
  return rows;
};

const toGroups = (rows: readonly ResultRow[]): ResultGroup[] => {
  const groups: ResultGroup[] = [];
  rows.forEach((row, flatIndex) => {
    const last = groups[groups.length - 1];
    if (last !== undefined && last.pageIndex === row.pageIndex) {
      groups[groups.length - 1] = {
        ...last,
        rows: [...last.rows, { ...row, flatIndex }],
      };
      return;
    }
    groups.push({
      pageIndex: row.pageIndex,
      pageTitle: row.pageTitle,
      rows: [{ ...row, flatIndex }],
    });
  });
  return groups;
};
const FAILURE_MSG =
  process.env.NODE_ENV === 'development'
    ? 'Search index is built at build time. Run pnpm build && pnpm serve to test locally.'
    : 'Search is unavailable. Try again shortly.';
const LISTBOX_ID = 'search-dialog-listbox';
const optionId = (index: number) => `search-dialog-option-${index}`;

const SearchDialog = ({ onClose }: SearchDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [selected, setSelected] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);

  const items = result?.items ?? [];
  const searchedQuery = result?.query ?? '';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    loadPagefind().catch(() => setLoadFailed(true));
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === '') return;
    let cancelled = false;
    void (async () => {
      try {
        const pagefind = await loadPagefind();
        // debouncedSearch debounces internally and resolves null for queries
        // superseded by a newer keystroke — drop those.
        const response = await pagefind.debouncedSearch(trimmed);
        if (response === null || cancelled) return;
        const data = await Promise.all(
          response.results.slice(0, MAX_PAGES).map((entry) => entry.data()),
        );
        if (cancelled) return;
        setLoadFailed(false); // clear a stale failure now that a search succeeded
        setResult({ query: trimmed, items: toRows(data) });
        setSelected(0);
      } catch {
        if (!cancelled) setLoadFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const moveSelection = (delta: number) => {
    const next = (selected + delta + items.length) % items.length;
    setSelected(next);
    document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSelection(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSelection(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = items[selected];
      if (item) window.location.assign(item.url);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (event.target.value.trim() === '') {
      setResult(null);
      setSelected(0);
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  };

  return (
    <dialog ref={dialogRef} className={styles.root} onClose={onClose} aria-label="Search docs">
      <div className={`dialog-backdrop ${styles.backdrop}`} onClick={handleBackdropClick}>
        <div className={`dialog ${styles.panel}`}>
          <input
            ref={inputRef}
            className="input"
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search docs…"
            aria-label="Search docs"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={items.length > 0}
            aria-controls={LISTBOX_ID}
            aria-activedescendant={items.length > 0 ? optionId(selected) : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          {loadFailed ? <p className={styles.note}>{FAILURE_MSG}</p> : null}
          {items.length > 0 ? (
            <div className={styles.results} role="listbox" id={LISTBOX_ID} aria-label="Search results">
              {/* role="listbox" only admits option and group children, so each
                  page's rows are wrapped rather than flattened into the DOM. */}
              {toGroups(items).map((group) => (
                <div key={group.pageIndex} role="group" aria-label={group.pageTitle}>
                  {group.rows.map((row) => (
                    <a
                      key={row.url}
                      id={optionId(row.flatIndex)}
                      role="option"
                      aria-selected={row.flatIndex === selected}
                      href={row.url}
                      data-kind={row.kind}
                      className={
                        row.flatIndex === selected
                          ? `${styles.item} ${styles.itemSelected}`
                          : styles.item
                      }
                      onMouseEnter={() => setSelected(row.flatIndex)}
                    >
                      <span className={styles.itemTitle}>{row.title}</span>
                      <span
                        className={styles.itemExcerpt}
                        dangerouslySetInnerHTML={{ __html: row.excerpt }}
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {!loadFailed && items.length === 0 && searchedQuery !== '' ? (
            <p className={styles.empty}>No results for ‘{searchedQuery}’</p>
          ) : null}
        </div>
      </div>
    </dialog>
  );
};

export default SearchDialog;
