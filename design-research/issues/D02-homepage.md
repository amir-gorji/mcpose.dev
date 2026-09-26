# D02: Rebuild the homepage around the composable MCP proxy and its layered visual identity

## Outcome and dependencies

Implement the approved homepage as a complete responsive composition, with practical starting actions immediately available and the middleware explorer as its central interaction.
Depends on D01 for tokens/controls and D04 for canonical destinations; D03 fills the explorer slot.
This site launches after v3, so copy uses released v3 language only after D07's release gate passes.

## Visual authority and exact assets

[Light desktop 1440 px](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-2), [dark desktop](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-3), [mobile 390 px](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-4).
Use `design-research/assets/hero-layers.svg`, exported from node `12:35`, for the exact 584x470 path/plate geometry.
The SVG contains geometry only; reproduce the labels and note from parent frame `12:34` as HTML so they remain accessible and selectable.
Do not replace the three oblique plates with generic dashboard cards, a stock 3D illustration, particles or a different network diagram.
If the bundle is unavailable, export that same node from Figma.

## Section order, copy and destinations

| Order | Required content | Action |
| --- | --- | --- |
| 1 | Navigation: logo/wordmark, Documentation, Examples, GitHub, Search, Get started, theme switch | Docs -> `/docs/v3/`; Examples -> `/#explore`; GitHub -> library repository; Get started -> `/docs/v3/getting-started/quick-start/` |
| 2 | Announcement: `Meet mcpose v3`; `More ways to compose. One familiar MCP endpoint.`; `Explore what’s new` | `/docs/v3/migration/from-v2/` |
| 3 | Eyebrow `The composable MCP proxy`; headline `Make MCP` then `work your way.` | Primary `Get started`; secondary `Explore middleware` -> `#explore` |
| 4 | Explorer heading `What would you change?`; lede `Follow one call. Add middleware. See the difference.` | Implement D03 in this section |
| 5 | `Bring your servers together.`; `One endpoint. Distinct tools. The same middleware model.` | `Explore multi-server composition` selects the Mesh preset and scrolls to `#explore` |
| 6 | `Useful in a side project.` then `Ready for serious work.`; `Keep the core small. Compose the capabilities your application needs.` | Three capability columns below |
| 7 | `Only the pieces you need.` | Eight package rows linked to their versioned reference pages |
| 8 | `The next layer is yours.`; `Start with one proxy and one function. See where it takes you.` | `Build your first proxy` -> quickstart |
| 9 | Wordmark; `Open source. Yours to compose.`; Documentation, GitHub, MIT license | Link to docs, library repo, and verified repository LICENSE |

Hero supporting copy is exactly `Transform responses. Shape tool access. Connect servers. Add the behavior you need between your client and its MCP servers.`.
Installation is the single command `npm install mcpose @modelcontextprotocol/sdk`; verify package peer constraints against the final release and update the command deliberately if required.
The visual caption is `A small function in the middle can change the whole interaction.`.
Hero labels are `Client`, `Middleware`, `Upstream`; the plate reads `mcpose` and `Your behavior, composed.`; the note reads `Same MCP protocol` and `New possibilities`.
Use category/metadata text `TypeScript / MIT / stdio + HTTP`, verified against the release.

The multi-server explanation is `Connect named upstreams and expose their tools through a shared proxy. Add a transformation once and reuse it across your integrations.`.
Its rows are `docs__search -> Docs server / search`, `crm__lookup -> CRM server / lookup`, and `files__read -> Files server / read`.
These are example tool names, not promises about resource URI addressing.

Capabilities are `Adapt`: `Transform results, shape discovery, and serve local tools alongside upstream tools.`; `Operate`: `Resolve identity, observe calls, and persist transport events with Redis or Postgres.`; `Govern`: `Apply policy and consent, then preserve tamper-evident evidence with audit.`.
Package rows are mcpose (proxy, transport, middleware), @mcpose/policy (role rules and per-session call budgets), @mcpose/consent (consent resolved by the application), @mcpose/audit (chained events and signed session manifests), @mcpose/testing (audit consistency assertions), @mcpose/otel (OpenTelemetry), @mcpose/store-redis (persistent SSE events), and @mcpose/store-postgres (persistent SSE events).
The package names link to `/docs/v3/packages/{mcpose,policy,consent,audit,testing,otel,store-redis,store-postgres}/` respectively.
Do not promote transport persistence to a session-failover guarantee or audit consistency to proof of authenticity.

## Responsive geometry

At 1440 px, match the Figma content width 1248 px and 96 px section insets, with 80 px vertical section padding and 24 px primary stack gaps.
Above 1440, center the 1248 px content while backgrounds remain full bleed.
At 1200-1439 use 48 px side gutters; at 768-1199 use 32 px; below 768 use 24 px.
At 1440 the hero is a 600 px text column, 64 px gap, 584 px illustration; at 1024-1439 use equal flexible columns with a 32 px gap and display type 64/66 px.
At 768-1023 stack copy above the full illustration and use display 56/60 px.
Below 768 use display 44/46 px and replace the desktop artwork with vertically stacked `Client request`, `mcpose / Your middleware`, `MCP server` blocks and downward connectors as in the mobile frame.
Mobile section padding is 48 px vertical; never impose the desktop frame's total height on a page.
Hero buttons remain side by side when their natural widths fit; below 380 px make both full width and stack with 12 px gap.
The install string does not become two commands on mobile: prefer one-line bounded horizontal scrolling; copied content stays one unwrapped command.
The 1440 nav is 88 px high with 64 px side inset; flex spacer replaces Figma's fixed spacer.
The navigation is sticky at top 0 with an opaque theme background and 1 px bottom border; the announcement scrolls with the document below it.
Below 1024 the navigation height is 72 px.
Below 1024 collapse navigation to brand and `Menu`; use the shared accessible menu/drawer behavior from D05 and include search, docs, examples, GitHub, quickstart and theme controls.
The announcement is 46 px high at desktop; on mobile use `mcpose v3 is here` and `What’s new`, allowing height to grow if text wraps.
Capabilities use three equal columns at >=1024, one column below; package rows become name then description below 768 rather than a horizontally scrolling table.
At 390 px the closing headline follows the mobile display type and the footer is a vertical stack.

## Material, motion and effects

Initial HTML renders all text, a complete SVG and its labels; no content waits for hydration or an animation to finish.
No section entrance animation, page loader, scroll capture, mouse-following tilt, background video, WebGL, parallax or perpetual motion.
The plates stay at the exact resting geometry; do not animate their rotation, perspective or layout.
An optional-by-preference but specified normal-motion flourish runs once per homepage mount: one 6 px cobalt marker follows the existing active path `Vector_6` after 250 ms, travels from the left endpoint to the right endpoint over 960 ms using `cubic-bezier(0.22,1,0.36,1)`, then disappears over 120 ms.
This is a decorative invitation, not a live request or middleware timing measurement; hide it from accessibility APIs.
Do not delay the LCP text or fade the whole hero.
Start only when the hero is at least 50% visible; if the page hides, the hero leaves view, or reduced motion becomes active, cancel and leave the static final art.
Do not restart on resize, focus, theme switch or return to the tab during the same mount.
Reduced motion omits the traveling marker entirely; all fixed paths, plates and labels remain.
Use native SVG/CSS or Web Animations; no dependency is needed for one path animation.
Native anchor navigation scrolls normally; use smooth scrolling only for user-triggered in-page links and disable it under reduced motion.
Use `scroll-margin-top` equal to the sticky header height plus 24 px so explorer headings are not obscured.

## Existing code

Inspect `src/app/(landing)/page.tsx`, `landing.module.css`, `src/components/landing/*`, `src/components/nav.tsx`, `src/components/footer.tsx`, `src/components/install-row.tsx`, and `src/lib/site.ts`.
Reuse the existing section/component organization where useful; remove audit-first sections that the new narrative replaces instead of leaving both homepages in the DOM.
Keep static prose and package lists server-rendered; only actual interactive controls and the small motion controller need client code.

## Acceptance

- [ ] Full page at 1440 light/dark and 390 mobile matches the Figma hierarchy, exact copy, SVG geometry and spacing; also inspect 320, 768, 1024 and 1920 px.
- [ ] Every homepage action has the exact working destination above; no Figma-only modal navigation leaks into production.
- [ ] Installation, quickstart and GitHub are available without completing the exploratory story.
- [ ] The one-time marker meets the 250/960/120 ms contract, cancels safely and never causes CLS or continuous work offscreen.
- [ ] JS-disabled and reduced-motion views remain informative and navigable.
- [ ] No document-level horizontal overflow, overlapping labels, unreadable code, hero rasterization or missing mobile controls.
- [ ] Package claims and links are checked against final v3 before D07 permits launch.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D01 #6](https://github.com/amir-gorji/mcpose.dev/issues/6), [D03 #8](https://github.com/amir-gorji/mcpose.dev/issues/8), [D04 #9](https://github.com/amir-gorji/mcpose.dev/issues/9).
