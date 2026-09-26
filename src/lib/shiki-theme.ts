import type { ThemeRegistration } from 'shiki';

/* mcpose v3 code palette matching D01 foundations:
   code-bg: #14241D, code-text: #E4EFDF, code-muted: #A7BBA9
   Accents: #9FB9FF, #C3D7FF, #A7D4B6 */
const palette = {
  surface: '#14241D',
  base: '#E4EFDF',
  comment: '#A7BBA9',
  keyword: '#9FB9FF',
  fn: '#C3D7FF',
  string: '#A7D4B6',
  type: '#C3D7FF',
} as const;

export const nocturneTheme: ThemeRegistration = {
  name: 'nocturne',
  type: 'dark',
  colors: {
    'editor.background': palette.surface,
    'editor.foreground': palette.base,
  },
  settings: [
    {
      settings: { foreground: palette.base, background: palette.surface },
    },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: palette.comment },
    },
    {
      scope: [
        'keyword.control',
        'keyword.operator.expression',
        'keyword.operator.new',
        'storage.type',
        'storage.modifier',
        'storage.type.function.arrow',
        'variable.language.this',
      ],
      settings: { foreground: palette.keyword },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'variable.function',
        'meta.function-call entity.name.function',
      ],
      settings: { foreground: palette.fn },
    },
    {
      scope: ['string', 'punctuation.definition.string'],
      settings: { foreground: palette.string },
    },
    {
      scope: [
        'string.template',
        'string.template punctuation.definition.string',
        'punctuation.definition.template-expression',
        'meta.template.expression',
      ],
      settings: { foreground: palette.base },
    },
    {
      scope: ['entity.name.type', 'support.type'],
      settings: { foreground: palette.type },
    },
    {
      scope: ['support.type.property-name.json'],
      settings: { foreground: palette.fn },
    },
  ],
};
