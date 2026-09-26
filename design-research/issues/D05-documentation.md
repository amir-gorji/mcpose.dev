# D05: Build version-aware documentation layouts and complete both documentation sets

### Problem

The current docs experience has a desktop sidebar, article, and TOC, plus a mobile sidebar drawer, but it has no version selector or version-specific navigation context.

The approved design expects developers to choose v3 Current or v2 Previous and continue reading the equivalent topic without losing their place.

The existing article corpus mixes release generations and is not a verified v2 snapshot, so simply changing the sidebar label would mislead users.

### Outcome

Implement a precise, calm, responsive documentation shell for the versioned routes created by D04.

Complete the v3 pages and authentic v2 snapshot pages, with a clear missing-topic state wherever the selected version has no equivalent.

Depends on D01's design system and D04's version registry; D06 owns search internals.

## Required pages beyond the existing inventory

Add complete v3 pages at `/docs/v3/migration/from-v2/`, `/docs/v3/concepts/mesh/`, `/docs/v3/recipes/transform-responses/`, and package pages for `policy`, `consent`, `otel`, `store-redis`, `store-postgres`.
The existing core/audit/testing package pages remain and must be updated against the final release.
Navigation groups are Get started, Concepts, Guides, API and packages, Migration, and Project; version-local visibility comes from available verified content, not a hardcoded identical tree for both versions.
Keep the route spelling `recipes` for existing/new guides even if the sidebar group is labeled Guides.

Quickstart must include prerequisites with the actual supported Node/runtime and peer ranges, exact installation, a complete upstream fixture, a complete proxy entry file, client configuration/run command, expected observed tool result, and next steps.
Do not leave `./server.mjs` as an unexplained missing file; either provide its complete fixture or name and pin a real example with instructions to create/run it.
The final runnable example must be tested from a clean temporary directory against the documented package versions.
Log diagnostics to stderr when stdout carries MCP stdio messages.
Every code excerpt is marked as an excerpt and links to complete setup; every block presented as runnable includes imports, definitions and required cleanup.

Migration must compare old/new installation and option wiring, explain required nonblank proxy `name`, middleware ordering, audit package/format compatibility, old archive verification with a matching 2.x verifier, and relevant lifecycle/session changes from the final v3 release.
Keep actual package versions separate from library-doc major and audit-format generation; do not invent a serialized v1 formatVersion field in old archives.
Package reference uses the Figma mcpose template for all eight packages with package role, actual version, install/import, exports and options, one working example, constraints and related guides.
`mcpose/testing` is the proxy-testing subpath; `@mcpose/testing` is the separate audit-consistency package, not proof of cryptographic authenticity.
Complete or deliberately remove each existing stub from public navigation; required homepage destinations cannot remain `stub: true` placeholders.

### Visual and interaction specification

Use the Figma frames `Docs · v3 Middleware` (`10:5`), `Docs · v2 Middleware` (`10:6`), `Docs · Migration` (`10:7`), `Docs · Package reference` (`10:8`), `Docs · Mobile` (`10:9`), `Versions · Menu` (`10:11`), and `Version · Topic unavailable` (`10:12`) as the visual reference.

At desktop widths of 1200 CSS pixels and above, use a centered shell with a persistent left navigation, an article with a maximum content width of 744 pixels, and a right `On this page` TOC when the article has headings.

Exact desktop reference: max shell 1440 px, 64 px side padding, grid columns 224 px / minmax(0,744 px) / 224 px, 48 px column gaps; shrink the middle track as necessary at 1200 px and do not add widths that exceed the viewport.
At 1440, the article max is 744 px as in Figma; at 768-1199 it uses the available middle width and the right TOC is absent.
Mobile uses 24 px side padding, body 16/26 px, article h1 40/46 px and 24 px primary content gaps.
Docs header is sticky, 88 px desktop and 72 px below 768; sidebar/TOC sticky offset is header height plus 24 px with internally scrollable overflow if necessary.
Use scroll-margin-top equal to header height plus 24 px for heading anchors and focus destinations.
Hide the announcement bar on docs pages so reading geometry remains stable.

The version control belongs at the top of the left navigation, remains visible while scrolling, and shows the selected major plus status, for example `v3 · Current` or `v2 · Previous`.

Clicking the version control opens a compact menu aligned to the control, with v3 and v2 rows, status labels, and a visible selected state.

Menu width is 360 px desktop, clamped to viewport minus 32 px on narrow screens; gap from trigger is 8 px and viewport edge clearance is 16 px.
Use 16 px padding, 8 px row radius and 44 px minimum row targets; each row is an ordinary version link with a status label and current-state marker.
Open with 150 ms opacity and translateY(-4px to 0), close with 120 ms reverse transition, cubic-bezier(0.2,0,0,1); reduced motion is immediate.
Treat the popup as a navigation disclosure containing links, not a fake select; trigger exposes aria-expanded/aria-controls, Tab follows links, Escape dismisses and returns focus.
The current-version row is marked current and does not navigate/reload itself.

On choosing a version, navigate to the equivalent topic from D04; if no counterpart exists, navigate to its explicit unavailable-topic state.

Close the menu on Escape, outside click, and successful selection.

Keep focus on the trigger after Escape or outside dismissal; after selection, move focus to the new page h1 after navigation when client navigation permits, otherwise let normal document navigation set focus.

At 768 through 1199 CSS pixels, hide the right TOC; retain a 224 px sidebar, 32 px column gap and 32 px outer gutters; article takes the remaining width.

Below 768 CSS pixels, remove the desktop sidebar and right TOC columns.

Show a version pill and hamburger before the article title in the mobile docs header; the version pill uses the same version menu behavior as desktop.

The hamburger opens the existing left-side navigation drawer with a scrim, close button, scroll lock, current version label, version control, and the complete selected-version tree.

The drawer is full-height and at most `min(320px, 88vw)` wide, slides in from the left over 200 ms, and fades its scrim over the same duration.

The drawer's translation is exactly -100% to 0 and the scrim is black at 0.32 final opacity; both use cubic-bezier(0.2,0,0,1), reversed on close.
Use `100dvh` and safe-area padding; the backdrop covers the visual viewport and the nav contents scroll within the drawer.
Reduced motion uses immediate open/close with no fade, translation or delayed focus restoration.

On drawer open, place focus on the drawer heading or first navigation item and keep Tab focus inside; Escape, close button, scrim click, and selecting a destination close the drawer.

When a destination is selected, restore scroll to the destination page top and focus the h1; when dismissed without navigation, return focus to the hamburger.

The mobile TOC is a compact `On this page` disclosure directly below the article lede when the page has at least three level-two headings.

The mobile TOC disclosure expands inline, lists anchor links, closes after an item is selected, and does not cover the article or hijack scrolling.

For one or two headings, omit the TOC disclosure and retain headings as ordinary article content.

TOC expands/collapses immediately with no animated article height, uses a native disclosure or equivalent accessible button, and preserves the URL fragment on link activation.
The desktop TOC highlights the last heading above the sticky-header threshold while scrolling; this changes only the active link styling and never moves keyboard focus.
Code copy follows D01's success/failure contract; internal links, breadcrumb and previous/next pager always use the selected-version tree.
Search trigger includes the selected major and opens D06; the theme switch behaves identically to homepage.

Use the existing Fumadocs heading URLs, keep heading anchor IDs stable, and apply scroll margin so a target heading clears the sticky header.

Animate only menu/drawer appearance and dismissal; do not animate article text, TOC active states beyond a restrained color transition, or route content while a reader is working.

Respect `prefers-reduced-motion: reduce` by removing slide/scale movement and using an immediate state change with no movement or fade.

### Content and correctness rules

Use the route/content inventory and v2.1.1 provenance rules from D04.

The v2.1.1 source of truth is the library repository tag, including `README.md`, `packages/core/README.md`, `packages/audit/README.md`, `packages/testing/README.md` when present, the examples and package exports at that tag.

Do not use current library docs or current `main` as evidence for v2 APIs.

For v3, verify code samples and claims against the released v3 package exports and the final resolution of the six previously open library issues.

Do not claim v3 release behavior before the site release gate confirms that v3 shipped.

Keep general proxy and middleware uses first; audit, policy, and compliance are capabilities, not the only reason to use the proxy.

Do not claim legal compliance, certified compliance, a hosted control plane, benchmark performance, or an invented tool/resource behavior.

Use accurate middleware semantics: `ProxyOptions` middleware arrays are in response-processing order, and the final entry is outermost; standalone `compose()` has its own documented composition convention.

Keep package major and audit serialization format distinct wherever both appear.

Keep session re-execution described as v4; describe the v3 replay manifest only as verifiable history evidence.

Do not imply that a persistent event store alone enables session failover.

For a verified v3 introduction use `This topic starts in v3`; for other absent historical topics use D04's `This topic is not available in v2` and its verified explanation.
Offer all three destinations defined by D04, including the closest real v2 concept or package link.

Never offer an unrelated redirect as if it were an equivalent page.

### Likely touchpoints

Adapt `src/app/docs/docs-shell.module.css`, `src/app/docs/[version]/[[...slug]]/layout.tsx` after D04 migrates the existing catch-all, `src/components/docs/sidebar.tsx`, `src/components/docs/sidebar.module.css`, `src/components/docs/sidebar-drawer.tsx`, `src/components/docs/sidebar-drawer.module.css`, `src/components/docs/toc.tsx`, `src/components/docs/toc.module.css`, `src/components/docs/breadcrumb.tsx`, `src/components/docs/pager.tsx`, and `src/components/nav.tsx`.

Add only the version selector and missing-topic components needed by the behavior, reusing `src/components/search/` dialog accessibility patterns only where appropriate.

Use the new D01 semantic color, spacing, radius, type, and focus tokens; do not introduce a separate docs palette.

Add responsive behavior in the existing component stylesheets and keep static content server-rendered.

### Acceptance criteria

- Desktop shell, intermediate shell, mobile article, version menu, and missing-topic state match the Figma hierarchy, spacing, typography, and surface colors at the named frames.
- V3 and v2 pages show their correct active version and page title at desktop and mobile widths.
- Switching versions from a mapped topic preserves that topic, and missing topics use the D04 unavailable route.
- Sidebar links stay in the selected version, visibly mark the current item, and expose `aria-current="page"` only for that item.
- Mobile drawer opens, traps focus, closes using Escape/close/scrim/navigation, restores trigger focus when dismissed, and does not leave background scrolling locked.
- Mobile TOC appears only under its defined heading threshold, uses real anchors, closes after selection, and leaves the selected heading visible below the sticky header.
- All controls are operable by keyboard and touch, have an accessible name, visible focus, and a minimum 44 by 44 CSS pixel target where practical.
- Menu and drawer transitions run within the specified 200 ms window and are reduced-motion safe.
- Quick-start code snippets compile or are copied exactly as displayed against the version named in the page.
- V2 docs truthfully reflect the tagged package exports, peer dependency and audit-format behavior.
- No v3-only APIs appear in v2 code examples, and no unsupported API details are invented to fill a missing page.
- Each version has correct title, description, canonical URL, breadcrumbs, pager links, and version-local internal links.
- Document at least the checked routes per version in the build test and assert missing-topic link destinations.

### Dependencies

Requires D04's version registry, canonical routes, page-tree separation, and unavailable-topic lookup.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D01 #6](https://github.com/amir-gorji/mcpose.dev/issues/6), [D04 #9](https://github.com/amir-gorji/mcpose.dev/issues/9), [D06 #11](https://github.com/amir-gorji/mcpose.dev/issues/11).
