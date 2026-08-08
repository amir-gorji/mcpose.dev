import { highlight } from '@/lib/shiki';
import { USE_CASE_LIST_TOOLS, USE_CASE_OAUTH, USE_CASE_PII } from '@/lib/snippets';

import UseCaseTabs, { type UseCase } from './use-case-tabs';
import styles from './use-cases.module.css';

const CASES = [
  {
    id: 'pii',
    label: 'Keep PII out of the log',
    caption:
      'The origin use case: every upstream response is scrubbed before it reaches the LLM, and before it reaches the audit trail. Ordering is the whole point — the redaction middleware is listed first, so audit never sees raw data.',
    href: '/docs/recipes/pii-redaction-audit/',
    source: USE_CASE_PII,
  },
  {
    id: 'list-tools',
    label: 'Show each caller a different toolset',
    caption:
      'The tool list is a response like any other, so it goes through middleware too. A caller without the role never learns the tool exists, and a blocked call still produces an audited rejection rather than a silent failure.',
    href: '/docs/recipes/list-tools-rewriting/',
    source: USE_CASE_LIST_TOOLS,
  },
  {
    id: 'oauth',
    label: "Proxy an upstream you don't own",
    caption:
      'Upstream servers often sit behind their own auth. mcpose terminates it, so the credentials live in one place you control and the LLM client never handles them.',
    href: '/docs/recipes/oauth-upstream/',
    source: USE_CASE_OAUTH,
  },
] as const;

const UseCases = async () => {
  const cases: UseCase[] = await Promise.all(
    CASES.map(async ({ source, ...rest }) => ({
      ...rest,
      html: await highlight(source, 'typescript'),
    })),
  );

  return (
    <>
      <div className={`kicker ${styles.kicker}`}>What it looks like</div>
      <h2 className={styles.heading}>Three shapes people actually ship.</h2>
      <p className={styles.lede}>
        Each one is a recipe in the docs, and each one is the same primitive: a function that sees
        the request on the way in and the response on the way out.
      </p>
      <div className={styles.tabs}>
        <UseCaseTabs cases={cases} />
      </div>
    </>
  );
};

export default UseCases;
