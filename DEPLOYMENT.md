# Deployment

`mcpose.dev` is a static Next.js export (`output: 'export'`) served from Cloudflare Workers static assets.
Every push to `main` that passes CI is published to production automatically.
Every pull request gets its own preview URL.

## Pipeline

`.github/workflows/ci.yml` defines three jobs.

| Job | Runs on | What it does |
| --- | --- | --- |
| `verify` | every push to `main`, every PR | `pnpm typecheck`, `pnpm lint`, `pnpm test` (which builds first), then uploads `out/` as an artifact |
| `deploy` | pushes to `main` only | Downloads the verified `out/` and runs `wrangler deploy` onto `https://mcpose.dev` |
| `preview` | PRs from this repo only | Runs `wrangler versions upload --preview-alias pr-<N>` and comments the URL on the PR |
| `audit-preview` | after `preview` | Lighthouse SEO and Core Web Vitals against the live preview URL, commented on the PR |
| `audit-production` | after `deploy` | The same audit against `https://mcpose.dev` |

`deploy` and `preview` both depend on `verify`, so a red typecheck, lint, or test run blocks publication.
Neither deploy job rebuilds the site.
They publish the exact artifact that passed CI, so the bytes that were tested are the bytes that ship.

Forked PRs cannot read repository secrets, so the `preview` job skips them by design rather than failing with an auth error.

## Configuration

`wrangler.jsonc` is the single source of truth for the production deployment.

- `assets.directory` points at `./out`.
- `html_handling: "force-trailing-slash"` matches `trailingSlash: true` in `next.config.ts`, so every page has exactly one canonical URL.
- `not_found_handling: "404-page"` serves the real `404.html` with a 404 status.
- `routes` claims the `mcpose.dev` apex as a custom domain. Wrangler creates the DNS record and provisions the certificate on the first deploy.
- `workers_dev: false` keeps a second identical origin off the public internet so it cannot compete with the custom domain in search.
- `preview_urls: true` is set explicitly because preview URLs otherwise inherit the (disabled) `workers_dev` setting.

`public/_headers` carries the security and caching headers.
Next.js copies `public/` into `out/`, which is where Cloudflare looks for the file.
Only content-hashed paths (`/_next/static/*`, `/pagefind/index/*`, `/pagefind/fragment/*`) are cached immutably.
`pagefind-entry.json` is deliberately excluded from that list: it is the stable manifest pointing at the hashed index, so caching it forever would strand search on a stale index after a content change.

## SEO and Web Vitals gate

`.github/workflows/lighthouse.yml` is a reusable workflow, called once against the PR preview and once against production.
It audits three representative pages: the landing page, the docs index, and a deep docs page.

It deliberately runs against a **real deployment** rather than a locally served `out/`.
That way the measured numbers include the Cloudflare edge, compression, and the response headers from `public/_headers` — none of which a local server would exercise.
A short poll waits for the new Workers version to return 200 before measuring, so a propagation delay cannot cause the audit to score a 404 page.

Each page is measured three times and assertions aggregate by median, because a single Lighthouse run on a shared CI runner is too noisy to gate on.

### Thresholds

Thresholds live in `.lighthouserc.json` and were calibrated against measured baselines rather than picked from round numbers.
Measured medians at the time they were set (mobile, 3 runs):

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 97 | 96 | 100 | 100 | 2.56s | 0 | 7ms |
| `/docs/` | 98 | 95 | 100 | 100 | 2.31s | 0 | 3ms |
| `/docs/concepts/middleware-model/` | 98 | 96 | 100 | 100 | 2.31s | 0 | 4ms |

SEO and best practices are asserted at a perfect 100 because both currently score 100 and both are deterministic — they do not vary with runner load.
Performance is gated at 95 and accessibility at 95, just under the measured values, so the gate catches a real regression without flapping on runner noise.

`largest-contentful-paint` is gated at 3000ms rather than Google's 2500ms "good" boundary.
The landing page currently medians at 2556ms, marginally over that boundary, so asserting 2500 would fail on the first run.
3000ms still sits well inside Google's 4000ms "poor" line and leaves headroom over the 2710ms worst observed run.
**The landing page LCP is worth optimising**; when it drops under 2500ms, tighten this assertion to match.

`color-contrast` is asserted as a warning rather than an error.
It currently fails on both the landing page and the docs pages, which is why accessibility sits at 95/96 instead of 100.
See "Known issues" below.

## Known issues

Lighthouse reports insufficient colour contrast on these elements:

- `.search-trigger-module__*__keycap` (the ⌘K keycap in the search trigger), on every page.
- `.hero-module__*__codeLang` and inline `<span style="color:#75798C">` on the landing page.
- `.card-body` on the docs index.

These are design-token choices, not deployment problems, so the pipeline reports them rather than blocking on them.
Fixing them would take accessibility to 100 and let the `color-contrast` assertion be promoted from `warn` to `error`.

## Real-user metrics

The Lighthouse gate measures lab conditions.
For field data — real Core Web Vitals from actual visitors — enable **Cloudflare Web Analytics** on the `mcpose.dev` zone in the dashboard.
It reports LCP, CLS, and INP from real sessions and needs no code change or third-party script.

## One-time setup

Two repository secrets are required before the first deploy will succeed.

### 1. `CLOUDFLARE_API_TOKEN`

In the Cloudflare dashboard, go to **My Profile → API Tokens → Create Token**.

- Use the **Edit Cloudflare Workers** template.
- Under **Account Resources**, select the account that holds `mcpose.dev`.
- Under **Zone Resources**, include the `mcpose.dev` zone. This is required for the custom domain: without it, Wrangler cannot create the DNS record or issue the certificate.

### 2. `CLOUDFLARE_ACCOUNT_ID`

Find it on the Cloudflare dashboard overview page for the `mcpose.dev` zone, or run `wrangler whoami` after authenticating locally.

### Adding them

```sh
gh secret set CLOUDFLARE_API_TOKEN  --repo amir-gorji/mcpose.dev
gh secret set CLOUDFLARE_ACCOUNT_ID --repo amir-gorji/mcpose.dev
```

### 3. `www` redirect (optional)

`wrangler.jsonc` claims the apex only, so `www.mcpose.dev` will not resolve.
If you want it to work, add a Cloudflare **Redirect Rule** rather than a second custom domain, so the two hostnames do not serve duplicate content.

- Dashboard → the `mcpose.dev` zone → **Rules → Redirect Rules → Create rule**.
- Match: `Hostname equals www.mcpose.dev`.
- Then: **Dynamic** redirect, status **301**, expression `concat("https://mcpose.dev", http.request.uri.path)`, and enable **preserve query string**.

You will also need a proxied DNS record for `www` (an `AAAA` record pointing at `100::` is the conventional placeholder) for the rule to have anything to intercept.

## Local commands

```sh
pnpm test          # build + static-export invariant tests
pnpm typecheck
pnpm lint

pnpm cf:deploy     # deploy to production from your machine
pnpm cf:preview    # upload a version and get a preview URL, without touching production
```

`cf:deploy` and `cf:preview` are named with a prefix because `pnpm deploy` collides with pnpm's own built-in `deploy` command.

Both require local Cloudflare auth (`wrangler login`) and expect `out/` to already be built.
Run `pnpm build` first.

## Rollback

Deployments are versioned.
List recent versions and roll production back to a known-good one without rebuilding:

```sh
pnpm exec wrangler versions list
pnpm exec wrangler versions deploy <version-id>@100
```
