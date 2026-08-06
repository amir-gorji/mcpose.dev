import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  globalIgnores(['.next/**', 'out/**', '.source/**', 'node_modules/**', 'design_handoff/**']),
  ...nextCoreWebVitals,
  ...nextTypescript,
]);
