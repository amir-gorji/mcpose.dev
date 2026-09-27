# D08: Validate visual fidelity, complete user journeys, accessibility, and launch performance

## Outcome and dependencies

Provide reproducible evidence that the implemented D01-D07 redesign matches the design and works as a fast, accessible static site.
Set up the browser test harness early, then complete the full matrix after the implementation tickets land.
Do not equate a Figma prototype or a Lighthouse score with a validated website.

## Test tooling and commands

Retain the existing `node:test` static-export checks in `tests/build.test.mjs` and existing typecheck/lint commands.
There is no Playwright setup in the inspected repository; add `@playwright/test` and `@axe-core/playwright` as pinned dev dependencies, a small `playwright.config.ts`, and `test:e2e` script.
Use the repository's Playwright runner for every local browser check and screenshot; do not substitute an external browser agent.
Have browser tests serve the production `out/` from a deterministic local port, reuse an existing server only outside CI, and keep Pagefind available by building first.
Update tests that encode obsolete Nocturne copy, old routes, old install commands or the old prohibition on solid accent fills; preserve the underlying link, clipboard, noindex and metadata invariants.
Do not edit generated output to make a test pass.

Required sequence is `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, then `pnpm test:e2e` against that build.
Install Playwright browser binaries in CI using the installed test runner's documented command.
Attach traces on failure and screenshots/diffs as CI artifacts; use bounded retries only for evidence, not to hide reproducible failures.

## Visual matrix

Use Chromium for exact screenshot baselines at desktop 1440x1000 and mobile 390x844, in light and dark themes, with reduced motion enabled and a fixed device scale factor of 1.
Wait for document fonts and stable data; do not rely on arbitrary sleeps or capture during trace movement.
Baseline homepage top/full page, each explorer preset, v3/v2 middleware, quickstart, migration, package reference, search results/empty/error/cross-version states, version menu, missing-topic state and mobile navigation/TOC.
Reference Figma frames explicitly in the review; do not generate initial browser snapshots and auto-approve them without a Figma comparison.
Inspect component geometry, line breaks, SVG proportions, spacing, code density and focus treatment; per-pixel diffs alone cannot judge whether the first baseline is correct.
Use `maxDiffPixelRatio: 0.001` with a fixed browser/font environment for regression baselines; review every deliberate update.
Also check reflow at 320x800, 768x1024, 1024x768 and 1920x1080, and at 200% text/browser zoom.
Run functional smoke journeys in Chromium, Firefox and WebKit; screenshots need not be triplicated across engines.

## Required user journeys

1. Homepage to v3 quickstart, copy install command, copy complete sample, return through normal browser Back.
2. Select each explorer preset, run and replay, switch preset mid-run, background the tab, return, enable reduced motion mid-run, and verify only the selected preset's final state remains.
3. Follow v3 middleware deep link, switch to v2 equivalent, refresh, switch back and test Back/Forward; verify title, URL, sidebar, search scope and clipboard version all agree.
4. Request a v3-only topic in v2 and exercise all three displayed destination links; arbitrary unknown slugs still return 404.
5. Search `middleware` within v2, opt into v3, select a v3 result, reopen and verify scope now follows v3; simulate slow responses so stale results cannot win.
6. Exercise search blank/loading/results/no-results/network-failure/retry and clear-query states, including a version change while search is in flight.
7. Keyboard-only open/close every modal/menu/drawer using trigger, Escape and selection; focus never escapes a modal or disappears behind a sticky header.
8. Mobile navigation, version selection, TOC anchors, code horizontal scrolling and virtual-keyboard search remain usable with no document-level horizontal overflow.
9. Theme follows OS until explicitly chosen, persists across page navigation and reload, and tolerates unavailable storage.
10. Disable JavaScript and verify readable initial homepage/default example/docs, real navigation links and an explicit search-unavailable fallback.

Use public deterministic fixtures; never exercise real user MCP servers, execute arbitrary demo code or contact audit infrastructure in website tests.
For timing checks, assert state transitions and use controlled time where supported; do not encode race-prone wall-clock screenshot sleeps.

## Accessibility gate

Target WCAG 2.2 AA plus reduced-motion behavior and 44 px standalone control hit areas.
Run axe against every representative page and each open overlay in both themes; no serious/critical findings, no known color-contrast failure, and no unexplained moderate issue may remain.
Manually test keyboard-only flow, visible focus, 320 px reflow, zoom, VoiceOver with Safari and one Windows screen-reader/browser combination when available.
If a manual platform is unavailable, list it as unverified rather than claiming it passed; it remains a release evidence task.
Check headings/landmarks, link names, selected tabs, version labels, dialog names, status announcements, background inertness, focus restoration and live-region noise.
Normal text is at least 4.5:1, qualifying large text and meaningful non-text boundaries at least 3:1 where required.
Check rendered syntax colors, keycaps, disabled exceptions, tinted callouts and selected states; token contrast alone is insufficient.
Promote the current Lighthouse color-contrast warning to an error once the new UI fixes its known failures.

## Performance gate and measurement protocol

Reuse `.github/workflows/lighthouse.yml` and `.lighthouserc.json`; do not create a competing audit pipeline.
Audit the real preview of the exact candidate commit, three cold-cache mobile runs per route, median aggregation, with the pinned Lighthouse/Chrome versions and explicit device/network/CPU settings recorded in the artifact.
Routes: `/`, `/docs/v3/`, `/docs/v3/getting-started/quick-start/`, `/docs/v3/concepts/middleware-model/`, and `/docs/v2/concepts/middleware-model/`.
Set the project prelaunch targets to median LCP <=2000 ms, CLS <=0.05 and TBT <=150 ms; keep SEO and best-practices at 100 and require the new UI to resolve existing accessibility defects rather than preserve the current 95 score as an excuse.
The existing 3500 ms LCP limit and old deployment measurements are historical baselines, not acceptance of the new design.
Investigate failures and attach attribution; do not silently loosen a budget to make CI green.
If the pinned framework baseline makes the target unattainable, document the measured floor, attempted reductions and specific proposed budget change for an explicit decision before launch.
Provisional compressed JS ceilings are 180 KiB on homepage and 120 KiB on docs, including framework scripts, excluding Pagefind loaded only after open.
Measure both transferred bytes and decoded parse/execute cost from a cold trace; byte budgets are project constraints, not published web standards.
Search must not request Pagefind before first open; demo motion must not add a WebGL/video dependency or run perpetual requestAnimationFrame work.
Record interactions for preset changes, replay, opening search, typing a query, changing versions and copying code under 4x CPU slowdown; investigate tasks over 50 ms and present measured event durations.
Do not label TBT or these lab interactions as field INP.

After launch, field targets are p75 LCP <=2.5 s, INP <=200 ms and CLS <=0.1, assessed separately for mobile/desktop and homepage/docs where samples permit.
Use existing approved RUM or CrUX where available; insufficient samples means unknown, never an invented pass.
Do not provision analytics or add tracking without the relevant authorization.
[Google Web Vitals](https://web.dev/articles/vitals) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/) define the external standards; stricter lab budgets above are project decisions.

## Completion evidence

- [ ] All specified commands pass on the candidate commit, with static output preserved and no hydration/runtime errors.
- [ ] Figma comparison, browser screenshots, functional traces, contrast/axe results and manual-check notes are linked in the implementation PR.
- [ ] Every route, version/search state and interruption path above has either a passing check or a clearly recorded unresolved release blocker.
- [ ] Preview HTTP/canonical/redirect/noindex checks from D07 pass on the actual host.
- [ ] Release record confirms the final v3 source, all six library issue outcomes and compiled/copied version-correct examples.
- [ ] A concise completion report distinguishes automated evidence, manual evidence, lab budgets and still-pending postlaunch field data.

Do not deploy or claim the redesign complete while a required release gate remains unresolved.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D01 #6](https://github.com/amir-gorji/mcpose.dev/issues/6), [D02 #7](https://github.com/amir-gorji/mcpose.dev/issues/7), [D03 #8](https://github.com/amir-gorji/mcpose.dev/issues/8), [D04 #9](https://github.com/amir-gorji/mcpose.dev/issues/9), [D05 #10](https://github.com/amir-gorji/mcpose.dev/issues/10), [D06 #11](https://github.com/amir-gorji/mcpose.dev/issues/11), [D07 #12](https://github.com/amir-gorji/mcpose.dev/issues/12).
