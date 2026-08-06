# Handoff: mcpose.dev — Landing + Docs site

## Overview
Marketing/docs website for **mcpose**, a TypeScript library that acts as a transparent middleware proxy for MCP servers with compliance-grade audit trails. Two pages: a landing page (hero, features, concept diagram, audit section, packages table, CTA, footer) and one docs page (Quick Start) that establishes the docs pattern (sidebar nav + article + page TOC).

Positioning: "The audit and governance layer for MCP." Audience: TS developers and teams evaluating MCP in regulated environments (finance, healthcare).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to ship directly. Your task is to **recreate these designs in your target stack** using its established patterns. Recommended stacks if none exists yet:

- **Astro + Starlight** (best fit: mostly-static marketing + docs, MD/MDX content, built-in search/sidebar/TOC) — restyle Starlight with the design tokens below.
- **Next.js + Nextra** or **Docusaurus** — also fine; theme with the same tokens.

The prototypes use a small component/token stylesheet (`nocturne.css`, included) plus inline styles. Port the tokens to CSS custom properties (they already are) or your theme config, and rebuild layouts with your framework's components.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final intent. Recreate pixel-perfectly; exact values below and in the source files.

## Design Tokens (nocturne.css — included, source of truth)
Colors:
- Background `#161826`, surface `#232532`, text `#e9e9ed`
- Accent (blurple) `#9184d9`, accent-2 `#a7a1db`
- Divider: `color-mix(in srgb, #e9e9ed 16%, transparent)`
- Neutral ramp 100→900: `#f3f5fe #e4e7f5 #cfd3e5 #b2b6ca #9397ab #75798c #595d6c #3f424d #292b31`
- Accent ramp 100→900: `#f5f4ff #e7e5fe #d2cefd #b5abfc #968ae0 #796cbf #5d5294 #423a6a #2b2741`
- Accent-2 ramp 100→900: `#f5f4ff #e7e5fe #d2cefd #b5afe8 #9690c9 #7972a9 #5c5783 #423e5d #2b293a`

Key rule of the system: **the accent is used as outline and line weight, never solid fills** (outline buttons, outline tags, 1px accent box-shadows). Tag fills use the 800 step of a ramp with 100-step text.

Typography:
- UI/body: Inter (Google Fonts), weights ≤500 for headings (`--font-heading-weight: 500`), 400 body. Body 15px/1.55. Headings: h1 42px, h2 32px, h3 25px, h4 20px; line-height 1.12; letter-spacing -0.015em.
- Code/brand wordmark: `ui-monospace, 'SF Mono', Menlo, Consolas, monospace` (no webfont). Code blocks 12.5px/1.7–1.75.
- Micro-kickers: 10–10.5px, uppercase, letter-spacing 0.1–0.14em, accent color, weight 500.

Spacing scale (px): 2.8, 5.6, 8.4, 11.2, 16.8, 22.4 (`--space-1..8`). Section rhythm on landing: `calc(22.4px * 4)` top padding per section; content max-width 1160px (landing) / 1360px (docs shell), docs article max-width 720px.

Radii: 4 / 8 / 14px. Shadows (dark-theme = hairline ring + ambient):
- sm `0 0 0 1px #3f424d`
- md `0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,0.55)`
- lg `0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,0.65)`

Signature detail — **fading rules**: horizontal rules and table row borders are 1px gradients that fade to transparent over 48px at each end (see `.hr` and `.table` in nocturne.css). The docs sidebar's right border is the same gradient, vertical.

Focus: `:focus-visible { outline: 2px solid accent; offset 2px }`. Selection: accent at 30%.

## Screens / Views

### 1. Landing (`mcpose Landing.dc.html`)
Top→bottom:
- **Announcement bar** (toggleable): bg accent-900, bottom border accent-800, centered row: "NEW" tag (accent tag), mono text `@mcpose/audit 3.0 — audit format v2: canonical serialization, full-manifest signatures`, link "ADR-0004 →" in accent-300. 12.5px.
- **Nav** (sticky, z-50): bg = page bg at 85% + `backdrop-filter: blur(12px)`, 1px divider bottom border. Inner 1160px, 56px tall. Left: logo (nested rounded squares: 20px outer border neutral-700, 11px inner border accent, 3px accent dot), mono wordmark "mcpose" 15px/500, "2.x" neutral tag. Right: fake search field (surface bg, divider border, "Search docs…" + ⌘K key cap, min-width 170px) then links Docs / GitHub / npm (14px, hover → accent).
- **Hero**: 2-col grid (1.02fr/1fr, gap ~56px), top padding ~78px. Left: kicker "Transparent MCP proxy · TypeScript"; h1 "The audit and governance layer for MCP."; lede 16px/1.65 neutral-400 max 520px; install row (mono `$ npm install mcpose` in surface box + secondary "copy" button with copied-state feedback); buttons "Get started →" (btn-primary = accent outline) + "GitHub" (btn-secondary = divider outline); mono metadata row 11px neutral-500: `v2.x on npm · MIT · Node 20+ · ESM, types included · semver-disciplined`. Right: code window (surface, elev-md, header row "proxy.ts / TypeScript") showing the audit-http snippet (see source for exact code + syntax tinting: keywords accent-400, fn names accent-200, strings accent-2-500, comments neutral-600, base neutral-200).
- **Features**: kicker "Why mcpose", h2 "Cross-cutting concerns, composed.", 3×2 grid of plain text features (NO cards): uppercase accent mini-heading + 13.5px neutral-400 body. Items: Transparent proxy / Onion middleware / Governance / Identity / Tamper-evident audit / Production transport (exact copy in source).
- **Concept diagram**: h2 "One proxy in the middle." Horizontal flow: card "LLM client" (190px) → labeled connector (MCP, diamond endpoints, `http · sse · stdio`) → central mcpose box (300px, surface, accent-700 ring, header "mcpose / :3000/mcp", 4 rows with accent diamond bullets: identity resolution, visibility filters, middleware pipelines, audit trail) → connector (`stdio · http`) → card "Upstream server". Below (toggleable): "Three routing paths per tool or resource" — 3 cards (Hidden / Pass-through / Middleware) with kicker + mono option name + body.
- **Audit section**: kicker "@mcpose/audit", h2 "Audit trails an examiner can verify.", lede mentions DORA Art. 17 and SR 11-7. 2-col: left = 4 plain-text features (HMAC-chained events, Replay manifest, Sensitivity tiers, Never in the hot path); right = HMAC chain diagram (mono chips e₀→e₁→e₂→…→"manifest ✓" outline tag, connected by 1px lines labeled "hmac") above a 2-col table of sensitivity tiers (low/medium/high tags → stored fields, mono).
- **Packages**: h2 "Three packages, one surface." Table: mcpose (v2.x) / @mcpose/audit (v3.0 · format v2) / @mcpose/testing (devDependency). Footnote: peer dep `@modelcontextprotocol/sdk ≥ 1.0`.
- **CTA**: centered surface card (radius-lg, elev-sm): h3 "Drop it in front of any MCP server.", "Ten lines of glue. Nothing upstream changes.", install row + copy, "Read the docs →" primary button.
- **Footer**: fading hr, then logo + "mcpose · MIT license" left, links GitHub/npm/Docs/Security right, and a muted provenance line: "Extracted from a production financial Elasticsearch MCP deployment · Node 20+ · ESM · TypeScript-first".

### 2. Docs — Quick Start (`mcpose Docs.dc.html`)
Same sticky nav (Docs link gets `aria-current="page"`, accent color). Shell: 1360px, 3 columns:
- **Left sidebar** (240px, sticky below nav, own scroll, fading right border): groups Getting started (Introduction, Install, **Quick Start** ← active, Examples), Concepts (Proxy model, Middleware model, Identity & sessions, Rejection reasons), Packages (mono: mcpose, @mcpose/audit, @mcpose/testing), Recipes (PII redaction + audit, list_tools rewriting, OAuth upstream), Project (Roadmap, ADRs, Contributing, Security). Item: 13px, neutral-400, hover = text + 6% wash; active = accent text + 12% accent wash + weight 500. Group label: 10px uppercase neutral-600.
- **Article** (max 720px): breadcrumb (Docs / Getting started / Quick Start), h1 32px, lede. Sections: Prerequisites (list), Install (code block: 3 npm commands with comments), Wrap a server (proxy.ts code block), note card ("Note · Middleware order" — kicker card explaining response-processing order), Run it (claude_desktop_config.json block + HTTP variant paragraph), Routing paths (3-row table + "Hidden beats pass-through" footnote), Next steps (2 link cards: Middleware model, @mcpose/audit; hover = accent-700 ring), "Edit this page on GitHub →" link, fading hr, prev/next pager (Install ← / → Proxy model; outlined boxes, hover border accent-700).
- **Right TOC** (190px, sticky, toggleable): "On this page" + anchor list with 1px left border; active item accent, rest neutral-500.
- Code blocks: surface bg, elev-sm ring, header row (filename left, copy button right), pre 12.5px/1.75.

## Interactions & Behavior
- Copy buttons: write the block's raw text to clipboard, swap label to "copied ✓" for 1.4s, then back to "copy". (Raw strings for each block are in the docs file's script section.)
- Link hovers: accent (or accent-300 where already accent). Buttons: primary hover = accent 12% wash, active 22%; secondary = text 7%/14%.
- Sticky: nav (top 0), sidebar + TOC (top 56px).
- Search field and most sidebar links are **visual stubs** — wire to real search (e.g. Pagefind/Algolia) and real routes in production.
- Prototype toggles (announcement bar on/off, routing-paths section on/off, hero snippet variant audit-http vs minimal-stdio, page TOC on/off, edit link on/off) exist to compare variants — in production these are just build-time decisions, not runtime state. Both hero snippet variants' code is in the landing source.
- No other JS. No scroll animations. Responsive behavior not designed — desktop (~1280–1440px) is the target; add breakpoints per your framework's conventions.

## State Management
Only per-code-block "copied" flags (id + 1.4s timeout). No data fetching.

## Assets
No images. Logo is pure CSS (nested rounded squares). Fonts: Inter via Google Fonts; system monospace stack for code.

## External URLs (CONFIRM BEFORE SHIPPING)
All GitHub/npm links assume `github.com/amir-gorji/mcpose`, `npmjs.com/package/mcpose`, `@mcpose/audit`, `@mcpose/testing`. Verify org/package names.

## Files
- `mcpose Landing.dc.html` — landing page (markup between <x-dc>…</x-dc>; interaction logic in the trailing script block)
- `mcpose Docs.dc.html` — Quick Start docs page
- `nocturne.css` — design tokens + component classes (.btn, .tag, .card, .table, .hr, .nav, forms) — source of truth for the look
- `CLAUDE_CODE_PROMPT.md` — a starter prompt to paste into Claude Code

Note: the `.dc.html` files use a few prototype-runtime tags (`<x-dc>`, `<helmet>`, `<sc-if>`, `{{ holes }}`). Treat `<sc-if>` as a conditional render, `{{ x }}` as a template binding, and ignore `support.js` — everything else is plain HTML/CSS.
