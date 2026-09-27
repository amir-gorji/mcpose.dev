/* Invariants of the static export. Runs against out/ after a build.
   These assert the things a visual diff cannot: that the shipped bytes
   still carry the design's exact copy, that every link resolves, and that
   stub pages stay out of the index. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = new URL('../out/', import.meta.url).pathname;
const read = (rel) => readFileSync(join(OUT, rel), 'utf8');
const exists = (rel) => existsSync(join(OUT, rel));

const walk = async (dir) => {
  const entries = await readdir(join(OUT, dir), { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const rel = join(dir, entry.name);
      if (entry.isDirectory()) return walk(rel);
      return entry.name.endsWith('.html') ? [rel] : [];
    }),
  );
  return nested.flat();
};

/* The mock's own clipboard literals. */
const CLIPBOARD = {
  bash: [
    'npm install mcpose',
    'npm install @modelcontextprotocol/sdk@"^1.17.0"',
    'npm install @mcpose/audit',
  ].join('\n'),
  ts: [
    "import { createBackendClient, startProxy } from 'mcpose';",
    "import type { ToolMiddleware } from 'mcpose';",
    '',
    'const backend = await createBackendClient({',
    "  command: 'node',",
    "  args: ['/path/to/backend-server.mjs'],",
    '});',
    '',
    'const logging: ToolMiddleware = async (req, next) => {',
    '  console.error(`→ ${req.params.name}`);',
    '  const result = await next(req);',
    '  console.error(`← ${req.params.name} done`);',
    '  return result;',
    '};',
    '',
    'await startProxy(backend, {',
    "  name: 'my-proxy',",
    '  toolMiddleware: [logging],',
    '});',
  ].join('\n'),
  json: [
    '{',
    '  "mcpServers": {',
    '    "governed-search": {',
    '      "command": "npx",',
    '      "args": ["tsx", "/absolute/path/to/proxy.ts"]',
    '    }',
    '  }',
    '}',
  ].join('\n'),
};

const QUICK_START = 'docs/v3/getting-started/quick-start/';
const CONTENT = new URL('../content/docs/', import.meta.url).pathname;

/* Slugs of pages whose frontmatter still marks them stub. */
const stubSlugs = (() => {
  const found = [];
  const walkDir = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(full);
        continue;
      }
      if (!entry.name.endsWith('.mdx')) continue;
      const frontmatter =
        readFileSync(full, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      if (/^stub:\s*true$/m.test(frontmatter)) {
        found.push(full.replace(CONTENT, '').replace(/\.mdx$/, '/'));
      }
    }
  };
  walkDir(CONTENT);
  return found;
})();

test('static export emits every expected entry point', () => {
  for (const rel of [
    'index.html',
    'docs/v3/index.html',
    'docs/v2/index.html',
    `${QUICK_START}index.html`,
    'sitemap.xml',
    'robots.txt',
    '404.html',
    'opengraph-image',
    'pagefind/pagefind.js',
  ]) {
    assert.ok(exists(rel), `missing ${rel} in the static export`);
  }
});

test("code blocks carry the design's exact clipboard text", () => {
  const payload = read(`${QUICK_START}index.txt`);
  for (const [name, literal] of Object.entries(CLIPBOARD)) {
    const encoded = JSON.stringify(literal).slice(1, -1);
    assert.ok(
      payload.includes(encoded),
      `${name} block clipboard text drifted from the design`,
    );
  }
});

test('the install command is what the landing copy button writes', () => {
  const payload = read('index.txt');
  const matches =
    payload.match(/"text":"npm install mcpose @modelcontextprotocol\/sdk"/g) ??
    [];
  assert.ok(matches.length >= 1, 'expected the hero copy button');
});

test("docs headings keep the design's anchor ids", () => {
  const html = read(`${QUICK_START}index.html`);
  for (const id of [
    'prerequisites',
    'install',
    'wrap',
    'run',
    'routing',
    'next',
  ]) {
    assert.ok(html.includes(`id="${id}"`), `heading anchor #${id} is missing`);
    assert.ok(html.includes(`href="#${id}"`), `table of contents lost #${id}`);
  }
});

test('every internal link resolves to an exported page', async () => {
  const pages = await walk('.');
  const targets = new Set();
  for (const page of pages) {
    for (const [, href] of read(page).matchAll(/href="(\/[^"#]*)"/g))
      targets.add(href);
  }
  const unresolved = [...targets].filter((href) => {
    const path = href.replace(/^\/|\/$/g, '');
    if (path === '') return !exists('index.html');
    return (
      !exists(`${path}/index.html`) &&
      !exists(path) &&
      !exists(`${path}.html`)
    );
  });
  assert.deepEqual(
    unresolved,
    [],
    'internal links point at pages that were never exported',
  );
});

test('placeholder pages stay out of the index', () => {
  const sitemap = read('sitemap.xml');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, url]) => url,
  );
  assert.ok(listed.length > 0, 'sitemap is empty');
  const leaked = stubSlugs.filter((slug) =>
    listed.some((url) => url.includes(`/docs/${slug}`)),
  );
  assert.deepEqual(leaked, [], 'placeholder pages leaked into the sitemap');
  for (const slug of stubSlugs) {
    const html = read(`docs/${slug}index.html`);
    assert.ok(html.includes('noindex'), `${slug} must be noindex`);
    assert.ok(
      !html.includes('data-pagefind-body'),
      `${slug} must stay out of the search index`,
    );
  }
});

test('pages carry their structured data', () => {
  assert.ok(
    read('index.html').includes('SoftwareSourceCode'),
    'landing JSON-LD missing',
  );
  const docs = read(`${QUICK_START}index.html`);
  assert.ok(docs.includes('TechArticle'), 'docs article JSON-LD missing');
  assert.ok(docs.includes('BreadcrumbList'), 'docs breadcrumb JSON-LD missing');
});

test('the 404 page is not indexable', () => {
  const html = read('404.html');
  assert.ok(html.includes('noindex'), '404 must be noindex');
  assert.ok(!html.includes('rel="canonical"'), '404 must not self-canonicalize');
});

test('docs code blocks ship literal colours, not unmapped CSS variables', () => {
  const html = read(`${QUICK_START}index.html`);
  assert.ok(
    html.includes('style="color:#'),
    'shiki emitted no literal token colours on a docs page',
  );
  assert.ok(
    !html.includes('--shiki-'),
    'shiki fell back to --shiki-* custom properties, which no stylesheet in this repo maps',
  );
  assert.ok(
    !html.includes('icon="&lt;svg'),
    'fumadocs transformerIcon is stamping unused inline SVG onto <pre>',
  );
  assert.ok(
    read('index.html').includes('style="color:#'),
    'landing lost its highlighting',
  );
});

test('every docs page carries a social card', async () => {
  for (const rel of await walk('docs')) {
    const html = read(rel);
    assert.ok(html.includes('property="og:image"'), `${rel} emits no og:image`);
    assert.ok(
      html.includes('name="twitter:image"'),
      `${rel} emits no twitter:image`,
    );
  }
});

test('the extensionless opengraph route is typed for the CDN', () => {
  const headers = read('_headers');
  assert.match(
    headers,
    /^\/opengraph-image$/m,
    '_headers has no /opengraph-image rule',
  );
  assert.match(
    headers,
    /Content-Type:\s*image\/png/i,
    'the rule sets no PNG content type',
  );
  const magic = readFileSync(join(OUT, 'opengraph-image'))
    .subarray(0, 8)
    .toString('hex');
  assert.equal(magic, '89504e470d0a1a0a', 'opengraph-image is not a PNG');
});

test('headings stay addressable: anchors are indexed and rendered', async () => {
  const { gunzipSync } = await import('node:zlib');
  const dir = join(OUT, 'pagefind/fragment');
  const fragments = readdirSync(dir).filter((f) => f.endsWith('.pf_fragment'));
  assert.ok(fragments.length > 0, 'pagefind emitted no fragments');

  const GZIP_MAGIC = Buffer.from([0x1f, 0x8b]);
  let checked = 0;

  for (const file of fragments) {
    const raw = readFileSync(join(dir, file));
    const body = gunzipSync(
      raw.subarray(raw.indexOf(GZIP_MAGIC)),
    ).toString('utf8');
    const doc = JSON.parse(body.slice(body.indexOf('{')));
    if (!doc.url.startsWith('/docs/')) continue;
    const page = read(join(doc.url.replace(/^\//, ''), 'index.html'));
    for (const anchor of doc.anchors) {
      if (!/^h\d$/i.test(anchor.element)) continue;
      assert.ok(
        page.includes(`id="${anchor.id}"`),
        `${doc.url} indexes anchor #${anchor.id} that the page does not render`,
      );
      checked += 1;
    }
  }

  assert.ok(
    checked > 100,
    `only ${checked} heading anchors cross-checked; expected 100+`,
  );
});

test('the motion convention is in the shipped CSS, and reduced-motion is respected', async () => {
  const cssDir = join(OUT, '_next/static/chunks');
  const css = readdirSync(cssDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(cssDir, f), 'utf8'))
    .join('\n');
  assert.match(
    css,
    /prefers-reduced-motion/,
    'no reduced-motion block reached the build',
  );
});

test('every internal href is already canonical', async () => {
  const pages = await walk('.');
  for (const rel of pages) {
    for (const [, href] of read(rel).matchAll(/href="(\/[^"]*)"/g)) {
      const path = href.split('#')[0];
      if (path === '' || /\.[a-z0-9]+$/i.test(path)) continue;
      assert.ok(
        path.endsWith('/'),
        `${rel} links to ${href}, which redirects under trailingSlash: true`,
      );
    }
  }
});

test('the preview Lighthouse gates differ from production only where they must', () => {
  const ROOT = new URL('../', import.meta.url).pathname;
  const load = (name) =>
    JSON.parse(readFileSync(join(ROOT, name), 'utf8')).ci.assert.assertions;
  const prod = load('.lighthouserc.json');
  const preview = load('.lighthouserc.preview.json');

  const allowed = new Set(['categories:seo']);
  const differing = [
    ...new Set([...Object.keys(prod), ...Object.keys(preview)]),
  ].filter(
    (key) => JSON.stringify(prod[key]) !== JSON.stringify(preview[key]),
  );

  assert.deepEqual(
    differing.filter((key) => !allowed.has(key)),
    [],
    'a preview Lighthouse gate drifted from production; preview must not be the looser environment',
  );
});

test('every documentation article has exactly one visible title', async () => {
  for (const file of await walk('docs')) {
    const html = read(file);
    if (!html.includes('data-pagefind-body')) continue;
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, file);
  }
});
