# What good design means for mcpose.dev

Research and design conclusion, 26 September 2026.

## Definition

A good design for mcpose.dev makes the freedom of composable MCP middleware tangible, gives developers a memorable experience of changing what happens between client and server, and turns that understanding into a correct implementation with very little friction.

The homepage should be an inviting, technically honest place to explore.
The documentation should be a dependable place to work.
Both must feel like the same carefully made product.

Beauty is a requirement in this brief.
So are clear meaning, truthful behavior, accessibility, fast response, and discoverability.
A design fails if its visual excitement depends on sacrificing any of those requirements.

This definition is a design judgment derived from the user's brief, the library, and the sources below.
It is not a claim that any particular color scheme or animation technique has been scientifically proven best for mcpose.

## What the product asks of the design

mcpose is a TypeScript library used between an MCP client and upstream MCP servers.
Its central idea is composable middleware, with before-and-after request handling.
It can change results, reshape tool discovery, route to named upstreams, and add shared behavior without modifying each upstream.
The proxy should lead the positioning; governance and audit demonstrate the depth of the ecosystem.
[Library source](https://github.com/amir-gorji/mcpose), [local domain model](/Users/amir/Documents/mcpose/CONTEXT.md).

The website repository has no CONTEXT.md of its own; the domain-model evidence is in the sibling library at /Users/amir/Documents/mcpose/CONTEXT.md.
The library READMEs, public exports, relevant implementations, release tag, ADRs, and all six open issues were investigated.

The design represents the site after v3 releases.
Use v3 Current and v2 Previous.
A previous major is not automatically unsupported.
Package majors and audit-format versions are distinct: the v3 release uses audit format v2.
[ADR-0019](https://github.com/amir-gorji/mcpose/blob/main/docs/adr/0019-no-label-rotation-for-the-v3-release.md).

The site must convey that this is a library integrated into a developer's environment.
A diagram must not look like a promised hosted control panel, and a demonstration must not imply a visual workflow builder ships with mcpose.
Do not claim invention of the first MCP proxy or middleware system without evidence.

## Research and what transfers

### Developer-library references

| Reference | Observed pattern | Decision for mcpose |
| --- | --- | --- |
| [Vite](https://vite.dev/) | Explicit product category, immediate starting actions and installation, visible version navigation; rendered hero connects source-file forms to the tool | Keep the practical path visible beside the expressive experience |
| [React Flow](https://reactflow.dev/) | Hero controls visibly change a connected output; switching cube to pyramid changed the rendered output during inspection | Let an action change a real, intelligible result |
| [GSAP](https://gsap.com/) | Large-scale typography and moving forms demonstrate the library's subject; learning and documentation remain direct destinations | Use expression that belongs to middleware, with documentation always reachable |
| [Astro](https://astro.build/) | Product mechanisms are paired with examples and relevant documentation | Put exact code beside the behavior it explains |
| [Motion](https://motion.dev/) | Small API fragments accompany individual capabilities | Give each demonstration one idea and a specific implementation path |
| [Effect](https://effect.website/) | A central mental model organizes a broad technical offering | Teach the proxy and its middleware before introducing eight packages |

Vite, GSAP, and React Flow received rendered desktop inspection as well as first-party content research.
React Flow's shape selector was exercised.
The other entries were studied through their first-party content and navigation, not a complete visual or interaction audit.
No reference site's Core Web Vitals, accessibility conformance, or business effectiveness was measured.
The comparison is a source of design principles, not proof that copying an effect will improve mcpose.

### Explanation through exploration

Bret Victor's original work argues for explanations that remain readable while allowing readers to manipulate the underlying model and inspect consequences.
It explicitly warns against dropping someone into a sandbox without guiding the explanation.
For mcpose, that means a legible default example plus optional changes with visible consequences.
[Explorable Explanations](https://worrydream.com/ExplorableExplanations/).

Bartosz Ciechanowski's mechanical-watch article reveals a complex system progressively, coordinates color with explanation, and supplies global animation controls.
The transferable idea is carefully staged understanding with reader control.
The watch rendering and its implementation are not templates for mcpose.
[Mechanical Watch](https://ciechanow.ski/mechanical-watch/).

Nielsen Norman Group describes animation's useful roles in feedback, state changes, and orientation, while identifying distracting motion that competes with content.
The implication for this design is that movement should make cause and effect easier to follow.
[The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/).

Nielsen Norman Group also reports that visual appeal can mask usability problems in user feedback.
The implication is to evaluate task completion alongside perceived quality.
A visitor saying the site looks beautiful does not establish that its version switch or example is usable.
[The Aesthetic-Usability Effect](https://www.nngroup.com/articles/aesthetic-usability-effect/).

## The recommended creative direction

### The space between

The defining visual subject is the space between a client and its servers, where a small piece of middleware can change the interaction.

Make that space the central composition.
A request enters, a layer changes something, and a response returns.
The visitor can inspect the change.
As the story develops, the same composition reveals tool discovery, several upstreams, and optional observation and governance.

The personality should be imaginative, exact, and welcoming.
It should suggest that a developer can build many different things with a small, comprehensible primitive.

Use a direct category statement near the most expressive headline.
Recommended main message: “Make MCP work your way.”
Supporting statement: “A composable TypeScript proxy for MCP servers. Transform responses, shape tool access, and connect upstreams through middleware you control.”
Final copy must be checked against the released v3 feature set.

### Visual craft

Create a recognizable family of paths, junctions, and layers derived from the proxy's behavior.
Use the same forms in the hero, section transitions, diagrams, and compact brand details.
This should make the page recognizable even before the wordmark is read.

Spend the strongest visual emphasis on one integrated composition.
Give the rest of the page a deliberate rhythm: open space, a focused experiment, concise explanation, then a wider view of the ecosystem.
Avoid giving every section the same card grid or entrance animation.

Use typography as part of the composition, with deliberate line breaks and balanced negative space.
Use two families in total: a variable sans for display and reading, plus a mono for code.
My recommendation is Geist and Geist Mono, allowing scale and weight to supply personality while the request composition supplies distinctiveness.
The completed Figma direction uses Geist and Geist Mono.

Keep light and dark themes.
Start with a near-white light surface, deep neutral text, and a saturated cobalt active path.
Use secondary colors only for meaningful differences, alongside labels and shapes.
The exact palette must earn its place through rendered comparisons and contrast checks; no color choice is a substitute for a concept.

Optical alignment, line wrapping, spacing, code density, focus treatment, icon weight, and small-screen composition are first-class design decisions.
The foundation sheet's initial text-sizing defects were corrected during the rendered review.

### Interaction craft

The primary interaction is a constrained request explorer.
Use named presets and simple controls that explain their result.
Do not start with a blank editor or a drag-only node canvas.

| Scene | Visitor action | Visible consequence | Learning |
| --- | --- | --- | --- |
| Transform | Enable a response transformation | Show a small before/after result and the corresponding code change | Middleware can change what a client receives |
| Shape discovery | Hide a sample tool | Remove it from the exposed catalog; show a rejected attempted call | Discovery and execution both matter |
| Compose upstreams | Add a second named upstream | Show source names becoming distinct exposed tool names | Several servers can share a proxy endpoint |
| Observe and govern | Enable an observer or choose an allowed/denied example | Show the result and its observation/audit outcome | Specialized packages extend the same model |

The default story starts with general-purpose transformation.
Compliance is not the first encounter.

The demo is an educational simulation using public sample data.
It should be labeled as such and use release-verified fixtures and code.
Do not connect a visitor's real MCP servers, execute untrusted code, or imply that a simulated trace is a live benchmark.

For the deeper middleware example, show request and response directions explicitly.
ProxyOptions middleware arrays use response-processing order; the last entry is outermost.
A decorative left-to-right pipeline that teaches the opposite is unacceptable.
[Library middleware ordering](https://github.com/amir-gorji/mcpose#array-order-the-one-surprising-rule).

Let the composition change smoothly between these states while keeping labels and reading positions stable.
An optional short introductory motion may invite attention, then settle.
Replay and step-through controls provide repeatable exploration.
A reduced-motion view should show all information immediately.

Natural scrolling should reveal additional context without forcing a sequence or delaying navigation.
Use no mandatory loader, scroll hijacking, custom-cursor dependency, or hover-only knowledge.
Dragging may supplement explicit controls, never replace them.

On mobile, redesign the composition as an input, middleware, and result sequence with thumb-friendly controls.
Do not shrink a desktop network until its labels become unreadable.

## Homepage information architecture

1. State the category and promise; expose Get started, installation, and repository immediately.
2. Let the visitor change one request/result through middleware.
3. Expand the same model to multiple upstreams and useful everyday examples.
4. Introduce production capabilities: identity, policy, consent, telemetry, persistent transport state, and audit.
5. Make the package ecosystem scannable through jobs people need to accomplish.
6. End with the shortest verified path to a working proxy.

A visitor should be free to skim this sequence, explore one scene, or leave for documentation immediately.
The narrative should deepen understanding rather than gate access.

The examples section can group by jobs such as adapting results, shaping discovery, connecting servers, observing traffic, and governing calls.
The package directory remains available for developers who already know which API they need.

## Documentation standard

Documentation serves different kinds of work: learning a first workflow, accomplishing a task, looking up an API, and understanding a concept.
Diátaxis provides a useful separation into tutorials, how-to guides, reference, and explanation.
Use these needs to organize content without forcing empty categories.
[Diátaxis](https://diataxis.fr/).

Recommended navigation: Get started, Concepts, Guides, API and packages, Migration, and Project.
Give a complete beginner a short working tutorial, while experienced developers can jump directly to an export or recipe.

Use v3 Current and v2 Previous in a persistent control above the sidebar.
The version should also be apparent in the page title, URL, and search context.
Use durable routes such as /docs/v3/concepts/middleware/ and /docs/v2/concepts/middleware/.
The URL is authoritative; a saved preference must not silently replace an explicitly requested version.

Switch to the equivalent topic if it exists.
For a v3-only topic, explain its absence in v2 and offer relevant alternatives.
Search the selected version by default; explicitly label any opt-in cross-version results.
Keep package version and audit format separately labeled where relevant.

Docs should use stable navigation, readable line lengths, restrained syntax coloring, anchored headings, bounded code overflow, and reliable copy actions.
The reading surface should not animate while someone is working.
Optional concept diagrams can retain the same visual language and controlled step-through behavior as the homepage.

## Performance, accessibility, and SEO are design requirements

Google's good Core Web Vitals thresholds are LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1 at the 75th percentile, assessed separately for mobile and desktop.
A Lighthouse navigation score does not establish field INP or guarantee real-user performance.
[Google Web Vitals](https://web.dev/articles/vitals).

My stricter provisional prelaunch targets are mobile lab median LCP at most 2.0 seconds, CLS at most 0.05, and TBT at most 150 milliseconds under fixed, disclosed conditions.
These are project budgets, not standards or measured achievements.
The accompanying standards research records tentative transfer budgets and the need to reconcile them with the actual framework baseline.

Keep the current static-first delivery model as the starting point.
Render headings, explanatory copy, links, code, and a meaningful static diagram before optional interaction code loads.
Use SVG and native CSS for the core composition where suitable.
Load richer behavior only where it contributes to the experience, and stop offscreen work.
A WebGL scene is not justified by this concept at present.

Adopt WCAG 2.2 AA and stronger reduced-motion behavior.
Every primary interaction needs a keyboard and touch path, visible focus, sufficient contrast, and a textual explanation of its outcome.
Use 44-pixel touch areas for standalone controls as a project preference, while recognizing the AA target-size minimum is different.
[WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39).

Make versioned pages and examples discoverable through ordinary links and useful HTML.
Keep materially different v2 and v3 documentation independently canonical instead of pointing all old content at the new major.
Map existing URLs individually when restructuring the documentation.
[JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Accurate pages for MCP proxying, middleware, tool filtering, multiple upstreams, and migration will support discovery.
There is no substantiated keyword-volume research in this report, and no promise of a particular ranking.

## Release truth and the six issues

| Open issue at research time | Design consequence |
| --- | --- |
| [#176: awaited session shutdown and audit finalization](https://github.com/amir-gorji/mcpose/issues/176) | Lifecycle documentation must show the final, correct wiring |
| [#174: efficient Merkle proofs](https://github.com/amir-gorji/mcpose/issues/174) | Describe the capability without invented throughput numbers |
| [#160: security mutation-testing decision](https://github.com/amir-gorji/mcpose/issues/160) | Assurance claims depend on the decision actually adopted |
| [#155: shared session registry](https://github.com/amir-gorji/mcpose/issues/155) | Restart/resume examples require the final API; stores alone are insufficient |
| [#154: SSE stream isolation](https://github.com/amir-gorji/mcpose/issues/154) | Explain reconnect behavior with the verified isolation contract |
| [#100: mesh resources](https://github.com/amir-gorji/mcpose/issues/100) | Do not invent resource addressing, template, or subscription behavior |

Design the content slots and navigation for the intended released system.
Keep unsettled APIs out of concrete code and detailed claims until the final v3 source verifies them.
Session re-execution remains v4; a replay manifest in v3 provides verification evidence.

## How the design will be judged

Correctness, accessibility, and basic usability are hard gates.
They cannot be averaged away by a beautiful homepage.

| Dimension | Acceptance question | Evidence |
| --- | --- | --- |
| Understanding | Can a developer explain where mcpose runs and name two general-purpose uses? | Short first-impression study and subsequent explanation |
| Delight | Does a visitor want to explore and remember the composition? | Observed voluntary exploration and specific qualitative feedback |
| Causality | Can the visitor predict what changes when a middleware preset is selected? | Guided task with correct outcome and matching code |
| Adoption | Can the visitor reach and use a runnable example without completing the story? | Homepage-to-quickstart task |
| Documentation | Can a developer find an API, switch its version, and share the right link? | Keyboard, search, version, refresh, and back-navigation tasks |
| Visual craft | Do desktop, mobile, light, dark, and reduced-motion states retain hierarchy and precision? | Rendered review of each representative state |
| Performance | Does the real implementation meet the field goals and prelaunch budgets? | Production lab tests, interaction traces, and later real-user data |
| Discoverability | Can crawlers and people reach accurate version-specific content directly? | Production crawl, canonical and redirect checks |
| Maintainability | Can a new release update content without rebuilding the visual language? | Tokenized Figma components and explicit version/data boundaries |

Timing targets for first-impression and task studies should be treated as proposed evaluation tools, not research findings.
A small initial study can expose major problems but is not statistical proof of success.

## Design deliverable

[Open the Figma design](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-2).

The file contains 30 website screens and interaction states, plus a cover, review guide, foundations, reusable components, and implementation handoff.
Representative layouts cover desktop and mobile homepages, light and dark themes, v3/v2 middleware documentation, quickstart, migration, package reference, search, version selection, and four example presets.
The Website page has desktop, mobile, and documentation prototype entry points.

The prototype demonstrates selected journeys with sample data.
It does not execute MCP, implement real search, or supply the complete documentation corpus.
Version switching demonstrates the middleware topic; production must map every equivalent topic independently, using the URL rules above.
The implementation handoff specifies keyboard behavior, reduced motion, responsive behavior, SEO, performance targets, and release-dependent content verification.

The final structural check found 204 prototype actions with no missing destination nodes and no text exceeding its immediate auto-layout container.
Rendered layouts were inspected and corrected, and the website text uses only Geist and Geist Mono.
Selected token contrast pairs range from 5.11:1 to 15.29:1, including body text, muted text, accent labels, buttons, dark tinted surfaces, and code.
These checks are design evidence, not WCAG conformance certification, production performance results, or completed usability testing.

Before implementation, verify the final v3 APIs for the six issues and validate the design with real developer tasks.
Before launch, test the built site for accessibility, responsive behavior, copyable code, redirects, crawlability, and performance.

The desired result is a site people remember because exploring it made an abstract library feel powerful and understandable, and return to because using it is reliable.

## Supporting research

- [Developer-library references](references.md).
- [Accessibility, performance, and discoverability standards](standards.md).
