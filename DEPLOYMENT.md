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
