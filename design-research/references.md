# Developer-library website references for mcpose.dev

Research date: 2026-09-26.
This study inspects first-party page content, navigation, documented controls, and information structure.
It does not claim that animation timing, rendered visual details, keyboard behavior, Core Web Vitals, or search rankings were measured.
Recommendations below are design judgments for mcpose, rather than findings about those sites' effectiveness.

## Definition emerging from the references

A good mcpose design makes the invisible work between an MCP client and its servers understandable, memorable, and immediately usable.
Its adventure should be the discovery of what middleware changes in a real request, rather than a sequence of unrelated decorative effects.
The homepage should invite exploration while the documentation supports fast, precise retrieval.
The two experiences should share typography, diagram grammar, semantic colors, and vocabulary, with different levels of motion and density.

## Vite: category clarity and explicit versions

The homepage names its product category directly, offers a start link and repository link, and exposes package-manager-specific install commands.
It groups developer benefits separately from extension capabilities.
Its version navigation distinguishes unreleased documentation from several numbered historical versions.
[Source: Vite homepage](https://vite.dev/).

The guide separates introductory material, task guides, API references, troubleshooting, migration, and breaking changes.
[Source: Vite Getting Started](https://vite.dev/guide/).

**Recommendation for mcpose:** retain an immediately understandable category statement such as a composable MCP proxy, even if the main headline is more expressive.
Place a working starting point near the top rather than asking developers to finish the visual story first.
At launch, expose v3 as current and v2 as previous, with migration visible inside documentation navigation.
Do not make the selected major version an incidental badge far from search and navigation.

## Astro: show the mechanism behind the promise

Astro introduces its intended class of websites, explains server-first rendering and selective JavaScript, then shows source code next to a product example.
Its feature explanations link directly to relevant documentation.
Its performance comparison includes links to the underlying external data rather than only a claim in headline copy.
[Source: Astro homepage](https://astro.build/).

**Recommendation for mcpose:** every prominent visual scene should have a corresponding mechanism a developer can inspect.
Pair a request/result change with the exact middleware code that caused it.
Use short feature-specific paths into documentation, such as response transformation and tool filtering, rather than sending every interested visitor to one generic introduction.
If performance or audit claims appear, show their scope and evidence.
The research does not establish Astro's own measured loading performance, nor does it justify changing this site's framework.

## GSAP: make expression belong to the product

The homepage organizes animation capabilities into areas including scroll, SVG, text, and UI interactions.
It links those capabilities to exploration pages, demos, learning, and documentation.
Its showcase identifies projects and the GSAP tools used in them.
[Source: GSAP homepage](https://gsap.com/).

**Recommendation for mcpose:** borrow the relationship between expression and capability, not specific effects or styling.
For an animation library, animation is direct product evidence.
For mcpose, the analogous evidence is a request being transformed, filtered, routed, observed, or recorded.
A packet moving through a pipeline is useful only when it reveals an actual difference in behavior.
Decorative motion can supply atmosphere, but it should remain subordinate to that explanation.
Do not treat a showcase of animation-heavy websites as proof that such effects meet this project's performance goals.

## Motion: connect examples to an API

Motion's homepage places small API fragments beside individual animation capabilities, such as transform settings, a layout prop, and gesture names.
It gives distinct routes to examples and documentation, with documentation entry points by runtime.
It also shows releases and a route to its full changelog.
[Source: Motion homepage](https://motion.dev/).

**Recommendation for mcpose:** use the smallest truthful code fragment that explains the selected demo, while providing a complete runnable example one step away.
Keep code and behavior synchronized when visitors switch between use cases.
Let the demonstration teach one idea per state, instead of combining every package into a single unreadable code sample.
Show a released v3 identifier with a real release destination so the visual confidence has a verifiable anchor.
Do not copy Motion's runtime taxonomy: mcpose navigation should follow its own tasks and packages.

## React Flow: the homepage as a usable explanation

React Flow's homepage describes a component for node editors and interactive diagrams, and exposes instructions for selecting and moving nodes with the keyboard.
It follows with installation, customization explanations, and examples spanning multiple application domains.
Its navigation separates learning, references, examples, and migration guides.
[Source: React Flow homepage](https://reactflow.dev/).

**Recommendation for mcpose:** a constrained request explorer can make the product understandable through direct manipulation.
Prefer a few labeled use-case controls over a blank canvas or a full visual programming editor.
Maintain readable descriptions of input, active middleware, destination, and output regardless of whether the animation runs.
Demonstrate versatility through genuinely different outcomes, such as transforming a result, restricting exposed tools, composing servers, and producing audit evidence.
Use keyboard-accessible controls from the start.
The observed keyboard instructions are evidence of the site's intended interaction, not a completed accessibility audit.

## Effect: explain one central mental model

Effect's homepage pairs concrete engineering problems with named capabilities and explains its core type through success, error, and dependency dimensions.
It explicitly notes that its interactive examples need JavaScript.
The documentation root currently redirects to a version-qualified onboarding route.
[Sources: Effect homepage](https://effect.website/), [Effect documentation](https://effect.website/docs/v4/onboarding).

**Recommendation for mcpose:** establish one core model before presenting the ecosystem: a client request passes through ordered middleware to a server, then a result returns.
Only add multi-server composition and specialized governance after this is clear.
Keep the diagram's client, proxy, middleware, server, and result roles consistent across marketing and docs.
Provide the explanatory content as ordinary readable page content before JavaScript loads.
Use version-qualified documentation URLs as stable destinations, while making the current version easy to reach.

## Specific design direction

Develop an editorial engineering aesthetic organized around paths, junctions, and transparent transformations.
Use a restrained base with one distinct accent for the active request, and additional colors only when they encode a role or result.
Let large typography and composition create the first impression, then let a single integrated request explorer provide the main interactive encounter.
Use depth, line motion, and carefully staged transitions to clarify where a request is going and what changed.
Keep native scrolling and immediate access to documentation.
On smaller screens, present the same request story as a vertical sequence with explicit controls rather than a shrunken desktop network.

The homepage sequence should move from category and proposition to middleware demonstration, broader composition, production capabilities, ecosystem entry points, and getting started.
General proxy use should be the first story.
Policy, consent, observability, and audit should demonstrate depth without redefining the product as compliance-only software.
Documentation should replace theatrical movement with stable layout, readable code, durable anchors, version-aware search, migration paths, and clear package ownership.

## Acceptance questions for the eventual design

- Can a first-time visitor state what mcpose sits between and what middleware lets them change?
- Does the main demonstration reveal a meaningful before-and-after result with matching source code?
- Can visitors understand the same story without autoplay, hovering, or dragging?
- Can a developer get to installation or a relevant example without completing the homepage journey?
- Does the v2/v3 selection remain apparent in navigation, search results, and copied documentation links?
- Does every package and behavior shown match the actual released v3 API?
- Does the implementation later prove accessibility and performance rather than relying on the appearance of polish?

These questions define the value of the adventure: visitors should leave with a stronger mental model and a practical next step.
