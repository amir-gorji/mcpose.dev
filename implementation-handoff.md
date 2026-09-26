# mcpose.dev v3 implementation handoff

Prepared 2026-09-26 for the agent implementing the approved redesign.
Website repository: `amir-gorji/mcpose.dev`, local checkout `/Users/amir/Documents/mcpose.dev`.
Library repository: `amir-gorji/mcpose`, local checkout `/Users/amir/Documents/mcpose`.
Website baseline inspected: `424bfce39c71df5667da86711a9719c5d94625b8`.
This handoff specifies future implementation; the redesign has not yet been implemented or deployed.

## Start here

Implement [epic #5](https://github.com/amir-gorji/mcpose.dev/issues/5) and its eight child issues.
Use the existing stack and the approved design, not a new aesthetic exploration.
Read the chosen ticket in full before editing; each includes exact behavior and acceptance checks.
Do not read all 12,000 words of ticket detail into every subagent's context.
Give a bounded subagent only this summary, its assigned issue, relevant source files and relevant Figma frames.
Use a cheaper model for bounded component work, fixture checks, provenance checks and tests; keep cross-ticket reconciliation, source correctness and final visual review with the lead.

First inspect the working tree and preserve existing user changes.
The research, exported assets, ticket mirrors and this handoff were produced locally; if starting from a fresh clone, retrieve the linked GitHub issues and Figma assets or carry this bundle across.
Do not mistake untracked handoff files for disposable build output.
This planning task did not create a branch, commit, implementation PR or deployment.

## Product and design definition

Good design makes composable MCP middleware memorable through exploration, then makes using it precise and effortless.
The concept is **The space between**: a request passes through middleware, something meaningful changes, and the response returns.
Homepage headline is **Make MCP work your way.**
Lead with a general-purpose TypeScript MCP proxy; policy, consent, audit, observability and persistence demonstrate its versatility.
Do not turn the product into a compliance-only offering, hosted control plane or visual workflow builder.
The homepage may be expressive; documentation must be calm, readable and dependable.
The site launches after v3 is released: v3 is Current/default, v2 is Previous, not automatically unsupported.

## Work index

| Order / ID | GitHub issue | Local detailed mirror | Dependencies |
| --- | --- | --- | --- |
| D01 | [#6 Design system](https://github.com/amir-gorji/mcpose.dev/issues/6) | [D01-foundations.md](design-research/issues/D01-foundations.md) | Independent foundation |
| D02 | [#7 Homepage](https://github.com/amir-gorji/mcpose.dev/issues/7) | [D02-homepage.md](design-research/issues/D02-homepage.md) | D01; route contract D04 |
| D03 | [#8 Request explorer](https://github.com/amir-gorji/mcpose.dev/issues/8) | [D03-explorer.md](design-research/issues/D03-explorer.md) | D01, D02; guide routes D04 |
| D04 | [#9 Versioned docs and provenance](https://github.com/amir-gorji/mcpose.dev/issues/9) | [D04-versioned-routes.md](design-research/issues/D04-versioned-routes.md) | Independent foundation; coordinate redirects with D07 |
| D05 | [#10 Documentation UI and content](https://github.com/amir-gorji/mcpose.dev/issues/10) | [D05-documentation.md](design-research/issues/D05-documentation.md) | D01, D04 |
| D06 | [#11 Version-aware search](https://github.com/amir-gorji/mcpose.dev/issues/11) | [D06-search.md](design-research/issues/D06-search.md) | D01, D04; integrate with D05 |
| D07 | [#12 SEO and release workflow](https://github.com/amir-gorji/mcpose.dev/issues/12) | [D07-seo-release.md](design-research/issues/D07-seo-release.md) | Establish workflow first; final route/content/evidence depends on D04/D05/D08 |
| D08 | [#13 Validation](https://github.com/amir-gorji/mcpose.dev/issues/13) | [D08-validation.md](design-research/issues/D08-validation.md) | Set up harness early; full matrix after other work |

All eight are actual child issues of epic #5.
The links above, not bare issue numbers, distinguish website tickets from the library's separate issue tracker.

## Implementation sequence

1. Establish `codex/v3-site-redesign` and the draft integration PR/preview workflow from D07; main currently auto-deploys.
2. Implement D01 and D04 independently, with one owner for shared token files and one for route/content registry files.
3. Agree the immutable version/topic manifest before parallel work on documentation shell and search.
4. Implement D02 and D05; implement D03 against the homepage slot and D06 against the docs metadata.
5. Run D08 checks during development, not only after all visual work; fix regressions at their source.
6. Complete D07 redirects/metadata, released-API validation and D08 cross-browser/visual/performance evidence.
7. Keep the integration PR draft until the actual v3 release and all launch gates pass; then mark that existing PR ready for the normal merge/release workflow.

No production publication is authorized merely by receiving this planning handoff.
Do not merge unfinished work into main to obtain a preview.
Use existing Workers version previews, which do not move the production domain.

## Source-of-truth order

1. Verified released library behavior and actual package exports determine technical facts.
2. The implementation issue contracts determine routes, state transitions, cancellation, responsive behavior and acceptance.
3. Figma determines resting visual composition, exact artwork, hierarchy and typography.
4. Research explains the rationale and external standards.

If the library release changes a documented API, update the code sample, fixture, prose and test together and record the reason.
Do not invent a replacement API to satisfy a screenshot.
If a required fact is still unresolved, finish independent layout work and leave that content/release gate explicitly blocked.
Do not silently weaken a performance budget or redesign a component to avoid a difficult check.

The following are intentional corrections to prototype shortcuts:

- The explorer is an inline homepage experience, not a 1200 px overlay on a phone.
- Version switching maps the actual current topic, not every page to the middleware example.
- Search executes Pagefind queries and filtering; Figma's static rows are visual examples.
- Mobile explorer tabs use the ticket's compact 2x2 control layout, backed by the same fixtures as desktop.
- Code examples are checked against final source and preserve unwrapped clipboard text.
- Unavailable-topic copy distinguishes verified v3 introductions from other absent historical content.

## Figma entry points

File: [mcpose.dev / v3 / The composable MCP proxy](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc).
Pages: Cover `0:1`, Getting Started `4:2`, Foundations `4:3`, Components `4:4`, Website Screens `4:5`, Utilities Handoff `4:6`.

| Surface | Node IDs |
| --- | --- |
| Homepage light / dark / mobile | `10:2`, `10:3`, `10:4` |
| Middleware docs v3 / v2 / mobile / dark | `10:5`, `10:6`, `10:9`, `21:156` |
| Migration / package reference / quickstart | `10:7`, `10:8`, `21:84` |
| Search v3 / v2 / both majors / empty / mobile | `10:10`, `26:104`, `21:231`, `18:114`, `24:100` |
| Version menu / topic unavailable / mobile drawer | `10:11`, `10:12`, `18:124` |
| Explorer transform / filtering / mesh / audit | `10:13`, `10:14`, `10:15`, `10:16` |
| Explorer before states | `21:259`, `26:130`, `26:176`, `26:222` |
| Explorer mobile transform / filtering / mesh / audit | `28:218`, `28:242`, `28:263`, `28:287` |
| Foundation board / component board | `4:7`, `9:2` |
| Exact logo / hero art parent / hero geometry | `12:3`, `12:34`, `12:35` |

Append `?node-id=10-2` with colon replaced by hyphen to open a specific node.
Load the Figma design-to-code skill before using its get_design_context tool; follow the Figma skill rules for any other tool.
The file contains 30 website screens/states and 204 prototype actions; those counts are design evidence, not proof that website functionality already exists.

## Portable implementation inputs

- [Design tokens](design-research/design-tokens.json): 45 variables and 11 text styles exported from Figma, including light/dark aliases.
- [Logo SVG](design-research/assets/logo.svg): exact editable opposing-path mark, not a screenshot.
- [Hero SVG](design-research/assets/hero-layers.svg): exact 584x470 plate/path geometry; HTML labels come from the parent Figma frame.
- [Design definition](design-research/design-definition.md): product reasoning, six-issue implications and acceptance framework.
- [Reference research](design-research/references.md) and [standards](design-research/standards.md): sources and proposed budgets.
- [Figma state ledger](design-research/figma-handoff.json): initial screen map and prior design-only QA evidence.
- [Issue bodies](design-research/issues/): local mirrors of the published implementation contracts.

Use D01's resolved hex table instead of guessing how Figma variable aliases map to CSS.
Use Geist 400/500 plus Geist Mono 400; no third font.
Key type sizes are desktop display 76/78, mobile display 44/46, body 16/26, and code 14/23 px.
Homepage breakpoints: two columns from 1024, mobile composition below 768; docs right TOC from 1200, sidebar from 768.
The tickets define intermediate widths and exact margins; do not simply shrink a 1440 px screenshot.

## Motion summary

Read D02/D03/D05/D06 for complete state tables before implementing any animation.
The hero is already readable on first paint; its decorative marker waits 250 ms, travels 960 ms once, fades 120 ms and stops.
The four explorer round trips last 1200 ms, with explicit client/middleware/upstream/response stages; a hidden-tool rejection lasts 540 ms and never reaches upstream.
Exploration never sends real MCP traffic, evaluates code, generates fake performance data or runs a perpetual loop.
Preset changes update code/results atomically and cancel stale work.
Visibility loss, resize, unmount or enabling reduced motion cancels motion to a complete static state.
Drawers use 200 ms translation/scrim; version menus and search use the ticket's 150 ms open and 120 ms close contracts.
All reduced-motion states are immediate and retain all information.
Buttons use restrained 150 ms color feedback and immediate visible focus; no invented springs, tilt, glow or scroll hijacking.

## Documentation and search facts

Canonical paths retain existing topic slugs beneath `/docs/v3/` and `/docs/v2/`, including `/concepts/middleware-model/` and `/getting-started/quick-start/`.
`/docs/` redirects to `/docs/v3/` after launch; no stored version preference overrides explicit URLs.
Known unavailable topics use `/docs/v2/unavailable/<topicId>/`, are explanatory/noindex, and offer the original v3 topic, v2 home and the closest real v2 topic.
Unknown versions/slugs remain real 404s.
Legacy article redirects are individually audited for the version the old content actually described; the existing corpus is mixed and must not be blindly copied into v2.
Use one Pagefind index with version metadata/filters, lazy loading on first open, 150 ms input debounce and eight displayed results.
Cross-version inclusion is explicit, resets on reopen and preserves a visible version badge for every result.
Every async search is generation-guarded against stale query/scope/close results.

Verified v2.1.1 library SHA: `b499195f56295f85cbfdf505911dc4ae7429828c`.
That snapshot includes `mcpose@2.1.1`, `@mcpose/audit@2.0.3`, `@mcpose/testing@2.0.3`, and the distinct `mcpose/testing` core subpath.
V2 already has telemetry hooks, hiding controls and in-memory event storage; the dedicated v3 packages are new, not every broad concept.
V2 audit types do not declare a `formatVersion`; describe the older schema as format v1 only with the migration ADR context, not as a field actually written by v2.
V3 writes the explicit newer audit format v2; old archives need the matching verifier.
ProxyOptions middleware arrays are response-processing order, final entry outermost; standalone compose uses its documented outermost-first convention.
Persistent EventStore alone is not session failover; replay manifests are verification evidence, while session re-execution belongs to v4.

## Release-dependent facts to verify

Record the final v3 tag/SHA, package versions, public exports and test evidence.
Read the final disposition and implementation of these library issues before publishing the corresponding claims:

| Library issue | Check |
| --- | --- |
| [#176](https://github.com/amir-gorji/mcpose/issues/176) | Awaited shutdown, audit flushing and session-close wiring |
| [#174](https://github.com/amir-gorji/mcpose/issues/174) | Merkle proof behavior; no invented throughput claims |
| [#160](https://github.com/amir-gorji/mcpose/issues/160) | Actual mutation-testing/assurance decision |
| [#155](https://github.com/amir-gorji/mcpose/issues/155) | Session registry and restart/resume contract |
| [#154](https://github.com/amir-gorji/mcpose/issues/154) | SSE isolation and reconnect behavior |
| [#100](https://github.com/amir-gorji/mcpose/issues/100) | Final mesh resource/template/subscription semantics |

Their status may have changed since the design research; check current released source rather than assuming they remain open or that closure proves a specific API.

## Stack and verification

Inspected stack: Next 16.3.0, React 19.2, Fumadocs core 16.14.0 / MDX 15.2.2, Shiki 4.4.2, Pagefind 1.5.2, pnpm 11.5.2 and Node 24.
Retain static export, trailing slashes, real 404 behavior, build-time highlighting and Cloudflare asset delivery.
Read installed Next documentation before coding; do not hand-edit `.source/`, `out/` or generated changelogs.

Existing checks:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
```

D08 adds the missing repository Playwright harness and `pnpm test:e2e` against a production build with Pagefind generated.
Use it for local screenshots and end-to-end checks, not an external browser automation tool.
Run exact screenshot baselines in Chromium at 1440x1000 and 390x844, both themes and reduced motion; inspect 320, 768, 1024 and 1920 px reflow and functional smoke in Firefox/WebKit.
Review initial baselines against Figma before approving them.

Project lab targets: median of three disclosed mobile runs on actual preview, LCP <=2000 ms, CLS <=0.05, TBT <=150 ms; investigate regressions rather than weakening gates silently.
Field goals after launch: p75 LCP <=2.5 s, INP <=200 ms and CLS <=0.1, mobile and desktop separately.
Provisional compressed-JS budgets: 180 KiB homepage and 120 KiB article including framework code, excluding Pagefind until opened.
WCAG 2.2 AA is the accessibility target, with stronger reduced-motion and 44 px standalone-control practices.
Figma contrast checks and prototype connections do not certify these outcomes; actual browser, keyboard, screen-reader, HTTP and performance evidence is required.

## Completion report required from the implementing agent

Link the implementation PRs and preview, identify the exact source/release SHA, and map each closed issue to its acceptance evidence.
Include visual comparisons, browser traces, static link/canonical checks, copyable example validation, accessibility results, timing/byte measurements and any remaining release blockers.
Distinguish automated tests, manual tests, lab measurements and postlaunch field data that is still unknown.
Do not say the site is published when only a preview exists.
