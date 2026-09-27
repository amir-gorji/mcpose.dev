# Published v3 verification

Verified against library tag [`v3.0.0`](https://github.com/amir-gorji/mcpose/tree/v3.0.0), commit `72e42dc58774f671a27c8d5fc8fb8bbb7d5faa26`, and the packages installed from npm.
The website release registry pins that commit.

| Package | Published version |
| --- | --- |
| mcpose | 3.0.0 |
| @mcpose/audit | 3.0.0 |
| @mcpose/testing | 3.0.0 |
| @mcpose/policy | 1.0.0 |
| @mcpose/consent | 1.0.0 |
| @mcpose/otel | 0.1.0 |
| @mcpose/store-redis | 0.1.0 |
| @mcpose/store-postgres | 0.1.0 |

The documentation covers required proxy names, local tools, mesh resource composition, prompt middleware, metadata boundaries, delegation attribution, policy and consent handles, HTTP defaults, session persistence, audit format v2, subject erasure, lifecycle draining, and keyed versus keyless verification.
Checked TypeScript fences compile directly against the pinned published packages in `tests/docs-examples.test.mjs`.
Host-specific credentials and persistence adapters remain explicitly identified integration points.

## Release gates

All six design-stage release questions are closed upstream:

- [#176](https://github.com/amir-gorji/mcpose/issues/176): asynchronous session-close hooks and audit flushing are awaited.
- [#174](https://github.com/amir-gorji/mcpose/issues/174): manifest proofs reuse the Merkle tree.
- [#160](https://github.com/amir-gorji/mcpose/issues/160): policy and consent use the mutation lane.
- [#155](https://github.com/amir-gorji/mcpose/issues/155): shared session records support transport resume.
- [#154](https://github.com/amir-gorji/mcpose/issues/154): SSE replay streams are isolated per session.
- [#100](https://github.com/amir-gorji/mcpose/issues/100): mesh resources use namespaced URIs.

## Design and implementation

The open nested-layer mark retains the original layered architecture and uses opposing openings for request and response flow.
The same silhouette is used in navigation, SVG favicon, Apple touch icon, and generated social card.
The hero uses separated plates and native text labels.
Mobile explorer grids shrink correctly, long article titles wrap, every article has one visible title, tables scroll by keyboard, and documentation spacing is consistent.
Breadcrumb links remain identifiable without color alone.

[Figma identity foundations](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=94-2), [updated homepage](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-2), and [mobile package specimen](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=95-148) are editable in the existing design file.
Updated node references are recorded in `figma-handoff.json`.
The Figma text overflow check passed after updating the snippets.

## Validation

- `pnpm typecheck` and `pnpm lint` pass.
- `pnpm test` builds 67 routes, indexes 52 documentation pages, and passes 17 checks, including compilation of actual documentation examples and one-title-per-article validation.
- `pnpm test:e2e` passes 58 desktop and mobile tests, including WCAG 2.2 AA axe checks with color contrast enabled in both themes.
- Playwright visual checks covered 320, 390, 768, 1024, 1440, and 1920 px widths in light and dark themes.
- The mobile explorer and long-title regressions failed before the fixes and pass afterward.

CI now runs the browser and accessibility suite before uploading the preview artifact.
PR #14 remains the integration and preview surface; production deployment happens only through the normal main-branch release workflow.

The four preserved commits from the earlier cancelled validation run are retained in the branch history.
They restore screen-reader-only styling, OS theme synchronization, a v2 fallback link, stronger search assertions, and accurate historical deployment notes.
The OS-theme regression was reproduced before integration; its test now also checks the hidden mobile menu control.
