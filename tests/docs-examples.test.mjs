import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

// Compile the actual published examples, not a second copy maintained by tests.
test('v3 examples compile against the released packages', () => {
  const root = resolve('content/docs/v3');
  const files = new Map();
  for (const relative of readdirSync(root, { recursive: true })) {
    if (!relative.endsWith('.mdx')) continue;
    const content = readFileSync(resolve(root, relative), 'utf8');
    for (const [index, match] of [...content.matchAll(/```ts[^\n]*\n([\s\S]*?)```/g)].entries()) {
      if (!match[0].split('\n')[0].includes('check')) continue;
      files.set(resolve(`tests/doc-${relative.replaceAll('/', '-')}-${index}.mts`), match[1]);
    }
  }
  assert.ok(files.size >= 8, 'expected checked examples for the released APIs');
  const options = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, types: ['node'] };
  const host = ts.createCompilerHost(options);
  const original = host.getSourceFile;
  host.getSourceFile = (file, languageVersion, ...rest) => files.has(file)
    ? ts.createSourceFile(file, files.get(file), languageVersion)
    : original(file, languageVersion, ...rest);
  const program = ts.createProgram([...files.keys()], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => process.cwd(), getCanonicalFileName: x => x, getNewLine: () => '\n',
  }));
});
