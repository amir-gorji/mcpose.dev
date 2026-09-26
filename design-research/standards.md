# mcpose.dev design standard: accessibility, performance, discoverability

Research date: 2026-09-26.
This report informs a design launching after library v3 is released, with v3 the default and v2 still selectable.
The acceptance gates below are recommendations for this project unless explicitly identified as published standards.

## Definition of good design

A good mcpose.dev design makes the power of composable MCP middleware immediately understandable, makes experimenting inviting, and makes correct implementation effortless.
The homepage can be an adventure through a request's journey, but the journey must communicate real capabilities and leave visitors free to read, skip, explore, or start building.
The documentation should feel like a dependable instrument: exact version context, predictable navigation, readable code, fast search, and durable links.
Visual distinction is successful when visitors remember how mcpose works as well as how the page looked.
Motion is useful when it explains causality, such as a request entering middleware and a changed response emerging; decorative motion has a lower claim on attention and performance budget.

## Published performance baseline

Google's current good Core Web Vitals thresholds are LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1, assessed at the 75th percentile and segmented by mobile and desktop.
All three must pass for a passing assessment.
These are field experience thresholds, not targets that a beautiful Figma file can establish. [Google Web Vitals](https://web.dev/articles/vitals)

Lab tests control devices and networks, while field data captures actual users and their behavior.
CrUX summarizes a 28-day distribution, so a launch cannot immediately establish a representative new site's field result.
Use lab testing to catch regressions and real-user measurements to verify the actual result. [Google on lab and field differences](https://web.dev/articles/lab-and-field-data-differences)

A normal Lighthouse navigation run does not measure INP because it does not exercise user input; its Total Blocking Time is a diagnostic proxy, not INP itself.
Do not report a Lighthouse score as proof that all Core Web Vitals pass. [Google Web Vitals](https://web.dev/articles/vitals)

### Proposed performance gates

| Gate | Project recommendation | Evidence |
| --- | --- | --- |
| Field performance | All three official good thresholds at p75 for mobile and desktop; report homepage and docs separately when samples allow | RUM after release, CrUX where available |
| Prelaunch headroom | Mobile lab median LCP at most 2.0 seconds, CLS at most 0.05, TBT at most 150 ms across three runs under fixed disclosed settings | Production build and fixed Lighthouse configuration |
| Interactive responsiveness | Exercise demo switches, navigation, version switch, search, and copy actions under CPU throttling; investigate every slow trace | Browser interaction traces; not claimed as field INP |
| Initial transfer | Provisional ceiling of 180 KiB compressed JavaScript on homepage, 120 KiB on a docs article, including framework code | Build report and cold network trace; refine once framework baseline is measured |
| Decorative media | No initial video or WebGL dependency; lazy-load optional explorations after critical content | Network trace and JS-disabled inspection |
| Layout stability | Reserve diagram, font, media, and search-overlay geometry | Slow-network visual inspection and CLS attribution |

The numerical headroom and byte ceilings are design budgets, not Google requirements.
Use them to shape the composition before implementation; if the measured framework baseline makes a budget unrealistic, revise it explicitly without relaxing the user-visible performance goal.
The primary headline, explanation, install code, navigation, and documentation must remain available before optional animation code loads.

## Accessibility and motion

Adopt WCAG 2.2 AA as the site acceptance target, with selected stronger motion and target-size practices.
WCAG is a testable standard; W3C Understanding pages explain its criteria and are informative supporting material. [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)

All ordinary functionality must have a keyboard-operable path without special key timing.
For mcpose this includes each demo preset, search, copy controls, mobile navigation, and the documentation version selector. [Keyboard, SC 2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)

AA text contrast is at least 4.5:1 for normal text and 3:1 for qualifying large text, subject to the criterion's exceptions.
Test both light and dark palettes, including secondary text and syntax highlighting. [Contrast Minimum, SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

AA targets generally need 24 by 24 CSS pixels or a qualifying exception, including sufficient spacing.
For this project, prefer 44 by 44 CSS pixel touch hit areas for standalone controls; that is a stronger project choice, not the AA minimum. [Target Size Minimum, SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)

Sticky headers and panels must not entirely hide the focused component under AA.
Our stronger gate should require the entire focus indicator to remain visible. [Focus Not Obscured Minimum, SC 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)

Nonessential interaction-triggered motion being disableable is an AAA criterion; adopt it despite an AA baseline.
Honor the operating system's reduced-motion preference and show a complete static diagram, not an empty hero. [Animation from Interactions, SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [W3C reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)

Automatically started movement lasting over five seconds alongside other content requires a pause, stop, or hide mechanism unless essential.
Automatically updating information has a related requirement without the five-second exception.
Prefer a brief introductory sequence that settles, followed by explicit replay and step-through controls. [Pause, Stop, Hide, SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)

At a 320 CSS pixel equivalent width, content should reflow without requiring horizontal page scrolling, apart from qualifying two-dimensional content.
Code can use its own clearly bounded scroll region when needed, but the navigation, prose, and calls to action should reflow. [Reflow, SC 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

### Proposed interaction gates

- Complete homepage-to-quickstart, version switching, and search using keyboard only.
- Screen-reader testing announces names, selected states, results, copy confirmation, and version context without animation noise.
- Reduced-motion, zoom, narrow viewport, touch, and both themes preserve all information and functionality.
- No scroll hijacking, mandatory cinematic intro, custom cursor dependency, hover-only explanations, or automatically moving documentation content.
- Automated accessibility checks have zero serious or critical findings, followed by manual checks; automation alone does not establish conformance.

## SEO and versioned documentation

Google requires accessible pages with a successful HTTP response and indexable content for indexing eligibility, but does not guarantee indexing. [Google technical requirements](https://developers.google.com/search/docs/essentials/technical)
Make core content available as rendered HTML with descriptive unique titles and snippets; optional diagrams should enhance that content rather than contain the only explanation. [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
Use actual links with href destinations for navigation and topic discovery, including version links. [Google crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

Canonical annotations identify preferred URLs among duplicate or very similar pages and are strong signals rather than guarantees.
Align internal links, sitemap URLs, and canonical targets; avoid conflicting canonical declarations. [Canonical consolidation guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

Our recommendation is durable, self-canonical version paths such as `/docs/v3/middleware` and `/docs/v2/middleware`, with a current-version landing entry at `/docs`.
Do not blanket-canonicalize v2 to v3: materially different APIs serve different user needs.
This is an application of Google's duplicate-content guidance, not a Google rule specifically prescribing software documentation architecture. [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)

Use `v3 · Current` and `v2 · Previous` after release.
Do not label v2 unsupported or unmaintained unless that policy is actually established.
The URL is the source of version truth; a saved preference must never silently redirect a person following a version-specific external link.
Switch to the same topic in the other version when an equivalent exists; otherwise provide a clear absence message with relevant alternatives rather than silently opening an unrelated page.
Search should default to the current documentation version and label every cross-version result.

Docusaurus demonstrates the useful distinction between the version currently being edited and the version served as latest, and provides explicit version labels, paths, banners, and selectors.
Use that product pattern as evidence for clear version context without assuming its framework must be adopted. [Docusaurus versioning](https://docusaurus.io/docs/versioning)

### Proposed discoverability gates

- Every public canonical content page has a unique title, useful description, clear heading hierarchy, correct status, and version context where applicable.
- Published v2 and v3 topic URLs survive direct navigation, refresh, sharing, and back navigation.
- Existing public documentation URLs receive individually mapped redirects when moved; do not send every old route to a generic homepage.
- All indexable canonical pages appear in a sitemap and important pages have internal links.
- Search results and code examples never silently mix library majors; audit-format version labels are visually distinct from library-version labels.
- Before launch, crawl the production build for broken links, wrong canonicals, absent version equivalents, and accidental noindex directives.

Good Core Web Vitals support the search experience, but perfect scores do not guarantee rankings.
The strongest content strategy here is accurate, useful answers to real MCP proxy and middleware questions, supported by working examples and precise package references. [Google page experience guidance](https://developers.google.com/search/docs/appearance/page-experience)
