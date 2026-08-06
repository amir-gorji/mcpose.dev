/* Single source of truth for site-wide strings, URLs, and version copy. */

export const SITE = {
  url: 'https://mcpose.dev',
  name: 'mcpose',
  title: 'mcpose · The audit and governance layer for MCP',
  description:
    'Drop mcpose between any LLM client and any MCP server. Intercept, transform, and govern every tool call through composable onion middleware — and log it in a tamper-evident, compliance-grade audit trail. Nothing upstream changes.',
  github: 'https://github.com/amir-gorji/mcpose',
  githubSecurity: 'https://github.com/amir-gorji/mcpose/blob/main/SECURITY.md',
  npm: {
    core: 'https://www.npmjs.com/package/mcpose',
    audit: 'https://www.npmjs.com/package/@mcpose/audit',
    testing: 'https://www.npmjs.com/package/@mcpose/testing',
  },
  /* Version copy is design-final (kept verbatim from the mock even where npm
     currently publishes older versions); bump here when releases land. */
  versions: {
    core: 'v2.x',
    coreTag: '2.x',
    audit: 'v3.0 · format v2',
    auditAnnouncement: '@mcpose/audit 3.0',
    testing: 'devDependency',
  },
  installCommand: 'npm install mcpose',
  keywords: [
    'mcpose',
    'MCP',
    'Model Context Protocol',
    'audit',
    'governance',
    'middleware',
    'proxy',
    'compliance',
    'DORA',
    'SR 11-7',
    'tamper-evident',
    'PII redaction',
    'TypeScript',
  ],
  creator: 'Amir Gorji',
} as const;
