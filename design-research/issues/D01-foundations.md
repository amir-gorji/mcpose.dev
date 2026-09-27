# D01: Implement the v3 design tokens, typography, brand assets, and shared controls

## Outcome and dependencies

Replace the current dark-only Nocturne identity with the approved light/dark mcpose system, without replacing the static Next.js/Fumadocs architecture.
This is the shared foundation for D02, D03, D05, and D06.
Implement in the redesign branch; pushing to main currently publishes production.

## Design authority

[Foundations](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=4-7), [components](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=9-2), and [home](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-2).
Use `design-research/design-tokens.json` for the exported variables and typography, and `design-research/assets/logo.svg` for the actual open-layer mark.
If the handoff bundle is unavailable, export the mark from Figma node `12:3`; do not redraw it approximately.
The values below resolve gaps in the prototype and are the implementation contract.

## Exact semantic colors

| CSS role | Light | Dark |
| --- | --- | --- |
| bg | #F8F9F5 | #101814 |
| surface | #FFFFFF | #18231E |
| text | #18231F | #EAF0E8 |
| muted | #58665E | #A7B6AA |
| border | #D8DED7 | #34473A |
| accent | #2456E8 | #9FB9FF |
| accent-hover | #1844C7 | #9FB9FF |
| tint | #E9EFFF | #26385B |
| on-accent | #FFFFFF | #101814 |
| success | #28724F | #A7B6AA |
| code-bg | #14241D | #14241D |
| code-text | #E4EFDF | #E4EFDF |
| code-muted | #A7BBA9 | #A7BBA9 |

Do not apply opacity to normal text to manufacture additional muted shades.
The decorative cobalt hero plate is a separate brand color, #2456E8 in both themes, with white plate lettering in both themes.
Do not accidentally put dark `on-accent` text over that fixed cobalt plate.

## Typography and geometry

Use Geist for UI/prose and Geist Mono for code/labels, self-hosted through the installed Next font mechanism or local WOFF2 assets with licenses retained.
Load only regular 400 and medium 500 sans plus regular 400 mono; preserve the build's deterministic font assets.
Read the installed `node_modules/next/dist/docs/` font guidance before changing the root layout.

| Style | Size / line height px | Weight | Tracking |
| --- | --- | --- | --- |
| Display desktop | 76 / 78 | 500 | -0.05em |
| Display mobile | 44 / 46 | 500 | -0.05em |
| H1 | 48 / 54 | 500 | 0 |
| H2 | 32 / 38 | 500 | 0 |
| H3 | 22 / 28 | 500 | 0 |
| Lead | 20 / 30 | 400 | 0 |
| Body | 16 / 26 | 400 | 0 |
| Small | 14 / 22 | 400 | 0 |
| Label mono | 13 / 18 | 400 | 0 |
| Code mono | 14 / 23 | 400 | 0 |
| Button | 14 / 20 | 500 | 0 |

Spacing scale is 4, 8, 12, 16, 24, 32, 48, 64, 80, 96 px; radii are 4, 8, 16 px.
Use 1 px borders, never an accidental additional pixel from content-box sizing.
All elements use border-box sizing.
Use z-index 20 for sticky headers, 30 for nonmodal popovers, 40 for scrims and 50 for modal/drawer panels; native dialog top-layer behavior takes precedence over this scale.
Never place a dropdown behind the header or let an overlay leave clickable background controls exposed.
Controls are at least 44 px high; search triggers and preset controls are 48 px high.
Buttons use 12 px vertical and 16 px horizontal padding, 8 px radius and 8 px icon/text gap.
Primary is accent/on-accent; secondary is surface/text with border; ghost is transparent/text.
Hover changes only background/border over 150 ms `cubic-bezier(0.2,0,0,1)`; no lift, scale, spring, glow, or shadow pulse.
Dark primary hover keeps its fill and adds a 1 px text-color inset outline so it still has feedback.
Focus-visible uses a 2 px accent outline with 3 px offset; the focus outline appears immediately and is not animated.
Disabled controls use native disabled semantics, 0.45 opacity, no hover effect and no activation.
Code panels use 16 px radius, 24 px padding, 16 px title/content gap, and bounded horizontal overflow with a focusable, named scroll region when overflow exists.
Do not force-wrap strings into visually different code; clipboard receives the original unwrapped string.

## Theme, copy, and shared navigation behavior

First visit follows the OS theme; an explicit Light/Dark selection is stored under `mcpose.theme` and wins on subsequent pages.
Only values `light` and `dark` are accepted; missing/invalid/unavailable storage falls back to OS preference without throwing.
Apply theme before first paint using the smallest compatible initialization; avoid hydration mismatches and a light flash on a dark visit.
If no explicit choice exists, respond to OS theme changes; otherwise keep the user's choice.
Theme changes are immediate, preserve scroll and focus, and never animate the entire document.
Use a normal labeled button, `Switch to dark theme` or `Switch to light theme`, in desktop navigation and the mobile menu.
Provide a working skip link to `#main-content` as the first keyboard destination.
The logo/wordmark is a single home link named `mcpose home`; decorative mark itself is hidden from assistive technology.

Reuse the existing copy component and clipboard handling.
On successful copy, keep button width stable, show `Copied` for 2000 ms, and announce `Copied to clipboard` once through a polite live region.
On failure, show `Copy failed. Select and copy the code.` and keep selectable text; do not report success before the promise resolves.
Cancel pending confirmation timers on unmount or subsequent activation.
All navigation uses real links; only state changes use buttons.

## Existing code to inspect

`src/styles/nocturne.css`, `src/app/layout.tsx`, `src/components/logo.tsx`, `src/components/nav.tsx`, `src/components/footer.tsx`, `src/components/copy-button.tsx`, `src/components/code-block.tsx`, `src/lib/shiki-theme.ts`, and their CSS modules.
Replace or rename Nocturne tokens consistently after finding all callers; do not keep two competing color systems.
Remove the obsolete `accent never becomes a solid fill` test: the approved v3 design explicitly uses solid cobalt fills.
Replace that tautological test with meaningful checks for the new stylesheet/token usage and visual evidence, not another source-text prohibition.
Do not hand-edit `.source/`, `out/`, generated files, or changelogs.

## Acceptance evidence

- [ ] At 1440 and 390 px, typography, tokens, logo and controls match the referenced frames in both themes.
- [ ] OS default, stored preference, invalid storage, unavailable storage and cross-page theme persistence work without flash or console hydration warnings.
- [ ] Primary, secondary, ghost, hover, focus and disabled states are demonstrated in a test fixture or component test page excluded from production navigation/indexing.
- [ ] Text contrast is at least 4.5:1 for normal text; test syntax highlighting, keycaps, selected states and both themes rather than assuming token checks cover every composition.
- [ ] Keyboard focus is fully visible, controls have useful names, and copy success/failure paths are exercised.
- [ ] Font requests contain only the chosen families; no third font, icon font or runtime remote-font request is introduced.
- [ ] `pnpm typecheck`, `pnpm lint`, and relevant static-output checks pass.

## Out of scope

No new component framework, CMS, animation library, WebGL engine, runtime MCP service, or framework upgrade is required.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D08 #13](https://github.com/amir-gorji/mcpose.dev/issues/13).
