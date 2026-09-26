import { highlight } from '@/lib/shiki';
import ExplorerClient from './explorer-client';
import { PRESETS, type PresetId } from './explorer-data';

export default async function Explorer() {
  const snippetEntries = await Promise.all(
    PRESETS.map(async (preset) => {
      const html = await highlight(preset.codeSnippet, 'typescript');
      return [preset.id, html] as const;
    }),
  );

  const highlightedSnippets = Object.fromEntries(snippetEntries) as Record<
    PresetId,
    string
  >;

  return <ExplorerClient highlightedSnippets={highlightedSnippets} />;
}
