# D03: Implement the four-preset request explorer with exact fixtures and interruptible motion

## Outcome and dependencies

Teach how middleware changes MCP interactions through synchronized code, request paths and outcomes.
This is a deterministic educational simulation, not a hosted workflow builder or a live MCP connection.
Requires D01 controls and D02's `#explore` section; guide links use D04 routes.

## Figma authority and production interpretation

Frames: [Transform 10:13](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-13), [Filter 10:14](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-14), [Mesh 10:15](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-15), [Audit 10:16](https://www.figma.com/design/97unM73vIbH5ot6ccs0EJc?node-id=10-16).
Mobile states are nodes `28:218`, `28:242`, `28:263`, `28:287` in the same file.
The production explorer updates inline inside the homepage; the Figma overlay frames are state references, not a requirement to open a 1200 px modal on a phone.
Preserve normal scrolling, browser history and current focus; selecting a preset does not navigate away from the homepage.
Motion values below are the explicit production specification, not measured Figma timings.

## Presets and fixtures

Tab labels and IDs are `Transform` (`transform`), `Filter tools` (`filter`), `Connect servers` (`mesh`), `Add audit` (`audit`) in that order.
Default is Transform, fully rendered with final before/after content in the initial HTML.
Keep a visible `Sample data · simulated trace` label next to the run control in every preset.

| Preset | Heading and request | Before | After and explanation |
| --- | --- | --- | --- |
| transform | `Transform a response`; `search({ query: "deployment" })` | `The deployment guide is ready.` | Same line plus `Source: internal docs`; `The response carries the extra context your middleware added.` |
| filter | `Shape the tool catalog`; `tools/list` | Tool names `search` and `delete_document` | `Visible: search` and `Hidden: delete_document`; `A direct call to delete_document is rejected with TOOL_HIDDEN before reaching the upstream.` |
| mesh | `Connect named upstreams`; `docs__search({ query: "deployment" })` | Upstreams `docs / search` and `crm / lookup` | `docs__search -> docs / search` and `crm__lookup -> crm / lookup`; `Backend keys are part of the public tool name. The selected call routes to docs.` |
| audit | `Keep the evidence`; `search({ query: "account" })` | Sample response with an explicitly fake email `demo@example.test` | Sample response with `[REDACTED]` and `Audit event recorded`; `The audit sees the transformed response. Session evidence is finalized when the HTTP session closes.` |

The audit email pair is an explicit illustration fixture added to make the existing redaction excerpt concrete, not a library default or a real personal record.
Never render a fake signature/hash as if cryptographically verified, imply an event is itself a signed session manifest, or finalize an actual session from the browser.
For filtering, display the rejected-call outcome separately from the successful tools/list result so the two operations are not conflated.
Provide a `Try hidden call` control for that secondary path; its fixed result is `TOOL_HIDDEN · upstream not called` and its trace stops at mcpose.
Mesh tool names use double underscores; do not invent resource/template/subscription addressing.

## Code excerpts and copy

Use one typed, immutable preset data object per example to supply heading, request, before, after, explanation and display/copy snippet.
Do not maintain independent snippets for desktop and mobile that can drift.
Transform snippet:

```ts
const withSource: ToolMiddleware = async (req, next) => {
  const result = await next(req);
  return {
    ...result,
    content: [...result.content, {
      type: 'text',
      text: 'Source: internal docs',
    }],
  };
};
// In ProxyOptions:
toolMiddleware: [withSource]
```

Filter snippet:

```ts
await startProxy(upstream, {
  name: 'docs-proxy',
  hiddenTools: ['delete_document'],
});
```

Mesh snippet:

```ts
await startProxy(
  { docs: docsClient, crm: crmClient },
  { name: 'workspace-proxy', toolMiddleware: [withSource] },
);
```

Audit snippet:

```ts
// Transformer inside, observer outside.
toolMiddleware: [redact, audit.middleware]
// In the HTTP proxy lifecycle options:
onSessionClosed: async (id) => {
  await audit.closeSession(id);
}
```

Label these `TypeScript · configuration excerpt`; the missing setup is deliberate and the guide link must lead to a complete runnable example.
The released API may change before publication, especially audit close wiring; compile the complete guide sample against the final tag and update the matching excerpt/fixture together.
Never infer a final API from an unresolved library issue.
Display code with build-time Shiki using D01 colors; do not ship a browser editor, transpiler, syntax-highlighter engine or MCP SDK for the simulation.
Copy writes only the exact displayed code text, without line numbers, UI labels or wrapping artifacts.

## State machine and timing

State is selected preset plus trace state `idle | running | complete`, current stage, and the filter secondary-action state.
Initial state is `transform/idle`, with the complete static before/after result visible.
Changing preset immediately and atomically updates every label, path, fixture and snippet, resets secondary filtering state, and cancels any previous animation/timer.
Apply a 180 ms opacity transition only to the incoming decorative stage highlight; text, code and results update together without crossfading different examples.
Reserve result/code geometry with CSS grid/min-height at each breakpoint; do not measure and animate document height.

Run button is `Run example` initially, `Running…` while disabled, and `Replay trace` after completion.
Pressing Run never executes the snippet or sends a network request.
Use this 1200 ms round-trip trace for transform, tools/list, mesh and audit:

| Interval | Visual stage |
| --- | --- |
| 0-180 ms | Request marker travels Client -> mcpose |
| 180-360 ms | Request marker travels mcpose -> Upstream, or named `docs` in Mesh |
| 360-480 ms | Upstream node gets a stationary accent outline |
| 480-660 ms | Response marker travels Upstream -> mcpose |
| 660-840 ms | Middleware stage is outlined; transformation/filtering/redaction is identified by text |
| 840-1020 ms | Response marker travels mcpose -> Client |
| 1020-1200 ms | Result border changes accent -> normal; marker disappears; static final content remains |

Movement uses `cubic-bezier(0.22,1,0.36,1)`; border/opacity uses `cubic-bezier(0.2,0,0,1)`.
Markers are 6 px circles with no trails, bloom, shadow or spring.
Keep before/after text fully readable throughout; the movement is an explanation, not a required reveal of the answer.
In Audit, expand mcpose into request order `audit -> redact` and response order `redact -> audit`; use the same 180 ms middleware dwell for both response substeps, 90 ms each.
Explain that ProxyOptions arrays are response-processing order; `[redact, audit.middleware]` makes audit the outer observer.
For `Try hidden call`, use 0-180 ms Client -> mcpose, 180-360 ms blocked outline, 360-540 ms rejection -> Client, then stop; there is no upstream marker or request.

If a user changes preset, closes/navigates away, the document hides, the section leaves view, or reduced motion becomes active: cancel all pending work and set the selected example to a complete static state.
Never resume old animation on return or allow an old callback to overwrite a new preset.
Resize during motion cancels to static to avoid jumping paths; the next explicit replay uses the new geometry.
Repeated clicks while running are ignored by native disabled semantics.
Under reduced motion there is no movement, fade, pulse, delayed reveal or artificial timer; Run immediately sets the final state and announces completion once.

## Layout and accessibility

At >=1024 use two columns with 32 px gap: path/before/after/run on the left, code on the right; tabs span the top.
At 768-1023 stack result above code with 24 px gap; below 768 keep the same order and use the mobile vertical Client/mcpose/Upstream diagram.
Desktop preset controls form one row; mobile uses a 2x2 grid of 48 px high buttons with 8 px gaps, all labels visible and no horizontal tab scroller.
This 2x2 selector deliberately replaces the Figma prototype's expanded list to keep the inline mobile explorer compact.
Use manual-activation tabs: one selected tab in the Tab order, Left/Right (Up/Down too on mobile) moves focus, Home/End moves first/last, Enter/Space activates; Tab enters the associated panel.
Set role=tablist/tab/tabpanel, aria-selected, aria-controls and labelledby consistently; selected style uses accent/on-accent, others tint/accent.
Run/copy/secondary-action controls remain real buttons with visible focus and 44 px minimum targets.
Announce only `Running <preset> example` and `<preset> example complete` via a polite atomic status, not every frame or full JSON/code.
Code uses its own named overflow region, never page-level horizontal scrolling.
Guide links are transform -> `/docs/v3/recipes/transform-responses/`, filter -> `/docs/v3/recipes/list-tools-rewriting/`, mesh -> `/docs/v3/concepts/mesh/`, audit -> `/docs/v3/recipes/pii-redaction-audit/`.
Any `Check v2 compatibility` action links to the D04 missing-topic explanation for Mesh; it must not silently open unrelated v2 middleware.

## Acceptance

- [ ] All four preset fixtures, code and explanations match this contract and the intended released API.
- [ ] Default static content is in HTML; without JavaScript show Transform plus ordinary links to all four guides rather than dead controls.
- [ ] Selecting, keyboard activating and replaying presets never shows mismatched code/results or causes surrounding layout jumps.
- [ ] Round-trip and blocked-call timings match the tables, including cancellation, resize, visibility and reduced-motion paths.
- [ ] No client MCP SDK, real backend traffic, eval, randomness, fabricated benchmark or signed-evidence claim.
- [ ] Desktop and mobile compositions use the same data and preserve all information; focus/selected states are visible in both themes.
- [ ] Repository Playwright tests cover presets, tab semantics, deterministic final outcomes and interruption paths; D08 captures visual and performance evidence.

## Tracking links

Epic: [#5](https://github.com/amir-gorji/mcpose.dev/issues/5).
Related work (hard dependencies versus integration points are defined above): [D01 #6](https://github.com/amir-gorji/mcpose.dev/issues/6), [D02 #7](https://github.com/amir-gorji/mcpose.dev/issues/7), [D04 #9](https://github.com/amir-gorji/mcpose.dev/issues/9), [D08 #13](https://github.com/amir-gorji/mcpose.dev/issues/13).
