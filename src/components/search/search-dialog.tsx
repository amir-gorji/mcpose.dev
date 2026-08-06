'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './search-dialog.module.css';

// Minimal typing of the Pagefind browser runtime (loaded from the static
// export at /pagefind/pagefind.js, emitted by the postbuild step).
type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: { title: string };
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

type ResultItem = {
  url: string;
  title: string;
  excerpt: string;
};

type SearchResult = {
  query: string;
  items: readonly ResultItem[];
};

type SearchDialogProps = {
  onClose: () => void;
};

const MAX_RESULTS = 8;
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
          response.results.slice(0, MAX_RESULTS).map((entry) => entry.data()),
        );
        if (cancelled) return;
        setResult({
          query: trimmed,
          items: data.map((entry) => ({
            url: entry.url,
            title: entry.meta.title,
            excerpt: entry.excerpt,
          })),
        });
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
          {loadFailed ? (
            <p className={styles.note}>
              Search index is built at build time. Run pnpm build &amp;&amp; pnpm serve to test
              locally.
            </p>
          ) : null}
          {items.length > 0 ? (
            <div className={styles.results} role="listbox" id={LISTBOX_ID} aria-label="Search results">
              {items.map((item, index) => (
                <a
                  key={item.url}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === selected}
                  href={item.url}
                  className={
                    index === selected ? `${styles.item} ${styles.itemSelected}` : styles.item
                  }
                  onMouseEnter={() => setSelected(index)}
                >
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span
                    className={styles.itemExcerpt}
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                </a>
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
