# D07: Preserve crawlable URLs and static delivery, and gate launch on the v3 release

## Outcome and dependencies

Ship the redesign after the library's v3 release with independent v2/v3 canonicals, real legacy redirects, correct social metadata, and the existing static Cloudflare delivery model.
Depends on D04's authoritative route/provenance manifest; integrates D02 and D05 content; D08 supplies final release evidence.
Do not deploy as part of merely implementing this ticket.

## Existing facts

`next.config.ts` sets `output: 'export'`, `trailingSlash: true`, and unoptimized images.
`wrangler.jsonc` serves `out/` as static assets, forces trailing slashes, returns real 404 pages and disables the public workers.dev production origin.
CI verifies typecheck, lint and `pnpm test`, uploads `out/`, then deploys the same artifact.
Any passing push to main, including an integration merge, currently triggers production deployment.
Same-repository PRs receive a Workers version preview; fork PRs intentionally lack deployment secrets.

## Integration and release gate

Use one integration branch named `codex/v3-site-redesign` and an open draft integration PR to main; do not merge it before release verification passes.
Run individual ticket work against this branch and retain CI for pull requests targeting either main or this integration branch.
Do not loosen the production deploy predicate to include the integration branch.
The integration PR receives the existing safe `wrangler versions upload` preview, never `wrangler deploy`.
Keep the artifact produced by verify as the artifact used by preview and eventual production.

Before marking the integration PR ready, write a release verification record containing the final library v3 tag and commit SHA, actual package versions/exports, commands used to validate examples, and links to the final disposition of library issues #176, #174, #160, #155, #154 and #100.
Use repository-qualified links for these six issues because this website repository has its own issue numbers.
Do not treat closing a library issue as proof of behavior; read and test the released implementation.
If the v3 tag or a required package is not published, continue visual/layout work and keep launch blocked; never fill the gap with invented APIs or change public copy to falsely say v3 is released.
The website needs no runtime feature flag or split v2/v3 landing page for this workflow.

## Canonical and route contract

Use D04's manifest to create `public/_redirects` with one explicit permanent 301 rule per moved legacy article and an explicit `/docs/` to `/docs/v3/` rule.
Include slashless legacy aliases if Cloudflare otherwise adds a separate slash-normalization hop; no blanket `/docs/*` rule that could catch `/docs/v2/` or `/docs/v3/`.
Do not implement request-time Next middleware or `next.config` redirects in a static export.
Cloudflare Workers static assets supports `_redirects`; use the documented syntax and test actual preview responses, not only a generic static file server.
[Cloudflare redirect documentation](https://developers.cloudflare.com/workers/static-assets/redirects/).
Preserve query parameters and existing heading anchors when the topic survives; keep old heading IDs as alias anchors where a heading was renamed.
Fragments are browser-side: do not claim to inspect or rewrite them at the edge.
For each legacy route, D04 records whether current public content belongs to v2 or v3; use that per-page target rather than assuming every historical page belongs to one major.
Unknown paths must still return 404, not a generic docs page with 200.

Every real v2 and v3 article gets a self-canonical absolute `https://mcpose.dev/.../` URL with trailing slash.
Never canonicalize materially different v2 content to v3.
Titles follow `<Article title> | mcpose v3 docs` or `<Article title> | mcpose v2 docs`; homepage title is `mcpose | The composable MCP proxy`.
Homepage description is `A composable TypeScript proxy for MCP servers. Transform responses, shape tool access, and connect upstreams through middleware you control.`.
Article descriptions are unique summaries of that article/version, not the homepage description repeated everywhere.
The missing-topic state, stub pages and 404 are noindex and excluded from sitemap and Pagefind; unavailable content has no canonical pretending that it is a real article.
Actual supported article content must not ship as a stub to satisfy a navigation label.
The sitemap includes the homepage, the canonical versioned landing pages, and complete canonical articles only; never legacy aliases or duplicate no-slash URLs.
Do not invent lastModified dates from build time.

## Metadata and static presentation

Update `src/lib/site.ts`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/components/seo/json-ld.tsx`, favicon and touch icon to the new brand and general-purpose positioning.
Use a 1200 by 630 social card with paper background, ink headline, cobalt opposing-path mark, `Make MCP work your way.` and `mcpose.dev`; no tiny code or legal-compliance claim.
Keep SoftwareSourceCode structured data for the library and accurate TechArticle/BreadcrumbList data for versioned articles.
Repository, license, versions and breadcrumbs must match visible content; no fabricated ratings, adoption numbers or product offers.
Core title, explanation, code and navigation must exist in initial HTML with JavaScript disabled.
Interactive illustrations enhance that content and never become its only source.

## Preview and caching

Preserve current security headers and immutable caching only for content-hashed assets.
Never mark the stable Pagefind entry manifest immutable.
Keep production canonicals on the production origin, including during previews, and add `X-Robots-Tag: noindex` only to preview responses using a deployment-specific header rule verified on preview.
Generate any preview-only header file on the downloaded artifact or through an explicitly preview-only configuration; never let that header reach the production artifact or broaden an unconditional `/* noindex` rule in shared source.
Document this small difference from the verified content artifact and test it separately.
Do not enable unverified analytics, change DNS, change secrets, or provision a new hosting service for this redesign.

## Acceptance evidence

- [ ] Every legacy URL has a reviewed D04 manifest target, and the Cloudflare preview returns a 301 to that article or documented replacement without loops.
- [ ] Versioned deep links return 200; unknown paths return 404; slash and query behavior is checked using HTTP requests.
- [ ] Canonicals, titles, sitemap, JSON-LD and Pagefind agree on the same versioned URLs.
- [ ] No v2 page silently canonicalizes or navigates to v3; old anchors still land at the expected section where retained.
- [ ] Preview is noindex and production configuration is indexable; the test checks response headers in addition to HTML.
- [ ] The social card and brand icons are rendered and inspected at actual sizes.
- [ ] CI against the integration branch verifies and previews but cannot deploy production.
- [ ] Release verification identifies the actual v3 tag/SHA and records all six library issue outcomes without unsupported claims.
- [ ] DEPLOYMENT.md describes the changed route/preview/release workflow and an unchanged known-good-version rollback procedure.

Create the draft integration PR early; after D08 passes and v3 is published, mark that existing PR ready for the user's normal merge/release workflow.
This ticket does not itself authorize early production publication.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D04 #9](https://github.com/amir-gorji/mcpose.dev/issues/9), [D08 #13](https://github.com/amir-gorji/mcpose.dev/issues/13).
