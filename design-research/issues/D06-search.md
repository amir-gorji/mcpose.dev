# D06: Scope documentation search to version and make its states explicit

### Problem

The current search dialog lazily loads Pagefind, searches one unversioned corpus, and reports results without showing which documentation version a result belongs to.

After v2 and v3 coexist, a developer searching an API could receive incompatible examples from another major version without realizing it.

### Outcome

Make search version-aware, default to the version in the current docs URL, and let a user explicitly include results from the other version.

Keep search lazy-loaded and statically indexed so search does not add work to first render.

Depends on D01 controls, D04 metadata and D05 shell integration.
Use the existing Pagefind 1.5.2 and native dialog; there is no need for a new search service or UI framework.
Additional reference frames: cross-version `21:231`, v2 `26:104`, empty `18:114`, mobile `24:100` in the same [Figma file](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc).

### Search behavior and states

Use the Figma references `Search · v3` (`10:10`) and the `Search No results` state in the Figma Screens page as visual authority for the compact centered dialog, backdrop, row hierarchy, current-version label, and selected result treatment.

The browser URL is the source of selected version; on `/docs/v3/...`, initialize search with v3 selected, and on `/docs/v2/...`, initialize with v2 selected.

From the unversioned docs hub or landing page, default to v3 after release.

The dialog header must say `Search documentation` and show a selected-version control with the label `v3 Current` or `v2 Previous`.

The version control defaults to the page's version and offers a checkbox named `Include v2 results` while in v3 and `Include v3 results` while in v2.

Always show a visible badge on every result identifying `v2` or `v3`; when cross-version search is disabled, exclude results from the other version.

Debounce query edits for 150 ms, then call the Pagefind search API once; do not stack this debounce with debouncedSearch.
Display up to eight results and apply scope changes immediately even when the query text did not change.

Each result shows the page title, a two-line excerpt with safely rendered search highlights, and a visible version badge on every result in both scopes.

Selecting a result navigates to the canonical versioned result URL and closes the dialog through normal document navigation.

Keyboard `ArrowDown` and `ArrowUp` move the active selection, `Enter` navigates to it, and `Escape` closes the dialog and restores focus to the search trigger.

`Cmd+K` on macOS and `Ctrl+K` elsewhere open the dialog from the existing trigger; do not capture the shortcut while a user is typing in an input, textarea, select, or editable region.

The dialog initially shows the exact prompt `Search by topic, package, or API` instead of a blank empty-results region.

Use that exact prompt, not placeholder lorem ipsum or arbitrary popular-query suggestions.
Use the finite states closed, loading-index, idle, searching, results, empty and error.
Loading-index/searching displays `Searching…` in a reserved 22 px status row, keeps the query/scope controls usable and does not flash a zero-result state before completion.
Clear stale visible matches when query or scope changes, increment a request-generation token, and ignore every old async result after clear/close/scope change or a newer query.
Open always starts with blank query and single-version scope derived from the current route; closing does not navigate or change the page's major version.
Cross-version opt-in reruns the existing query immediately; it is not persisted to future openings.
On a completed search announce `<N> results in v3`, `<N> results in v2` or `<N> results across v2 and v3`; results retain Pagefind's rank order, not a made-up global rank merge.
Use the result's canonical URL/version metadata as its identity; duplicate titles in different majors remain distinct results.
Ignore query text containing only whitespace; do not request a search until nonblank input exists.

During a query, expose a polite live status with the result count after search completes; do not announce each keystroke or individual excerpt.

For a completed query with zero results, show `No results for “{query}”` and retain the selected-version control so users can opt into the other version.

For a Pagefind load or query error, show the existing failure copy and a retry action; retry clears the error and requests index loading/search again.

Production error text is `Search is unavailable. Try again.` with a `Retry` button; retain query and scope and re-run them on retry.
In development only, append `Search is built with the static export. Run pnpm build and pnpm serve.`.
Retry must clear the rejected module-load promise so a previous failure cannot permanently poison later opens.

Clearing the query returns to the initial prompt and resets active selection to the first result position.

On mobile, use a full-width dialog panel with 16 px side gutters, the query field and version control stacked, result rows at least 44 px tall, and a results list constrained to the visual viewport with internal scrolling.

Desktop panel is 760 px max width, 32 px padding, 16 px radius, 1 px border and shadow `0 16px 48px rgba(0,0,0,0.16)`; scrim is black at 0.32 opacity.
Place the desktop panel 96 px from the top with max-height calc(100dvh - 128px); at <768 use top 16 px, 16 px gutters, 24 px padding, max-height calc(100dvh - 32px) and safe-area-aware bottom padding.
The results area scrolls; header/query/scope remain visible when the virtual keyboard reduces the viewport.
Input height is 48 px with a visible focus outline; result rows use 16 px padding, 8 px gap, 8 px radius and tint when active.
Use native dialog modal semantics, a visible Close button on every size, and a backdrop click only when the click target is the backdrop itself.
Close exactly once; restore the original trigger if still connected, otherwise focus the current page's search trigger.

Opening the dialog locks background scroll, moving focus into the input; closing by Escape or backdrop click restores the prior focus target.

Opening uses a 150 ms opacity fade on the scrim and a 150 ms opacity plus translateY(8px to 0) transition on the panel, easing cubic-bezier(0.2,0,0,1).
Closing reverses that transition for 120 ms, then unmounts and restores focus; reduced motion opens/closes immediately with no transform or fade.

Use one Pagefind index with a version filter, never a custom merged index or external search service.
Filter results by metadata before fetching result data; the shared index may fetch common chunks, which is not a promise of version-isolated network bytes.

### Index and version filters

Use D04's canonical `/docs/v2/` and `/docs/v3/` route prefixes to define index filters.

Configure Pagefind to include only canonical versioned article bodies and exclude the docs version chooser, static compatibility aliases, not-found pages, and any unavailable-topic pages whose only purpose is explaining that content is absent.

Preserve the existing rule that `stub: true` pages are noindex and excluded from the search body.

Keep the search index statically generated by the current `postbuild` Pagefind step.

Add `version` filter and metadata to canonical article roots, using the Pagefind documented data attributes.
Call `pagefind.search(query, { filters: { version: selectedVersion } })` for one major; omit the filter only for explicit cross-version opt-in.
See [Pagefind filters](https://pagefind.app/docs/filtering/) and [JavaScript filtering](https://pagefind.app/docs/js-api-filtering/).

Do not infer a result's version from its display title; use a stable URL prefix or explicit Pagefind metadata.

Safely render excerpt highlighting: allow text plus Pagefind-generated mark emphasis only, never arbitrary HTML/event attributes or query text as executable markup.
Verify this with an HTML-like query and a fixture containing angle brackets.
Do not fetch result fragments beyond the visible first eight merely to calculate a count; use Pagefind's reported match count and fetch displayed rows only.
A no-JavaScript search trigger provides a message and direct docs links instead of opening a nonfunctional dialog.

Search results must use canonical URLs so aliases never appear as duplicate matches.

### Likely touchpoints

Adapt `src/components/search/search-trigger.tsx`, `src/components/search/search-trigger.module.css`, `src/components/search/search-dialog.tsx`, and `src/components/search/search-dialog.module.css`.

Inspect and update `package.json` postbuild behavior only only if required to attach the canonical metadata; retain a single index build.

Likely update docs content root attributes in `src/app/docs/[version]/[[...slug]]/page.tsx` after D04 migrates the old catch-all and static-index assertions in `tests/build.test.mjs`.

Reuse existing lazy loader, native `<dialog>`, focus restore, result keyboard navigation, cancellation guard, and body scroll lock wherever possible.

### Acceptance criteria

- Searching on any v3 route returns only v3 results by default, and searching on any v2 route returns only v2 results by default.
- Enabling cross-version search returns results from both versions and each result displays the correct major-version badge.
- Disabling cross-version search immediately reruns the current query and removes other-version results without changing the current page version.
- Search result URLs always use `/docs/v2/` or `/docs/v3/`, never old unversioned aliases.
- The result title, excerpt, version badge, zero-results message, loading prompt, and failure/retry state all render correctly.
- Arrow navigation wraps across available results, updates `aria-activedescendant` and visual selection, and scrolls the selected row into view.
- Enter opens the selected result; Escape and backdrop dismissal close the dialog and restore focus.
- Focus remains trapped in the modal while open, background scroll is restored on every close/unmount path, and the dialog has an accessible name.
- Search controls and results work with keyboard and touch, have visible focus and practical 44 px touch targets, and expose live result count without noisy announcements.
- The search trigger does not intercept Cmd/Ctrl+K when focus is inside a text-editing control.
- Reduced-motion preference removes panel translation and keeps the dialog fully usable.
- Static output contains only canonical versioned docs in the searchable index; compatibility aliases and unavailable-topic placeholders do not create duplicate or false results.
- Build tests verify route scoping, result URL version prefixes, index exclusions, cross-version opt-in metadata, and the legacy unversioned query entry behavior.

### Dependencies

Requires D04 canonical route prefixes and version metadata.

Requires D05's selected-version label and version registry, but can be implemented in parallel once D04's API is agreed.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D01 #6](https://github.com/amir-gorji/mcpose.dev/issues/6), [D04 #9](https://github.com/amir-gorji/mcpose.dev/issues/9), [D05 #10](https://github.com/amir-gorji/mcpose.dev/issues/10).
