# Claude Code starter prompt — mcpose.dev

Paste this into Claude Code from the repo where the site should live, with this handoff folder present (e.g. at ./design_handoff_mcpose_site):

---

Build the mcpose.dev website from the design handoff in ./design_handoff_mcpose_site. Read README.md there first — it documents two pages (landing + Quick Start docs), all design tokens, exact copy, and interactions. The HTML files are high-fidelity design references; nocturne.css is the token source of truth.

Requirements:
1. Scaffold an Astro project with the Starlight docs integration (or use this repo's existing stack if one exists). Landing page at /, docs at /docs/quick-start.
2. Port the CSS custom properties from nocturne.css into the global stylesheet/theme; restyle the docs theme to match (dark blue-grey ground #161826, blurple accent #9184d9 used ONLY as outlines/line-weight — never solid fills; Inter ≤500 weight; fading 48px-endpoint rules on hr/table borders/sidebar border).
3. Recreate the landing page sections pixel-faithfully from 'mcpose Landing.dc.html': announcement bar, sticky blurred nav with CSS logo, code-first hero with copy-to-clipboard install row, 3×2 feature grid, concept diagram, audit section (HMAC chain diagram + tier table), packages table, CTA card, footer.
4. Recreate the Quick Start page from 'mcpose Docs.dc.html' with the docs framework's real sidebar/TOC/prev-next, styled to match the mock. Use its code blocks with copy buttons; syntax-highlight with the accent-tinted palette from the mock (keywords accent-400, strings accent-2-500, comments neutral-600).
5. Real syntax highlighting (Shiki custom theme) is fine as long as colors map to the token ramps.
6. Wire search with Pagefind (Starlight default) styled like the ⌘K field in the mock.
7. Verify external links: github.com/amir-gorji/mcpose and the npm packages (mcpose, @mcpose/audit, @mcpose/testing) — flag any 404s instead of guessing.
8. Desktop-first per the mock; add sensible responsive breakpoints (stack hero, collapse sidebar to a drawer) following Starlight conventions.

Open the two .dc.html files in a browser side-by-side with the built site and iterate until they match.
