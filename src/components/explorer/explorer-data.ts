export type PresetId = 'transform' | 'filter' | 'mesh' | 'audit';

export interface PresetData {
  readonly id: PresetId;
  readonly label: string;
  readonly heading: string;
  readonly request: string;
  readonly before: readonly string[];
  readonly after: readonly string[];
  readonly explanation: string;
  readonly guideUrl: string;
  readonly codeSnippet: string;
  readonly secondaryAction?: {
    readonly label: string;
    readonly request: string;
    readonly result: string;
    readonly explanation: string;
  };
}

export const PRESETS: readonly PresetData[] = [
  {
    id: 'transform',
    label: 'Transform',
    heading: 'Transform a response',
    request: 'search({ query: "deployment" })',
    before: ['The deployment guide is ready.'],
    after: ['The deployment guide is ready.', 'Source: internal docs'],
    explanation: 'The response carries the extra context your middleware added.',
    guideUrl: '/docs/v3/recipes/transform-responses/',
    codeSnippet: `import { hasToolContent } from 'mcpose';
import type { ToolMiddleware } from 'mcpose';

const withSource: ToolMiddleware = async (req, next) => {
  const result = await next(req);
  if (!hasToolContent(result)) return result;
  return {
    ...result,
    content: [...result.content, {
      type: 'text',
      text: 'Source: internal docs',
    }],
  };
};
// In ProxyOptions:
toolMiddleware: [withSource]`,
  },
  {
    id: 'filter',
    label: 'Filter tools',
    heading: 'Shape the tool catalog',
    request: 'tools/list',
    before: ['Tool: search', 'Tool: delete_document'],
    after: ['Visible: search', 'Hidden: delete_document'],
    explanation:
      'A direct call to delete_document is rejected with TOOL_HIDDEN before reaching the upstream.',
    guideUrl: '/docs/v3/recipes/list-tools-rewriting/',
    secondaryAction: {
      label: 'Try hidden call',
      request: 'delete_document({ id: "doc-123" })',
      result: 'TOOL_HIDDEN · upstream not called',
      explanation:
        'A direct call to delete_document is rejected with TOOL_HIDDEN before reaching the upstream.',
    },
    codeSnippet: `await startProxy(upstream, {
  name: 'docs-proxy',
  hiddenTools: ['delete_document'],
});`,
  },
  {
    id: 'mesh',
    label: 'Connect servers',
    heading: 'Connect named upstreams',
    request: 'docs__search({ query: "deployment" })',
    before: ['Upstream: docs / search', 'Upstream: crm / lookup'],
    after: [
      'docs__search -> docs / search',
      'crm__lookup -> crm / lookup',
    ],
    explanation:
      'Backend keys are part of the public tool name. The selected call routes to docs.',
    guideUrl: '/docs/v3/concepts/mesh/',
    codeSnippet: `await startProxy(
  { docs: docsClient, crm: crmClient },
  { name: 'workspace-proxy', toolMiddleware: [withSource] },
);`,
  },
  {
    id: 'audit',
    label: 'Add audit',
    heading: 'Keep the evidence',
    request: 'search({ query: "account" })',
    before: ['Account: demo@example.test'],
    after: ['Account: [REDACTED]', 'Audit event recorded'],
    explanation:
      'The audit sees the transformed response. Session evidence is finalized when the HTTP session closes.',
    guideUrl: '/docs/v3/recipes/pii-redaction-audit/',
    codeSnippet: `// Transformer inside, observer outside.
toolMiddleware: [redact, audit.middleware]
// In the HTTP proxy lifecycle options:
onSessionClosed: async (id) => {
  await audit.closeSession(id);
}`,
  },
] as const;
