/* Single source of truth for site-wide strings, URLs, and version copy. */

/* The three versions that exist on npm, and nothing else. Every version string
   the site renders is derived from these, so the site cannot claim a release
   the registry does not have. The previous copy came verbatim from the design
   mock and advertised "@mcpose/audit 3.0" in the announcement bar; 3.0 has
   never been published, and the comment that used to sit here licensed the
   discrepancy instead of fixing it. Bump these in the same commit as a
   release. */
const PUBLISHED = {
  core: '2.1.1',
  audit: '2.0.3',
  testing: '2.0.3',
} as const;

const majorLine = (version: string): string => `${version.split('.')[0]}.x`;

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
  published: PUBLISHED,
  installCommand: 'npm install mcpose',
  /* Display strings, derived so they cannot drift from PUBLISHED. */
  versions: {
    core: `v${PUBLISHED.core}`,
    coreTag: majorLine(PUBLISHED.core),
    audit: `v${PUBLISHED.audit}`,
    testing: `v${PUBLISHED.testing}`,
  },
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
