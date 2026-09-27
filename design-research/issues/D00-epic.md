# D00: Implement and launch the post-v3 mcpose.dev redesign

## Product outcome

Build the approved new mcpose.dev identity and website: a memorable, interactive introduction to general-purpose composable MCP proxying, followed by calm, reliable, versioned documentation.
Launch only after the library's v3 release.
V3 is Current/default and v2 is Previous; governance, policy, consent and audit are capabilities, not the entire product category.

[Figma design](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-2).
Read `implementation-handoff.md` and `design-research/design-definition.md` in the supplied workspace bundle before implementing.
Every child issue includes its own detailed contract, relevant Figma nodes, implementation touchpoints and acceptance checks.

## Work breakdown and dependencies

| Ticket | Deliverable | Requires |
| --- | --- | --- |
| [D01 #6](https://github.com/amir-gorji/mcpose.dev/issues/6) | Tokens, fonts, brand, themes and shared controls | None |
| [D02 #7](https://github.com/amir-gorji/mcpose.dev/issues/7) | Desktop/mobile homepage and signature hero | D01; destinations from D04 |
| [D03 #8](https://github.com/amir-gorji/mcpose.dev/issues/8) | Four-preset explorer, exact fixtures and motion | D01, D02; guide destinations from D04 |
| [D04 #9](https://github.com/amir-gorji/mcpose.dev/issues/9) | Versioned routes, provenance and counterpart manifest | None; coordinate with D07 |
| [D05 #10](https://github.com/amir-gorji/mcpose.dev/issues/10) | Documentation shell, templates and complete content | D01, D04 |
| [D06 #11](https://github.com/amir-gorji/mcpose.dev/issues/11) | Version-scoped Pagefind search and all dialog states | D01, D04; integration with D05 |
| [D07 #12](https://github.com/amir-gorji/mcpose.dev/issues/12) | SEO, legacy redirects, static delivery and release gate | D04; final content from D02/D05; final evidence D08 |
| [D08 #13](https://github.com/amir-gorji/mcpose.dev/issues/13) | Browser, visual, accessibility and performance evidence | Start harness early; full acceptance after D01-D07 |

Create the integration branch and safe CI coverage described in D07 first.
Then run D01 and D04 in parallel; implement D02/D05 after those foundations; implement D03/D06 against the agreed data contracts; finish D07/D08 integration and release evidence.
Do not start eight agents editing shared route/token files simultaneously.
Keep final reconciliation and visual review with one lead agent; use cheaper agents for bounded fixtures, content provenance, individual CSS components, and test cases.

## Authority and deliberate Figma corrections

Released library behavior overrides illustrative API copy.
The child tickets define exact production behavior where Figma is silent or simplified; Figma defines the resting visual composition.
Do not copy Figma prototype shortcuts such as sending every version menu to the middleware example, opening desktop overlays on mobile, or using static search results.
The explorer belongs inline, version equivalence is per topic, real search is version-filtered, and code snippets must be checked against the final release.
Do not replace verified v2 behavior with current-main behavior.
The known v2.1.1 source SHA is `b499195f56295f85cbfdf505911dc4ae7429828c`; its package majors do not all equal the website documentation major.

## Repository constraints

Retain Next static export, React, Fumadocs, build-time Shiki, Pagefind and Cloudflare Workers static assets.
Read installed Next documentation before coding; the project's Next 16.3 APIs must not be guessed from older knowledge.
No CMS migration, framework upgrade, UI framework replacement, live MCP demo service, WebGL engine or motion package is required.
Use the repository's Playwright setup introduced in D08 for local UI checks.
Never edit generated output or changelogs by hand.

## Release rule

Main auto-deploys today.
Keep redesign work on `codex/v3-site-redesign` with a draft integration PR/preview until actual v3 release source, package availability, all six library issue outcomes, documentation examples and D08 evidence are verified.
No premature production merge, false release announcement, invented API, fabricated benchmark or compliance certification claim.
Library release dependencies: [shutdown #176](https://github.com/amir-gorji/mcpose/issues/176), [Merkle #174](https://github.com/amir-gorji/mcpose/issues/174), [mutation testing #160](https://github.com/amir-gorji/mcpose/issues/160), [session registry #155](https://github.com/amir-gorji/mcpose/issues/155), [SSE isolation #154](https://github.com/amir-gorji/mcpose/issues/154), [mesh resources #100](https://github.com/amir-gorji/mcpose/issues/100).

## Epic completion

- [ ] All eight child issues are complete with their acceptance evidence.
- [ ] Desktop/mobile, both themes and reduced motion match the design and remain usable with keyboard and touch.
- [ ] V2/v3 routes, search, migration and copyable runnable examples are accurate and independently discoverable.
- [ ] Existing public links remain useful through reviewed explicit redirects.
- [ ] Lab/visual/accessibility evidence passes; unknown field data is explicitly reported as unknown.
- [ ] V3 release verification and the existing production rollout/rollback workflow are ready.

This epic covers implementation and release readiness; it is not evidence that the new site has already been built, tested or published.
