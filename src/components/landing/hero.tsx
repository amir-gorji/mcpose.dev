import { Fragment } from 'react';
import CodeBlockFrame from '@/components/code-block';
import InstallRow from '@/components/install-row';
import { highlight } from '@/lib/shiki';
import { SITE } from '@/lib/site';
import { HERO_SNIPPET } from '@/lib/snippets';
import styles from './hero.module.css';

const META_ITEMS = [
  `${SITE.versions.core} on npm`,
  'MIT',
  'Node 20+',
  'ESM, types included',
  'semver-disciplined',
] as const;

const Hero = async () => {
  const html = await highlight(HERO_SNIPPET, 'typescript');

  return (
    <div className={styles.grid}>
      <div>
        <div className={`kicker ${styles.kicker}`}>
          Transparent MCP proxy · TypeScript
        </div>
        <h1 className={styles.heading}>
          The audit and governance layer for MCP.
        </h1>
        <p className={styles.lede}>
          Drop mcpose between any LLM client and any MCP server. Intercept,
          transform, and govern every tool call through composable onion
          middleware — and log it in a tamper-evident, compliance-grade audit
          trail. Nothing upstream changes.
        </p>
        <div className={styles.installRow}>
          <InstallRow variant="hero" />
        </div>
        <div className={styles.buttonRow}>
          <a className="btn btn-primary" href="/docs/getting-started/quick-start/">
            Get started →
          </a>
          <a className="btn btn-secondary" href={SITE.github} rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className={styles.metaRow}>
          {META_ITEMS.map((item, index) => (
            <Fragment key={item}>
              {index > 0 ? <span className={styles.metaDot}>·</span> : null}
              <span>{item}</span>
            </Fragment>
          ))}
        </div>
      </div>
      <div className={styles.codeColumn}>
        <CodeBlockFrame
          title="proxy.ts"
          action={<span className={styles.codeLang}>TypeScript</span>}
          lineHeight={1.7}
          elevation="md"
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </CodeBlockFrame>
      </div>
    </div>
  );
};

export default Hero;
