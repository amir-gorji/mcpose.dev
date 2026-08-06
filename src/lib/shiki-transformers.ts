import type { ShikiTransformer } from 'shiki';

/* Copy strategies — the mock's clipboard strings differ from the rendered
   code: the bash block copies without comment/blank lines, the ts block
   without its full-line comments. The strategy is declared in the fence
   meta (copy="commands" | "strip-line-comments" | "full" | "none") and the
   computed text lands on the <pre> as data-copy for the CopyButton. */

type CopyStrategy = 'commands' | 'strip-line-comments' | 'full' | 'none';

const metaValue = (meta: string, key: string): string | undefined => {
  const match = meta.match(new RegExp(`${key}="([^"]*)"`));
  return match?.[1];
};

const copyText = (source: string, strategy: CopyStrategy): string | null => {
  switch (strategy) {
    case 'commands':
      return source
        .split('\n')
        .filter((line) => line.trim() !== '' && !line.trim().startsWith('#'))
        .join('\n');
    case 'strip-line-comments':
      return source
        .split('\n')
        .filter((line) => !line.trim().startsWith('//'))
        .join('\n');
    case 'full':
      return source;
    case 'none':
      return null;
  }
};

/* Attaches data-copy and data-title (from the fence meta) to the <pre>. */
export const transformerCopyText = (): ShikiTransformer => ({
  name: 'nocturne:copy-text',
  pre(node) {
    const meta = this.options.meta?.__raw ?? '';
    const title = metaValue(meta, 'title');
    if (title !== undefined) node.properties['data-title'] = title;
    const strategy = (metaValue(meta, 'copy') ?? 'full') as CopyStrategy;
    const text = copyText(this.source, strategy);
    if (text !== null) node.properties['data-copy'] = text;
  },
});

/* The bash grammar leaves `npm install <args>` arguments unscoped, but the
   mock tints the package specs accent-2-500. Recolor tokens that sit after
   "npm install " on their line. */
const STRING_COLOR = '#9690c9'; // --color-accent-2-500

export const transformerBashPackages = (): ShikiTransformer => ({
  name: 'nocturne:bash-packages',
  tokens(lines) {
    if (this.options.lang !== 'bash' && this.options.lang !== 'sh') return;
    for (const line of lines) {
      const text = line.map((token) => token.content).join('');
      const match = text.match(/^(\s*npm\s+install\s+)/);
      if (!match) continue;
      const argsStart = match[1].length;
      let offset = 0;
      for (const token of line) {
        const start = offset;
        offset += token.content.length;
        if (offset <= argsStart) continue;
        if (start >= argsStart) {
          token.color = STRING_COLOR;
        } else {
          /* Token straddles the boundary; recolor is close enough only if
             it carries the args. Split is not supported here, so guard: the
             bash grammar tokenizes "npm", "install", and args separately,
             which keeps this branch unreachable in practice. */
          token.color = token.color ?? STRING_COLOR;
        }
      }
    }
  },
});
