# D04: Add versioned documentation routes and preserve source provenance

### Problem

The current docs tree is a single unversioned corpus under `content/docs`, served from `/docs/...` by `src/lib/source.ts`.

The current corpus mixes v2 core copy with v3-era audit/API material, so copying the whole tree into either major without a per-page source audit would be incorrect.

The repository does not contain an authentic v2 documentation corpus, and rewriting current pages in place would destroy the ability to verify what v2 users were actually taught.

### Outcome

Publish independent, crawlable documentation trees at `/docs/v3/...` and `/docs/v2/...`, with v3 marked Current and selected by default and v2 marked Previous.

Every v2 page must be derived from the released source snapshot `amir-gorji/mcpose@v2.1.1`, not from memory or by removing v3-only paragraphs from current pages.

Every v3 page must be checked against the released v3 source and package exports before publication.

The verified v2.1.1 tag resolves to library commit `b499195f56295f85cbfdf505911dc4ae7429828c`.
Its package set is `mcpose@2.1.1`, `@mcpose/audit@2.0.3`, and `@mcpose/testing@2.0.3`, plus the separate `mcpose/testing` export inside core.
Core contains `onTelemetry`, hidden tool/resource controls, identity, `PersistentEventStore` and an in-memory event store; those concepts must not be erased from historical docs.
The v2 middleware array order matches the described response-processing order; do not invent a migration that reverses arrays.

## Deterministic source and route structure

Use physically separate `content/docs/v2/` and `content/docs/v3/` trees and one build-time version registry.
Registry records contain `id`, `label`, `status`, `basePath`, `sourceTag`, `sourceCommit`, and package-version mapping.
Each article frontmatter or adjacent manifest records stable `topicId`, version, source file(s), title, description and verification state.
Use stable topic IDs independent of display text, such as `concepts-middleware-model` and `concepts-mesh`.
Store a mapping from `(version, topicId)` to canonical URL or known-unavailable metadata including source-topic URL and the nearest real fallback URL.
No runtime fetch of GitHub and no deriving equivalence by blindly replacing `/v3/` with `/v2/`.

Canonical route form is `/docs/<version>/<existing topic slug>/`, retaining existing slug spelling such as `middleware-model`, `install`, and `quick-start`.
Static generation must enumerate version + slug combinations; unknown versions and unknown slugs return 404, never a fallback v3 article.
Read the installed Next and Fumadocs docs before choosing the exact loader API; do not manually edit generated `.source/`.
The intended route boundary is `src/app/docs/[version]/[[...slug]]/page.tsx`; replace the competing unversioned catch-all and keep only an intentional root fallback page if needed for the `/docs/` redirect.

Known-unavailable URLs use `/docs/v2/unavailable/<topicId>/`, for example `/docs/v2/unavailable/concepts-mesh/`.
These are explicit noindex explanatory pages with a normal 200 response, excluded from sitemap/search; unknown arbitrary topic IDs still return 404.
The visible header remains `v2 Previous`; message `This topic starts in v3` applies only to facts verified as v3 introductions.
Provide `Read this topic in v3` linking to the original topic and `Browse v2 documentation` linking to `/docs/v2/`, plus the mapped closest v2 article.
If a topic disappeared for a different reason, use `This topic is not available in v2` with the verified explanation rather than a false introduction claim.

For version switches preserve the fragment only if the destination declares that exact heading ID; otherwise drop it and land at the article h1.
Keep source and target heading IDs in build metadata, not a request-time guess.
Ordinary real version links with hrefs provide a no-JavaScript path and work with open-in-new-tab.
Reject duplicate topic IDs within one version, broken counterpart targets, missing source provenance and cross-version pager leakage at build time.

### Exact route and content inventory

Use the same topic slug for equivalent concepts when that does not create a factual mismatch.

Use this mapping as the required route set for the existing corpus; route paths below include the canonical trailing slash used by the site.

| Current source file | v3 canonical route | v2 route and source rule |
| --- | --- | --- |
| `content/docs/index.mdx` | `/docs/v3/` | `/docs/v2/`, rewrite for the v2.1.1 feature set |
| `content/docs/getting-started/introduction.mdx` | `/docs/v3/getting-started/introduction/` | `/docs/v2/getting-started/introduction/`, derive from v2.1.1 README and package docs |
| `content/docs/getting-started/install.mdx` | `/docs/v3/getting-started/install/` | `/docs/v2/getting-started/install/`, use v2.1.1 package names, peer requirements, and install commands |
| `content/docs/getting-started/quick-start.mdx` | `/docs/v3/getting-started/quick-start/` | `/docs/v2/getting-started/quick-start/`, runnable against v2.1.1 exports only |
| `content/docs/getting-started/examples.mdx` | `/docs/v3/getting-started/examples/` | `/docs/v2/getting-started/examples/`, keep only examples supported by the v2.1.1 tag |
| `content/docs/concepts/proxy-model.mdx` | `/docs/v3/concepts/proxy-model/` | `/docs/v2/concepts/proxy-model/`, verify behavior against v2.1.1 source |
| `content/docs/concepts/middleware-model.mdx` | `/docs/v3/concepts/middleware-model/` | `/docs/v2/concepts/middleware-model/`, preserve v2 middleware types and actual ordering behavior |
| `content/docs/concepts/identity-and-sessions.mdx` | `/docs/v3/concepts/identity-and-sessions/` | `/docs/v2/concepts/identity-and-sessions/`, include only identity and session behavior present in v2.1.1 |
| `content/docs/concepts/rejection-reasons.mdx` | `/docs/v3/concepts/rejection-reasons/` | `/docs/v2/concepts/rejection-reasons/` only if v2.1.1 exposes the described codes; otherwise mark this topic unavailable in v2 |
| `content/docs/packages/mcpose.mdx` | `/docs/v3/packages/mcpose/` | `/docs/v2/packages/mcpose/`, transcribe the public API from the v2.1.1 core README and exports |
| `content/docs/packages/audit.mdx` | `/docs/v3/packages/audit/` | `/docs/v2/packages/audit/`, the older schema is called format v1 in the migration ADR but has no formatVersion field; v3 explicitly writes format v2; label package major separately |
| `content/docs/packages/testing.mdx` | `/docs/v3/packages/testing/` | `/docs/v2/packages/testing/` derive from @mcpose/testing@2.0.3 at v2.1.1; distinguish it from mcpose/testing |
| `content/docs/recipes/pii-redaction-audit.mdx` | `/docs/v3/recipes/pii-redaction-audit/` | `/docs/v2/recipes/pii-redaction-audit/` only when every import and API exists in v2.1.1 |
| `content/docs/recipes/list-tools-rewriting.mdx` | `/docs/v3/recipes/list-tools-rewriting/` | `/docs/v2/recipes/list-tools-rewriting/` only when every import and API exists in v2.1.1 |
| `content/docs/recipes/oauth-upstream.mdx` | `/docs/v3/recipes/oauth-upstream/` | `/docs/v2/recipes/oauth-upstream/` only when every import and API exists in v2.1.1 |
| `content/docs/project/security.mdx` | `/docs/v3/project/security/` | `/docs/v2/project/security/`, retain historical version support policy and do not silently use current claims |
| `content/docs/project/roadmap.mdx` | `/docs/v3/project/roadmap/` | Do not publish a mutable roadmap as v2 history; show the topic-unavailable state with a link to v2 package docs |
| `content/docs/project/contributing.mdx` | `/docs/v3/project/contributing/` | `/docs/v2/project/contributing/`, preserve links and contributor instructions appropriate to the snapshot |
| `content/docs/project/adrs.mdx` | `/docs/v3/project/adrs/` | `/docs/v2/project/adrs/` only for ADRs in the v2.1.1 tag; do not show future ADRs as v2 decisions |

Treat the table as a route/content contract, not an instruction to fabricate missing historical pages.

For each v2 route marked conditional, inspect the actual v2.1.1 tag and expose an explicit unavailable-topic page if the feature did not exist.

Known v3-only pages include Mesh, the new @mcpose/policy, @mcpose/consent, @mcpose/otel and external event-store packages, plus migration from v2.
V2 already has the core onTelemetry hook, hidden-tool controls and in-memory event storage; do not describe telemetry, access control or reconnect replay broadly as invented in v3.

The version switch must preserve topic when a counterpart exists.

When a v3-only topic has no v2 equivalent, switch to a dedicated state that says the topic is not available in v2 and links to the nearest valid v2 concept or package page.

Do not redirect that state to an unrelated topic without explaining the relationship.

### Migration and route behavior

Create a reviewed legacy-route manifest before moving content.
Record the version actually described by each old article, then map it to the corresponding v2 or v3 article; choose a v3 replacement only where it is the accurate continuation and document that choice.

D07 owns explicit Cloudflare static-asset 301 redirects generated from this manifest; do not add a server runtime or duplicate full compatibility articles.

Legacy aliases redirect to the individually chosen canonical versioned target and must not create duplicate index entries.

The old `/docs/` URL redirects to `/docs/v3/` after launch.
Both version landing pages expose explicit links to the other version; no remembered version can override this default entry or an explicit deep link.

Do not rely on local storage or cookies to override an explicit version in the URL.

Do not persist a docs-version preference for this implementation; the URL and the explicit v3 default are sufficient.

Add a small version registry with stable IDs, labels, status, root route, content root, and available counterpart metadata.

Do not scatter literal `v2` and `v3` route transformations across UI components.

Keep route generation, equivalence lookup, and unavailable-topic lookup deterministic and usable during static generation.

### Source and likely touchpoints

Inspect `source.config.ts`, `src/lib/source.ts`, `src/lib/docs-tree.ts`, `src/app/docs/[[...slug]]/page.tsx`, `src/app/docs/[[...slug]]/layout.tsx`, and `src/app/sitemap.ts` before choosing the new source arrangement.

Add `src/lib/docs-versions.ts` for the version registry and use the physical v2/v3 trees specified above; adapt the installed Fumadocs loader to that layout.

Preserve the current content as the starting v3 snapshot and record the provenance of each v2 file in frontmatter or a neighboring manifest with source tag `v2.1.1` and source file path.

Avoid maintaining an unversioned duplicate copy of each article.

Check the generated source configuration and Fumadocs loader behavior before changing source directories.

Likely update `source.config.ts`, `src/lib/source.ts`, `src/lib/docs-tree.ts`, doc route generation and metadata, `src/app/sitemap.ts`, `tests/build.test.mjs`, and add a version equivalence/provenance test.

The site currently uses static export and Pagefind postbuild, so generated routes and compatibility behavior must work without request-time server code.

### Acceptance criteria

- `/docs/v3/` and `/docs/v2/` statically export and identify their versions in the page title, page content, and active version selector.
- V3 is labeled `Current`; v2 is labeled `Previous`.
- Every v2 article contains a provenance record pointing to the v2.1.1 tag and source file or is explicitly marked unavailable.
- V2 audit documentation explains the older schema (format v1 in migration terminology, without a formatVersion property); v3 documentation describes explicit format v2, citing the migration ADR.
- Version switching maps middleware v3 to middleware v2 and back while retaining the topic.
- Switching from a Mesh v3 page to v2 displays the unavailable-topic state and a relevant v2 destination.
- An explicit `/docs/v2/...` URL always remains in v2 after refresh, back/forward navigation, and reload in a fresh browser context.
- Old unversioned routes redirect to the versioned target recorded for that article, without a blanket assumption that all old content was v3.
- `generateStaticParams`, static export, sitemap, and deep links include only canonical versioned articles and intentional compatibility routes.
- Every article's internal links resolve within the correct version unless the link is explicitly labeled cross-version or points to shared project information.
- Add automated checks for the version registry, route counterpart mapping, unavailable pages, and old route compatibility.

### Dependency

This issue blocks version-aware docs layout/content and version-filtered search.
D07 owns actual Cloudflare redirect delivery; this issue owns the reviewed route manifest consumed by it.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D05 #10](https://github.com/amir-gorji/mcpose.dev/issues/10), [D06 #11](https://github.com/amir-gorji/mcpose.dev/issues/11), [D07 #12](https://github.com/amir-gorji/mcpose.dev/issues/12).
