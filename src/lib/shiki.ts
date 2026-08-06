import { createHighlighter, type Highlighter } from 'shiki';
import { nocturneTheme } from './shiki-theme';
import { transformerBashPackages } from './shiki-transformers';

/* Module-level singleton — under static export this only ever runs at
   build time (RSC render). */
let highlighterPromise: Promise<Highlighter> | undefined;

const getHighlighter = (): Promise<Highlighter> => {
  highlighterPromise ??= createHighlighter({
    themes: [nocturneTheme],
    langs: ['typescript', 'bash', 'json'],
  });
  return highlighterPromise;
};

export const highlight = async (
  code: string,
  lang: 'typescript' | 'bash' | 'json',
): Promise<string> => {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    theme: 'nocturne',
    transformers: [transformerBashPackages()],
  });
};
