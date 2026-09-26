import { PUBLISHED_V2, PUBLISHED_V3 } from './site';

export type DocsVersionId = 'v3' | 'v2';

export interface VersionInfo {
  readonly id: DocsVersionId;
  readonly label: string;
  readonly status: 'Current' | 'Previous';
  readonly basePath: string;
  readonly sourceTag: string;
  readonly sourceCommit: string;
  readonly packages: Record<string, string>;
}

export const DOCS_VERSIONS: Record<DocsVersionId, VersionInfo> = {
  v3: {
    id: 'v3',
    label: 'v3',
    status: 'Current',
    basePath: '/docs/v3',
    sourceTag: 'v3.0.0',
    sourceCommit: 'HEAD',
    packages: {
      mcpose: PUBLISHED_V3.core,
      '@mcpose/policy': PUBLISHED_V3.policy,
      '@mcpose/consent': PUBLISHED_V3.consent,
      '@mcpose/audit': PUBLISHED_V3.audit,
      '@mcpose/testing': PUBLISHED_V3.testing,
      '@mcpose/otel': PUBLISHED_V3.otel,
      '@mcpose/store-redis': PUBLISHED_V3.storeRedis,
      '@mcpose/store-postgres': PUBLISHED_V3.storePostgres,
    },
  },
  v2: {
    id: 'v2',
    label: 'v2',
    status: 'Previous',
    basePath: '/docs/v2',
    sourceTag: 'v2.1.1',
    sourceCommit: 'b499195f56295f85cbfdf505911dc4ae7429828c',
    packages: {
      mcpose: PUBLISHED_V2.core,
      '@mcpose/audit': PUBLISHED_V2.audit,
      '@mcpose/testing': PUBLISHED_V2.testing,
    },
  },
};

export interface UnavailableTopicInfo {
  readonly topicId: string;
  readonly title: string;
  readonly message: 'This topic starts in v3' | 'This topic is not available in v2';
  readonly description: string;
  readonly v3Url: string;
  readonly fallbackUrl: string;
}

export const UNAVAILABLE_TOPICS_V2: Record<string, UnavailableTopicInfo> = {
  'concepts-mesh': {
    topicId: 'concepts-mesh',
    title: 'Mesh (multi-server composition)',
    message: 'This topic starts in v3',
    description:
      'Connecting named upstreams and routing calls across multiple MCP servers through one shared proxy was introduced in mcpose v3.',
    v3Url: '/docs/v3/concepts/mesh/',
    fallbackUrl: '/docs/v2/concepts/proxy-model/',
  },
  'packages-policy': {
    topicId: 'packages-policy',
    title: '@mcpose/policy',
    message: 'This topic starts in v3',
    description:
      'The @mcpose/policy package providing deny-by-default role rules, sensitivity tiers, and call budgets was introduced in v3. In v2, tool hiding is configured via the hiddenTools option in core.',
    v3Url: '/docs/v3/packages/policy/',
    fallbackUrl: '/docs/v2/packages/mcpose/',
  },
  'packages-consent': {
    topicId: 'packages-consent',
    title: '@mcpose/consent',
    message: 'This topic starts in v3',
    description:
      'The @mcpose/consent package for fail-closed GDPR/CCPA host-resolved consent was introduced in v3.',
    v3Url: '/docs/v3/packages/consent/',
    fallbackUrl: '/docs/v2/packages/mcpose/',
  },
  'packages-otel': {
    topicId: 'packages-otel',
    title: '@mcpose/otel',
    message: 'This topic starts in v3',
    description:
      'The dedicated @mcpose/otel adapter was introduced in v3. V2 provides the core onTelemetry hook for connecting OpenTelemetry or custom tracing sinks.',
    v3Url: '/docs/v3/packages/otel/',
    fallbackUrl: '/docs/v2/packages/mcpose/',
  },
  'packages-store-redis': {
    topicId: 'packages-store-redis',
    title: '@mcpose/store-redis',
    message: 'This topic starts in v3',
    description:
      'The @mcpose/store-redis package was introduced in v3. V2 provides an in-memory event store and the PersistentEventStore interface in core.',
    v3Url: '/docs/v3/packages/store-redis/',
    fallbackUrl: '/docs/v2/packages/mcpose/',
  },
  'packages-store-postgres': {
    topicId: 'packages-store-postgres',
    title: '@mcpose/store-postgres',
    message: 'This topic starts in v3',
    description:
      'The @mcpose/store-postgres package was introduced in v3. V2 provides an in-memory event store and the PersistentEventStore interface in core.',
    v3Url: '/docs/v3/packages/store-postgres/',
    fallbackUrl: '/docs/v2/packages/mcpose/',
  },
  'migration-from-v2': {
    topicId: 'migration-from-v2',
    title: 'Migration from v2 to v3',
    message: 'This topic starts in v3',
    description:
      'The migration guide details breaking changes and upgrade steps when moving from v2 to v3.',
    v3Url: '/docs/v3/migration/from-v2/',
    fallbackUrl: '/docs/v2/',
  },
  'project-roadmap': {
    topicId: 'project-roadmap',
    title: 'Roadmap',
    message: 'This topic is not available in v2',
    description:
      'The active project roadmap reflects upcoming goals for the library and is not maintained as historical v2 documentation.',
    v3Url: '/docs/v3/project/roadmap/',
    fallbackUrl: '/docs/v2/packages/mcpose/',
  },
};

/* Maps topic slug path to stable topicId */
const SLUG_TO_TOPIC: Record<string, string> = {
  '': 'index',
  'getting-started/introduction': 'getting-started-introduction',
  'getting-started/install': 'getting-started-install',
  'getting-started/quick-start': 'getting-started-quick-start',
  'getting-started/examples': 'getting-started-examples',
  'getting-started/alternatives': 'getting-started-alternatives',
  'concepts/proxy-model': 'concepts-proxy-model',
  'concepts/middleware-model': 'concepts-middleware-model',
  'concepts/identity-and-sessions': 'concepts-identity-and-sessions',
  'concepts/rejection-reasons': 'concepts-rejection-reasons',
  'concepts/mesh': 'concepts-mesh',
  'packages/mcpose': 'packages-mcpose',
  'packages/audit': 'packages-audit',
  'packages/testing': 'packages-testing',
  'packages/policy': 'packages-policy',
  'packages/consent': 'packages-consent',
  'packages/otel': 'packages-otel',
  'packages/store-redis': 'packages-store-redis',
  'packages/store-postgres': 'packages-store-postgres',
  'recipes/transform-responses': 'recipes-transform-responses',
  'recipes/list-tools-rewriting': 'recipes-list-tools-rewriting',
  'recipes/pii-redaction-audit': 'recipes-pii-redaction-audit',
  'recipes/oauth-upstream': 'recipes-oauth-upstream',
  'migration/from-v2': 'migration-from-v2',
  'project/security': 'project-security',
  'project/roadmap': 'project-roadmap',
  'project/contributing': 'project-contributing',
  'project/adrs': 'project-adrs',
  'project/changelog': 'project-changelog',
  'project/removing-mcpose': 'project-removing-mcpose',
};

export const getTopicIdFromPath = (slugPath: string): string | null => {
  const normalized = slugPath.replace(/^\/+|\/+$/g, '');
  return SLUG_TO_TOPIC[normalized] ?? null;
};

export const getCounterpartUrl = (
  currentVersion: DocsVersionId,
  currentPathname: string,
): string => {
  const targetVersion: DocsVersionId = currentVersion === 'v3' ? 'v2' : 'v3';

  // Normalize path by stripping /docs/v3/ or /docs/v2/
  const regex = /^\/docs\/(v3|v2)(?:\/(.*))?$/;
  const match = currentPathname.match(regex);
  if (!match) return `/docs/${targetVersion}/`;

  const slug = (match[2] ?? '').replace(/\/+$/, '');
  const topicId = getTopicIdFromPath(slug);

  if (targetVersion === 'v2') {
    // Check if topic is known unavailable in v2
    if (topicId && UNAVAILABLE_TOPICS_V2[topicId]) {
      return `/docs/v2/unavailable/${topicId}/`;
    }
  }

  // If going to v3 from an unavailable page:
  if (currentPathname.includes('/docs/v2/unavailable/')) {
    const unavTopicId = currentPathname.split('/docs/v2/unavailable/')[1]?.replace(/\/+$/, '');
    if (unavTopicId && UNAVAILABLE_TOPICS_V2[unavTopicId]) {
      return UNAVAILABLE_TOPICS_V2[unavTopicId].v3Url;
    }
    return '/docs/v3/';
  }

  return slug ? `/docs/${targetVersion}/${slug}/` : `/docs/${targetVersion}/`;
};
