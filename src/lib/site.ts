/* Single source of truth for site-wide strings, URLs, and package versions. */

export const PUBLISHED_V2 = {
  core: '2.1.1',
  audit: '2.0.3',
  testing: '2.0.3',
} as const;

export const PUBLISHED_V3 = {
  core: '3.0.0',
  policy: '1.0.0',
  consent: '1.0.0',
  audit: '3.0.0',
  testing: '3.0.0',
  otel: '0.1.0',
  storeRedis: '0.1.0',
  storePostgres: '0.1.0',
} as const;

export const SITE = {
  url: 'https://mcpose.dev',
  name: 'mcpose',
  title: 'mcpose | The programmable MCP proxy',
  description:
    'A programmable TypeScript proxy for MCP. Build a gateway, shape tools and results, and inspect calls through middleware you control.',
  github: 'https://github.com/amir-gorji/mcpose',
  githubSecurity: 'https://github.com/amir-gorji/mcpose/blob/main/SECURITY.md',
  npm: {
    core: 'https://www.npmjs.com/package/mcpose',
    policy: 'https://www.npmjs.com/package/@mcpose/policy',
    consent: 'https://www.npmjs.com/package/@mcpose/consent',
    audit: 'https://www.npmjs.com/package/@mcpose/audit',
    testing: 'https://www.npmjs.com/package/@mcpose/testing',
    otel: 'https://www.npmjs.com/package/@mcpose/otel',
    storeRedis: 'https://www.npmjs.com/package/@mcpose/store-redis',
    storePostgres: 'https://www.npmjs.com/package/@mcpose/store-postgres',
  },
  published: PUBLISHED_V3,
  publishedV2: PUBLISHED_V2,
  installCommand: 'npm install mcpose @modelcontextprotocol/sdk',
  versions: {
    current: 'v3',
    currentLabel: 'v3 Current',
    previous: 'v2',
    previousLabel: 'v2 Previous',
    coreTag: 'v3.x',
  },
  keywords: [
    'mcpose',
    'MCP',
    'Model Context Protocol',
    'middleware',
    'proxy',
    'MCP gateway',
    'tool filtering',
    'observability',
    'audit',
    'policy',
    'consent',
    'governance',
    'TypeScript',
  ],
  creator: 'Amir Gorji',
} as const;
