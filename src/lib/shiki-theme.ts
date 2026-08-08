import type { ThemeRegistration } from 'shiki';

/* The nocturne code palette, mapped from the mock's hand-tinted spans:
   base neutral-200, comments neutral-600, keywords accent-400, function
   names + JSON keys accent-200, strings accent-2-500, types accent-300.
   Deliberately minimal: anything unmatched falls to the base foreground,
   exactly like the mock. */
const palette = {
  surface: '#232532', // --color-surface
  base: '#e4e7f5', // --color-neutral-200
  comment: '#8a8ea2', // --text-muted (neutral-600 failed AA at 12.5px on the code surface)
  keyword: '#b5abfc', // --color-accent-400
  fn: '#e7e5fe', // --color-accent-200
  string: '#9690c9', // --color-accent-2-500
  type: '#d2cefd', // --color-accent-300
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
    /* The mock renders template literals entirely untinted (base). */
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
    /* JSON keys read as accent-200 (function tint); values stay strings. */
    {
      scope: ['support.type.property-name.json'],
      settings: { foreground: palette.fn },
    },
  ],
};
